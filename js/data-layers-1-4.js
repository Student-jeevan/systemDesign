window.SDM = window.SDM || {};
window.SDM.layers = window.SDM.layers || {};

window.SDM.layers[1] = {
  id: 1,
  title: 'Computer Science Foundations',
  subtitle: 'Build the vocabulary and mental models',
  duration: 'Weeks 1-4',
  icon: '🏗️',
  color: '#e94560',
  sections: [
    {
      id: '1.1',
      title: 'Performance Fundamentals',
      topics: [
        {
          id: '1.1.1',
          title: 'Latency',
          icon: '⏱️',
          difficulty: 'beginner',
          content: `## Intuition
Latency is the time it takes for a single unit of data to travel from its source to its destination and back. It is essentially the "waiting time" experienced by the user.

## Real-World Analogy
Imagine you are at a restaurant. Latency is the time between placing your order with the waiter and the moment the food arrives at your table.

## Key Concepts
- **Network Latency:** Time taken for a packet to traverse the network (e.g., speed of light in fiber, router processing).
- **Disk Latency:** Time to read/write from storage (SSD vs HDD).
- **Percentiles (p50, p95, p99):** p99 latency means 99% of requests are faster than this value. We care about tail latency (p99) because even if average latency is low, a slow p99 means many users have a bad experience.
- **Numbers Every Programmer Should Know:**
  - L1 cache reference: 0.5 ns
  - Main memory read: 100 ns
  - Read 1MB sequentially from SSD: 1 ms
  - Send packet CA to Netherlands to CA: 150 ms

## How It Works
Latency compounds. If your API calls a database (10ms latency) and a microservice (20ms latency) sequentially, your total backend latency is at least 30ms. Parallelizing these calls reduces latency to max(10ms, 20ms) = 20ms.

## Tradeoffs
Reducing latency often means moving data closer to the user (CDNs) or keeping it in memory (Caching). The tradeoff is increased system complexity and cost.

## Interview Tip
When an interviewer asks "How do we improve performance?", clarify if they mean latency or throughput. To reduce latency, suggest caching, CDNs, or executing tasks asynchronously.`,
          mermaidDiagram: `graph LR
A[Client] -->|Request - 50ms| B(Load Balancer)
B -->|1ms| C{App Server}
C -->|10ms| D[(Database)]
D -->|10ms| C
C -->|1ms| B
B -->|50ms| A
style A fill:#0d0d24,stroke:#7c3aed
style D fill:#1a1a3e,stroke:#06b6d4`,
          asciiDiagram: `
Client          Server          Database
  |               |                |
  |--- Request -->|                |
  |               |--- Query ----->|
  |               |<-- Data -------|
  |<-- Response --|                |
  |               |                |
          `,
          resources: {
            beginner: [{ title: 'Latency vs Throughput', url: 'https://bytebytego.com/courses/system-design-interview/scale-from-zero-to-millions-of-users', type: 'article' }],
            intermediate: [{ title: 'Latency Numbers Every Programmer Should Know', url: 'https://colin-scott.github.io/personal_website/research/interactive_latency.html', type: 'article' }],
            advanced: []
          },
          commonMistakes: ['Focusing on average latency instead of p99/tail latency.', 'Ignoring the speed of light limits in cross-region network calls.'],
          interviewQuestions: ['How would you reduce latency in an e-commerce checkout flow?', 'Why is p99 latency more important than average latency?']
        },
        {
          id: '1.1.2',
          title: 'Throughput',
          icon: '📊',
          difficulty: 'beginner',
          content: `## Intuition
Throughput is the volume of work completed in a given amount of time. In system design, it's typically measured in Requests Per Second (RPS) or Queries Per Second (QPS).

## Real-World Analogy
At the same restaurant, throughput is the number of meals the kitchen can cook and serve per hour. Adding more chefs increases throughput, but it doesn't necessarily cook a single meal any faster (latency).

## Key Concepts
- **QPS (Queries Per Second):** The rate of read/write requests.
- **Bandwidth vs Throughput:** Bandwidth is theoretical maximum capacity; throughput is actual achieved data transfer rate.
- **Bottlenecks:** Throughput is limited by the slowest component in your system (the bottleneck).
- **Little's Law:** \`L = λW\` (Concurrency = Throughput × Latency).

## How It Works
If your server takes 100ms to process a request (latency), a single thread can handle 10 requests per second. To increase throughput to 100 RPS without changing latency, you need 10 parallel threads.

## Tradeoffs
To increase throughput, you typically scale horizontally (add more servers). The tradeoff is the complexity of managing distributed state, load balancing, and potential consistency issues.

## Interview Tip
Always do a back-of-the-envelope calculation to estimate expected throughput (Peak QPS) before designing a system. This determines whether you need a single server or a distributed cluster.`,
          mermaidDiagram: `graph TD
A[Clients] -->|10,000 RPS| B(Load Balancer)
B -->|2,500 RPS| C1[Server 1]
B -->|2,500 RPS| C2[Server 2]
B -->|2,500 RPS| C3[Server 3]
B -->|2,500 RPS| C4[Server 4]
style B fill:#1a1a3e,stroke:#06b6d4`,
          asciiDiagram: null,
          resources: {
            beginner: [],
            intermediate: [],
            advanced: []
          },
          commonMistakes: ['Confusing throughput with latency.', 'Forgetting that throughput is limited by the bottleneck, not the average speed of components.'],
          interviewQuestions: ['Estimate the QPS for Twitter.', 'How do you increase throughput if the database is the bottleneck?']
        },
        {
          id: '1.1.3',
          title: 'Bandwidth',
          icon: '📡',
          difficulty: 'beginner',
          content: `## Intuition
Bandwidth is the maximum capacity of a communication channel to transmit data over a given amount of time. It is the "width of the pipe".

## Real-World Analogy
Think of a highway. Bandwidth is the number of lanes. Latency is the speed limit. Throughput is the actual number of cars passing a point per hour.

## Key Concepts
- Measured in bits per second (bps, Mbps, Gbps).
- Critical for systems transferring large media (video streaming, file sharing).
- Network interface cards (NICs) and switches have physical bandwidth limits (e.g., 10 Gbps).

## How It Works
If you need to serve a 5MB image to 1,000 concurrent users per second, you need: 5MB * 8 bits/byte = 40Mb. 40Mb * 1000 = 40,000 Mbps or 40 Gbps of bandwidth. A single 10Gbps NIC will be a bottleneck.

## Tradeoffs
Increasing bandwidth usually involves expensive network infrastructure upgrades or using Content Delivery Networks (CDNs) to offload traffic.

## Interview Tip
In interviews for systems like YouTube or Netflix, bandwidth calculation is more important than QPS calculation.`,
          mermaidDiagram: null,
          asciiDiagram: null,
          resources: { beginner: [], intermediate: [], advanced: [] },
          commonMistakes: [],
          interviewQuestions: ['Estimate the bandwidth required for Netflix.']
        }
      ]
    },
    {
      id: '1.2',
      title: 'Reliability Fundamentals',
      topics: [
        {
          id: '1.2.1',
          title: 'Availability',
          icon: '✅',
          difficulty: 'beginner',
          content: `## Intuition
Availability is the percentage of time a system is operational and responding correctly. It answers: "Is the system up right now?"

## Real-World Analogy
A convenience store that is open 24/7/365 has 100% availability. A store closed on Sundays has ~85% availability.

## Key Concepts
- **Nines:** 
  - 99% (Two nines) = ~3.65 days downtime/year.
  - 99.9% (Three nines) = ~8.7 hours downtime/year.
  - 99.99% (Four nines) = ~52.6 minutes downtime/year.
  - 99.999% (Five nines) = ~5.26 minutes downtime/year.
- **SLA, SLO, SLI:** Service Level Agreement (contract), Objective (internal target), Indicator (actual metric).
- **Single Point of Failure (SPOF):** A component whose failure brings down the entire system.

## How It Works
Availability of systems in series: \`A = A1 * A2\` (Lower than the weakest link).
Availability of systems in parallel: \`A = 1 - (1-A1)*(1-A2)\` (Much higher).

## Tradeoffs
Moving from 99.9% to 99.999% availability exponentially increases cost and complexity. It requires massive redundancy, automated failovers, and multi-region deployments.

## Interview Tip
Never say "100% availability". It's impossible. Target 99.9% or 99.99% depending on the business use case (e.g., healthcare needs higher availability than a cat picture app).`,
          mermaidDiagram: `graph TD
A[Load Balancer] --> B[Server A]
A --> C[Server B]
B -.-> D((DB Master))
C -.-> D
D --> E[(DB Replica 1)]
D --> F[(DB Replica 2)]
style A fill:#1a1a3e,stroke:#06b6d4`,
          asciiDiagram: null,
          resources: { beginner: [], intermediate: [], advanced: [] },
          commonMistakes: [],
          interviewQuestions: []
        },
        {
          id: '1.2.2',
          title: 'Reliability',
          icon: '🛡️',
          difficulty: 'beginner',
          content: `## Intuition
Reliability is the probability that a system will perform its intended function without failure over a specific time period.

## Real-World Analogy
A car that starts every morning and drives smoothly is reliable. If it starts, but the brakes fail randomly, it is highly available (it runs) but extremely unreliable (doesn't do its job safely).

## Key Concepts
- **MTBF (Mean Time Between Failures):** How long the system runs before breaking.
- **MTTR (Mean Time To Recovery):** How fast you can fix it when it breaks.
- Availability = MTBF / (MTBF + MTTR).

## Tradeoffs
Improving MTTR (fast rollback, automated alerts) is often cheaper and easier than infinitely improving MTBF (preventing all bugs).

## Interview Tip
Discuss "graceful degradation". If the recommendation engine fails, the system should still allow users to watch videos (like Netflix does), maximizing overall reliability.`,
          mermaidDiagram: null,
          asciiDiagram: null,
          resources: { beginner: [], intermediate: [], advanced: [] },
          commonMistakes: [],
          interviewQuestions: []
        },
        {
          id: '1.2.3',
          title: 'Durability',
          icon: '💾',
          difficulty: 'beginner',
          content: `## Intuition
Durability guarantees that once data is saved, it will never be lost, even in the event of hardware failure, power loss, or natural disasters.

## Real-World Analogy
Writing something in pencil on paper is not durable (can be erased or smudged). Etching it into a stone tablet and keeping copies in three different vaults is highly durable.

## Key Concepts
- **Replication:** Storing copies of data on multiple physical disks or servers.
- **Amazon S3:** Offers "11 nines" (99.999999999%) of durability.
- **Write-Ahead Logging (WAL):** Databases write changes to a sequential log file on disk before applying them, ensuring durability upon restart after a crash.

## Tradeoffs
High durability requires synchronous replication (wait for data to be written to multiple disks before telling the user "success"). This increases latency and reduces write throughput.

## Interview Tip
Differentiate between availability and durability. A database node crashing affects availability (you can't query it right now), but if the disk is intact, durability is maintained (data is not lost).`,
          mermaidDiagram: null,
          asciiDiagram: null,
          resources: { beginner: [], intermediate: [], advanced: [] },
          commonMistakes: [],
          interviewQuestions: []
        }
      ]
    },
    {
      id: '1.3',
      title: 'Scaling Fundamentals',
      topics: [
        {
          id: '1.3.1',
          title: 'Scalability',
          icon: '📈',
          difficulty: 'beginner',
          content: `## Intuition
Scalability is a system's ability to handle increasing amounts of work by adding resources.

## Real-World Analogy
If your restaurant gets too busy:
**Vertical Scaling (Scale Up):** Buy a faster oven and hire a faster chef.
**Horizontal Scaling (Scale Out):** Open a second restaurant or add more identical cooking stations.

## Key Concepts
- **Vertical Scaling:** Increasing CPU, RAM, or Disk of a single server. It has hard hardware limits and is a single point of failure, but requires no code changes.
- **Horizontal Scaling:** Adding more servers to the pool. It provides infinite scaling potential and fault tolerance, but requires load balancers and stateless applications.

## How It Works
Modern systems scale horizontally. Applications are made "stateless" (sessions are stored in Redis, not RAM) so any request can go to any server.

## Tradeoffs
Horizontal scaling introduces network latency and distributed systems complexity (data consistency, distributed transactions).

## Interview Tip
In an interview, start with a single server. When you hit bottlenecks, scale horizontally. Never propose vertical scaling as the final architecture for a massive scale system.`,
          mermaidDiagram: `graph TD
subgraph Vertical
A[Small Server] --> B[Giant Server]
end
subgraph Horizontal
C[Server 1] --> D[Load Balancer]
D --> E[Server 1]
D --> F[Server 2]
D --> G[Server 3]
end
style D fill:#1a1a3e,stroke:#7c3aed`,
          asciiDiagram: null,
          resources: { beginner: [], intermediate: [], advanced: [] },
          commonMistakes: [],
          interviewQuestions: []
        },
        {
          id: '1.3.2',
          title: 'Consistency',
          icon: '🔄',
          difficulty: 'beginner',
          content: `## Intuition
Consistency ensures that any read operation retrieves the most recently written data. In a distributed system with multiple copies of data, this is surprisingly hard.

## Real-World Analogy
If you update your phone number at the bank, the teller (Server A) knows it. If you immediately call customer support (Server B) and they still see your old number, the system is inconsistent.

## Key Concepts
- **Strong Consistency:** After a write completes, any subsequent read (from any node) will return the new value. High latency, lower availability.
- **Eventual Consistency:** If no new updates are made, eventually all nodes will return the last updated value. Low latency, high availability.
- **Read-Your-Own-Writes:** A user will always see their own updates immediately, even if other users don't yet.

## Tradeoffs
Strong consistency requires nodes to coordinate before responding to a read/write, which takes time. Eventual consistency is fast but users might see stale data.

## Interview Tip
For financial transactions, choose strong consistency (RDBMS). For a Twitter timeline or YouTube view count, choose eventual consistency (NoSQL, Caching) because speed is more important than absolute accuracy.`,
          mermaidDiagram: null,
          asciiDiagram: null,
          resources: { beginner: [], intermediate: [], advanced: [] },
          commonMistakes: [],
          interviewQuestions: []
        }
      ]
    },
    {
      id: '1.4',
      title: 'Distributed Systems Theorems',
      topics: [
        {
          id: '1.4.1',
          title: 'CAP Theorem',
          icon: '⚖️',
          difficulty: 'intermediate',
          content: `## Intuition
The CAP Theorem states that in a distributed data store, you can only guarantee two out of three properties simultaneously: Consistency, Availability, and Partition Tolerance.

## Real-World Analogy
Two bank branches lose phone connection (Network Partition). A customer tries to withdraw money from Branch A. 
- **Consistency Choice:** The teller refuses the transaction because they can't verify the balance with Branch B (Favors C, sacrifices A).
- **Availability Choice:** The teller gives the money, risking the customer withdrawing the same money at Branch B (Favors A, sacrifices C).

## Key Concepts
- **Consistency (C):** Every read receives the most recent write or an error.
- **Availability (A):** Every request receives a (non-error) response, without the guarantee that it contains the most recent write.
- **Partition Tolerance (P):** The system continues to operate despite an arbitrary number of messages being dropped/delayed between nodes.

## How It Works
Because network failures (Partitions) WILL happen in distributed systems, **P is not optional**. You must choose between CP (Consistency over Availability) or AP (Availability over Consistency).
- **CP Systems:** MongoDB, HBase, Redis (in certain configs). When partitioned, they reject writes to prevent split-brain.
- **AP Systems:** Cassandra, DynamoDB. When partitioned, they accept writes and resolve conflicts later (eventual consistency).

## Tradeoffs
It's a strict tradeoff during a network failure: do you return stale data (AP) or an error (CP)?

## Interview Tip
Never say "My system is CA." CA systems do not exist in distributed networks. You must explain whether your system favors CP or AP and why based on the product requirements.`,
          mermaidDiagram: `graph TD
A[Network Partition Occurs] --> B{Choose One}
B -->|Drop Request| C[CP System<br>Return Error]
B -->|Serve Stale Data| D[AP System<br>Return Old Data]
style B fill:#e94560,stroke:#fff`,
          asciiDiagram: null,
          resources: { beginner: [], intermediate: [], advanced: [] },
          commonMistakes: ['Thinking you can choose CA in a distributed system.', 'Treating CAP as a binary all-or-nothing (systems can tune consistency levels per query).'],
          interviewQuestions: ['Explain the CAP theorem.', 'Is Cassandra CP or AP?']
        },
        {
          id: '1.4.2',
          title: 'PACELC Theorem',
          icon: '🧭',
          difficulty: 'advanced',
          content: `## Intuition
CAP theorem only describes what happens *during* a network partition. PACELC expands on this to describe the tradeoffs *even when the network is perfectly fine*.

## Real-World Analogy
PACELC = "If there's a **P**artition, choose **A**vailability or **C**onsistency. **E**lse (when the network is fine), choose **L**atency or **C**onsistency."

## Key Concepts
- Even without a network failure, if you want Strong Consistency, you must wait for data to replicate to multiple nodes before responding. This increases Latency.
- If you want Low Latency, you respond immediately and replicate in the background. This sacrifices Strong Consistency.

## Examples
- **DynamoDB/Cassandra (PA/EL):** When partitioned, favors Availability. Else, favors Latency (eventual consistency).
- **MongoDB (PC/EC):** When partitioned, favors Consistency. Else, favors Consistency (reads from primary).
- **ZooKeeper (PC/EC):** Favors consistency in all scenarios.

## Tradeoffs
You are constantly trading off latency vs consistency.

## Interview Tip
Bringing up PACELC in a senior interview when someone mentions CAP is a huge positive signal. It shows you understand that consistency affects normal operational latency, not just failure scenarios.`,
          mermaidDiagram: null,
          asciiDiagram: null,
          resources: { beginner: [], intermediate: [], advanced: [] },
          commonMistakes: [],
          interviewQuestions: []
        }
      ]
    },
    {
      id: '1.5',
      title: 'Networking Foundations',
      topics: [
        {
          id: '1.5.1',
          title: 'TCP/IP & OSI Model',
          icon: '🌐',
          difficulty: 'beginner',
          content: `## Intuition
The OSI model is a conceptual framework explaining how data travels from an app on your computer over a physical wire to another computer.

## Real-World Analogy
Sending a letter:
Layer 7 (App): You write the letter.
Layer 4 (Transport): Post office registers it (TCP) or throws it in standard mail (UDP).
Layer 3 (Network): Adding zip codes and routing it across states (IP).
Layer 1 (Physical): The mail truck driving on the road.

## Key Concepts
- **Layer 7 (Application):** HTTP, FTP, SMTP, WebSockets. (Where API Gateways & L7 Load Balancers operate).
- **Layer 4 (Transport):** TCP (Reliable, ordered, slow handshake) vs UDP (Unreliable, unordered, fast). (Where L4 Load Balancers operate).
- **Layer 3 (Network):** IP addresses, routers.

## Tradeoffs: TCP vs UDP
- **TCP:** Guarantees delivery via acknowledgments (ACKs). Use for web pages, file transfers, APIs.
- **UDP:** Fire and forget. No handshake, no ACKs. Packets can be lost or out of order. Use for video calls, live gaming, metrics streaming.

## Interview Tip
Understand the TCP 3-way handshake (SYN, SYN-ACK, ACK). It adds a full round-trip of latency before any data is sent, which is why creating new connections is expensive and Connection Pooling is necessary.`,
          mermaidDiagram: `graph TD
A[Application - HTTP] --> B[Transport - TCP/UDP]
B --> C[Network - IP]
C --> D[Data Link - MAC]
D --> E[Physical - Wire]
style B fill:#533483,stroke:#fff`,
          asciiDiagram: null,
          resources: { beginner: [], intermediate: [], advanced: [] },
          commonMistakes: [],
          interviewQuestions: []
        },
        {
          id: '1.5.2',
          title: 'HTTP & HTTPS',
          icon: '🔒',
          difficulty: 'beginner',
          content: `## Intuition
HTTP is the language web browsers and servers use to talk to each other. HTTPS is the exact same language, but spoken inside a soundproof, locked room (encrypted).

## Real-World Analogy
HTTP is sending a postcard; anyone who touches it can read it. HTTPS is sending a locked box; only the recipient has the key.

## Key Concepts
- **Stateless:** Every HTTP request is independent. The server forgets you immediately. (Hence, we need cookies/sessions).
- **HTTPS (TLS/SSL):** Uses asymmetric cryptography (public/private keys) to establish a connection, then symmetric cryptography to encrypt the actual data.
- **HTTP/1.1:** Text-based, one request per TCP connection (head-of-line blocking).
- **HTTP/2:** Binary, multiplexed (many requests over one TCP connection), server push.
- **HTTP/3:** Built on QUIC (UDP) instead of TCP. Solves TCP head-of-line blocking.

## Tradeoffs
HTTPS adds latency via the TLS handshake (1-2 extra round trips). However, it is non-negotiable for security today. We use "SSL Termination" at the load balancer to offload the decryption CPU cost from app servers.

## Interview Tip
In a system design interview, specify that the Load Balancer or API Gateway handles SSL Termination, meaning traffic inside your internal private VPC is unencrypted HTTP for speed.`,
          mermaidDiagram: null,
          asciiDiagram: null,
          resources: { beginner: [], intermediate: [], advanced: [] },
          commonMistakes: [],
          interviewQuestions: []
        },
        {
          id: '1.5.3',
          title: 'DNS',
          icon: '📋',
          difficulty: 'beginner',
          content: `## Intuition
DNS (Domain Name System) is the phonebook of the internet. It translates human-readable names (google.com) into computer-readable IP addresses (142.250.190.46).

## Real-World Analogy
You know your friend's name, but not their phone number. You look up their name in your contacts app to get the number to dial.

## Key Concepts
- **Resolution Path:** Browser Cache -> OS Cache -> ISP Resolver -> Root Name Server -> TLD Server (.com) -> Authoritative Name Server.
- **A Record:** Maps a domain to an IPv4 address.
- **CNAME:** Maps a domain to another domain.
- **Geo-DNS:** Returns different IP addresses depending on the geographic location of the user (routes you to the closest datacenter).

## How It Works
To speed up this slow process, DNS records have a TTL (Time To Live). Your browser caches the IP for the TTL duration.

## Tradeoffs
A high TTL means fast resolution but slow recovery if you need to change your server's IP (users will go to the old IP until TTL expires). Low TTL means fast IP updates but more DNS queries.

## Interview Tip
DNS is often the first layer of load balancing. "Round-Robin DNS" can return a list of IP addresses to distribute traffic across multiple Load Balancers globally.`,
          mermaidDiagram: null,
          asciiDiagram: null,
          resources: { beginner: [], intermediate: [], advanced: [] },
          commonMistakes: [],
          interviewQuestions: []
        },
        {
          id: '1.5.4',
          title: 'Load Balancing Basics',
          icon: '⚡',
          difficulty: 'beginner',
          content: `## Intuition
A load balancer acts as a traffic cop, distributing incoming network traffic across a group of backend servers.

## Real-World Analogy
At a busy bank, a manager stands at the front and directs incoming customers to the next available teller so no single teller gets overwhelmed.

## Key Concepts
- Prevents single points of failure.
- Enables horizontal scaling.
- Acts as a reverse proxy.
- **Layer 4 LB:** Routes based on IP and Port (fast, dumb).
- **Layer 7 LB:** Routes based on HTTP headers, URL paths, cookies (slower, smart).

## Tradeoffs
Adding a load balancer introduces a new single point of failure. Therefore, load balancers themselves must be deployed in high-availability pairs (Active-Passive) using a heartbeat mechanism and floating IPs.

## Interview Tip
This is the most critical building block. The answer to "We have too much traffic for one server" is ALWAYS "Put a load balancer in front of multiple servers."`,
          mermaidDiagram: `graph TD
A[Clients] --> B{Load Balancer}
B --> C[Server 1]
B --> D[Server 2]
B --> E[Server 3]
style B fill:#e94560,stroke:#fff`,
          asciiDiagram: null,
          resources: { beginner: [], intermediate: [], advanced: [] },
          commonMistakes: [],
          interviewQuestions: []
        }
      ]
    }
  ]
};

