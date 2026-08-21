# ATS Poller

Polls company ATS boards directly for new backend roles in India. No scraping,
no anti-bot, no maintenance treadmill.

[![CI](https://github.com/sinhaa-aankit/ats-poller/actions/workflows/ci.yml/badge.svg)](https://github.com/sinhaa-aankit/ats-poller/actions/workflows/ci.yml)

## Why this and not a scraper

Naukri and LinkedIn scrapers break constantly because you are fighting an
adversary. Greenhouse, Lever and Ashby all expose **public, unauthenticated
GET APIs** for their job boards. They are stable, documented, and return
structured JSON.

More importantly, they solve the problem that actually wasted your time:
**every job this returns is live by definition.** No more 410 Gone. No more
requisitions that rank in Google but were closed six months ago.

## Requirements

Node 18+ only. **No dependencies, no `npm install`.** It uses built-in `fetch`.

## Usage

```bash
node index.js          # report only roles never seen before
node index.js --all    # also print the full ranked list of everything open
node discover.js       # hunt for company boards not yet in config.js
node test.js           # 64 assertions, no network access
```

Or via npm scripts: `npm start`, `npm run all`, `npm run discover`, `npm test`.

Progress is printed to stderr as it works - board-by-board counter, then
four labelled phases (fetch, filter, score, diff). The report itself goes to
stdout, so `node index.js > out.md` gives you a clean file while you still
watch it run.

Currently polls **79 boards** — 46 Greenhouse, 12 Lever, 21 Ashby.

Each run fetches every board fresh, filters, scores, then diffs against
`seen.json`. A role reported once is never reported as new again. The
`--all` table is opt-in precisely because it repeats every run and reads as
the tool handing you yesterday's results.

Reports land in `reports/YYYY-MM-DD-HHMM.md` — one file per run, so an ad-hoc
run cannot overwrite what a scheduled run already reported.

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
job-boards.greenhouse.io/postman/jobs/123   -> greenhouse: "postman"
jobs.lever.co/gohighlevel/abc-123           -> lever:      "gohighlevel"
jobs.ashbyhq.com/confluent/abc-123          -> ashby:      "confluent"
```

A board that fails is named in the report header along with its token, so a
404 tells you exactly which line in `config.js` to fix or comment out. Each
board gets one automatic retry first — a single transient `fetch failed` used
to drop a whole company out of the report silently.

There is no EU Greenhouse host. `boards-api.eu.greenhouse.io` does not
resolve; every board lives on `boards-api.greenhouse.io`.

**Do not bother adding:** Workday, iCIMS, or custom career sites. Workday in
particular serves nothing to a script — that is exactly why manual research
kept hitting walls. If a company is on Workday you check it by hand or not at
all.

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

Add company-name guesses to `candidates.txt` and re-run it every month or so.
The 22 Aug 2026 sweep probed 270 tokens, found 81 live boards and added 43.

Two things to watch:

- Where a company runs boards on **two** platforms, add only one. Polling both
  reports the same job twice under different ids.
- A token that 404s on one platform may be live on another — Plaid 404s on
  Greenhouse but serves 107 jobs on Ashby.

## Scheduling

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

`Last Result: 0` means it ran. `-2147020576` means Task Scheduler killed it —
almost always the battery condition above, and nothing is written to
`poll.log` in that case, which is what makes it easy to miss.

## Notifications

To only look when something actually opened, add to the end of `report()`:

```js
if (fresh.length && process.env.TG_TOKEN) {
  await fetch(`https://api.telegram.org/bot${process.env.TG_TOKEN}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: process.env.TG_CHAT, text: out.slice(0, 4000) }),
  });
}
```

Create a bot with @BotFather and set `TG_TOKEN` / `TG_CHAT` in the task
environment. Silence means nothing new; a buzz means open your phone.

## Tuning

Everything lives in `config.js`.

- `hardExcludes` — instant title rejects. Cheap and high-value. Add aggressively.
- `scoring.strong` — tech you can demonstrate. Weight 12.
- `scoring.adjacent` — real signal you have not demonstrated. Weight 6.
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
