'use strict';
const { isRelevant, score, extractMinYears } = require('./index');

let pass = 0, fail = 0;
const failures = [];

function check(name, got, want) {
  const ok = JSON.stringify(got) === JSON.stringify(want);
  ok ? pass++ : (fail++, failures.push(`${name} :: got ${JSON.stringify(got)} want ${JSON.stringify(want)}`));
  console.log(`  ${ok ? 'ok  ' : 'FAIL'}  ${name}`);
}

const job = (o) => ({ title: 'Senior Backend Engineer', location: 'Bengaluru, India',
  content: 'Node.js MongoDB Redis backend services', ...o });

console.log('\n=== 1. LOCATION ===');
[['Bengaluru, India',true],['Bangalore, Karnataka, India',true],['BENGALURU',true],
 ['Remote - India',true],['India (remote)',true],['India',true],['',true],['   ',true],
 ['Remote',true],['Remote (Anywhere)',true],['Remote - Hyderabad',true],
 ['Hyderabad, Telangana, India',false],['Mumbai, India',false],['Chennai, India',false],
 ['Pune, India',false],['Gurgaon, India',false],['Noida, India',false],['Kolkata, India',false],
 ['San Francisco, CA',false],['London, UK',false],['Malaysia',false],['Singapore',false],
].forEach(([loc,want]) => check(`"${loc}"`, isRelevant(job({location:loc})), want));

console.log('\n=== 2. LOCATION FALLBACK VIA JD BODY ===');
check('US location + "remote - india" in body',
  isRelevant(job({location:'San Francisco, CA', content:'Node.js. This role is Remote - India.'})), true);
check('US location + bare word india in body (should NOT pass)',
  isRelevant(job({location:'San Francisco, CA', content:'We have an office in India. Node.js.'})), false);

console.log('\n=== 3. HARD EXCLUDES ===');
['Senior Frontend Engineer','Android Engineer','Engineering Manager, Backend',
 'Staff Engineer, Backend','Principal Engineer','Data Engineer','ML Engineer',
 'SDET II','DevOps Engineer','Site Reliability Engineer','Backend Engineer Intern',
 'Graduate Software Engineer','Director of Engineering',
].forEach(t => check(`excluded: "${t}"`, isRelevant(job({title:t})), false));

console.log('\n=== 4. ROLE KEYWORDS ===');
[['Senior Backend Engineer',true],['Backend, Payments Platform',true],
 ['Software Development Engineer III',true],['SDE 2',true],['Node.js Developer',true],
 ['Solutions Architect',true],['Senior Engineer, Messaging Platform',true],
 ['Product Manager',false],['Account Executive',false],['Technical Writer',false],
].forEach(([t,want]) => check(`"${t}"`, isRelevant(job({title:t})), want));

console.log('\n=== 5. YEARS EXTRACTION ===');
[['6+ years of backend engineering experience',6],['4+ years building backend services',4],
 ['5-8 years of experience as a software developer',5],['Minimum 6 years of relevant experience',6],
 ['3+ years working with distributed systems',3],['2+ years of infrastructure experience',2],
 ['Experience: 5',5],['no numbers at all',null],
].forEach(([t,want]) => check(`"${t.slice(0,42)}"`, extractMinYears(t), want));

console.log('\n=== 6. SCORING - REAL JDs FROM RESEARCH ===');
const real = [
  ['HighLevel Bulk Import','Software Development Engineer III (CRM - Bulk Import)','India (remote)',
   '4+ years building backend services. Node.js with NestJS. Pub/Sub, Redis, idempotent imports, retries, partial-failure resumption, deduplication and rate limit handling. Millions of records per run. REST API integration with OAuth.'],
  ['Postman Messaging','Senior Engineer, Messaging Platform','Bengaluru, India',
   '6+ years of backend engineering experience building distributed systems. Proficiency in backend languages such as JavaScript, Java, Python. Event-driven architectures, messaging systems, queues. Triggering, routing, delivery, retries, deduplication, rate limiting. Reliability, observability, failure modes.'],
  ['Whatfix E5','Software Engineer - E5 - Backend','Bengaluru, Karnataka, India',
   '6+ years of experience in Backend Development. Must-Have: Strong Experience in Core Java, REST, Spring. CI/CD, Jenkins. NoSQL (Cassandra/HBase/MongoDB). Good to Have: Javascript and react.'],
  ['Postman Fabric GW','Senior Engineer - Fabric Gateway','Bengaluru, India',
   '2+ years of infrastructure or platform experience. Proficiency in Go and strong systems programming fundamentals.'],
];
const scored = real.map(([n,title,location,content]) => {
  const j = {title,location,content};
  const rel = isRelevant(j);
  return { n, rel, s: rel ? score(j).total : null };
});
scored.forEach(r => console.log(`  ${String(r.s).padStart(5)}  ${r.n}`));
check('HighLevel outranks Postman Messaging', scored[0].s > scored[1].s, true);
check('Postman Messaging outranks Whatfix', scored[1].s > scored[2].s, true);
check('Whatfix outranks Fabric Gateway', scored[2].s > scored[3].s, true);
check('Java/Spring role falls below minScore 20', scored[2].s < 20, true);
check('Go role scores negative', scored[3].s < 0, true);

console.log('\n=== 7. MALFORMED INPUT (crash resistance) ===');
const bad = [
  ['empty content', {title:'Backend Engineer', location:'Bengaluru', content:''}],
  ['unicode title', {title:'Senior Backend Engineer rocket', location:'Bengaluru', content:'Node.js'}],
  ['very long content', {title:'Backend Engineer', location:'Bengaluru', content:'Node.js '.repeat(50000)}],
  ['html in content', {title:'Backend Engineer', location:'Bengaluru', content:'<p>Node.js &amp; MongoDB</p>'}],
];
for (const [name, j] of bad) {
  try {
    const r = isRelevant(j);
    if (r) score(j);
    check(`survives: ${name}`, true, true);
  } catch (e) {
    check(`survives: ${name}`, `threw ${e.message}`, true);
  }
}

