# ATS Poller

Polls company ATS boards directly for new backend roles in India. No scraping,
no anti-bot, no maintenance treadmill.

[![CI](https://github.com/sinhaa-aankit/ats-poller/actions/workflows/ci.yml/badge.svg)](https://github.com/sinhaa-aankit/ats-poller/actions/workflows/ci.yml)

## Why this and not a scraper

Naukri and LinkedIn scrapers break constantly because you are fighting an
adversary. Greenhouse, Lever, Ashby and SmartRecruiters all expose **public,
unauthenticated APIs** for their job boards. They are stable, documented, and return
structured JSON.

More importantly, they solve the problem that actually wasted your time:
**every job this returns is live by definition.** No more 410 Gone. No more
requisitions that rank in Google but were closed six months ago.

## Requirements

Node 18+ only. **No dependencies, no `npm install`.** It uses built-in `fetch`.

## Usage

```bash
node index.js                 # report only roles never seen before
node index.js --all           # also the full ranked list of everything open
node index.js --discover-now  # force a board-discovery pass first
node index.js --no-discover   # skip discovery even if it is due
node discover.js              # hunt for boards not in config.js, print them
node discover.js --adopt      # ...and write them into config.js automatically
node discover.js --check      # is every configured board still live? (~30s)
node applied.js <apply-url>   # mark a role applied; it stops appearing
node applied.js --list        # what you have applied to
node test.js                  # 167 assertions, no network access
```

Or via npm scripts: `npm start`, `npm run all`, `npm run discover`, `npm test`.

Progress is printed to stderr as it works - board-by-board counter, then
four labelled phases (fetch, filter, score, diff). The report itself goes to
stdout, so `node index.js > out.md` gives you a clean file while you still
watch it run.

Currently polls **523 boards** across four platforms — 228 Greenhouse, 49 Lever,
200 Ashby, 46 SmartRecruiters.

Target roles are senior backend IC roles plus the customer-facing variants
that fit an integrations background: **Forward Deployed Engineer** and
**Solutions Engineer / Solutions Architect**. Titles that say presales or
customer engineer outright stay excluded as quota-carrying sales roles.

Each run fetches every board fresh, filters, scores, then diffs against
`seen.json`. A role reported once is never reported as new again. The
`--all` table is opt-in precisely because it repeats every run and reads as
the tool handing you yesterday's results.

Reports land in `reports/YYYY-MM-DD-HHMM.md` — one file per run, so an ad-hoc
run cannot overwrite what a scheduled run already reported.

## Board health

A board that 404s once is a blip. The same board failing run after run is a
dead token or a company that has migrated platforms — and that is coverage you
believe you have and do not.

Consecutive failures per board are tracked in `.board-health.json`
(gitignored). At three in a row the report says so loudly, with the command to
diagnose it:

```
## ⚠️  2 board(s) failing persistently

- `greenhouse:phonepe` — failed 9 runs in a row
- `greenhouse:marqeta` — failed 4 runs in a row

node discover.js phonepe marqeta
```

Counters reset on any success and are pruned for boards no longer in
`config.js`, so disabling a dead token silences it rather than nagging forever.

Three real outcomes seen so far, all worth knowing:

- **ClickHouse** migrated Greenhouse → Ashby. Same company, same token,
  different platform. Repointed.
- **PhonePe** left all four platforms. No token variant works. Genuinely
  unreachable, so it is commented out with a note to check by hand — losing a
  target silently is worse than losing it loudly.
- **Marqeta** the same, disabled.

Note the gotcha this exposed: `discover.js` dedupes by token across every
platform, which is right for avoiding double-reports but means a migration
looks like a duplicate and gets suppressed. If a board is failing, probe it
directly rather than trusting a sweep to spot it.

## Posting age

Every report shows how old a requisition is, because response rate falls off a
cliff with age — applicant 12 on a fresh posting beats applicant 400 on a
five-month-old one:

```
### 56 pts - Sezzle: Senior Payments Engineer
- Posted: 2d ago
### 67 pts - HackerRank: Senior Backend Engineer
- Posted: 5mo ago  ⚠️  stale requisition  (description updated 8d ago)
```

Anything older than 60 days is flagged. Note the second line: Greenhouse's
`updated_at` moves whenever anyone edits a description, so a role open since
March can surface as "new" today. The age shown is always `first_published` —
preferring `updated_at`, which this code did originally, gets it exactly
backwards.

## Applied tracking

`seen.json` answers "have I been told about this role". It does not answer
"have I applied to it", so a role you applied to weeks ago keeps appearing in
the `--all` table as though it were an option.

```bash
node applied.js https://job-boards.greenhouse.io/sezzle/jobs/7725286003
```

Paste the `Apply:` link straight from a report. Marked roles are dropped from
future reports, and the run says how many it hid. `applied.json` is gitignored
and deliberately separate from `seen.json` — deleting the latter to re-scan
should not erase where you have applied.

## State

`seen.json` is the dedup record and is **gitignored** — it is personal search
history. First run creates it and reports everything currently open as new
(expect a large day-one batch: it is the entire open backlog, not a daily
rate).

To pre-seed roles you have already seen, write a JSON array of
`"<source>:<id>"` keys to `seen.json` before the first run:

```json
["greenhouse:1234567890", "lever:00000000-0000-0000-0000-000000000000"]
```

Deleting `seen.json` makes everything report as new again. Useful after
changing filters when you want to re-scan what is currently open.

## Finding board tokens

Verifying a token takes ten seconds:

1. Open the company's careers page
2. Click any job
3. Read the token out of the URL

```
job-boards.greenhouse.io/gitlab/jobs/123    -> greenhouse:      "gitlab"
jobs.lever.co/gohighlevel/abc-123           -> lever:           "gohighlevel"
jobs.ashbyhq.com/confluent/abc-123          -> ashby:           "confluent"
jobs.smartrecruiters.com/swiggy/123456      -> smartrecruiters: "swiggy"
```

A board that fails is named in the report header along with its token, so a
404 tells you exactly which line in `config.js` to fix or comment out. Each
board gets one automatic retry first — a single transient `fetch failed` used
to drop a whole company out of the report silently.

There is no EU Greenhouse host. `boards-api.eu.greenhouse.io` does not
resolve; every board lives on `boards-api.greenhouse.io`.

### Why Workday companies are still missing

Workday, iCIMS and custom career sites stay out — but for a narrower reason
than "unscriptable", which is what this README used to claim.

Workday does expose JSON: `POST /wday/cxs/{tenant}/{site}/jobs` returns
listings for a single company. What it has no equivalent of is a *guessable*
token. The tenant and site path have to be read out of each careers page's
network tab; nine plausible tenant/site combinations probed on 22 Aug 2026 all
missed. So Workday companies are a manual add each, never a sweep.

That is what keeps Flipkart, Myntra, Zomato, Ola, Zerodha, Dream11 and most
banks out of reach. Worth re-probing occasionally, though — Swiggy and
Unacademy were both written off as unreachable until SmartRecruiters was
tried, and they turned out to be sitting on a public API all along.

## Expanding coverage

The company list is a hard ceiling. The poller only ever finds jobs at
companies already in `config.js`, because no ATS platform offers a "list all
boards" endpoint — every API is `GET /<token>`, so there is nothing to crawl
and you must already know the token.

`discover.js` closes that gap the only way available: guess tokens against all
three platforms and keep whatever returns 200.

```bash
node discover.js                 # probe every token in candidates.txt
node discover.js acme foo bar    # probe specific tokens
```

Two phases — a cheap liveness probe across every candidate, then a full fetch
and score for only the boards that came back alive — ending in paste-ready
`config.js` lines. It writes nothing to disk and never touches `seen.json`.

### It runs itself

`index.js` tracks when discovery last ran (`.discover-state.json`, gitignored)
and triggers it with `--adopt` once it is older than `discoverEveryDays` in
`config.js` — currently 1, so the first run each day. Boards adopted mid-run
are polled in that same run, so nothing waits for tomorrow.

Daily is affordable only because of dead-token resting: a token that 404d is
re-probed once every `deadRetryDays` (7), staggered by a hash so the retries
spread evenly, and tokens already in `config.js` are never probed. Without
that a sweep is ~4,500 requests against ~1,140 candidates. Even so:

- it finds nothing on almost every day. New boards appear only when a company
  newly adopts one of the four platforms, or when `candidates.txt` grows —
  probing the same unchanged tokens daily is 12× the load on free public APIs
  for near-zero yield
- discovery failures are caught and swallowed; they must never stop the poll

Adopted boards get the token as a placeholder `name` — rename them when
convenient. Nothing else about them is guessed.

### Sweeps so far

Append guesses to `candidates.txt` freely; a wrong one costs a single 404.
270 tokens → 81 live → 43 added, then 439 → 170 live → 77 added. The second
sweep still hit 39%, so the list is far from exhausted. Later sweeps: 166 →
80 live → 74 added (FDE / Solutions Engineer hirers), then 302 → 147 live →
129 added, then 294 → 89 live → 83 added, then 154 → 30 live → 23 added.
The list now holds ~1,600, and the hit rate is falling (49% → 30% → 19%):
the obvious tokens are taken.

A live board is not always the company you meant. Short tokens collide:
`current`, `galileo`, `swan`, `glide`, `ultimate` (an HVAC firm) and
`momentic` (a pilates studio), `pronto` (mining haulage) and `superset` (a
founders' community) were all live but belonged to
unrelated companies, and several SmartRecruiters tokens held only test
postings. Look at a few titles before trusting an adoption.

Three things to watch:

- Where a company runs boards on **two** platforms, add only one. Polling both
  reports the same job twice under different ids. Check the token against
  *every* platform already in `config.js`, not just the one being added —
  `smartrecruiters:netskope` looks new when you already poll
  `greenhouse:netskope`.
- A token that 404s on one platform may be live on another. Plaid 404s on
  Greenhouse but serves 107 jobs on Ashby; Glean was written off entirely
  until it turned up on SmartRecruiters.
- SmartRecruiters answers **200 with an empty list** for a company that does
  not exist, so HTTP status is not a liveness test there — `totalFound > 0` is.
- SmartRecruiters boards are fetched with `country=in` and paged. A single
  `limit=100` request used to cap every board at 100 postings — Swiggy has
  192 in India and ServiceNow 71 among 673 worldwide — and that cap is what
  makes enterprise boards like Bosch (4,975 postings, 625 in India) usable.

## Running it

Manually is fine and is what this repo currently does — there is no scheduled
task installed:

```bash
node index.js
```

Takes ~3 minutes across 523 boards, fetched six at a time and interleaved
across the four platforms so no single API sees more than one or two requests
at once. The first run each day adds a discovery pass; `--no-discover` skips it.

### Checking board health on demand

```bash
node discover.js --check
```

Probes every configured board in ~30 seconds rather than waiting for three
failed polls. Each dead one is labelled:

- `empty` — the board exists with nothing open today. Leave it.
- `GONE` — 404. If the same token is live on another platform the company has
  migrated, and the check says where. Otherwise comment it out with a note.

The first run on 20 Oct 2026 found five migrations (Amplitude back to Ashby,
Hightouch, Iterable, Webflow, Thoughtworks) and three boards gone outright
(Remote, Atomicwork, Maximor) that the poll would have flagged only after
three more runs.

## Scheduling (optional)

Skip this unless you want it unattended. Two failure modes bit this project for
a week each, so both are written down.

**Windows** (Task Scheduler — there is no `cron`):

```powershell
schtasks /Create /TN "ATS Poller Daily" /TR "'C:\path\to\run-daily.cmd'" /SC DAILY /ST 22:00 /F
```

`run-daily.cmd` uses an absolute node path on purpose. Task Scheduler, like
cron, does not inherit your interactive PATH. Two settings matter or the task
silently aborts on a laptop:

```powershell
$s = New-ScheduledTaskSettingsSet -AllowStartIfOnBatteries `
       -DontStopIfGoingOnBatteries -StartWhenAvailable
Set-ScheduledTask -TaskName "ATS Poller Daily" -Settings $s
```

Without those, the task fails with `0x800710E0` (`ERROR_OPERATION_ABORTED`)
whenever the machine is on battery, and writes nothing to `poll.log`.

**macOS / Linux:**

```bash
crontab -e
0 22 * * * cd /path/to/ats-poller && /usr/bin/node index.js >> poll.log 2>&1
```

Use `which node` for the absolute path.

Verify it actually ran:

```powershell
schtasks /Query /TN "ATS Poller Daily" /FO LIST /V
```

`Last Result: 0` means it ran.

`-2147020576` (`0x800710E0`, `ERROR_OPERATION_ABORTED`) means Task Scheduler
killed it before it started — almost always the battery condition above, and
nothing reaches `poll.log`, which is what makes it easy to miss.

`3221225786` (`0xC000013A`, `STATUS_CONTROL_C_EXIT`) is the nastier one: the
run *starts*, writes a few boards to `poll.log`, then dies. That is a task
running as `LogonType: Interactive`, which lives inside your desktop session.
`-WakeToRun` wakes the machine at the trigger time, the task starts, and then
Windows returns to sleep a couple of minutes later because nobody is using the
machine — taking the console process with it. Seven consecutive nights failed
this way, each getting 8–9 boards in before the `^C`.

The fix needs an **elevated** shell, because changing a task's principal does:

```powershell
$p = New-ScheduledTaskPrincipal -UserId "$env:USERDOMAIN\$env:USERNAME" `
       -LogonType S4U -RunLevel Limited
Set-ScheduledTask -TaskName "ATS Poller Daily" -Principal $p
```

S4U runs the task outside the interactive session, so there is no console to
kill and it survives lock, logoff and re-sleep. No stored password required.

Whichever you use, check `poll.log` after the first night. A run that logs
`===== run started` with no matching `===== exit code` did not finish.

## Notifications

To only look when something actually opened, add to the end of `report()`.
`report()` is synchronous, so this is fire-and-forget rather than `await` —
Node still waits for the request before exiting:

```js
if (fresh.length && process.env.TG_TOKEN) {
  fetch(`https://api.telegram.org/bot${process.env.TG_TOKEN}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: process.env.TG_CHAT, text: out.slice(0, 4000) }),
  }).catch((e) => console.error('telegram:', e.message));
}
```

Create a bot with @BotFather and set `TG_TOKEN` / `TG_CHAT` in your
environment. Silence means nothing new; a buzz means open your phone.

## Tuning

Everything lives in `config.js`.

- `hardExcludes` — instant title rejects. Cheap and high-value. Add aggressively.
- `scoring.strong` — tech you can demonstrate. Weight 12.
- `scoring.adjacent` — real signal you have not demonstrated. Weight 6.
- `scoring.delivery` — client-facing and integration work (UAT, go-live,
  production support, API integrations). Weight 6. This is what lets FDE and
  Solutions Engineer JDs, which name the stack less, clear the threshold.
- `scoring.penalty` — terms meaning the role is built on a stack you do not
  have. These carry `-14` and will usually sink a job below threshold.
- `minScore` — currently 20. Raise it if you get noise, lower it if too quiet.
- `maxYearsRequired` — currently 7. JDs above this take a 25-point hit.

Term matching is **whole-word with an `s`/`es`/`ing` inflection allowance**,
not substring. This matters: plain `includes()` meant `'scala'` matched
"scalable" and fired a −14 penalty on good roles, `'rust'` matched "trusted",
and `'express'` matched "expressed". Stems that must still match
continuations (`'scalab'`, `'idempoten'`) are listed in `PREFIX_TERMS`.

### Calibration

The scorer is validated against roles assessed by hand. It reproduces the
manual ranking:

| Role | Score | Manual assessment |
|---|---|---|
| HighLevel — SDE III, CRM Bulk Import | 38 | 85% |
| Postman — Senior Engineer, Messaging Platform | 29 | 78% |
| Whatfix — SE E5 Backend | 10 (filtered) | ~52%, Java/Spring |
| Postman — Fabric Gateway | -14 (filtered) | 42%, Go required |
| Stripe — Backend Engineer, SF | rejected on location | US-only |
| Staff Data Engineer, Spark | rejected on title | wrong discipline |

If you change the weights, re-run `node test.js` and check these still rank
in this order.

## Expectations

**Most days this will return nothing, and that is the correct result.**

Senior Node.js backend roles in India appear at a rate of a few per week
nationally. A tool that surfaces 50 a day is showing you noise. The value here
is that on the day a real one opens, you see it first — and you never again
spend an hour on a dead listing.

## License

MIT
