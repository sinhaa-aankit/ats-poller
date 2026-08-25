// ---------------------------------------------------------------------------
// TARGET COMPANIES
// ---------------------------------------------------------------------------
// Tokens marked VERIFIED were confirmed working during research on 12 Aug 2026.
// Tokens marked GUESS need checking once - see README for the 10-second method.
//
// To find a board token: open the company's careers page, click any job, and
// look at the URL.
//   job-boards.greenhouse.io/postman/jobs/123   -> greenhouse token "postman"
//   jobs.lever.co/gohighlevel/abc-123           -> lever token "gohighlevel"
//   jobs.ashbyhq.com/confluent/abc-123          -> ashby token "confluent"
// ---------------------------------------------------------------------------

module.exports = {
  greenhouse: [
    { token: 'postman', name: 'Postman', verified: true },
    { token: 'razorpaysoftwareprivatelimited', name: 'Razorpay', verified: true },
    { token: 'twilio', name: 'Twilio', verified: true },
    // Groww is NOT on an EU instance - boards-api.eu.greenhouse.io does not
    // exist (NXDOMAIN). Both tokens return 200 on the standard host.
    // Verified 20 Aug 2026.
    { token: 'groww', name: 'Groww', verified: true },
    { token: 'growwreferrals', name: 'Groww (referral board)', verified: true },
    // Promoted GUESS -> verified, all confirmed 200 on 20 Aug 2026.
    { token: 'figma', name: 'Figma', verified: true },
    { token: 'coinbase', name: 'Coinbase', verified: true },
    { token: 'databricks', name: 'Databricks', verified: true },
    { token: 'brex', name: 'Brex', verified: true },
    { token: 'cloudflare', name: 'Cloudflare', verified: true },
    { token: 'gitlab', name: 'GitLab', verified: true },
    // --- Indian market / Bengaluru headcount. All probed live 20 Aug 2026. ---
    // The original list was US-heavy, which capped how many Bengaluru backend
    // roles could exist to be found at all.
    { token: 'phonepe', name: 'PhonePe', verified: true },      // 5 India backend
    { token: 'slice', name: 'slice', verified: true },
    { token: 'zscaler', name: 'Zscaler', verified: true },      // 11 India backend
    { token: 'rubrik', name: 'Rubrik', verified: true },        // 8 India backend
    { token: 'netskope', name: 'Netskope', verified: true },
    { token: 'stripe', name: 'Stripe', verified: true },
    { token: 'druva', name: 'Druva', verified: true },
    { token: 'yugabyte', name: 'YugabyteDB', verified: true },
    { token: 'minio', name: 'MinIO', verified: true },
    { token: 'wise', name: 'Wise', verified: true },
    { token: 'airbnb', name: 'Airbnb', verified: true },
    // --- Found by discover.js on 22 Aug 2026. 270 tokens probed, 81 live. ---
    // Where a company runs boards on two platforms, only one is listed here -
    // polling both would report the same job twice under different ids.
    { token: 'purestorage', name: 'Pure Storage', verified: true },  // 13 India backend
    { token: 'fivetran', name: 'Fivetran', verified: true },  // 6 India backend
    { token: 'clickhouse', name: 'ClickHouse', verified: true },  // 6 India backend
    { token: 'newrelic', name: 'New Relic', verified: true },  // 4 India backend
    { token: 'mongodb', name: 'MongoDB', verified: true },  // 4 India backend
    { token: 'adyen', name: 'Adyen', verified: true },  // 2 India backend
    { token: 'starburst', name: 'Starburst', verified: true },  // 2 India backend
    { token: 'elastic', name: 'Elastic', verified: true },  // 1 India backend
    { token: 'datadog', name: 'Datadog', verified: true },  // 1 India backend
    { token: 'zenoti', name: 'Zenoti', verified: true },
    { token: 'braze', name: 'Braze', verified: true },
    { token: 'mixpanel', name: 'Mixpanel', verified: true },
    { token: 'sendbird', name: 'Sendbird', verified: true },
    { token: 'gocardless', name: 'GoCardless', verified: true },
    { token: 'payoneer', name: 'Payoneer', verified: true },
    { token: 'monzo', name: 'Monzo', verified: true },
    { token: 'gusto', name: 'Gusto', verified: true },
    { token: 'remotecom', name: 'Remote', verified: true },
    { token: 'jetbrains', name: 'JetBrains', verified: true },
    { token: 'vercel', name: 'Vercel', verified: true },
    { token: 'netlify', name: 'Netlify', verified: true },
    { token: 'planetscale', name: 'PlanetScale', verified: true },
    { token: 'cockroachlabs', name: 'Cockroach Labs', verified: true },
    { token: 'dremio', name: 'Dremio', verified: true },
    // --- Second discover.js sweep, 22 Aug 2026 (439 tokens, 170 live). ---
    { token: 'singlestore', name: 'SingleStore', verified: true },  // 4 India backend
    { token: 'observeai', name: 'Observe.AI', verified: true },  // 2 India backend
    { token: 'sezzle', name: 'Sezzle', verified: true },  // 2 India backend
    { token: 'anthropic', name: 'Anthropic', verified: true },  // 2 India backend
    { token: 'hackerrank', name: 'HackerRank', verified: true },  // 1 India backend
    { token: 'highradius', name: 'HighRadius', verified: true },
    { token: 'workato', name: 'Workato', verified: true },
    { token: 'celigo', name: 'Celigo', verified: true },
    { token: 'instacart', name: 'Instacart', verified: true },
    { token: 'lyft', name: 'Lyft', verified: true },
    { token: 'pinterest', name: 'Pinterest', verified: true },
    { token: 'discord', name: 'Discord', verified: true },
    { token: 'reddit', name: 'Reddit', verified: true },
    { token: 'robinhood', name: 'Robinhood', verified: true },
    { token: 'block', name: 'Block', verified: true },
    { token: 'affirm', name: 'Affirm', verified: true },
    { token: 'chime', name: 'Chime', verified: true },
    { token: 'marqeta', name: 'Marqeta', verified: true },
    { token: 'mercury', name: 'Mercury', verified: true },
    { token: 'thunes', name: 'Thunes', verified: true },
    { token: 'ebury', name: 'Ebury', verified: true },
    { token: 'circleci', name: 'CircleCI', verified: true },
    { token: 'buildkite', name: 'Buildkite', verified: true },
    { token: 'launchdarkly', name: 'LaunchDarkly', verified: true },
    { token: 'honeycomb', name: 'Honeycomb', verified: true },
    { token: 'cribl', name: 'Cribl', verified: true },
    { token: 'orca', name: 'Orca Security', verified: true },
    { token: 'tigera', name: 'Tigera', verified: true },
    { token: 'grafanalabs', name: 'Grafana Labs', verified: true },
    { token: 'imply', name: 'Imply', verified: true },
    { token: 'scaleai', name: 'Scale AI', verified: true },
    { token: 'comet', name: 'Comet', verified: true },
    { token: 'assemblyai', name: 'AssemblyAI', verified: true },
    { token: 'lightningai', name: 'Lightning AI', verified: true },
  ],

  // The EU Greenhouse host does not exist. Kept as an empty array because
  // index.js maps over it unconditionally.
  euGreenhouse: [],

  lever: [
    { token: 'gohighlevel', name: 'HighLevel', verified: true },
    { token: 'palantir', name: 'Palantir', verified: true },
    // Indian product / fintech, probed live 20 Aug 2026.
    { token: 'meesho', name: 'Meesho', verified: true },        // 5 India backend
    { token: 'zeta', name: 'Zeta', verified: true },
    { token: 'cred', name: 'CRED', verified: true },
    { token: 'epifi', name: 'Fi Money', verified: true },
    { token: 'porter', name: 'Porter', verified: true },
    { token: 'mindtickle', name: 'Mindtickle', verified: true },
    // --- Found by discover.js on 22 Aug 2026. ---
    { token: 'fampay', name: 'FamPay', verified: true },  // 3 India backend, 3 clearing
    { token: 'paytm', name: 'Paytm', verified: true },
    { token: 'pocketfm', name: 'Pocket FM', verified: true },
    { token: 'neon', name: 'Neon', verified: true },
    // --- Second discover.js sweep, 22 Aug 2026 (439 tokens, 170 live). ---
    { token: 'hevodata', name: 'Hevo Data', verified: true },  // 9 India backend
    { token: 'matillion', name: 'Matillion', verified: true },
    { token: 'snaplogic', name: 'SnapLogic', verified: true },
    { token: 'nium', name: 'Nium', verified: true },
    { token: 'sysdig', name: 'Sysdig', verified: true },
    { token: 'tinybird', name: 'Tinybird', verified: true },
  ],

  ashby: [
    { token: 'confluent', name: 'Confluent', verified: true },
    { token: 'ramp', name: 'Ramp', verified: true },
    // Indian product / fintech, probed live 20 Aug 2026.
    { token: 'tekion', name: 'Tekion', verified: true },        // 19 India backend
    { token: 'atlan', name: 'Atlan', verified: true },
    { token: 'navi', name: 'Navi', verified: true },
    { token: 'airwallex', name: 'Airwallex', verified: true },
    // --- Found by discover.js on 22 Aug 2026. ---
    { token: 'snowflake', name: 'Snowflake', verified: true },  // 3 India backend
    { token: 'livekit', name: 'LiveKit', verified: true },  // 1 India backend
    { token: 'plaid', name: 'Plaid', verified: true },  // 404s on Greenhouse, live here
    { token: 'redis', name: 'Redis', verified: true },
    { token: 'amplitude', name: 'Amplitude', verified: true },
    { token: 'airbyte', name: 'Airbyte', verified: true },
    { token: 'velocity', name: 'Velocity', verified: true },
    { token: 'replit', name: 'Replit', verified: true },
    { token: 'render', name: 'Render', verified: true },
    { token: 'railway', name: 'Railway', verified: true },
    { token: 'supabase', name: 'Supabase', verified: true },
    { token: 'temporal', name: 'Temporal', verified: true },
    { token: 'n8n', name: 'n8n', verified: true },
    { token: 'influxdata', name: 'InfluxData', verified: true },
    { token: 'materialize', name: 'Materialize', verified: true },
    // --- Second discover.js sweep, 22 Aug 2026 (439 tokens, 170 live). ---
    { token: 'sarvam', name: 'Sarvam AI', verified: true },  // 11 India backend
    { token: 'nanonets', name: 'Nanonets', verified: true },  // 4 India backend
    { token: 'kong', name: 'Kong', verified: true },  // 3 India backend
    { token: 'anyscale', name: 'Anyscale', verified: true },  // 3 India backend
    { token: 'openai', name: 'OpenAI', verified: true },  // 1 India backend
    { token: 'ditto', name: 'Ditto', verified: true },
    { token: 'bounce', name: 'Bounce', verified: true },
    { token: 'moderntreasury', name: 'Modern Treasury', verified: true },
    { token: 'zip', name: 'Zip', verified: true },
    { token: 'sentry', name: 'Sentry', verified: true },
    { token: 'posthog', name: 'PostHog', verified: true },
    { token: 'wundergraph', name: 'WunderGraph', verified: true },
    { token: 'cohere', name: 'Cohere', verified: true },
    { token: 'deepgram', name: 'Deepgram', verified: true },
    { token: 'elevenlabs', name: 'ElevenLabs', verified: true },
    { token: 'perplexity', name: 'Perplexity', verified: true },
    { token: 'modal', name: 'Modal', verified: true },
    { token: 'baseten', name: 'Baseten', verified: true },
    { token: 'runpod', name: 'RunPod', verified: true },
  ],

  // ---------------------------------------------------------------------------
  // SmartRecruiters - added 22 Aug 2026. Same deal as the other three: public,
  // unauthenticated, structured JSON. This is how Swiggy became reachable.
  //
  // Careful when probing: unlike the others, SmartRecruiters answers 200 with
  // an empty list for a company that does not exist, so "did it 404" is not a
  // liveness test - totalFound > 0 is.
  // ---------------------------------------------------------------------------
  smartrecruiters: [
    { token: 'swiggy', name: 'Swiggy', verified: true },        // 71 postings
    { token: 'unacademy', name: 'Unacademy', verified: true },  // 3 postings
    // --- Second discover.js sweep, 22 Aug 2026 (439 tokens, 170 live). ---
    { token: 'servicenow', name: 'ServiceNow', verified: true },  // 2 India backend
    { token: 'lendingkart', name: 'Lendingkart', verified: true },  // 1 India backend
    { token: 'freshworks', name: 'Freshworks', verified: true },  // 1 India backend
    { token: 'instahyre', name: 'Instahyre', verified: true },  // 1 India backend
    { token: 'upstox', name: 'Upstox', verified: true },
    { token: 'whatfix', name: 'Whatfix', verified: true },
    { token: 'shipsy', name: 'Shipsy', verified: true },
    { token: 'nobroker', name: 'NoBroker', verified: true },
    { token: 'cars24', name: 'Cars24', verified: true },
    { token: 'interviewbit', name: 'InterviewBit', verified: true },
    { token: 'uber', name: 'Uber', verified: true },
    { token: 'glean', name: 'Glean', verified: true },
    { token: 'turtlemint', name: 'Turtlemint', verified: true },
    { token: 'loophealth', name: 'Loop Health', verified: true },
    { token: 'statiq', name: 'Statiq', verified: true },
    { token: 'bluestone', name: 'BlueStone', verified: true },
    { token: 'newtonschool', name: 'Newton School', verified: true },
    { token: 'together', name: 'Together AI', verified: true },
  ],

  // ---------------------------------------------------------------------------
  // FILTERS - tuned to Ankit's profile
  // ---------------------------------------------------------------------------

  // Deliberately broad. An earlier version listed specific titles like
  // "software engineer" and "platform engineer" - it rejected BOTH
  // "Senior Engineer, Messaging Platform" and "Software Development Engineer III",
  // which were the two best real matches found. Titles vary too much to
  // whitelist. Cast wide here, let hardExcludes and scoring do the filtering.
  roleKeywords: ['engineer', 'developer', 'sde', 'architect', 'programmer', 'backend'],

  // Bengaluru or remote only.
  locationKeywords: [
    'bangalore', 'bengaluru', 'remote', 'anywhere', 'distributed',
    'india',           // bare "India" with no city named - usually remote/flexible
  ],

  // Checked BEFORE locationKeywords. A job naming one of these is rejected even
  // if the string also contains "India" (e.g. "Hyderabad, India"). Remove any
  // city you would actually relocate to.
  excludeCities: [
    'hyderabad', 'pune', 'chennai', 'mumbai', 'gurgaon', 'gurugram',
    'noida', 'delhi', 'kolkata', 'ahmedabad', 'jaipur', 'kochi',
    'coimbatore', 'trivandrum', 'thiruvananthapuram', 'indore', 'nagpur',
  ],

  // A posting with a blank/missing location field is kept rather than dropped -
  // some boards omit it entirely and those are worth a look.
  keepIfLocationMissing: true,

  // Instantly reject - these cost you nothing to filter out and save real time.
  hardExcludes: [
    'intern', 'internship', 'graduate', 'campus', 'fresher',
    // 'staff' alone, not 'staff engineer' - matching is whole-word now, and
    // 'staff engineer' never caught "Staff Software Engineer". Safe because
    // hardExcludes is tested against the title only.
    'staff', 'principal', 'director',
    // Bare 'manager', not just 'engineering manager' - that phrase missed
    // "Tech Lead Manager" (57 pts) and "Manager, Software Engineering" (31 pts).
    // Targeting IC roles, so any people-management title is out.
    'manager', 'vp ', 'head of',
    'data engineer', 'machine learning', 'ml engineer', 'data scientist',
    'android', 'ios ', 'mobile engineer', 'frontend', 'front end', 'front-end',
    'qa engineer', 'sdet', 'test engineer', 'devops', 'site reliability',
    // Added 20 Aug 2026 - all of these cleared the threshold on day one.
    'engineer in test',                    // "SDE in Test III" scored 36
    'support engineer', 'presales', 'pre-sales',
    'solutions engineer', 'solutions engineering',
    'sap',
    // Added 21 Aug 2026 - PhonePe's firmware role cleared at 20 pts.
    'firmware',
  ],

  // ---------------------------------------------------------------------------
  // SCORING - weights reflect what actually predicts a good match for you
  // ---------------------------------------------------------------------------
  scoring: {
    strong: {
      weight: 12,
      // Bare 'node ' and 'express' were removed on 20 Aug 2026: 'express' was
      // matching "express written consent" in JD legal footers, and 'node ' was
      // matching blockchain "node" - both awarding a phantom +12. Word-boundary
      // matching cannot fix these because both are real whole words there.
      // A genuine Node role names "Node.js" or "Express.js".
      terms: ['node.js', 'nodejs', 'javascript',
              'express.js', 'expressjs'],
    },
    // Real signal, but NOT on the resume. TypeScript and NestJS are neither
    // claimed nor demonstrated, so they must not carry demonstrated-stack
    // weight - that is what put HighLevel at #1 partly on tech Ankit would be
    // learning rather than showing. Same JS family and learnable in weeks,
    // so 6 rather than 0.
    adjacent: {
      weight: 6,
      terms: ['typescript', 'nestjs', 'nest.js'],
    },
    domain: {
      weight: 10,
      // Added 21 Aug 2026 from the resume: RBI compliance, AML validation and
      // PAN verification are distinctive Indian-banking signal that scored
      // zero before. 'pan verification' is a phrase on purpose - bare 'pan'
      // would match "Pan-India", which is in half the JDs in this market.
      terms: ['payment', 'fintech', 'banking', 'transaction', 'upi',
              'financial', 'ledger', 'settlement',
              'rbi', 'aml', 'kyc', 'pan verification'],
    },
    core: {
      weight: 6,
      terms: ['mongodb', 'nosql', 'redis', 'rest api', 'restful',
              'microservice', 'distributed system', 'docker', 'kubernetes',
              'ci/cd', 'event-driven', 'message queue', 'kafka', 'pub/sub',
              'caching', 'scalab', 'high availability', 'postgres', 'mysql',
              // Added 21 Aug 2026 - all four are on the resume and all four
              // scored zero before. DocumentDB and Oracle are the databases
              // behind the 2.6M-record migration.
              'documentdb', 'oracle', 'batch processing', 'parallel processing'],
    },
    bonus: {
      weight: 4,
      terms: ['retry', 'idempoten', 'deduplicat', 'rate limit', 'observability',
              'root cause', 'incident', 'migration', 'performance optimi'],
    },
    // Presence of these means the role is built on a stack you do not have.
    penalty: {
      weight: -14,
      // 'c++' removed 21 Aug 2026: C++ is on the resume's Languages line, so
      // docking 14 points for a JD mentioning it was simply wrong. The Core
      // Java entry stays - it is phrase-guarded to "strong experience in core
      // java" and only fires on Java-primary roles, which are the wrong stack
      // even though Core Java is a listed (and formerly taught) skill.
      terms: ['proficiency in go', 'golang required', 'strong experience in core java',
              'spring boot', 'scala', 'haskell', 'purescript', 'rust',
              'spark', 'hadoop', '.net', 'c#'],
    },
  },

  // How often index.js runs board discovery and adopts what it finds.
  // Not every run: discovery is ~1,800 requests and finds nothing unless a
  // company newly adopts one of the four ATS platforms or candidates.txt
  // grows. Override per-run with --discover-now or --no-discover.
  discoverEveryDays: 5,

  // Jobs scoring below this are logged but not surfaced in the report.
  minScore: 20,

  // Experience ceilings - a JD asking for more than this is a poor use of time.
  maxYearsRequired: 7,
};
