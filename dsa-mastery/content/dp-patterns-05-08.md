# Topic 20: Dynamic Programming — Patterns 20.5-20.8

> These are the intermediate-to-advanced DP patterns. Mastering these separates
> 'Hire' from 'Strong Hire' at Tier 1 companies.

---

## Pattern 20.5: Interval DP

### Pattern Description

Interval DP operates on contiguous subarrays (intervals) of the input. The state is `dp[i][j]` representing the optimal answer for the subarray `arr[i..j]`. The core idea is that to solve a problem on interval `[i, j]`, you try every possible way to split it into two smaller intervals `[i, k]` and `[k+1, j]` (or identify the "last operation" performed on the interval), combining their solutions optimally.

This pattern is fundamentally different from linear DP because the subproblems aren't prefixes or suffixes — they're arbitrary contiguous ranges. The traversal order matters critically: you must solve shorter intervals before longer ones, so the outer loop iterates by interval length.

Interval DP is the pattern that separates good DP solvers from great ones. While many candidates can handle 1D and 2D DP, Interval DP requires a conceptual leap: thinking about "what happens last" rather than "what happens first." The classic example is Matrix Chain Multiplication — you don't decide which multiplication to do *first*; you decide which multiplication to do *last*, because that determines the final cost structure.

### Core Invariant

**`dp[i][j]` represents the optimal answer for the subarray `arr[i..j]`, computed by trying all possible "split points" or "last operations" within the interval.** The interval `[i, j]` is fully determined by its boundaries, and shorter intervals are always solved before longer ones.

### Recognition Signals

- The problem involves a linear sequence where you perform operations that merge/remove/split elements.
- The answer depends on the order of operations on a contiguous range.
- You need to consider "what to do last" within a range.
- Keywords: "burst", "merge", "partition", "multiply chain", "remove from both ends".
- Constraint: `n ≤ 500` (O(n³) is acceptable) or `n ≤ 100` (O(n³) comfortable).
- The problem can't be solved greedily because the order of operations matters.

### Common Traps

- **Wrong loop structure**: The outer loop must iterate over interval *length* (from 2 to n), not over starting index. If you loop over `i` then `j`, shorter intervals needed as subproblems may not yet be computed.
- **Off-by-one in split points**: For interval `[i, j]`, splits go from `k = i` to `k = j-1` (or `k = i+1` to `k = j-1` depending on the problem). Getting this range wrong causes missed solutions or overcounting.
- **Missing the "last operation" insight**: Many candidates try to think about what to do *first*, which leads to overlapping subproblems that don't decompose cleanly. The right approach is almost always to fix what happens *last*.
- **Forgetting base cases for single-element and two-element intervals**: `dp[i][i]` is the base case (interval of length 1). Some problems also need explicit handling of `dp[i][i+1]`.

### Complexity Intuition

- **Time**: O(n³) typically — O(n²) states, each taking O(n) to compute (trying all split points).
- **Space**: O(n²) for the DP table.
- **Why**: There are C(n, 2) ≈ n²/2 intervals, and for each interval, you try O(n) split points. Some problems with additional constraints can be O(n²) with Knuth's optimization.

### Hidden Variations

1. **Palindrome problems**: Longest Palindromic Subsequence is interval DP where `dp[i][j]` = LPS length for `s[i..j]`.
2. **Merging stones**: Instead of splitting, you're merging adjacent groups. The split point represents where the last merge boundary falls.
3. **Printing**: Strange Printer — the printer can print a range of the same character. `dp[i][j]` = min turns to print `s[i..j]`.
4. **Triangulation**: Minimum Score Triangulation — split a polygon along diagonals. Each split creates a triangle.
5. **Game theory on intervals**: Stone Game where players take from both ends of an interval.

### Follow-Up Variations

- **"Can you optimize from O(n³) to O(n²)?"** → Knuth's optimization if the cost function satisfies quadrangle inequality.
- **"What if merging has a constraint (e.g., merge at most k piles at once)?"** → Minimum Cost to Merge Stones with constraint k. Check if (n-1) % (k-1) == 0.
- **"Print the optimal parenthesization."** → Maintain a split-point table and reconstruct.
- **"What if the sequence is circular?"** → Double the array: process `arr + arr` and take intervals of length n.

### Interview Frequency

| Company | Frequency | Typical Difficulty |
|---------|-----------|-------------------|
| Google | ★★★★☆ | Hard |
| Meta | ★★☆☆☆ | Rare, Hard |
| Amazon | ★★☆☆☆ | Rare |
| Uber | ★★★☆☆ | Hard |
| Microsoft | ★★☆☆☆ | Rare |
| Competitive Programming | ★★★★★ | Standard |

### How Interviewers Expect You to Identify It

When the interviewer describes a problem involving sequential operations on a linear structure — bursting balloons, multiplying matrices, merging piles — they expect you to:

1. **Within 2 minutes**: Recognize this as interval DP. Say: "The answer for a range depends on how we partition it, so this is interval DP."
2. **Within 5 minutes**: Define `dp[i][j]` clearly and articulate the recurrence with the split point `k`.
3. **Within 15 minutes**: Have working code with correct base cases and loop structure.
4. **Bonus**: Discuss Knuth's optimization if time permits.

### Why Candidates Fail

1. **Can't get past the "first operation" mindset**: They try to decide what to burst/merge first, leading to state spaces that don't decompose.
2. **Wrong loop structure**: Iterating `i` from 0 to n and `j` from i to n, instead of iterating by interval length. This causes them to reference uncomputed states.
3. **Boundary errors in the split loop**: Off-by-one in the range of `k` values.
4. **Not recognizing the pattern**: They try backtracking, BFS, or greedy on problems that are clearly interval DP.

### How Elite Candidates Think

Elite candidates immediately recognize the interval DP template:

```java
// Template for Interval DP
// dp[i][j] = optimal answer for interval [i, j]
// Base cases: dp[i][i] = base_value for all i

for (int len = 2; len <= n; len++) {          // interval length
    for (int i = 0; i + len - 1 < n; i++) {   // start index
        int j = i + len - 1;                   // end index
        dp[i][j] = worst_value; // INF for min, -INF for max
        for (int k = i; k < j; k++) {          // split point
            dp[i][j] = best_of(dp[i][j],
                dp[i][k] ⊕ dp[k+1][j] ⊕ cost(i, k, j));
        }
    }
}
return dp[0][n-1];
```

The key insight they apply: **"What is the last operation?"** For Burst Balloons, the last balloon to burst in range `[i, j]` is `k`. For Matrix Chain, the last multiplication is between the product of `[i..k]` and `[k+1..j]`.

### Curated Questions

---