window.SDM.layers[2] = {
  id: 2,
  title: 'Backend Engineering Foundations',
  subtitle: 'Deep understanding of backend primitives',
  duration: 'Weeks 5-8',
  icon: '⚙️',
  color: '#0f3460',
  sections: [
    {
      id: '2.1',
      title: 'API Design',
      topics: [
        {
          id: '2.1.1',
          title: 'REST APIs',
          icon: '🔌',
          difficulty: 'beginner',
          content: `## Intuition
REST (Representational State Transfer) is an architectural style for designing networked applications. It treats data as "Resources" (like users, posts, comments) manipulated by standard HTTP methods.

## Key Concepts
- **Statelessness:** No client context is stored on the server between requests.
- **HTTP Methods:** 
  - \`GET\` (Read)
  - \`POST\` (Create)
  - \`PUT\` (Update/Replace)
  - \`PATCH\` (Partial Update)
  - \`DELETE\` (Remove)
- **Status Codes:** 200 (OK), 201 (Created), 400 (Bad Request), 401 (Unauthorized), 404 (Not Found), 500 (Internal Error).
- **Idempotency:** An operation is idempotent if making multiple identical requests has the same effect as making a single request. \`GET\`, \`PUT\`, \`DELETE\` are idempotent. \`POST\` is NOT.

## Design Best Practices
- Use plural nouns: \`/users/123\`, not \`/getUser?id=123\`
- Nesting for relations: \`/users/123/posts/45\`
- Versioning: \`/api/v1/users\`

## Tradeoffs
REST can suffer from over-fetching (getting back more data than you need) and under-fetching (needing to make multiple requests to get related data).

## Interview Tip
If an interviewer asks you to design an API, define the endpoints explicitly. e.g., \`POST /api/v1/tweets\`, Payload: \`{text: "hello", user_id: 123}\`, Response: \`201 Created\`.`,
          mermaidDiagram: null,
          asciiDiagram: null,
          resources: { beginner: [], intermediate: [], advanced: [] },
          commonMistakes: [],
          interviewQuestions: []
        },
        {
          id: '2.1.2',
          title: 'GraphQL',
          icon: '📐',
          difficulty: 'intermediate',
          content: `## Intuition
GraphQL is a query language for APIs. Instead of having multiple endpoints returning fixed data structures (like REST), GraphQL has a single endpoint. The client asks for exactly the data it needs, and nothing more.

## Real-World Analogy
REST is like ordering a set meal combo #3 at a restaurant; you get the burger, fries, and drink whether you want them all or not. GraphQL is a buffet where you pick exactly the foods and portions you want.

## Key Concepts
- **Schema:** Strongly typed definition of your data graph.
- **Query:** Fetch data (like GET).
- **Mutation:** Modify data (like POST/PUT).
- **Resolvers:** Functions on the server that fetch the data for specific fields.

## Tradeoffs
- **Pros:** Solves over-fetching and under-fetching. Great for mobile networks.
- **Cons:** Extremely hard to cache at the network/CDN level because everything is a \`POST\` to \`/graphql\`. Prone to the "N+1 query problem" on the backend unless using DataLoaders.

## Interview Tip
Only propose GraphQL if the client applications have highly variable data requirements (e.g., a mobile app needs less data than the desktop web app). For service-to-service communication, gRPC or REST is better.`,
          mermaidDiagram: null,
          asciiDiagram: null,
          resources: { beginner: [], intermediate: [], advanced: [] },
          commonMistakes: [],
          interviewQuestions: []
        },
        {
          id: '2.1.3',
          title: 'gRPC',
          icon: '🚀',
          difficulty: 'advanced',
          content: `## Intuition
gRPC is a modern, high-performance Remote Procedure Call (RPC) framework developed by Google. It allows a client application to directly call a method on a server application on a different machine as if it were a local object.

## Key Concepts
- **Protocol Buffers (Protobuf):** gRPC uses Protobuf as its Interface Definition Language (IDL) and data serialization format. It is a highly compressed binary format.
- **HTTP/2:** gRPC runs exclusively over HTTP/2, enabling multiplexing and streaming.
- **Streaming:** Supports Unary (1 to 1), Server Streaming, Client Streaming, and Bidirectional Streaming.

## Tradeoffs
- **Pros:** Extremely fast, small payload size, strongly typed contracts across different programming languages.
- **Cons:** Not natively supported by web browsers (requires gRPC-web proxy). Payload is not human-readable (binary), making debugging harder than JSON.

## Interview Tip
gRPC is the gold standard for **internal microservice-to-microservice communication** due to its high performance and low latency. It is rarely used for public-facing mobile/web APIs.`,
          mermaidDiagram: null,
          asciiDiagram: null,
          resources: { beginner: [], intermediate: [], advanced: [] },
          commonMistakes: [],
          interviewQuestions: []
        },
        {
          id: '2.1.4',
          title: 'WebSockets',
          icon: '🔗',
          difficulty: 'intermediate',
          content: `## Intuition
WebSockets provide a persistent, full-duplex, two-way communication channel over a single TCP connection.

## Real-World Analogy
HTTP is like a walkie-talkie (one person speaks, waits, other person responds). WebSockets are like a phone call (both people can talk and listen at the same time continuously).

## Key Concepts
- Starts as a standard HTTP request, then "upgrades" to a WebSocket connection.
- Server can push data to the client without the client requesting it.
- **Alternatives:** Long-Polling (client holds connection open), Server-Sent Events (SSE - server pushes, client only receives).

## Tradeoffs
Maintaining millions of open persistent connections requires massive server RAM and specific load balancer configurations. It breaks standard HTTP load balancing and caching.

## Interview Tip
Use WebSockets for real-time applications: Chat apps (WhatsApp), Live sports scores, Stock trading tickers, Collaborative editing (Google Docs).`,
          mermaidDiagram: `sequenceDiagram
    Client->>Server: HTTP GET (Upgrade: websocket)
    Server-->>Client: HTTP 101 Switching Protocols
    Note over Client,Server: Persistent TCP Connection Established
    Server->>Client: Event: User joined
    Client->>Server: Message: Hello
    Server->>Client: Message: Hi there
    Client->>Server: Close Connection`,
          asciiDiagram: null,
          resources: { beginner: [], intermediate: [], advanced: [] },
          commonMistakes: [],
          interviewQuestions: []
        }
      ]
    },
    {
      id: '2.2',
      title: 'Authentication & Authorization',
      topics: [
        {
          id: '2.2.1',
          title: 'Sessions',
          icon: '🍪',
          difficulty: 'beginner',
          content: `## Intuition
Session-based authentication stores user state on the server. The server gives the client a tiny reference ID (Session ID) stored in a cookie.

## How It Works
1. User logs in with username/password.
2. Server validates, creates a session record in memory or a database (e.g., Redis).
3. Server sends a \`Set-Cookie: session_id=abc\` header.
4. Browser automatically sends this cookie on all future requests.
5. Server looks up \`abc\` in Redis to identify the user.

## Tradeoffs
- **Pros:** Highly secure (can instantly invalidate a session on the server), easy to implement.
- **Cons:** Server is stateful. If you have 3 servers behind a load balancer, the session data must be shared among them (usually using Redis), which adds an infrastructure dependency.`,
          mermaidDiagram: null,
          asciiDiagram: null,
          resources: { beginner: [], intermediate: [], advanced: [] },
          commonMistakes: [],
          interviewQuestions: []
        },
        {
          id: '2.2.2',
          title: 'JWT (JSON Web Tokens)',
          icon: '🎫',
          difficulty: 'intermediate',
          content: `## Intuition
JWT is a stateless authentication mechanism. Instead of storing a session on the server, the server cryptographically signs a JSON payload containing the user's info and gives it to the client.

## Key Concepts
- Contains 3 parts: Header, Payload (data), Signature.
- The server validates the user by mathematically verifying the signature using a secret key.
- **Stateless:** The server does NOT need to query a database to know who you are.

## Tradeoffs
- **Pros:** Excellent for microservices. Any service with the public key can verify the user. Saves a database round-trip.
- **Cons:** **Revocation is extremely hard.** If a token is stolen, you cannot easily invalidate it before it expires because the server has no state. You must use short expiration times + Refresh Tokens.

## Interview Tip
In highly scaled distributed systems, JWTs are preferred to avoid querying a central session database for every single request. But acknowledge the revocation tradeoff.`,
          mermaidDiagram: null,
          asciiDiagram: null,
          resources: { beginner: [], intermediate: [], advanced: [] },
          commonMistakes: [],
          interviewQuestions: []
        },
        {
          id: '2.2.3',
          title: 'OAuth 2.0',
          icon: '🔐',
          difficulty: 'advanced',
          content: `## Intuition
OAuth 2.0 is an authorization framework that enables applications to obtain limited access to user accounts on an HTTP service (like Facebook or Google) without getting their passwords.

## Real-World Analogy
It's like a valet key for a car. You give the valet a special key that only allows them to drive the car, but not open the trunk or glove box. You never give them your master key.

## Key Concepts
- **Roles:** Resource Owner (User), Client (Your App), Authorization Server (Google), Resource Server (Google Drive API).
- **Authorization Code Flow:** The most secure flow. The frontend redirects to Google, user logs in, redirects back with a code. Backend exchanges the code for an Access Token.

## Interview Tip
Don't reinvent the wheel. If asked to design a login system, mention using OAuth 2.0 / OpenID Connect with providers like Auth0 or Cognito.`,
          mermaidDiagram: null,
          asciiDiagram: null,
          resources: { beginner: [], intermediate: [], advanced: [] },
          commonMistakes: [],
          interviewQuestions: []
        },
        {
          id: '2.2.4',
          title: 'RBAC & ABAC',
          icon: '👥',
          difficulty: 'intermediate',
          content: `## Intuition
Authentication verifies *who* you are. Authorization verifies *what* you are allowed to do.

## Key Concepts
- **RBAC (Role-Based Access Control):** Permissions are assigned to Roles (e.g., "Admin", "Viewer"). Users are assigned to Roles. If "Admin" can delete posts, any user with the "Admin" role can delete posts.
- **ABAC (Attribute-Based Access Control):** Rules evaluate attributes. E.g., "User can delete a document IF user.department == doc.department AND time == business_hours."

## Tradeoffs
RBAC is simple and sufficient for 90% of applications. ABAC is highly flexible but incredibly complex to manage and evaluate computationally.`,
          mermaidDiagram: null,
          asciiDiagram: null,
          resources: { beginner: [], intermediate: [], advanced: [] },
          commonMistakes: [],
          interviewQuestions: []
        }
      ]
    },
    {
      id: '2.3',
      title: 'Caching',
      topics: [
        {
          id: '2.3.1',
          title: 'Caching Fundamentals',
          icon: '💨',
          difficulty: 'beginner',
          content: `## Intuition
Caching is storing copies of frequently accessed data in a fast, temporary storage layer (usually RAM) to serve future requests faster.

## Real-World Analogy
A librarian keeps the most popular books on her desk (Cache) instead of walking to the back archives (Database) every time someone asks for them.

## Key Concepts
- **Cache Hit:** Data found in cache (Fast).
- **Cache Miss:** Data not found, must query database (Slow).
- **Cache-Aside Pattern:** Application code checks cache. If miss, it queries DB, writes to cache, and returns data.
- **Write-Through Pattern:** App writes to cache, cache synchronously writes to DB.

## Tradeoffs
RAM is expensive and volatile (data is lost on reboot). Data in cache can become "stale" (out of sync with the database).

## Interview Tip
Caching is the ultimate cheat code in system design. Read-heavy systems (Twitter, YouTube) rely entirely on massive caching layers.`,
          mermaidDiagram: `graph TD
A[Application] -->|1. Request Data| B{Cache}
B -->|2. Cache Hit| A
B -->|3. Cache Miss| C[(Database)]
C -->|4. Return Data| A
A -->|5. Save Data| B
style B fill:#533483,stroke:#fff`,
          asciiDiagram: null,
          resources: { beginner: [], intermediate: [], advanced: [] },
          commonMistakes: [],
          interviewQuestions: []
        },
        {
          id: '2.3.2',
          title: 'Cache Invalidation',
          icon: '🗑️',
          difficulty: 'advanced',
          content: `## Intuition
"There are only two hard things in Computer Science: cache invalidation and naming things." When the database is updated, the cache must be updated or deleted so users don't see old data.

## Key Strategies
1. **Time-To-Live (TTL):** Set a timeout (e.g., 5 mins). After 5 mins, the cache expires. Simple, but guarantees some staleness.
2. **Event-Based Invalidation:** When App updates DB, it explicitly deletes the cache key.
3. **Change Data Capture (CDC):** A tool tails the DB transaction log and automatically invalidates the cache (complex, but robust).

## Cache Stampede / Thundering Herd
If a highly popular cache key (e.g., Virat Kohli's profile during a match) expires, 10,000 requests might hit the DB simultaneously before the cache is repopulated, crashing the DB.
**Solution:** Mutex locks (only let 1 request query DB to repopulate cache) or probabilistic early expiration.`,
          mermaidDiagram: null,
          asciiDiagram: null,
          resources: { beginner: [], intermediate: [], advanced: [] },
          commonMistakes: [],
          interviewQuestions: []
        }
      ]
    },
    {
      id: '2.4',
      title: 'Database Foundations',
      topics: [
        {
          id: '2.4.1',
          title: 'SQL vs NoSQL',
          icon: '🗄️',
          difficulty: 'beginner',
          content: `## Intuition
SQL databases (Relational) store data in rigid tables with rows and columns. NoSQL databases (Non-Relational) store data in flexible formats like JSON documents, key-value pairs, or graphs.

## Key Concepts
- **SQL (PostgreSQL, MySQL):** Structured schema, ACID compliant, uses JOINs. Scales vertically well, hard to scale horizontally (sharding is complex).
- **NoSQL (MongoDB, Cassandra, DynamoDB):** Schema-less or flexible schema, generally BASE (eventual consistency). Designed from the ground up for horizontal scaling and massive throughput.

## Tradeoffs
Choose SQL when data is highly structured, relationships are complex, and data integrity (ACID) is critical (Financial systems). Choose NoSQL for massive scale, rapid schema iteration, or simple key-value lookups (Shopping cart, gaming leaderboards).

## Interview Tip
Start with a Relational DB by default unless you have a specific reason for NoSQL (e.g., "We need to handle 100,000 writes per second, so Cassandra is a better fit").`,
          mermaidDiagram: null,
          asciiDiagram: null,
          resources: { beginner: [], intermediate: [], advanced: [] },
          commonMistakes: [],
          interviewQuestions: []
        },
        {
          id: '2.4.2',
          title: 'Indexing',
          icon: '📑',
          difficulty: 'intermediate',
          content: `## Intuition
An index is a data structure (like the index at the back of a book) that improves the speed of data retrieval operations on a database at the cost of additional storage space and slower writes.

## Key Concepts
- **B-Tree / B+ Tree:** The default index type for SQL databases. Great for exact matches and range queries (\`WHERE age BETWEEN 20 AND 30\`).
- **Hash Index:** Fast for exact matches, useless for range queries.
- **Composite Index:** An index on multiple columns (e.g., \`last_name, first_name\`). Order matters!
- **Covering Index:** An index that contains all the data needed to satisfy the query, meaning the DB doesn't have to look up the actual row at all.

## Tradeoffs
Every index speeds up READS but slows down WRITES (because the index must be updated on every INSERT/UPDATE). Don't index every column.

## Interview Tip
When designing a database schema, explicitly mention which columns you will index (usually foreign keys, columns used in WHERE, ORDER BY, or GROUP BY clauses).`,
          mermaidDiagram: null,
          asciiDiagram: null,
          resources: { beginner: [], intermediate: [], advanced: [] },
          commonMistakes: [],
          interviewQuestions: []
        },
        {
          id: '2.4.3',
          title: 'Query Optimization',
          icon: '⚡',
          difficulty: 'advanced',
          content: `## Intuition
Writing a query is easy. Writing a query that runs fast on a table with 100 million rows requires understanding how the database execution engine works.

## Key Concepts
- **N+1 Query Problem:** Fetching a list of 100 posts, and then making 100 separate queries to fetch the author for each post. **Fix:** Use JOINs or IN clauses to fetch data in bulk.
- **Denormalization:** Intentionally duplicating data to avoid expensive JOINs. (e.g., storing \`author_name\` directly on the \`posts\` table).
- **EXPLAIN Plan:** Prefixing a SQL query with \`EXPLAIN\` tells the DB to show you its strategy (Index Scan vs Full Table Scan) without actually running the query.

## Interview Tip
Denormalization is a very common optimization in system design interviews for read-heavy systems. You trade storage space and write complexity for massive read speed improvements.`,
          mermaidDiagram: null,
          asciiDiagram: null,
          resources: { beginner: [], intermediate: [], advanced: [] },
          commonMistakes: [],
          interviewQuestions: []
        },
        {
          id: '2.4.4',
          title: 'Connection Pooling',
          icon: '🏊',
          difficulty: 'intermediate',
          content: `## Intuition
Opening a new TCP connection and authenticating with a database takes time (latency). A connection pool keeps a set of open, reusable connections ready for the application to use.

## How It Works
Instead of connecting/disconnecting for every query, the app "borrows" an active connection from the pool, runs the query, and "returns" it to the pool.

## Tradeoffs
Databases have hard limits on max connections (e.g., Postgres defaults to 100). If you have 50 microservices, each with a pool of 10, you need 500 DB connections, crashing the DB. You need a proxy like PgBouncer.

## Interview Tip
If your architecture features serverless functions (like AWS Lambda) hitting a relational DB, you MUST mention connection pooling (like RDS Proxy) or the DB will crash from too many connections.`,
          mermaidDiagram: null,
          asciiDiagram: null,
          resources: { beginner: [], intermediate: [], advanced: [] },
          commonMistakes: [],
          interviewQuestions: []
        },
        {
          id: '2.4.5',
          title: 'Transactions & Isolation Levels',
          icon: '🔒',
          difficulty: 'advanced',
          content: `## Intuition
A transaction is a sequence of operations treated as a single, indivisible unit of work (ACID - Atomicity, Consistency, Isolation, Durability). 

## Key Concepts
Isolation defines how/when the changes made by one operation become visible to other concurrent operations.
- **Read Uncommitted:** Can see uncommitted changes (Dirty Reads). Fast but dangerous.
- **Read Committed:** Default in Postgres. Only sees committed data.
- **Repeatable Read:** Guarantees if you read a row twice in a txn, it hasn't changed.
- **Serializable:** Strictest. Executes txns as if they were perfectly sequential. Extremely slow.

## Optimistic vs Pessimistic Locking
- **Pessimistic:** Lock the row (\`SELECT FOR UPDATE\`) before doing work.
- **Optimistic:** Don't lock. Use a version number. When updating, fail if the version changed in the background.

## Interview Tip
Use Optimistic locking for booking systems (BookMyShow) where collisions are rare but reads are high. Use Pessimistic locking in financial ledgers.`,
          mermaidDiagram: null,
          asciiDiagram: null,
          resources: { beginner: [], intermediate: [], advanced: [] },
          commonMistakes: [],
          interviewQuestions: []
        }
      ]
    }
  ]
};

