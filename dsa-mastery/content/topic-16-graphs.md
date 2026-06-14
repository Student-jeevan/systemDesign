# Topic 16: Graphs (BFS & DFS) — Complete Coverage

> **Priority**: #9 (High ROI) | **Risk**: 8/10 | **Interview Frequency**: ★★★★★
>
> Graphs are fundamentally just trees where cycles are allowed and nodes can have multiple parents. If you understand Tree DFS/BFS, Graph DFS/BFS is just adding a `visited` set to avoid infinite loops. The challenge in Graph problems is usually *modeling* the problem as a graph in the first place.

---

## Graphs Overview

### Representation
There are three ways to represent a graph:
1. **Adjacency List (90% of problems)**: `Map<Node, List<Node>>` or `List<List<Integer>>`. Best for sparse graphs. O(V+E) traversal.
2. **Adjacency Matrix (5% of problems)**: `int[][] matrix`. Best for dense graphs or when you need O(1) edge lookup. O(V^2) traversal.
3. **Implicit Graph (Matrix/Grid) (5% of problems)**: A 2D grid where neighbors are up/down/left/right.

### BFS vs DFS
- **BFS (Queue)**: Use for finding the *shortest path* in unweighted graphs, or exploring level-by-level. Space complexity depends on the maximum width of the graph (O(V) worst case).
- **DFS (Stack/Recursion)**: Use for exploring all paths, detecting cycles, topological sorting, or when you need to go deep quickly. Space complexity depends on the maximum depth of the graph (O(V) worst case).

### The Golden Rule
**Always track `visited` nodes. Failing to do so will result in an infinite loop (Stack Overflow or Memory Limit Exceeded).**

---

## Pattern 16.1: Matrix / Grid Traversal (Islands)

### Pattern Description
The graph is implicitly represented as a 2D grid. Each cell is a node, and edges connect to the adjacent 4 (or 8) cells. 

### Core Invariant
**Iterate through the grid. When you find an unvisited target cell (e.g., '1'), trigger a BFS/DFS to explore the entire connected component, marking cells as visited (either in a set or by mutating the grid to '0').**

### Curated Questions

---

##### Q1: Number of Islands
| Field | Value |
|-------|-------|
| **Platform** | LeetCode |
| **Link** | https://leetcode.com/problems/number-of-islands/ |
| **Difficulty** | Medium |
| **Companies** | Amazon, Meta, Microsoft, Bloomberg |
| **Topic** | Graphs |
| **Pattern** | Grid Traversal |
| **Frequency** | ★★★★★ (5/5) |

**Key Observation**: Iterate grid. On finding '1', increment island count and run DFS/BFS to turn all connected '1's into '0's (visited).

**Time Complexity**: O(M * N)
**Space Complexity**: O(M * N) worst case for recursion stack.

---

##### Q2: Max Area of Island
| Field | Value |
|-------|-------|
| **Platform** | LeetCode |
| **Link** | https://leetcode.com/problems/max-area-of-island/ |
| **Difficulty** | Medium |
| **Companies** | Amazon, Meta |
| **Topic** | Graphs |
| **Pattern** | Grid Traversal |
| **Frequency** | ★★★★☆ (4/5) |

**Key Observation**: Similar to Number of Islands, but the DFS needs to return the size of the component: `return 1 + dfs(up) + dfs(down) + dfs(left) + dfs(right)`.

**Time Complexity**: O(M * N)
**Space Complexity**: O(M * N)

---

##### Q3: Rotting Oranges
| Field | Value |
|-------|-------|
| **Platform** | LeetCode |
| **Link** | https://leetcode.com/problems/rotting-oranges/ |
| **Difficulty** | Medium |
| **Companies** | Amazon, Meta, Microsoft |
| **Topic** | Graphs |
| **Pattern** | Multi-Source BFS |
| **Frequency** | ★★★★★ (5/5) |

**Key Observation**: We need the "shortest time". This means BFS. Because rotting starts from *all* rotten oranges simultaneously, this is a **Multi-Source BFS**.
1. Enqueue all initially rotten oranges. Count total fresh oranges.
2. BFS level by level (using the `size` loop pattern). Increment minutes after each level.
3. If a fresh orange becomes rotten, decrement fresh count.
4. Return minutes if `fresh_count == 0`, else -1.

**Time Complexity**: O(M * N)
**Space Complexity**: O(M * N)

---

## Pattern 16.2: Standard Adjacency List Traversal

### Pattern Description
The graph is given as a list of edges. You must build the adjacency list first, then traverse.

### Core Invariant
**Step 1: Build `Map<Node, List<Node>> adj`. Step 2: Initialize `Set<Node> visited`. Step 3: DFS/BFS from starting node(s).**

### Curated Questions

---

##### Q1: Clone Graph
| Field | Value |
|-------|-------|
| **Platform** | LeetCode |
| **Link** | https://leetcode.com/problems/clone-graph/ |
| **Difficulty** | Medium |
| **Companies** | Meta, Amazon, Google |
| **Topic** | Graphs |
| **Pattern** | Standard Traversal |
| **Frequency** | ★★★★☆ (4/5) |

**Key Observation**: Maintain a `Map<Node, Node> oldToNew`. Run DFS. If node in map, return map[node]. Else, create `new Node(node.val)`, add to map, then recursively clone neighbors and append to `new Node.neighbors`. Return `new Node`.

**Time Complexity**: O(V + E)
**Space Complexity**: O(V)

---

