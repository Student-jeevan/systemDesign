# Topic 17: Union Find (Disjoint Set) — Complete Coverage

> **Priority**: #11 (High ROI) | **Risk**: 5/10 | **Interview Frequency**: ★★★★☆
>
> Union Find is the most elegant data structure for answering connectivity queries ("are these two things connected?"). Once you write the template a few times, it becomes muscle memory. If you see a problem about grouping, connected components, or minimum spanning trees, default to Union Find.

---

## Union Find Overview

### The Magic of Union Find
Union Find solves two problems in nearly `O(1)` time:
1. **Find**: What group does this element belong to?
2. **Union**: Merge the groups of two elements together.

### The Template
You must implement two optimizations for it to be `O(1)`: **Path Compression** and **Union by Rank/Size**.

```python
class UnionFind:
    def __init__(self, size):
        self.root = [i for i in range(size)]
        self.rank = [1] * size
        self.count = size # Number of disjoint sets

    def find(self, x):
        if x == self.root[x]:
            return x
        # Path Compression
        self.root[x] = self.find(self.root[x])
        return self.root[x]

    def union(self, x, y):
        rootX = self.find(x)
        rootY = self.find(y)
        
        if rootX != rootY:
            # Union by Rank
            if self.rank[rootX] > self.rank[rootY]:
                self.root[rootY] = rootX
            elif self.rank[rootX] < self.rank[rootY]:
                self.root[rootX] = rootY
            else:
                self.root[rootY] = rootX
                self.rank[rootX] += 1
            self.count -= 1
            return True
        return False # They were already in the same set
```

---

## Pattern 17.1: Connected Components / Grouping

### Pattern Description
Whenever you are given a set of edges (or relationships like "friendships") and need to find how many isolated groups exist, or whether two specific nodes are in the same group.

### Core Invariant
**Initialize UF. Loop through all edges/relationships. Call `union(u, v)`. To check connection, call `find(u) == find(v)`. To count components, check `uf.count`.**

### Curated Questions

---

##### Q1: Number of Connected Components in an Undirected Graph
| Field | Value |
|-------|-------|
| **Platform** | LeetCode |
| **Link** | https://leetcode.com/problems/number-of-connected-components-in-an-undirected-graph/ |
| **Difficulty** | Medium |
| **Companies** | Amazon, LinkedIn |
| **Topic** | Union Find |
| **Pattern** | Grouping |
| **Frequency** | ★★★★★ (5/5) |

**Key Observation**: The textbook application. Initialize UF with size `n`. For each edge `[u, v]`, do `union(u, v)`. Return `uf.count`. (Alternatively: run DFS, counting how many unvisited nodes trigger a new DFS).

**Time Complexity**: O(V + E * α(V)) where α is the inverse Ackermann function (essentially O(1)).
**Space Complexity**: O(V)

---

##### Q2: Accounts Merge
| Field | Value |
|-------|-------|
| **Platform** | LeetCode |
| **Link** | https://leetcode.com/problems/accounts-merge/ |
| **Difficulty** | Medium |
| **Companies** | Meta, Amazon, Apple |
| **Topic** | Union Find |
| **Pattern** | Grouping Strings |
| **Frequency** | ★★★★★ (5/5) |

**Key Observation**: Emails are nodes. If two emails belong to the same account, there's an edge between them. 
Map every email to an integer ID to use the standard UF array. 
For each account, `union` the first email with all subsequent emails in that account. 
After all unions, group emails by their `find()` root.

**Time Complexity**: O(N log N) where N is total emails (due to sorting at the end).
**Space Complexity**: O(N)

---

##### Q3: Longest Consecutive Sequence
| Field | Value |
|-------|-------|
| **Platform** | LeetCode |
| **Link** | https://leetcode.com/problems/longest-consecutive-sequence/ |
| **Difficulty** | Medium |
| **Companies** | Amazon, Meta, Google |
| **Topic** | Union Find (or HashSet) |
| **Pattern** | 1D Grouping |
| **Frequency** | ★★★★★ (5/5) |

**Key Observation**: Standard solution uses a HashSet (O(N) time).
Union Find approach: For each `num`, if `num+1` exists, `union(num, num+1)`. Maintain the `size` of each component instead of `rank`. The answer is the maximum size.

**Time Complexity**: O(N) using Hash Map for UF indexing.
**Space Complexity**: O(N)

---

## Pattern 17.2: Undirected Cycle Detection

### Pattern Description
Detecting a cycle in an *undirected* graph is trivially easy with Union Find.

### Core Invariant
**For each edge `(u, v)`, check if `find(u) == find(v)`. If they are already in the same set, adding this edge creates a cycle.**

### Curated Questions

---

##### Q1: Redundant Connection
| Field | Value |
|-------|-------|
| **Platform** | LeetCode |
| **Link** | https://leetcode.com/problems/redundant-connection/ |
| **Difficulty** | Medium |
| **Companies** | Amazon, Google |
| **Topic** | Union Find |
| **Pattern** | Cycle Detection |
| **Frequency** | ★★★★☆ (4/5) |

**Key Observation**: A tree is a graph with no cycles. An extra edge was added, creating exactly one cycle. We need to find that edge.
Iterate through edges. `if union(u, v) == False` (meaning they were already connected), return `[u, v]`.

**Time Complexity**: O(N * α(N))
**Space Complexity**: O(N)

---

## Pattern 17.3: Minimum Spanning Tree (Kruskal's Algorithm)

### Pattern Description
A Minimum Spanning Tree (MST) is a subset of edges that connects all vertices together without any cycles, with the minimum possible total edge weight.

### Core Invariant
**Sort all edges by weight (ascending). Iterate through the sorted edges. For each edge `(u, v, weight)`, if `union(u, v)` is True, add `weight` to the total cost. Stop when `uf.count == 1`.**

### Curated Questions

---

##### Q1: Min Cost to Connect All Points
| Field | Value |
|-------|-------|
| **Platform** | LeetCode |
| **Link** | https://leetcode.com/problems/min-cost-to-connect-all-points/ |
| **Difficulty** | Medium |
| **Companies** | Amazon, Microsoft |
| **Topic** | Union Find |
| **Pattern** | Kruskal's MST |
| **Frequency** | ★★★★☆ (4/5) |

**Key Observation**: Generate all `N * (N-1) / 2` edges with their Manhattan distances. Sort the edges by distance. Use Kruskal's algorithm (Union Find) to pick edges until all points are connected.

*(Note: Prim's Algorithm using a Min-Heap is also valid and potentially faster for dense graphs).*

**Time Complexity**: O(N^2 log(N^2)) for sorting edges.
**Space Complexity**: O(N^2)

---