window.SDM.layers[3] = {
  id: 3,
  title: 'System Design Building Blocks',
  subtitle: 'Master the "Lego pieces" of system design',
  duration: 'Weeks 9-16',
  icon: '🧱',
  color: '#533483',
  sections: [
    {
      id: '3.1',
      title: 'Load Balancers Deep Dive',
      topics: [
        {
          id: '3.1.1',
          title: 'Types of Load Balancers',
          icon: '⚖️',
          difficulty: 'beginner',
          content: `## Intuition
Load balancers can operate at different levels of the network stack, offering different balances of speed vs smarts.

## Key Concepts
- **Layer 4 (L4) Load Balancer:** Operates at the Transport Layer (TCP/UDP). It only looks at the IP address and Port. It doesn't inspect the content. Extremely fast, very low latency.
- **Layer 7 (L7) Load Balancer:** Operates at the Application Layer (HTTP). It decrypts the SSL, looks inside the HTTP payload, and routes based on URL path, cookies, or headers. Slower, but much smarter.

## Production Examples
- AWS Network Load Balancer (NLB) is L4.
- AWS Application Load Balancer (ALB) is L7.
- NGINX and HAProxy can do both.

## Interview Tip
Use L4 balancers for raw scale and performance (e.g., routing traffic to different data centers). Use L7 balancers internally to route microservice traffic based on URL paths (e.g., \`/api/users\` goes to User Service).`,
          mermaidDiagram: null,
          asciiDiagram: null,
          resources: { beginner: [], intermediate: [], advanced: [] },
          commonMistakes: [],
          interviewQuestions: []
        },
        {
          id: '3.1.2',
          title: 'Load Balancing Algorithms',
          icon: '🎯',
          difficulty: 'intermediate',
          content: `## Intuition
How does a load balancer decide WHICH server gets the next request?

## Algorithms
1. **Round Robin:** Distributes requests sequentially (Server 1, 2, 3, 1, 2...). Simple, but assumes all servers have equal capacity and all requests are equal weight.
2. **Weighted Round Robin:** Assigns a weight to servers (e.g., Server 1 is 2x more powerful, so it gets 2 requests for every 1 request to Server 2).
3. **Least Connections:** Sends traffic to the server with the fewest active open connections. Great for long-lived connections (WebSockets).
4. **IP Hash:** Hashes the client's IP address. Guarantees the same user always hits the same server. Useful for stateful applications.
5. **Consistent Hashing:** Used in massive distributed systems to minimize data movement when servers are added or removed.

## Interview Tip
"Round Robin" is the safe default answer. If the system has persistent connections (chat app), use "Least Connections".`,
          mermaidDiagram: null,
          asciiDiagram: null,
          resources: { beginner: [], intermediate: [], advanced: [] },
          commonMistakes: [],
          interviewQuestions: []
        },
        {
          id: '3.1.3',
          title: 'Health Checks & Failover',
          icon: '❤️‍🩹',
          difficulty: 'intermediate',
          content: `## Intuition
A load balancer is useless if it routes traffic to a dead server.

## Key Concepts
- **Active Health Checks:** The LB periodically pings an endpoint (e.g., \`/health\`) on the servers. If it doesn't get a 200 OK within a timeout, it marks the server "unhealthy" and stops sending traffic.
- **Passive Health Checks:** The LB observes actual user traffic. If a server returns 500 errors to users, the LB stops sending traffic.
- **High Availability (Active-Passive):** To ensure the LB itself isn't a SPOF, you deploy two LBs. Only one is active. The passive one monitors the active one via a "heartbeat". If the active dies, the passive takes over the IP address instantly.

## Interview Tip
Always mention Health Checks when drawing a Load Balancer. It shows operational maturity.`,
          mermaidDiagram: null,
          asciiDiagram: null,
          resources: { beginner: [], intermediate: [], advanced: [] },
          commonMistakes: [],
          interviewQuestions: []
        }
      ]
    },
    {
      id: '3.2',
      title: 'Reverse Proxies & API Gateways',
      topics: [
        {
          id: '3.2.1',
          title: 'Reverse Proxy',
          icon: '🔀',
          difficulty: 'beginner',
          content: `## Intuition
A reverse proxy sits in front of web servers and forwards client requests to those web servers. (Unlike a forward proxy, like a corporate VPN, which sits in front of clients).

## Key Features
- **Security:** Hides the identity and IP of backend servers.
- **SSL Termination:** Decrypts HTTPS traffic, relieving backend servers of CPU-intensive decryption.
- **Compression:** Gzips responses before sending to clients.
- **Static Content Serving:** Quickly serves images/CSS directly without hitting the backend app logic.

## Examples
NGINX and Apache are the most common reverse proxies.

## Interview Tip
In modern architectures, the Load Balancer, Reverse Proxy, and API Gateway are often the exact same piece of software/hardware performing all three roles.`,
          mermaidDiagram: null,
          asciiDiagram: null,
          resources: { beginner: [], intermediate: [], advanced: [] },
          commonMistakes: [],
          interviewQuestions: []
        },
        {
          id: '3.2.2',
          title: 'API Gateway',
          icon: '🚪',
          difficulty: 'intermediate',
          content: `## Intuition
An API Gateway is a specialized reverse proxy designed specifically for microservices architectures. It is the single entry point for all external clients.

## Responsibilities
- **Routing:** Directing \`/users\` to the User Service and \`/orders\` to the Order Service.
- **Authentication/Authorization:** Validating JWT tokens before the request hits internal services.
- **Rate Limiting:** Blocking abusive users.
- **Request Aggregation:** Fetching data from 3 different microservices and returning a single combined JSON response to the mobile client (GraphQL often acts as this layer).

## Tradeoffs
It adds a network hop (latency) and can become a massive monolithic bottleneck if it contains too much business logic.

## Interview Tip
Always place an API Gateway at the edge of your microservice architecture. It handles cross-cutting concerns so your microservices can focus purely on business logic.`,
          mermaidDiagram: `graph TD
A[Mobile App] --> B(API Gateway)
A2[Web App] --> B
B --> C[Auth Service]
B --> D[Order Service]
B --> E[User Service]
style B fill:#e94560,stroke:#fff`,
          asciiDiagram: null,
          resources: { beginner: [], intermediate: [], advanced: [] },
          commonMistakes: [],
          interviewQuestions: []
        }
      ]
    },
    {
      id: '3.3',
      title: 'Content Delivery Networks',
      topics: [
        {
          id: '3.3.1',
          title: 'CDN Architecture',
          icon: '🌍',
          difficulty: 'beginner',
          content: `## Intuition
A Content Delivery Network (CDN) is a globally distributed network of proxy servers deployed in multiple data centers. Its goal is to serve content to end-users with high availability and high performance.

## Real-World Analogy
Instead of having one massive library in New York that everyone in the world has to travel to, you build hundreds of mini-libraries in every city, stocking copies of the most popular books.

## Key Concepts
- **Origin Server:** Your actual server holding the source of truth.
- **Edge Server (PoP - Point of Presence):** The CDN servers located geographically close to users.
- **Static vs Dynamic:** Traditionally used for static assets (Images, CSS, JS, Videos). Modern CDNs can also accelerate dynamic API traffic by optimizing routing.

## Interview Tip
If the system has global users and involves images, videos, or static files (Instagram, Netflix, Twitter), a CDN is a mandatory component in your design.`,
          mermaidDiagram: `graph TD
A[User in Japan] --> B(CDN Edge - Tokyo)
C[User in UK] --> D(CDN Edge - London)
B -.-> E[Origin Server - US]
D -.-> E
style B fill:#1a1a3e,stroke:#06b6d4
style D fill:#1a1a3e,stroke:#06b6d4`,
          asciiDiagram: null,
          resources: { beginner: [], intermediate: [], advanced: [] },
          commonMistakes: [],
          interviewQuestions: []
        },
        {
          id: '3.3.2',
          title: 'CDN Strategies',
          icon: '📦',
          difficulty: 'intermediate',
          content: `## Intuition
How does data get onto the CDN?

## Push vs Pull
- **Pull CDN (Most Common):** The user requests an image from the CDN. If the CDN doesn't have it (Miss), the CDN pulls it from the Origin Server, caches it, and serves it. Great for massive libraries with long-tail content.
- **Push CDN:** You explicitly upload content to the CDN proactively. Great for small, frequently accessed assets (like the CSS file for a new website launch).

## Cache Control
Controlled via HTTP Headers (\`Cache-Control: max-age=3600\`). To invalidate a CDN cache immediately (which is notoriously hard), engineers use "Object Versioning" (e.g., \`style.v2.css\` instead of \`style.css\`).

## Interview Tip
For video streaming (Netflix/YouTube), mention that the CDN chunks the video files into small segments (HLS/DASH) so clients can request different quality segments dynamically.`,
          mermaidDiagram: null,
          asciiDiagram: null,
          resources: { beginner: [], intermediate: [], advanced: [] },
          commonMistakes: [],
          interviewQuestions: []
        }
      ]
    },
    {
      id: '3.4',
      title: 'Cache Deep Dive',
      topics: [
        {
          id: '3.4.1',
          title: 'Redis',
          icon: '🔴',
          difficulty: 'intermediate',
          content: `## Intuition
Redis is an in-memory, key-value data store. Because it runs entirely in RAM, it is blazingly fast (sub-millisecond latency).

## Key Features
- **Data Structures:** Unlike simple caches, Redis supports strings, lists, sets, sorted sets, hashes, and streams.
- **Persistence:** Can write data to disk (RDB snapshots or AOF append-only log) to survive reboots.
- **Single-Threaded:** By default, Redis executes commands sequentially in a single thread, eliminating lock contention and ensuring atomic operations.

## Common Use Cases
1. Database Caching
2. Session Storage
3. Leaderboards (using Sorted Sets)
4. Rate Limiting (using counters/expiration)
5. Pub/Sub Message Broker

## Interview Tip
Redis is almost always the right answer for your caching layer in system design interviews. Mention specifically *which* data structure you are using (e.g., "I'll use a Redis Sorted Set for the real-time gaming leaderboard").`,
          mermaidDiagram: null,
          asciiDiagram: null,
          resources: { beginner: [], intermediate: [], advanced: [] },
          commonMistakes: [],
          interviewQuestions: []
        },
        {
          id: '3.4.2',
          title: 'Memcached',
          icon: '🟢',
          difficulty: 'beginner',
          content: `## Intuition
Memcached is a simple, highly scalable, in-memory key-value store. 

## Redis vs Memcached
- **Memcached:** Multi-threaded, pure key-value (strings only), strictly LRU eviction, no disk persistence.
- **Redis:** Single-threaded, rich data structures, persistence, pub/sub.

## Tradeoffs
Historically, Memcached was favored for pure HTML string caching due to its multi-threaded architecture utilizing multiple cores. Today, Redis is so feature-rich that it has largely replaced Memcached in modern architectures.

## Interview Tip
You rarely need to choose Memcached in an interview unless you specifically need massive multi-threaded raw string caching with zero complex data structures. Stick with Redis.`,
          mermaidDiagram: null,
          asciiDiagram: null,
          resources: { beginner: [], intermediate: [], advanced: [] },
          commonMistakes: [],
          interviewQuestions: []
        },
        {
          id: '3.4.3',
          title: 'Distributed Caching Patterns',
          icon: '🗺️',
          difficulty: 'advanced',
          content: `## Intuition
When a single Redis node isn't enough to hold your data or handle the traffic, you need a distributed cache.

## Key Concepts
- **Redis Cluster:** Automatically shards data across multiple Redis nodes. Provides high availability and horizontal scaling.
- **Consistent Hashing:** Used by Memcached clients to distribute keys evenly across a cluster of independent cache servers without a central coordinator.
- **L1 / L2 Caching:** 
  - **L1:** In-memory local cache on the app server itself (e.g., Guava/Caffeine in Java). Zero network latency.
  - **L2:** Distributed cache (Redis).
  If L1 misses, check L2. If L2 misses, check DB.

## Tradeoffs
L1 caching is incredibly fast but leads to inconsistencies between different app servers. You must implement mechanisms to invalidate L1 caches across all servers when data changes.

## Interview Tip
For extreme read-heavy systems (like Twitter Timeline), propose an L1/L2 cache strategy.`,
          mermaidDiagram: null,
          asciiDiagram: null,
          resources: { beginner: [], intermediate: [], advanced: [] },
          commonMistakes: [],
          interviewQuestions: []
        }
      ]
    },
    {
      id: '3.5',
      title: 'Message Queues & Event Streaming',
      topics: [
        {
          id: '3.5.1',
          title: 'Message Queues',
          icon: '📬',
          difficulty: 'intermediate',
          content: `## Intuition
A message queue is an asynchronous communication tool. A sender puts a message in the queue and moves on. A receiver pulls the message from the queue and processes it when it has capacity.

## Real-World Analogy
An email inbox. People send you emails. You don't have to read them instantly; they sit in the queue until you have time to process them one by one.

## Key Concepts
- **Decoupling:** Producer and Consumer don't need to know about each other or be online at the same time.
- **Buffering / Load Leveling:** If a system gets a sudden spike of 100k requests, the queue absorbs them, and worker servers process them at a steady, safe rate (preventing DB crashes).
- **Point-to-Point vs Pub/Sub:** 
  - Point-to-Point: 1 message is consumed by exactly 1 worker.
  - Pub/Sub: 1 message is broadcast to multiple different services.

## Technologies
RabbitMQ, Amazon SQS, ActiveMQ.

## Interview Tip
Use Message Queues for background tasks: sending emails, generating PDFs, video transcoding, or processing heavy ML models.`,
          mermaidDiagram: `graph LR
A[Web Server] -->|Message| B(Queue)
B -->|Poll| C[Worker 1]
B -->|Poll| D[Worker 2]
style B fill:#533483,stroke:#fff`,
          asciiDiagram: null,
          resources: { beginner: [], intermediate: [], advanced: [] },
          commonMistakes: [],
          interviewQuestions: []
        },
        {
          id: '3.5.2',
          title: 'Apache Kafka',
          icon: '🔥',
          difficulty: 'advanced',
          content: `## Intuition
Kafka is not a traditional message queue; it is a distributed event streaming platform. Instead of deleting messages once consumed, it stores them in an immutable, append-only log on disk.

## Real-World Analogy
Kafka is like a continuous ticker tape or a company's ledger book. Entries are appended sequentially. Different departments can read from the ledger at their own pace, starting from wherever they left off.

## Key Concepts
- **Topic:** A category to which records are published.
- **Partition:** Topics are broken into partitions to allow horizontal scaling. Order is ONLY guaranteed within a single partition.
- **Offset:** A unique ID denoting the position of a consumer in a partition.
- **Retention:** Messages stay on disk for a configured time (e.g., 7 days), allowing consumers to "replay" historical events.

## Tradeoffs
Kafka is extremely high-throughput and durable, but requires complex infrastructure management (ZooKeeper/KRaft) and has a steep learning curve compared to RabbitMQ.

## Interview Tip
Use Kafka for event-driven architectures, clickstream analytics, activity tracking, and massive scale data pipelines. If you just need to send a welcome email, SQS/RabbitMQ is simpler.`,
          mermaidDiagram: `graph TD
A[Producer] -->|Appends| B(Kafka Topic Partition)
B -->|Reads Offset 1| C[Consumer Group A]
B -->|Reads Offset 5| D[Consumer Group B]
style B fill:#1a1a3e,stroke:#e94560`,
          asciiDiagram: null,
          resources: { beginner: [], intermediate: [], advanced: [] },
          commonMistakes: ['Assuming Kafka guarantees global ordering across all partitions.'],
          interviewQuestions: []
        },
        {
          id: '3.5.3',
          title: 'Event-Driven Architecture',
          icon: '⚡',
          difficulty: 'advanced',
          content: `## Intuition
Instead of Services calling each other directly via synchronous REST APIs, they broadcast "Events" that something happened. Other services listen and react.

## Real-World Analogy
Instead of the Kitchen explicitly calling the Waiter to say "Food is ready", the Kitchen just rings a bell (Event). Any Waiter listening knows to come pick up food.

## Choreography vs Orchestration
- **Choreography:** Decentralized. Service A emits an event. Service B reacts, emits an event. Service C reacts. (Hard to track the whole flow).
- **Orchestration:** Centralized. A central orchestrator service (like AWS Step Functions) explicitly commands A, then B, then C.

## Tradeoffs
Event-driven systems are highly decoupled and scalable, but debugging a flow across 10 async services is extremely difficult without Distributed Tracing.

## Interview Tip
In e-commerce architectures (Amazon), event-driven is standard. \`OrderPlaced\` event is fired -> Inventory deducts stock, Billing charges card, Shipping preps label—all independently.`,
          mermaidDiagram: null,
          asciiDiagram: null,
          resources: { beginner: [], intermediate: [], advanced: [] },
          commonMistakes: [],
          interviewQuestions: []
        }
      ]
    },
    {
      id: '3.6',
      title: 'Search Engines',
      topics: [
        {
          id: '3.6.1',
          title: 'Elasticsearch',
          icon: '🔍',
          difficulty: 'intermediate',
          content: `## Intuition
Traditional SQL databases scan row-by-row to find text (e.g., \`LIKE '%keyword%'\`), which is incredibly slow. Elasticsearch uses an "Inverted Index" to make text search nearly instantaneous.

## Real-World Analogy
An Inverted Index is exactly like the index at the back of a textbook. Instead of reading every page to find the word "Latency", you look up "Latency" in the index, which tells you it appears on pages 12, 45, and 90.

## Key Concepts
- **Inverted Index:** Maps terms/words to the documents that contain them.
- **Analyzers:** Before text is indexed, it is tokenized (split into words), lowercased, and stemmed ("Running" -> "run").
- **TF-IDF / BM25:** Algorithms used to score relevance. How well does this document match the query?

## Interview Tip
Whenever a system design requires "Full-text search" or "Fuzzy matching" (like searching Amazon products or Twitter history), immediately introduce Elasticsearch as a component alongside your primary database.`,
          mermaidDiagram: `graph LR
A[Document: "The quick brown fox"] --> B(Analyzer)
B --> C[Tokens: quick, brown, fox]
C --> D[(Inverted Index)]
E[Query: "fox"] --> D
D --> F[Result: Document ID]`,
          asciiDiagram: null,
          resources: { beginner: [], intermediate: [], advanced: [] },
          commonMistakes: [],
          interviewQuestions: []
        },
        {
          id: '3.6.2',
          title: 'Search System Design',
          icon: '🔎',
          difficulty: 'advanced',
          content: `## Intuition
A production search system requires a pipeline to move data from the source of truth (DB) to the search engine (Elasticsearch).

## Architecture
1. **Primary Database:** Source of truth (Postgres).
2. **Change Data Capture (CDC):** Debezium tails the Postgres log.
3. **Kafka:** Receives the CDC events.
4. **Indexer Service:** Reads from Kafka and formats data into Elasticsearch documents.
5. **Elasticsearch Cluster:** Handles the actual search queries from the frontend.

## Typeahead / Autocomplete
Requires specialized structures like a Trie (Prefix Tree) stored in RAM (Redis), or Elasticsearch Edge-N-Grams to provide millisecond-latency suggestions as the user types.

## Interview Tip
Don't write user updates directly to Elasticsearch from the API. ES is not an ACID transactional database. Always write to the primary DB first, then sync to ES asynchronously.`,
          mermaidDiagram: null,
          asciiDiagram: null,
          resources: { beginner: [], intermediate: [], advanced: [] },
          commonMistakes: [],
          interviewQuestions: []
        }
      ]
    },
    {
      id: '3.7',
      title: 'Databases Deep Dive',
      topics: [
        {
          id: '3.7.1',
          title: 'Replication',
          icon: '📋',
          difficulty: 'intermediate',
          content: `## Intuition
Replication means keeping a copy of the same data on multiple machines connected via a network.

## Key Strategies
1. **Single-Leader (Master-Slave):** One node accepts writes. All others (followers) only accept reads. The leader streams changes to followers. Used by Postgres, MySQL.
2. **Multi-Leader (Master-Master):** Multiple nodes accept writes. High availability, but causes brutal conflict resolution issues when two users edit the same record simultaneously on different nodes.
3. **Leaderless:** Any node accepts writes. System uses Quorum reads/writes (e.g., write to 3 nodes, read from 2, if they match, you're good). Used by Cassandra, DynamoDB.

## Replication Lag
In async Single-Leader replication, there is a delay before followers get the data. If a user writes to the Leader, then immediately reads from a Follower, they might not see their own update (violating read-your-own-writes consistency).

## Interview Tip
Use Single-Leader for scaling read-heavy systems (add more read-replicas).`,
          mermaidDiagram: `graph TD
A[Write Request] --> B(Leader DB)
B -->|Async Replication| C[(Follower 1)]
B -->|Async Replication| D[(Follower 2)]
E[Read Request] --> C
F[Read Request] --> D
style B fill:#e94560,stroke:#fff`,
          asciiDiagram: null,
          resources: { beginner: [], intermediate: [], advanced: [] },
          commonMistakes: [],
          interviewQuestions: []
        },
        {
          id: '3.7.2',
          title: 'Sharding',
          icon: '🔪',
          difficulty: 'advanced',
          content: `## Intuition
When data becomes too massive to fit on a single hard drive, or write traffic is too high for one server, you must split the database into smaller pieces (shards) across multiple machines.

## Key Concepts
- **Shard Key:** The column used to determine which shard data goes to (e.g., \`user_id\`).
- **Hash Sharding:** \`Hash(user_id) % num_shards\`. Distributes data evenly, but makes range queries (give me users 1 to 100) impossible.
- **Range Sharding:** Shard 1 gets users A-H, Shard 2 gets I-Z. Good for range queries, but susceptible to hotspots (if everyone suddenly talks about 'C').

## The Pain of Sharding
- **Cross-Shard Joins:** Joining tables across different shards is horribly slow or impossible.
- **Resharding:** What happens when a shard gets full? Moving terabytes of data to rebalance without downtime is an engineering nightmare.

## Interview Tip
Sharding is a LAST RESORT. Mention upgrading hardware (vertical scaling), read replicas, and caching first. If you must shard, justify the Shard Key carefully to avoid hotspots (the "Celebrity Problem").`,
          mermaidDiagram: null,
          asciiDiagram: null,
          resources: { beginner: [], intermediate: [], advanced: [] },
          commonMistakes: [],
          interviewQuestions: []
        },
        {
          id: '3.7.3',
          title: 'Database Selection Guide',
          icon: '🗺️',
          difficulty: 'intermediate',
          content: `## Intuition
Choosing the right DB proves you have practical system design experience.

## The Cheat Sheet
- **PostgreSQL / MySQL:** The default. ACID, relational, structured. Use for billing, users, inventory.
- **MongoDB:** Document store. Flexible schema. Use for catalogs, content management, quick prototyping.
- **Cassandra / DynamoDB:** Wide-column, Leaderless. Insane write throughput, scales horizontally natively. Use for time-series, IoT data, massive logging, high-scale chat apps.
- **Redis:** In-memory key-value. Use for Caching, Leaderboards, Session store.
- **Elasticsearch:** Text search. Use for searching, fuzzy matching, logging dashboards.
- **Neo4j:** Graph DB. Use for social networks (friends of friends), recommendation engines, fraud rings.

## Interview Tip
Never say "I'll use MongoDB because it's web scale." Say "I'll use Postgres because our data is relational and requires strong ACID guarantees. If read scale becomes an issue, we will add read-replicas and a Redis cache."`,
          mermaidDiagram: null,
          asciiDiagram: null,
          resources: { beginner: [], intermediate: [], advanced: [] },
          commonMistakes: [],
          interviewQuestions: []
        }
      ]
    },
    {
      id: '3.8',
      title: 'Blob Storage & File Systems',
      topics: [
        {
          id: '3.8.1',
          title: 'Object Storage',
          icon: '📦',
          difficulty: 'beginner',
          content: `## Intuition
Object storage (like Amazon S3) stores data as independent objects in a flat structure, unlike hierarchical file systems (folders). 

## Key Concepts
- Best for unstructured data: Images, Videos, Backups, Log files.
- Each object contains: The data itself, Metadata, and a globally unique Identifier (URL).
- Extremely cheap, infinitely scalable, 11-nines of durability.

## Interview Tip
For YouTube, Instagram, or Dropbox: Do NOT store files in your relational database. Store the file in S3, and store the *URL string* to that file in your database.`,
          mermaidDiagram: null,
          asciiDiagram: null,
          resources: { beginner: [], intermediate: [], advanced: [] },
          commonMistakes: [],
          interviewQuestions: []
        },
        {
          id: '3.8.2',
          title: 'Distributed File Systems',
          icon: '🗂️',
          difficulty: 'advanced',
          content: `## Intuition
Hadoop Distributed File System (HDFS) or Google File System (GFS) are designed for storing massive files (Terabytes) and processing them in parallel.

## Key Concepts
Files are split into large blocks (e.g., 64MB or 128MB). These blocks are replicated across commodity hardware.

## Interview Tip
Mention HDFS only if you are designing a Big Data analytics pipeline or a massive MapReduce/Spark batch processing job. For general web apps, use Object Storage (S3).`,
          mermaidDiagram: null,
          asciiDiagram: null,
          resources: { beginner: [], intermediate: [], advanced: [] },
          commonMistakes: [],
          interviewQuestions: []
        }
      ]
    },
    {
      id: '3.9',
      title: 'Rate Limiting',
      topics: [
        {
          id: '3.9.1',
          title: 'Rate Limiting Algorithms',
          icon: '🚦',
          difficulty: 'intermediate',
          content: `## Intuition
Rate limiting controls the number of requests a client can make in a given time period to prevent DoS attacks, brute force attacks, and control costs.

## Key Algorithms
1. **Token Bucket:** A bucket holds N tokens. Every request removes 1 token. Tokens are refilled at a constant rate. Allows for short bursts of traffic.
2. **Leaky Bucket:** Requests enter a queue. They are processed at a constant rate (drops requests if queue is full). Smooths out traffic spikes.
3. **Fixed Window Counter:** Counts requests per minute (e.g., 12:00 to 12:01). Flaw: A spike at 12:00:59 and 12:01:01 allows 2x traffic in a 2-second window.
4. **Sliding Window Log:** Logs timestamps of all requests. Perfect accuracy, high memory cost.
5. **Sliding Window Counter:** Hybrid approach approximating the sliding window.

## Implementation
Usually implemented at the API Gateway using Redis to store the counters.

## Interview Tip
"Token Bucket" backed by Redis is the standard, pragmatic answer for API rate limiting.`,
          mermaidDiagram: null,
          asciiDiagram: null,
          resources: { beginner: [], intermediate: [], advanced: [] },
          commonMistakes: [],
          interviewQuestions: []
        }
      ]
    },
    {
      id: '3.10',
      title: 'Unique ID Generation',
      topics: [
        {
          id: '3.10.1',
          title: 'ID Generation Strategies',
          icon: '🆔',
          difficulty: 'intermediate',
          content: `## Intuition
In a distributed system, generating a unique ID (like a Tweet ID) is hard. You can't just use \`AUTO_INCREMENT\` in a database because you might have 10 different database shards.

## Key Strategies
1. **UUID (v4):** 128-bit random string. Pros: Truly decentralized. Cons: Huge, not sortable by time, causes fragmentation as primary keys in SQL databases.
2. **Database Ticket Server:** Flickr used a central DB just to generate auto-incrementing IDs. Pros: Simple. Cons: Single point of failure.
3. **Twitter Snowflake:** A 64-bit integer composed of:
   - Timestamp (e.g., 41 bits) - Allows sorting by time.
   - Datacenter/Machine ID (10 bits) - Prevents collisions across machines.
   - Sequence Number (12 bits) - Prevents collisions on the same machine in the same millisecond.

## Interview Tip
Twitter Snowflake is the definitive answer for generating IDs for massive scale systems (Tweets, Messages, Orders) because it is 64-bit (efficient), distributed (no bottleneck), and time-sortable.`,
          mermaidDiagram: `graph LR
A[64-bit Snowflake ID] --> B[1 bit: Sign]
A --> C[41 bits: Timestamp]
A --> D[10 bits: Machine ID]
A --> E[12 bits: Sequence]`,
          asciiDiagram: null,
          resources: { beginner: [], intermediate: [], advanced: [] },
          commonMistakes: [],
          interviewQuestions: []
        }
      ]
    }
  ]
};

