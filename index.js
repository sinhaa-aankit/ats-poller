#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const config = require('./config');

const STATE_FILE = path.join(__dirname, 'seen.json');
const REPORT_DIR = path.join(__dirname, 'reports');

// ---------------------------------------------------------------------------
// FETCHERS - one per ATS. All of these are public, unauthenticated GET APIs.
// ---------------------------------------------------------------------------

async function getJSON(url) {
  const res = await fetch(url, {
    headers: { 'User-Agent': 'ats-poller/1.0' },
    signal: AbortSignal.timeout(20000),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

async function fetchGreenhouse({ token, name }, host = 'boards-api.greenhouse.io') {
  const url = `https://${host}/v1/boards/${token}/jobs?content=true`;
  const data = await getJSON(url);
  return (data.jobs || []).map((j) => ({
    source: 'greenhouse',
    company: name,
    id: String(j.id),
    title: j.title,
    location: j.location?.name || '',
    url: j.absolute_url,
    // Greenhouse returns HTML-escaped content; decode enough to search it.
    content: decodeEntities(j.content || ''),
    postedAt: j.updated_at || j.first_published || null,
  }));
}

async function fetchLever({ token, name }) {
  const url = `https://api.lever.co/v0/postings/${token}?mode=json`;
  const data = await getJSON(url);
  return (data || []).map((j) => ({
    source: 'lever',
    company: name,
    id: j.id,
    title: j.text,
    location: j.categories?.location || '',
    url: j.hostedUrl,
    content: [j.descriptionPlain, ...(j.lists || []).map((l) => stripTags(l.content))].join('\n'),
    postedAt: j.createdAt ? new Date(j.createdAt).toISOString() : null,
  }));
}

async function fetchAshby({ token, name }) {
  const url = `https://api.ashbyhq.com/posting-api/job-board/${token}?includeCompensation=true`;
  const data = await getJSON(url);
  return (data.jobs || []).map((j) => ({
    source: 'ashby',
    company: name,
    id: j.id,
    title: j.title,
    location: j.location || '',
    url: j.jobUrl,
    content: stripTags(j.descriptionHtml || j.descriptionPlain || ''),
    postedAt: j.publishedAt || null,
  }));
}

// SmartRecruiters splits its data: the postings list carries title and
// location but no description, which needs one extra request per posting. So
// filter on title first and fetch detail only for survivors - that keeps a
// 200-posting board down to a handful of calls.
//
// Pre-filtering deliberately uses roleKeywords ONLY, not hardExcludes. The
// full exclude logic in isRelevant has a Senior/Staff carve-out, and
// duplicating it here would risk the two drifting apart.
async function fetchSmartRecruiters({ token, name }) {
  const list = await getJSON(
    `https://api.smartrecruiters.com/v1/companies/${token}/postings?limit=100`);

  const candidates = (list.content || [])
    .map((p) => ({
      source: 'smartrecruiters',
      company: name,
      id: String(p.id),
      title: p.name,
      location: srLocation(p.location),
      url: p.ref || `https://jobs.smartrecruiters.com/${token}/${p.id}`,
      content: '',
      postedAt: p.releasedDate || null,
    }))
    .filter((j) => hasAny(j.title, config.roleKeywords));

  for (const j of candidates) {
    try {
      const d = await getJSON(
        `https://api.smartrecruiters.com/v1/companies/${token}/postings/${j.id}`);
      const sections = (d.jobAd && d.jobAd.sections) || {};
      j.content = stripTags(Object.keys(sections)
        .map((k) => (sections[k] && sections[k].text) || '').join(' '));
    } catch { /* keep the posting even if its description will not load */ }
    await new Promise((r) => setTimeout(r, 120));
  }
  return candidates;
}

// SmartRecruiters returns India as the country code "in". Spell it out or the
// location filter never matches a posting that names no city.
function srLocation(loc) {
  if (!loc) return '';
  const country = loc.country === 'in' ? 'India' : (loc.country || '');
  return [loc.city, loc.region, country].filter(Boolean).join(', ');
}

// ---------------------------------------------------------------------------
// HELPERS
// ---------------------------------------------------------------------------

function stripTags(html) {
  return String(html).replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ');
}

function decodeEntities(s) {
  return String(s)
    .replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&').replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'").replace(/&nbsp;/g, ' ')
    .replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ');
}

// Term matching is whole-word, not substring. Plain includes() meant 'scala'
// hit "scalable" (-14 on a role that was actually a good fit), 'rust' hit
// "trusted", and 'express' hit "expressed".
//
// Four carve-outs, or the fix would quietly narrow what counts as a match:
//   - An inflection suffix is still allowed, so 'payment' matches "payments"
//     and 'microservice' matches "microservices". A hard boundary would have
//     dropped every plural in the term lists.
//   - PREFIX_TERMS are deliberately written as stems and must still match
//     continuations ('scalab' -> "scalable"/"scalability").
//   - A term ending in a space ('node ', 'ios ', 'vp ') already encoded "must
//     be followed by whitespace". That is kept verbatim - trimming it would
//     make 'node' match "Node.js" and double-count against the 'node.js' term.
//   - A term starting with a non-alphanumeric ('.net') gets no leading
//     boundary, so it still matches inside "ASP.NET".
const PREFIX_TERMS = new Set([
  'scalab', 'idempoten', 'deduplicat', 'performance optimi',
]);

const reCache = new Map();
function termRegex(term) {
  const cached = reCache.get(term);
  if (cached) return cached;
  const t = term.toLowerCase();
  const esc = t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const head = /^[a-z0-9]/.test(t) ? '(?<![a-z0-9])' : '';
  // 'ed' is deliberately NOT allowed: it is what made 'express' match
  // "expressed". 's|es|ing' covers the plurals and gerunds we do want.
  let tail = '(?:s|es|ing)?(?![a-z0-9])';
  if (/\s$/.test(t) || PREFIX_TERMS.has(t)) tail = '';
  const re = new RegExp(`${head}${esc}${tail}`, 'i');
  reCache.set(term, re);
  return re;
}

function hasAny(haystack, terms) {
  return terms.some((t) => termRegex(t).test(haystack));
}

function countMatches(haystack, terms) {
  return terms.filter((t) => termRegex(t).test(haystack));
}

// Pull the minimum years requirement out of a JD, if stated.
function extractMinYears(text) {
  const patterns = [
    // "6+ years of backend engineering experience", "5-8 years experience"
    // Allow arbitrary words between "years of" and "experience".
    /(\d+)\s*\+?\s*(?:[-–]\s*\d+\s*)?years?\s+(?:of\s+)?(?:[\w/\-.]+\s+){0,4}?experience/gi,
    // "4+ years building backend services" - no "experience" word at all
    /(\d+)\s*\+?\s*years?\s+(?:of\s+)?(?:building|working|developing|designing)/gi,
    /minimum\s+(?:of\s+)?(\d+)\s*\+?\s*years?/gi,
    /(\d+)\s*\+?\s*years?\s+(?:in|with)\s+(?:backend|software|engineering)/gi,
    /experience\s*:\s*(\d+)/gi,
  ];
  const found = [];
  for (const re of patterns) {
    let m;
    while ((m = re.exec(text)) !== null) {
      const n = parseInt(m[1], 10);
      if (n > 0 && n < 25) found.push(n);
    }
  }
  return found.length ? Math.min(...found) : null;
}

// ---------------------------------------------------------------------------
// FILTER + SCORE
// ---------------------------------------------------------------------------

// Words that carry no geography. Stripping them leaves only real place names,
// so "Fully Remote (Anywhere)" reduces to nothing while "Remote - US" leaves
// "us" behind.
const REMOTE_FILLER = /\b(remote|anywhere|distributed|hybrid|fully|global|worldwide|flexible|wfh|work|from|home|based|optional|onsite|office)\b/g;

// A remote posting qualifies only if it is unscoped ("Remote", "Remote
// (Anywhere)") or names an Indian place. Indian cities stay allowed on purpose
// - a remote role that merely lists an office city is still remote, which is
// why excludeCities above lets "Remote - Hyderabad" through.
// Uses some() rather than every() so a multi-site posting like
// "Bengaluru; Remote - US" is kept on the strength of Bengaluru.
function remoteIsIndiaScoped(loc) {
  const indiaWords = new Set([
    ...config.excludeCities, 'india', 'bengaluru', 'bangalore', 'karnataka',
  ]);
  const residual = loc
    .replace(REMOTE_FILLER, ' ')
    .replace(/[^a-z]+/g, ' ')
    .trim().split(/\s+/).filter(Boolean);
  return residual.length === 0 || residual.some((w) => indiaWords.has(w));
}

function isRelevant(job) {
  const title = job.title.toLowerCase();
  const loc = `${job.location}`.toLowerCase();

  // "Senior/Staff <role>" is one posting spanning two levels and applies at the
  // Senior end, so the 'staff' hard-exclude must not drop it. Note this keys on
  // the slash: "Senior Staff Engineer" has no slash and stays excluded, because
  // that genuinely is a level above what we are targeting.
  const excludes = /senior\s*\/\s*staff/.test(title)
    ? config.hardExcludes.filter((t) => t !== 'staff')
    : config.hardExcludes;
  if (hasAny(title, excludes)) return false;
  if (!hasAny(title, config.roleKeywords)) return false;

  // Blank location - keep it, some boards just omit the field.
  if (!loc.trim()) return config.keepIfLocationMissing !== false;

  // Reject a named non-Bengaluru Indian city before anything else, so
  // "Hyderabad, India" does not sneak through on the word "India".
  // A remote role that merely lists an office city is still allowed.
  if (hasAny(loc, config.excludeCities) && !loc.includes('remote')) return false;

  if (loc.includes('remote')) {
    if (remoteIsIndiaScoped(loc)) return true;
    // Not India-scoped ("Remote - US", "Remote, Ireland"). Deliberately does
    // NOT return true on the bare word "remote" - falls through to the
    // JD-body check below, which is the only remaining way in.
  } else if (hasAny(loc, config.locationKeywords)) {
    return true;
  }

  // Location names somewhere else entirely (e.g. "San Francisco") - only keep
  // it if the JD body makes clear India or fully-remote hiring is in scope.
  return hasAny(job.content, ['remote - india', 'remote india',
    'anywhere in india', 'based in india', 'hiring in india']);
}

function score(job) {
  const text = `${job.title} ${job.content}`;
  const hits = {};
  let total = 0;

  for (const [bucket, { weight, terms }] of Object.entries(config.scoring)) {
    const matched = countMatches(text, terms);
    if (matched.length) {
      // Diminishing returns: first hit full weight, extras at half.
      const pts = weight + (matched.length - 1) * (weight / 2);
      total += pts;
      hits[bucket] = matched;
    }
  }

  const minYears = extractMinYears(job.content);
  let yearsNote = 'not stated';
  if (minYears !== null) {
    yearsNote = `${minYears}+ yrs`;
    if (minYears > config.maxYearsRequired) total -= 25;
    else if (minYears > 6) total -= 8;
  }

  return { total: Math.round(total), hits, minYears, yearsNote };
}

// ---------------------------------------------------------------------------
// STATE
// ---------------------------------------------------------------------------

function loadSeen() {
  try {
    return new Set(JSON.parse(fs.readFileSync(STATE_FILE, 'utf8')));
  } catch {
    return new Set();
  }
}

function saveSeen(set) {
  fs.writeFileSync(STATE_FILE, JSON.stringify([...set], null, 0));
}

// ---------------------------------------------------------------------------
// MAIN
// ---------------------------------------------------------------------------

// Progress goes to stderr, not stdout, so `node index.js > out.md` still
// writes a clean report while you watch it work. run-daily.cmd redirects
// 2>&1, so poll.log keeps both streams.
function progress(msg) {
  process.stderr.write(msg + '\n');
}

async function run() {
  const started = Date.now();
  const tasks = [
    ...config.greenhouse.map((c) => ({
      label: `${c.name} (greenhouse:${c.token})`, run: () => fetchGreenhouse(c) })),
    ...config.euGreenhouse.map((c) => ({
      label: `${c.name} (eu-greenhouse:${c.token})`,
      run: () => fetchGreenhouse(c, 'boards-api.eu.greenhouse.io') })),
    ...config.lever.map((c) => ({
      label: `${c.name} (lever:${c.token})`, run: () => fetchLever(c) })),
    ...config.ashby.map((c) => ({
      label: `${c.name} (ashby:${c.token})`, run: () => fetchAshby(c) })),
    ...(config.smartrecruiters || []).map((c) => ({
      label: `${c.name} (smartrecruiters:${c.token})`,
      run: () => fetchSmartRecruiters(c) })),
  ];

  const all = [];
  const failures = [];

  progress(`[1/4] Fetching ${tasks.length} boards...`);

  // Sequential with a small delay - we are polling ~79 endpoints, not racing.
  // One retry, and the board is named in the failure: a single transient
  // "fetch failed" used to drop a whole company out of the report silently,
  // and the message gave no way to tell which one.
  let n = 0;
  for (const task of tasks) {
    n += 1;
    const tag = `  ${String(n).padStart(2)}/${tasks.length}`;
    let lastErr = null;
    let got = 0;
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        const jobs = await task.run();
        all.push(...jobs);
        got = jobs.length;
        lastErr = null;
        break;
      } catch (err) {
        lastErr = err;
        if (attempt === 0) {
          progress(`${tag}  ${task.label} - ${err.message}, retrying`);
          await new Promise((r) => setTimeout(r, 1500));
        }
      }
    }
    if (lastErr) {
      progress(`${tag}  ${task.label} - FAILED (${lastErr.message})`);
      failures.push(`${task.label}: ${lastErr.message}`);
    } else {
      progress(`${tag}  ${task.label} - ${got} jobs`);
    }
    await new Promise((r) => setTimeout(r, 250));
  }

  const secs = Math.round((Date.now() - started) / 1000);
  progress(`      ${all.length} postings fetched in ${secs}s`
    + (failures.length ? `, ${failures.length} board(s) failed` : ''));

  progress('[2/4] Filtering to Bengaluru / remote-India backend roles...');
  const relevant = all.filter(isRelevant);
  progress(`      ${relevant.length} relevant`);

  progress(`[3/4] Scoring against your profile (minScore ${config.minScore})...`);
  const scored = relevant
    .map((j) => ({ ...j, ...score(j) }))
    .filter((j) => j.total >= config.minScore)
    .sort((a, b) => b.total - a.total);
  progress(`      ${scored.length} cleared the threshold`);

  const seen = loadSeen();
  progress(`[4/4] Diffing against seen.json (${seen.size} already known)...`);
  const fresh = scored.filter((j) => !seen.has(`${j.source}:${j.id}`));
  progress(`      ${fresh.length} NEW\n`);
  scored.forEach((j) => seen.add(`${j.source}:${j.id}`));
  saveSeen(seen);

  report({ all, relevant, scored, fresh, failures });
}

function report({ all, relevant, scored, fresh, failures }) {
  const stamp = new Date().toISOString().slice(0, 16).replace('T', ' ');
  const lines = [];

  lines.push(`# ATS Poll - ${stamp}`);
  lines.push('');
  lines.push(`Fetched **${all.length}** postings. `
    + `**${relevant.length}** were India backend roles. `
    + `**${scored.length}** cleared the score threshold. `
    + `**${fresh.length}** are NEW since the last run.`);
  lines.push('');

  if (failures.length) {
    lines.push(`> ${failures.length} board(s) failed: ${failures.join(', ')}. `
      + `A 404 usually means a wrong token in config.js.`);
    lines.push('');
  }

  if (!fresh.length) {
    lines.push('## No new roles today.');
    lines.push('');
    lines.push('That is the normal result. Senior Node.js backend roles in India');
    lines.push('appear at a rate of a few per week, not per day.');
  } else {
    lines.push('## NEW ROLES');
    lines.push('');
    for (const j of fresh) {
      lines.push(`### ${j.total} pts - ${j.company}: ${j.title}`);
      lines.push(`- Location: ${j.location}`);
      lines.push(`- Experience asked: ${j.yearsNote}`);
      if (j.hits.strong) lines.push(`- Stack match: ${j.hits.strong.join(', ')}`);
      if (j.hits.domain) lines.push(`- Domain match: ${j.hits.domain.join(', ')}`);
      if (j.hits.penalty) lines.push(`- ⚠️  Stack risk: ${j.hits.penalty.join(', ')}`);
      lines.push(`- Apply: ${j.url}`);
      lines.push('');
    }
  }

  // This table reprints every open role on every run, which reads as the tool
  // handing you yesterday's results again. Opt-in now: pass --all when you
  // actually want the whole ranked board.
  if (scored.length && process.argv.includes('--all')) {
    lines.push('## ALL CURRENTLY OPEN (including previously seen)');
    lines.push('');
    lines.push('| Score | Company | Role | Location | Exp | Link |');
    lines.push('|---|---|---|---|---|---|');
    for (const j of scored.slice(0, 40)) {
      lines.push(`| ${j.total} | ${j.company} | ${j.title} | ${j.location} | ${j.yearsNote} | [open](${j.url}) |`);
    }
  }

  const out = lines.join('\n');
  console.log(out);

  fs.mkdirSync(REPORT_DIR, { recursive: true });
  // Per-run filename, not per-day. A second run used to overwrite the first
  // while seen.json still recorded its jobs as reported - so those roles were
  // marked seen but their report was gone. Under the 6AM schedule this is
  // still one file a day; it only protects ad-hoc runs.
  const file = path.join(REPORT_DIR,
    `${new Date().toISOString().slice(0, 16).replace('T', '-').replace(':', '')}.md`);
  fs.writeFileSync(file, out);
  console.log(`\n[saved] ${file}`);
}

if (require.main === module) {
  run().catch((e) => {
    console.error('Fatal:', e);
    process.exit(1);
  });
}

module.exports = { isRelevant, score, extractMinYears };
