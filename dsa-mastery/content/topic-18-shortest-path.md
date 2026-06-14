# Topic 18: Shortest Path Algorithms — Complete Coverage

> **Priority**: #10 (High ROI) | **Risk**: 8/10 | **Interview Frequency**: ★★★★☆
>
> While BFS handles shortest paths for unweighted graphs, weighted graphs require specialized algorithms. In tech interviews, if edges have different costs/weights, you are almost certainly looking at Dijkstra's Algorithm. Knowing how to implement Dijkstra from scratch using a Priority Queue is non-negotiable for L4+ candidates.

---

## Shortest Path Overview

### The Big Four Algorithms

1. **Dijkstra's Algorithm (85% of interviews)**
   - **Use Case**: Single-source shortest path, *non-negative* edge weights.
   - **Data Structure**: Min-Heap (Priority Queue).
   - **Time Complexity**: O((V + E) log V).

2. **Bellman-Ford Algorithm (10% of interviews)**
   - **Use Case**: Single-source shortest path, handles *negative* edge weights, detects negative weight cycles.
   - **Data Structure**: Array/List of edges. DP-like relaxation.
   - **Time Complexity**: O(V * E).

3. **Floyd-Warshall Algorithm (4% of interviews)**
   - **Use Case**: All-pairs shortest path. Graph is small (V ≤ 400).
   - **Data Structure**: 2D Adjacency Matrix.
   - **Time Complexity**: O(V^3).

4. **A* Search (1% of interviews - mostly game dev or AI roles)**
   - **Use Case**: Single-source, single-target shortest path with a *heuristic* to guide the search.
   - **Data Structure**: Min-Heap + Heuristic function.

### The Golden Rule of Shortest Path
**If the graph is unweighted, use BFS. If the graph has non-negative weights, use Dijkstra. If the graph has negative weights or negative cycles, use Bellman-Ford.**

---

## Pattern 18.1: Dijkstra's Algorithm

### Pattern Description
Dijkstra's is fundamentally a BFS that uses a Priority Queue instead of a standard Queue. It always explores the closest unvisited node first. 