##### Q1: Burst Balloons
| Field | Value |
|-------|-------|
| **Platform** | LeetCode |
| **Link** | https://leetcode.com/problems/burst-balloons/ |
| **Difficulty** | Hard |
| **Companies** | Google, Amazon, Uber, Microsoft |
| **Topic** | Dynamic Programming |
| **Pattern** | Interval DP |
| **Variation** | Last-operation decomposition |
| **Frequency** | ★★★★★ (5/5) |

**Key Observation**: Instead of thinking about which balloon to burst *first*, think about which balloon to burst *last* in interval `[i, j]`. If balloon `k` is the last one burst in `[i, j]`, then at that point only balloons `i-1`, `k`, and `j+1` remain adjacent. So `dp[i][j] = max over k of (dp[i][k-1] + dp[k+1][j] + nums[i-1]*nums[k]*nums[j+1])`.

**Expected Thought Process**:
1. "Bursting balloons in different orders gives different scores. Order matters → not greedy."
2. "If I burst balloon k first, the adjacent balloons change — this breaks simple subproblem decomposition."
3. "Key insight: think about the *last* balloon to burst in a range. When it's the last, its neighbors are the boundaries of the range."
4. "Add padding: `nums = [1] + nums + [1]`. Now `dp[i][j]` for the original range `[1, n]`."
5. "Recurrence: `dp[i][j] = max over k in [i,j] of (dp[i][k-1] + dp[k+1][j] + nums[i-1]*nums[k]*nums[j+1])`."

**Alternative Solutions**:
- Backtracking with memoization: Exponential without proper state definition. The interval DP state is the right one.
- Top-down with interval parameters: Same O(n³) complexity, easier to implement for some.

**Time Complexity**: O(n³)
**Space Complexity**: O(n²)

**Common Mistakes**:
- Thinking about which balloon to burst first (leads to invalid subproblems).
- Forgetting to add the padding `[1]` on both ends.
- Off-by-one errors in the range of `k` within `[i, j]`.

**Follow-Up Questions**:
- "What if some balloons can't be burst?" → Add constraints to the `k` loop.
- "Print the optimal bursting order." → Track the optimal `k` for each interval and reconstruct.
- "What's the time complexity? Can it be improved?" → O(n³) is optimal for general interval DP; Knuth's optimization doesn't apply here because the cost function doesn't satisfy quadrangle inequality.

---

##### Q2: Matrix Chain Multiplication
| Field | Value |
|-------|-------|
| **Platform** | LeetCode (as variants) / GeeksforGeeks |
| **Link** | https://www.geeksforgeeks.org/matrix-chain-multiplication-dp-8/ |
| **Difficulty** | Hard |
| **Companies** | Google, Amazon, Microsoft |
| **Topic** | Dynamic Programming |
| **Pattern** | Interval DP |
| **Variation** | Classic split-point optimization |
| **Frequency** | ★★★★☆ (4/5) |

**Key Observation**: Given matrices with dimensions `p[0] × p[1], p[1] × p[2], ..., p[n-1] × p[n]`, the cost of multiplying the chain from matrix `i` to matrix `j` is minimized by choosing the optimal split: `dp[i][j] = min over k in [i, j-1] of (dp[i][k] + dp[k+1][j] + p[i]*p[k+1]*p[j+1])`.

**Expected Thought Process**:
1. "The order of matrix multiplications affects total scalar multiplications."
2. "This is the textbook interval DP problem. `dp[i][j]` = min cost to multiply matrices i through j."
3. "Split at k: multiply `[i..k]` first, then `[k+1..j]`, then combine. Cost = dp[i][k] + dp[k+1][j] + dimensions product."

**Alternative Solutions**:
- Hu-Shing algorithm: O(n log n) for the optimal case, but impractical for interviews.
- Top-down memoization: Same O(n³), easier to implement.

**Time Complexity**: O(n³), optimizable to O(n²) with Knuth's optimization
**Space Complexity**: O(n²)

**Common Mistakes**:
- Confusing matrix indices with dimension array indices.
- Using the wrong dimensions for the cost of combining two sub-chains.

**Follow-Up Questions**:
- "Can you apply Knuth's optimization?" → Yes, since the cost satisfies quadrangle inequality. Reduces to O(n²).
- "Print the optimal parenthesization." → Track split points, reconstruct recursively.

---

##### Q3: Palindrome Partitioning II
| Field | Value |
|-------|-------|
| **Platform** | LeetCode |
| **Link** | https://leetcode.com/problems/palindrome-partitioning-ii/ |
| **Difficulty** | Hard |
| **Companies** | Google, Amazon, Meta |
| **Topic** | Dynamic Programming |
| **Pattern** | Interval DP (optimized to 1D) |
| **Variation** | Min cuts with palindrome constraint |
| **Frequency** | ★★★★☆ (4/5) |

**Key Observation**: `dp[i]` = minimum cuts to partition `s[0..i]` into palindromes. For each `i`, check all `j ≤ i` such that `s[j..i]` is a palindrome: `dp[i] = min(dp[j-1] + 1)`. Pre-compute a palindrome table `isPalin[i][j]` using interval DP or Manacher's.

**Expected Thought Process**:
1. "Minimum palindrome partitions = minimum cuts + 1. So minimize cuts."
2. "Need to know which substrings are palindromes efficiently → pre-compute with DP."
3. "`isPalin[i][j] = (s[i] == s[j]) && isPalin[i+1][j-1]`."
4. "`dp[i] = min over all j where isPalin[j][i] of (dp[j-1] + 1)`. Base: `dp[-1] = -1`."

**Alternative Solutions**:
- Pure interval DP: `dp[i][j]` = min cuts for `s[i..j]`. O(n³) time. Works but slower.
- Optimized 1D DP with expanding palindromes: O(n²) time, O(n) space.

**Time Complexity**: O(n²)
**Space Complexity**: O(n²) for palindrome table, O(n) for cuts array

**Common Mistakes**:
- Using the O(n³) interval DP when the O(n²) 1D DP exists.
- Not pre-computing the palindrome table efficiently.
- Off-by-one between "number of partitions" and "number of cuts" (answer = partitions - 1).

**Follow-Up Questions**:
- "Return all palindrome partitions." → Palindrome Partitioning I (backtracking).
- "What's the minimum number of characters to insert to make the whole string a palindrome?" → Different problem: LPS-based approach.

---

##### Q4: Minimum Cost to Merge Stones
| Field | Value |
|-------|-------|
| **Platform** | LeetCode |
| **Link** | https://leetcode.com/problems/minimum-cost-to-merge-stones/ |
| **Difficulty** | Hard |
| **Companies** | Google, Amazon |
| **Topic** | Dynamic Programming |
| **Pattern** | Interval DP |
| **Variation** | Constrained merging (k piles at a time) |
| **Frequency** | ★★★☆☆ (3/5) |

