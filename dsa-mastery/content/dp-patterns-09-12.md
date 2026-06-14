# Topic 20: Dynamic Programming — Patterns 20.9-20.12 + Mock Interviews

> These are the advanced DP patterns plus the complete mock interview system
> and evaluation framework for Dynamic Programming.

---

## Pattern 20.9: Tree DP

### Pattern Description

Tree DP combines tree traversal (usually DFS post-order) with dynamic programming. The key idea is that each node's optimal answer depends on the optimal answers of its children. You solve the problem bottom-up: leaf nodes have trivial solutions, and internal nodes combine their children's solutions.

What makes Tree DP unique is the DFS return value. Instead of returning a single value, you often need to return a tuple (e.g., `(rob_this_node, skip_this_node)` for House Robber III, or `(max_path_through_node, max_path_ending_at_node)` for Maximum Path Sum). This "multi-value return" is the signature technique of Tree DP.

### Core Invariant

**Each node computes its DP value from its children's DP values in a single post-order traversal. The tree structure guarantees no cycles, so each node is visited exactly once.** The DFS function returns all information the parent needs to make its decision.

### Recognition Signals

- The problem is defined on a tree (binary tree, general tree, or graph that's a tree).
- The answer for a node depends on the answers for its children/subtrees.
- Keywords: "maximum path in tree", "minimum cameras", "rob houses on a tree".
- The problem has the "include this node or exclude this node" structure.
- The tree has n ≤ 10^5 nodes, so O(n) is needed.

### Common Traps

- **Returning only one value from DFS**: House Robber III needs `(rob, skip)` per node. If you only return one value, you can't capture the constraint that a parent and child can't both be robbed.
- **Confusing "path through node" with "path ending at node"**: For Maximum Path Sum, a path can go through a node (left→node→right) but this path can't extend further up. The DFS must return "max path ending at node" (goes up to parent) while tracking "max path through node" (doesn't go up) as a candidate for the global answer.
- **Wrong handling of null children**: A null child should return `(0, 0)` or similar neutral values, not cause a crash.
- **Global vs local answers**: Some Tree DP problems have the global answer at any node, not just the root. Track the global answer separately from the DFS return.

### Complexity Intuition

- **Time**: O(n) — each node visited once in post-order DFS.
- **Space**: O(h) for recursion stack where h = tree height. O(n) in worst case (skewed tree), O(log n) for balanced tree.
- **Why**: The tree structure means no overlapping subproblems (each subtree is independent). It's not DP in the traditional "cache overlapping subproblems" sense — it's DP in the "optimal substructure" sense.

### Hidden Variations

1. **Re-rooting technique**: The answer might depend on which node is the root. Compute answer for one root, then "re-root" in O(n) total by adjusting parent-child relationships.
2. **General trees (not binary)**: Sum over all children instead of just left/right.
3. **Tree with edge weights**: Path problems where edges have weights, not nodes.
4. **Binary tree cameras**: Minimum cameras to monitor all nodes — each node has 3 states (has camera, monitored by child, not monitored).
5. **Distance problems**: Sum of distances in tree — classic re-rooting DP.

### Follow-Up Variations

- **"What about a general tree (not binary)?"** → Replace `left/right` with `for child in children`.
- **"Can you do it iteratively?"** → Convert DFS to iterative post-order with explicit stack.
- **"What if nodes have weights?"** → Incorporate weights into the transition.
- **"What if the tree is a forest?"** → Run DFS from each root.

### Interview Frequency

| Company | Frequency | Typical Difficulty |
|---------|-----------|-------------------|
| Google | ★★★★☆ | Medium-Hard |
| Amazon | ★★★★☆ | Medium |
| Meta | ★★★☆☆ | Medium |
| Uber | ★★★★☆ | Medium-Hard |
| Microsoft | ★★★☆☆ | Medium |

### How Interviewers Expect You to Identify It

1. **Immediately**: "This is a tree problem where each node's answer depends on its children → Tree DP."
2. **Within 3 minutes**: Define what the DFS returns (the critical step).
3. **Within 10 minutes**: Working code with correct null handling.

### Why Candidates Fail

