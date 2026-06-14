# Topic 20: Dynamic Programming — Patterns 20.1-20.4

> **Priority**: #1 (Critical) | **Risk**: 8/10 | **Interview Frequency**: ★★★★★
>
> Dynamic Programming accounts for 30-40% of interview rejections at Tier 1 companies.
> This topic contains 12 patterns. This file covers the foundational 4.

---

## Dynamic Programming Overview

### What DP Really Is

Forget the "recursion + memoization" elevator pitch. That's the *implementation*, not the *concept*. Dynamic Programming is a **problem decomposition strategy** that exploits two structural properties:

1. **Optimal Substructure**: The optimal solution to the problem can be constructed from optimal solutions to its subproblems. This is NOT the same as "break the problem into smaller pieces" — it means the **choice** you make at each step doesn't retroactively invalidate previous optimal decisions.

2. **Overlapping Subproblems**: The same subproblems are solved repeatedly. This is what distinguishes DP from divide-and-conquer. Merge sort has optimal substructure but no overlapping subproblems — each subarray is sorted independently. Fibonacci has both: `fib(5)` needs `fib(4)` and `fib(3)`, but `fib(4)` also needs `fib(3)`.

**The mental model that actually works in interviews**: DP is about making a sequence of decisions where each decision depends on the *state* you're in, not the *history* of how you got there. If the number of distinct states is polynomial, DP works.

### The 4-Step DP Framework

Every DP problem, from trivial to nightmarish, follows this framework:

**Step 1: Define the State**
- What information do I need to make the next decision?
- The state must capture *everything* relevant and *nothing* irrelevant.
- Example: For House Robber, `dp[i]` = max money robbing from houses `0..i`. You don't need to know *which* houses you robbed — just the best you can do.

**Step 2: Write the Recurrence**
- How does `dp[current_state]` relate to `dp[smaller_states]`?
- This is where the "choice" happens. Usually it's "take or skip", "match or don't match", "come from left, top, or diagonal".
- Example: `dp[i] = max(dp[i-1], dp[i-2] + nums[i])` — rob house i or skip it.

**Step 3: Determine Base Cases**
- What are the smallest subproblems you can solve directly?
- These are the states where the recurrence breaks down (index out of bounds, empty string, zero capacity).
- **This is where 70% of bugs live.** Off-by-one errors in base cases are the #1 DP debugging issue.

**Step 4: Determine Traversal Order**
- In what order must you fill the DP table so that when you compute `dp[i]`, all states it depends on are already computed?
- For bottom-up: this determines your loop direction.
- For top-down: this is handled automatically by recursion, which is why top-down is often easier to get right initially.

### Top-Down vs Bottom-Up: When to Use Which

| Aspect | Top-Down (Memoization) | Bottom-Up (Tabulation) |
|--------|----------------------|----------------------|
| **Implementation** | Recursive + hashmap/array cache | Iterative loops filling a table |
| **Traversal Order** | Automatic (recursion handles it) | You must determine it manually |
| **States Visited** | Only reachable states | All states (even unreachable ones) |
| **Space Optimization** | Difficult (recursion stack) | Easy (rolling array) |
| **Stack Overflow Risk** | Yes, for large inputs | No |
| **Debugging** | Harder (recursive call stack) | Easier (print the table) |
| **Interview Preference** | Good for complex state spaces | Preferred for optimization questions |

**Rule of thumb for interviews**:
- Start with top-down if the state space is complex or you're unsure of traversal order.
- Convert to bottom-up if the interviewer asks for space optimization or if the recursion depth could be problematic.
- At Google/Meta, interviewers often expect you to *start* top-down and then *optimize* to bottom-up. This demonstrates both understanding and engineering skill.

### Space Optimization Techniques

1. **Rolling Array**: If `dp[i]` only depends on `dp[i-1]` (and possibly `dp[i-2]`), you only need O(1) or O(2) space instead of O(n).
2. **Row Compression in 2D DP**: If `dp[i][j]` only depends on row `i-1`, keep only two rows. If it also depends on `dp[i][j-1]`, you can use a single row with careful update order.
3. **In-place modification**: Sometimes the input grid itself can serve as the DP table (e.g., Minimum Path Sum).

### How to Identify DP Problems in Interviews