**Key Observation**: You must merge exactly `k` adjacent piles each time. First check feasibility: `(n - 1) % (k - 1) != 0` → impossible. Then `dp[i][j]` = min cost to merge piles `[i..j]` into as few piles as possible. If `(j - i) % (k - 1) == 0`, the interval can be fully merged into 1 pile, adding `sum(i, j)`.

**Expected Thought Process**:
1. "Merging k piles at a time. Check if it's even possible: `(n-1) % (k-1) == 0`."
2. "This is interval DP. `dp[i][j]` = min cost to reduce piles `[i..j]`."
3. "Split at intervals of `k-1`: `for k_split in range(i, j, k-1): dp[i][j] = min(dp[i][k_split] + dp[k_split+1][j])`."
4. "If the interval can be merged into 1 pile (length condition), add `prefixSum[j+1] - prefixSum[i]`."

**Time Complexity**: O(n³ / k)
**Space Complexity**: O(n²)

**Common Mistakes**:
- Forgetting the feasibility check.
- Wrong step size in the split loop (should be `k-1`, not `1`).
- Not understanding when to add the merge cost (only when interval reduces to 1 pile).

**Follow-Up Questions**:
- "What if k = 2?" → Reduces to classic stone merging. O(n³) or O(n² log n) with Garsia-Wachs.
- "Can you explain why `(n-1) % (k-1) == 0` is the feasibility condition?" → Each merge reduces pile count by `k-1`. To go from `n` piles to `1`, need `(n-1)/(k-1)` merges.

---

##### Q5: Strange Printer
| Field | Value |
|-------|-------|
| **Platform** | LeetCode |
| **Link** | https://leetcode.com/problems/strange-printer/ |
| **Difficulty** | Hard |
| **Companies** | Google |
| **Topic** | Dynamic Programming |
| **Pattern** | Interval DP |
| **Variation** | Printing with range operations |
| **Frequency** | ★★★☆☆ (3/5) |

**Key Observation**: `dp[i][j]` = minimum turns to print `s[i..j]`. Base: `dp[i][i] = 1`. If `s[i] == s[j]`, then `dp[i][j] = dp[i][j-1]` (print `s[j]` for free when printing `s[i]`). Otherwise, try all split points: `dp[i][j] = min(dp[i][k] + dp[k+1][j])` for `k in [i, j-1]`.

**Expected Thought Process**:
1. "Printer prints ranges of same characters. Minimize turns."
2. "`dp[i][j]` = min turns for substring `s[i..j]`."
3. "If `s[i] == s[j]`, we can extend the print of `s[i]` to cover `s[j]`, so `dp[i][j] = dp[i][j-1]`."
4. "Otherwise, split and combine: `dp[i][j] = min(dp[i][k] + dp[k+1][j])`."

**Time Complexity**: O(n³)
**Space Complexity**: O(n²)

**Common Mistakes**:
- Not recognizing that matching characters at endpoints reduce the problem.
- Getting the base case wrong (single character = 1 turn, not 0).

---

##### Q6: Minimum Score Triangulation of Polygon
| Field | Value |
|-------|-------|
| **Platform** | LeetCode |
| **Link** | https://leetcode.com/problems/minimum-score-triangulation-of-polygon/ |
| **Difficulty** | Medium |
| **Companies** | Google, Amazon |
| **Topic** | Dynamic Programming |
| **Pattern** | Interval DP |
| **Variation** | Polygon triangulation |
| **Frequency** | ★★★☆☆ (3/5) |

**Key Observation**: For polygon vertices `[i..j]`, the edge `(i, j)` must be part of some triangle. The third vertex `k` can be any vertex in `(i, j)`. `dp[i][j] = min over k in (i+1, j-1) of (dp[i][k] + dp[k][j] + values[i]*values[k]*values[j])`.

**Expected Thought Process**:
1. "Polygon triangulation → interval DP on the vertices."
2. "Fix edge (i, j). Choose third vertex k to form triangle (i, k, j)."
3. "Cost = triangle score + cost of sub-polygons on both sides."

**Time Complexity**: O(n³)
**Space Complexity**: O(n²)

**Common Mistakes**:
- Confusing polygon vertices with array indices.
- Forgetting that triangulation only applies to intervals of length ≥ 3.

---

### Mastery Framework

| Level | Description | Checkpoint |
|-------|-------------|------------|
| L0 | Cannot identify interval DP problems | Tries greedy or 1D DP on Burst Balloons |
| L1 | Recognizes interval DP but can't write the recurrence | Can explain "think about last operation" but can't code it |
| L2 | Writes correct recurrence with loop structure bugs | Gets the split-point loop wrong (off-by-one or wrong traversal order) |
| L3 | Clean O(n³) solution with correct base cases | Solves Burst Balloons and MCM within 20 minutes |
| L4 | Handles constrained variants (k-way merge, palindrome) | Solves Minimum Cost Merge Stones, Palindrome Partitioning II |
| L5 | Applies Knuth's optimization, handles circular variants | Reduces MCM to O(n²), extends to circular sequences |

### Interview Communication Example

**Problem: Burst Balloons**

> "OK so we need to maximize coins from bursting all balloons. Let me think about the structure here...
>
> If I burst balloon k, the neighbors change, which makes this tricky. The key insight is: instead of deciding what to burst *first*, let me think about what to burst *last* in a given range.
>
> If balloon k is the last one burst in range [i, j], then at that point, the only adjacent balloons are the boundaries — nums[i-1] and nums[j+1]. So the coins from bursting k last are nums[i-1] * nums[k] * nums[j+1].
>
> This gives me interval DP: dp[i][j] = max over k in [i,j] of (dp[i][k-1] + dp[k+1][j] + nums[i-1]*nums[k]*nums[j+1]).
>
> I'll add padding of 1 on both ends to handle boundaries cleanly. Base case: dp[i][j] = 0 when i > j (empty interval).
>
> Let me iterate by interval length from 1 to n, and for each interval try all split points. Time is O(n³), space is O(n²).
>
> Let me trace through a small example... [traces]. Looks correct. Let me code it."

### Company-Specific Expectations

**Google**: Most likely company to ask interval DP. Expects clean O(n³) implementation and clear articulation of the "last operation" insight. May ask about Knuth's optimization as a follow-up. Burst Balloons is a classic Google problem.

**Meta**: Rarely asks pure interval DP due to speed constraints. If it appears, it's usually a simpler variant like Palindrome Partitioning II where the O(n²) 1D optimization is expected.

**Uber**: May ask interval DP in staff-level screens. Expects solid understanding but won't typically push for optimizations beyond O(n³).

**Amazon**: Rarely asks interval DP. If it appears, usually MCM as a textbook question. Focus on communication over optimization.

