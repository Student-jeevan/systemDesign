# Computer Networks & Scale

## Overview
Networking is the nervous system of distributed architecture. At elite companies, you are expected to understand what happens to a byte of data from the moment it hits your load balancer to the moment it is written to the database socket. We focus on protocols, latency limits, and high-performance network engineering.

## Pattern 3.1: TCP vs. UDP Dynamics
### Pattern Description
The fundamental transport layer protocols. Understanding the trade-offs between reliability, ordering, and latency.

### Core Invariant
**Head-of-Line Blocking:** In TCP, if packet 2 is lost but packets 3, 4, and 5 arrive, the application cannot read 3, 4, or 5 until packet 2 is retransmitted and acknowledged. This guarantees order but causes massive latency spikes on lossy networks.

### Curated Questions
---
##### Q1: Why does HTTP/3 use UDP (QUIC) instead of TCP?
| Field | Value |
|-------|-------|
| **Difficulty** | Hard |
| **Companies** | Google, Cloudflare |

**Key Observation**: HTTP/2 over TCP suffers from Head-of-Line blocking. If one packet of one CSS file drops, the entire TCP connection (which is multiplexing the JS, HTML, and images) halts. QUIC implements its own stream control over UDP, meaning a lost CSS packet only blocks the CSS stream; the JS and HTML streams continue rendering.
---
##### Q2: TCP 3-Way Handshake Cost
| Field | Value |
|-------|-------|
| **Difficulty** | Medium |
| **Companies** | Meta, Akamai |

**Key Observation**: A TCP Handshake takes 1 RTT (Round Trip Time). TLS takes another 1-2 RTT. If the user is in India and the server is in the US (200ms RTT), establishing the connection takes 600ms before a single byte of HTTP data is sent. This is why Connection Pooling and Edge CDNs are mandatory.

## Pattern 3.2: HTTP, DNS, and TLS
### Pattern Description
The application layer. How human-readable requests are encrypted, routed, and formatted.

### Core Invariant
**Statefulness:** HTTP is inherently stateless. Every request is completely independent. We engineer state on top of HTTP using Cookies, JWTs, or Session IDs in the header.

### Curated Questions
---
##### Q1: What happens when you type google.com? (Deep Dive)
| Field | Value |
|-------|-------|
| **Difficulty** | Medium |
| **Companies** | Every Company |

**Key Observation**: The naive answer is "DNS -> IP -> TCP -> HTTP". The elite answer discusses: Browser Cache -> OS Cache -> Recursive DNS Resolver -> Root/TLD/Authoritative Nameservers -> ARP resolution -> TCP Handshake -> TLS Handshake -> BGP routing to nearest Google Edge node -> HTTP GET -> Server processing -> DOM Parsing & Critical Render Path.
---
##### Q2: Load Balancing (Layer 4 vs Layer 7)
| Field | Value |
|-------|-------|
| **Difficulty** | Hard |
| **Companies** | Uber, Amazon |

**Key Observation**: A Layer 4 (Transport) load balancer only looks at IP and Port. It is blazing fast and essentially just alters packet headers (NAT) without establishing a TCP connection itself. A Layer 7 (Application) load balancer terminates the TCP/TLS connection, reads the HTTP headers (e.g., cookies, paths), and opens a *new* TCP connection to the backend. L7 is slower but allows for intelligent routing (e.g., `/api` to Node, `/images` to S3).