**Strong DP signals** (if you see 2+, it's almost certainly DP):
- "Count the number of ways..."
- "Find the minimum/maximum cost to..."
- "Is it possible to...?" (with exponential brute force)
- "Longest/shortest subsequence/substring..."
- Input involves sequences, strings, or grids
- Greedy doesn't work because local optimal ≠ global optimal

**DP vs Greedy differentiation**:
- If making the locally best choice always leads to the globally best answer → Greedy
- If you need to "try both options" at some step → DP
- Quick test: Can you construct a counterexample where greedy fails? If yes → DP

**DP vs Backtracking differentiation**:
- If subproblems overlap significantly → DP (memoize the backtracking)
- If the solution requires the actual configuration, not just the count/optimal value → might need backtracking
- If constraints are small (n ≤ 20) → might be bitmask DP or backtracking

---

## Pattern 20.1: 1D Linear DP

### Pattern Description

1D Linear DP is the most foundational dynamic programming pattern. The state is defined over a single linear dimension — typically an index `i` into an array or sequence — and the answer for position `i` depends on answers for positions `< i` (or sometimes positions `> i` if you traverse in reverse).

The defining characteristic is that your DP table is a 1D array where `dp[i]` represents the optimal answer (or count, or boolean) considering elements from index `0` to `i` (or equivalently, from `i` to `n-1`). Transitions are "local" — `dp[i]` depends on a constant number of previous states like `dp[i-1]`, `dp[i-2]`, or sometimes `dp[j]` for all `j < i`.

This pattern appears everywhere: from trivial warm-up questions (Climbing Stairs) to problems that look nothing like DP at first glance (Word Break, Decode Ways). Mastering 1D Linear DP is non-negotiable — it's the vocabulary you need before you can speak the language of harder DP patterns.

### Core Invariant

**`dp[i]` encodes the optimal answer for the prefix (or suffix) `arr[0..i]`, and this answer is independent of any future decisions.** Once you've computed `dp[i]`, no element at index `> i` can change it. This prefix-optimality is what makes the recurrence valid.

### Recognition Signals

- The input is a 1D array/sequence and you need to optimize over it.
- The problem asks for max/min/count considering "all elements" or "a subset of elements".
- At each element, you have a binary choice: include it or exclude it.
- The answer for position `i` depends only on a small window of previous answers.
- Greedy fails because including/excluding an element has cascading effects.
- The problem is a thinly-veiled Fibonacci variant.

### Common Traps

- **Forgetting base cases for indices 0 and 1**: The recurrence `dp[i] = max(dp[i-1], dp[i-2] + val[i])` breaks when `i < 2`. Always handle `dp[0]` and `dp[1]` explicitly before the loop.
- **Not recognizing DP when it looks like greedy**: Maximum Subarray (Kadane's) is technically DP, but people implement it as "greedy". The DP formulation `dp[i] = max(nums[i], dp[i-1] + nums[i])` makes extensions (like "at most k deletions") possible, while the greedy mindset doesn't.
- **Wrong state definition leading to missing information**: For Decode Ways, `dp[i]` = number of ways to decode `s[0..i]`. But if `s[i]` is '0', you must look at the two-character code `s[i-1..i]`. Forgetting to handle '0' is the #1 failure mode.
- **Confusing "ending at i" vs "considering up to i"**: `dp[i]` = max subarray *ending at* `i` (Kadane's) is very different from `dp[i]` = max subarray *within* `0..i`. The "ending at" formulation enables the recurrence; the "within" formulation doesn't directly.
- **Space optimization bugs**: When reducing from O(n) to O(1), forgetting to save `prev_prev` before overwriting.

### Complexity Intuition

- **Time**: O(n) for problems where `dp[i]` depends on O(1) previous states (House Robber, Climbing Stairs). O(n²) when `dp[i]` depends on all `dp[j]` for `j < i` (Longest Increasing Subsequence naive). O(n·k) for Coin Change where each state tries k coin types.
- **Space**: O(n) for the DP table, optimizable to O(1) when only a constant window of previous states is needed.
- **Why**: Each state is computed exactly once (O(n) states), and each state takes O(1) to O(n) to compute depending on the transition. This is the fundamental DP speedup: from O(2^n) brute force to O(n) or O(n²) by caching.

### Hidden Variations

1. **Circular arrays**: House Robber II — the array wraps around, so you can't rob both the first and last house. Solution: run House Robber twice, once excluding the first element and once excluding the last.
2. **Multiple states per position**: Instead of one `dp[i]`, you might need `dp[i][state]` where state ∈ {holding, not_holding} (stock problems) or `dp[i][last_action]`.
3. **Suffix DP**: Sometimes it's easier to define `dp[i]` = answer for `arr[i..n-1]` and traverse right to left.
4. **DP with constraints**: "Maximum sum with no two adjacent" generalizes to "no two within distance k", changing the recurrence to `dp[i] = max(dp[i-1], dp[i-k-1] + val[i])`.
5. **String as 1D array**: Decode Ways, Word Break — the string is a 1D sequence and the DP state is a position in the string.

### Follow-Up Variations

- **"What if the array is circular?"** → Run the algorithm twice, excluding first/last element.
- **"Print the actual solution, not just the optimal value."** → Maintain a parent/decision array alongside the DP table.
- **"What if you can skip at most k elements?"** → Add a dimension: `dp[i][skips_used]`.
- **"What if elements can be negative?"** → Reconsider your state definition; Kadane's handles this naturally but other formulations might not.
- **"Online version: elements arrive one at a time."** → If `dp[i]` depends on O(1) previous states, the DP naturally supports online processing.

### Interview Frequency

| Company | Frequency | Typical Difficulty |
|---------|-----------|-------------------|
| Google | ★★★★★ | Medium + follow-ups |
| Meta | ★★★★★ | Medium (speed test) |
| Amazon | ★★★★★ | Easy-Medium |
| Microsoft | ★★★★☆ | Medium |
| Uber | ★★★★☆ | Medium |
| Apple | ★★★★☆ | Easy-Medium |
| Bloomberg | ★★★★☆ | Medium |

### How Interviewers Expect You to Identify It

When the interviewer says "find the minimum cost to reach the top" or "how many ways can you...", they expect you to immediately recognize the DP structure. The expected flow:

1. **Within 30 seconds**: "This is a DP problem because at each step I have choices, and the number of subproblems is polynomial."
2. **Within 2 minutes**: "Let me define `dp[i]` as... The recurrence is... The base cases are..."
3. **Within 5 minutes**: Working code with correct base cases.
4. **Within 8 minutes**: Discuss time/space complexity, then offer space optimization.

For 1D Linear DP, interviewers are NOT impressed by just getting the answer. They expect you to:
- Immediately identify the pattern
- Write clean, bug-free code quickly
- Optimize space without being asked
- Handle edge cases (empty array, single element, all zeros)

### Why Candidates Fail

1. **Too slow on easy DP**: If you take 15 minutes on House Robber, you've failed the interview even if you get it right. These are warm-up problems.
2. **Base case bugs**: The recurrence is usually correct, but `dp[0]`, `dp[1]`, or the empty-string case is wrong.
3. **Not considering edge cases**: What if `n = 0`? What if `n = 1`? What if all values are negative?
4. **Inability to space-optimize**: At L5+ interviews, you're expected to go from O(n) to O(1) space unprompted.
5. **Can't explain why greedy doesn't work**: "I think this is DP" is not sufficient. You should articulate: "Greedy fails here because [counterexample]. We need to consider both taking and not taking element i."

### How Elite Candidates Think

Elite candidates see 1D Linear DP not as individual problems but as instances of a single template:

```
// Template for 1D Linear DP
// dp[i] = optimal answer for prefix arr[0..i]
dp[0] = base_case_0;
dp[1] = base_case_1; // if needed
for (int i = start; i < n; i++) {
    dp[i] = best_of(
        dp[i-1] + something,        // skip / extend
        dp[i-2] + something_else,   // take with gap
        ... other transitions ...
    );
}
return dp[n-1]; // or dp[n] depending on definition
```

They immediately classify the problem:
- **"This is the take-or-skip template"** → House Robber family
- **"This is the extend-or-restart template"** → Maximum Subarray family
- **"This is the partition template"** → Word Break, Decode Ways

Then they adapt the template to the specific problem in under 3 minutes.

### Curated Questions

---

##### Q1: Climbing Stairs
| Field | Value |
|-------|-------|
| **Platform** | LeetCode |
| **Link** | https://leetcode.com/problems/climbing-stairs/ |
| **Difficulty** | Easy |
| **Companies** | Google, Amazon, Apple, Microsoft, Bloomberg |
| **Topic** | Dynamic Programming |
| **Pattern** | 1D Linear DP |
| **Variation** | Fibonacci variant |
| **Frequency** | ★★★★★ (5/5) |

**Key Observation**: At step `i`, you could have arrived from step `i-1` (one step) or step `i-2` (two steps). So `dp[i] = dp[i-1] + dp[i-2]`. This is literally Fibonacci.

**Expected Thought Process**:
1. "How many ways to reach step i? I can come from i-1 or i-2."
2. "This gives the recurrence `dp[i] = dp[i-1] + dp[i-2]` with `dp[0]=1, dp[1]=1`."
3. "I can optimize to O(1) space since I only need the last two values."
4. "For the follow-up with k step sizes, the recurrence becomes `dp[i] = sum(dp[i-j] for j in steps)`."

**Alternative Solutions**:
- Matrix exponentiation: O(log n) time. Mention this for bonus points at Google.
- Binet's formula (closed-form Fibonacci): O(1) time but floating-point precision issues.
- Recursion with memoization: O(n) time, O(n) space (less optimal).

**Time Complexity**: O(n)
**Space Complexity**: O(1) with optimization, O(n) naive

**Common Mistakes**:
- Off-by-one: `dp[0] = 1` represents "one way to stay at ground" — some people set `dp[0] = 0`.
- Not optimizing space when the problem is this simple — interviewers notice.

**Follow-Up Questions**:
- "What if you can take 1, 2, or 3 steps?" → dp[i] = dp[i-1] + dp[i-2] + dp[i-3]
- "What if the step sizes are given as an array?" → Generalized coin change (count ways)
- "Can you solve it in O(log n)?" → Matrix exponentiation on [[1,1],[1,0]]
- "What if certain stairs are broken (can't be stepped on)?" → Set dp[broken] = 0

---

##### Q2: House Robber
| Field | Value |
|-------|-------|
| **Platform** | LeetCode |
| **Link** | https://leetcode.com/problems/house-robber/ |
| **Difficulty** | Medium |
| **Companies** | Google, Amazon, Microsoft, Cisco, Adobe |
| **Topic** | Dynamic Programming |
| **Pattern** | 1D Linear DP |
| **Variation** | Take-or-skip with adjacency constraint |
| **Frequency** | ★★★★★ (5/5) |

**Key Observation**: For each house `i`, you either rob it (and add its value to the best you could do up to house `i-2`) or skip it (and keep the best from house `i-1`). The recurrence is `dp[i] = max(dp[i-1], dp[i-2] + nums[i])`.

**Expected Thought Process**:
1. "Can't rob adjacent houses. At each house, I choose: rob or skip."
2. "If I rob house i, my previous rob must be at most house i-2. Best from 0..i-2 is dp[i-2]."
3. "If I skip house i, my best is dp[i-1]."
4. "`dp[i] = max(dp[i-1], dp[i-2] + nums[i])` with `dp[0] = nums[0], dp[1] = max(nums[0], nums[1])`."
5. "Space optimize to two variables: prev and prevPrev."

**Alternative Solutions**:
- Top-down memoization: Same complexity, but uses recursion stack.
- Decision tree / brute force: O(2^n) — show you understand why this is exponential before presenting DP.

**Time Complexity**: O(n)
**Space Complexity**: O(1) with rolling variables

**Common Mistakes**:
- Setting `dp[1] = nums[1]` instead of `max(nums[0], nums[1])` — you might skip house 0 entirely.
- Forgetting to handle `n = 1` edge case.
- Returning `dp[n-1]` without realizing `dp[n-1]` already accounts for skipping.

**Follow-Up Questions**:
- "What if houses are in a circle?" → House Robber II: solve twice, excluding first and last.
- "What if it's a binary tree?" → House Robber III: tree DP with (rob, skip) states per node.
- "What if you can rob houses with a gap of at most k?" → `dp[i] = max(dp[i-1], max(dp[i-2..i-k-1]) + nums[i])`.
- "Print which houses to rob." → Track decisions in a boolean array.

---

##### Q3: Coin Change
| Field | Value |
|-------|-------|
| **Platform** | LeetCode |
| **Link** | https://leetcode.com/problems/coin-change/ |
| **Difficulty** | Medium |
| **Companies** | Google, Amazon, Microsoft, Goldman Sachs, Apple |
| **Topic** | Dynamic Programming |
| **Pattern** | 1D Linear DP (also Knapsack family) |
| **Variation** | Unbounded knapsack — minimum count |
| **Frequency** | ★★★★★ (5/5) |

**Key Observation**: `dp[amount]` = minimum number of coins needed to make `amount`. For each coin denomination `c`, if `amount >= c`, then `dp[amount] = min(dp[amount], dp[amount - c] + 1)`. This is unbounded knapsack because each coin can be used unlimited times.

**Expected Thought Process**:
1. "Minimum coins for amount. At each step, I choose a coin to use."
2. "State: `dp[a]` = min coins for amount `a`. Base: `dp[0] = 0`."
3. "Transition: `dp[a] = min over all coins c of (dp[a-c] + 1)` where `a >= c`."
4. "Initialize `dp[1..amount] = INF`. If `dp[amount]` remains INF, return -1."
5. "Time: O(amount × |coins|). Space: O(amount)."

**Alternative Solutions**:
- BFS approach: Treat each amount as a node, each coin as an edge. BFS from 0 finds minimum coins. O(amount × |coins|) but constant factors differ.
- Greedy (WRONG for general case): Using largest coins first fails for coins = [1, 3, 4], amount = 6. Greedy gives 4+1+1=3 coins, optimal is 3+3=2 coins.

**Time Complexity**: O(amount × |coins|)
**Space Complexity**: O(amount)

**Common Mistakes**:
- Initializing dp array to 0 instead of INF. Every state except dp[0] should be INF initially.
- Using `Integer.MAX_VALUE` without checking for overflow when adding 1. Use `amount + 1` as INF instead.
- Confusing this with Coin Change 2 (count ways, not min coins).
- Trying greedy and failing on non-canonical coin systems.

**Follow-Up Questions**:
- "Count the number of ways instead of min coins." → Coin Change 2 (different recurrence).
- "What if each coin can only be used once?" → 0/1 Knapsack variant.
- "Print which coins were used." → Backtracking through the DP table.
- "What if the coin set is always {1, 5, 10, 25}?" → Greedy works for canonical coin systems.

---

##### Q4: Decode Ways
| Field | Value |
|-------|-------|
| **Platform** | LeetCode |
| **Link** | https://leetcode.com/problems/decode-ways/ |
| **Difficulty** | Medium |
| **Companies** | Google, Meta, Amazon, Microsoft, Uber |
| **Topic** | Dynamic Programming |
| **Pattern** | 1D Linear DP |
| **Variation** | String partitioning with constraints |
| **Frequency** | ★★★★★ (5/5) |

**Key Observation**: `dp[i]` = number of ways to decode `s[0..i-1]`. At position `i`, you can decode one digit `s[i-1]` (if it's 1-9) or two digits `s[i-2..i-1]` (if they form 10-26). The tricky part is handling '0' — it can't be decoded alone.

**Expected Thought Process**:
1. "Each letter maps to 1-26. How many ways to split the digit string?"
2. "State: `dp[i]` = ways to decode first `i` characters."
3. "If `s[i-1] != '0'`: `dp[i] += dp[i-1]` (decode single digit)."
4. "If `s[i-2..i-1]` forms 10-26: `dp[i] += dp[i-2]` (decode two digits)."
5. "Base: `dp[0] = 1` (empty string has one decoding), `dp[1] = (s[0] != '0') ? 1 : 0`."
6. "Edge: If `dp[n] = 0`, there's no valid decoding."

**Alternative Solutions**:
- Recursive with memoization: Same complexity, easier to reason about the '0' cases.
- O(1) space: Only need dp[i-1] and dp[i-2], so use two variables.

**Time Complexity**: O(n)
**Space Complexity**: O(1) with optimization

**Common Mistakes**:
- Forgetting that '0' cannot be decoded as a single digit. `s = "06"` has 0 decodings.
- Off-by-one errors between 0-indexed string and 1-indexed DP array.
- Not checking that two-digit number is between 10-26 (not just ≤ 26 — "07" is invalid).
- Missing the edge case where the entire string is "0".

**Follow-Up Questions**:
- "What if '*' represents any digit 1-9?" → Decode Ways II (LC 639). The recurrence explodes in cases.
- "Return any one valid decoding." → Backtrack through the DP table.
- "What if the mapping is different (e.g., 'a'=0, 'b'=1, ...)?" → Adjust the range checks.

---

##### Q5: Maximum Subarray
| Field | Value |
|-------|-------|
| **Platform** | LeetCode |
| **Link** | https://leetcode.com/problems/maximum-subarray/ |
| **Difficulty** | Medium |
| **Companies** | Google, Amazon, Microsoft, Meta, Apple, LinkedIn |
| **Topic** | Dynamic Programming |
| **Pattern** | 1D Linear DP |
| **Variation** | Extend-or-restart (Kadane's Algorithm) |
| **Frequency** | ★★★★★ (5/5) |

**Key Observation**: `dp[i]` = maximum subarray sum *ending at* index `i`. At each position, you either extend the previous subarray or start a new one: `dp[i] = max(nums[i], dp[i-1] + nums[i])`. The global answer is `max(dp[0], dp[1], ..., dp[n-1])`.

**Expected Thought Process**:
1. "Maximum contiguous subarray sum. This is Kadane's algorithm."
2. "Define `dp[i]` = max sum of subarray ending at i."
3. "`dp[i] = max(nums[i], dp[i-1] + nums[i])` — extend or restart."
4. "Track global max across all `dp[i]` values."
5. "Space optimize: only need previous dp value → O(1) space."
6. "Handle all-negative arrays: the answer is the least negative number."

**Alternative Solutions**:
- Divide and conquer: O(n log n). Split array, recursively solve left/right, merge by finding max crossing subarray. Shows strong algorithmic thinking.
- Prefix sums: max subarray sum = max(prefix[j] - prefix[i]) for j > i. Equivalent to a stock buy/sell problem!
- Brute force: O(n²) or O(n³). Only mention to contrast with DP.

**Time Complexity**: O(n)
**Space Complexity**: O(1)

**Common Mistakes**:
- Initializing `maxSum = 0` instead of `nums[0]` or `Integer.MIN_VALUE`. Fails for all-negative arrays.
- Returning `dp[n-1]` instead of the global maximum across all positions.
- Confusing "maximum subarray ending at i" with "maximum subarray within 0..i".

**Follow-Up Questions**:
- "Return the subarray itself (indices)." → Track start/end indices during Kadane's.
- "Maximum subarray with at most one deletion." → Two passes: left-to-right and right-to-left max subarray ending/starting at each position.
- "Maximum circular subarray." → max(Kadane's result, totalSum - minSubarray).
- "What about maximum subarray product?" → Track both max and min products (negatives flip).

---

##### Q6: Word Break
| Field | Value |
|-------|-------|
| **Platform** | LeetCode |
| **Link** | https://leetcode.com/problems/word-break/ |
| **Difficulty** | Medium |
| **Companies** | Google, Meta, Amazon, Apple, Bloomberg, Uber |
| **Topic** | Dynamic Programming |
| **Pattern** | 1D Linear DP |
| **Variation** | String partitioning with dictionary lookup |
| **Frequency** | ★★★★★ (5/5) |

**Key Observation**: `dp[i]` = true if `s[0..i-1]` can be segmented into dictionary words. For each `j < i`, if `dp[j]` is true AND `s[j..i-1]` is in the dictionary, then `dp[i]` = true. This is O(n²) with O(1) dictionary lookup (HashSet).

**Expected Thought Process**:
1. "Can the string be split into valid words? Greedy doesn't work — 'catsand' with dict {'cats','cat','sand','and'}: greedy matching 'cats' first leaves 'and' OK, but what about 'catsandog'?"
2. "State: `dp[i]` = can we segment `s[0..i-1]`."
3. "Transition: `dp[i] = OR over all j in [0, i) of (dp[j] AND s[j..i-1] in dict)`."
4. "Base: `dp[0] = true` (empty prefix is trivially segmentable)."
5. "Optimization: limit `j` range by max word length in dictionary."

**Alternative Solutions**:
- BFS/DFS with memoization: Treat each valid prefix as a node. BFS from index 0, checking if you can reach index n.
- Trie-based: Build a trie of dictionary words. Walk the string and trie simultaneously.
- With max word length optimization: inner loop runs at most `maxLen` times, not `n` times.

**Time Complexity**: O(n² × L) where L is average word length for substring comparison; O(n × maxWordLen) with optimization
**Space Complexity**: O(n) for DP array + O(totalDictChars) for HashSet

**Common Mistakes**:
- Not setting `dp[0] = true`. This base case means "the empty string is always segmentable."
- Using substring comparison without a HashSet, leading to O(n³) instead of O(n²).
- Missing the early termination: once `dp[i]` is true, break the inner loop.
- Forgetting that the same word can be used multiple times.

**Follow-Up Questions**:
- "Return all possible segmentations." → Word Break II (LC 140). Backtracking with memoization.
- "What if the dictionary is very large?" → Trie-based approach or limit inner loop by max word length.
- "What if you can only use each word once?" → More complex DP or backtracking with tracking.

---

##### Q7: Min Cost Climbing Stairs
| Field | Value |
|-------|-------|
| **Platform** | LeetCode |
| **Link** | https://leetcode.com/problems/min-cost-climbing-stairs/ |
| **Difficulty** | Easy |
| **Companies** | Amazon, Google, Microsoft |
| **Topic** | Dynamic Programming |
| **Pattern** | 1D Linear DP |
| **Variation** | Cost minimization with fixed transitions |
| **Frequency** | ★★★★☆ (4/5) |

**Key Observation**: `dp[i]` = minimum cost to reach step `i`. You can reach step `i` from step `i-1` (paying `cost[i-1]`) or step `i-2` (paying `cost[i-2]`). The goal is to reach step `n` (beyond the last step). `dp[i] = min(dp[i-1] + cost[i-1], dp[i-2] + cost[i-2])`.

**Expected Thought Process**:
1. "Minimize cost to reach the top. I can start at step 0 or step 1."
2. "`dp[i]` = min cost to reach step `i`. `dp[0] = 0, dp[1] = 0` (can start at either)."
3. "`dp[i] = min(dp[i-1] + cost[i-1], dp[i-2] + cost[i-2])`."
4. "Answer is `dp[n]`."
5. "Space: O(1) since I only need two previous values."

**Alternative Solutions**:
- Modify cost array in-place: `cost[i] += min(cost[i-1], cost[i-2])` for `i >= 2`, return `min(cost[n-1], cost[n-2])`.
- Top-down with memoization: Less elegant for this simple problem.

**Time Complexity**: O(n)
**Space Complexity**: O(1)

**Common Mistakes**:
- Confusing whether you pay the cost when you *arrive* at a step or when you *leave* it.
- Off-by-one: the answer is `dp[n]`, not `dp[n-1]`, because you need to go *past* the last step.
- Not allowing starting at either step 0 or step 1.

**Follow-Up Questions**:
- "What if you can take 1 to k steps?" → `dp[i] = min(dp[i-j] + cost[i-j])` for `j = 1..k`.
- "What if some steps are broken?" → Set cost of broken steps to infinity.

---

##### Q8: Longest Increasing Subsequence
| Field | Value |
|-------|-------|
| **Platform** | LeetCode |
| **Link** | https://leetcode.com/problems/longest-increasing-subsequence/ |
| **Difficulty** | Medium |
| **Companies** | Google, Amazon, Meta, Microsoft, Apple, Uber |
| **Topic** | Dynamic Programming |
| **Pattern** | 1D Linear DP |
| **Variation** | All-pairs dependency within 1D |
| **Frequency** | ★★★★★ (5/5) |

**Key Observation**: `dp[i]` = length of the longest increasing subsequence *ending at* index `i`. For each `j < i` where `nums[j] < nums[i]`, `dp[i] = max(dp[i], dp[j] + 1)`. The O(n²) solution is the DP approach; the O(n log n) solution uses patience sorting (binary search on a tails array).

**Expected Thought Process**:
1. "LIS. Classic DP. `dp[i]` = LIS length ending at `i`."
2. "For each pair `(j, i)` with `j < i` and `nums[j] < nums[i]`: `dp[i] = max(dp[i], dp[j] + 1)`."
3. "Base: `dp[i] = 1` for all `i` (each element is a subsequence of length 1)."
4. "Answer: `max(dp[0..n-1])`."
5. "O(n²) time. Can we do better?"
6. "O(n log n) with patience sorting: maintain a tails array where `tails[k]` = smallest ending element of all increasing subsequences of length `k+1`. For each element, binary search for its position."

**Alternative Solutions**:
- Patience sorting / Binary search: O(n log n). Use `tails[]` array and binary search (`lower_bound` in C++, `Arrays.binarySearch` in Java). This is the expected optimal solution at top companies.
- Segment tree / BIT: O(n log n). Overkill for this problem but useful for variants with 2D constraints.

**Time Complexity**: O(n²) for DP, O(n log n) for binary search approach
**Space Complexity**: O(n)

**Common Mistakes**:
- Returning `dp[n-1]` instead of `max(dp[0..n-1])`. The LIS might not end at the last element.
- In the O(n log n) solution: using `upper_bound` instead of `lower_bound` (or vice versa), which changes the subsequence from strictly increasing to non-decreasing.
- Thinking the tails array IS the LIS — it's not. It has the right length but not necessarily the right elements.

**Follow-Up Questions**:
- "Print the actual LIS." → Maintain parent pointers in the DP approach, or reconstruct from the binary search approach using position tracking.
- "Longest non-decreasing subsequence." → Change `<` to `<=` in comparisons (and `lower_bound` to `upper_bound` in O(n log n) solution).
- "Number of longest increasing subsequences." → LC 673: maintain both length and count arrays.
- "Russian Doll Envelopes (2D LIS)." → Sort by width ascending, height descending; then LIS on heights.

---

### Mastery Framework

| Level | Description | Checkpoint |
|-------|-------------|------------|
| L0 | Cannot identify 1D DP problems | Tries brute force or greedy on House Robber |
| L1 | Recognizes pattern but struggles with recurrence | Can solve Climbing Stairs but not Decode Ways |
| L2 | Writes correct recurrence with minor base case bugs | Solves House Robber with 1-2 debugging iterations |
| L3 | Clean solution with correct base cases, O(n) space | Solves Coin Change, Word Break on first attempt |
| L4 | Automatically space-optimizes, handles all edge cases | Solves any 1D DP in under 10 minutes with O(1) space |
| L5 | Sees the meta-pattern, handles follow-ups instantly | Extends House Robber to circular/tree variants without blinking |

### Interview Communication Example

**Problem: House Robber**

> "So I need to find the maximum amount I can rob without robbing two adjacent houses. Let me think about this...
>
> I'll use dynamic programming. Let me define `dp[i]` as the maximum money I can rob considering houses `0` through `i`.
>
> At house `i`, I have two choices:
> 1. **Rob it**: Then I can't rob house `i-1`, so my best is `dp[i-2] + nums[i]`.
> 2. **Skip it**: My best is `dp[i-1]`.
>
> So `dp[i] = max(dp[i-1], dp[i-2] + nums[i])`.
>
> Base cases: `dp[0] = nums[0]` (rob the only house), `dp[1] = max(nums[0], nums[1])` (rob the better of the first two).
>
> Since `dp[i]` only depends on `dp[i-1]` and `dp[i-2]`, I can optimize to O(1) space using two variables.
>
> Let me code this up... [writes clean code]. Time is O(n), space is O(1).
>
> Edge cases: if the array is empty, return 0. If there's one house, return `nums[0]`.
>
> Should I trace through an example?"

### Company-Specific Expectations

**Google**: Expects you to crush 1D DP in 5 minutes and spend the remaining time on follow-ups. Common follow-up: "Now make it circular" or "Now it's a tree." They also love asking for O(n log n) LIS and will probe whether you understand patience sorting deeply.

**Meta**: Speed is king. You should solve House Robber or Climbing Stairs in under 5 minutes with zero bugs. They use these as warm-ups before harder questions. If you struggle here, the interview is effectively over.

**Amazon**: Asks standard 1D DP (Coin Change, Word Break) as the main problem. They focus on problem-solving process and communication. They want to see you consider multiple approaches before committing to DP.

**Uber**: Likes Word Break and Decode Ways variants. May ask you to handle edge cases that trip up most candidates (strings with '0', empty dictionary).

**Microsoft**: Asks classical formulations. Expects clean code with good variable naming. May ask you to explain the time-space tradeoff of top-down vs bottom-up.

---

## Pattern 20.2: 2D Grid DP

### Pattern Description

2D Grid DP extends the linear DP concept to two dimensions. The state is typically `(row, col)` representing a position in a grid, and the DP value at each cell depends on adjacent cells (usually up and left for top-left to bottom-right traversal, but the direction depends on the problem).

The canonical form is `dp[i][j]` = answer for reaching cell `(i, j)` from some starting position, where transitions come from neighboring cells. The grid structure makes traversal order intuitive: for most problems, you scan row by row, left to right, and each cell's answer is computed from cells you've already visited.

Grid DP problems appear deceptively simple but have surprising depth. The basic "Unique Paths" is a combination problem in disguise (n+m choose m), but adding obstacles, costs, or multi-agent scenarios (Cherry Pickup) makes the problem fundamentally harder. Interviewers love grid DP because it tests your ability to define states, handle boundaries, and reason about traversal — all in a visual, intuitive setting.

### Core Invariant

**`dp[i][j]` encodes the optimal answer for reaching cell `(i, j)` from the designated starting cell, using only allowed transitions, and this value is final once computed.** The key constraint is that transitions must form a DAG — you can't have cycles in your movement, or you need a different algorithm (BFS/Dijkstra).

### Recognition Signals

- The input is a 2D grid/matrix.
- You need to find a path from top-left to bottom-right (or similar).
- Movement is restricted to right and down (no backtracking).
- The problem asks for number of paths, minimum cost path, or maximum value path.
- The grid has obstacles or variable costs.
- Keywords: "grid", "matrix", "path", "minimum cost", "number of ways".

### Common Traps

- **Wrong traversal order**: If you can only move right and down, traverse top-to-bottom, left-to-right. If you can move in all four directions, DP on the raw grid doesn't work — you need BFS/Dijkstra.
- **Boundary handling**: The first row and first column have only one incoming direction. Forgetting to handle these separately causes index-out-of-bounds errors.
- **Obstacles reset the DP value to 0 (for counting) or INF (for minimization)**: You can't pass through an obstacle, so `dp[i][j] = 0` or `dp[i][j] = INF` if `grid[i][j]` is blocked.
- **Multi-pass problems (Cherry Pickup)**: You can't solve two passes independently and add the results. Two agents must be simulated simultaneously to avoid double-counting.
- **In-place modification risks**: Modifying the grid as your DP table works for some problems but breaks others where you need the original values.

### Complexity Intuition

- **Time**: O(m × n) for simple grid DP where each cell has O(1) transitions. O(m × n × extra_dimension) for problems with additional state (e.g., Cherry Pickup is O(n³)).
- **Space**: O(m × n) for the full DP table. Optimizable to O(n) using row compression (only keep the previous row). Sometimes O(1) if modifying the grid in place.
- **Why**: There are m × n states, each computed in O(1). The grid structure guarantees that traversal order is trivial (unlike graph problems). This is what makes grid DP efficient.

### Hidden Variations

1. **Multi-source DP**: Instead of starting from `(0,0)`, the optimal answer for each cell might depend on the entire grid. Example: Maximal Square computes the largest square ending at each cell.
2. **Multi-agent grid DP**: Two agents traverse the grid simultaneously (Cherry Pickup). State becomes `(r1, c1, r2, c2)` but since they move at the same speed, `r1 + c1 = r2 + c2`, reducing to 3 variables.
3. **Reverse DP**: For Dungeon Game, you must traverse from bottom-right to top-left because the required health at each cell depends on future cells.
4. **4-directional movement**: DP alone can't handle this (cycles possible). Use BFS/Dijkstra instead.
5. **Grid as string**: Some string problems are really grid DP (Edit Distance is a 2D grid where axes are the two strings).

### Follow-Up Variations

- **"What if the grid has obstacles?"** → Set dp[obstacle] = 0 (counting) or INF (optimization). Propagate correctly.
- **"What if you can move in all 4 directions?"** → This is NOT standard grid DP. Use BFS (unweighted) or Dijkstra (weighted).
- **"What if there are two agents?"** → Simultaneous traversal, 3D state. Cherry Pickup.
- **"What if the grid is very large (10^6 × 10^6)?"** → Look for mathematical formula (combinatorics for Unique Paths) or matrix exponentiation.
- **"Optimize space?"** → Row compression: keep only current and previous row. For some problems, single row suffices.

### Interview Frequency

| Company | Frequency | Typical Difficulty |
|---------|-----------|-------------------|
| Google | ★★★★★ | Medium-Hard |
| Meta | ★★★★★ | Medium (speed test) |
| Amazon | ★★★★☆ | Medium |
| Microsoft | ★★★★☆ | Medium |
| Uber | ★★★☆☆ | Medium |
| Apple | ★★★★☆ | Medium |
| Goldman Sachs | ★★★☆☆ | Medium |

### How Interviewers Expect You to Identify It

The visual nature of grid DP makes identification straightforward. When you see a grid and restricted movement, your first instinct should be:

1. **"Is this a shortest path problem with uniform costs?"** → BFS.
2. **"Is this a shortest path problem with variable costs?"** → Dijkstra or DP (if movement is restricted to right/down).
3. **"Is movement restricted to right and down?"** → Grid DP.
4. **"Is the grid a vehicle for a different problem?"** → Might be string DP, graph DP, etc.

For pure grid DP, interviewers expect you to sketch the grid, trace the transitions for 2-3 cells, and start coding within 3 minutes. These problems test execution speed more than creativity.

### Why Candidates Fail

1. **Boundary bugs**: Accessing `grid[-1][j]` or `grid[i][-1]`. The first row and column need special handling.
2. **Wrong initialization**: For path counting, `dp[0][0] = 1`. For minimization, `dp[0][0] = grid[0][0]`. Getting this wrong propagates errors everywhere.
3. **Forgetting obstacles**: Treating obstacle cells as passable, or forgetting to set `dp[obstacle] = 0/INF`.
4. **Trying DP on problems that need BFS**: If movement isn't restricted, DP doesn't work. Candidates waste time on impossible DP formulations.
5. **Multi-pass fallacy**: For Cherry Pickup, solving two independent passes and adding results is WRONG because you might double-count cells.

### How Elite Candidates Think

Elite candidates have the grid DP template internalized:

```java
// Template for grid DP (top-left to bottom-right, right/down moves)
dp[0][0] = base_case(grid[0][0]);

// First row: can only come from the left
for (int j = 1; j < n; j++)
    dp[0][j] = dp[0][j-1] ⊕ grid[0][j]; // ⊕ depends on the problem

// First column: can only come from above
for (int i = 1; i < m; i++)
    dp[i][0] = dp[i-1][0] ⊕ grid[i][0];

// Interior cells: come from left or above
for (int i = 1; i < m; i++)
    for (int j = 1; j < n; j++)
        dp[i][j] = best_of(dp[i-1][j], dp[i][j-1]) ⊕ grid[i][j];

return dp[m-1][n-1];
```

They immediately recognize:
- **"Counting paths"** → ⊕ is addition, best_of is sum.
- **"Minimum cost path"** → ⊕ is addition, best_of is min.
- **"Maximum value path"** → ⊕ is addition, best_of is max.
- **"Need to handle obstacles"** → Add `if (grid[i][j] == obstacle) dp[i][j] = 0/INF; continue;`.

### Curated Questions

---

##### Q1: Unique Paths
| Field | Value |
|-------|-------|
| **Platform** | LeetCode |
| **Link** | https://leetcode.com/problems/unique-paths/ |
| **Difficulty** | Medium |
| **Companies** | Google, Meta, Amazon, Microsoft, Bloomberg |
| **Topic** | Dynamic Programming |
| **Pattern** | 2D Grid DP |
| **Variation** | Path counting |
| **Frequency** | ★★★★★ (5/5) |

**Key Observation**: `dp[i][j]` = number of unique paths from `(0,0)` to `(i,j)`. Since you can only move right or down, `dp[i][j] = dp[i-1][j] + dp[i][j-1]`. This is equivalent to C(m+n-2, m-1) — a combinatorics problem in disguise.

**Expected Thought Process**:
1. "Grid, only right/down moves, count paths. This is grid DP."
2. "`dp[i][j] = dp[i-1][j] + dp[i][j-1]`. Base: first row and first column are all 1s."
3. "Alternative: C(m+n-2, m-1) using combinatorics."
4. "Space optimization: use 1D array, `dp[j] += dp[j-1]` for each row."

**Alternative Solutions**:
- Combinatorics: C(m+n-2, m-1) in O(min(m,n)) time, O(1) space. Mention this for bonus points.
- DFS with memoization: Same O(m×n) but uses recursion stack.

**Time Complexity**: O(m × n) for DP, O(min(m,n)) for combinatorics
**Space Complexity**: O(n) with row compression, O(1) for combinatorics

**Common Mistakes**:
- Setting `dp[0][0] = 0` instead of 1.
- Overflow in the combinatorics approach for large m, n.
- Forgetting to initialize entire first row and first column to 1.

**Follow-Up Questions**:
- "What if there are obstacles?" → Unique Paths II. Set `dp[obstacle] = 0`.
- "What about the combinatorics approach?" → Shows mathematical maturity.
- "Can you optimize space to O(min(m,n))?" → Use the shorter dimension for the 1D array.

---

##### Q2: Unique Paths II (with Obstacles)
| Field | Value |
|-------|-------|
| **Platform** | LeetCode |
| **Link** | https://leetcode.com/problems/unique-paths-ii/ |
| **Difficulty** | Medium |
| **Companies** | Google, Meta, Amazon, Bloomberg |
| **Topic** | Dynamic Programming |
| **Pattern** | 2D Grid DP |
| **Variation** | Path counting with blocked cells |
| **Frequency** | ★★★★☆ (4/5) |

**Key Observation**: Same as Unique Paths but if `grid[i][j] == 1` (obstacle), `dp[i][j] = 0`. Obstacles in the first row/column also block all subsequent cells in that row/column.

**Expected Thought Process**:
1. "Same as Unique Paths, but obstacles set dp to 0."
2. "Key insight: obstacle in first row means ALL cells to its right have 0 paths."
3. "If starting cell or ending cell is an obstacle, return 0 immediately."
4. "I can do this in-place or with a 1D array."

**Alternative Solutions**:
- In-place modification of the grid (if allowed): Set obstacle cells to 0, convert the grid into the DP table.
- 1D row compression: `dp[j] = 0` if obstacle, else `dp[j] += dp[j-1]`.

**Time Complexity**: O(m × n)
**Space Complexity**: O(n) with row compression

**Common Mistakes**:
- Not zeroing out cells *after* an obstacle in the first row/column. An obstacle at `(0, 2)` means `dp[0][3], dp[0][4], ...` are all 0.
- Using `int` instead of `long` for large grids (paths can be huge).
- Forgetting to check if the start or end cell is blocked.

**Follow-Up Questions**:
- "What if you can remove one obstacle?" → Need a different DP formulation with an additional state dimension.
- "What is the minimum number of obstacles to remove to make a path exist?" → BFS/Dijkstra on 0-1 weighted graph.

---

##### Q3: Minimum Path Sum
| Field | Value |
|-------|-------|
| **Platform** | LeetCode |
| **Link** | https://leetcode.com/problems/minimum-path-sum/ |
| **Difficulty** | Medium |
| **Companies** | Google, Amazon, Goldman Sachs, Microsoft |
| **Topic** | Dynamic Programming |
| **Pattern** | 2D Grid DP |
| **Variation** | Cost minimization on grid |
| **Frequency** | ★★★★★ (5/5) |

**Key Observation**: `dp[i][j]` = minimum sum to reach `(i,j)` from `(0,0)`. `dp[i][j] = grid[i][j] + min(dp[i-1][j], dp[i][j-1])`. Can be done in-place by modifying the input grid.

**Expected Thought Process**:
1. "Minimum cost path, only right/down. Grid DP."
2. "`dp[i][j] = grid[i][j] + min(dp[i-1][j], dp[i][j-1])`."
3. "First row: `dp[0][j] = dp[0][j-1] + grid[0][j]`. First col similarly."
4. "Can modify grid in-place: `grid[i][j] += min(grid[i-1][j], grid[i][j-1])`."
5. "Or use 1D array: `dp[j] = grid[i][j] + min(dp[j], dp[j-1])`."

**Alternative Solutions**:
- In-place modification: O(1) extra space but destructive.
- 1D rolling array: O(n) space, non-destructive.
- Dijkstra: Works but overkill since the graph is a DAG. O(mn log(mn)).

**Time Complexity**: O(m × n)
**Space Complexity**: O(1) in-place, O(n) with rolling array

**Common Mistakes**:
- Not handling first row and first column separately (they only have one incoming direction).
- Using `max` instead of `min` — a silly but common typo under pressure.
- Modifying the input grid when the problem says not to.

**Follow-Up Questions**:
- "What if you can move in all 4 directions with non-negative weights?" → Dijkstra.
- "What if some cells have negative values?" → Need to be more careful, but grid DP still works since movement is restricted.
- "Print the path." → Backtrack from `(m-1, n-1)`, always moving to the cell with smaller DP value.

---

##### Q4: Dungeon Game
| Field | Value |
|-------|-------|
| **Platform** | LeetCode |
| **Link** | https://leetcode.com/problems/dungeon-game/ |
| **Difficulty** | Hard |
| **Companies** | Google, Amazon, Microsoft |
| **Topic** | Dynamic Programming |
| **Pattern** | 2D Grid DP |
| **Variation** | Reverse DP — dependency on future states |
| **Frequency** | ★★★★☆ (4/5) |

**Key Observation**: You CANNOT traverse from top-left to bottom-right because the health required at each cell depends on the *future* path — you need to know what's ahead to determine if you have enough health. Instead, traverse from bottom-right to top-left: `dp[i][j]` = minimum health needed at cell `(i,j)` to reach the princess.

**Expected Thought Process**:
1. "Need minimum starting health to survive. Forward DP doesn't work because current health depends on future path."
2. "Reverse DP: `dp[i][j]` = min health needed at `(i,j)` to survive from here to `(m-1,n-1)`."
3. "Base: `dp[m-1][n-1] = max(1, 1 - dungeon[m-1][n-1])`."
4. "`dp[i][j] = max(1, min(dp[i+1][j], dp[i][j+1]) - dungeon[i][j])`."
5. "The `max(1, ...)` ensures health is always at least 1."
6. "Answer: `dp[0][0]`."

**Alternative Solutions**:
- Binary search + forward DP: Binary search on starting health, check if you can survive with forward DP. O(mn log V) where V is the value range. Less elegant.
- Forward DP with health tracking: Requires tracking both current health and minimum health along the path, which is much more complex.

**Time Complexity**: O(m × n)
**Space Complexity**: O(n) with row compression

**Common Mistakes**:
- Trying forward DP and getting stuck. This is the most common failure mode. If greedy/forward doesn't work, think reverse!
- Forgetting `max(1, ...)` — health must always be at least 1 (you die at 0).
- Wrong traversal order: must go bottom-right to top-left.
- Not handling the case where `dungeon[m-1][n-1]` is positive (you still need at least 1 health).

**Follow-Up Questions**:
- "What if you can move in all 4 directions?" → This becomes an NP-hard problem in general.
- "What if there are health potions that give you max health caps?" → More complex state.
- "Explain why forward DP doesn't work." → Critical — interviewers want to hear this reasoning.

---

##### Q5: Maximal Square
| Field | Value |
|-------|-------|
| **Platform** | LeetCode |
| **Link** | https://leetcode.com/problems/maximal-square/ |
| **Difficulty** | Medium |
| **Companies** | Google, Amazon, Apple, Uber, Airbnb |
| **Topic** | Dynamic Programming |
| **Pattern** | 2D Grid DP |
| **Variation** | Region-based DP (not path-based) |
| **Frequency** | ★★★★★ (5/5) |

**Key Observation**: `dp[i][j]` = side length of the largest square with bottom-right corner at `(i,j)`. If `grid[i][j] == '1'`, then `dp[i][j] = min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1]) + 1`. The `min` is because the square is limited by the smallest adjacent square.

**Expected Thought Process**:
1. "Largest square of 1s. Brute force is O(n³) — for each cell, expand. Can we do better?"
2. "DP: `dp[i][j]` = largest square ending at `(i,j)` as bottom-right."
3. "Key insight: A square of size k at `(i,j)` requires squares of size k-1 at `(i-1,j)`, `(i,j-1)`, and `(i-1,j-1)`. So `dp[i][j] = min(top, left, diagonal) + 1`."
4. "If `grid[i][j] == '0'`, `dp[i][j] = 0`."
5. "Answer: `max(dp[i][j])²` (square the side length for area)."

**Alternative Solutions**:
- Histogram-based (from Maximal Rectangle): Can be adapted but less elegant.
- Brute force with prefix sums: O(n³) — for each possible top-left, binary search for the largest valid square using 2D prefix sums.

**Time Complexity**: O(m × n)
**Space Complexity**: O(n) with row compression

**Common Mistakes**:
- Returning the side length instead of the area. The answer is `maxSide * maxSide`.
- Not handling the first row and column separately (they can only have squares of size 0 or 1).
- Confusing with Maximal Rectangle (different recurrence, different problem).
- Using `max` instead of `min` in the recurrence — the bottleneck is the *smallest* adjacent square.

**Follow-Up Questions**:
- "What about maximal rectangle?" → LC 85, histogram-based approach, harder.
- "What about maximal square with at most k zeros?" → Much harder, different approach needed.
- "Count the total number of squares?" → `ans += dp[i][j]` for all cells. (LC 1277)

---

##### Q6: Cherry Pickup
| Field | Value |
|-------|-------|
| **Platform** | LeetCode |
| **Link** | https://leetcode.com/problems/cherry-pickup/ |
| **Difficulty** | Hard |
| **Companies** | Google, Amazon |
| **Topic** | Dynamic Programming |
| **Pattern** | 2D Grid DP |
| **Variation** | Multi-agent simultaneous traversal |
| **Frequency** | ★★★☆☆ (3/5) |

**Key Observation**: You CANNOT solve this as "go right-down, then go left-up" because the two passes interact — cherries picked in the first pass aren't available in the second. Instead, simulate two agents moving simultaneously from `(0,0)` to `(n-1,n-1)`. State: `(r1, c1, r2, c2)` but since both move at the same speed, `r1+c1 = r2+c2 = t` (step count), so state reduces to `(r1, r2, t)` — O(n³).

**Expected Thought Process**:
1. "Two trips... but doing them independently is wrong (double-counting)."
2. "Model as two people walking simultaneously from top-left to bottom-right."
3. "State: `dp[t][r1][r2]` = max cherries when person 1 is at row `r1`, person 2 at row `r2`, at step `t`."
4. "Columns derived: `c1 = t - r1`, `c2 = t - r2`. Valid when `0 ≤ c1, c2 < n`."
5. "If `r1 == r2`, they're at the same cell — count cherry only once."
6. "Transitions: each person moves right or down (4 combinations)."
7. "Answer: `max(0, dp[2n-2][n-1][n-1])`."

**Alternative Solutions**:
- Recursive with 3D memoization: Easier to implement correctly, same complexity.
- Greedy (WRONG): Finding the best first path and then the best remaining path can miss the global optimum.

**Time Complexity**: O(n³)
**Space Complexity**: O(n²) with layer-by-layer optimization

**Common Mistakes**:
- Solving two passes independently — this is the #1 mistake and a great "trap" the interviewer is hoping you avoid.
- Forgetting to handle the case where both people are on the same cell (only collect cherry once).
- Forgetting that cells with -1 (thorns) are impassable.
- Off-by-one in the step variable `t`.

**Follow-Up Questions**:
- "Cherry Pickup II" (LC 1463): agents start at different positions in the first row.
- "What if there are k agents?" → State space explodes, may need approximation or different approach.

---

##### Q7: Triangle
| Field | Value |
|-------|-------|
| **Platform** | LeetCode |
| **Link** | https://leetcode.com/problems/triangle/ |
| **Difficulty** | Medium |
| **Companies** | Amazon, Microsoft, Google, Apple |
| **Topic** | Dynamic Programming |
| **Pattern** | 2D Grid DP |
| **Variation** | Variable-width grid, bottom-up optimal |
| **Frequency** | ★★★★☆ (4/5) |

**Key Observation**: This is a "grid" where row `i` has `i+1` elements, and from position `(i, j)` you can move to `(i+1, j)` or `(i+1, j+1)`. Bottom-up DP is cleaner: start from the last row and propagate upward. `dp[i][j] = triangle[i][j] + min(dp[i+1][j], dp[i+1][j+1])`.

**Expected Thought Process**:
1. "Triangle with min path sum from top to bottom."
2. "Bottom-up is cleaner: `dp[j] = triangle[row][j] + min(dp[j], dp[j+1])` for each row from bottom to top."
3. "Start with `dp = last row of triangle`."
4. "Answer: `dp[0]` after processing all rows."
5. "O(n) space using 1D array."

**Alternative Solutions**:
- Top-down: `dp[i][j] = triangle[i][j] + min(dp[i-1][j-1], dp[i-1][j])`. Boundary handling is messier.
- Modify triangle in-place: O(1) extra space but destructive.

**Time Complexity**: O(n²) where n is the number of rows
**Space Complexity**: O(n)

**Common Mistakes**:
- Trying top-down and struggling with boundary conditions (j=0 has no left parent, j=i has no right parent).
- Forgetting that bottom-up eliminates boundary issues entirely.
- Returning `min(dp)` instead of `dp[0]` when doing bottom-up (dp[0] IS the answer).

**Follow-Up Questions**:
- "What if you need to print the path?" → Track the column index chosen at each level.
- "What if the triangle is huge (10^6 rows)?" → Streaming approach, process row by row without storing the whole triangle.

---

### Mastery Framework

| Level | Description | Checkpoint |
|-------|-------------|------------|
| L0 | Cannot formulate grid DP | Tries DFS/BFS for Unique Paths |
| L1 | Can solve basic grid DP with boundary bugs | Solves Minimum Path Sum with 1-2 debugging rounds |
| L2 | Clean grid DP with correct boundaries | Solves Unique Paths II with obstacles, first attempt |
| L3 | Handles space optimization and in-place modification | Solves Triangle with O(n) space naturally |
| L4 | Recognizes reverse DP (Dungeon Game) and region DP (Maximal Square) | Solves Dungeon Game by immediately seeing the reverse traversal need |
| L5 | Handles multi-agent DP (Cherry Pickup) and novel grid constraints | Formulates Cherry Pickup state reduction from 4D to 3D without hints |

### Interview Communication Example

**Problem: Dungeon Game**

> "The knight needs minimum starting health to reach the princess. Let me think about the direction of DP...
>
> If I go forward (top-left to bottom-right), I have a problem: the health I need at any cell depends on what's *ahead* of me. A large health potion later might mean I can afford less health now. So forward DP doesn't capture the right information.
>
> I'll do reverse DP instead. `dp[i][j]` = minimum health I need at cell `(i,j)` to survive from here to the princess.
>
> Base case: At the princess cell `(m-1, n-1)`, I need `max(1, 1 - dungeon[m-1][n-1])` health. If the cell is positive, I still need at least 1 health.
>
> Transition: From `(i,j)`, I'll go to the neighbor with lower health requirement:
> `dp[i][j] = max(1, min(dp[i+1][j], dp[i][j+1]) - dungeon[i][j])`
>
> The `max(1, ...)` ensures I always have at least 1 HP.
>
> I'll traverse bottom-to-top, right-to-left. Answer is `dp[0][0]`.
>
> [Writes code.] Time O(mn), space O(n) with row compression."

### Company-Specific Expectations

**Google**: Loves Dungeon Game and Cherry Pickup. Expects you to articulate *why* forward DP fails for Dungeon Game — this explanation is valued more than the code. For Cherry Pickup, expects the 4D to 3D state reduction.

**Meta**: Asks Unique Paths, Minimum Path Sum under severe time pressure (10-12 minutes). Expects bug-free code with space optimization. May layer on obstacles as a follow-up.

**Amazon**: Asks standard grid DP (Minimum Path Sum, Unique Paths II) as main problems. Focuses on clear communication and edge case handling. May ask you to print the actual path.

**Uber**: Occasionally asks Maximal Square. Expects the `min(top, left, diagonal) + 1` insight with a clear explanation of *why* it works.

**Apple**: Likes Triangle and Minimum Path Sum. Values clean code and clear variable naming. May ask about space optimization.

---

## Pattern 20.3: String DP

### Pattern Description

String DP is the most frequently asked DP pattern at top-tier companies, especially Google and Meta. The state is typically `(i, j)` where `i` is a position in string `s1` and `j` is a position in string `s2`, and `dp[i][j]` represents the answer for the substrings `s1[0..i-1]` and `s2[0..j-1]`.

The beauty of String DP is that despite the enormous variety of problems — edit distance, subsequence matching, palindromes, regex matching — they all follow a remarkably similar template. The recurrence almost always involves three choices at `(i, j)`: match/substitute (diagonal), delete from s1 (up), delete from s2 (left). Understanding this template deeply makes a huge family of problems instantly solvable.

String DP problems are favorites of interviewers because they test multiple skills simultaneously: state definition, recurrence construction, base case handling, and the ability to handle tricky edge cases (empty strings, special characters in regex). They're also hard to solve greedily, so they genuinely test DP understanding.

### Core Invariant

**`dp[i][j]` represents the answer for the prefixes `s1[0..i-1]` and `s2[0..j-1]`, and is computed using only values from `dp[i-1][j]`, `dp[i][j-1]`, and `dp[i-1][j-1]`.** The 2D table is filled row by row, and each cell depends only on its top, left, and top-left neighbors.

### Recognition Signals

- Two strings/sequences given as input.
- "Longest/shortest common [subsequence/substring]."
- "Minimum operations to convert one string to another."
- "Number of ways to match/interleave two strings."
- "Does pattern match the string?" (regex, wildcard).
- Palindrome problems (one string compared against its reverse).
- "Distinct subsequences" or "number of subsequences matching..."

### Common Traps

- **Off-by-one indexing**: The DP table is (n+1) × (m+1) to accommodate the empty string, but the strings are 0-indexed. `dp[i][j]` corresponds to `s1[i-1]` and `s2[j-1]`, NOT `s1[i]` and `s2[j]`. This is the single most common bug.
- **Forgetting empty string base cases**: `dp[0][j]` (empty s1 vs j characters of s2) and `dp[i][0]` (i characters of s1 vs empty s2) must be initialized correctly. For edit distance, `dp[0][j] = j` and `dp[i][0] = i`. For LCS, `dp[0][j] = dp[i][0] = 0`.
- **Confusing subsequence and substring**: Subsequence allows gaps, substring doesn't. LCS (Longest Common Subsequence) uses the full 2D DP. Longest Common Substring requires the match to be contiguous — the recurrence resets to 0 on mismatch.
- **Wrong recurrence for specialized problems**: Regex matching and wildcard matching have non-obvious transitions for '*'. In regex, '*' means "zero or more of the preceding character." In wildcard, '*' means "any sequence of characters." These are DIFFERENT recurrences.
- **Not realizing palindrome problems are String DP**: Longest Palindromic Subsequence is LCS of the string with its reverse.

### Complexity Intuition

- **Time**: O(n × m) for standard two-string DP (LCS, Edit Distance, etc.). n and m are the lengths of the two strings. O(n²) for single-string problems (palindromes) where you compare the string against itself.
- **Space**: O(n × m) for the full table. Optimizable to O(min(n, m)) using row compression. For some problems (longest palindromic substring), O(1) space is possible with the expand-from-center approach (though that's not DP).
- **Why**: There are n × m subproblems, each solved in O(1). The strings create a natural 2D state space. No subproblem is solved more than once.

### Hidden Variations

1. **Single-string palindrome DP**: Longest Palindromic Subsequence = LCS(s, reverse(s)). Longest Palindromic Substring uses expand-from-center (O(n²)) or Manacher's (O(n)), which aren't standard DP.
2. **Three-string DP**: Interleaving String (`dp[i][j]` = can first `i` chars of s1 and first `j` chars of s2 form first `i+j` chars of s3). State is 2D but involves 3 strings.
3. **DP with '*' and '?'**: Wildcard/regex matching. The '*' character creates a non-obvious recurrence.
4. **Counting DP on strings**: Distinct Subsequences counts how many subsequences of s1 equal s2. The recurrence is additive, not min/max.
5. **Sequence alignment**: Edit Distance is the same as sequence alignment in bioinformatics. Interview versions may add different costs for insert, delete, substitute.

### Follow-Up Variations

- **"Print the actual LCS/edit operations."** → Backtrack through the DP table from `dp[n][m]` to `dp[0][0]`, following the decisions.
- **"What if operations have different costs?"** → Weighted edit distance: `dp[i][j] = min(dp[i-1][j] + del_cost, dp[i][j-1] + ins_cost, dp[i-1][j-1] + (s1[i-1]==s2[j-1] ? 0 : sub_cost))`.
- **"Optimize space."** → Use two rows (or even one row with a temp variable for the diagonal).
- **"What if the strings are very long (10^5)?"** → O(nm) might TLE. Need special algorithms: Hunt-Szymanski for sparse LCS, or bit-parallel methods.
- **"Handle case-insensitive matching."** → Normalize both strings before DP.

### Interview Frequency

| Company | Frequency | Typical Difficulty |
|---------|-----------|-------------------|
| Google | ★★★★★ | Medium-Hard |
| Meta | ★★★★★ | Medium |
| Amazon | ★★★★☆ | Medium |
| Microsoft | ★★★★☆ | Medium |
| Uber | ★★★★☆ | Medium-Hard |
| Apple | ★★★☆☆ | Medium |
| Bloomberg | ★★★★☆ | Medium |

### How Interviewers Expect You to Identify It

When you see two strings and a question about their relationship (similarity, transformation, matching), your brain should immediately go to the 2D string DP table:

1. **"Two strings, optimal answer"** → Probably Edit Distance or LCS.
2. **"Subsequence of one string in another"** → LCS variant or Distinct Subsequences.
3. **"Pattern matching with wildcards"** → Wildcard Matching or Regex Matching.
4. **"Palindrome in a single string"** → Compare with reverse (reduces to String DP) or use interval DP.

Interviewers expect you to draw the DP table (at least conceptually), explain what each cell means, and trace through 2-3 cells to verify your recurrence before coding.

### Why Candidates Fail

1. **Off-by-one everywhere**: Using 0-indexed strings with a (n+1)×(m+1) table is inherently confusing. Many candidates mess up the correspondence between `dp[i][j]` and string indices.
2. **Wrong base cases**: For Edit Distance, `dp[i][0] = i` (delete all of s1) and `dp[0][j] = j` (insert all of s2). Getting these wrong makes every cell wrong.
3. **Can't handle regex/wildcard '*'**: The '*' case in regex matching is genuinely tricky: `*` means "zero or more of the previous element", so you need to consider both skipping (zero occurrences) and extending (one more occurrence).
4. **Don't see palindrome as String DP**: Many candidates try ad-hoc approaches for palindrome problems instead of recognizing LPS = LCS(s, rev(s)).
5. **Time pressure**: String DP requires careful implementation. Under pressure, index errors multiply.

### How Elite Candidates Think

Elite candidates see the universal String DP template:

```java
// Universal String DP Template
// dp[i][j] = answer for s1[0..i-1] and s2[0..j-1]
int[][] dp = new int[n + 1][m + 1];

// Base cases: dp[0][j] and dp[i][0]
for (int j = 0; j <= m; j++) dp[0][j] = base_j(j);
for (int i = 0; i <= n; i++) dp[i][0] = base_i(i);

for (int i = 1; i <= n; i++) {
    for (int j = 1; j <= m; j++) {
        if (s1.charAt(i-1) == s2.charAt(j-1)) {
            dp[i][j] = dp[i-1][j-1] + match_value; // match
        } else {
            dp[i][j] = best_of(
                dp[i-1][j-1] + substitute_cost,  // substitute
                dp[i-1][j] + delete_cost,         // delete from s1
                dp[i][j-1] + insert_cost          // insert into s1
            );
        }
    }
}
```

They immediately classify problems by what "match_value", "substitute_cost", etc. should be:
- **LCS**: match_value = 1, on mismatch take max(up, left) — no substitute option.
- **Edit Distance**: match_value = 0 (no cost for match), substitute/delete/insert costs all = 1, best_of = min.
- **Distinct Subsequences**: match adds dp[i-1][j-1], always includes dp[i-1][j] — completely different structure.

### Curated Questions

---

##### Q1: Longest Common Subsequence
| Field | Value |
|-------|-------|
| **Platform** | LeetCode |
| **Link** | https://leetcode.com/problems/longest-common-subsequence/ |
| **Difficulty** | Medium |
| **Companies** | Google, Amazon, Microsoft, Uber |
| **Topic** | Dynamic Programming |
| **Pattern** | String DP |
| **Variation** | Classic two-string subsequence |
| **Frequency** | ★★★★★ (5/5) |

**Key Observation**: `dp[i][j]` = length of LCS of `s1[0..i-1]` and `s2[0..j-1]`. If characters match, `dp[i][j] = dp[i-1][j-1] + 1`. Otherwise, `dp[i][j] = max(dp[i-1][j], dp[i][j-1])` — skip one character from either string.

**Expected Thought Process**:
1. "LCS of two strings. Classic string DP."
2. "State: `dp[i][j]` = LCS length for first `i` chars of s1 and first `j` chars of s2."
3. "If `s1[i-1] == s2[j-1]`: `dp[i][j] = dp[i-1][j-1] + 1` (extend the match)."
4. "Else: `dp[i][j] = max(dp[i-1][j], dp[i][j-1])` (skip from one string)."
5. "Base: `dp[0][j] = dp[i][0] = 0` (empty string has LCS 0 with anything)."
6. "Answer: `dp[n][m]`."

**Alternative Solutions**:
- Space-optimized to O(min(n,m)): Use two 1D arrays (or one with a diagonal temp variable).
- Hunt-Szymanski: O((r + n) log n) where r is the number of matching pairs. Better for sparse matches.
- Recursive with memoization: Same complexity, easier to reason about for beginners.

**Time Complexity**: O(n × m)
**Space Complexity**: O(n × m), optimizable to O(min(n, m))

**Common Mistakes**:
- Returning `dp[n-1][m-1]` instead of `dp[n][m]` — off-by-one due to 1-indexed DP table.
- Trying to use LIS approach (sort one string by other's indices) — works for specific cases like LCS of permutations, not general strings.
- Confusing with Longest Common Substring (must be contiguous).

**Follow-Up Questions**:
- "Print the actual LCS." → Backtrack from `dp[n][m]`: if characters match, include it and go diagonal; else go to the larger neighbor.
- "Shortest Common Supersequence." → Length = n + m - LCS_length. Reconstruct similarly.
- "LCS of three strings." → 3D DP: `dp[i][j][k]`. O(n × m × l).
- "Longest Common Substring instead of Subsequence." → Reset dp to 0 on mismatch; track global max.

---

##### Q2: Edit Distance
| Field | Value |
|-------|-------|
| **Platform** | LeetCode |
| **Link** | https://leetcode.com/problems/edit-distance/ |
| **Difficulty** | Medium |
| **Companies** | Google, Meta, Amazon, Microsoft, Uber, Bloomberg |
| **Topic** | Dynamic Programming |
| **Pattern** | String DP |
| **Variation** | Minimum cost string transformation |
| **Frequency** | ★★★★★ (5/5) |

**Key Observation**: `dp[i][j]` = minimum edit operations to convert `s1[0..i-1]` to `s2[0..j-1]`. Three operations: insert, delete, substitute. If characters match, free transition diagonally. Otherwise, take the minimum of all three operations.

**Expected Thought Process**:
1. "Convert word1 to word2 with minimum insert/delete/replace. Classic Edit Distance."
2. "State: `dp[i][j]` = min ops to transform `word1[0..i-1]` to `word2[0..j-1]`."
3. "If `word1[i-1] == word2[j-1]`: `dp[i][j] = dp[i-1][j-1]` (no operation needed)."
4. "Else: `dp[i][j] = 1 + min(dp[i-1][j-1], dp[i-1][j], dp[i][j-1])` — replace, delete, insert."
5. "Base: `dp[i][0] = i` (delete all), `dp[0][j] = j` (insert all)."
6. "Answer: `dp[n][m]`."

**Alternative Solutions**:
- Space-optimized: Two 1D arrays, O(min(n,m)) space.
- Recursive with memoization: Top-down approach, same complexity.
- For small edit distances: Ukkonen's algorithm runs in O(n × d) where d is the edit distance. Mention for bonus points.

**Time Complexity**: O(n × m)
**Space Complexity**: O(n × m), optimizable to O(min(n, m))

**Common Mistakes**:
- Confusing which operation corresponds to which DP direction. Remember: `dp[i-1][j]` = delete from word1, `dp[i][j-1]` = insert into word1, `dp[i-1][j-1]` = replace.
- Wrong base cases: `dp[0][0] = 0`, not 1.
- Forgetting to handle the "characters match" case separately (no cost for matching).

**Follow-Up Questions**:
- "What if replace costs 2 but insert/delete cost 1?" → Change the weights in the recurrence.
- "Print the sequence of operations." → Backtrack through the table.
- "One edit distance?" → LC 161: O(n) solution without DP, just check if strings differ in exactly one position.
- "What if you can only insert and delete (no replace)?" → Edit distance = n + m - 2 × LCS.

---

##### Q3: Longest Palindromic Subsequence
| Field | Value |
|-------|-------|
| **Platform** | LeetCode |
| **Link** | https://leetcode.com/problems/longest-palindromic-subsequence/ |
| **Difficulty** | Medium |
| **Companies** | Google, Amazon, Meta, LinkedIn |
| **Topic** | Dynamic Programming |
| **Pattern** | String DP |
| **Variation** | Single-string DP via LCS with reverse |
| **Frequency** | ★★★★☆ (4/5) |

**Key Observation**: The longest palindromic subsequence of `s` is the LCS of `s` and `reverse(s)`. Alternatively, use interval DP: `dp[i][j]` = LPS of `s[i..j]`. If `s[i] == s[j]`, `dp[i][j] = dp[i+1][j-1] + 2`. Else, `dp[i][j] = max(dp[i+1][j], dp[i][j-1])`.

**Expected Thought Process**:
1. "Longest palindromic subsequence. Two approaches:"
2. "Approach 1: LCS(s, reverse(s)). Reduces to known problem."
3. "Approach 2: Interval DP. `dp[i][j]` = LPS of substring `s[i..j]`."
4. "For interval DP: base case is `dp[i][i] = 1`, iterate by interval length."
5. "I'll use the LCS approach since I know the template."

**Alternative Solutions**:
- Interval DP: More direct, O(n²) time and space. Requires careful traversal order (by interval length).
- LCS with reverse: Reuses known LCS code. Same complexity.
- Recursive with memoization: O(n²) with 2D memo table.

**Time Complexity**: O(n²)
**Space Complexity**: O(n²), optimizable to O(n)

**Common Mistakes**:
- Using the LPS approach but forgetting that `dp[i][j]` is only valid for `i <= j`.
- Wrong traversal order in interval DP: must process shorter intervals before longer ones.
- Confusing with Longest Palindromic Substring (contiguous vs non-contiguous).

**Follow-Up Questions**:
- "Minimum insertions to make the string a palindrome?" → `n - LPS_length`.
- "Longest Palindromic Substring instead?" → Expand from center approach, O(n²) time, O(1) space. Or Manacher's O(n).
- "Count palindromic subsequences?" → Different and much harder problem (LC 730).

---

##### Q4: Distinct Subsequences
| Field | Value |
|-------|-------|
| **Platform** | LeetCode |
| **Link** | https://leetcode.com/problems/distinct-subsequences/ |
| **Difficulty** | Hard |
| **Companies** | Google, Amazon, Meta |
| **Topic** | Dynamic Programming |
| **Pattern** | String DP |
| **Variation** | Counting subsequence matches |
| **Frequency** | ★★★★☆ (4/5) |

**Key Observation**: `dp[i][j]` = number of subsequences of `s[0..i-1]` that equal `t[0..j-1]`. If `s[i-1] == t[j-1]`: `dp[i][j] = dp[i-1][j-1] + dp[i-1][j]` (use this character or skip it). If they don't match: `dp[i][j] = dp[i-1][j]` (must skip s[i-1]).

**Expected Thought Process**:
1. "Count subsequences of s that equal t. DP with states (i, j)."
2. "`dp[i][j]` = # of ways to form `t[0..j-1]` from `s[0..i-1]`."
3. "If `s[i-1] == t[j-1]`: `dp[i][j] = dp[i-1][j-1] + dp[i-1][j]`."
   - `dp[i-1][j-1]`: use `s[i-1]` to match `t[j-1]`
   - `dp[i-1][j]`: skip `s[i-1]`, find other ways
4. "If mismatch: `dp[i][j] = dp[i-1][j]` — skip `s[i-1]`."
5. "Base: `dp[i][0] = 1` (empty t matched by empty subsequence), `dp[0][j] = 0` for `j > 0`."

**Alternative Solutions**:
- 1D space optimization: Since `dp[i][j]` depends on `dp[i-1][j]` and `dp[i-1][j-1]`, traverse `j` from right to left with a single array.
- Recursive with memoization: Same complexity, slightly easier reasoning.

**Time Complexity**: O(n × m) where n = |s|, m = |t|
**Space Complexity**: O(m) with 1D optimization

**Common Mistakes**:
- The recurrence is ADDITIVE (counting), not min/max. This is different from LCS/Edit Distance.
- Swapping s and t: we're finding subsequences of s that match t, not the other way around.
- Overflow: the number of distinct subsequences can be astronomically large. Use `long` or modular arithmetic.
- Wrong base case: `dp[i][0] = 1` for all i (empty string t is always a subsequence).

**Follow-Up Questions**:
- "What if we allow one character mismatch?" → Add an additional dimension to track mismatches used.
- "What if the result is too large? Return mod 10^9+7." → Standard modular arithmetic.
- "What if s and t have wildcards?" → Combine with regex matching.

---

##### Q5: Regular Expression Matching
| Field | Value |
|-------|-------|
| **Platform** | LeetCode |
| **Link** | https://leetcode.com/problems/regular-expression-matching/ |
| **Difficulty** | Hard |
| **Companies** | Google, Meta, Amazon, Microsoft, Uber |
| **Topic** | Dynamic Programming |
| **Pattern** | String DP |
| **Variation** | Pattern matching with '*' and '.' |
| **Frequency** | ★★★★★ (5/5) |

**Key Observation**: `dp[i][j]` = does `s[0..i-1]` match `p[0..j-1]`? The tricky case is `'*'`: in regex, `*` means "zero or more of the preceding element." So `p[j-1] == '*'` means we can:
1. Use zero of `p[j-2]`: `dp[i][j] = dp[i][j-2]`
2. Use one or more of `p[j-2]`: `dp[i][j] = dp[i-1][j]` if `s[i-1]` matches `p[j-2]`

**Expected Thought Process**:
1. "Regex matching with '.' (any char) and '*' (zero or more of preceding). DP."
2. "`dp[i][j]` = true if `s[0..i-1]` matches `p[0..j-1]`."
3. "Case 1: `p[j-1]` is a normal char or '.'. Match if `dp[i-1][j-1]` and `s[i-1]` matches `p[j-1]`."
4. "Case 2: `p[j-1] == '*'`."
   - Zero occurrences: `dp[i][j] |= dp[i][j-2]` (skip `p[j-2]*`)
   - One+ occurrences: `dp[i][j] |= dp[i-1][j]` if `s[i-1]` matches `p[j-2]`
5. "Base: `dp[0][0] = true`. `dp[0][j]` = true if `p[0..j-1]` can match empty string (only possible with `x*` patterns)."

**Alternative Solutions**:
- NFA simulation: Build a nondeterministic finite automaton from the pattern. O(nm) but conceptually different.
- Recursive with memoization: Often cleaner for this problem due to complex case handling.
- Thompson's construction: O(nm) guaranteed, used in production regex engines.

**Time Complexity**: O(n × m)
**Space Complexity**: O(n × m)

**Common Mistakes**:
- Confusing regex `*` (zero or more of PRECEDING element) with wildcard `*` (any sequence). They are DIFFERENT problems.
- Not handling `dp[0][j]` correctly: patterns like `a*b*c*` can match the empty string. Must check `dp[0][j] = dp[0][j-2]` when `p[j-1] == '*'`.
- Trying to handle `*` as a standalone character instead of as a modifier of the preceding character.
- Not considering that '.' matches ANY single character, including in the `x*` case.

**Follow-Up Questions**:
- "What about Wildcard Matching (LC 44)?" → Different `*` semantics: matches any sequence, not "zero or more of preceding".
- "What if you add '+' (one or more)?" → Modify the '*' logic to require at least one match.
- "Can you optimize space?" → Standard row compression to O(m).

---

##### Q6: Wildcard Matching
| Field | Value |
|-------|-------|
| **Platform** | LeetCode |
| **Link** | https://leetcode.com/problems/wildcard-matching/ |
| **Difficulty** | Hard |
| **Companies** | Google, Meta, Amazon, Uber |
| **Topic** | Dynamic Programming |
| **Pattern** | String DP |
| **Variation** | Pattern matching with '*' and '?' |
| **Frequency** | ★★★★☆ (4/5) |

**Key Observation**: Unlike regex, wildcard `*` matches ANY sequence of characters (including empty). `?` matches any single character. `dp[i][j]` = does `s[0..i-1]` match `p[0..j-1]`? When `p[j-1] == '*'`: `dp[i][j] = dp[i-1][j] || dp[i][j-1]` — `*` matches one more char or matches empty from here.

**Expected Thought Process**:
1. "Wildcard matching. '*' matches any sequence, '?' matches any single char."
2. "`dp[i][j]` = true if `s[0..i-1]` matches `p[0..j-1]`."
3. "If `p[j-1] == s[i-1]` or `p[j-1] == '?'`: `dp[i][j] = dp[i-1][j-1]`."
4. "If `p[j-1] == '*'`: `dp[i][j] = dp[i][j-1] || dp[i-1][j]`."
   - `dp[i][j-1]`: `*` matches empty (skip it)
   - `dp[i-1][j]`: `*` matches `s[i-1]` and potentially more characters
5. "Base: `dp[0][0] = true`. `dp[0][j] = true` only if `p[0..j-1]` is all `*`s."

**Alternative Solutions**:
- Two-pointer greedy: O(n × m) worst case but faster in practice. Track last `*` position and backtrack on mismatch.
- Recursive with memoization: Same complexity, easier to verify correctness.

**Time Complexity**: O(n × m)
**Space Complexity**: O(n × m), optimizable to O(m)

**Common Mistakes**:
- Confusing with regex matching. Wildcard `*` matches ANY sequence, not "zero or more of preceding."
- Wrong base case for `dp[0][j]`: must check that all pattern characters up to j are `*`.
- Off-by-one errors when consecutive `*`s appear in the pattern.

**Follow-Up Questions**:
- "Compare this with regex matching. What changes?" → '*' semantics are completely different.
- "Can you solve it with a greedy/two-pointer approach?" → Yes, and it's often faster in practice.
- "What if '?' is removed?" → Simpler version, same DP structure.

---

##### Q7: Interleaving String
| Field | Value |
|-------|-------|
| **Platform** | LeetCode |
| **Link** | https://leetcode.com/problems/interleaving-string/ |
| **Difficulty** | Medium |
| **Companies** | Google, Amazon, Microsoft |
| **Topic** | Dynamic Programming |
| **Pattern** | String DP |
| **Variation** | Three-string DP reduced to 2D |
| **Frequency** | ★★★★☆ (4/5) |

**Key Observation**: `dp[i][j]` = can `s1[0..i-1]` and `s2[0..j-1]` interleave to form `s3[0..i+j-1]`? Since `s3`'s position is determined by `i + j`, we don't need a third dimension. At each step, the next character of `s3` must come from either `s1` or `s2`.

**Expected Thought Process**:
1. "Check if s3 is formed by interleaving s1 and s2."
2. "Quick check: `len(s1) + len(s2) != len(s3)` → false."
3. "`dp[i][j]` = true if `s1[0..i-1]` and `s2[0..j-1]` can interleave to form `s3[0..i+j-1]`."
4. "`dp[i][j] = (dp[i-1][j] && s1[i-1] == s3[i+j-1]) || (dp[i][j-1] && s2[j-1] == s3[i+j-1])`."
5. "Base: `dp[0][0] = true`. First row/column: check if s1/s2 prefix matches s3 prefix."

**Alternative Solutions**:
- BFS: Treat (i, j) as a graph node, find if (n1, n2) is reachable from (0, 0).
- 1D space optimization: Since dp[i][j] depends only on dp[i-1][j] and dp[i][j-1].

**Time Complexity**: O(n × m)
**Space Complexity**: O(m) with 1D optimization

**Common Mistakes**:
- Not checking `len(s1) + len(s2) == len(s3)` first — a simple optimization that catches many false cases.
- Wrong index for s3: the character is at position `i + j - 1`, not `i + j`.
- Forgetting that the interleaving must preserve the relative order within each string.

**Follow-Up Questions**:
- "What if you need to find ALL valid interleavings?" → Backtracking with the DP table for pruning.
- "What if there are more than 2 source strings?" → Multi-dimensional DP, exponential in number of strings.

---

##### Q8: Longest Palindromic Substring
| Field | Value |
|-------|-------|
| **Platform** | LeetCode |
| **Link** | https://leetcode.com/problems/longest-palindromic-substring/ |
| **Difficulty** | Medium |
| **Companies** | Google, Amazon, Meta, Microsoft, Apple |
| **Topic** | Dynamic Programming |
| **Pattern** | String DP |
| **Variation** | Interval DP on a single string / Expand from center |
| **Frequency** | ★★★★★ (5/5) |

**Key Observation**: Two approaches: (1) Interval DP: `dp[i][j]` = true if `s[i..j]` is a palindrome. `dp[i][j] = (s[i] == s[j]) && dp[i+1][j-1]`. (2) Expand from center: for each center (or center pair), expand outward while characters match. The expand approach is O(n²) time, O(1) space and preferred in interviews.

**Expected Thought Process**:
1. "Longest palindromic substring. Not subsequence — must be contiguous."
2. "Approach 1: DP. `dp[i][j]` = whether `s[i..j]` is a palindrome. O(n²) time and space."
3. "Approach 2: Expand from center. For each of 2n-1 centers, expand. O(n²) time, O(1) space."
4. "I'll use expand from center since it's simpler and uses less space."
5. "Handle both odd-length (single center) and even-length (double center) palindromes."

**Alternative Solutions**:
- Manacher's algorithm: O(n) time, O(n) space. Mention for strong impression but rarely expected to implement.
- DP: O(n²) time and space. Clearer connection to DP pattern but less space-efficient.
- Suffix array / suffix tree: O(n log n) or O(n). Overkill for interviews.

**Time Complexity**: O(n²) for expand/DP, O(n) for Manacher's
**Space Complexity**: O(1) for expand, O(n²) for DP, O(n) for Manacher's

**Common Mistakes**:
- Confusing with longest palindromic subsequence (which uses LCS with reverse).
- In expand approach: not handling even-length palindromes (need to also expand from `(i, i+1)`).
- In DP approach: wrong traversal order — must process shorter intervals first (iterate by length, not by starting index in naive order).
- Off-by-one when extracting the actual substring from indices.

**Follow-Up Questions**:
- "Can you solve it in O(n)?" → Manacher's algorithm. Explain the concept even if you can't code it.
- "Count all palindromic substrings?" → LC 647. Same expand approach, count instead of track max.
- "Longest palindromic subsequence instead?" → LCS(s, reverse(s)).

---

### Mastery Framework

| Level | Description | Checkpoint |
|-------|-------------|------------|
| L0 | Can't formulate string DP table | Doesn't know what `dp[i][j]` means for two strings |
| L1 | Understands the concept but makes index errors | Solves LCS but off-by-one somewhere |
| L2 | Correct LCS and Edit Distance with clean code | Handles base cases correctly, traces through examples |
| L3 | Handles all standard variations (palindromes, distinct subseq) | Solves Distinct Subsequences and LPS without hints |
| L4 | Correctly implements regex and wildcard matching | Handles '*' edge cases in both regex and wildcard matching |
| L5 | Sees the meta-template, handles novel variations instantly | Given a new string matching problem, derives the recurrence in 2 minutes |

### Interview Communication Example

**Problem: Edit Distance**

> "I need the minimum number of insertions, deletions, and replacements to convert word1 to word2. This is the classic edit distance problem.
>
> I'll use 2D DP. Let `dp[i][j]` be the min operations to convert `word1[0..i-1]` to `word2[0..j-1]`.
>
> Base cases: `dp[i][0] = i` — deleting all characters of word1. `dp[0][j] = j` — inserting all characters of word2.
>
> For the recurrence, at position `(i, j)`:
> - If `word1[i-1] == word2[j-1]`: characters match, no operation needed. `dp[i][j] = dp[i-1][j-1]`.
> - Otherwise, take the minimum of three operations:
>   - Replace: `dp[i-1][j-1] + 1`
>   - Delete from word1: `dp[i-1][j] + 1`
>   - Insert into word1: `dp[i][j-1] + 1`
>
> Let me trace through a small example... 'horse' → 'ros'...
> [Traces 2-3 cells to verify]
>
> Looks correct. Let me code this. Time O(nm), space O(nm), optimizable to O(m)."

### Company-Specific Expectations

**Google**: String DP is their bread and butter. Expect Edit Distance as a warm-up, then "now handle regex" or "now what if replace costs 2?" They want to see you adapt the template. Regex Matching is a VERY frequent Google question.

**Meta**: Asks LCS and Edit Distance under speed pressure. You should solve these in 10-12 minutes with correct base cases. They may ask for space optimization. Longest Palindromic Substring is also very common.

**Amazon**: Asks standard string DP with emphasis on explaining your approach. Word Break (technically 1D but string-based) and Edit Distance are favorites. They want clear communication.

**Uber**: Likes Wildcard Matching and Interleaving String. These are slightly off the beaten path and test deeper understanding.

**Microsoft**: Asks LCS and Edit Distance at standard difficulty. Focuses on clean implementation and ability to trace through examples.

---

## Pattern 20.4: Knapsack Family

### Pattern Description

The Knapsack family is the most fundamental DP pattern family. At its core, it models a binary decision at each step: **include this item or exclude it**. You have items with weights and values, a capacity constraint, and you want to maximize value (or count ways, or determine feasibility). Nearly 40% of all DP problems can be reduced to a knapsack variant.

The family has several flavors: **0/1 Knapsack** (each item used at most once), **Unbounded Knapsack** (each item can be used unlimited times), and **Bounded Knapsack** (each item has a limited count). Each flavor has a different traversal order for space optimization, and confusing them is a critical bug source.

What makes knapsack problems deceptive in interviews is that they rarely say "knapsack." Instead, they're disguised as "partition array into two subsets," "find target sum," or "count combinations of coins." The skill is recognizing the choose-or-skip structure hiding beneath the problem statement.

### Core Invariant

**`dp[i][w]` = optimal value using items `0..i-1` with capacity `w`.** At each item, you make a binary decision: take it (if it fits) or skip it. This decision is irrevocable and independent of future items. The capacity constraint ensures you can't take everything.

For the 1D space-optimized version: **`dp[w]` = optimal value achievable with capacity `w` using all considered items so far.**

### Recognition Signals

- "Given items with weights/sizes/costs, fill a capacity/budget/target."
- "Partition into subsets with equal sums."
- "Find if a subset sums to a target."
- "Maximize/minimize value within a constraint."
- "Count ways to reach a target using given values."
- Binary choice at each element: include or exclude.
- The constraint is a numeric capacity, not a structural one.

### Common Traps

- **Confusing 0/1 Knapsack with Unbounded Knapsack**: In 0/1, each item can be used once. In unbounded, unlimited times. The difference manifests in the space-optimized version:
  - **0/1 Knapsack**: iterate capacity **right to left** (to avoid using an item twice).
  - **Unbounded Knapsack**: iterate capacity **left to right** (to allow reusing items).
  - **Getting this wrong means your solution is solving a DIFFERENT problem.**
- **Subset Sum is a knapsack**: `dp[j]` = true if some subset sums to `j`. This is 0/1 knapsack where weight = value and capacity = target sum.
- **Target Sum with +/- signs**: This reduces to subset sum. If sum of all elements is S and target is T, then you need one subset summing to `(S + T) / 2`. If `(S + T)` is odd, answer is 0.
- **Wrong loop order with space optimization**: Probably the #1 knapsack bug. When reducing from 2D to 1D:
  - 0/1: inner loop goes from `W` down to `w[i]` (right to left).
  - Unbounded: inner loop goes from `w[i]` up to `W` (left to right).
- **Integer overflow in counting problems**: The number of ways can be huge. Use `long` or modular arithmetic.
- **Forgetting that items can have weight 0**: This can cause infinite loops in unbounded knapsack or incorrect results in subset sum.

### Complexity Intuition

- **Time**: O(n × W) where n is the number of items and W is the capacity. This is **pseudo-polynomial** — polynomial in the value of W, not the number of bits to represent W. For problems like Partition Equal Subset Sum, W = totalSum / 2 ≤ 10000, so O(n × 10000) is fine.
- **Space**: O(n × W) for the 2D table. Optimizable to O(W) using 1D array with correct traversal order.
- **Why**: There are n × W states, each computed in O(1). The "pseudo-polynomial" nature means that if W is exponential in n (e.g., W = 2^n), this is not efficient. But for interview constraints, W is typically manageable.

### Hidden Variations

1. **Partition Equal Subset Sum**: A direct application of subset sum with target = totalSum / 2. If totalSum is odd, immediately return false.
2. **Target Sum with +/-**: Reduce to subset sum. The positive set sums to `(S + target) / 2`. Count the number of subsets with this sum.
3. **Coin Change (min coins)**: Unbounded knapsack where weight = coin value, you minimize the count.
4. **Coin Change 2 (count ways)**: Unbounded knapsack where you count combinations (not permutations! Order doesn't matter).
5. **Rod Cutting**: Unbounded knapsack where rod of length n is cut into pieces of various lengths with prices.
6. **Minimum number of perfect squares summing to n**: Unbounded knapsack with "items" being 1², 2², 3², ....
7. **Knapsack with exact capacity**: Instead of "at most W", you need "exactly W". Initialize dp to -INF except dp[0] = 0.

### Follow-Up Variations

- **"What if each item can be used at most k times?"** → Bounded knapsack. Binary decomposition of k: split item into bundles of size 1, 2, 4, ..., converting to 0/1 knapsack with O(n log k) items.
- **"Print which items were selected."** → Maintain a 2D boolean table tracking decisions. Backtrack from dp[n][W].
- **"What if there are two constraints (weight AND volume)?"** → 3D DP: dp[i][w][v]. Space-optimized to 2D.
- **"What if item values are very large but item count is small?"** → DP on value instead of weight: dp[v] = minimum weight to achieve value v.
- **"Fractional knapsack?"** → This is GREEDY, not DP. Sort by value/weight ratio and take greedily.

### Interview Frequency

| Company | Frequency | Typical Difficulty |
|---------|-----------|-------------------|
| Google | ★★★★★ | Medium-Hard |
| Meta | ★★★★☆ | Medium |
| Amazon | ★★★★★ | Medium |
| Microsoft | ★★★★☆ | Medium |
| Uber | ★★★☆☆ | Medium |
| Apple | ★★★☆☆ | Medium |
| Goldman Sachs | ★★★★☆ | Medium |

### How Interviewers Expect You to Identify It

The knapsack structure is often disguised. Here's the translation table:

| Interview Problem | Knapsack Translation |
|-------------------|---------------------|
| "Partition array into two equal subsets" | Subset Sum with target = sum/2 |
| "Can you make amount X with these coins?" | Coin Change (feasibility) |
| "How many ways to make amount X?" | Unbounded knapsack (counting) |
| "Assign + or - to each number to reach target" | Subset Sum with target = (sum + target) / 2 |
| "Cut rod into pieces for maximum profit" | Unbounded knapsack (maximization) |
| "Minimum coins for amount" | Unbounded knapsack (minimization) |

Interviewers expect you to:
1. Recognize the knapsack structure within 1-2 minutes.
2. Identify which flavor (0/1 vs unbounded).
3. Set up the DP correctly.
4. Space-optimize with the correct loop direction.

### Why Candidates Fail

1. **Don't recognize knapsack in disguise**: "Partition Equal Subset Sum" doesn't mention knapsack, but it IS knapsack.
2. **Wrong loop direction in 1D optimization**: This is the #1 knapsack failure. Right-to-left for 0/1, left-to-right for unbounded. Getting this wrong silently produces incorrect results.
3. **Confuse "combinations" vs "permutations" in counting**: Coin Change 2 counts combinations (order doesn't matter) — loop over coins in the outer loop. If you loop over amounts in the outer loop, you get permutations (different problem).
4. **Don't handle the (S + T) % 2 != 0 case in Target Sum**: If the total sum plus the target is odd, no valid assignment exists.
5. **Forget dp[0] = 1 in counting problems**: The empty subset (taking nothing) achieves sum 0 in exactly one way.

### How Elite Candidates Think

Elite candidates have the knapsack family organized as a decision tree:

```
Is each item used at most once?
├── YES → 0/1 Knapsack
│   ├── Maximize value → Standard 0/1 knapsack
│   ├── Can we reach target? → Subset Sum
│   ├── Count ways to reach target → Counting 0/1 knapsack
│   └── Partition into equal subsets → Subset Sum with target = sum/2
│
└── NO → Unbounded Knapsack
    ├── Minimize count (coins) → Coin Change
    ├── Count combinations → Coin Change 2
    └── Maximize value (rod cutting) → Standard unbounded knapsack
```

For the 1D optimization, they remember the rule through intuition, not memorization:
- **0/1 Knapsack**: Process right-to-left because when computing `dp[w]`, you need `dp[w - weight[i]]` from the *previous* row (before considering item i). Left-to-right would use the *current* row, allowing item i to be picked twice.
- **Unbounded Knapsack**: Process left-to-right because you WANT to use the current row — reusing an item is allowed.

### Curated Questions

---

##### Q1: Partition Equal Subset Sum
| Field | Value |
|-------|-------|
| **Platform** | LeetCode |
| **Link** | https://leetcode.com/problems/partition-equal-subset-sum/ |
| **Difficulty** | Medium |
| **Companies** | Google, Amazon, Meta, Microsoft, Apple |
| **Topic** | Dynamic Programming |
| **Pattern** | Knapsack Family |
| **Variation** | 0/1 Subset Sum |
| **Frequency** | ★★★★★ (5/5) |

**Key Observation**: Can we partition the array into two subsets with equal sum? This is equivalent to: does a subset exist with sum = totalSum / 2? If totalSum is odd, immediately return false. This is a classic 0/1 Subset Sum problem.

**Expected Thought Process**:
1. "Partition into two equal subsets → each subset sums to totalSum / 2."
2. "If totalSum is odd, impossible."
3. "Reduce to Subset Sum: does any subset sum to target = totalSum / 2?"
4. "`dp[j]` = true if we can form sum `j` using elements considered so far."
5. "For each element `num`: for j from target down to num: `dp[j] = dp[j] || dp[j - num]`."
6. "Right-to-left because each element is used at most once (0/1 knapsack)."

**Alternative Solutions**:
- 2D DP: `dp[i][j]` = can first `i` elements form sum `j`. O(n × target) time and space.
- Bitset optimization: Use a bitset where bit `j` is set if sum `j` is achievable. Shift by `num` and OR. O(n × target / 64) with bitwise operations.
- Recursive with memoization: Same complexity, easier to understand.

**Time Complexity**: O(n × sum/2)
**Space Complexity**: O(sum/2)

**Common Mistakes**:
- Forgetting to check if totalSum is odd (quick exit).
- Wrong loop direction: must go right-to-left for 0/1 knapsack. Left-to-right allows reusing elements.
- Not initializing `dp[0] = true`.
- Using `int[]` instead of `boolean[]` — works but wastes space.

**Follow-Up Questions**:
- "What if you need to partition into two subsets where the difference is minimized?" → Find the largest achievable sum ≤ totalSum / 2. Answer is totalSum - 2 × that sum.
- "What if you need to partition into k equal subsets?" → LC 698. Different approach: backtracking with bitmask.
- "What if elements can be negative?" → Need to adjust the DP range to handle negative sums.

---

##### Q2: Target Sum
| Field | Value |
|-------|-------|
| **Platform** | LeetCode |
| **Link** | https://leetcode.com/problems/target-sum/ |
| **Difficulty** | Medium |
| **Companies** | Google, Meta, Amazon, Microsoft |
| **Topic** | Dynamic Programming |
| **Pattern** | Knapsack Family |
| **Variation** | 0/1 Knapsack counting via subset sum reduction |
| **Frequency** | ★★★★★ (5/5) |

**Key Observation**: Each number gets a `+` or `-`. If the positive set sums to P and negative set sums to N, then P - N = target and P + N = totalSum. So P = (totalSum + target) / 2. Count the number of subsets that sum to P. This is 0/1 knapsack counting.

**Expected Thought Process**:
1. "Assign + or - to each number to reach target. Brute force is O(2^n)."
2. "Mathematical reduction: if P = sum of '+' numbers, N = sum of '-' numbers."
3. "P - N = target, P + N = S. So P = (S + target) / 2."
4. "If (S + target) is odd or negative, return 0."
5. "Count subsets summing to P. This is 0/1 subset sum counting."
6. "`dp[j]` = number of subsets summing to `j`. For each num: for j from P down to num: `dp[j] += dp[j - num]`."

**Alternative Solutions**:
- DFS/Backtracking: O(2^n). Works for small n but too slow for n > 20.
- 2D DP on (index, running_sum): O(n × totalSum) but requires handling negative indices via offset.
- BFS with memoization: Equivalent to top-down DP.

**Time Complexity**: O(n × P) where P = (totalSum + target) / 2
**Space Complexity**: O(P)

**Common Mistakes**:
- Not handling the edge case where (totalSum + target) is odd → return 0.
- Not handling the edge case where |target| > totalSum → return 0.
- Forgetting that `dp[0] = 1` (empty subset has sum 0).
- Wrong loop direction (must be right-to-left for 0/1).
- Not realizing this reduces to subset sum — trying to directly track running sums is much harder.

**Follow-Up Questions**:
- "What if each number can also be multiplied by 0 (excluded)?" → Different problem, need to adjust.
- "Return one valid assignment." → Track decisions in the DP table.
- "What if numbers can be negative?" → Adjust the offset for the DP array.

---

##### Q3: Coin Change 2 (Number of Combinations)
| Field | Value |
|-------|-------|
| **Platform** | LeetCode |
| **Link** | https://leetcode.com/problems/coin-change-ii/ |
| **Difficulty** | Medium |
| **Companies** | Google, Amazon, Goldman Sachs, Bloomberg |
| **Topic** | Dynamic Programming |
| **Pattern** | Knapsack Family |
| **Variation** | Unbounded knapsack counting (combinations) |
| **Frequency** | ★★★★★ (5/5) |

**Key Observation**: Count the number of **combinations** (not permutations) to make the amount using unlimited coins. `dp[j]` = number of ways to make amount `j`. **Critical**: Loop over coins in the outer loop and amounts in the inner loop to count combinations. Swapping the loops counts permutations.

**Expected Thought Process**:
1. "Count combinations of coins summing to amount. Each coin can be used unlimited times → unbounded knapsack."
2. "Key: combinations, not permutations. {1,2} and {2,1} are the same."
3. "`dp[j]` = number of ways to make amount `j`."
4. "Outer loop: coins. Inner loop: amounts from coin value to target (left-to-right, unbounded)."
5. "`dp[j] += dp[j - coin]` for each coin."
6. "Base: `dp[0] = 1` (one way to make amount 0: use no coins)."

**Alternative Solutions**:
- 2D DP: `dp[i][j]` = ways to make `j` using coins `0..i-1`. More explicit but O(n × amount) space.
- Recursive with memoization: State is (coin_index, remaining_amount).

**Time Complexity**: O(n × amount) where n = number of coin types
**Space Complexity**: O(amount)

**Common Mistakes**:
- **THE classic trap**: Swapping inner/outer loops counts permutations instead of combinations. If amount is outer and coins are inner, you get LC 377 (Combination Sum IV / permutations). If coins are outer and amount is inner, you get this problem (combinations).
- Using right-to-left traversal (0/1 knapsack) when you should use left-to-right (unbounded).
- Confusing with Coin Change 1 (min coins, not count ways).

**Follow-Up Questions**:
- "What if we count permutations instead?" → Swap the loops: amount outer, coins inner. This gives LC 377.
- "What if each coin can be used at most once?" → Right-to-left traversal (0/1 knapsack).
- "What if the result is very large?" → Return mod 10^9+7.

---

##### Q4: 0/1 Knapsack (Classic)
| Field | Value |
|-------|-------|
| **Platform** | Various (not on LeetCode as standalone) |
| **Link** | https://www.geeksforgeeks.org/0-1-knapsack-problem-dp-10/ |
| **Difficulty** | Medium |
| **Companies** | Amazon, Google, Microsoft, Goldman Sachs |
| **Topic** | Dynamic Programming |
| **Pattern** | Knapsack Family |
| **Variation** | Standard 0/1 Knapsack |
| **Frequency** | ★★★★☆ (4/5) |

**Key Observation**: Given items with weights and values, and a capacity W, maximize total value without exceeding W. Each item can be used at most once. `dp[i][w] = max(dp[i-1][w], dp[i-1][w-weight[i]] + value[i])` if `w >= weight[i]`.

**Expected Thought Process**:
1. "Classic 0/1 knapsack. For each item, take or skip."
2. "`dp[i][w]` = max value using items `0..i-1` with capacity `w`."
3. "If `w >= weight[i-1]`: `dp[i][w] = max(dp[i-1][w], dp[i-1][w - weight[i-1]] + value[i-1])`."
4. "Else: `dp[i][w] = dp[i-1][w]` (can't take item i)."
5. "Space optimize: 1D array, iterate w from W down to weight[i-1]."
6. "Answer: `dp[n][W]` or `dp[W]` in 1D."

**Alternative Solutions**:
- Recursive with memoization: Natural formulation, O(n×W) with memoization.
- Branch and bound: For exact solutions with pruning, can be faster in practice for some instances.
- Greedy (WRONG for 0/1 knapsack): Greedy by value/weight ratio works only for fractional knapsack.

**Time Complexity**: O(n × W)
**Space Complexity**: O(W) with 1D optimization

**Common Mistakes**:
- Wrong loop direction in 1D: MUST go right-to-left for 0/1 knapsack.
- Using greedy (sort by value/weight) — only works for fractional knapsack, not 0/1.
- Not handling items with weight > W (should skip them).
- Off-by-one in item indexing (1-indexed items with 0-indexed array).

**Follow-Up Questions**:
- "Fractional knapsack?" → Greedy: sort by value/weight, take fractions. NOT DP.
- "What if items have both weight and volume constraints?" → 3D DP or 2D knapsack.
- "Print the items taken." → Backtrack from `dp[n][W]`: if `dp[i][w] != dp[i-1][w]`, item i was taken.
- "What if W is very large (10^9) but n is small (≤ 40)?" → Meet in the middle: split items into two halves, enumerate all subsets of each half, merge.

---

##### Q5: Subset Sum
| Field | Value |
|-------|-------|
| **Platform** | LeetCode (as part of other problems) |
| **Link** | https://leetcode.com/problems/partition-equal-subset-sum/ |
| **Difficulty** | Medium |
| **Companies** | Google, Amazon, Microsoft |
| **Topic** | Dynamic Programming |
| **Pattern** | Knapsack Family |
| **Variation** | 0/1 Knapsack feasibility |
| **Frequency** | ★★★★★ (5/5) |

**Key Observation**: Subset Sum is 0/1 Knapsack where weight = value and the question is "can we exactly fill capacity target?" `dp[j]` = true if a subset of the considered elements sums to `j`. For each element num: for j from target down to num: `dp[j] = dp[j] || dp[j - num]`.

**Expected Thought Process**:
1. "Can any subset sum to target? This is 0/1 knapsack for feasibility."
2. "`dp[j]` = boolean, true if sum `j` is achievable."
3. "For each num in array: for j from target down to num: `dp[j] |= dp[j - num]`."
4. "Base: `dp[0] = true`."
5. "Answer: `dp[target]`."

**Alternative Solutions**:
- Bitset optimization: `bitset |= (bitset << num)`. O(n × target / 64).
- Recursive with pruning: O(2^n) worst case but with memoization becomes O(n × target).
- Meet in the middle: O(2^(n/2)) — for small n with large target values.

**Time Complexity**: O(n × target)
**Space Complexity**: O(target)

**Common Mistakes**:
- Wrong loop direction: must be right-to-left for 0/1.
- Not initializing `dp[0] = true`.
- Using this approach for counting (need `dp[j] += dp[j - num]` instead of `|=`).

**Follow-Up Questions**:
- "Count the number of subsets with the given sum." → Change boolean to count.
- "Find the subset with sum closest to target." → Find largest `j ≤ target` where `dp[j]` is true.
- "What if elements can be negative?" → Offset the DP array or use a HashMap.

---

##### Q6: Rod Cutting
| Field | Value |
|-------|-------|
| **Platform** | Various (GeeksforGeeks, CSES) |
| **Link** | https://www.geeksforgeeks.org/cutting-a-rod-dp-13/ |
| **Difficulty** | Medium |
| **Companies** | Amazon, Google, Microsoft |
| **Topic** | Dynamic Programming |
| **Pattern** | Knapsack Family |
| **Variation** | Unbounded knapsack maximization |
| **Frequency** | ★★★★☆ (4/5) |

**Key Observation**: A rod of length n can be cut into pieces of lengths 1, 2, ..., n with given prices. Maximize revenue. This is unbounded knapsack: items are rod lengths (1 to n), weights are lengths, values are prices, capacity is n. Each "item" (length) can be used multiple times.

**Expected Thought Process**:
1. "Maximize revenue from cutting a rod. I can use any cut length multiple times → unbounded knapsack."
2. "`dp[j]` = max revenue from a rod of length `j`."
3. "For each possible cut length `i` (1 to n): `dp[j] = max(dp[j], dp[j - i] + price[i])` for j from i to n."
4. "Or equivalently: `dp[j] = max(dp[j - i] + price[i])` for all `i` from 1 to `j`."
5. "Left-to-right traversal since cuts can be reused (unbounded)."

**Alternative Solutions**:
- Recursive with memoization: `solve(n) = max(price[i] + solve(n - i))` for all cuts.
- 2D DP: Treat each cut length as an item, capacity as rod length.

**Time Complexity**: O(n²)
**Space Complexity**: O(n)

**Common Mistakes**:
- Treating it as 0/1 knapsack (right-to-left traversal) — each cut CAN be reused.
- Off-by-one in prices array: `price[i]` is the price for a piece of length `i` (1-indexed).
- Not considering the option of not cutting at all (`dp[n] = price[n]` is a valid option).

**Follow-Up Questions**:
- "What if there's a cost for each cut?" → Subtract cut cost from the recurrence.
- "What if each piece length can be used at most k times?" → Bounded knapsack.
- "Print the cutting plan." → Track which cut was made at each step.

---

##### Q7: Ones and Zeroes
| Field | Value |
|-------|-------|
| **Platform** | LeetCode |
| **Link** | https://leetcode.com/problems/ones-and-zeroes/ |
| **Difficulty** | Medium |
| **Companies** | Google, Amazon |
| **Topic** | Dynamic Programming |
| **Pattern** | Knapsack Family |
| **Variation** | Multi-dimensional 0/1 Knapsack |
| **Frequency** | ★★★☆☆ (3/5) |

**Key Observation**: Each string is an "item" with two weights: count of 0s and count of 1s. You have two capacities: `m` (max 0s) and `n` (max 1s). Maximize the number of strings you can select. This is 0/1 knapsack with two capacity dimensions.

**Expected Thought Process**:
1. "Select max strings with at most m zeros and n ones. Each string has a '0-weight' and a '1-weight'."
2. "This is 2D 0/1 knapsack. `dp[i][j]` = max strings with i zeros and j ones."
3. "For each string s with z zeros and o ones: for i from m down to z, for j from n down to o: `dp[i][j] = max(dp[i][j], dp[i-z][j-o] + 1)`."
4. "Right-to-left in both dimensions because it's 0/1 (each string used at most once)."

**Alternative Solutions**:
- 3D DP: `dp[k][i][j]` with k = string index. Same logic but O(k × m × n) space.
- Recursive with memoization: State is (string_index, remaining_zeros, remaining_ones).

**Time Complexity**: O(k × m × n) where k = number of strings
**Space Complexity**: O(m × n)

**Common Mistakes**:
- Forgetting to iterate both dimensions right-to-left (0/1 knapsack).
- Not precomputing the zero/one counts for each string.
- Confusing this with a graph/subset problem instead of recognizing the knapsack structure.

**Follow-Up Questions**:
- "What if each string can be used unlimited times?" → Left-to-right in both dimensions (unbounded).
- "What if you also want to minimize total string length?" → Add another dimension.

---

##### Q8: Last Stone Weight II
| Field | Value |
|-------|-------|
| **Platform** | LeetCode |
| **Link** | https://leetcode.com/problems/last-stone-weight-ii/ |
| **Difficulty** | Medium |
| **Companies** | Google, Amazon |
| **Topic** | Dynamic Programming |
| **Pattern** | Knapsack Family |
| **Variation** | Minimum subset difference via Subset Sum |
| **Frequency** | ★★★★☆ (4/5) |

**Key Observation**: Smashing stones is equivalent to assigning `+` or `-` to each stone and minimizing the absolute result. This is the "Minimum Subset Difference" problem: partition stones into two groups and minimize |sum1 - sum2|. Find the largest subset sum ≤ totalSum / 2, then answer is totalSum - 2 × that sum.

**Expected Thought Process**:
1. "Smashing stones... each stone gets `+` or `-`. Minimize the final result."
2. "This is Minimum Subset Difference! Partition into two groups, minimize |sum1 - sum2|."
3. "Find the largest achievable sum ≤ totalSum / 2 using subset sum DP."
4. "`dp[j]` = true if sum `j` is achievable. For each stone, right-to-left update."
5. "Answer: totalSum - 2 × (largest j where dp[j] is true and j ≤ totalSum / 2)."

**Alternative Solutions**:
- Recursive with memoization: Same approach, different implementation.
- Bitset optimization: Faster constant factor.

**Time Complexity**: O(n × sum/2)
**Space Complexity**: O(sum/2)

**Common Mistakes**:
- Not seeing this as a knapsack problem. The "smashing stones" description is very misleading.
- Trying to simulate the process greedily (smash largest stones first) — this is WRONG.
- Returning the wrong value: answer is `totalSum - 2 * maxAchievable`, not `maxAchievable`.

**Follow-Up Questions**:
- "What if stones have infinite durability (can be smashed multiple times)?" → Different problem, similar to Coin Change.
- "What if you must smash stones in a specific order?" → Interval DP might be needed.

---

### Mastery Framework

| Level | Description | Checkpoint |
|-------|-------------|------------|
| L0 | Cannot identify knapsack problems | Tries greedy on Partition Equal Subset Sum |
| L1 | Recognizes explicit knapsack but can't handle disguised variants | Solves 0/1 knapsack but fails Target Sum |
| L2 | Handles subset sum and partition variants | Solves Partition Equal Subset Sum with correct loop direction |
| L3 | Distinguishes 0/1 from unbounded, correct loop direction | Solves both Coin Change 2 and Target Sum correctly |
| L4 | Handles multi-dimensional knapsack and clever reductions | Solves Ones and Zeroes and Last Stone Weight II |
| L5 | Instantly maps novel problems to knapsack variants | Sees "Last Stone Weight II = Min Subset Difference = Subset Sum" chain in under 1 minute |

### Interview Communication Example

**Problem: Target Sum**

> "I need to assign + or - to each number to reach the target. Let me think about the structure...
>
> If I split the numbers into a positive set P and negative set N, then P - N = target and P + N = totalSum. Solving these: P = (totalSum + target) / 2.
>
> So I need to count the number of subsets that sum to P. Quick check: if (totalSum + target) is odd, there's no solution.
>
> This is a 0/1 subset sum counting problem. I'll use a 1D DP:
> - `dp[j]` = number of subsets summing to `j`
> - Base: `dp[0] = 1`
> - For each number `num`: for j from P down to num: `dp[j] += dp[j - num]`
>
> Right-to-left because each number can be used at most once.
>
> Time: O(n × P), Space: O(P). Let me code this up...
>
> Edge case: if totalSum < |target|, return 0. If (totalSum + target) is negative, return 0."

### Company-Specific Expectations

**Google**: Expects you to see through the disguise. "Last Stone Weight II" should be mapped to subset sum within 2 minutes. They love the Target Sum → subset sum reduction and will probe your understanding of why it works. May ask multi-dimensional knapsack variants.

**Meta**: Asks Partition Equal Subset Sum and Coin Change 2. Speed is critical — solve in 10-12 minutes. They want to see you correctly identify 0/1 vs unbounded and use the right loop direction without hesitation.

**Amazon**: Asks standard knapsack problems with emphasis on communication. They want you to walk through the 0/1 knapsack framework explicitly, even if it's a simple subset sum. Rod Cutting is a favorite.

**Microsoft**: Asks standard subset sum and coin change variants. Focuses on clean implementation and ability to trace through small examples.

**Goldman Sachs**: Asks knapsack-related problems in the context of optimization (portfolio selection, budget allocation). Expects you to recognize the knapsack structure in financial problem descriptions.

---

## Cross-Pattern Connections

Understanding how these four patterns relate to each other is what separates L4 from L5 candidates:

| Connection | Explanation |
|-----------|-------------|
| 1D DP → 2D Grid DP | Grid DP is 1D DP extended to 2D. The transition structure is similar. |
| 1D DP → String DP | String DP over one string (palindromes, decode ways) is essentially 1D DP. Two-string DP is like grid DP where axes are the strings. |
| 1D DP → Knapsack | Coin Change is both 1D DP and unbounded knapsack. The DP state is the remaining amount. |
| Grid DP → String DP | Edit Distance IS grid DP where rows are characters of s1, columns are characters of s2. |
| Knapsack → String DP | Distinct Subsequences has a knapsack-like "choose this match or skip it" structure. |
| Grid DP ↔ Knapsack | 2D knapsack looks like grid DP but the axes are capacity dimensions, not spatial coordinates. |

**The ultimate insight**: All four patterns are instances of the same meta-pattern: **define states, define transitions between states, fill the DP table in dependency order.** The only difference is the shape of the state space (1D line, 2D grid, 2D string pair, 2D item-capacity) and the transition function.

---

## Study Plan

### Week 1: Foundation (Patterns 20.1 + 20.4 basics)
| Day | Focus | Problems |
|-----|-------|----------|
| 1 | 1D DP fundamentals | Climbing Stairs, Min Cost Climbing Stairs, House Robber |
| 2 | 1D DP variations | House Robber II, Decode Ways, Maximum Subarray |
| 3 | 1D DP advanced | Word Break, LIS (both O(n²) and O(n log n)) |
| 4 | 0/1 Knapsack intro | Classic knapsack, Partition Equal Subset Sum |
| 5 | 0/1 Knapsack counting | Target Sum, Subset Sum counting |
| 6 | Unbounded Knapsack | Coin Change, Coin Change 2, Rod Cutting |
| 7 | Review + mixed practice | Re-solve any problems that took > 15 min |

### Week 2: Intermediate (Patterns 20.2 + 20.3)
| Day | Focus | Problems |
|-----|-------|----------|
| 1 | Grid DP basics | Unique Paths, Unique Paths II, Minimum Path Sum |
| 2 | Grid DP advanced | Dungeon Game, Triangle, Maximal Square |
| 3 | String DP basics | LCS, Edit Distance |
| 4 | String DP palindromes | Longest Palindromic Subsequence, Longest Palindromic Substring |
| 5 | String DP hard | Regular Expression Matching, Wildcard Matching |
| 6 | String DP mixed | Distinct Subsequences, Interleaving String |
| 7 | Cross-pattern practice | Mixed problems from all 4 patterns, timed |

### Week 3: Mastery
| Day | Focus | Problems |
|-----|-------|----------|
| 1-2 | Hard knapsack | Last Stone Weight II, Ones and Zeroes, multi-dim knapsack |
| 3-4 | Hard grid | Cherry Pickup, Cherry Pickup II |
| 5-6 | Timed practice | Full interview simulations: 45 min, 2 problems, no hints |
| 7 | Review | Focus on problems where you made mistakes |

---

*This file covers Patterns 20.1-20.4. See the next file for Patterns 20.5-20.8 (Interval DP, Tree DP, State Machine DP, Bitmask DP).*
