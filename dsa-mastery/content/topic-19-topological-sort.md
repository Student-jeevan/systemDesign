# Topic 19: Topological Sort — Complete Coverage

> **Priority**: #16 (Consolidation) | **Risk**: 5/10 | **Interview Frequency**: ★★★★☆
>
> Topological Sort is exclusively used for Directed Acyclic Graphs (DAGs). It provides a linear ordering of vertices such that for every directed edge `U -> V`, vertex `U` comes before `V` in the ordering. If you see prerequisites, dependencies, or scheduling constraints, Topological Sort is the answer.

---

## Topological Sort Overview

### Kahn's Algorithm (BFS Approach)
This is the most intuitive and robust way to implement Topological Sort, especially because it naturally handles cycle detection.
1. Calculate the **in-degree** (number of incoming edges) for every node.
2. Put all nodes with an `in-degree` of 0 into a Queue. (These have no prerequisites).
3. While Queue is not empty:
   - Pop a node, append it to the topological order list.
   - For each neighbor of the popped node, reduce its `in-degree` by 1.
   - If a neighbor's `in-degree` reaches 0, push it to the Queue.
4. **Cycle Check**: If the final topological order list has fewer nodes than the total number of nodes in the graph, a cycle exists (and a valid topological sort is impossible).

### DFS Approach
1. Maintain an empty `stack` and a `visited` set.
2. For each unvisited node, perform a DFS.
3. In the DFS, recursively call DFS on all unvisited neighbors.
4. *Crucial step*: After all recursive calls for a node finish, push the node onto the `stack`.
5. At the end, pop elements from the stack (or reverse the list) to get the topological order.
*(Note: To detect cycles in the DFS approach, you need a 3-state visited array: Unvisited, Visiting, Fully Visited. See Graph DFS patterns).*

---

## Pattern 19.1: Course Scheduling / Dependencies

### Pattern Description
The classic use case. You are given a list of tasks and their prerequisites.

### Core Invariant
**Build the adjacency list `adj` AND the `in_degree` array simultaneously. Apply Kahn's Algorithm.**

### Curated Questions

---

##### Q1: Course Schedule II
| Field | Value |
|-------|-------|
| **Platform** | LeetCode |
| **Link** | https://leetcode.com/problems/course-schedule-ii/ |
| **Difficulty** | Medium |
| **Companies** | Amazon, Microsoft, Meta |
| **Topic** | Topological Sort |
| **Pattern** | Kahn's Algorithm |
| **Frequency** | ★★★★★ (5/5) |

**Key Observation**: We need to return the actual ordering, not just a boolean. Kahn's Algorithm builds this ordering naturally. If `len(ordering) != numCourses`, return `[]` because a cycle exists.

**Time Complexity**: O(V + E)
**Space Complexity**: O(V + E)

---

##### Q2: Alien Dictionary
| Field | Value |
|-------|-------|
| **Platform** | LeetCode |
| **Link** | https://leetcode.com/problems/alien-dictionary/ |
| **Difficulty** | Hard |
| **Companies** | Meta, Amazon, Airbnb |
| **Topic** | Topological Sort |
| **Pattern** | Dependency Inference |
| **Frequency** | ★★★★★ (5/5) |

**Key Observation**: The hardest part isn't the sorting; it's *building* the graph. 
1. Compare adjacent words in the sorted list. Find the first differing character. `word1[i] -> word2[i]` is a directed edge.
2. Edge case: If `word1` is longer than `word2` and `word1` starts with `word2` (e.g., "abc" comes before "ab"), the dictionary is invalid. Return `""`.
3. Run Kahn's Algorithm. If cycle detected, return `""`.

**Time Complexity**: O(C) where C is the total length of all words.
**Space Complexity**: O(1) or O(U) where U is unique letters (max 26).

---

## Pattern 19.2: All Topological Sorts

### Pattern Description
Instead of finding *one* valid topological sort, find *all* possible valid topological sorts.

### Core Invariant
**Combine Kahn's Algorithm with Backtracking. Any node in the queue (in-degree == 0) can be the next node. Pick one, apply Kahn's reduction, recurse, then undo the choice.**

### Curated Questions

---

##### Q1: All Ancestors of a Node in a Directed Acyclic Graph
| Field | Value |
|-------|-------|
| **Platform** | LeetCode |
| **Link** | https://leetcode.com/problems/all-ancestors-of-a-node-in-a-directed-acyclic-graph/ |
| **Difficulty** | Medium |
| **Companies** | Google |
| **Topic** | Topological Sort |
| **Pattern** | State Propagation |
| **Frequency** | ★★★☆☆ (3/5) |

**Key Observation**: Instead of finding all sorts, this requires pushing state forward along the topological ordering.
Sort topologically using Kahn's. As you process a node, pass its ancestors (and itself) down to its neighbors. Since we process in topological order, by the time we process a node, all its incoming edges have already delivered their ancestor information.

**Time Complexity**: O(V^2 + E)
**Space Complexity**: O(V^2)

---
