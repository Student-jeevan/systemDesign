# DBMS Internals & SQL Architecture

## Overview
Database Management Systems are the bottleneck of 99% of modern applications. Elite interviews do not test your ability to write a `JOIN`; they test your understanding of what the database engine is actually doing on disk and in memory when that `JOIN` executes.

## Pattern 2.1: Storage Engines (B-Trees vs LSM Trees)
### Pattern Description
How databases structure data on disk to optimize for specific read/write patterns. Relational databases (Postgres, MySQL) typically use B+ Trees. Write-heavy NoSQL databases (Cassandra, RocksDB) use Log-Structured Merge (LSM) Trees.

### Core Invariant
**Read-Write Tradeoff:** B+ Trees are optimized for fast reads and range queries but suffer from random I/O during writes (page splits). LSM Trees append everything sequentially to a log (blazing fast writes) but require background compaction and checking multiple levels during reads.

### Curated Questions
---
##### Q1: Why do we use B+ Trees instead of Binary Search Trees?
| Field | Value |
|-------|-------|
| **Difficulty** | Medium |
| **Companies** | Google, Amazon |

**Key Observation**: Disk reads happen in "Pages" (typically 4KB or 8KB). A BST node is tiny, meaning traversing a BST requires a separate disk read for almost every node. A B+ Tree has massive fanout (e.g., 100+ pointers per node), meaning the tree is extremely shallow (often depth 3 or 4 for billions of rows). This guarantees at most 3-4 disk seeks to find any record.
---
##### Q2: Cassandra Write Path
| Field | Value |
|-------|-------|
| **Difficulty** | Hard |
| **Companies** | Uber, Netflix |

**Key Observation**: Writes go to an in-memory MemTable and are appended to an append-only CommitLog on disk. Once the MemTable is full, it is flushed to disk as an immutable SSTable. Because it never updates in-place, writes are purely sequential I/O, allowing Cassandra to handle millions of writes per second.

## Pattern 2.2: ACID and Concurrency Control
### Pattern Description
How a database guarantees consistency when thousands of transactions occur simultaneously. The bedrock of this is MVCC (Multi-Version Concurrency Control) and Isolation Levels.

### Core Invariant
**Isolation vs. Performance:** The higher the isolation level (e.g., Serializable), the more locks the database must acquire, which drastically reduces concurrency and throughput. Most databases default to `Read Committed` to balance consistency and speed.

### Curated Questions
---
##### Q1: Explain MVCC (Multi-Version Concurrency Control)
| Field | Value |
|-------|-------|
| **Difficulty** | Hard |
| **Companies** | Stripe, Meta |

**Key Observation**: Instead of locking a row when writing (which blocks readers), MVCC creates a *new version* of the row. Readers read the old version; the writer modifies the new version. "Readers don't block writers, and writers don't block readers."
---
##### Q2: Dirty Reads vs. Phantom Reads
| Field | Value |
|-------|-------|
| **Difficulty** | Medium |
| **Companies** | Bloomberg, FinTech |

**Key Observation**: A Dirty Read is reading uncommitted data from another transaction. A Phantom Read is when a transaction queries a range of rows twice, and a *new row* appears the second time because another transaction inserted it and committed.

## Pattern 2.3: Indexing and Query Execution
### Pattern Description
Understanding how secondary indexes work, how the query planner chooses an execution path, and why indexes sometimes kill performance.

### Core Invariant
**Index Cardinality:** An index is only useful if it significantly narrows down the search space (high cardinality). Indexing a boolean column (e.g., `is_active`) is often useless because the query planner will realize a full table scan is faster than jumping between the index and the data pages for 50% of the table.

### Curated Questions
---
##### Q1: Composite Indexes and the Leftmost Prefix Rule
| Field | Value |
|-------|-------|
| **Difficulty** | Medium |
| **Companies** | Atlassian, Uber |

**Key Observation**: If you have an index on `(A, B, C)`, you can use it to query `A`, or `A and B`, or `A, B, and C`. You *cannot* use it to efficiently query `B` or `C` alone, because the data is sorted by A first, making B and C scattered.
---
##### Q2: Write Amplification due to Indexes
| Field | Value |
|-------|-------|
| **Difficulty** | Medium |
| **Companies** | Google, Amazon |

**Key Observation**: Every time you `INSERT`, `UPDATE`, or `DELETE` a row, the database must update the primary B-Tree AND every single secondary index. Having 15 indexes on a table will make writes excruciatingly slow. Always profile and drop unused indexes.