---

## Pattern 20.6: State Machine DP

### Pattern Description

State Machine DP models problems where an entity can be in one of several discrete states at each step, and transitions between states have associated costs or constraints. The DP tracks the optimal answer for being in each possible state at each time step.

The canonical examples are the "Best Time to Buy and Sell Stock" series. At any point in time, you're either *holding* a stock, *not holding* (ready to buy), or in a *cooldown*. Each state has legal transitions: from "not holding" you can buy (transition to "holding") or do nothing; from "holding" you can sell (transition to "not holding" or "cooldown") or do nothing.

What makes this pattern elegant is that it transforms a confusing problem (track all possible transaction histories) into a clean state diagram. Once you draw the states and transitions, the DP recurrence writes itself.

### Core Invariant

**At each time step `i`, maintain the optimal value for being in each possible state. The answer is the optimal value across all valid ending states at step `n`.** States must be exhaustive (cover all situations) and mutually exclusive (entity is in exactly one state at each time).

### Recognition Signals

- The problem involves an entity with discrete modes/states (holding/not holding, painted/not painted, resting/working).
- There are constraints on transitions (cooldown, limited transactions, no two adjacent same actions).
- At each step, the entity chooses an action that changes (or maintains) its state.
- Keywords: "buy/sell", "cooldown", "transaction fee", "paint houses with constraint", "rest days".
- The number of states is small and fixed (2-5 states), while the number of time steps is large.

### Common Traps

- **Not drawing the state diagram first**: The #1 mistake. Draw circles for states, arrows for transitions with costs. The recurrence follows directly from the diagram.
- **Forgetting the "do nothing" transition**: In stock problems, you can always choose to do nothing (stay in the same state). This must be represented as `dp[i][state] = dp[i-1][state]`.
- **Wrong initial states**: For stock problems, `dp[0][holding] = -prices[0]` (you spent money to buy), `dp[0][not_holding] = 0`. Getting signs wrong propagates errors.
- **Confusing "at most k transactions" with "exactly k transactions"**: Best Time to Buy/Sell Stock IV requires tracking the transaction count as part of the state.

### Complexity Intuition

- **Time**: O(n × S) where S is the number of states. For stock problems with k transactions, O(n × k). For Paint House, O(n × colors).
- **Space**: O(S) since you only need the previous time step's state values (rolling array).
- **Why**: At each of n time steps, you compute the optimal value for each of S states, each in O(1) time. The state machine structure guarantees no state depends on anything other than the previous time step.

### Hidden Variations

1. **Multiple transactions with limit**: Stock IV — add transaction count to the state: `dp[i][j][holding]` = best after `j` transactions at day `i` while holding.
2. **Cooldown**: Stock with Cooldown — add a "cooldown" state. After selling, must wait one day before buying.
3. **Transaction fee**: Stock with Fee — subtract fee when selling (or buying).
4. **Coloring with constraints**: Paint House — states are colors, constraint is no two adjacent houses same color.
5. **Circular constraint**: Paint House II with circular arrangement.

### Follow-Up Variations

- **"What if there's a cooldown after selling?"** → Add a cooldown state. 3 states: holding, not_holding_can_buy, cooldown.
- **"What if there's a transaction fee?"** → Subtract fee on sell transition.
- **"What if you can make at most k transactions?"** → Add transaction count dimension: `dp[day][transactions][holding]`.
- **"What if there are 3 colors with no two adjacent same?"** → Paint House: `dp[i][c] = cost[i][c] + min(dp[i-1][c'] for c' != c)`.

### Interview Frequency

| Company | Frequency | Typical Difficulty |
|---------|-----------|-------------------|
| Google | ★★★★☆ | Medium-Hard |
| Meta | ★★★★★ | Medium (speed) |
| Amazon | ★★★★☆ | Medium |
| Microsoft | ★★★☆☆ | Medium |
| Uber | ★★★☆☆ | Medium |
| Bloomberg | ★★★★☆ | Medium |

### How Interviewers Expect You to Identify It

For stock problems, identification is usually immediate — the problem statement says "buy and sell." The real test is how quickly you model the states:

1. **Within 1 minute**: "This is a state machine DP. Let me identify the states."
2. **Within 3 minutes**: Draw the state diagram on the whiteboard with transitions.
3. **Within 8 minutes**: Working code with correct initial states.
4. **Bonus**: Recognize that Stock I is just max(prices[j] - prices[i]) and can be solved in O(1) space without explicit DP.

### Why Candidates Fail

1. **Not recognizing the pattern beyond stock problems**: Paint House, House Robber (rob/not-rob), and even some string problems are state machine DP.
2. **Trying to track transaction history instead of states**: "I need to remember all the times I bought and sold" — NO. You only need the *current* state.
3. **Sign errors in holding state**: `dp[i][holding]` represents profit so far *minus* the cost of the stock you're holding. So `dp[0][holding] = -prices[0]`, not `+prices[0]`.
4. **Not handling the k-transaction limit cleanly**: Stock IV requires a 3D state `dp[day][transactions_used][holding]`, and some candidates can't set it up.

### How Elite Candidates Think

They immediately draw the state machine:

```
                    buy (-price)
  NOT HOLDING  ────────────────→  HOLDING
       ↑                              │
       │     sell (+price)             │
       ←──────────────────────────────┘
       │                              │
       └── do nothing ──→             └── do nothing ──→
```

For cooldown variant, add a third node. For k transactions, the state becomes `(holding/not, transactions_completed)`.

The recurrence writes itself from the diagram:
```
dp[i][not_holding] = max(dp[i-1][not_holding], dp[i-1][holding] + prices[i])
dp[i][holding]     = max(dp[i-1][holding],     dp[i-1][not_holding] - prices[i])
```

### Curated Questions

---

##### Q1: Best Time to Buy and Sell Stock
| Field | Value |
|-------|-------|
| **Platform** | LeetCode |
| **Link** | https://leetcode.com/problems/best-time-to-buy-and-sell-stock/ |
| **Difficulty** | Easy |
| **Companies** | ALL companies |
| **Topic** | Dynamic Programming |
| **Pattern** | State Machine DP |
| **Variation** | Single transaction |
| **Frequency** | ★★★★★ (5/5) |