##### Q2: Graph Valid Tree
| Field | Value |
|-------|-------|
| **Platform** | LeetCode |
| **Link** | https://leetcode.com/problems/graph-valid-tree/ |
| **Difficulty** | Medium |
| **Companies** | Amazon, LinkedIn |
| **Topic** | Graphs |
| **Pattern** | Undirected Cycle Detection |
| **Frequency** | ★★★★☆ (4/5) |

**Key Observation**: An undirected graph is a valid tree if and only if:
1. It has exactly `n - 1` edges.
2. It is fully connected (DFS from node 0 visits all `n` nodes).
Alternatively, run DFS tracking the `parent`. If you visit a node that is already in `visited` AND it is not the `parent`, a cycle exists.

**Time Complexity**: O(V + E)
**Space Complexity**: O(V + E)

---

## Pattern 16.3: Cycle Detection in Directed Graphs

### Pattern Description
Detecting cycles in directed graphs is fundamentally different from undirected graphs. A node being in the `visited` set doesn't mean there's a cycle; it just means we reached it via another path.

### Core Invariant
**You need THREE states for each node:**
- `0`: Unvisited
- `1`: Visiting (currently in the recursion stack for the current path)
- `2`: Fully Visited (DFS for this node and all its descendants has finished)
**If DFS encounters a node with state `1`, a back-edge (cycle) exists.**

### Curated Questions

---

##### Q1: Course Schedule
| Field | Value |
|-------|-------|
| **Platform** | LeetCode |
| **Link** | https://leetcode.com/problems/course-schedule/ |
| **Difficulty** | Medium |
| **Companies** | Amazon, Meta, Microsoft |
| **Topic** | Graphs |
| **Pattern** | Directed Cycle Detection |
| **Frequency** | ★★★★★ (5/5) |

**Key Observation**: Courses are nodes, prerequisites are directed edges. The problem asks "Is there a cycle?". 
Use an array `state[n]` initialized to 0. DFS returns true if a cycle is found.
```python
def dfs(node):
    if state[node] == 1: return True  # Cycle detected
    if state[node] == 2: return False # Already processed safely
    
    state[node] = 1 # Mark as visiting
    for neighbor in adj[node]:
        if dfs(neighbor): return True
    state[node] = 2 # Mark as fully visited
    return False
```

*(Note: Can also be solved with Kahn's Algorithm / Topological Sort).*

**Time Complexity**: O(V + E)
**Space Complexity**: O(V + E)

---

## Pattern 16.4: Bipartite Graph Verification

### Pattern Description
A bipartite graph is a graph whose vertices can be divided into two disjoint sets such that every edge connects a vertex in one set to a vertex in the other. Equivalent to: "Can the graph be colored with 2 colors such that no adjacent nodes have the same color?"

### Core Invariant
**Run BFS/DFS. Color the starting node 0. Color its neighbors 1. Color their neighbors 0. If you ever find a neighbor that is already colored with the SAME color as the current node, the graph is not bipartite.**

### Curated Questions

---

##### Q1: Is Graph Bipartite?
| Field | Value |
|-------|-------|
| **Platform** | LeetCode |
| **Link** | https://leetcode.com/problems/is-graph-bipartite/ |
| **Difficulty** | Medium |
| **Companies** | Meta, Amazon |
| **Topic** | Graphs |
| **Pattern** | Bipartite Verification |
| **Frequency** | ★★★★☆ (4/5) |

**Key Observation**: Maintain a `color` array initialized to -1. Loop through all nodes (graph might be disconnected). If `color[i] == -1`, run BFS/DFS starting at `i` coloring it 0. If a conflict is found, return false.

**Time Complexity**: O(V + E)
**Space Complexity**: O(V)

---

## Pattern 16.5: Shortest Path in Unweighted Graph (Advanced BFS)

### Pattern Description
When the graph is unweighted (or weights are equal), BFS guarantees the shortest path. Advanced problems require tracking *state* along with the node.

### Core Invariant
**The queue stores `(Node, State, Distance)`. The `visited` set must store `(Node, State)` tuples. You can visit the same node multiple times as long as the state is different.**

### Curated Questions

---

##### Q1: Shortest Path Visiting All Nodes
| Field | Value |
|-------|-------|
| **Platform** | LeetCode |
| **Link** | https://leetcode.com/problems/shortest-path-visiting-all-nodes/ |
| **Difficulty** | Hard |
| **Companies** | Google, Amazon |
| **Topic** | Graphs |
| **Pattern** | BFS with State Mask |
| **Frequency** | ★★★☆☆ (3/5) |

**Key Observation**: Covered in DP Bitmask, but fundamentally a Graph BFS problem. Queue stores `(node, bitmask, dist)`. Visited set stores `(node, bitmask)`. Initial queue contains all nodes `(i, 1 << i, 0)`. Target is `bitmask == (1 << n) - 1`.

**Time Complexity**: O(N * 2^N)
**Space Complexity**: O(N * 2^N)

---

##### Q2: Word Ladder
| Field | Value |
|-------|-------|
| **Platform** | LeetCode |
| **Link** | https://leetcode.com/problems/word-ladder/ |
| **Difficulty** | Hard |
| **Companies** | Amazon, Meta, LinkedIn |
| **Topic** | Graphs |
| **Pattern** | Implicit Graph BFS |
| **Frequency** | ★★★★★ (5/5) |

**Key Observation**: Words are nodes. Edges exist if words differ by 1 letter. "Shortest transformation sequence" = shortest path = BFS.
To find neighbors efficiently: For each word, try replacing each character with 'a'-'z' and check if the new word is in the `wordList` (converted to a HashSet).

**Time Complexity**: O(M^2 * N) where M is word length, N is number of words.
**Space Complexity**: O(M * N)

---
