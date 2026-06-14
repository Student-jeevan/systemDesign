window.SDM = window.SDM || {};
window.SDM.layers = window.SDM.layers || {};
window.SDM.questions = window.SDM.questions || [];
window.SDM.roadmap = window.SDM.roadmap || [];
window.SDM.readiness = window.SDM.readiness || null;

window.SDM.layers[5] = {
  id: 5,
  title: 'High Level Design',
  subtitle: 'The 45-minute blueprint',
  duration: 'Weeks 25-36',
  icon: '🏗️',
  color: '#0f3460',
  sections: [
    {
      id: '5.1',
      title: 'HLD Framework',
      topics: [
        {
          id: '5.1.1',
          title: 'Requirement Gathering',
          icon: '📋',
          difficulty: 'beginner',
          content: `## Intuition
The worst thing you can do in an interview is start drawing architecture without understanding the problem. You must gather requirements to scope the system.

## Key Steps
1. **Functional Requirements:** What does the system *do*? (e.g., Users can upload photos, users can view a feed). Stick to 3-5 core features.
2. **Non-Functional Requirements:** How does the system *perform*? (e.g., High availability, low latency, 100M Daily Active Users).
3. **Out of Scope:** Explicitly state what you will NOT build (e.g., "I will not cover the authentication system or the analytics pipeline today").

## Interview Tip
Treat requirement gathering as a conversation, not an interrogation. Say "I assume we need high availability over strong consistency since this is a social media feed. Is that correct?"`,
          mermaidDiagram: null,
          asciiDiagram: null,
          resources: { beginner: [], intermediate: [], advanced: [] }
        },
        {
          id: '5.1.2',
          title: 'Capacity Estimation',
          icon: '🔢',
          difficulty: 'intermediate',
          content: `## Intuition
Back-of-the-envelope calculations prove that your proposed architecture will actually hold up to the expected traffic.

## The Metrics You Need
- **Traffic (QPS):** Calculate read QPS and write QPS separately. (e.g., 100M DAU * 10 reads/day / 100,000 sec/day = 10,000 Read QPS).
- **Storage:** Calculate how much data is generated per day, then multiply by 5 years. (e.g., 1M writes/day * 1MB photo = 1TB/day = 365TB/year).
- **Bandwidth:** Bytes per second entering and leaving the system.

## Interview Tip
Always round numbers to make math easy (e.g., 1 day is approx 100,000 seconds, not 86,400). If QPS is < 1000, you don't even need distributed systems. If QPS is > 10,000, you need caching, sharding, and CDNs.`,
          mermaidDiagram: null,
          asciiDiagram: null,
          resources: { beginner: [], intermediate: [], advanced: [] }
        }
      ]
    },
    {
      id: '5.2',
      title: 'HLD Projects',
      topics: [
        {
          id: '5.2.1',
          title: 'URL Shortener / TinyURL',
          icon: '🔗',
          difficulty: 'beginner',
          content: `## Requirements
- Generate a short alias (tinyurl.com/xyz) for a long URL.
- Redirect users to the original URL when they click the short link.
- Links expire after a certain time.
- Highly available and highly scalable reads.

## Capacity Estimation
- 100M URLs generated per month (Write QPS = ~40).
- 10B clicks per month (Read QPS = ~4000). Read-to-write ratio is 100:1.
- 10 years storage = 100M * 12 * 10 = 12 Billion records.

## API Design
- \`POST /api/v1/data/shorten\` (payload: \`{ longUrl }\`) -> Returns \`shortUrl\`
- \`GET /api/v1/shortUrl\` -> Returns \`301 Redirect to longUrl\`

## Core Design (The Algorithm)
How to generate the short URL?
- **Hash + Collision Resolution:** MD5 or SHA-1 hash the long URL, take the first 7 characters (Base62 encoded). If there's a collision in the DB, append a string and hash again.
- **Base62 Conversion of Unique ID:** Best approach. Use Twitter Snowflake or a centralized Ticket Server to generate a unique integer ID (e.g., 125). Convert 125 to Base62 (e.g., 'cb'). No collisions possible!

## Architecture
- Load Balancer -> Web Servers -> Redis (Cache) -> Database (Relational or NoSQL).

## Tradeoffs
- A \`301 Permanent Redirect\` means the browser caches the redirect. Good for lowering server load, bad for analytics (can't track every click).
- A \`302 Temporary Redirect\` means the browser hits your server every time. Good for analytics, higher server load.`,
          mermaidDiagram: `graph TD
A[Client] --> B(Load Balancer)
B --> C[Web Servers]
C --> D{Cache - Redis}
D -->|Miss| E[(Database - Postgres)]
D -->|Hit| C
C -->|URL not found| F[Unique ID Generator]
F --> E`,
          asciiDiagram: null,
          resources: { beginner: [], intermediate: [], advanced: [] }
        },
        {
          id: '5.2.2',
          title: 'Twitter / X Newsfeed',
          icon: '🐦',
          difficulty: 'advanced',
          content: `## Requirements
- Users can post tweets (text + images).
- Users can view their Newsfeed (tweets from people they follow, sorted chronologically).
- Users can follow/unfollow others.

## Core Design (Newsfeed Generation)
This is the heart of the problem.
**Approach 1: Pull Model (Fan-out on Read)**
When a user opens the app, fetch all people they follow, fetch their latest tweets, merge, sort, and return.
- *Pros:* Simple, works for people with millions of followers (Justin Bieber).
- *Cons:* Extremely slow for users who follow thousands of people (heavy joins).

**Approach 2: Push Model (Fan-out on Write)**
Maintain a pre-computed "Newsfeed List" in Redis for every user. When I post a tweet, asynchronously push that tweet ID to the Redis lists of all my followers.
- *Pros:* Instant reads (O(1) fetch from Redis).
- *Cons:* If Justin Bieber posts a tweet, you must update 100 million Redis lists. This causes a massive spike called the "Thundering Herd" or "Fan-out Problem".

**Approach 3: Hybrid Model (The Solution)**
- Normal users: Push model (Fan-out on write).
- Celebrities: Pull model (Fan-out on read). When you open your feed, fetch your pre-computed list, then explicitly fetch tweets from the celebrities you follow and merge them in memory.

## Architecture
- **Posting:** API -> Load Balancer -> Write Service -> DB & Fan-out workers (Kafka).
- **Reading:** API -> Load Balancer -> Feed Service -> Redis Feed Cache.`,
          mermaidDiagram: `graph TD
A[Justin Bieber] -->|Posts Tweet| B[Write Service]
B --> C[(Primary DB)]
B --> D{Kafka}
D --> E[Fan-out Worker]
E --> F[Cache Normal Followers Feeds]
G[User] -->|Reads Feed| H[Feed Service]
H --> I[Fetch Pre-computed Feed]
H --> J[Fetch Celeb Tweets & Merge]`,
          asciiDiagram: null,
          resources: { beginner: [], intermediate: [], advanced: [] }
        }
      ]
    }
  ]
};

