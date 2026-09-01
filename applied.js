#!/usr/bin/env node
'use strict';

// ---------------------------------------------------------------------------
// APPLIED TRACKING
//
// seen.json answers "have I been told about this role". It does not answer
// "have I applied to it", and those are different questions - a role you
// applied to three weeks ago still sits in the --all table looking like an
// option.
//
//   node applied.js <apply-url> [<apply-url> ...]   mark as applied
//   node applied.js --list                          show what is marked
//   node applied.js --remove <apply-url>            undo
//
// Paste the "Apply:" link straight out of a report. URLs are used as the key
// rather than the internal source:id, so there is no per-platform id parsing
// to get wrong.
//
// applied.json is gitignored - it is a record of where you have applied.
// ---------------------------------------------------------------------------

const fs = require('fs');
const path = require('path');

const FILE = path.join(__dirname, 'applied.json');

function load() {
  try {
    const raw = JSON.parse(fs.readFileSync(FILE, 'utf8'));
    return Array.isArray(raw) ? raw : [];
  } catch {
    return [];
  }
}

function save(list) {
  fs.writeFileSync(FILE, JSON.stringify([...new Set(list)], null, 2) + '\n');
}

const args = process.argv.slice(2);
const urls = args.filter((a) => !a.startsWith('-'));
const current = load();

if (args.includes('--list')) {
  if (!current.length) {
    console.log('Nothing marked as applied yet.');
  } else {
    console.log(`${current.length} application(s) recorded:`);
    current.forEach((u) => console.log('  ' + u));
  }
  process.exit(0);
}

if (!urls.length) {
  console.log('Usage: node applied.js <apply-url> [...]   |   --list   |   --remove <url>');
  process.exit(1);
}

if (args.includes('--remove')) {
  const next = current.filter((u) => !urls.includes(u));
  save(next);
  console.log(`Removed ${current.length - next.length}. ${next.length} still recorded.`);
  process.exit(0);
}

const before = current.length;
save(current.concat(urls));
const after = load().length;
console.log(`Marked ${after - before} new (${urls.length - (after - before)} already recorded).`);
console.log(`${after} application(s) recorded. These no longer appear in reports.`);
