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
    // Postman left all four ATS platforms some time before 22 Sep 2026 -
    // 404 everywhere, and getpostman/postmanlabs are dead too. It was the
    // first company in this file and supplied 8 of the 23 seeded roles, so
    // check postman.com/company/careers by hand.
    // { token: 'postman', name: 'Postman', verified: false },
    // Migrated off Ashby to Greenhouse, found 22 Sep 2026.
    { token: 'amplitude', name: 'Amplitude', verified: true },
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
    // PhonePe left all four ATS platforms some time before 1 Sep 2026 -
    // 404 on Greenhouse/Lever/Ashby and empty on SmartRecruiters, and no
    // token variant works. Check phonepe.com/careers by hand; it is too
    // good a target to simply forget about.
    // { token: 'phonepe', name: 'PhonePe', verified: false },
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
    // { token: 'marqeta', name: 'Marqeta', verified: false }, // gone 1 Sep 2026
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
    // --- Third discover.js sweep, 25 Aug 2026 (531 tokens). ---
    { token: 'karbon', name: 'Karbon', verified: true },
    { token: 'airtable', name: 'Airtable', verified: true },
    { token: 'asana', name: 'Asana', verified: true },
    { token: 'smartsheet', name: 'Smartsheet', verified: true },  // 5 India backend
    { token: 'typeform', name: 'Typeform', verified: true },
    { token: 'calendly', name: 'Calendly', verified: true },
    { token: 'webflow', name: 'Webflow', verified: true },
    { token: 'wrike', name: 'Wrike', verified: true },
    { token: 'storyblok', name: 'Storyblok', verified: true },
    { token: 'contentful', name: 'Contentful', verified: true },
    { token: 'melio', name: 'Melio', verified: true },
    { token: 'algolia', name: 'Algolia', verified: true },
    // Auto-adopted by discover.js on 2026-08-30. Names are placeholders.
    { token: 'streamnative', name: 'StreamNative', verified: true },
    // Auto-adopted by discover.js on 2026-09-21. Names are placeholders.
    { token: 'clear', name: 'ClearTax', verified: true },
    { token: 'devrev', name: 'DevRev', verified: true },  // 5 India backend
    { token: 'cloudsek', name: 'CloudSEK', verified: true },
    { token: 'turing', name: 'Turing', verified: true },
    { token: 'tripadvisor', name: 'Tripadvisor', verified: true },
    { token: 'agoda', name: 'Agoda', verified: true },
    { token: 'squarespace', name: 'Squarespace', verified: true },
    { token: 'godaddy', name: 'GoDaddy', verified: true },
    { token: 'fastly', name: 'Fastly', verified: true },
    { token: 'vonage', name: 'Vonage', verified: true },  // 1 India backend
    { token: 'bandwidth', name: 'Bandwidth', verified: true },
    { token: 'okta', name: 'Okta', verified: true },  // 17 India backend
    { token: 'pingidentity', name: 'Ping Identity', verified: true },  // 1 India backend
    { token: 'beyondtrust', name: 'BeyondTrust', verified: true },
    { token: 'jfrog', name: 'JFrog', verified: true },
    { token: 'make', name: 'Make', verified: true },
    { token: 'hightouch', name: 'Hightouch', verified: true },
    { token: 'sumologic', name: 'Sumo Logic', verified: true },
    { token: 'veracode', name: 'Veracode', verified: true },
    // Adopted 23 Sep 2026 - FDE / Solutions Engineer sweep.
    { token: 'cresta', name: 'Cresta', verified: true },  // 1 India backend
    { token: 'snorkelai', name: 'Snorkel AI', verified: true },
    { token: 'labelbox', name: 'Labelbox', verified: true },
    { token: 'invisible', name: 'Invisible Technologies', verified: true },
    { token: 'heygen', name: 'HeyGen', verified: true },
    { token: 'vectara', name: 'Vectara', verified: true },
    { token: 'intercom', name: 'Intercom', verified: true },
    { token: 'polyai', name: 'PolyAI', verified: true },
    { token: 'dataiku', name: 'Dataiku', verified: true },
    { token: 'lithic', name: 'Lithic', verified: true },
    { token: 'highnote', name: 'Highnote', verified: true },
    { token: 'alloy', name: 'Alloy', verified: true },
    { token: 'veriff', name: 'Veriff', verified: true },
    { token: 'prismatic', name: 'Prismatic', verified: true },
    { token: 'zuora', name: 'Zuora', verified: true },  // 4 India backend
    { token: 'descope', name: 'Descope', verified: true },
    { token: 'iterable', name: 'Iterable', verified: true },
    { token: 'klaviyo', name: 'Klaviyo', verified: true },
    { token: 'customerio', name: 'Customer.io', verified: true },
    { token: 'attentive', name: 'Attentive', verified: true },
    { token: 'atomicwork', name: 'Atomicwork', verified: true },  // 4 India backend
    { token: 'nurix', name: 'Nurix AI', verified: true },
    { token: 'truefoundry', name: 'TrueFoundry', verified: true },  // 3 India backend
    // Adopted 24 Sep 2026 - sixth sweep (302 tokens, 147 live).
    { token: 'orkes', name: 'Orkes', verified: true },
    { token: 'glance', name: 'Glance', verified: true },  // 3 India backend
    { token: 'inmobi', name: 'InMobi', verified: true },  // 1 India backend
    { token: 'sigmoid', name: 'Sigmoid', verified: true },  // 5 India backend
    { token: 'affle', name: 'Affle', verified: true },
    { token: 'toast', name: 'Toast', verified: true },  // 1 India backend
    { token: 'samsara', name: 'Samsara', verified: true },
    { token: 'dropbox', name: 'Dropbox', verified: true },
    { token: 'duolingo', name: 'Duolingo', verified: true },
    { token: 'coursera', name: 'Coursera', verified: true },  // 1 India backend
    { token: 'udemy', name: 'Udemy', verified: true },
    { token: 'nextdoor', name: 'Nextdoor', verified: true },
    { token: 'twitch', name: 'Twitch', verified: true },
    { token: 'faire', name: 'Faire', verified: true },
    { token: 'upwork', name: 'Upwork', verified: true },
    { token: 'deliveroo', name: 'Deliveroo', verified: true },
    { token: 'xendit', name: 'Xendit', verified: true },
    { token: 'blend', name: 'Blend', verified: true },
    { token: 'upstart', name: 'Upstart', verified: true },
    { token: 'sofi', name: 'SoFi', verified: true },
    { token: 'n26', name: 'N26', verified: true },
    { token: 'truelayer', name: 'TrueLayer', verified: true },
    { token: 'fireblocks', name: 'Fireblocks', verified: true },
    { token: 'gemini', name: 'Gemini', verified: true },
    { token: 'bitgo', name: 'BitGo', verified: true },  // 1 India backend
    { token: 'consensys', name: 'Consensys', verified: true },
    { token: 'ripple', name: 'Ripple', verified: true },
    { token: 'cortex', name: 'Cortex', verified: true },
    { token: 'appian', name: 'Appian', verified: true },
    { token: 'unqork', name: 'Unqork', verified: true },
    { token: 'sigmacomputing', name: 'Sigma Computing', verified: true },
    { token: 'neo4j', name: 'Neo4j', verified: true },  // 2 India backend
    { token: 'tigergraph', name: 'TigerGraph', verified: true },
    { token: 'startree', name: 'StarTree', verified: true },  // 4 India backend
    { token: 'collibra', name: 'Collibra', verified: true },
    { token: 'tanium', name: 'Tanium', verified: true },
    { token: 'abnormalsecurity', name: 'Abnormal Security', verified: true },  // 8 India backend
    { token: 'island', name: 'Island', verified: true },
    { token: 'catonetworks', name: 'Cato Networks', verified: true },
    { token: 'expel', name: 'Expel', verified: true },
    { token: 'huntress', name: 'Huntress', verified: true },
    { token: 'bitwarden', name: 'Bitwarden', verified: true },
    { token: 'dashlane', name: 'Dashlane', verified: true },
    { token: 'yubico', name: 'Yubico', verified: true },
    { token: 'bigid', name: 'BigID', verified: true },
    { token: 'apiiro', name: 'Apiiro', verified: true },
    { token: 'endorlabs', name: 'Endor Labs', verified: true },  // 4 India backend
    { token: 'chainguard', name: 'Chainguard', verified: true },  // 2 India backend
    { token: 'thoropass', name: 'Thoropass', verified: true },
    { token: 'onetrust', name: 'OneTrust', verified: true },  // 1 India backend
    { token: 'ketch', name: 'Ketch', verified: true },  // 1 India backend
    { token: 'salesloft', name: 'Salesloft', verified: true },
    { token: 'zoominfo', name: 'ZoomInfo', verified: true },  // 5 India backend
    { token: 'pendo', name: 'Pendo', verified: true },
    { token: 'commercetools', name: 'commercetools', verified: true },
    { token: 'bloomreach', name: 'Bloomreach', verified: true },  // 1 India backend
    { token: 'vtex', name: 'VTEX', verified: true },
    { token: 'yotpo', name: 'Yotpo', verified: true },
    { token: 'dialpad', name: 'Dialpad', verified: true },  // 3 India backend
    { token: 'tines', name: 'Tines', verified: true },
    { token: 'torq', name: 'Torq', verified: true },
    { token: 'celonis', name: 'Celonis', verified: true },  // 21 India backend
    { token: 'pandadoc', name: 'PandaDoc', verified: true },
    { token: 'lattice', name: 'Lattice', verified: true },
    { token: 'cultureamp', name: 'Culture Amp', verified: true },
    { token: 'greenhouse', name: 'Greenhouse', verified: true },
    { token: 'checkr', name: 'Checkr', verified: true },
    { token: 'five9', name: 'Five9', verified: true },  // 9 India backend
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
    // --- Third discover.js sweep, 25 Aug 2026 (531 tokens). ---
    { token: 'kenko', name: 'Kenko', verified: true },
    { token: 'prismic', name: 'Prismic', verified: true },
    { token: 'zilliz', name: 'Zilliz', verified: true },
    { token: 'dlocal', name: 'dLocal', verified: true },
    // Auto-adopted by discover.js on 2026-09-21. Names are placeholders.
    { token: 'sonarsource', name: 'SonarSource', verified: true },
    { token: 'metabase', name: 'Metabase', verified: true },
    // Adopted 23 Sep 2026 - FDE / Solutions Engineer sweep.
    { token: 'finch', name: 'Finch', verified: true },
    { token: '100ms', name: '100ms', verified: true },  // 5 India backend
    // Adopted 24 Sep 2026 - sixth sweep (302 tokens, 147 live).
    { token: 'acceldata', name: 'Acceldata', verified: true },  // 3 India backend
    { token: 'toptal', name: 'Toptal', verified: true },
    { token: 'ninjavan', name: 'Ninja Van', verified: true },
    { token: 'coupa', name: 'Coupa', verified: true },  // 1 India backend
    { token: 'moonpay', name: 'MoonPay', verified: true },  // 1 India backend
    { token: 'anchorage', name: 'Anchorage Digital', verified: true },
    { token: 'mendix', name: 'Mendix', verified: true },
    { token: 'secureframe', name: 'Secureframe', verified: true },
    { token: 'quantummetric', name: 'Quantum Metric', verified: true },
    { token: 'outreach', name: 'Outreach', verified: true },  // 1 India backend
    { token: 'contentsquare', name: 'Contentsquare', verified: true },
    { token: 'aircall', name: 'Aircall', verified: true },
    { token: 'levelai', name: 'Level AI', verified: true },  // 1 India backend
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
    // Migrated off Greenhouse to Ashby, found 1 Sep 2026.
    { token: 'clickhouse', name: 'ClickHouse', verified: true },
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
    // --- Third discover.js sweep, 25 Aug 2026 (531 tokens). ---
    { token: 'miro', name: 'Miro', verified: true },
    { token: 'notion', name: 'Notion', verified: true },
    { token: 'clickup', name: 'ClickUp', verified: true },
    { token: 'sanity', name: 'Sanity', verified: true },
    { token: 'pinecone', name: 'Pinecone', verified: true },
    { token: 'weaviate', name: 'Weaviate', verified: true },
    { token: 'nubank', name: 'Nubank', verified: true },
    // Auto-adopted by discover.js on 2026-08-31. Names are placeholders.
    { token: 'expensify', name: 'Expensify', verified: true },
    // Auto-adopted by discover.js on 2026-09-21. Names are placeholders.
    { token: 'bureau', name: 'Bureau', verified: true },  // 1 India backend
    { token: 'semgrep', name: 'Semgrep', verified: true },
    { token: 'camunda', name: 'Camunda', verified: true },
    { token: 'zapier', name: 'Zapier', verified: true },
    { token: 'lightdash', name: 'Lightdash', verified: true },
    { token: 'incident', name: 'incident.io', verified: true },
    { token: 'doppler', name: 'Doppler', verified: true },
    { token: 'infisical', name: 'Infisical', verified: true },
    // Adopted 23 Sep 2026 - FDE / Solutions Engineer sweep.
    { token: 'sierra', name: 'Sierra', verified: true },
    { token: 'decagon', name: 'Decagon', verified: true },
    { token: 'harvey', name: 'Harvey', verified: true },  // 1 India backend
    { token: 'writer', name: 'Writer', verified: true },
    { token: 'hex', name: 'Hex', verified: true },
    { token: 'vanta', name: 'Vanta', verified: true },
    { token: 'drata', name: 'Drata', verified: true },
    { token: 'cognition', name: 'Cognition', verified: true },  // 1 India backend
    { token: 'mercor', name: 'Mercor', verified: true },
    { token: 'cursor', name: 'Cursor', verified: true },  // 2 India backend
    { token: 'langchain', name: 'LangChain', verified: true },
    { token: 'llamaindex', name: 'LlamaIndex', verified: true },
    { token: 'vapi', name: 'Vapi', verified: true },
    { token: 'cerebras', name: 'Cerebras', verified: true },  // 4 India backend
    { token: 'unstructured', name: 'Unstructured', verified: true },
    { token: 'abridge', name: 'Abridge', verified: true },
    { token: 'tavus', name: 'Tavus', verified: true },
    { token: 'synthesia', name: 'Synthesia', verified: true },
    { token: 'braintrust', name: 'Braintrust', verified: true },
    { token: 'patronus', name: 'Patronus AI', verified: true },
    { token: 'poolside', name: 'Poolside', verified: true },
    { token: 'parloa', name: 'Parloa', verified: true },
    { token: 'lorikeet', name: 'Lorikeet', verified: true },
    { token: 'rasa', name: 'Rasa', verified: true },
    { token: 'hyperscience', name: 'Hyperscience', verified: true },
    { token: 'rho', name: 'Rho', verified: true },
    { token: 'unit', name: 'Unit', verified: true },
    { token: 'column', name: 'Column', verified: true },
    { token: 'persona', name: 'Persona', verified: true },
    { token: 'sardine', name: 'Sardine', verified: true },
    { token: 'socure', name: 'Socure', verified: true },  // 2 India backend
    { token: 'middesk', name: 'Middesk', verified: true },
    { token: 'codat', name: 'Codat', verified: true },
    { token: 'merge', name: 'Merge', verified: true },
    { token: 'rutter', name: 'Rutter', verified: true },
    { token: 'nango', name: 'Nango', verified: true },
    { token: 'paddle', name: 'Paddle', verified: true },
    { token: 'stigg', name: 'Stigg', verified: true },
    { token: 'workos', name: 'WorkOS', verified: true },
    { token: 'clerk', name: 'Clerk', verified: true },
    { token: 'knock', name: 'Knock', verified: true },
    { token: 'signoz', name: 'SigNoz', verified: true },  // 4 India backend
    { token: 'composio', name: 'Composio', verified: true },
    { token: 'spotdraft', name: 'SpotDraft', verified: true },  // 1 India backend
    { token: 'gigaml', name: 'Giga', verified: true },
    { token: 'plane', name: 'Plane', verified: true },  // 4 India backend
    // Adopted 24 Sep 2026 - sixth sweep (302 tokens, 147 live).
    { token: 'thoughtworks', name: 'Thoughtworks', verified: true },  // 2 India backend
    { token: 'thumbtack', name: 'Thumbtack', verified: true },
    { token: 'andela', name: 'Andela', verified: true },
    { token: 'dave', name: 'Dave', verified: true },
    { token: 'mollie', name: 'Mollie', verified: true },
    { token: 'trustly', name: 'Trustly', verified: true },
    { token: 'primer', name: 'Primer', verified: true },
    { token: 'pleo', name: 'Pleo', verified: true },
    { token: 'qonto', name: 'Qonto', verified: true },
    { token: 'circle', name: 'Circle', verified: true },
    { token: 'paxos', name: 'Paxos', verified: true },  // 1 India backend
    { token: 'alchemy', name: 'Alchemy', verified: true },
    { token: 'opslevel', name: 'OpsLevel', verified: true },
    { token: 'coder', name: 'Coder', verified: true },
    { token: 'warp', name: 'Warp', verified: true },
    { token: 'e2b', name: 'E2B', verified: true },
    { token: 'zed', name: 'Zed', verified: true },
    { token: 'graphite', name: 'Graphite', verified: true },
    { token: 'linear', name: 'Linear', verified: true },
    { token: 'bubble', name: 'Bubble', verified: true },
    { token: 'inngest', name: 'Inngest', verified: true },
    { token: 'restate', name: 'Restate', verified: true },
    { token: 'kestra', name: 'Kestra', verified: true },
    { token: 'prefect', name: 'Prefect', verified: true },
    { token: 'astronomer', name: 'Astronomer', verified: true },
    { token: 'omni', name: 'Omni', verified: true },
    { token: 'cube', name: 'Cube', verified: true },  // 1 India backend
    { token: 'motherduck', name: 'MotherDuck', verified: true },
    { token: 'percona', name: 'Percona', verified: true },
    { token: 'montecarlodata', name: 'Monte Carlo', verified: true },
    { token: 'datafold', name: 'Datafold', verified: true },
    { token: 'illumio', name: 'Illumio', verified: true },
    { token: '1password', name: '1Password', verified: true },
    { token: 'sentra', name: 'Sentra', verified: true },
    { token: 'socket', name: 'Socket', verified: true },
    { token: 'gainsight', name: 'Gainsight', verified: true },
    { token: 'fullstory', name: 'FullStory', verified: true },
    { token: 'constructor', name: 'Constructor', verified: true },
    { token: 'gorgias', name: 'Gorgias', verified: true },
    { token: 'kustomer', name: 'Kustomer', verified: true },
    { token: 'uipath', name: 'UiPath', verified: true },  // 3 India backend
    { token: 'ashby', name: 'Ashby', verified: true },
    { token: 'beamery', name: 'Beamery', verified: true },
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
    // --- Third discover.js sweep, 25 Aug 2026 (531 tokens). ---
    { token: 'ixigo', name: 'ixigo', verified: true },
    { token: 'vegrow', name: 'Vegrow', verified: true },
    { token: 'captainfresh', name: 'Captain Fresh', verified: true },  // 1 India backend
    { token: 'canva', name: 'Canva', verified: true },
    // Auto-adopted by discover.js on 2026-09-21. Names are placeholders.
    { token: 'kodo', name: 'Kodo', verified: true },
    { token: 'facets', name: 'Facets', verified: true },
    { token: 'wayfair', name: 'Wayfair', verified: true },
    { token: 'unleash', name: 'Unleash', verified: true },
    // Adopted 23 Sep 2026 - FDE / Solutions Engineer sweep.
    { token: 'gong', name: 'Gong', verified: true },
    { token: 'koreai', name: 'Kore.ai', verified: true },
    { token: 'freecharge', name: 'Freecharge', verified: true },
    // Adopted 24 Sep 2026 - sixth sweep (302 tokens, 147 live).
    { token: 'securiti', name: 'Securiti', verified: true },
    { token: 'endava', name: 'Endava', verified: true },  // 1 India backend
    { token: 'grab', name: 'Grab', verified: true },
    { token: 'tembo', name: 'Tembo', verified: true },
    { token: 'hibob', name: 'HiBob', verified: true },
  ],

  // ---------------------------------------------------------------------------
  // FILTERS - tuned to Ankit's profile
  // ---------------------------------------------------------------------------

  // Deliberately broad. An earlier version listed specific titles like
  // "software engineer" and "platform engineer" - it rejected BOTH
  // "Senior Engineer, Messaging Platform" and "Software Development Engineer III",
  // which were the two best real matches found. Titles vary too much to
  // whitelist. Cast wide here, let hardExcludes and scoring do the filtering.
  // 'fde' and 'forward deployed' added 28 Aug 2026. "Forward Deployed
  // Engineer" already passed on 'engineer', but a bare "FDE II" or a
  // "Forward Deployed Strategist" carries no other role noun and was missed.
  roleKeywords: ['engineer', 'developer', 'sde', 'architect', 'programmer', 'backend',
                 'fde', 'forward deployed'],

  // Bengaluru or remote only.
  locationKeywords: [
    // 'distributed' removed 30 Aug 2026: Cloudflare labels every remote role
    // "Distributed", so it waved through postings for East China, Detroit and
    // Nashville. A genuinely distributed role still says 'remote' somewhere.
    'bangalore', 'bengaluru', 'remote', 'anywhere',
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
    // 'solutions engineer' / 'solutions engineering' removed 23 Sep 2026.
    // Integration-heavy SE roles at API and payments companies match the
    // resume (bank integrations, client-facing delivery, RCA), so they are
    // in scope now. Titles that say presales or customer engineer outright
    // stay excluded - those are the quota-carrying variants.
    'sap',
    // Added 21 Aug 2026 - PhonePe's firmware role cleared at 20 pts.
    'firmware',
    // Added 30 Aug 2026. Customer Engineer at Cloudflare et al is a
    // quota-carrying pre-sales role, not backend engineering.
    'customer engineer',
    // Added 30 Aug 2026 - all three surfaced repeatedly and none is backend
    // product engineering. 'salesforce' catches the CRM-developer roles that
    // score on 'javascript' and nothing else.
    'network engineer', 'security engineer', 'salesforce',
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
    // Added 23 Sep 2026 for Solutions Engineer and FDE roles, whose JDs name
    // the stack less and the customer work more. Every term is on the resume:
    // requirements straight from the bank, UAT, releases, production support,
    // integrations. Bare 'integration' is left out on purpose - it is in
    // nearly every backend JD and would lift everything evenly.
    delivery: {
      weight: 6,
      terms: ['customer-facing', 'client-facing', 'customer facing', 'client facing',
              'enterprise customer', 'stakeholder', 'uat', 'go-live',
              'production support', 'proof of concept', 'technical discovery',
              'api integration', 'third-party integration', 'system integration',
              'systems integration'],
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
  discoverEveryDays: 1,

  // How long a token that 404d is left alone before being retried. Dead
  // tokens are ~92% of all probes and are the reason a sweep looks like
  // enumeration rather than reading; retries are staggered by a hash of the
  // token so they spread evenly across days instead of arriving together.
  deadRetryDays: 7,

  // Jobs scoring below this are logged but not surfaced in the report.
  minScore: 20,

  // Experience ceilings - a JD asking for more than this is a poor use of time.
  maxYearsRequired: 7,
};