window.SDM.layers[6] = {
  id: 6,
  title: 'Distributed Systems',
  subtitle: 'Handling failure at scale',
  duration: 'Weeks 37-42',
  icon: '🌐',
  color: '#533483',
  sections: [
    {
      id: '6.1',
      title: 'Consensus',
      topics: [
        {
          id: '6.1.1',
          title: 'The Consensus Problem',
          icon: '🤝',
          difficulty: 'advanced',
          content: `## Intuition
In a distributed system, how do multiple independent nodes agree on a single source of truth when the network is unreliable, messages can be dropped, and nodes can crash?

## Real-World Analogy
Five generals are camped around an enemy city. They must agree to attack or retreat simultaneously. If they don't agree, the attack fails. They can only communicate via messengers who might be killed by the enemy. How do they reach an agreement? (The Byzantine Generals Problem).

## Key Concepts
- **Split Brain:** When a network partition occurs, and two different nodes both think they are the Leader, causing data corruption.
- **Quorum:** A strict majority (e.g., 3 out of 5 nodes). Consensus algorithms require a quorum to make progress.

## Solutions
Paxos and Raft are the algorithms used to solve this. They power distributed locks, configuration management, and leader election.`,
          mermaidDiagram: null,
          asciiDiagram: null,
          resources: { beginner: [], intermediate: [], advanced: [] }
        },
        {
          id: '6.1.2',
          title: 'Raft',
          icon: '🚣',
          difficulty: 'advanced',
          content: `## Intuition
Raft is a consensus algorithm designed specifically to be easier to understand than Paxos.

## Key Concepts
1. **Leader Election:**
   - Nodes are Followers, Candidates, or Leaders.
   - If a Follower doesn't hear a heartbeat from the Leader, it becomes a Candidate and requests votes.
   - If it gets a majority of votes, it becomes the new Leader.
2. **Log Replication:**
   - The Leader receives client requests (logs).
   - It forwards logs to Followers.
   - Once a majority of Followers acknowledge the log, the Leader "commits" it and notifies the client.

## Where is it used?
Etcd (used in Kubernetes), Consul, CockroachDB.`,
          mermaidDiagram: null,
          asciiDiagram: null,
          resources: { beginner: [], intermediate: [], advanced: [] }
        }
      ]
    },
    {
      id: '6.3',
      title: 'Distributed Coordination',
      topics: [
        {
          id: '6.3.2',
          title: 'Distributed Locks',
          icon: '🔐',
          difficulty: 'advanced',
          content: `## Intuition
A normal mutex lock prevents two threads on the same server from modifying a variable at the same time. A Distributed Lock prevents two entirely different servers from modifying a shared resource (like a database row or an S3 file) at the same time.

## How It Works
You need an external, highly available system to hold the lock.
- **Redis (Redlock):** Set a key with an expiration (\`SETNX lock_key 1 EX 10\`). If successful, you hold the lock. Delete the key when done. (Caution: Redlock has theoretical flaws if server clocks jump).
- **ZooKeeper / Etcd:** The safest way. They use consensus protocols to guarantee lock integrity even during network partitions.

## Interview Tip
If you are designing a Ticket Booking system (BookMyShow), you must use a distributed lock (or DB row-level locking) to ensure two users don't book the exact same seat simultaneously.`,
          mermaidDiagram: null,
          asciiDiagram: null,
          resources: { beginner: [], intermediate: [], advanced: [] }
        }
      ]
    }
  ]
};

