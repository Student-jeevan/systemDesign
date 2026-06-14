# OS Internals & Concurrency

## Overview
Operating Systems are the bridge between raw hardware and high-level applications. In elite engineering interviews (Google, Meta, Uber), OS questions are rarely definitional. They test your ability to understand resource constraints—how memory, CPU, and disk I/O dictate the architecture of high-throughput backend systems.

## Pattern 1.1: Process vs. Thread Architecture
### Pattern Description
Understanding the memory boundaries between processes and threads. Processes are isolated execution environments with their own virtual memory space. Threads exist within a process and share the same memory space (heap, data, code), but maintain their own stack and registers.

### Core Invariant
**Context Switch Cost:** Switching between processes requires a full TLB (Translation Lookaside Buffer) flush and memory map swap. Switching between threads only requires swapping CPU registers and the stack pointer, making it significantly cheaper.

### Curated Questions
---
##### Q1: The C10K Problem and Thread Limits
| Field | Value |
|-------|-------|
| **Difficulty** | Hard |
| **Companies** | Uber, Meta |

**Key Observation**: Why can't a web server handle 10,000 concurrent connections by spawning 10,000 threads? Each thread requires a default stack size (e.g., 8MB on Linux). 10,000 threads = 80GB of RAM just for idle stacks, plus massive context-switching overhead. This leads to the event-driven architecture (Node.js, Nginx) using `epoll`/`kqueue`.
---
##### Q2: Mutex vs. Semaphore vs. Spinlock
| Field | Value |
|-------|-------|
| **Difficulty** | Medium |
| **Companies** | Google, Amazon |

**Key Observation**: A Mutex implies ownership (only the thread that locked it can unlock it) and puts the waiting thread to sleep (involving the OS scheduler). A Spinlock keeps the thread actively looping on the CPU. Spinlocks are only used when the wait time is expected to be *shorter* than the cost of a context switch.

## Pattern 1.2: Memory Management & Paging
### Pattern Description
How the OS maps virtual addresses used by programs to physical RAM addresses using the Page Table and the MMU (Memory Management Unit).

### Core Invariant
**Thrashing:** If the working set of active pages exceeds physical RAM, the OS spends more time swapping pages to/from the disk than executing code, causing throughput to plummet to near zero.

### Curated Questions
---
##### Q1: Virtual Memory and Redis
| Field | Value |
|-------|-------|
| **Difficulty** | Hard |
| **Companies** | Meta, Stripe |

**Key Observation**: Redis is an in-memory database. If the dataset exceeds RAM, the OS starts swapping Redis pages to disk. Because Redis is single-threaded, a single page fault (requiring a disk read) blocks the entire server, destroying its high-throughput guarantees. This is why Redis must be strictly memory-capped.
---
##### Q2: Memory Leaks in Garbage Collected Languages
| Field | Value |
|-------|-------|
| **Difficulty** | Medium |
| **Companies** | Netflix, Atlassian |

**Key Observation**: Even in Java or Go, you can leak memory by maintaining persistent references to objects in long-lived data structures (like global HashMaps) preventing the GC from marking them as unreachable.

## Pattern 1.3: File Systems and I/O
### Pattern Description
How data moves from a disk to the network interface. Understanding Blocking vs. Non-Blocking I/O and the cost of crossing the User-Space/Kernel-Space boundary.

### Core Invariant
**Zero-Copy:** Standard file transfer involves reading from disk to kernel space, copying to user space, copying back to kernel space (socket buffer), and sending to the network. Zero-copy (`sendfile`) transfers directly from the kernel disk buffer to the kernel network buffer, bypassing user space entirely and saving massive CPU cycles.

### Curated Questions
---
##### Q1: Blocking vs. Non-Blocking I/O
| Field | Value |
|-------|-------|
| **Difficulty** | Medium |
| **Companies** | Uber, Apple |

**Key Observation**: In blocking I/O, the thread goes to sleep while waiting for disk/network. In non-blocking I/O, the call returns immediately (e.g., `EWOULDBLOCK`). The thread then uses `epoll` or `select` to monitor thousands of file descriptors simultaneously, waking up only when one is ready to read/write.
