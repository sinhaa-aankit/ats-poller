#!/usr/bin/env node
'use strict';

// ---------------------------------------------------------------------------
// BOARD DISCOVERY
//
// None of the four ATS platforms expose a "list all boards" endpoint - every
// API is GET /<token>, so you have to already know the token. That makes the
// company list in config.js a hard ceiling on coverage: the poller can only
// find jobs at companies you have already added.
//
// This closes that gap the only way available - guess tokens against all four
// platforms and keep whatever comes back non-empty.
//
//   node discover.js                 probe every token in candidates.txt
//   node discover.js acme foo bar    probe just these tokens
//
// Two phases, because a full Greenhouse fetch with job descriptions is heavy:
//   1. cheap liveness probe across every candidate
//   2. full fetch + score, only for boards that came back alive
//
// Output ends with paste-ready config.js lines. Nothing is written to disk and
// seen.json is never touched - this is read-only reconnaissance.
// ---------------------------------------------------------------------------

const fs = require('fs');
const path = require('path');
const config = require('./config');
const { isRelevant, score } = require('./index');

const CANDIDATE_FILE = path.join(__dirname, 'candidates.txt');
const CONCURRENCY = 8;
const TIMEOUT_MS = 15000;

const strip = (h) => String(h).replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ');
const decode = (s) => String(s)
  .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&')
  .replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&nbsp;/g, ' ')
  .replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ');

const ATS = {
  greenhouse: {
    probe: (t) => 'https://boards-api.greenhouse.io/v1/boards/' + t + '/jobs',
    full: (t) => 'https://boards-api.greenhouse.io/v1/boards/' + t + '/jobs?content=true',
    count: (d) => (d.jobs || []).length,
    map: (d) => (d.jobs || []).map((j) => ({
      title: j.title,
      location: (j.location && j.location.name) || '',
      content: decode(j.content || ''),
    })),
  },
  lever: {
    probe: (t) => 'https://api.lever.co/v0/postings/' + t + '?mode=json',
    full: (t) => 'https://api.lever.co/v0/postings/' + t + '?mode=json',
    count: (d) => (Array.isArray(d) ? d.length : 0),
    map: (d) => (d || []).map((j) => ({
      title: j.text,
      location: (j.categories && j.categories.location) || '',
      content: [j.descriptionPlain]
        .concat((j.lists || []).map((l) => strip(l.content))).join('\n'),
    })),
  },
  ashby: {
    probe: (t) => 'https://api.ashbyhq.com/posting-api/job-board/' + t,
    full: (t) => 'https://api.ashbyhq.com/posting-api/job-board/' + t + '?includeCompensation=true',
    count: (d) => (d.jobs || []).length,
    map: (d) => (d.jobs || []).map((j) => ({
      title: j.title,
      location: j.location || '',
      content: strip(j.descriptionHtml || j.descriptionPlain || ''),
    })),
  },
  // SmartRecruiters is the odd one out twice over:
  //   - it answers 200 with an empty list for a company that does not exist,
  //     so totalFound is the liveness test, not the HTTP status
  //   - descriptions need one request per posting, so it needs fetchAll()
  //     rather than the single-URL + map() the others use
  smartrecruiters: {
    probe: (t) => 'https://api.smartrecruiters.com/v1/companies/' + t + '/postings?limit=1',
    count: (d) => d.totalFound || 0,
    fetchAll: async (t) => {
      const list = await getJSON(
        'https://api.smartrecruiters.com/v1/companies/' + t + '/postings?limit=100');
      const titleRe = new RegExp(config.roleKeywords.join('|'), 'i');
      const keep = (list.content || [])
        .map((p) => ({
          id: p.id,
          title: p.name,
          location: srLocation(p.location),
          content: '',
        }))
        .filter((r) => titleRe.test(r.title));
      for (const r of keep) {
        try {
          const d = await getJSON(
            'https://api.smartrecruiters.com/v1/companies/' + t + '/postings/' + r.id);
          const sec = (d.jobAd && d.jobAd.sections) || {};
          r.content = strip(Object.keys(sec)
            .map((k) => (sec[k] && sec[k].text) || '').join(' '));
        } catch (e) { /* keep it, just unscored on content */ }
        await new Promise((res) => setTimeout(res, 120));
      }
      return keep;
    },
  },
};