### Core Invariant
**Maintain a `dist` array initialized to infinity, and a Min-Heap storing `(current_distance, node)`. While the heap is not empty, pop the node with the minimum distance. If this distance is greater than `dist[node]`, skip (it's stale). Otherwise, for each neighbor, if `current_distance + weight < dist[neighbor]`, update `dist[neighbor]` and push `(dist[neighbor], neighbor)` to the heap.**

### Recognition Signals
- "Find the shortest path/minimum cost/cheapest flight."
- The graph has weighted edges.
- All weights are non-negative.

### Common Traps
- **Pushing before checking**: Don't just push every neighbor into the PQ. Only push if `new_dist < dist[neighbor]`.
- **Handling stale heap elements**: Because Java/Python PriorityQueues don't support O(1) key updates, you will push multiple copies of a node to the heap as you find shorter paths. You MUST check `if (curr_dist > dist[node]) continue;` immediately after popping to ignore outdated, longer paths.
- **Forgetting the `visited` set / distance array**: Without it, the algorithm will infinite loop on cycles.

### Curated Questions

---

##### Q1: Network Delay Time
| Field | Value |
|-------|-------|
| **Platform** | LeetCode |
| **Link** | https://leetcode.com/problems/network-delay-time/ |
| **Difficulty** | Medium |
| **Companies** | Amazon, Google, Microsoft |
| **Topic** | Shortest Path |
| **Pattern** | Dijkstra's Algorithm |
| **Frequency** | ★★★★★ (5/5) |

**Key Observation**: The textbook Dijkstra problem. Start at node `k`. Find the shortest path to all other nodes. The answer is the *maximum* value in the `dist` array (because all nodes receive the signal simultaneously, so the total time is determined by the last node to receive it). If any node remains at infinity, return -1.

**Time Complexity**: O((V + E) log V)
**Space Complexity**: O(V + E)

---

##### Q2: Path With Minimum Effort
| Field | Value |
|-------|-------|
| **Platform** | LeetCode |
| **Link** | https://leetcode.com/problems/path-with-minimum-effort/ |
| **Difficulty** | Medium |
| **Companies** | Google, Amazon |
| **Topic** | Shortest Path |
| **Pattern** | Dijkstra's (Minimax) |
| **Frequency** | ★★★★☆ (4/5) |

**Key Observation**: The "effort" of a path is the *maximum absolute difference* in heights between two consecutive cells on the path. We want the path that minimizes this maximum effort.
Modify Dijkstra: Instead of `new_dist = curr_dist + weight`, use `new_effort = max(curr_effort, abs(heights[curr] - heights[next]))`. Keep a `min_effort` array.

**Alternative**: Binary Search on the answer + BFS/DFS. Since effort is bounded [0, 10^6], `isValid(effort)` checks if there is a path where no edge exceeds `effort`.

**Time Complexity**: O((M * N) log(M * N))
**Space Complexity**: O(M * N)

---

##### Q3: Cheapest Flights Within K Stops
| Field | Value |
|-------|-------|
| **Platform** | LeetCode |
| **Link** | https://leetcode.com/problems/cheapest-flights-within-k-stops/ |
| **Difficulty** | Medium |
| **Companies** | Amazon, Meta, Google, Airbnb |
| **Topic** | Shortest Path |
| **Pattern** | Dijkstra with State / Bellman-Ford |
| **Frequency** | ★★★★★ (5/5) |

**Key Observation**: A standard Dijkstra finds the absolute cheapest path, but it might take more than `K` stops. We must track `stops` as part of the state. 
- Approach 1 (Dijkstra): Queue stores `(cost, node, stops)`. The `dist` array must store the minimum cost to reach a node *with a specific number of stops*, or track the minimum stops to reach a node at a given cost.
- Approach 2 (Bellman-Ford): Highly recommended. Run exactly `K+1` iterations. In each iteration, update distances using the distances from the *previous* iteration. This perfectly models "paths of length exactly `i`".

**Time Complexity**: Bellman-Ford: O((K + 1) * E). Dijkstra: O(E log V) roughly.
**Space Complexity**: O(V)

---

## Pattern 18.2: Bellman-Ford Algorithm

### Pattern Description
Instead of greedily picking the closest node, Bellman-Ford relaxes *all edges* repeatedly. If the shortest path between two nodes takes `V-1` edges, relaxing all edges `V-1` times guarantees finding it.

### Core Invariant
**Maintain a `dist` array initialized to infinity. Loop `V - 1` times. In each loop, iterate over all edges `(u, v, w)`. If `dist[u] + w < dist[v]`, update `dist[v]`.**
**To detect negative cycles: run a V-th loop. If any distance updates, a negative cycle exists.**

### Curated Questions

---

##### Q1: Design a Route Planner (Negative Cycles)
| Field | Value |
|-------|-------|
| **Platform** | Classic Interview |
| **Difficulty** | Hard |
| **Companies** | Uber, Lyft |
| **Topic** | Shortest Path |
| **Pattern** | Bellman-Ford |
| **Frequency** | ★★☆☆☆ (2/5) |

**Key Observation**: If an edge represents an arbitrage opportunity or a "reward" that exceeds the cost, it's a negative edge. If you can loop in this cycle indefinitely, you have infinite reward (a negative weight cycle). Use Bellman-Ford to detect it.

**Time Complexity**: O(V * E)
**Space Complexity**: O(V)

---

## Pattern 18.3: Floyd-Warshall Algorithm

### Pattern Description
Computes the shortest path between *all pairs* of nodes simultaneously. It's a Dynamic Programming algorithm.

### Core Invariant
**Three nested loops. The outer loop `k` is the intermediate node. The inner loops `i` and `j` are the source and destination. If going from `i` to `j` through `k` is shorter than going directly, update the distance: `dist[i][j] = min(dist[i][j], dist[i][k] + dist[k][j])`.**

### Curated Questions

---

##### Q1: Evaluate Division
| Field | Value |
|-------|-------|
| **Platform** | LeetCode |
| **Link** | https://leetcode.com/problems/evaluate-division/ |
| **Difficulty** | Medium |
| **Companies** | Amazon, Google, Meta |
| **Topic** | Shortest Path |
| **Pattern** | Floyd-Warshall (or DFS/BFS) |
| **Frequency** | ★★★★☆ (4/5) |

**Key Observation**: If `A / B = 2.0` and `B / C = 3.0`, then `A / C = A/B * B/C = 6.0`. 
This is a graph problem where edge weights are multiplication multipliers. 
- Approach 1: Build graph, answer queries using BFS/DFS.
- Approach 2: Floyd-Warshall. Initialize `dist[i][i] = 1.0`. `dist[i][j] = dist[i][k] * dist[k][j]`. O(V^3) time is perfectly acceptable because the number of variables is small (≤ 39).

**Time Complexity**: O(V^3) for Floyd-Warshall, or O(Q * (V+E)) for DFS.
**Space Complexity**: O(V^2)

---