window.SDM.layers[7] = {
  id: 7,
  title: 'Real Interview System Design',
  subtitle: 'Cracking the 45-minute gauntlet',
  duration: 'Weeks 43-48',
  icon: '🎯',
  color: '#e94560',
  sections: [
    {
      id: '7.1',
      title: 'Interview Framework',
      topics: [
        {
          id: '7.1.1',
          title: 'The 45-Minute Framework',
          icon: '⏱️',
          difficulty: 'beginner',
          content: `## 0-5 mins: Understand the Goal & Scope
Ask clarifying questions. Define 3-5 core functional requirements. Define 2-3 non-functional requirements (Availability vs Consistency). Define out-of-scope items.

## 5-10 mins: Capacity Estimation & Constraints
Calculate Read/Write QPS. Calculate Storage needs. This proves you know the scale of the system. (Skip if interviewer says so).

## 10-15 mins: API Design
Define the contract. e.g., \`POST /api/v1/tweets\`, Payload: \`{user_id, text}\`. This acts as a bridge between requirements and architecture.

## 15-20 mins: Database Schema
Define the major tables/collections. State whether you are using SQL or NoSQL and justify why based on the scale and access patterns.

## 20-30 mins: High-Level Architecture
Draw the core components. Start simple: Client -> LB -> API -> DB. Then add Cache, CDNs, and Async Queues to meet the scale requirements.

## 30-40 mins: Deep Dive
The interviewer will pick a specific bottleneck (e.g., "How do you handle the Thundering Herd problem?" or "How do you ensure data isn't lost if the DB crashes?"). Dive deep into consensus, sharding, or replication.

## 40-45 mins: Wrap Up & Tradeoffs
Identify SPOFs. Discuss what you would do if traffic 100x'd. Acknowledge the tradeoffs of your design (e.g., "We chose eventual consistency for speed, so users might see stale follower counts").`,
          mermaidDiagram: null,
          asciiDiagram: null,
          resources: { beginner: [], intermediate: [], advanced: [] }
        }
      ]
    }
  ]
};

window.SDM.layers[8] = {
  id: 8,
  title: 'Production Engineering',
  subtitle: 'Day 2 operations and observability',
  duration: 'Weeks 49-52',
  icon: '🏭',
  color: '#0f3460',
  sections: [
    {
      id: '8.1',
      title: 'Observability',
      topics: [
        {
          id: '8.1.1',
          title: 'Monitoring & Metrics',
          icon: '📊',
          difficulty: 'beginner',
          content: `## Intuition
You cannot fix what you cannot see. Metrics tell you *that* something is broken.

## Key Concepts
- **The Four Golden Signals (SRE):**
  1. Latency (Time taken to serve requests).
  2. Traffic (QPS / Throughput).
  3. Errors (Rate of requests failing).
  4. Saturation (How "full" the system is - CPU/Memory/Disk).
- **Tools:** Prometheus (collects metrics), Grafana (visualizes them in dashboards).`,
          mermaidDiagram: null,
          asciiDiagram: null,
          resources: { beginner: [], intermediate: [], advanced: [] }
        },
        {
          id: '8.1.3',
          title: 'Distributed Tracing',
          icon: '🔍',
          difficulty: 'intermediate',
          content: `## Intuition
In a microservices architecture, a single user click might trigger requests across 10 different microservices. If it's slow, how do you know which service caused the delay?

## How It Works
When the API Gateway receives a request, it generates a unique \`Trace ID\`. This ID is injected into the HTTP headers and passed along to every downstream microservice. A centralized server (like Jaeger or Datadog) collects these traces and visualizes the entire waterfall journey of the request.

## Interview Tip
If you design a microservices architecture, mentioning Distributed Tracing for observability shows extreme seniority.`,
          mermaidDiagram: null,
          asciiDiagram: null,
          resources: { beginner: [], intermediate: [], advanced: [] }
        }
      ]
    }
  ]
};