// SmartRecruiters returns India as country code "in".
function srLocation(loc) {
  if (!loc) return '';
  const country = loc.country === 'in' ? 'India' : (loc.country || '');
  return [loc.city, loc.region, country].filter(Boolean).join(', ');
}

async function getJSON(url) {
  const res = await fetch(url, {
    headers: { 'User-Agent': 'ats-poller-discover/1.0' },
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });
  if (!res.ok) throw new Error('HTTP ' + res.status);
  return res.json();
}

// Bounded-concurrency map. Enough to keep ~900 probes tolerable, small enough
// to stay polite to APIs that are doing us a favour by being public.
async function pool(items, limit, fn) {
  const out = [];
  let i = 0;
  const workers = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (i < items.length) {
      const idx = i;
      i += 1;
      out[idx] = await fn(items[idx], idx);
    }
  });
  await Promise.all(workers);
  return out;
}

function loadCandidates() {
  const argv = process.argv.slice(2).filter((a) => !a.startsWith('-'));
  if (argv.length) return argv;
  if (!fs.existsSync(CANDIDATE_FILE)) {
    console.error('No candidates.txt found at ' + CANDIDATE_FILE);
    process.exit(1);
  }
  return fs.readFileSync(CANDIDATE_FILE, 'utf8')
    .split('\n')
    .map((l) => l.replace(/#.*$/, '').trim())
    .filter(Boolean);
}

const STATE_FILE = path.join(__dirname, '.discover-state.json');

function loadState() {
  try { return JSON.parse(fs.readFileSync(STATE_FILE, 'utf8')); } catch (e) { return {}; }
}

// Merge, never clobber - index.js keeps lastRun/adopted in this same file.
function saveState(patch) {
  fs.writeFileSync(STATE_FILE, JSON.stringify(Object.assign(loadState(), patch)));
}

// Stable 0..n-1 slot for a token so dead-token retries spread evenly across
// days. Without this every token marked dead on the same sweep would come due
// again on the same day, which is the thundering herd we are avoiding.
function slotFor(key, n) {
  let h = 0;
  for (let i = 0; i < key.length; i += 1) h = ((h * 31) + key.charCodeAt(i)) >>> 0;
  return h % n;
}

const EXISTING = new Set();       // "platform:token"
const EXISTING_TOKENS = new Set(); // token on ANY platform
[['greenhouse', config.greenhouse], ['lever', config.lever], ['ashby', config.ashby],
  ['smartrecruiters', config.smartrecruiters || []]]
  .forEach(([key, arr]) => arr.forEach((b) => {
    EXISTING.add(key + ':' + b.token);
    EXISTING_TOKENS.add(b.token);
  }));

// Writes confirmed new boards straight into config.js. Names are the token as
// a placeholder - a human renames them later. Inserts before each array's
// closing bracket, one array at a time so the offsets stay valid.
function adoptIntoConfig(rows) {
  const file = path.join(__dirname, 'config.js');
  let src = fs.readFileSync(file, 'utf8');
  const stamp = new Date().toISOString().slice(0, 10);
  let added = 0;

  for (const ats of Object.keys(ATS)) {
    const mine = rows.filter((b) => b.ats === ats);
    if (!mine.length) continue;
    const open = src.indexOf('\n  ' + ats + ': [');
    if (open < 0) { console.error('  ! no ' + ats + ' array in config.js, skipped'); continue; }
    const close = src.indexOf('\n  ],', open);
    if (close < 0) { console.error('  ! ' + ats + ' array looks malformed, skipped'); continue; }
    const block = '\n    // Auto-adopted by discover.js on ' + stamp
      + '. Names are placeholders.\n'
      + mine.map((b) => {
        const note = b.india ? '  // ' + b.india + ' India backend' : '';
        return "    { token: '" + b.token + "', name: '" + b.token
          + "', verified: true }," + note;
      }).join('\n');
    src = src.slice(0, close) + block + src.slice(close);
    added += mine.length;
  }

  fs.writeFileSync(file, src);
  return added;
}

// Bengaluru or India-remote, matching the poller's own intent.
const INDIA = /bengaluru|bangalore|^india|[,\s]india|remote\s*[-,]?\s*india/i;

async function discover(opts = {}) {
  const adopt = opts.adopt || process.argv.includes('--adopt');
  const tokens = [...new Set(opts.tokens || loadCandidates())];
  // Skip anything already in config.js - index.js polls those every run, so
  // re-probing them here is pure duplication.
  //
  // Then rate-limit the misses. ~92% of probes are 404s against the same dead
  // tokens every time, which is both wasted and the thing that makes this look
  // like enumeration rather than reading. Each dead token is retried once every
  // deadRetryDays, staggered by a hash of its name so the retries spread evenly
  // across days instead of all landing together.
  const state = loadState();
  const retryDays = Math.max(1, opts.deadRetryDays || config.deadRetryDays || 7);
  const daySlot = Math.floor(Date.now() / 86400000) % retryDays;
  const skipped = { inConfig: 0, restingDead: 0 };

  const requests = [];
  tokens.forEach((token) => {
    Object.keys(ATS).forEach((ats) => {
      const key = ats + ':' + token;
      if (EXISTING.has(key)) { skipped.inConfig += 1; return; }
      if (state.dead && state.dead[key] !== undefined && slotFor(key, retryDays) !== daySlot) {
        skipped.restingDead += 1;
        return;
      }
      requests.push({ token, ats });
    });
  });

  console.log('Probing ' + requests.length + ' of ' + (tokens.length * Object.keys(ATS).length)
    + ' token/platform pairs, ' + CONCURRENCY + ' at a time.');
  console.log('  skipped ' + skipped.inConfig + ' already in config, '
    + skipped.restingDead + ' known-dead not due for retry (every ' + retryDays + 'd)\n');

  // --- phase 1: liveness ---------------------------------------------------
  let done = 0;
  let throttled = false;
  const live = [];
  const dead = Object.assign({}, state.dead || {});
  const today = new Date().toISOString().slice(0, 10);

  await pool(requests, CONCURRENCY, async ({ token, ats }) => {
    const key = ats + ':' + token;
    if (throttled) return;
    try {
      const n = ATS[ats].count(await getJSON(ATS[ats].probe(token)));
      if (n > 0) {
        delete dead[key];
        live.push({ token, ats, total: n });
        const dup = EXISTING.has(key);
        console.log('  LIVE  ' + ats.padEnd(10) + ' ' + token.padEnd(22)
          + String(n).padStart(4) + ' jobs' + (dup ? '   (already in config)' : ''));
      } else {
        dead[key] = today;   // 200 with an empty list, e.g. SmartRecruiters
      }
    } catch (e) {
      // Back off immediately if we are being rate-limited or refused. Better to
      // stop early than to keep hammering and earn a longer ban.
      if (/\b(429|403)\b/.test(e.message)) {
        if (!throttled) console.log('  ! ' + e.message + ' from ' + ats
          + ' - backing off, discovery will resume next run');
        throttled = true;
        return;
      }
      dead[key] = today;
    }
    done += 1;
    if (done % 150 === 0) console.log('  ...' + done + '/' + requests.length + ' probed');
  });

  saveState({ dead });

  console.log('\nPhase 1: ' + live.length + ' live boards from ' + tokens.length + ' tokens.');
  // Three filters, every one of which exists to stop the same job being
  // reported twice under different ids:
  //   - already polled on this platform
  //   - already polled on ANOTHER platform (smartrecruiters:netskope looks new
  //     when greenhouse:netskope is already in config)
  //   - live on two platforms within this same sweep: keep the bigger board
  const byToken = new Map();
  live
    .filter((b) => !EXISTING.has(b.ats + ':' + b.token))
    .filter((b) => !EXISTING_TOKENS.has(b.token))
    .forEach((b) => {
      const prev = byToken.get(b.token);
      if (!prev || b.total > prev.total) byToken.set(b.token, b);
    });
  const fresh = [...byToken.values()];

  if (!fresh.length) {
    console.log('Nothing new - every live board is already in config.js.');
    return { live: live.length, fresh: 0, adopted: 0 };
  }
  console.log(fresh.length + ' are new. Scoring them...\n');

  // --- phase 2: score the new ones -----------------------------------------
  await pool(fresh, CONCURRENCY, async (b) => {
    try {
      const spec = ATS[b.ats];
      const postings = spec.fetchAll
        ? await spec.fetchAll(b.token)
        : spec.map(await getJSON(spec.full(b.token)));
      const relevant = postings.filter(isRelevant)
        .filter((j) => INDIA.test(j.location) || !j.location.trim());
      b.india = relevant.length;
      b.clearing = relevant.map((j) => ({ j, s: score(j).total }))
        .filter((r) => r.s >= config.minScore)
        .sort((a, c) => c.s - a.s);
    } catch (e) {
      b.error = e.message;
      b.india = 0;
      b.clearing = [];
    }
  });

  const withRoles = fresh.filter((b) => b.clearing.length)
    .sort((a, b) => b.clearing.length - a.clearing.length);
  const empty = fresh.filter((b) => !b.clearing.length);

  if (withRoles.length) {
    console.log('='.repeat(72));
    console.log('BOARDS WITH ROLES CLEARING minScore ' + config.minScore + ' RIGHT NOW');
    console.log('='.repeat(72));
    withRoles.forEach((b) => {
      console.log('\n' + b.ats + ': ' + b.token + '  -  ' + b.total + ' jobs, '
        + b.india + ' India backend, ' + b.clearing.length + ' clearing');
      b.clearing.slice(0, 5).forEach((r) => {
        console.log('    ' + String(r.s).padStart(3) + ' pts  ' + r.j.title
          + '  [' + r.j.location + ']');
      });
      if (b.clearing.length > 5) {
        console.log('    ... and ' + (b.clearing.length - 5) + ' more');
      }
    });
  }

  console.log('\n' + '='.repeat(72));
  console.log('LIVE BUT NOTHING CLEARING TODAY - still worth adding, boards rotate');
  console.log('='.repeat(72));
  console.log(empty.length
    ? '  ' + empty.map((b) => b.ats + ':' + b.token + ' (' + b.total + ' jobs, '
      + b.india + ' India backend)').join('\n  ')
    : '  none');

  // --- paste-ready config lines --------------------------------------------
  console.log('\n' + '='.repeat(72));
  console.log('PASTE INTO config.js');
  console.log('='.repeat(72));
  const stamp = new Date().toISOString().slice(0, 10);
  Object.keys(ATS).forEach((ats) => {
    const rows = fresh.filter((b) => b.ats === ats)
      .sort((a, b) => b.clearing.length - a.clearing.length);
    if (!rows.length) return;
    console.log('\n  // ' + ats + ': discovered ' + stamp);
    rows.forEach((b) => {
      const note = b.india ? '  // ' + b.india + ' India backend' : '';
      console.log("    { token: '" + b.token + "', name: '" + b.token
        + "', verified: true }," + note);
    });
  });
  if (adopt) {
    const added = adoptIntoConfig(fresh);
    console.log('\n' + '='.repeat(72));
    console.log('ADOPTED ' + added + ' board(s) into config.js');
    console.log('='.repeat(72));
    console.log('Names are placeholders - rename them when convenient.');
    return { live: live.length, fresh: fresh.length, adopted: added };
  }

  console.log('\nReplace each name with the real company name before committing,');
  console.log('or re-run with --adopt to write them in automatically.');
  return { live: live.length, fresh: fresh.length, adopted: 0 };
}

module.exports = { discover };

if (require.main === module) {
  discover().catch((e) => { console.error('Fatal:', e); process.exit(1); });
}