1. **Single-value DFS return**: The most common failure. If the problem requires knowing "include this node" vs "exclude this node", you MUST return both values.
2. **Global answer tracking**: For Maximum Path Sum, the DFS returns `maxPathEndingHere` (for the parent), but the global answer might be `left + node + right` (which doesn't go to the parent). Candidates forget to update the global variable.
3. **Stack overflow**: Very deep trees cause stack overflow in recursive DFS. Mentioning this limitation shows awareness.

### How Elite Candidates Think

They ask one question: **"What does the DFS function return?"** This determines the entire solution.

For House Robber III: DFS returns `(robThis, skipThis)`.
For Binary Tree Cameras: DFS returns one of `{HAS_CAMERA, MONITORED, NOT_MONITORED}`.
For Max Path Sum: DFS returns `maxSinglePath` (one direction only), while updating `globalMax` with `left + node + right`.

### Curated Questions

---

##### Q1: House Robber III
| Field | Value |
|-------|-------|
| **Platform** | LeetCode |
| **Link** | https://leetcode.com/problems/house-robber-iii/ |
| **Difficulty** | Medium |
| **Companies** | Google, Amazon, Uber |
| **Topic** | Dynamic Programming |
| **Pattern** | Tree DP |
| **Variation** | Include/exclude with adjacency constraint on tree |
| **Frequency** | ★★★★★ (5/5) |

**Key Observation**: DFS returns `(rob, notRob)` for each node. `rob = node.val + left.notRob + right.notRob`. `notRob = max(left.rob, left.notRob) + max(right.rob, right.notRob)`.

**Expected Thought Process**:
1. "House Robber on a tree. Can't rob parent and child."
2. "DFS returns two values: max if we rob this node, max if we don't."
3. "Rob this = value + children's notRob. Skip this = best of children's two options."
4. "Answer: max(root.rob, root.notRob)."

**Time Complexity**: O(n)
**Space Complexity**: O(h) recursion stack

**Common Mistakes**:
- Returning only one value (can't enforce the "no adjacent" constraint).
- Calling DFS multiple times on the same nodes (exponential without memoization, but pair return eliminates this need).

**Follow-Up Questions**:
- "What if the tree is a general graph?" → NP-hard (Maximum Independent Set on general graphs).
- "Print which nodes to rob." → Track decisions during DFS.

---

##### Q2: Binary Tree Maximum Path Sum
| Field | Value |
|-------|-------|
| **Platform** | LeetCode |
| **Link** | https://leetcode.com/problems/binary-tree-maximum-path-sum/ |
| **Difficulty** | Hard |
| **Companies** | Google, Meta, Amazon, Microsoft, Uber |
| **Topic** | Dynamic Programming |
| **Pattern** | Tree DP |
| **Variation** | Path through vs path ending at node |
| **Frequency** | ★★★★★ (5/5) |

**Key Observation**: DFS returns `maxPathEndingAtNode = node.val + max(0, max(left, right))` (best single-direction path ending at this node, to be used by parent). Simultaneously, update `globalMax = max(globalMax, node.val + max(0, left) + max(0, right))` (best path through this node, which can go left→node→right).

**Expected Thought Process**:
1. "Max path sum in binary tree. Path can start and end anywhere."
2. "DFS returns best path going *downward* from this node (for parent to extend)."
3. "At each node, check if left→node→right path is the best globally."
4. "Key: include a subtree only if it adds positive value (use max(0, subtree))."

**Time Complexity**: O(n)
**Space Complexity**: O(h)

**Common Mistakes**:
- Forgetting to clamp subtree values at 0 (negative subtrees should be excluded).
- Returning the "through" path to the parent (can't extend a bent path upward).
- Not handling negative node values correctly (global max starts at -INF, not 0).

---

##### Q3: Binary Tree Cameras
| Field | Value |
|-------|-------|
| **Platform** | LeetCode |
| **Link** | https://leetcode.com/problems/binary-tree-cameras/ |
| **Difficulty** | Hard |
| **Companies** | Google, Amazon |
| **Topic** | Dynamic Programming |
| **Pattern** | Tree DP |
| **Variation** | 3-state tree DP (greedy-like) |
| **Frequency** | ★★★★☆ (4/5) |

**Key Observation**: Each node is in one of 3 states: `HAS_CAMERA`, `MONITORED` (by a child's camera), `NOT_MONITORED`. Greedy: place cameras at parents of leaves (bottom-up). DFS returns the node's state; if a child is NOT_MONITORED, this node must have a camera. If any child HAS_CAMERA, this node is MONITORED. Otherwise, this node is NOT_MONITORED.

**Expected Thought Process**:
1. "Minimum cameras to cover all nodes. Greedy from leaves upward."
2. "DFS returns state: {CAMERA, MONITORED, NOT_MONITORED}."
3. "If any child is NOT_MONITORED → place camera here (count++)."
4. "If any child HAS_CAMERA → this node is MONITORED."
5. "Otherwise → this node is NOT_MONITORED (parent will handle it)."
6. "After DFS, check root — if NOT_MONITORED, add one more camera."

**Time Complexity**: O(n)
**Space Complexity**: O(h)

---

##### Q4: Diameter of Binary Tree
| Field | Value |
|-------|-------|
| **Platform** | LeetCode |
| **Link** | https://leetcode.com/problems/diameter-of-binary-tree/ |
| **Difficulty** | Easy |
| **Companies** | Google, Meta, Amazon, Microsoft |
| **Topic** | Dynamic Programming |
| **Pattern** | Tree DP |
| **Variation** | Height-based tree DP |
| **Frequency** | ★★★★★ (5/5) |

**Key Observation**: Diameter through a node = leftHeight + rightHeight. DFS returns height of subtree. Update global diameter at each node. Diameter may not pass through the root.

**Time Complexity**: O(n)
**Space Complexity**: O(h)

**Common Mistakes**:
- Assuming diameter always passes through root.
- Confusing height (edges) with depth (nodes).

---

##### Q5: Sum of Distances in Tree
| Field | Value |
|-------|-------|
| **Platform** | LeetCode |
| **Link** | https://leetcode.com/problems/sum-of-distances-in-tree/ |
| **Difficulty** | Hard |
| **Companies** | Google |
| **Topic** | Dynamic Programming |
| **Pattern** | Tree DP |
| **Variation** | Re-rooting technique |
| **Frequency** | ★★★★☆ (4/5) |

**Key Observation**: Two-pass DP. First pass (post-order): compute `dist[root]` and `count[node]` (subtree sizes). Second pass (pre-order, re-rooting): when re-rooting from parent to child, nodes in child's subtree get 1 closer, all other nodes get 1 farther. `dist[child] = dist[parent] - count[child] + (n - count[child])`.

**Time Complexity**: O(n)
**Space Complexity**: O(n)

**Common Mistakes**:
- Not understanding the re-rooting formula.
- Computing all-pairs distances in O(n²) instead of using re-rooting for O(n).

---

##### Q6: Longest Path With Different Adjacent Colors
| Field | Value |
|-------|-------|
| **Platform** | LeetCode |
| **Link** | https://leetcode.com/problems/longest-path-with-different-adjacent-colors/ |
| **Difficulty** | Hard |
| **Companies** | Google |
| **Topic** | Dynamic Programming |
| **Pattern** | Tree DP |
| **Variation** | Constrained path in general tree |
| **Frequency** | ★★★☆☆ (3/5) |

**Key Observation**: DFS returns longest path going downward with different colors. At each node, combine the two longest children paths (with different colors from current node) to form a candidate for the global answer.

**Time Complexity**: O(n)
**Space Complexity**: O(n)

---

### Mastery Framework

| Level | Description | Checkpoint |
|-------|-------------|------------|
| L0 | Doesn't think of DP on trees | Tries level-order or brute force |
| L1 | Can compute height/size with DFS | Solves Diameter of Binary Tree |
| L2 | Returns pairs from DFS (rob/skip) | Solves House Robber III |
| L3 | Handles global vs local tracking | Solves Maximum Path Sum |
| L4 | Uses re-rooting technique | Solves Sum of Distances in Tree |
| L5 | Designs novel Tree DP for unseen problems | Creates multi-state tree DP on the fly |

### Company-Specific Expectations

**Google**: Loves Tree DP. Maximum Path Sum and Sum of Distances are frequent. Expects clean DFS with clear explanation of return values. Re-rooting is a bonus.

**Amazon**: House Robber III is common. Expects you to explain the two-state DFS clearly.

**Meta**: Diameter and Max Path Sum are speed problems. Solve in under 10 minutes.

---

## Pattern 20.10: Game Theory DP

### Pattern Description

Game Theory DP handles problems where two players take turns making optimal moves. The core concept is **minimax**: one player maximizes the score, the other minimizes it (or equivalently, both maximize their own score). The DP state typically includes the current game configuration and whose turn it is.

### Core Invariant

**`dp[state]` = the optimal value the current player can achieve from `state`, assuming both players play optimally.** The current player chooses the move that maximizes their outcome; since the opponent also plays optimally, the opponent's response is the worst case for the current player.

### Recognition Signals

- Two players taking turns on a sequence/pile/grid.
- Both players play "optimally" (this is the minimax signal).
- Keywords: "game", "predict the winner", "stone game", "first player wins".
- The game involves choosing from ends of an array or taking from piles.
- The state space is polynomial (intervals, piles with bounded counts).

### Common Traps

- **Not recognizing both players play optimally**: Some candidates assume the second player plays randomly. "Optimal" means minimax.
- **Wrong turn tracking**: In interval games, you don't need an explicit "whose turn" variable if the interval length determines it (even length = player 1's turn, odd = player 2's, or vice versa).
- **Confusing "maximize difference" with "maximize own score"**: Stone Game asks if player 1 can win, which means maximize `score1 - score2`, not just `score1`.

### Curated Questions

---

##### Q1: Stone Game
| Field | Value |
|-------|-------|
| **Platform** | LeetCode |
| **Link** | https://leetcode.com/problems/stone-game/ |
| **Difficulty** | Medium |
| **Companies** | Google, Amazon |
| **Topic** | Dynamic Programming |
| **Pattern** | Game Theory DP |
| **Variation** | Interval game with optimal play |
| **Frequency** | ★★★★☆ (4/5) |

**Key Observation**: `dp[i][j]` = max score difference (current player - opponent) for piles `[i..j]`. At each turn, take `piles[i]` or `piles[j]`: `dp[i][j] = max(piles[i] - dp[i+1][j], piles[j] - dp[i][j-1])`. Player 1 wins if `dp[0][n-1] > 0`.

**Mathematical insight**: For even-length arrays, Player 1 always wins (can choose all odd-indexed or all even-indexed piles).

**Time Complexity**: O(n²)
**Space Complexity**: O(n²), optimizable to O(n)

---

##### Q2: Predict the Winner
| Field | Value |
|-------|-------|
| **Platform** | LeetCode |
| **Link** | https://leetcode.com/problems/predict-the-winner/ |
| **Difficulty** | Medium |
| **Companies** | Google, Amazon |
| **Topic** | Dynamic Programming |
| **Pattern** | Game Theory DP |
| **Variation** | Same as Stone Game but allows ties |
| **Frequency** | ★★★★☆ (4/5) |

**Key Observation**: Same as Stone Game but Player 1 wins if `dp[0][n-1] >= 0` (ties allowed). `dp[i][j]` = max net score for current player on `[i..j]`.

---

##### Q3: Stone Game III
| Field | Value |
|-------|-------|
| **Platform** | LeetCode |
| **Link** | https://leetcode.com/problems/stone-game-iii/ |
| **Difficulty** | Hard |
| **Companies** | Google |
| **Topic** | Dynamic Programming |
| **Pattern** | Game Theory DP |
| **Variation** | Take 1-3 elements from front |
| **Frequency** | ★★★☆☆ (3/5) |

**Key Observation**: `dp[i]` = max net score (current minus opponent) starting from index `i`. Current player takes 1, 2, or 3 stones: `dp[i] = max(sum(i, i+k) - dp[i+k+1]) for k in {0,1,2}`.

---

##### Q4: Nim Game
| Field | Value |
|-------|-------|
| **Platform** | LeetCode |
| **Link** | https://leetcode.com/problems/nim-game/ |
| **Difficulty** | Easy |
| **Companies** | Adobe, Google |
| **Topic** | Dynamic Programming |
| **Pattern** | Game Theory DP |
| **Variation** | Mathematical insight |
| **Frequency** | ★★★☆☆ (3/5) |

**Key Observation**: You lose if and only if n is divisible by 4. One-liner: `return n % 4 != 0`. The DP formulation: `dp[n] = !(dp[n-1] && dp[n-2] && dp[n-3])`.

---

##### Q5: Cat and Mouse
| Field | Value |
|-------|-------|
| **Platform** | LeetCode |
| **Link** | https://leetcode.com/problems/cat-and-mouse/ |
| **Difficulty** | Hard |
| **Companies** | Google |
| **Topic** | Dynamic Programming |
| **Pattern** | Game Theory DP |
| **Variation** | Graph-based game with cycles |
| **Frequency** | ★★★☆☆ (3/5) |

**Key Observation**: State: `(mouse_pos, cat_pos, whose_turn)`. Use BFS from terminal states backward (topological game solving). This is beyond standard minimax — it handles draws (cycles).

**Time Complexity**: O(n³)
**Space Complexity**: O(n²)

---

### Mastery Framework

| Level | Description | Checkpoint |
|-------|-------------|------------|
| L0 | Doesn't understand minimax | Assumes greedy works for both players |
| L1 | Can explain minimax concept | Understands "both play optimally" |
| L2 | Implements interval game DP | Solves Stone Game, Predict the Winner |
| L3 | Handles variants (take 1-3, different rules) | Solves Stone Game III |
| L4 | Graph-based game theory | Can approach Cat and Mouse |
| L5 | Spots mathematical shortcuts (Nim theory) | Reduces game to Sprague-Grundy when applicable |

---

## Pattern 20.11: DP Optimization

### Pattern Description

DP Optimization techniques reduce the complexity of DP solutions when the cost function or transition structure has special mathematical properties. These are primarily competitive programming techniques but occasionally appear in Google Hard interviews.

The main techniques:
1. **Convex Hull Trick (CHT)**: When the recurrence has the form `dp[i] = min(dp[j] + f(j) * g(i))` where `f(j)` is monotone. Reduces O(n²) to O(n) or O(n log n).
2. **Divide and Conquer DP**: When the optimal split point `opt[i]` is monotone (opt[i] ≤ opt[i+1]). Reduces O(n²k) to O(nk log n).
3. **Knuth's Optimization**: For interval DP where the cost function satisfies quadrangle inequality. Reduces O(n³) to O(n²).
4. **Aliens Trick (Lambda Optimization)**: Removes one dimension from the DP by binary searching on a Lagrange multiplier.

### Core Invariant

**The transition function has a mathematical structure (monotonicity, convexity, quadrangle inequality) that allows pruning the search space for the optimal transition.** Without this structure, the optimization doesn't apply.

### Recognition Signals

- You have a working O(n²) or O(n³) DP but the constraints require O(n log n) or O(n²).
- The cost function involves products of separate functions of `i` and `j`.
- The optimal split point in interval DP is "monotone" — it never decreases as the interval grows.
- The problem can be rephrased as "optimize linear functions" (CHT signal).

### Curated Questions

---

##### Q1: Frog Jump II (CHT example)
| Field | Value |
|-------|-------|
| **Platform** | Competitive Programming |
| **Difficulty** | Hard |
| **Topic** | Dynamic Programming |
| **Pattern** | DP Optimization |
| **Variation** | Convex Hull Trick |
| **Frequency** | ★★☆☆☆ (2/5) for interviews, ★★★★★ for CP |

**Key Observation**: When `dp[i] = min(dp[j] + (h[i] - h[j])²)`, expand the square to get `dp[i] = h[i]² + min(dp[j] + h[j]² - 2*h[i]*h[j])`. This is `min(m_j * x + b_j)` form where `x = h[i]`, `m_j = -2*h[j]`, `b_j = dp[j] + h[j]²`. Apply CHT.

---

##### Q2: LARGESTAREA (Knuth's Optimization example)
| Field | Value |
|-------|-------|
| **Platform** | Competitive Programming |
| **Difficulty** | Hard |
| **Topic** | Dynamic Programming |
| **Pattern** | DP Optimization |
| **Variation** | Knuth's optimization for interval DP |
| **Frequency** | ★★☆☆☆ for interviews |

**Key Observation**: Matrix Chain Multiplication with costs satisfying quadrangle inequality. Track `opt[i][j]` = optimal split point. Constrain search: `opt[i][j-1] ≤ opt[i][j] ≤ opt[i+1][j]`. Reduces O(n³) to O(n²).

---

### Mastery Framework

| Level | Description | Checkpoint |
|-------|-------------|------------|
| L0 | Doesn't know these exist | Uses O(n²) when O(n log n) exists |
| L1 | Has heard of CHT | Can explain the concept but not implement |
| L2 | Can implement CHT for simple cases | Applies CHT to "min linear functions" problems |
| L3 | Understands Knuth's and D&C DP | Can verify quadrangle inequality |
| L4 | Implements all four optimizations | Handles edge cases (non-monotone slopes for CHT) |
| L5 | Applies Aliens trick | Removes DP dimensions via Lagrange multiplier |

---

## Pattern 20.12: DP on Subsequences

### Pattern Description

DP on Subsequences deals with problems where you need to find an optimal subsequence (not substring — elements don't need to be contiguous) of the input. The classic example is Longest Increasing Subsequence (LIS).

The state is typically `dp[i]` = optimal answer for a subsequence *ending at* index `i`. The transition considers all previous indices `j < i` that satisfy some condition, making the naive approach O(n²). Many problems in this pattern have an O(n log n) optimization using binary search or data structures.

### Core Invariant

**`dp[i]` represents the optimal subsequence ending at index `i`. For each `i`, we check all valid predecessors `j < i` and take the best transition.** The "ending at i" formulation is essential — it allows building subsequences element by element.

### Recognition Signals

- "Longest/shortest subsequence with property X."
- Elements don't need to be contiguous (subsequence, not subarray).
- At each element, you decide whether to include it and what it extends.
- Keywords: "increasing", "decreasing", "chain", "compatible", "non-overlapping".
- Often: O(n²) DP with O(n log n) optimization available.

### Common Traps

- **Confusing subsequence with subarray**: Subarray is contiguous; subsequence is not.
- **Returning `dp[n-1]` instead of `max(dp)`**: The optimal subsequence may not end at the last element.
- **Missing the O(n log n) optimization**: For LIS, the O(n²) solution times out for n = 10^5. The patience sorting / binary search approach is essential.
- **Wrong binary search variant**: `lower_bound` for strictly increasing, `upper_bound` for non-decreasing. Mixing these up changes the semantics.

### Complexity Intuition

- **Time**: O(n²) naive (check all pairs), O(n log n) with binary search or data structures.
- **Space**: O(n) for the DP array.
- **Why**: n states, each taking O(n) to compute naively (check all predecessors). Binary search on the tails array reduces each state to O(log n).

### Curated Questions

---

##### Q1: Longest Increasing Subsequence
| Field | Value |
|-------|-------|
| **Platform** | LeetCode |
| **Link** | https://leetcode.com/problems/longest-increasing-subsequence/ |
| **Difficulty** | Medium |
| **Companies** | Google, Amazon, Meta, Microsoft, Apple, Uber |
| **Topic** | Dynamic Programming |
| **Pattern** | DP on Subsequences |
| **Variation** | Classic LIS |
| **Frequency** | ★★★★★ (5/5) |

**Key Observation**: `dp[i]` = LIS length ending at `i`. For each `j < i` with `nums[j] < nums[i]`: `dp[i] = max(dp[i], dp[j] + 1)`. O(n²). For O(n log n): maintain `tails[]` where `tails[k]` = smallest ending element of any increasing subsequence of length `k+1`. Binary search for each element's position.

**Expected Thought Process**:
1. "LIS — classic DP. O(n²) is straightforward."
2. "For n up to 10^5, need O(n log n) → patience sorting."
3. "Maintain tails array. For each element, binary search for its position."
4. "If element > all tails, extend. Otherwise, replace the first tail ≥ element."

**Time Complexity**: O(n log n) with binary search
**Space Complexity**: O(n)

**Common Mistakes**:
- Thinking the tails array IS the LIS — it has the correct length but not the correct elements.
- Using wrong binary search variant (lower_bound vs upper_bound).
- Returning dp[n-1] instead of max(dp) in the O(n²) approach.

**Follow-Up Questions**:
- "Print the actual LIS." → Track parent pointers and positions.
- "Count the number of LIS." → LC 673: maintain both `lengths[]` and `counts[]` arrays.
- "Longest non-decreasing subsequence." → Use upper_bound instead of lower_bound.

---

##### Q2: Russian Doll Envelopes
| Field | Value |
|-------|-------|
| **Platform** | LeetCode |
| **Link** | https://leetcode.com/problems/russian-doll-envelopes/ |
| **Difficulty** | Hard |
| **Companies** | Google, Amazon, Meta |
| **Topic** | Dynamic Programming |
| **Pattern** | DP on Subsequences |
| **Variation** | 2D LIS |
| **Frequency** | ★★★★☆ (4/5) |

**Key Observation**: Sort by width ascending. For ties in width, sort by height *descending*. Then LIS on heights gives the answer. The descending-height tie-breaking ensures you can't nest two envelopes with the same width.

**Expected Thought Process**:
1. "2D nesting → reduce to 1D LIS."
2. "Sort by width ASC. For same width, sort height DESC."
3. "Why DESC? To prevent selecting two envelopes with same width."
4. "Apply O(n log n) LIS on heights."

**Time Complexity**: O(n log n)
**Space Complexity**: O(n)

**Common Mistakes**:
- Not reversing height for same-width envelopes.
- Using O(n²) LIS instead of O(n log n).

---

##### Q3: Number of Longest Increasing Subsequence
| Field | Value |
|-------|-------|
| **Platform** | LeetCode |
| **Link** | https://leetcode.com/problems/number-of-longest-increasing-subsequence/ |
| **Difficulty** | Medium |
| **Companies** | Google, Amazon, Meta |
| **Topic** | Dynamic Programming |
| **Pattern** | DP on Subsequences |
| **Variation** | Counting optimal subsequences |
| **Frequency** | ★★★★☆ (4/5) |

**Key Observation**: Maintain both `lengths[i]` and `counts[i]`. For each `j < i` with `nums[j] < nums[i]`: if `lengths[j] + 1 > lengths[i]`, update `lengths[i]` and set `counts[i] = counts[j]`. If `lengths[j] + 1 == lengths[i]`, add: `counts[i] += counts[j]`.

**Time Complexity**: O(n²)
**Space Complexity**: O(n)

---

##### Q4: Longest String Chain
| Field | Value |
|-------|-------|
| **Platform** | LeetCode |
| **Link** | https://leetcode.com/problems/longest-string-chain/ |
| **Difficulty** | Medium |
| **Companies** | Google, Amazon, Meta |
| **Topic** | Dynamic Programming |
| **Pattern** | DP on Subsequences |
| **Variation** | LIS with custom comparison |
| **Frequency** | ★★★★☆ (4/5) |

**Key Observation**: Sort by length. `dp[word]` = longest chain ending at `word`. For each word, try removing each character → check if predecessor exists in map. `dp[word] = max(dp[predecessor] + 1)`.

**Time Complexity**: O(n × L²) where L = max word length
**Space Complexity**: O(n)

---

##### Q5: Delete and Earn
| Field | Value |
|-------|-------|
| **Platform** | LeetCode |
| **Link** | https://leetcode.com/problems/delete-and-earn/ |
| **Difficulty** | Medium |
| **Companies** | Google, Amazon |
| **Topic** | Dynamic Programming |
| **Pattern** | DP on Subsequences |
| **Variation** | Reduction to House Robber |
| **Frequency** | ★★★★☆ (4/5) |

**Key Observation**: Group elements by value. Sum up all instances of each value. Now the problem becomes: choose a subset of values (no two consecutive) to maximize total. This is exactly House Robber on the "sum by value" array.

**Time Complexity**: O(n + max_val)
**Space Complexity**: O(max_val)

---

##### Q6: Longest Arithmetic Subsequence
| Field | Value |
|-------|-------|
| **Platform** | LeetCode |
| **Link** | https://leetcode.com/problems/longest-arithmetic-subsequence/ |
| **Difficulty** | Medium |
| **Companies** | Google, Amazon |
| **Topic** | Dynamic Programming |
| **Pattern** | DP on Subsequences |
| **Variation** | LIS with fixed difference |
| **Frequency** | ★★★★☆ (4/5) |

**Key Observation**: `dp[i][d]` = length of longest arithmetic subsequence ending at `i` with common difference `d`. For each pair `(j, i)` with `j < i`: `d = nums[i] - nums[j]`, `dp[i][d] = dp[j][d] + 1`. Use a HashMap for the `d` dimension.

**Time Complexity**: O(n²)
**Space Complexity**: O(n²)

---

### Mastery Framework

| Level | Description | Checkpoint |
|-------|-------------|------------|
| L0 | Confuses subsequence with subarray | Wrong approach entirely |
| L1 | Can implement O(n²) LIS | Solves LIS with nested loops |
| L2 | Understands O(n log n) LIS optimization | Implements patience sorting correctly |
| L3 | Handles 2D LIS (Russian Doll) | Correct sorting + LIS reduction |
| L4 | Counts LIS, handles variants | Solves Number of LIS, String Chain |
| L5 | Spots LIS-like structure in novel problems | Reduces unfamiliar problems to LIS variants |

---

## DP Mock Interviews

### Mock Interview 1: The Museum Security

**Format**: Google Phone Screen
**Duration**: 45 minutes
**Difficulty**: Medium

**Interviewer Script**:
"Imagine you're designing a security system for a museum. The museum has a row of display rooms, each containing artifacts of different values. Due to budget constraints, you can only place a security camera in some rooms. However, there's a catch — if two adjacent rooms both have cameras, the electromagnetic interference makes both cameras malfunction. Given the values of artifacts in each room, what's the maximum total value of artifacts you can protect?"

**Expected Clarifying Questions**:
- "Are the rooms in a straight line or circular?" (Answer: straight line for now)
- "Can a room with no camera still be protected?" (Answer: no, only camera rooms are protected)
- "Are all values positive?" (Answer: yes)

**Follow-Up 1**: "Now what if the rooms form a circular corridor — the first and last rooms are adjacent?"
**Follow-Up 2**: "What if instead of a line, the rooms are arranged in a binary tree structure, where each room has a parent room?"

**Hidden Pattern**: House Robber → House Robber II → House Robber III
**Recognition Process**: "Non-adjacent selection to maximize value" → classic 1D Linear DP (take-or-skip pattern).

**Solution Path**:
1. Define `dp[i]` = max value protecting rooms `0..i`.
2. `dp[i] = max(dp[i-1], dp[i-2] + values[i])`.
3. Follow-up 1: Run twice — exclude first room, exclude last room.
4. Follow-up 2: DFS returning `(protect, skip)` pair per node.

**Common Mistakes**: Not handling the circular case correctly (running only once), returning wrong values from tree DFS.

**Evaluation Rubric**:

| Signal | Reject | Hire | Strong Hire |
|--------|--------|------|-------------|
| Pattern Recognition | Doesn't see DP for 10+ min | Identifies DP within 3 min | Immediately says "House Robber" |
| Solution Quality | Buggy base cases | Correct after 1 debug | Clean first attempt + space opt |
| Communication | Silent coding | Explains approach | Walks through state transitions naturally |
| Follow-Ups | Can't handle circular | Solves circular with help | Handles circular and tree variants unprompted |

---

### Mock Interview 2: The Stock Trading Bot

**Format**: Meta Coding Interview (2 problems, 35 min)
**Duration**: 15 minutes (first of two)
**Difficulty**: Medium

**Interviewer Script**:
"You're building a stock trading bot. You have an array of daily stock prices. The bot can make unlimited buy/sell transactions, but there's a mandatory one-day cooldown after selling before the bot can buy again. What's the maximum profit the bot can make?"

**Expected Clarifying Questions**:
- "Can the bot hold multiple stocks at once?" (No, at most one)
- "Does the cooldown apply after buying too?" (No, only after selling)
- "Can the bot buy and sell on the same day?" (No)

**Follow-Up 1**: "What if instead of a cooldown, there's a fixed transaction fee per trade?"
**Follow-Up 2**: "What if the bot can make at most k transactions total?"

**Hidden Pattern**: Best Time to Buy and Sell Stock with Cooldown → with Fee → Stock IV
**Recognition Process**: "Stock trading with constraints on state transitions" → State Machine DP.

**Solution Path**:
1. Draw 3-state machine: held, sold, rest.
2. Write transitions: `held = max(held, rest - price)`, `sold = held + price`, `rest = max(rest, sold)`.
3. O(n) time, O(1) space.

**Evaluation Rubric**:

| Signal | Reject | Hire | Strong Hire |
|--------|--------|------|-------------|
| Speed | > 15 min | 10-15 min | < 8 min with clean code |
| State Machine | Can't identify states | Gets 2 states (misses cooldown) | Draws 3-state diagram immediately |
| Follow-Ups | Stuck on fee or k | Handles fee, struggles with k | Handles both, recognizes k ≥ n/2 edge case |

---

### Mock Interview 3: The Balloon Festival

**Format**: Google Onsite
**Duration**: 45 minutes
**Difficulty**: Hard

**Interviewer Script**:
"At a balloon festival, balloons are arranged in a line. Each balloon has a number on it. When you pop a balloon, you earn coins equal to the number on that balloon multiplied by the numbers on its two adjacent balloons. After popping, the remaining balloons close the gap. If the balloon has no neighbor on one side, treat that side as having a balloon with number 1. You want to maximize the total coins earned by popping all balloons. How would you approach this?"

**Expected Clarifying Questions**:
- "Can the balloon numbers be zero or negative?" (Non-negative)
- "What's the constraint on n?" (n ≤ 500)

**Follow-Up 1**: "Walk me through your state definition. Why did you define it that way?"
**Follow-Up 2**: "Can you trace through a small example: [3, 1, 5, 8]?"

**Hidden Pattern**: Burst Balloons (Interval DP)
**Recognition Process**: "Order of operations matters, elements interact with neighbors, result changes based on removal order" → think about last operation → Interval DP.

**Solution Path**:
1. Key insight: think about which balloon to pop LAST in range [i, j].
2. Add padding [1, ...nums..., 1].
3. `dp[i][j]` = max coins from popping all balloons in (i, j) exclusive.
4. For each k in (i, j): `dp[i][j] = max(dp[i][k] + dp[k][j] + nums[i]*nums[k]*nums[j])`.

**Evaluation Rubric**:

| Signal | Reject | Hire | Strong Hire |
|--------|--------|------|-------------|
| Pattern Recognition | Tries greedy/backtracking for 15+ min | Finds interval DP with hints | Gets "last operation" insight independently |
| State Definition | Can't define state | Correct state after hints | Clear dp[i][j] definition with explanation |
| Implementation | Buggy loop structure | Correct with minor debug | Clean code with padding trick |
| Trace-Through | Can't trace correctly | Traces with occasional errors | Clean trace, catches edge cases |

---

### Mock Interview 4: The Message Decoder

**Format**: Uber Phone Screen
**Duration**: 45 minutes
**Difficulty**: Medium

**Interviewer Script**:
"We have an encoding scheme where 'A' → 1, 'B' → 2, ..., 'Z' → 26. Given a string of digits, count how many ways it can be decoded. For example, '12' can be decoded as 'AB' (1, 2) or 'L' (12), so the answer is 2."

**Expected Clarifying Questions**:
- "Can the input contain '0'?" (Yes, and '0' alone is not valid)
- "What about leading zeros like '01'?" (Not valid as a single-digit decode)

**Follow-Up 1**: "What if the input contains '*' which represents any digit from 1-9?"
**Follow-Up 2**: "Can you optimize space to O(1)?"

**Hidden Pattern**: Decode Ways → Decode Ways II
**Recognition Process**: "Count the ways to partition a string" → 1D Linear DP with partition structure.

**Evaluation Rubric**:

| Signal | Reject | Hire | Strong Hire |
|--------|--------|------|-------------|
| Pattern Recognition | Doesn't see DP | Sees DP but struggles with '0' | Immediately handles all '0' cases |
| Edge Cases | Misses '0' handling | Handles basic '0' | Handles '0', '10', '20', '30', leading zeros |
| Follow-Ups | Can't extend to '*' | Partial '*' handling | Full Decode Ways II solution |

---

### Mock Interview 5: The Hiking Trail

**Format**: Amazon Onsite
**Duration**: 45 minutes
**Difficulty**: Medium

**Interviewer Script**:
"You're planning a hiking trip. You have a grid representing terrain elevation. Starting from the top-left corner, you want to reach the bottom-right corner. You can only move right or down. Each step costs energy equal to the elevation at the destination. Find the path that minimizes total energy cost."

**Follow-Up 1**: "Now the terrain also has impassable cliffs (cells with value -1). How does this change things?"
**Follow-Up 2**: "What if you need minimum health at the start to survive the journey? (Each cell adds or removes health, and health must stay above 0 at all times.)"

**Hidden Pattern**: Minimum Path Sum → with obstacles → Dungeon Game (reverse DP)

**Evaluation Rubric**:

| Signal | Reject | Hire | Strong Hire |
|--------|--------|------|-------------|
| Grid DP | Can't set up the grid DP | Correct DP with minor bugs | Clean solution with space optimization |
| Obstacles | Can't handle obstacles | Handles after hints | Handles correctly including edge cases |
| Dungeon Game | Can't reverse the DP | Sees need for reverse but struggles | Reverse DP from bottom-right, correct base cases |

---

### Mock Interview 6: The Efficient Warehouse

**Format**: Google Onsite
**Duration**: 45 minutes
**Difficulty**: Hard

**Interviewer Script**:
"You're designing a warehouse system. You have n items, each with a weight and a value. Your storage shelf has a weight capacity W. You want to maximize the total value of items on the shelf. Each item can only be selected once."

**Follow-Up 1**: "Now each item can be selected unlimited times."
**Follow-Up 2**: "Can you tell me which items are on the shelf?"
**Follow-Up 3**: "What if you have multiple shelves?"

**Hidden Pattern**: 0/1 Knapsack → Unbounded Knapsack → Solution reconstruction → Multiple Knapsack

**Evaluation Rubric**:

| Signal | Reject | Hire | Strong Hire |
|--------|--------|------|-------------|
| Knapsack | Can't set up 2D DP | Correct DP, some base case issues | O(nW) first attempt, explains 0/1 vs unbounded |
| Space Opt | Doesn't mention | Knows it's possible but can't do it | 1D array with correct loop direction |
| Reconstruction | Can't trace back | Traces back with guidance | Backtracking through DP table, explains algorithm |

---

### Mock Interview 7: The Text Editor

**Format**: Meta Coding Interview
**Duration**: 20 minutes
**Difficulty**: Hard

**Interviewer Script**:
"You're building a spell checker. Given two strings — the misspelled word and the correct word — find the minimum number of edits (insert, delete, replace a character) to transform one into the other."

**Follow-Up 1**: "Print the sequence of operations."
**Follow-Up 2**: "What if different operations have different costs?"

**Hidden Pattern**: Edit Distance (String DP)

**Evaluation Rubric**:

| Signal | Reject | Hire | Strong Hire |
|--------|--------|------|-------------|
| Speed | > 15 min | 10-15 min | < 8 min |
| String DP | Can't define states | Correct dp[i][j] definition | Clean solution with O(n) space |
| Operations trace | Can't reconstruct | Reconstructs slowly | Clean backtracking through table |

---

### Mock Interview 8: The Video Playlist

**Format**: Uber Technical Interview
**Duration**: 45 minutes
**Difficulty**: Medium

**Interviewer Script**:
"You have a list of video clips with different durations. Each clip has a quality rating. You want to find the longest sequence of clips such that each clip's quality rating is strictly higher than the previous one. What's the length of this longest sequence?"

**Follow-Up 1**: "Now I want the actual clips, not just the length."
**Follow-Up 2**: "What if I give you a million clips? Can you make it faster than O(n²)?"

**Hidden Pattern**: Longest Increasing Subsequence

**Evaluation Rubric**:

| Signal | Reject | Hire | Strong Hire |
|--------|--------|------|-------------|
| LIS Recognition | Doesn't see LIS | Recognizes after thinking | Immediately says "LIS" |
| O(n²) Solution | Can't implement | Implements with minor bugs | Clean implementation |
| O(n log n) | Doesn't know about it | Knows concept, can't implement | Implements patience sorting with binary search |

---

### Mock Interview 9: The Currency Exchange

**Format**: Goldman Sachs / FinTech
**Duration**: 45 minutes  
**Difficulty**: Medium-Hard

**Interviewer Script**:
"You're given a sequence of daily exchange rates for a currency pair. You can make at most k buy-sell transactions. Find the maximum profit."

**Follow-Up 1**: "What's the time complexity? Can you handle k up to n/2 efficiently?"
**Follow-Up 2**: "What if there's a 1% transaction fee on each trade?"

**Hidden Pattern**: Best Time to Buy and Sell Stock IV → with fee

**Evaluation Rubric**:

| Signal | Reject | Hire | Strong Hire |
|--------|--------|------|-------------|
| State Machine | Can't model states | Gets (day, transactions, holding) | Models cleanly with edge case k ≥ n/2 |
| Optimization | O(nk) without pruning | Handles k ≥ n/2 case | O(n) for large k, O(nk) otherwise |
| Fee Extension | Stuck | Subtracts fee but wrong place | Clean integration into state machine |

---

### Mock Interview 10: The Package Delivery

**Format**: Amazon Onsite
**Duration**: 45 minutes
**Difficulty**: Hard

**Interviewer Script**:
"You're managing a fleet of delivery drones. There are n packages, each needing delivery to different locations. Each drone can carry one package at a time and the cost of traveling between locations varies. You need to assign all packages to drones to minimize total travel distance. Each location must be visited exactly once."

**Follow-Up 1**: "What's the constraint on n?" (n ≤ 15)
**Follow-Up 2**: "What if some drones have limited fuel?"

**Hidden Pattern**: Travelling Salesman Problem (Bitmask DP)

**Evaluation Rubric**:

| Signal | Reject | Hire | Strong Hire |
|--------|--------|------|-------------|
| n ≤ 15 Signal | Misses the constraint hint | Recognizes small n but tries heuristic | Immediately says "bitmask DP, n ≤ 15" |
| Bitmask DP | Can't set up state | Sets up dp[mask][i] with guidance | Clean TSP implementation |
| Complexity | Doesn't analyze | Says "exponential" | States O(2^n × n²) precisely |

---

## DP Hiring Evaluation Framework

### What Makes a Candidate Reject / Borderline / Hire / Strong Hire

#### Google

| Level | DP Signal |
|-------|-----------|
| **Reject** | Cannot identify DP problems. Tries brute force for 20+ minutes. Cannot write basic recurrences. |
| **Borderline** | Identifies DP but takes too long. Gets base cases wrong. Cannot handle follow-ups. |
| **Hire** | Identifies pattern within 3 minutes. Clean O(optimal) solution. Handles one follow-up well. |
| **Strong Hire** | Immediately identifies pattern family. Clean code on first attempt. Handles all follow-ups. Discusses optimizations unprompted. |

#### Meta

| Level | DP Signal |
|-------|-----------|
| **Reject** | Cannot solve a medium DP problem in 20 minutes. |
| **Borderline** | Solves medium DP but slowly (15+ min) with bugs. |
| **Hire** | Solves medium DP in under 12 minutes cleanly. |
| **Strong Hire** | Solves medium DP in under 8 minutes, immediately discusses edge cases and optimizations. |

#### Uber

| Level | DP Signal |
|-------|-----------|
| **Reject** | Cannot set up DP states for a medium problem. |
| **Borderline** | Sets up states but implementation has bugs. Cannot optimize. |
| **Hire** | Clean solution with correct states and transitions. Handles one follow-up. |
| **Strong Hire** | Recognizes the DP pattern variant, discusses tradeoffs, anticipates follow-ups. |

#### Amazon

| Level | DP Signal |
|-------|-----------|
| **Reject** | Cannot explain their approach. Jump to code without thinking. |
| **Borderline** | Explains approach but code is buggy. Takes hints to fix. |
| **Hire** | Methodical approach: brute force → optimize → clean code. Good communication. |
| **Strong Hire** | Excellent communication throughout. Discusses multiple approaches before choosing. Handles edge cases proactively. |

#### Atlassian

| Level | DP Signal |
|-------|-----------|
| **Reject** | Cannot communicate thought process. Gets stuck without progress. |
| **Borderline** | Communicates well but solution quality is low. |
| **Hire** | Good communication + correct solution. Considers real-world implications. |
| **Strong Hire** | Outstanding communication + fast + discusses production considerations (memory, scalability). |

---

## Top 15 DP Mistakes

### Mistake 1: Wrong State Definition
**Description**: Defining `dp[i]` as "best answer for the entire array" instead of "best answer for prefix/suffix ending at i."
**Affected Patterns**: All DP patterns
**How to Avoid**: Always ask "what information do I need to make the NEXT decision?" That's your state.
**Example**: LIS — `dp[i]` = LIS ending at `i` (correct) vs `dp[i]` = LIS in `arr[0..i]` (wrong, can't build recurrence).

### Mistake 2: Off-by-One in Base Cases
**Description**: Setting `dp[0] = 0` when it should be `dp[0] = 1`, or `dp[0] = nums[0]`.
**Affected Patterns**: 1D Linear DP, Grid DP
**How to Avoid**: Trace through the smallest input (n=1, n=2) manually before coding.
**Example**: Climbing Stairs — `dp[0] = 1` (one way to be at ground), not `dp[0] = 0`.

### Mistake 3: Wrong Traversal Order in Bottom-Up DP
**Description**: Computing states that depend on uncomputed states.
**Affected Patterns**: Interval DP, 2D DP, Knapsack
**How to Avoid**: Always verify that when you compute `dp[i][j]`, all dependencies are already computed.
**Example**: Interval DP — must iterate by interval length, not by starting index.

### Mistake 4: Confusing 0/1 Knapsack Loop Order with Unbounded
**Description**: In 0/1 knapsack with 1D space optimization, iterating weight forward allows items to be used multiple times (unbounded). Must iterate backward.
**Affected Patterns**: Knapsack Family
**How to Avoid**: Remember: backward for 0/1 (each item once), forward for unbounded.
**Example**: Partition Equal Subset Sum — iterate capacity from high to low.

### Mistake 5: Missing the "Last Operation" Insight in Interval DP
**Description**: Trying to decide what to do FIRST in an interval, leading to invalid subproblems.
**Affected Patterns**: Interval DP
**How to Avoid**: Always ask "what is the LAST operation in range [i, j]?"
**Example**: Burst Balloons — deciding which balloon to burst first makes adjacent elements change unpredictably.

### Mistake 6: Not Clamping Negative Subtrees in Tree DP
**Description**: Including a subtree with negative contribution in the path.
**Affected Patterns**: Tree DP
**How to Avoid**: Use `max(0, subtreeValue)` before including a subtree.
**Example**: Maximum Path Sum — a subtree with negative sum should be excluded.

### Mistake 7: Returning "Through" Path to Parent in Tree DP
**Description**: Returning a path that goes left→node→right to the parent, which can't extend it further.
**Affected Patterns**: Tree DP
**How to Avoid**: DFS returns single-direction path. "Through" path updates global variable only.
**Example**: Maximum Path Sum — return `node + max(left, right, 0)`, update global with `node + max(0, left) + max(0, right)`.

### Mistake 8: Not Drawing the State Machine Diagram
**Description**: Jumping to code without visualizing states and transitions.
**Affected Patterns**: State Machine DP
**How to Avoid**: ALWAYS draw circles (states) and arrows (transitions) before coding.
**Example**: Stock with Cooldown — missing the cooldown state leads to wrong transitions.

### Mistake 9: Using Integer.MAX_VALUE Without Overflow Check
**Description**: `dp[amount] = Integer.MAX_VALUE; dp[amount] + 1` overflows to negative.
**Affected Patterns**: 1D Linear DP, Knapsack
**How to Avoid**: Use `amount + 1` or `n + 1` as infinity instead of `MAX_VALUE`.
**Example**: Coin Change — `dp[amount] = Integer.MAX_VALUE; if (dp[amount - coin] + 1 < dp[amount])` overflows.

### Mistake 10: Applying Greedy When DP is Required
**Description**: Assuming locally optimal = globally optimal without proof.
**Affected Patterns**: All DP patterns
**How to Avoid**: Try to find a counterexample where greedy fails. If you find one, use DP.
**Example**: Coin Change with non-canonical coins — greedy gives `[4, 1, 1]` when optimal is `[3, 3]`.

### Mistake 11: Not Handling Leading Zeros in Digit DP
**Description**: Counting "007" as a 3-digit number.
**Affected Patterns**: Digit DP
**How to Avoid**: Track a `started` boolean flag, or handle numbers with fewer digits separately.
**Example**: Count Numbers with Unique Digits — "01" should be treated as "1".

### Mistake 12: Forgetting Space Optimization After Solving
**Description**: Leaving O(n²) space when O(n) is trivially possible.
**Affected Patterns**: Grid DP, String DP
**How to Avoid**: After solving, check if dp[i] depends only on dp[i-1]. If so, use rolling array.
**Example**: LCS — `dp[i][j]` depends on row `i-1` only. Keep two rows.

### Mistake 13: Wrong Binary Search Variant for O(n log n) LIS
**Description**: Using `upper_bound` instead of `lower_bound` (or vice versa).
**Affected Patterns**: DP on Subsequences
**How to Avoid**: For strictly increasing: `lower_bound` (replace first element ≥ current). For non-decreasing: `upper_bound`.
**Example**: LIS — using `upper_bound` gives longest non-decreasing subsequence.

### Mistake 14: Not Recognizing n ≤ 20 as Bitmask Signal
**Description**: Trying O(n²) or O(n³) when bitmask DP is the intended approach.
**Affected Patterns**: Bitmask DP
**How to Avoid**: Any problem with n ≤ 20-22 and subset/permutation structure → think bitmask DP.
**Example**: Partition to K Equal Sum Subsets — n ≤ 16, use bitmask DP.

### Mistake 15: Confusing "Subsequence" with "Subarray"
**Description**: Solving for contiguous elements when the problem asks for non-contiguous.
**Affected Patterns**: DP on Subsequences
**How to Avoid**: Read the problem statement carefully. Subsequence = non-contiguous, subarray = contiguous.
**Example**: Longest Increasing Subsequence — elements don't need to be adjacent.