// ==========================================
// INTERVIEW QUESTIONS
// ==========================================

window.SDM.questions = [
  {
    id: 1,
    title: 'Design a URL Shortener (TinyURL)',
    difficulty: 'beginner',
    category: 'Storage + Encoding',
    tags: ['hashing', 'base62', 'cache'],
    content: `## Clarifying Questions
- How many URLs are generated per month? (100M)
- What is the read/write ratio? (10:1 or 100:1)
- Do URLs expire? (Yes, default 5 years)
- Can users specify a custom alias? (Yes)

## Capacity Estimates
- Writes: 100M / 30 / 24 / 3600 = ~40 QPS.
- Reads: 40 * 100 = 4,000 QPS.
- Storage: 100M * 12 * 5 years * 500 bytes = ~3TB.

## Core Design
Use a relational DB (Postgres) or NoSQL (DynamoDB) to store \`{short_url, long_url, user_id, expires_at}\`.
To generate \`short_url\`:
Use a Snowflake ID generator to get a unique 64-bit integer. Convert that integer to Base62. A 7-character Base62 string can hold 62^7 = 3.5 trillion URLs.

## Deep Dive: Scaling Reads
Since read QPS is high and data rarely changes, put Redis in front of the DB. The API checks Redis first. If a cache miss occurs, check the DB, then update Redis.

## Tradeoffs
A 301 Permanent Redirect reduces load on our servers, but we lose analytics (click tracking). A 302 Temporary Redirect forces the browser to hit our server every time, allowing analytics but requiring more servers.`
  },
  {
    id: 2,
    title: 'Design a Rate Limiter',
    difficulty: 'beginner',
    category: 'API + Algorithms',
    tags: ['redis', 'token-bucket'],
    content: `## Clarifying Questions
- Does it rate limit by IP address or User ID? (Both, depending on the endpoint).
- Should we inform the user they are throttled? (Yes, return HTTP 429 Too Many Requests).
- Is this a distributed system? (Yes, multiple API Gateway nodes).

## Algorithms
The **Token Bucket** algorithm is best. Each user has a bucket with a capacity of \`N\` tokens. Tokens are refilled at rate \`R\`. Every request removes 1 token. If the bucket is empty, drop the request.

## Architecture
Implement the rate limiter as a middleware in the API Gateway. Since we have multiple API Gateways, we cannot store the buckets in local memory. We must use a centralized Redis cluster.

## Deep Dive: Redis Performance
Hitting Redis for every single request adds latency. 
**Optimization 1:** Use Redis Pipeline or Lua scripts to fetch and decrement the counter in a single atomic network trip.
**Optimization 2:** Local caching. The API Gateway can sync with Redis every few seconds, doing approximate rate limiting locally to save network hops (sacrifices strict accuracy for speed).`
  },
  {
    id: 3,
    title: 'Design an Autocomplete / Typeahead System',
    difficulty: 'intermediate',
    category: 'Search + Data Structures',
    tags: ['trie', 'caching', 'websockets'],
    content: `## Requirements
- As the user types, return 5 top search suggestions.
- Must be extremely fast (< 50ms latency).
- Must rank suggestions by popularity/frequency.

## Core Data Structure
A **Trie (Prefix Tree)**. Each node represents a character. Navigating down the tree spells a word.
Instead of just storing characters, each node should also store a list of the top 5 most popular queries that start with that prefix. This makes reads O(1) regarding tree traversal depth.

## Architecture
- The Trie is too big for one server. It must be sharded across multiple machines (e.g., shard by the first character: a-m on Server 1, n-z on Server 2).
- The Trie must be kept entirely in RAM (Redis or custom memory structure) for latency.

## Deep Dive: Updating the Trie
If a query becomes instantly viral (e.g., breaking news), how do we update the frequencies?
Do NOT update the Trie on every single search (write heavy). Instead, log all searches to Kafka. A backend worker aggregates the counts using a MapReduce job every 10 minutes and updates the Trie offline, then swaps the new Trie into production.`
  },
  {
    id: 4,
    title: 'Design Twitter / Newsfeed',
    difficulty: 'advanced',
    category: 'Social Network',
    tags: ['fanout', 'caching', 'hybrid'],
    content: `## Core Problem
How to generate a feed of tweets from thousands of people you follow in under 200ms?

## The Solution: Hybrid Fan-out
- **Fan-out on Write (Push):** For normal users. When User A posts a tweet, background workers push the Tweet ID into the Redis timeline caches of all of User A's followers. Reads are O(1).
- **Fan-out on Read (Pull):** For celebrities (users with >1M followers). If Justin Bieber tweets, pushing to 100M Redis caches will cause a massive lag (Thundering Herd). Instead, do NOT push his tweet.
- When a user opens their app, they pull their Redis cache (normal friends' tweets) AND explicitly pull the latest tweets from the celebrities they follow, merging them on the fly.

## Storage
- **Tweets:** Stored in a NoSQL DB (Cassandra or DynamoDB) keyed by TweetID.
- **Media:** Images/Videos stored in S3, served via CDN.
- **Social Graph (Followers):** Stored in a Graph DB (Neo4j) or a highly optimized Relational DB.`
  },
  {
    id: 5,
    title: 'Design a Distributed Message Queue (like Kafka)',
    difficulty: 'advanced',
    category: 'Infrastructure',
    tags: ['disk-io', 'distributed', 'consensus'],
    content: `## Core Design
Unlike RabbitMQ, Kafka does not delete messages when read. It is an **append-only log** stored on disk.
To make it fast, it relies heavily on Sequential Disk I/O (which is almost as fast as random RAM access) and the OS Page Cache.
It uses **Zero-Copy** (sendfile system call) to stream data directly from disk to the network socket without loading it into application space.

## Partitions & Scalability
A Topic is divided into Partitions. Each partition is hosted on a different broker. This allows parallel reads and writes. Ordering is ONLY guaranteed within a single partition, not across the whole topic.

## Replication
Every partition has a Leader and multiple Followers. Writes go to the Leader. Followers replicate the log. ZooKeeper (or KRaft) handles Leader Election if the Leader crashes.`
  }
];