console.log('\n=== 8. WORD-BOUNDARY MATCHING ===');
// Regression cover for the substring bug: plain includes() meant 'scala' hit
// "scalable" and fired a -14 penalty on roles that were a good match, 'rust'
// hit "trusted", and 'express' hit "expressed". All three shipped green
// against the original suite, because none of the four calibration JDs happen
// to contain those words.
const bucket = (content, name) =>
  score({ title: 'Backend Engineer', content }).hits[name] || [];

check('"scalable" does not fire the scala penalty',
  bucket('We build scalable systems', 'penalty'), []);
check('"scalable" still scores as core',
  bucket('We build scalable systems', 'core'), ['scalab']);
check('"trusted" does not fire the rust penalty',
  bucket('Trusted by millions of users', 'penalty'), []);
check('"expressed" is not Express.js',
  bucket('Candidates who expressed interest', 'strong'), []);
check('"express written consent" is not Express.js',
  bucket('No use without express written consent', 'strong'), []);
check('real Scala is still penalised',
  bucket('Strong experience in Scala and Akka', 'penalty'), ['scala']);
check('real Rust is still penalised',
  bucket('Built in Rust for performance', 'penalty'), ['rust']);
check('C++ is NOT penalised - it is on the resume',
  bucket('Some C++ in the codebase', 'penalty'), []);

console.log('\n=== 9. INFLECTION ALLOWANCE ===');
// A hard \b...\b boundary would have silently dropped every plural in the
// term lists - caught only because a core hit disappeared from a test run.
check('plural: payments / transactions',
  bucket('payments and transactions at scale', 'domain'), ['payment', 'transaction']);
check('plural: microservices',
  bucket('microservices architecture', 'core'), ['microservice']);
check('plural: message queues',
  bucket('message queues everywhere', 'core'), ['message queue']);
check('plural: distributed systems',
  bucket('distributed systems work', 'core'), ['distributed system']);
check('stem: scalability',
  bucket('scalability work', 'core'), ['scalab']);
check('stem: idempotent / deduplication',
  bucket('idempotent deduplication', 'bonus'), ['idempoten', 'deduplicat']);
check('gerund: rate limiting',
  bucket('rate limiting layer', 'bonus'), ['rate limit']);

console.log('\n=== 10. REMOTE LOCATION SCOPING ===');
// "Remote - US" used to pass on the bare word "remote", which was the single
// biggest source of noise - 24 of 38 roles in the first real report.
const loc = (l) => isRelevant({ title: 'Senior Backend Engineer', location: l,
  content: 'Node.js MongoDB Redis' });
[['Remote - US', false], ['Remote - USA', false], ['Remote - Ireland', false],
 ['Remote - Colombia', false], ['Remote, United Arab Emirates', false],
 ['Remote - San Francisco', false], ['Fully Remote', true],
 ['Remote, Bangalore', true], ['Bengaluru; Remote - US', true],
].forEach(([l, want]) => check(`location "${l}"`, loc(l), want));

console.log('\n=== 11. TITLE EXCLUSIONS ===');
const title = (t) => isRelevant({ title: t, location: 'Bengaluru',
  content: 'Node.js MongoDB payment' });
[['Tech Lead Manager - Product Engineering', false],
 ['Manager, Software Engineering', false],
 ['Software Development Engineer in Test III', false],
 ['Technical Support Engineer 2', false],
 ['Sr SAP Developer', false],
 ['Firmware Engineer(5-7 years)', false],
 ['Senior Presales Engineer', false],
 ['Staff Software Engineer (Data Platform)', false],
 ['Senior Staff Engineer', false],
 // "Senior/Staff X" is one posting spanning two levels and applies at the
 // Senior end, so the 'staff' exclude must not swallow it.
 ['Senior/Staff Applied Research Software Engineer', true],
 ['Senior / Staff Software Engineer', true],
 ['SDE 3 - Platform Engineering', true],
].forEach(([t, want]) => check(`title "${t}"`, title(t), want));

console.log('\n=== 12. CONFIG INVARIANTS ===');
// discover.js --adopt writes into config.js unattended, and index.js can now
// trigger it on a timer. The invariant that stops the same job being reported
// twice under two ids therefore needs a guard here, not just care at review.
const cfg = require('./config');
const boards = [].concat(
  cfg.greenhouse.map((b) => ['greenhouse', b]),
  (cfg.euGreenhouse || []).map((b) => ['euGreenhouse', b]),
  cfg.lever.map((b) => ['lever', b]),
  cfg.ashby.map((b) => ['ashby', b]),
  (cfg.smartrecruiters || []).map((b) => ['smartrecruiters', b]));
const allTokens = boards.map(([, b]) => b.token);
check('no token appears on two platforms',
  [...new Set(allTokens.filter((t, i) => allTokens.indexOf(t) !== i))], []);
check('every board has a token and a name',
  boards.filter(([, b]) => !b.token || !b.name).map(([p, b]) => p + ':' + b.token), []);
check('no token contains whitespace',
  allTokens.filter((t) => /\s/.test(t)), []);

console.log(`\n${'='.repeat(50)}\n${pass} passed, ${fail} failed`);
if (fail) { console.log('\nFAILURES:'); failures.forEach(f => console.log('  - ' + f)); process.exit(1); }