**Key Observation**: Track the minimum price seen so far. At each day, the max profit is `prices[i] - minPriceSoFar`. This is the simplest state machine: 2 states (haven't bought, have bought-and-sold), one transition.

**Expected Thought Process**:
1. "One transaction max. I need to find the pair (buy_day, sell_day) with sell > buy that maximizes profit."
2. "Track min price so far. At each day, update max_profit = max(max_profit, price - min_price)."
3. "This is O(n) time, O(1) space."

**Time Complexity**: O(n)
**Space Complexity**: O(1)

**Common Mistakes**:
- Selling before buying (checking all pairs without enforcing order).
- Not considering the case where prices only decrease (answer should be 0, not negative).

**Follow-Up Questions**:
- "What if you can make unlimited transactions?" → Stock II: sum all positive differences.
- "What if you can make at most 2 transactions?" → Stock III: state machine with 4 states.
- "What if there's a cooldown?" → Stock with Cooldown: 3 states.

---

##### Q2: Best Time to Buy and Sell Stock III
| Field | Value |
|-------|-------|
| **Platform** | LeetCode |
| **Link** | https://leetcode.com/problems/best-time-to-buy-and-sell-stock-iii/ |
| **Difficulty** | Hard |
| **Companies** | Google, Amazon, Meta, Goldman Sachs |
| **Topic** | Dynamic Programming |
| **Pattern** | State Machine DP |
| **Variation** | At most 2 transactions |
| **Frequency** | ★★★★☆ (4/5) |

**Key Observation**: 4 states: `buy1, sell1, buy2, sell2`. Track the best profit at each state. `buy1 = max(buy1, -prices[i])`, `sell1 = max(sell1, buy1 + prices[i])`, `buy2 = max(buy2, sell1 - prices[i])`, `sell2 = max(sell2, buy2 + prices[i])`. Answer = `sell2`.

**Expected Thought Process**:
1. "At most 2 transactions → 4 states along the timeline."
2. "Forward pass: compute best first-buy, first-sell, second-buy, second-sell."
3. "All in O(n) time, O(1) space with 4 variables."
4. "Alternative: split array at every point, compute best single transaction on left and right. O(n) with prefix/suffix."

**Time Complexity**: O(n)
**Space Complexity**: O(1)

**Common Mistakes**:
- Over-engineering with a 2D DP table when 4 variables suffice.
- Forgetting that buy2 can reuse profits from sell1.

**Follow-Up Questions**:
- "Generalize to k transactions." → Stock IV.
- "What if k >= n/2?" → Unlimited transactions (Stock II).

---

##### Q3: Best Time to Buy and Sell Stock with Cooldown
| Field | Value |
|-------|-------|
| **Platform** | LeetCode |
| **Link** | https://leetcode.com/problems/best-time-to-buy-and-sell-stock-with-cooldown/ |
| **Difficulty** | Medium |
| **Companies** | Google, Amazon, Meta |
| **Topic** | Dynamic Programming |
| **Pattern** | State Machine DP |
| **Variation** | 3-state with cooldown |
| **Frequency** | ★★★★★ (5/5) |

**Key Observation**: 3 states: `held` (holding stock), `sold` (just sold, in cooldown), `rest` (not holding, can buy). Transitions: `held[i] = max(held[i-1], rest[i-1] - prices[i])`, `sold[i] = held[i-1] + prices[i]`, `rest[i] = max(rest[i-1], sold[i-1])`.

**Expected Thought Process**:
1. "Cooldown after selling → need a separate 'cooldown' state."
2. "Draw the state machine: rest → held (buy), held → sold (sell), sold → rest (wait)."
3. "Each state transitions based on the previous day."
4. "Answer: max(rest[n-1], sold[n-1])."

**Time Complexity**: O(n)
**Space Complexity**: O(1) with rolling variables

**Common Mistakes**:
- Only using 2 states (forgetting cooldown).
- Allowing buying on the day after selling.
- Wrong initialization: `held[0] = -prices[0]`, `sold[0] = 0`, `rest[0] = 0`.

---

##### Q4: Best Time to Buy and Sell Stock IV
| Field | Value |
|-------|-------|
| **Platform** | LeetCode |
| **Link** | https://leetcode.com/problems/best-time-to-buy-and-sell-stock-iv/ |
| **Difficulty** | Hard |
| **Companies** | Google, Goldman Sachs, Amazon |
| **Topic** | Dynamic Programming |
| **Pattern** | State Machine DP |
| **Variation** | At most k transactions |
| **Frequency** | ★★★★☆ (4/5) |

**Key Observation**: `dp[j][0]` = max profit with at most `j` transactions, not holding. `dp[j][1]` = holding. For each day, update all `j` from k down to 1. Special case: if `k >= n/2`, it's unlimited transactions (Stock II).

**Expected Thought Process**:
1. "Generalization of Stock III. State: (transactions_used, holding/not)."
2. "If k >= n/2, reduce to Stock II (unlimited)."
3. "Otherwise, dp[j][holding] and dp[j][not_holding] for j = 0..k."

**Time Complexity**: O(n × k) or O(n) when k ≥ n/2
**Space Complexity**: O(k)

**Common Mistakes**:
- Not handling the k ≥ n/2 special case (TLE without it).
- Wrong loop direction (must update `j` in the right order to avoid using same-day values).

---

##### Q5: Best Time to Buy and Sell Stock with Transaction Fee
| Field | Value |
|-------|-------|
| **Platform** | LeetCode |
| **Link** | https://leetcode.com/problems/best-time-to-buy-and-sell-stock-with-transaction-fee/ |
| **Difficulty** | Medium |
| **Companies** | Meta, Amazon, Bloomberg |
| **Topic** | Dynamic Programming |
| **Pattern** | State Machine DP |
| **Variation** | Unlimited transactions with fee |
| **Frequency** | ★★★★☆ (4/5) |

**Key Observation**: Same as Stock II but subtract `fee` when selling: `cash = max(cash, hold + prices[i] - fee)`, `hold = max(hold, cash - prices[i])`. The fee prevents the "buy-sell every day" degenerate solution.

**Time Complexity**: O(n)
**Space Complexity**: O(1)

**Common Mistakes**:
- Subtracting fee during buying instead of selling (both work mathematically, but be consistent).
- Not realizing this is essentially Stock II + fee.

---

##### Q6: Paint House
| Field | Value |
|-------|-------|
| **Platform** | LeetCode |
| **Link** | https://leetcode.com/problems/paint-house/ |
| **Difficulty** | Medium |
| **Companies** | Amazon, Google, Meta |
| **Topic** | Dynamic Programming |
| **Pattern** | State Machine DP |
| **Variation** | Coloring with adjacency constraint |
| **Frequency** | ★★★★☆ (4/5) |

**Key Observation**: `dp[i][c]` = min cost to paint houses `0..i` with house `i` painted color `c`. Transition: `dp[i][c] = costs[i][c] + min(dp[i-1][c'] for c' != c)`. For 3 colors, the min is easy. For k colors, need O(k) per house using the two smallest values trick.

**Expected Thought Process**:
1. "No two adjacent houses same color → state machine with k states (colors)."
2. "For each house, choose the color with minimum cost, excluding the previous house's color."
3. "For k colors: track the smallest and second-smallest dp values to compute min in O(1)."

**Time Complexity**: O(n × k), optimized to O(n × k) with O(k) per step using min-tracking
**Space Complexity**: O(k) with rolling variables

**Follow-Up Questions**:
- "What if there are k colors (Paint House II)?" → O(nk) with two-minimum trick.
- "What if it's circular?" → Paint House III: run twice or add constraint that first and last differ.

---

##### Q7: Paint House II
| Field | Value |
|-------|-------|
| **Platform** | LeetCode |
| **Link** | https://leetcode.com/problems/paint-house-ii/ |
| **Difficulty** | Hard |
| **Companies** | Google, Amazon |
| **Topic** | Dynamic Programming |
| **Pattern** | State Machine DP |
| **Variation** | k colors with min-tracking optimization |
| **Frequency** | ★★★☆☆ (3/5) |

**Key Observation**: With k colors, computing `min(dp[i-1][c'] for c' != c)` naively is O(k) per color, giving O(nk²). Optimization: track the smallest and second-smallest dp values across colors. For each color, if it matches the smallest, use the second-smallest; otherwise use the smallest. This reduces to O(nk).

**Time Complexity**: O(n × k)
**Space Complexity**: O(k)

**Common Mistakes**:
- Using O(nk²) brute force when O(nk) is expected.
- Not tracking both the minimum value AND its index to handle ties correctly.

---

### Mastery Framework

| Level | Description | Checkpoint |
|-------|-------------|------------|
| L0 | Cannot model states | Tries brute force on stock problems |
| L1 | Recognizes stock as DP but struggles with states | Can solve Stock I but not Cooldown |
| L2 | Draws state diagram, writes recurrence with minor bugs | Solves Stock II, III with debugging |
| L3 | Clean implementation of all stock variants | Solves Cooldown, Fee, Stock IV on first attempt |
| L4 | Recognizes non-stock state machine problems | Applies state machine DP to Paint House, custom problems |
| L5 | Instantly models any multi-state DP as state machine | Creates state diagrams for novel problems in under 2 minutes |

### Company-Specific Expectations

**Google**: Loves asking Stock III or IV as a 45-minute problem. Expects you to generalize from 2 transactions to k. May ask you to prove the O(nk) solution is optimal.

**Meta**: Asks Stock with Cooldown or Fee as a 20-minute speed problem. You should solve it in under 12 minutes with clean code. They test speed and accuracy, not creativity.

**Amazon**: Paint House is a favorite. Expects you to handle k colors efficiently (Paint House II). Communication about the two-minimum optimization matters.

---

## Pattern 20.7: Bitmask DP

### Pattern Description

Bitmask DP uses a bitmask (integer where each bit represents whether an element has been "used" or not) as part of the DP state. It's applicable when you need to track subsets of a small set of elements (typically n ≤ 20-22, since 2^20 ≈ 10^6 states).

The state is typically `dp[mask]` or `dp[mask][i]` where `mask` is a bitmask of which elements have been used, and `i` might represent the current position or last element chosen. The transitions involve setting a new bit (using a new element) and updating the optimal value.

This pattern bridges the gap between competitive programming and interview problems. It turns exponential brute-force (try all permutations/subsets) into tractable DP (2^n × n states).

### Core Invariant

**`dp[mask]` encodes the optimal answer when exactly the elements indicated by the set bits in `mask` have been used.** The mask is a compact representation of a subset, and every subset is evaluated at most once.

### Recognition Signals

- **n ≤ 20** — this is the strongest signal. If n is small and the problem seems exponential, think bitmask.
- The problem asks for optimal ordering/assignment of n elements.
- You need to track which elements have been "chosen" or "visited".
- Keywords: "assign tasks to workers", "visit all cities", "partition into groups".
- Brute force would enumerate all permutations (n!) or all subsets (2^n).

### Common Traps

- **Not recognizing the constraint signal**: n ≤ 20 screams bitmask DP. If you miss this, you'll waste time on impossible O(n²) approaches.
- **Integer overflow**: For n = 20, `1 << 20` = 1M which is fine, but for n = 25, 2^25 = 33M states × extra dimensions can exceed memory.
- **Wrong bit manipulation**: `(mask >> i) & 1` checks if bit i is set. `mask | (1 << i)` sets bit i. `mask & ~(1 << i)` clears bit i. Confusing these causes subtle bugs.
- **Forgetting to enumerate submasks efficiently**: Iterating over all submasks of a mask requires the trick `for (int sub = mask; sub > 0; sub = (sub - 1) & mask)`.

### Complexity Intuition

- **Time**: O(2^n × n) for most problems. O(2^n × n²) for TSP. O(3^n) when you need to enumerate all submasks of all masks.
- **Space**: O(2^n) or O(2^n × n).
- **Why**: There are 2^n possible subsets. For each subset, you try O(n) extensions (add one element). This is vastly better than O(n!) permutation enumeration.

### Hidden Variations

1. **TSP (Travelling Salesman)**: `dp[mask][i]` = min cost to visit cities in `mask` ending at city `i`.
2. **Partition into equal subsets**: Enumerate submasks to check if k groups of equal sum exist.
3. **Assignment problems**: n workers, n tasks, each assignment has a cost. Find min-cost perfect matching.
4. **Compatible pair selection**: Choose a maximum-weight subset where no two elements conflict.
5. **Shortest Superstring**: `dp[mask][i]` = min-length superstring containing strings in `mask`, ending with string `i`.

### Interview Frequency

| Company | Frequency | Typical Difficulty |
|---------|-----------|-------------------|
| Google | ★★★★☆ | Hard |
| Meta | ★★☆☆☆ | Rare |
| Amazon | ★★☆☆☆ | Rare |
| Uber | ★★★☆☆ | Hard |
| Competitive Programming | ★★★★★ | Standard |

### How Interviewers Expect You to Identify It

1. **Spot the constraint**: n ≤ 20 → bitmask DP is almost certainly intended.
2. **Identify the subset tracking need**: "Which elements have been used?"
3. **Define the state**: `dp[mask]` or `dp[mask][last_element]`.
4. **Write transitions**: "For each unset bit, set it and update the DP."

### Why Candidates Fail

1. **Don't know bitmask DP exists**: Many candidates only learn 1D/2D DP and have never seen bitmask DP.
2. **Miss the n ≤ 20 signal**: Spend 20 minutes trying polynomial solutions.
3. **Bit manipulation bugs**: Wrong shift direction, not using unsigned, forgetting that `1 << i` needs to be `1L << i` for i ≥ 31 in Java.
4. **Can't enumerate submasks**: O(3^n) submask enumeration is a specific technique that many don't know.

### Curated Questions

---

##### Q1: Shortest Path Visiting All Nodes
| Field | Value |
|-------|-------|
| **Platform** | LeetCode |
| **Link** | https://leetcode.com/problems/shortest-path-visiting-all-nodes/ |
| **Difficulty** | Hard |
| **Companies** | Google, Amazon |
| **Topic** | Dynamic Programming |
| **Pattern** | Bitmask DP |
| **Variation** | BFS with bitmask state |
| **Frequency** | ★★★★☆ (4/5) |

**Key Observation**: State is `(mask, current_node)` where `mask` tracks which nodes have been visited. Use BFS (unweighted graph) with this state. Starting states: `(1 << i, i)` for each node `i`. Goal: any state where mask = `(1 << n) - 1`.

**Expected Thought Process**:
1. "Visit all nodes in minimum edges. n ≤ 12 → bitmask."
2. "State: (visited_mask, current_node). BFS for shortest path."
3. "Can revisit nodes, but the bitmask only grows → no cycles in state space."
4. "Multi-source BFS from all starting nodes simultaneously."

**Time Complexity**: O(2^n × n²)
**Space Complexity**: O(2^n × n)

**Common Mistakes**:
- Using DFS instead of BFS (BFS gives shortest path).
- Not starting from all nodes (any node can be the start).

---

##### Q2: Partition to K Equal Sum Subsets
| Field | Value |
|-------|-------|
| **Platform** | LeetCode |
| **Link** | https://leetcode.com/problems/partition-to-k-equal-sum-subsets/ |
| **Difficulty** | Medium |
| **Companies** | Google, Amazon, Microsoft |
| **Topic** | Dynamic Programming |
| **Pattern** | Bitmask DP |
| **Variation** | Subset-sum with partitioning |
| **Frequency** | ★★★★☆ (4/5) |

**Key Observation**: Total sum must be divisible by k. Target per group = totalSum / k. Use bitmask DP: `dp[mask]` = true if the elements in `mask` can be partitioned into groups with sum = target. Track current group's running sum to know when a group is "complete."

**Expected Thought Process**:
1. "Partition into k groups of equal sum. n ≤ 16 → bitmask DP."
2. "dp[mask] = remaining sum in current bucket after optimally assigning elements in mask."
3. "For each mask, try adding each unused element. If adding it exceeds target, skip."

**Time Complexity**: O(n × 2^n)
**Space Complexity**: O(2^n)

**Common Mistakes**:
- Not sorting elements in descending order for pruning (backtracking variant).
- Forgetting the `totalSum % k != 0` early exit.
- Using backtracking without memoization (TLE for n > 12).

---

##### Q3: Travelling Salesman Problem
| Field | Value |
|-------|-------|
| **Platform** | Various / GeeksforGeeks |
| **Link** | https://www.geeksforgeeks.org/travelling-salesman-problem-using-dynamic-programming-solution/ |
| **Difficulty** | Hard |
| **Companies** | Google, Uber |
| **Topic** | Dynamic Programming |
| **Pattern** | Bitmask DP |
| **Variation** | Classic TSP |
| **Frequency** | ★★★★☆ (4/5) |

**Key Observation**: `dp[mask][i]` = minimum cost to visit all cities in `mask`, ending at city `i`. Transition: `dp[mask | (1<<j)][j] = min(dp[mask][i] + dist[i][j])` for each unvisited city `j`.

**Time Complexity**: O(2^n × n²)
**Space Complexity**: O(2^n × n)

---

##### Q4: Can I Win
| Field | Value |
|-------|-------|
| **Platform** | LeetCode |
| **Link** | https://leetcode.com/problems/can-i-win/ |
| **Difficulty** | Medium |
| **Companies** | Google, Amazon |
| **Topic** | Dynamic Programming |
| **Pattern** | Bitmask DP |
| **Variation** | Game theory + bitmask |
| **Frequency** | ★★★☆☆ (3/5) |

**Key Observation**: `maxChoosableInteger ≤ 20` → bitmask. State is which numbers have been used. Current player wins if they can pick a number that either reaches the target or puts the opponent in a losing state.

**Time Complexity**: O(2^n × n)
**Space Complexity**: O(2^n)

---

##### Q5: Find the Shortest Superstring
| Field | Value |
|-------|-------|
| **Platform** | LeetCode |
| **Link** | https://leetcode.com/problems/find-the-shortest-superstring/ |
| **Difficulty** | Hard |
| **Companies** | Google |
| **Topic** | Dynamic Programming |
| **Pattern** | Bitmask DP |
| **Variation** | TSP variant on strings |
| **Frequency** | ★★★☆☆ (3/5) |

**Key Observation**: Pre-compute overlap between all pairs of strings. Then this becomes TSP: `dp[mask][i]` = min extra characters to include all strings in `mask`, with string `i` as the last one added. Use overlap to compute transitions.

**Time Complexity**: O(2^n × n²)
**Space Complexity**: O(2^n × n)

---

### Mastery Framework

| Level | Description | Checkpoint |
|-------|-------------|------------|
| L0 | Never seen bitmask DP | Tries backtracking without memoization |
| L1 | Understands bitmask representation of subsets | Can check/set/clear individual bits |
| L2 | Can implement basic bitmask DP (TSP-like) | Solves Shortest Path Visiting All Nodes |
| L3 | Handles partition and assignment problems | Solves Partition to K Equal Sum Subsets |
| L4 | Efficient submask enumeration (O(3^n)) | Can optimize partition problems |
| L5 | Recognizes bitmask DP in disguised problems | Spots n ≤ 20 signal instantly, maps to TSP/assignment |

### Company-Specific Expectations

**Google**: Most likely to ask bitmask DP. Expects you to spot the n ≤ 20 constraint, define the bitmask state, and implement cleanly. Shortest Superstring is a classic Google problem.

**Meta**: Rarely asks bitmask DP in regular interviews. Might appear in harder phone screens.

**Amazon**: Asks Partition to K Equal Sum Subsets as a medium problem. May accept backtracking with pruning.

---

## Pattern 20.8: Digit DP

### Pattern Description

Digit DP is used to count numbers in a range `[L, R]` that satisfy some digit-based property (e.g., digits are unique, digit sum is even, no consecutive identical digits). The key idea is to process the number digit by digit from left to right, tracking whether we're still "bounded" by the upper limit (the "tight" constraint) and any relevant properties accumulated so far.

The standard formulation is `count(N)` = count of valid numbers from `0` to `N`, then `answer = count(R) - count(L-1)`.

### Core Invariant

**At each digit position, the state tracks: (1) the current position, (2) whether we're still bounded by the limit ("tight"), and (3) any accumulated properties (digit sum, last digit, etc.).** The "tight" flag is the distinguishing feature: when tight, the current digit can be at most `N[pos]`; when not tight, any digit 0-9 is allowed.

### Recognition Signals

- "Count numbers in range [L, R] with property X."
- The property depends on individual digits, not the numerical value.
- Constraints: L, R can be very large (10^18), but the number of digits is small (≤ 19).
- Properties: unique digits, digit sum, consecutive digits, specific digit patterns.

### Common Traps

- **Leading zeros**: A number like "007" is really "7". Need a `started` flag or handle leading zeros specially.
- **Off-by-one on tight constraint**: When `tight` is true, the max digit at position `pos` is `N[pos]`. When placing `N[pos]`, the next position remains tight. Otherwise, it becomes not-tight.
- **Forgetting to use `count(R) - count(L-1)`**: Digit DP computes count from 0 to N. To get [L, R], subtract.
- **Large state space**: Too many tracked properties can make the state space explode. Keep the accumulated property minimal.

### Complexity Intuition

- **Time**: O(D × S × 10) where D = number of digits and S = number of accumulated states. Usually O(D × 2 × additional_states × 10).
- **Space**: O(D × S × 2) for memoization.
- **Why**: At most D digit positions, each with at most 10 choices, and a bounded number of accumulated states.

### Curated Questions

---

##### Q1: Count Numbers with Unique Digits
| Field | Value |
|-------|-------|
| **Platform** | LeetCode |
| **Link** | https://leetcode.com/problems/count-numbers-with-unique-digits/ |
| **Difficulty** | Medium |
| **Companies** | Google, Bloomberg |
| **Topic** | Dynamic Programming |
| **Pattern** | Digit DP |
| **Variation** | Digit uniqueness tracking |
| **Frequency** | ★★★☆☆ (3/5) |

**Key Observation**: Count numbers from 0 to 10^n - 1 with all unique digits. Track which digits have been used via a bitmask (10 bits for digits 0-9). State: `(position, mask, tight, started)`.

**Alternative**: Can be solved with combinatorics: for k-digit numbers, choices = 9 × 9 × 8 × 7 × ... (first digit can't be 0).

**Time Complexity**: O(n × 2^10 × 10) ≈ O(n × 10240)
**Space Complexity**: O(n × 1024)

---

##### Q2: Numbers At Most N Given Digit Set
| Field | Value |
|-------|-------|
| **Platform** | LeetCode |
| **Link** | https://leetcode.com/problems/numbers-at-most-n-given-digit-set/ |
| **Difficulty** | Hard |
| **Companies** | Google |
| **Topic** | Dynamic Programming |
| **Pattern** | Digit DP |
| **Variation** | Restricted digit set |
| **Frequency** | ★★★☆☆ (3/5) |

**Key Observation**: Count numbers from 1 to N using only digits from the given set. At each position, if tight, count digits ≤ N[pos]; if not tight, all digits in the set are allowed. Also count numbers with fewer digits.

**Time Complexity**: O(D × |digit_set|)
**Space Complexity**: O(D)

---

##### Q3: Non-negative Integers without Consecutive Ones
| Field | Value |
|-------|-------|
| **Platform** | LeetCode |
| **Link** | https://leetcode.com/problems/non-negative-integers-without-consecutive-ones/ |
| **Difficulty** | Hard |
| **Companies** | Google |
| **Topic** | Dynamic Programming |
| **Pattern** | Digit DP |
| **Variation** | Binary digit DP with adjacency constraint |
| **Frequency** | ★★★☆☆ (3/5) |

**Key Observation**: Count binary numbers from 0 to N with no consecutive 1s. Digit DP on binary representation. State: `(position, last_digit, tight)`. If last digit was 1, current must be 0.

**Time Complexity**: O(log N)
**Space Complexity**: O(log N)

---

##### Q4: Count of Integers (LC 2719)
| Field | Value |
|-------|-------|
| **Platform** | LeetCode |
| **Link** | https://leetcode.com/problems/count-of-integers/ |
| **Difficulty** | Hard |
| **Companies** | Google, Amazon |
| **Topic** | Dynamic Programming |
| **Pattern** | Digit DP |
| **Variation** | Digit sum range constraint |
| **Frequency** | ★★★☆☆ (3/5) |

**Key Observation**: Count numbers in [num1, num2] with digit sum in [min_sum, max_sum]. State: `(position, current_digit_sum, tight)`. Process digit by digit, tracking accumulated sum.

**Time Complexity**: O(D × max_sum × 10)
**Space Complexity**: O(D × max_sum)

---

### Mastery Framework

| Level | Description | Checkpoint |
|-------|-------------|------------|
| L0 | Never heard of digit DP | Tries brute-force enumeration |
| L1 | Understands the tight constraint concept | Can explain when digits are bounded |
| L2 | Implements basic digit DP with memoization | Solves Count Numbers with Unique Digits |
| L3 | Handles leading zeros and range queries | Solves [L, R] range problems correctly |
| L4 | Combines digit DP with bitmask or modular arithmetic | Handles complex constraints efficiently |
| L5 | Recognizes digit DP in disguised problems | Spots "count in range with digit property" pattern instantly |

### Company-Specific Expectations

**Google**: The only company that regularly asks digit DP in interviews. Expects clean implementation with the tight constraint and leading zeros handled correctly. This is a differentiator — most candidates can't do it.

**Meta/Amazon/Others**: Extremely rare. Digit DP is more of a competitive programming pattern. Knowing it is impressive but unlikely to be tested.

---

### Interview Communication Example for State Machine DP

**Problem: Best Time to Buy and Sell Stock with Cooldown**

> "Let me think about the states here. At any day, I can be in one of three situations:
>
> 1. **Held**: I'm holding a stock — I either bought today or was already holding from before.
> 2. **Sold**: I just sold today — tomorrow I'll be in cooldown.
> 3. **Rest**: I'm not holding anything and I'm not in cooldown — I can buy.
>
> Let me draw the state machine... [draws on whiteboard]
>
> Transitions:
> - Rest → Held: buy (pay prices[i])
> - Held → Held: do nothing
> - Held → Sold: sell (gain prices[i])
> - Sold → Rest: wait (forced cooldown)
> - Rest → Rest: do nothing
>
> So the recurrence is:
> - `held[i] = max(held[i-1], rest[i-1] - prices[i])`
> - `sold[i] = held[i-1] + prices[i]`
> - `rest[i] = max(rest[i-1], sold[i-1])`
>
> Initial: `held[0] = -prices[0]`, `sold[0] = 0` (sell nothing), `rest[0] = 0`.
> Answer: `max(sold[n-1], rest[n-1])` — we don't want to end while holding.
>
> Since each state only depends on the previous day, I can use O(1) space with three variables. Time is O(n).
>
> Let me code this... [codes clean solution]. Let me trace through the example to verify."