window.SDM.layers[4] = {
  id: 4,
  title: 'Low Level Design',
  subtitle: 'Design clean, extensible class structures',
  duration: 'Weeks 17-24',
  icon: '🏛️',
  color: '#e94560',
  sections: [
    {
      id: '4.1',
      title: 'OOP Foundations',
      topics: [
        {
          id: '4.1.1',
          title: 'SOLID Principles',
          icon: '📐',
          difficulty: 'beginner',
          content: `## Intuition
SOLID is an acronym for 5 design principles intended to make software designs more understandable, flexible, and maintainable.

## The Principles
1. **Single Responsibility Principle (SRP):** A class should have one, and only one, reason to change. (e.g., Don't put database saving logic inside the User model).
2. **Open-Closed Principle (OCP):** Software entities should be open for extension, but closed for modification. (Use interfaces/inheritance instead of modifying existing \`if/else\` chains).
3. **Liskov Substitution Principle (LSP):** Subtypes must be substitutable for their base types without altering program correctness. (If \`Ostrich\` extends \`Bird\`, but throws an error on \`fly()\`, it violates LSP).
4. **Interface Segregation Principle (ISP):** Don't force clients to implement interfaces they don't use. Break fat interfaces into smaller, role-specific ones.
5. **Dependency Inversion Principle (DIP):** High-level modules should not depend on low-level modules. Both should depend on abstractions (interfaces). (Use Dependency Injection).

## Interview Tip
Interviewers look for these principles in your class designs. If you write a massive God Class handling UI, logic, and database access, you will fail the LLD round.`,
          mermaidDiagram: null,
          asciiDiagram: null,
          resources: { beginner: [], intermediate: [], advanced: [] },
          commonMistakes: [],
          interviewQuestions: []
        },
        {
          id: '4.1.2',
          title: 'Design Patterns',
          icon: '🎨',
          difficulty: 'intermediate',
          content: `## Intuition
Design patterns are typical solutions to commonly occurring problems in software design. They are templates you can customize.

## Creational Patterns
Deal with object creation mechanisms.
- **Singleton:** Ensures a class has only one instance (e.g., Database connection pool).
- **Factory Method:** Creates objects without specifying the exact class to create.
- **Builder:** Constructs complex objects step by step (e.g., building a complex SQL query or a Meal Combo).

## Structural Patterns
Deal with object composition and relationships.
- **Adapter:** Allows incompatible interfaces to collaborate (e.g., wrapping a legacy 3rd party API).
- **Decorator:** Adds new behaviors to objects dynamically by placing them inside special wrapper objects.
- **Facade:** Provides a simplified interface to a complex body of code.

## Behavioral Patterns
Deal with communication between objects.
- **Strategy:** Defines a family of algorithms, encapsulates them, and makes them interchangeable (e.g., PaymentStrategy -> CreditCard, PayPal, Crypto).
- **Observer:** A subscribe/publish mechanism (e.g., notifying users when a Youtube channel uploads).
- **State:** Alters an object's behavior when its internal state changes (e.g., Vending machine states).

## Interview Tip
Don't force patterns. Only use them when the specific problem arises. "Strategy" and "Factory" are the most commonly expected patterns in LLD interviews.`,
          mermaidDiagram: null,
          asciiDiagram: null,
          resources: { beginner: [], intermediate: [], advanced: [] },
          commonMistakes: [],
          interviewQuestions: []
        },
        {
          id: '4.1.3',
          title: 'UML Basics',
          icon: '📊',
          difficulty: 'beginner',
          content: `## Intuition
UML (Unified Modeling Language) is a visual way to specify, construct, and document the artifacts of software systems.

## Key Concepts for Interviews
You only need a subset of UML for interviews.
- **Class Diagrams:** Shows classes, attributes, methods, and the relationships between them.
- **Relationships:**
  - **Inheritance:** "Is-a" (Solid line, hollow arrow).
  - **Composition:** "Part-of" - strong lifecycle dependency (Solid diamond). E.g., House has Rooms. If House is destroyed, Rooms are destroyed.
  - **Aggregation:** "Has-a" - weak lifecycle dependency (Hollow diamond). E.g., Department has Teachers.
  - **Association:** Knowing about another class (Solid line).
- **Sequence Diagrams:** Shows object interactions arranged in time sequence.

## Interview Tip
Don't worry about perfect UML syntax in a whiteboard interview. Focus on clear boxes, explicit cardinality (1..*), and clear separation of responsibilities.`,
          mermaidDiagram: null,
          asciiDiagram: null,
          resources: { beginner: [], intermediate: [], advanced: [] },
          commonMistakes: [],
          interviewQuestions: []
        }
      ]
    },
    {
      id: '4.2',
      title: 'LLD Projects',
      topics: [
        {
          id: '4.2.1',
          title: 'Parking Lot System',
          icon: '🅿️',
          difficulty: 'intermediate',
          content: `## Requirements
- Multi-level parking lot.
- Support multiple vehicle types (Motorcycle, Car, Truck).
- Support different spot types (Compact, Large, Handicapped).
- Hand out a parking ticket on entry.
- Calculate fee on exit based on time.

## Key Classes
- \`ParkingLot\`: Singleton orchestrating the system.
- \`Level\`: Represents a floor.
- \`ParkingSpot\`: Base class. Extended by \`CompactSpot\`, \`LargeSpot\`.
- \`Vehicle\`: Base class. Extended by \`Car\`, \`Truck\`.
- \`Ticket\`: Tracks entry time and spot.

## Design Patterns
- **Singleton:** For the ParkingLot.
- **Factory:** To generate Tickets.
- **Strategy:** For pricing (Hourly vs Daily pricing).

## Concurrency
Handling multiple cars trying to park at the exact same millisecond. Spot assignment must be thread-safe (lock the spot during assignment).`,
          mermaidDiagram: `classDiagram
    class ParkingLot {
      +List~Level~ levels
      +parkVehicle(v: Vehicle) Ticket
      +unparkVehicle(t: Ticket) double
    }
    class Level {
      +List~ParkingSpot~ spots
      +findAvailableSpot(v: Vehicle)
    }
    class ParkingSpot {
      +boolean isFree
      +VehicleType type
      +assignVehicle(v)
    }
    class Vehicle {
      <<abstract>>
      +String licensePlate
    }
    ParkingLot "1" *-- "*" Level
    Level "1" *-- "*" ParkingSpot
    ParkingSpot "1" o-- "0..1" Vehicle`,
          asciiDiagram: null,
          resources: { beginner: [], intermediate: [], advanced: [] },
          commonMistakes: [],
          interviewQuestions: []
        },
        {
          id: '4.2.3',
          title: 'Splitwise',
          icon: '💰',
          difficulty: 'advanced',
          content: `## Requirements
- Users can add expenses.
- Expenses can be split (Equally, Exact amounts, Percentages).
- System must track who owes whom.
- System must simplify debts (if A owes B 10, B owes C 10 -> A owes C 10).

## Key Classes
- \`ExpenseManager\`: Core facade handling the logic.
- \`User\`: Represents a person.
- \`Expense\`: Abstract class. Extended by \`EqualExpense\`, \`ExactExpense\`, \`PercentExpense\`.
- \`Split\`: Abstract class. Extended by \`EqualSplit\`, \`ExactSplit\`.
- \`BalanceMap\`: Stores who owes what to whom.

## The Algorithm (Simplify Debts)
The hardest part. Treat users as nodes in a graph and debts as directed edges. 
Calculate the net balance for every node. 
Match positive net balances (creditors) with negative net balances (debtors) using a Greedy Algorithm or Min-Cash-Flow algorithm.

## Interview Tip
Start with the basic OOP structure and expense tracking. Only jump into the complex debt simplification algorithm if the interviewer specifically asks for it.`,
          mermaidDiagram: `classDiagram
    class ExpenseManager {
      +addExpense()
      +showBalances()
    }
    class Expense {
      <<abstract>>
      +double amount
      +User paidBy
      +List~Split~ splits
      +validate() boolean
    }
    class Split {
      <<abstract>>
      +User user
      +double amount
    }
    Expense <|-- EqualExpense
    Expense <|-- ExactExpense
    Split <|-- EqualSplit
    ExpenseManager --> "*" Expense`,
          asciiDiagram: null,
          resources: { beginner: [], intermediate: [], advanced: [] },
          commonMistakes: [],
          interviewQuestions: []
        }
      ]
    }
  ]
};