// Add stubs for the remaining 95 questions to ensure it renders correctly
for (let i = 6; i <= 100; i++) {
  let diff = 'beginner';
  if (i > 35) diff = 'intermediate';
  if (i > 70) diff = 'advanced';
  
  window.SDM.questions.push({
    id: i,
    title: `System Design Question ${i}`,
    difficulty: diff,
    category: 'General Architecture',
    content: `## Clarifying Questions\nAsk about scale, read/write ratio, and core features.\n\n## High Level Design\nClient -> LB -> API -> DB with Cache.\n\n## Tradeoffs\nDiscuss consistency vs availability.`
  });
}

// ==========================================
// ROADMAP & READINESS
// ==========================================

window.SDM.roadmap = [];
for (let i = 1; i <= 52; i++) {
  let phase = "Foundations";
  let phaseNum = 1;
  if (i >= 9) { phase = "Building Blocks"; phaseNum = 2; }
  if (i >= 17) { phase = "Low Level Design"; phaseNum = 3; }
  if (i >= 25) { phase = "High Level Design"; phaseNum = 4; }
  if (i >= 37) { phase = "Distributed Systems"; phaseNum = 5; }
  if (i >= 43) { phase = "Interview Prep"; phaseNum = 6; }
  if (i >= 49) { phase = "Production & Polish"; phaseNum = 7; }

  window.SDM.roadmap.push({
    week: i,
    phase: phase,
    phaseNumber: phaseNum,
    title: `Curriculum Module - Week ${i}`,
    practice: 'Review concepts and draw architecture diagrams.',
    milestone: (i === 8 || i === 16 || i === 24 || i === 36 || i === 42 || i === 48 || i === 52)
  });
}

window.SDM.readiness = {
  levels: [
    { level: 0, name: 'No Knowledge', description: 'Can code, but cannot design a system.' },
    { level: 1, name: 'Vocabulary', description: 'Knows terms like LB, Cache, Sharding.' },
    { level: 2, name: 'Component Mastery', description: 'Knows when to use Redis vs Kafka vs Postgres.' },
    { level: 3, name: 'Basic Architecture', description: 'Can draw a 3-tier architecture.' },
    { level: 4, name: 'Tradeoff Analysis', description: 'Can defend choices and explain CAP theorem impacts.' },
    { level: 5, name: 'Senior Architect', description: 'Can design complex distributed systems and ace FAANG interviews.' }
  ]
};
