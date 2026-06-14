# Topic 15: Greedy — Complete Coverage

> **Priority**: #2 (Critical) | **Risk**: 7/10 | **Interview Frequency**: ★★★★★
>
> Greedy is the most deceptive topic in DSA interviews. It looks easy — just make the locally optimal choice.
> But knowing *when* greedy works and *proving* it works is what separates strong hires from rejects.
> Candidates with LC 1662 often underestimate Greedy because they've memorized solutions without understanding the proof structure.

---

## Greedy Overview

### What Greedy Really Is

Greedy is NOT "pick the best option at each step." That's the implementation. Greedy is a **proof strategy**: you argue that making the locally optimal choice at each step leads to a globally optimal solution. Without the proof, you're just guessing.

The two pillars of a valid greedy approach:

1. **Greedy Choice Property**: There exists an optimal solution that includes the greedy choice. You don't need to try all options — the locally best one is always safe to include.

2. **Optimal Substructure**: After making the greedy choice, the remaining problem is a smaller instance of the same problem, and its optimal solution combined with the greedy choice gives the overall optimum.

### The 3 Greedy Proof Techniques

**1. Exchange Argument (Most Important)**
- Assume an optimal solution that does NOT make the greedy choice.
- Show you can "exchange" the non-greedy choice for the greedy choice without worsening the solution.
- Therefore, an optimal solution making the greedy choice exists.
- *Example*: Activity Selection — if the optimal solution doesn't include the earliest-finishing activity, swap it in without conflict.

**2. Greedy Stays Ahead**
- Show that at every step, the greedy solution is at least as good as any other solution.
- By induction, greedy remains optimal at every step and therefore at the end.
- *Example*: Fractional Knapsack — sorting by value/weight ratio, greedy fills capacity optimally at each step.

**3. Structural Argument**
- Show that the problem has a matroid structure or other combinatorial property that guarantees greedy optimality.
- *Example*: Minimum Spanning Tree — Kruskal's/Prim's works because spanning trees form a matroid.

### Greedy vs DP: The Critical Distinction

| Aspect | Greedy | DP |
|--------|--------|-----|
| **Decision** | Make one choice, never reconsider | Try all choices, pick the best |
| **Proof** | Must prove greedy choice is safe | Optimal substructure + overlapping subproblems |
| **When Greedy Fails** | Local optimum ≠ global optimum | Use DP instead |
| **Quick Test** | Can you find a counterexample? | Does greedy fail on any input? |
| **Speed** | Usually O(n log n) | Usually O(n²) or O(n × capacity) |

**The interview golden rule**: If you claim greedy works, be ready to explain WHY. "It seems right" is not a proof. Interviewers at Google and Uber specifically probe whether you can justify greedy or find counterexamples.

### How to Identify Greedy Problems in Interviews

**Strong greedy signals**:
- "Minimum number of X to cover Y" (interval scheduling, jump game)
- "Maximum number of non-overlapping X" (activity selection)
- Sorting the input reveals an obvious strategy
- The problem has an exchange argument (swapping choices doesn't hurt)
- Making decisions left-to-right with a clear ordering criterion

**Greedy red flags** (likely needs DP):
- "Count the number of ways" → almost never greedy
- "Find the optimal subset" with complex constraints → likely knapsack/DP
- No natural sorting criterion
- Counterexample exists for any simple greedy strategy

---

## Pattern 15.1: Interval Greedy

### Pattern Description

Interval Greedy deals with problems involving intervals (ranges with start and end points) where you need to select, schedule, or process intervals optimally. The key technique is **sorting intervals by a specific criterion** (usually end time) and then making greedy choices.

This is the canonical greedy pattern — Activity Selection is the textbook example of the greedy algorithm. The core insight is that by processing intervals in a smart order, the locally best choice at each step is also globally optimal.

### Core Invariant

**Sort intervals by end time (or start time, depending on the problem). Process them in order, and at each step, include the interval if it's compatible with previous selections.** The earliest-ending interval that's compatible always leads to an optimal solution (proven by exchange argument).

### Recognition Signals

- The input is a set of intervals [start, end].
- You need to select the maximum number of non-overlapping intervals.
- You need the minimum number of intervals to cover a range.
- You need to remove the minimum number of intervals to eliminate overlaps.
- Keywords: "meetings", "activities", "schedule", "non-overlapping", "minimum arrows/points".

### Common Traps

- **Wrong sorting criterion**: Sort by end time for "maximum non-overlapping" problems. Sort by start time for merging. Confusing these leads to wrong answers.
- **Not handling ties correctly**: When two intervals have the same end time, the sorting of ties can matter in some problems.
- **Confusing "minimum removals" with "maximum selections"**: Non-overlapping Intervals asks for minimum removals = n - maximum non-overlapping selections.
- **Off-by-one on touching intervals**: Are `[1,2]` and `[2,3]` overlapping? Depends on the problem — "meeting rooms" usually yes, "arrows" usually no.

### Complexity Intuition

- **Time**: O(n log n) dominated by sorting. The greedy selection pass is O(n).
- **Space**: O(1) extra space (or O(n) if you can't sort in place).
- **Why**: Sorting brings structure, and the greedy pass makes one decision per interval.

### Hidden Variations

1. **Weighted intervals**: Each interval has a value, and you maximize total value. This is NOT solvable by pure greedy — use DP (Weighted Job Scheduling).
2. **Minimum points to hit all intervals**: Place minimum dots on a number line so each interval contains at least one dot. Greedy by end time.
3. **Interval partitioning**: Minimum number of resources (rooms) to schedule all intervals. Use a min-heap (not pure greedy, but greedy + heap).
4. **Circular intervals**: Intervals wrap around. Process by doubling the range.

### Follow-Up Variations

- **"What if intervals have weights?"** → DP (Weighted Job Scheduling with binary search).
- **"Minimum rooms needed?"** → Meeting Rooms II (sweep line or min-heap).
- **"What if you can attend partial meetings?"** → Different problem entirely; fractional coverage.

### Interview Frequency

| Company | Frequency | Typical Difficulty |
|---------|-----------|-------------------|
| Google | ★★★★☆ | Medium |
| Meta | ★★★★★ | Medium (speed) |
| Amazon | ★★★★★ | Medium |
| Microsoft | ★★★★☆ | Medium |
| Uber | ★★★★☆ | Medium |
| Bloomberg | ★★★★☆ | Medium |

### How Interviewers Expect You to Identify It

1. **Within 1 minute**: "This is an interval scheduling problem. I should sort by end time."
2. **Within 3 minutes**: State the greedy strategy and sketch why it works (exchange argument).
3. **Within 10 minutes**: Clean code with correct sorting and selection logic.

### Why Candidates Fail

1. **Wrong sorting criterion**: Sorting by start time when end time is needed (or vice versa).
2. **Can't justify WHY greedy works**: "It seems right" is insufficient. Must articulate the exchange argument.
3. **Not recognizing interval structure**: Some problems are interval problems in disguise (e.g., Minimum Number of Arrows = maximum non-overlapping intervals variant).

### How Elite Candidates Think

They classify the problem instantly:
- **"Max non-overlapping"** → Sort by end time, greedily select compatible intervals.
- **"Min removals to make non-overlapping"** → n - max non-overlapping.
- **"Min points/arrows to cover all"** → Sort by end time, place point at each end when needed.
- **"Min resources for all intervals"** → Sweep line or min-heap.

### Curated Questions

---

##### Q1: Non-overlapping Intervals
| Field | Value |
|-------|-------|
| **Platform** | LeetCode |
| **Link** | https://leetcode.com/problems/non-overlapping-intervals/ |
| **Difficulty** | Medium |
| **Companies** | Google, Meta, Amazon, Microsoft |
| **Topic** | Greedy |
| **Pattern** | Interval Greedy |
| **Variation** | Maximum non-overlapping (inverted) |
| **Frequency** | ★★★★★ (5/5) |

**Key Observation**: Minimum intervals to remove = n - maximum non-overlapping intervals. Sort by end time. Greedily keep intervals that don't overlap with the previously kept one.

**Expected Thought Process**:
1. "Minimum removals to eliminate all overlaps. This is the complement of maximum non-overlapping."
2. "Sort by end time. Keep intervals with start ≥ previous end."
3. "Count kept intervals. Answer = n - kept."

**Alternative Solutions**:
- Sort by start time and remove the interval with larger end when overlap detected. Same result, slightly different logic.

**Time Complexity**: O(n log n)
**Space Complexity**: O(1)

**Common Mistakes**:
- Sorting by start time without adjusting the selection logic.
- Not handling the "minimum removals = n - max kept" transformation.
- Off-by-one: `[1,2]` and `[2,3]` are NOT overlapping (start ≥ prev_end is non-overlapping).

**Follow-Up Questions**:
- "What if intervals have weights?" → Weighted Job Scheduling (DP + binary search).
- "What if you can remove at most k intervals?" → Different problem structure.

---

##### Q2: Minimum Number of Arrows to Burst Balloons
| Field | Value |
|-------|-------|
| **Platform** | LeetCode |
| **Link** | https://leetcode.com/problems/minimum-number-of-arrows-to-burst-balloons/ |
| **Difficulty** | Medium |
| **Companies** | Google, Meta, Amazon |
| **Topic** | Greedy |
| **Pattern** | Interval Greedy |
| **Variation** | Minimum hitting set |
| **Frequency** | ★★★★★ (5/5) |

**Key Observation**: Sort balloons by end coordinate. Shoot arrow at each balloon's end if the current arrow doesn't cover it. This is equivalent to finding maximum non-overlapping intervals (touching intervals count as overlapping here).

**Expected Thought Process**:
1. "Each arrow pops all balloons it passes through. Minimize arrows."
2. "Sort by x_end. Shoot at x_end of current group."
3. "If next balloon starts after current arrow position, need a new arrow."

**Time Complexity**: O(n log n)
**Space Complexity**: O(1)

**Common Mistakes**:
- Sorting by start instead of end.
- Not handling the case where balloons touch at a single point (touching = overlapping here).

---

##### Q3: Meeting Rooms II (Minimum Rooms)
| Field | Value |
|-------|-------|
| **Platform** | LeetCode |
| **Link** | https://leetcode.com/problems/meeting-rooms-ii/ |
| **Difficulty** | Medium |
| **Companies** | Google, Meta, Amazon, Microsoft, Bloomberg |
| **Topic** | Greedy |
| **Pattern** | Interval Greedy |
| **Variation** | Interval partitioning (min resources) |
| **Frequency** | ★★★★★ (5/5) |

**Key Observation**: This is NOT "maximum non-overlapping." It's "minimum rooms for ALL meetings." Two approaches: (1) Min-heap of end times — sort by start, push end times, pop when meeting starts after earliest end. (2) Sweep line — separate start/end events, sort, track concurrent meetings.

**Expected Thought Process**:
1. "All meetings must happen. Need minimum rooms = maximum concurrent meetings."
2. "Sweep line: events = all starts (+1) and ends (-1). Sort. Track running count. Max count = answer."
3. "Alternative: sort by start, min-heap of end times. If earliest end ≤ current start, reuse room."

**Alternative Solutions**:
- Min-heap: O(n log n). More intuitive for many candidates.
- Sweep line: O(n log n). More elegant, easier to prove correct.
- Chronological ordering: Separate starts and ends into two arrays, use two pointers.

**Time Complexity**: O(n log n)
**Space Complexity**: O(n)

**Common Mistakes**:
- Confusing this with "maximum non-overlapping" (that's Meeting Rooms I — just check if ANY overlap).
- In sweep line: not handling ties correctly (end before start when at same time, so room is freed before new meeting uses it).
- Using a regular sort instead of min-heap, leading to O(n²).

**Follow-Up Questions**:
- "What if meetings have priorities?" → More complex scheduling.
- "What if rooms have different capacities?" → Assignment problem.

---

##### Q4: Merge Intervals
| Field | Value |
|-------|-------|
| **Platform** | LeetCode |
| **Link** | https://leetcode.com/problems/merge-intervals/ |
| **Difficulty** | Medium |
| **Companies** | ALL companies |
| **Topic** | Greedy |
| **Pattern** | Interval Greedy |
| **Variation** | Interval merging |
| **Frequency** | ★★★★★ (5/5) |

**Key Observation**: Sort by start time. Iterate and merge overlapping intervals: if current interval's start ≤ previous end, extend previous end to max(prev_end, curr_end). Otherwise, start a new merged interval.

**Expected Thought Process**:
1. "Sort by start. Walk through, merging overlapping intervals."
2. "Two intervals overlap if curr.start ≤ prev.end."
3. "When merging, take max of both ends."

**Time Complexity**: O(n log n)
**Space Complexity**: O(n) for result

**Common Mistakes**:
- Using `curr.start < prev.end` instead of `<=` (touching intervals should merge).
- Forgetting to update the end to `max(prev.end, curr.end)` — just using `curr.end` misses cases where current interval is fully inside previous.

---

##### Q5: Insert Interval
| Field | Value |
|-------|-------|
| **Platform** | LeetCode |
| **Link** | https://leetcode.com/problems/insert-interval/ |
| **Difficulty** | Medium |
| **Companies** | Google, Meta, Amazon, LinkedIn |
| **Topic** | Greedy |
| **Pattern** | Interval Greedy |
| **Variation** | Insert + merge in sorted intervals |
| **Frequency** | ★★★★☆ (4/5) |

**Key Observation**: Three phases: (1) Add all intervals ending before the new interval starts. (2) Merge all overlapping intervals with the new one. (3) Add all remaining intervals. The key merge condition: `existing.start ≤ newInterval.end`.

**Time Complexity**: O(n)
**Space Complexity**: O(n)

**Common Mistakes**:
- Not merging when the new interval fully contains existing intervals.
- Wrong boundary conditions for overlap detection.

---

##### Q6: Activity Selection (Classic)
| Field | Value |
|-------|-------|
| **Platform** | GeeksforGeeks / Textbook |
| **Link** | https://www.geeksforgeeks.org/activity-selection-problem-greedy-algo-1/ |
| **Difficulty** | Easy-Medium |
| **Companies** | Amazon, Microsoft, Cisco |
| **Topic** | Greedy |
| **Pattern** | Interval Greedy |
| **Variation** | Maximum non-overlapping activities |
| **Frequency** | ★★★★☆ (4/5) |

**Key Observation**: Sort by finish time. Select the first activity. For each subsequent activity, select it if its start time ≥ the finish time of the last selected activity.

**Time Complexity**: O(n log n)
**Space Complexity**: O(1)

---

### Mastery Framework

| Level | Description | Checkpoint |
|-------|-------------|------------|
| L0 | Can't identify interval problems | Tries brute force enumeration of all subsets |
| L1 | Knows to sort but picks wrong criterion | Sorts by start time for max non-overlapping |
| L2 | Correct greedy with minor boundary bugs | Solves Non-overlapping Intervals, Merge Intervals |
| L3 | Clean solution, handles all edge cases | Solves Meeting Rooms II with heap or sweep line |
| L4 | Can articulate the exchange argument proof | Explains WHY sorting by end time is optimal |
| L5 | Recognizes interval structure in disguised problems | Sees "arrows to burst balloons" as interval greedy immediately |

### Company-Specific Expectations

**Google**: Expects you to articulate the greedy proof (exchange argument). Will ask "why does sorting by end time work?" and expect a clear answer. May follow up with weighted interval scheduling (DP).

**Meta**: Speed problem. Merge Intervals or Meeting Rooms II in under 10 minutes. Clean code, no bugs.

**Amazon**: Merge Intervals is extremely common. Expects clear communication about the approach.

---

## Pattern 15.2: Sorting + Greedy

### Pattern Description

Many greedy problems become solvable once you sort the input by the right criterion. The pattern is: (1) sort by some property, (2) process elements in sorted order making greedy choices. The challenge is identifying WHAT to sort by.

This pattern covers problems where the greedy strategy requires a specific ordering that isn't intervals. Examples include assigning cookies to children, loading boats, partitioning labels.

### Core Invariant

**After sorting, process elements in order and make the locally optimal assignment/selection at each step. The sorting ensures that the greedy choice at each step is globally safe.**

### Recognition Signals

- The problem involves matching/assigning elements from two sets.
- A "fit" or "satisfy" condition exists (cookie size ≥ child's greed).
- The problem asks for minimum/maximum count of something.
- Sorting reveals a natural processing order.
- The problem has a "two-pointer after sort" flavor.

### Common Traps

- **Wrong sorting criterion**: Sorting by the wrong property leads to suboptimal solutions.
- **Greedy without proof**: Just because sorting + greedy seems right doesn't mean it IS right. Always verify with a counterexample search.
- **Not considering both sets**: In matching problems, you might need to sort both sets.

### Curated Questions

---

##### Q1: Assign Cookies
| Field | Value |
|-------|-------|
| **Platform** | LeetCode |
| **Link** | https://leetcode.com/problems/assign-cookies/ |
| **Difficulty** | Easy |
| **Companies** | Amazon, Google |
| **Topic** | Greedy |
| **Pattern** | Sorting + Greedy |
| **Variation** | Two-set matching |
| **Frequency** | ★★★★☆ (4/5) |

**Key Observation**: Sort both children's greed factors and cookie sizes. Use two pointers: try to satisfy the least greedy child first with the smallest sufficient cookie.

**Expected Thought Process**:
1. "Match cookies to children. Maximize satisfied children."
2. "Sort both arrays. Try smallest cookie for least greedy child."
3. "Two pointers: if cookie ≥ greed, satisfy and advance both. Else advance cookie pointer."

**Time Complexity**: O(n log n + m log m)
**Space Complexity**: O(1)

---

##### Q2: Boats to Save People
| Field | Value |
|-------|-------|
| **Platform** | LeetCode |
| **Link** | https://leetcode.com/problems/boats-to-save-people/ |
| **Difficulty** | Medium |
| **Companies** | Google, Amazon, Microsoft |
| **Topic** | Greedy |
| **Pattern** | Sorting + Greedy |
| **Variation** | Two-pointer pairing |
| **Frequency** | ★★★★☆ (4/5) |

**Key Observation**: Sort by weight. Try to pair heaviest person with lightest person. If they fit in a boat together (sum ≤ limit), pair them. Otherwise, heaviest person takes a boat alone. Two pointers from both ends.

**Expected Thought Process**:
1. "Each boat holds at most 2 people, weight ≤ limit."
2. "Sort by weight. Pair heaviest with lightest if possible."
3. "Two pointers: left (lightest), right (heaviest). If sum ≤ limit, both go. Else right goes alone."
4. "Each iteration uses one boat."

**Time Complexity**: O(n log n)
**Space Complexity**: O(1)

**Common Mistakes**:
- Forgetting the "at most 2 people" constraint (trying to fit 3+).
- Not advancing the right pointer when the heavy person goes alone.

**Follow-Up Questions**:
- "What if boats can hold up to 3 people?" → More complex; greedy still works but needs careful pairing.
- "What if you want to minimize total weight carried?" → Different objective, different approach.

---

##### Q3: Partition Labels
| Field | Value |
|-------|-------|
| **Platform** | LeetCode |
| **Link** | https://leetcode.com/problems/partition-labels/ |
| **Difficulty** | Medium |
| **Companies** | Google, Amazon, Meta |
| **Topic** | Greedy |
| **Pattern** | Sorting + Greedy |
| **Variation** | Interval merging on character ranges |
| **Frequency** | ★★★★★ (5/5) |

**Key Observation**: For each character, find its last occurrence. Walk through the string tracking the farthest last-occurrence seen so far. When current index equals the farthest last-occurrence, we've found a partition boundary.

**Expected Thought Process**:
1. "Each letter appears in at most one partition. Maximize number of partitions."
2. "Pre-compute last occurrence of each character."
3. "Walk left to right. Track `end = max(end, lastOccurrence[char])`. When `i == end`, cut partition."
4. "This is equivalent to merging 'character intervals' [first, last] for each character."

**Alternative Solutions**:
- Create intervals [firstOccurrence, lastOccurrence] for each character, then merge intervals. Same result.

**Time Complexity**: O(n)
**Space Complexity**: O(1) (26 characters)

**Common Mistakes**:
- Not pre-computing last occurrences (trying to look ahead during traversal).
- Off-by-one on partition boundaries.

**Follow-Up Questions**:
- "What if you want to minimize the number of partitions?" → The whole string is one partition (trivial).
- "What if partitions must have equal length?" → Different problem, possibly NP-hard.

---

##### Q4: Largest Number
| Field | Value |
|-------|-------|
| **Platform** | LeetCode |
| **Link** | https://leetcode.com/problems/largest-number/ |
| **Difficulty** | Medium |
| **Companies** | Google, Amazon, Microsoft |
| **Topic** | Greedy |
| **Pattern** | Sorting + Greedy |
| **Variation** | Custom comparator |
| **Frequency** | ★★★★☆ (4/5) |

**Key Observation**: Define custom comparator: for strings a and b, compare `a+b` vs `b+a`. If `a+b > b+a`, then a should come first. Sort using this comparator and concatenate.

**Expected Thought Process**:
1. "Arrange numbers to form the largest number."
2. "Convert to strings. Custom sort: a before b if a+b > b+a."
3. "Edge case: all zeros → return '0', not '000'."

**Time Complexity**: O(n log n × k) where k = average digit count
**Space Complexity**: O(n)

**Common Mistakes**:
- Using numerical comparison instead of string concatenation comparison.
- Not handling the all-zeros edge case.
- Not proving the comparator is transitive (it is — `a+b > b+a` defines a total order).

---

##### Q5: Queue Reconstruction by Height
| Field | Value |
|-------|-------|
| **Platform** | LeetCode |
| **Link** | https://leetcode.com/problems/queue-reconstruction-by-height/ |
| **Difficulty** | Medium |
| **Companies** | Google, Amazon, Microsoft |
| **Topic** | Greedy |
| **Pattern** | Sorting + Greedy |
| **Variation** | Multi-criteria sort + insertion |
| **Frequency** | ★★★★☆ (4/5) |

**Key Observation**: Sort by height descending, then by k ascending. Insert each person at index k in the result list. Taller people inserted first don't care about shorter people inserted later.

**Expected Thought Process**:
1. "Each person [h, k] has height h and k people in front with height ≥ h."
2. "Process tallest first. Insert at position k."
3. "When inserting a shorter person later, they don't affect the k values of already-placed taller people."

**Time Complexity**: O(n²) due to insertions (O(n log n) sort + O(n) insertions each taking O(n))
**Space Complexity**: O(n)

**Common Mistakes**:
- Sorting in the wrong order (ascending height doesn't work).
- Using an array instead of a list (insertions are expensive in arrays).

---

### Mastery Framework

| Level | Description | Checkpoint |
|-------|-------------|------------|
| L0 | Can't determine what to sort by | Tries random orderings |
| L1 | Sorts correctly but greedy logic is wrong | Sorts cookies but assigns incorrectly |
| L2 | Correct sort + greedy for standard problems | Solves Assign Cookies, Boats |
| L3 | Handles multi-criteria sorting | Solves Queue Reconstruction, Partition Labels |
| L4 | Designs custom comparators with proof | Solves Largest Number, explains transitivity |
| L5 | Identifies the sorting criterion for novel problems | Spots "sort + greedy" in disguised problems instantly |

---

## Pattern 15.3: Jump / Reach Greedy

### Pattern Description

Jump Greedy problems involve traversing a sequence where at each position you can "jump" forward by some amount, and you need to determine reachability or minimize jumps. The greedy insight is to always track the farthest reachable position, updating it as you traverse.

### Core Invariant

**Maintain the farthest position reachable from any position seen so far. If you can reach position i, you can reach any position up to i + jump[i]. Track the maximum reach at every step.**

### Recognition Signals

- Array of jump lengths / ranges at each position.
- "Can you reach the end?" or "Minimum jumps to reach the end."
- Linear traversal with forward-only movement.
- Keywords: "jump", "reach", "steps", "farthest".

### Common Traps

- **Confusing Jump Game I (reachability) with Jump Game II (min jumps)**: Different greedy strategies.
- **Not updating reach correctly**: Must update reach from ALL positions, not just the current position.
- **BFS when greedy suffices**: Jump Game II can be solved greedily (BFS "level" approach), no need for explicit queue.

### Curated Questions

---

##### Q1: Jump Game
| Field | Value |
|-------|-------|
| **Platform** | LeetCode |
| **Link** | https://leetcode.com/problems/jump-game/ |
| **Difficulty** | Medium |
| **Companies** | Google, Amazon, Meta, Microsoft |
| **Topic** | Greedy |
| **Pattern** | Jump / Reach Greedy |
| **Variation** | Reachability check |
| **Frequency** | ★★★★★ (5/5) |

**Key Observation**: Track `maxReach = max(maxReach, i + nums[i])` for each `i` where `i ≤ maxReach`. If `maxReach ≥ n-1`, return true. If at any point `i > maxReach`, you're stuck.

**Expected Thought Process**:
1. "Can I reach the last index? Track farthest reachable position."
2. "For each i from 0 to n-1: if i > maxReach, return false. Else update maxReach = max(maxReach, i + nums[i])."
3. "Return maxReach ≥ n-1."

**Time Complexity**: O(n)
**Space Complexity**: O(1)

**Common Mistakes**:
- Using DP when O(n) greedy exists.
- Not checking `i ≤ maxReach` before processing position `i`.
- Starting maxReach at 0 but not handling `nums[0] = 0` edge case.

**Follow-Up Questions**:
- "Minimum number of jumps?" → Jump Game II.
- "What if you can jump backward too?" → BFS, not greedy.

---

##### Q2: Jump Game II
| Field | Value |
|-------|-------|
| **Platform** | LeetCode |
| **Link** | https://leetcode.com/problems/jump-game-ii/ |
| **Difficulty** | Medium |
| **Companies** | Google, Amazon, Meta, Microsoft, Uber |
| **Topic** | Greedy |
| **Pattern** | Jump / Reach Greedy |
| **Variation** | Minimum jumps (BFS-like greedy) |
| **Frequency** | ★★★★★ (5/5) |

**Key Observation**: Think of it as BFS levels. Each "level" is the range of positions reachable with the current number of jumps. Track `currentEnd` (end of current level) and `farthest` (farthest reachable from current level). When you reach `currentEnd`, increment jumps and set `currentEnd = farthest`.

**Expected Thought Process**:
1. "Minimum jumps to reach end. This is like BFS on the array."
2. "Maintain current jump range [start, currentEnd] and track farthest reachable."
3. "When I pass currentEnd, I must make another jump. Set currentEnd = farthest, jumps++."
4. "Stop when currentEnd ≥ n-1."

**Alternative Solutions**:
- DP: `dp[i]` = min jumps to reach `i`. O(n²). Too slow for large n.
- Explicit BFS: Same as greedy but with a queue. Unnecessary overhead.

**Time Complexity**: O(n)
**Space Complexity**: O(1)

**Common Mistakes**:
- Off-by-one: don't increment jumps when already at the last index.
- Using O(n²) DP instead of O(n) greedy.
- Not understanding the "BFS level" analogy.

---

##### Q3: Video Stitching
| Field | Value |
|-------|-------|
| **Platform** | LeetCode |
| **Link** | https://leetcode.com/problems/video-stitching/ |
| **Difficulty** | Medium |
| **Companies** | Google, Amazon |
| **Topic** | Greedy |
| **Pattern** | Jump / Reach Greedy |
| **Variation** | Interval coverage as jump game |
| **Frequency** | ★★★★☆ (4/5) |

**Key Observation**: Convert to a jump game: for each starting time `s`, track the farthest end time reachable. Then apply Jump Game II logic to find minimum clips needed to cover `[0, T]`.

**Time Complexity**: O(n log n) or O(n + T)
**Space Complexity**: O(T)

---

##### Q4: Minimum Number of Taps to Open
| Field | Value |
|-------|-------|
| **Platform** | LeetCode |
| **Link** | https://leetcode.com/problems/minimum-number-of-taps-to-open-to-water-a-garden/ |
| **Difficulty** | Hard |
| **Companies** | Google |
| **Topic** | Greedy |
| **Pattern** | Jump / Reach Greedy |
| **Variation** | Range coverage as jump game |
| **Frequency** | ★★★☆☆ (3/5) |

**Key Observation**: Each tap at position `i` covers range `[i-ranges[i], i+ranges[i]]`. Create a "jump" array where `jump[left] = max(jump[left], right)`. Then apply Jump Game II.

**Time Complexity**: O(n)
**Space Complexity**: O(n)

---

### Mastery Framework

| Level | Description | Checkpoint |
|-------|-------------|------------|
| L0 | Uses DP or BFS for jump reachability | O(n²) when O(n) exists |
| L1 | Solves Jump Game I with maxReach | Correct reachability check |
| L2 | Solves Jump Game II with BFS-level greedy | Correct minimum jumps |
| L3 | Recognizes interval coverage as jump game | Solves Video Stitching, Taps |
| L4 | Handles edge cases (unreachable, empty) | Clean code with all edge cases |
| L5 | Explains the BFS analogy fluently | Can teach the technique to others |

---

## Pattern 15.4: Build Optimal Sequence

### Pattern Description

This pattern involves building a sequence (string, number) by making greedy choices about which element to include next. The key technique is often a **monotonic stack** or comparison-based removal: iterate through elements and maintain a result that's as optimal as possible by removing suboptimal elements when a better choice appears.

### Core Invariant

**Maintain a result sequence where each new element is compared against the current result. If the new element is "better" and we have room to remove from the result, remove suboptimal elements greedily.**

### Recognition Signals

- Build the smallest/largest number or string by removing/keeping elements.
- Constraint on how many elements you can remove.
- "Remove k digits to minimize the number."
- The result must preserve relative order of remaining elements.

### Curated Questions

---

##### Q1: Remove K Digits
| Field | Value |
|-------|-------|
| **Platform** | LeetCode |
| **Link** | https://leetcode.com/problems/remove-k-digits/ |
| **Difficulty** | Medium |
| **Companies** | Google, Amazon, Meta, Microsoft |
| **Topic** | Greedy |
| **Pattern** | Build Optimal Sequence |
| **Variation** | Monotonic stack for smallest number |
| **Frequency** | ★★★★★ (5/5) |

**Key Observation**: Use a stack. For each digit, while the stack top is larger than current digit AND we still have removals left (k > 0), pop the stack (remove that digit). Push current digit. After processing, remove remaining k digits from the end. Strip leading zeros.

**Expected Thought Process**:
1. "Remove k digits to make the smallest number. Left digits matter most."
2. "Greedy: remove digits from left that are larger than the next digit."
3. "Use a stack: pop larger digits when a smaller digit arrives."
4. "After pass: if k > 0, remove from end (rightmost digits are largest)."
5. "Strip leading zeros. Handle edge case of empty result → '0'."

**Time Complexity**: O(n)
**Space Complexity**: O(n)

**Common Mistakes**:
- Forgetting to strip leading zeros.
- Not handling the case where k ≥ n (result is "0").
- Not removing remaining k digits after the main pass.

**Follow-Up Questions**:
- "What if you want the LARGEST number?" → Pop when stack top is SMALLER.
- "What if the string contains non-digit characters?" → Adapt the comparison logic.

---

##### Q2: Remove Duplicate Letters / Smallest Subsequence of Distinct Characters
| Field | Value |
|-------|-------|
| **Platform** | LeetCode |
| **Link** | https://leetcode.com/problems/remove-duplicate-letters/ |
| **Difficulty** | Medium |
| **Companies** | Google, Amazon, Bloomberg |
| **Topic** | Greedy |
| **Pattern** | Build Optimal Sequence |
| **Variation** | Monotonic stack with uniqueness constraint |
| **Frequency** | ★★★★☆ (4/5) |

**Key Observation**: Use a stack. For each character: if already in stack, skip. If stack top > current char AND stack top appears later in the string, pop it (we'll add it back later at a better position). Track character counts and in-stack membership.

**Time Complexity**: O(n)
**Space Complexity**: O(1) (26 characters)

**Common Mistakes**:
- Not checking if the character is already in the stack (leads to duplicates).
- Popping a character that won't appear again later.

---

##### Q3: Monotone Increasing Digits
| Field | Value |
|-------|-------|
| **Platform** | LeetCode |
| **Link** | https://leetcode.com/problems/monotone-increasing-digits/ |
| **Difficulty** | Medium |
| **Companies** | Amazon, Google |
| **Topic** | Greedy |
| **Pattern** | Build Optimal Sequence |
| **Variation** | Digit manipulation |
| **Frequency** | ★★★☆☆ (3/5) |

**Key Observation**: Find the leftmost position where digits decrease. Decrement that digit and set all subsequent digits to 9. Scan right-to-left for the correct position.

**Time Complexity**: O(d) where d = number of digits
**Space Complexity**: O(d)

---

### Mastery Framework

| Level | Description | Checkpoint |
|-------|-------------|------------|
| L0 | Tries brute force (all combinations of removals) | Exponential approach |
| L1 | Understands "remove larger left digits" concept | Partial solution with bugs |
| L2 | Correct monotonic stack solution | Solves Remove K Digits |
| L3 | Handles uniqueness constraints | Solves Remove Duplicate Letters |
| L4 | Combines greedy with frequency tracking | Handles complex constraints |
| L5 | Recognizes build-sequence pattern in novel problems | Applies stack-based greedy to new problems |

---

## Pattern 15.5: Exchange Argument

### Pattern Description

The Exchange Argument is both a proof technique and a problem-solving pattern. In problems where you need to find the optimal ordering of elements, you prove that swapping any two adjacent elements that are "out of order" (according to your greedy criterion) improves or maintains the solution. This proves that the sorted order is optimal.

This is the most intellectually demanding greedy pattern. It appears in scheduling problems, sequencing problems, and any problem where the ORDER of processing matters.

### Core Invariant

**Define a pairwise comparison between elements. Show that for any two adjacent elements in the wrong order, swapping them doesn't worsen the solution. This proves the sorted order (by your comparison) is globally optimal.**

### Recognition Signals

- The problem asks for the optimal ORDER to process elements.
- Each element has multiple properties (e.g., processing time AND deadline).
- The objective depends on the sequence of ALL elements, not a subset.
- "Minimize total penalty" or "maximize total reward" based on ordering.
- The comparison between two elements depends on a ratio or product of their properties.

### Curated Questions

---

##### Q1: Candy
| Field | Value |
|-------|-------|
| **Platform** | LeetCode |
| **Link** | https://leetcode.com/problems/candy/ |
| **Difficulty** | Hard |
| **Companies** | Google, Amazon, Meta, Goldman Sachs |
| **Topic** | Greedy |
| **Pattern** | Exchange Argument |
| **Variation** | Two-pass greedy |
| **Frequency** | ★★★★☆ (4/5) |

**Key Observation**: Two passes. Left-to-right: if `ratings[i] > ratings[i-1]`, give `candies[i] = candies[i-1] + 1`. Right-to-left: if `ratings[i] > ratings[i+1]`, ensure `candies[i] ≥ candies[i+1] + 1`. Each child gets at least 1 candy.

**Expected Thought Process**:
1. "Each child gets at least 1 candy. Higher-rated children get more than their neighbors."
2. "This is a two-directional constraint. Handle left neighbors in one pass, right in another."
3. "Left pass: enforce ascending sequences get increasing candies."
4. "Right pass: enforce descending sequences from right also get increasing candies."
5. "Take max of both passes at each position."

**Time Complexity**: O(n)
**Space Complexity**: O(n)

**Common Mistakes**:
- Only doing one pass (misses one direction of constraints).
- Not taking the max of both passes (overwriting the left pass result).
- Not giving equal-rated children the minimum (they CAN get fewer candies).

---

##### Q2: Task Scheduler
| Field | Value |
|-------|-------|
| **Platform** | LeetCode |
| **Link** | https://leetcode.com/problems/task-scheduler/ |
| **Difficulty** | Medium |
| **Companies** | Google, Meta, Amazon, Microsoft, Uber |
| **Topic** | Greedy |
| **Pattern** | Exchange Argument |
| **Variation** | Frequency-based scheduling |
| **Frequency** | ★★★★★ (5/5) |

**Key Observation**: The most frequent task determines the minimum time. Create "frames" of size `n+1` around the most frequent task. `answer = max(tasks.length, (maxFreq - 1) * (n + 1) + countOfMaxFreq)`. The "idle slots" are filled by less frequent tasks.

**Expected Thought Process**:
1. "Tasks with cooldown n. Schedule to minimize total time (including idles)."
2. "The bottleneck is the most frequent task."
3. "Create slots: (maxFreq - 1) intervals of size (n+1), plus the last partial interval."
4. "Total = max(len(tasks), (maxFreq-1)*(n+1) + countOfMaxFreqTasks)."

**Alternative Solutions**:
- Priority queue simulation: O(n × m) where m = unique tasks. Correct but slower.
- Mathematical formula: O(n) — preferred in interviews.

**Time Complexity**: O(n) with formula, O(n log 26) with heap simulation
**Space Complexity**: O(1) (26 task types)

**Common Mistakes**:
- Not handling the case where there are enough different tasks to fill all idle slots (answer = total tasks).
- Forgetting `countOfMaxFreq` — when multiple tasks share the max frequency.
- Overcomplicating with simulation when the formula is O(1).

**Follow-Up Questions**:
- "What if tasks have different durations?" → More complex scheduling, likely DP or simulation.
- "What if the cooldown is 0?" → Just return total tasks.
- "Print the actual schedule." → Use priority queue + cooldown queue simulation.

---

##### Q3: Minimum Deletions to Make Character Frequencies Unique
| Field | Value |
|-------|-------|
| **Platform** | LeetCode |
| **Link** | https://leetcode.com/problems/minimum-deletions-to-make-character-frequencies-unique/ |
| **Difficulty** | Medium |
| **Companies** | Google, Amazon, Microsoft |
| **Topic** | Greedy |
| **Pattern** | Exchange Argument |
| **Variation** | Frequency deduplication |
| **Frequency** | ★★★★☆ (4/5) |

**Key Observation**: Count frequencies. Sort descending. For each frequency, if it equals or exceeds the previous (after adjustment), decrement it until it's unique (or 0). Count total decrements.

**Time Complexity**: O(n + 26 log 26)
**Space Complexity**: O(1)

---

##### Q4: Gas Station
| Field | Value |
|-------|-------|
| **Platform** | LeetCode |
| **Link** | https://leetcode.com/problems/gas-station/ |
| **Difficulty** | Medium |
| **Companies** | Google, Amazon, Meta, Bloomberg |
| **Topic** | Greedy |
| **Pattern** | Exchange Argument |
| **Variation** | Circular traversal with accumulation |
| **Frequency** | ★★★★★ (5/5) |

**Key Observation**: If total gas ≥ total cost, a solution exists. To find the starting station: track running tank. If tank goes negative, restart from the next station. The last restart point is the answer.

**Expected Thought Process**:
1. "Circle of stations with gas and cost. Can I complete the circuit?"
2. "If total gas < total cost, impossible."
3. "Otherwise, find starting point: track running sum. When it goes negative, reset start to next station."
4. "Proof: if I can't start from any station before s, and total gas ≥ total cost, then s must work."

**Time Complexity**: O(n)
**Space Complexity**: O(1)

**Common Mistakes**:
- Not checking total gas ≥ total cost first (guarantees solution exists).
- Trying O(n²) brute force by testing each starting station.
- Not understanding why the greedy "last reset" gives the correct answer.

---

##### Q5: IPO (Maximize Capital)
| Field | Value |
|-------|-------|
| **Platform** | LeetCode |
| **Link** | https://leetcode.com/problems/ipo/ |
| **Difficulty** | Hard |
| **Companies** | Google, Amazon |
| **Topic** | Greedy |
| **Pattern** | Exchange Argument |
| **Variation** | Greedy with heap (sort + priority queue) |
| **Frequency** | ★★★☆☆ (3/5) |

**Key Observation**: Sort projects by capital required. Use a max-heap for profits of affordable projects. For each of k rounds: add all newly affordable projects to the heap, pick the most profitable one, add its profit to capital.

**Time Complexity**: O(n log n)
**Space Complexity**: O(n)

---

### Mastery Framework

| Level | Description | Checkpoint |
|-------|-------------|------------|
| L0 | Can't formalize why a greedy ordering works | Uses greedy by "feel" |
| L1 | Understands exchange argument concept | Can explain for Activity Selection |
| L2 | Applies two-pass greedy correctly | Solves Candy |
| L3 | Handles frequency-based scheduling | Solves Task Scheduler with formula |
| L4 | Designs custom orderings with proofs | Can prove Gas Station greedy correctness |
| L5 | Uses exchange argument on novel problems | Constructs ordering proofs from scratch |

---

## Pattern 15.6: Greedy vs DP Boundary

### Pattern Description

This meta-pattern is about recognizing when a problem that LOOKS greedy actually requires DP, and vice versa. Interviewers love testing this boundary because it reveals deep understanding.

### Core Invariant

**If the greedy choice at any step can be proven safe (exchange argument or greedy-stays-ahead), use greedy. If you can construct a counterexample where greedy fails, use DP.**

### Key Examples of the Boundary

| Problem | Looks Like | Actually Is | Why |
|---------|-----------|-------------|-----|
| Activity Selection | DP (try all subsets) | Greedy | Exchange argument: earliest finish is always safe |
| Coin Change (general) | Greedy (largest coin first) | DP | Greedy fails: coins={1,3,4}, amount=6. Greedy=4+1+1, optimal=3+3 |
| Jump Game I | DP (reachability) | Greedy | MaxReach is monotonically non-decreasing |
| 0/1 Knapsack | Greedy (best value/weight) | DP | Items can't be split; greedy choice isn't always safe |
| Fractional Knapsack | DP | Greedy | Items CAN be split; best ratio first is provably optimal |
| Huffman Coding | DP (tree construction) | Greedy | Merge two least frequent first (exchange argument) |

### Curated Questions

---

##### Q1: Minimum Cost to Hire K Workers
| Field | Value |
|-------|-------|
| **Platform** | LeetCode |
| **Link** | https://leetcode.com/problems/minimum-cost-to-hire-k-workers/ |
| **Difficulty** | Hard |
| **Companies** | Google, Amazon |
| **Topic** | Greedy |
| **Pattern** | Greedy vs DP Boundary |
| **Variation** | Ratio-based greedy with heap |
| **Frequency** | ★★★★☆ (4/5) |

**Key Observation**: Sort workers by wage/quality ratio. For each worker as the "benchmark" (their ratio determines the pay rate), pick the k-1 workers with smallest quality from those with lower ratio. Use a max-heap to maintain the k smallest qualities.

**Time Complexity**: O(n log n)
**Space Complexity**: O(n)

---

##### Q2: Reorganize String
| Field | Value |
|-------|-------|
| **Platform** | LeetCode |
| **Link** | https://leetcode.com/problems/reorganize-string/ |
| **Difficulty** | Medium |
| **Companies** | Google, Amazon, Meta |
| **Topic** | Greedy |
| **Pattern** | Greedy vs DP Boundary |
| **Variation** | Frequency-based greedy with heap |
| **Frequency** | ★★★★☆ (4/5) |

**Key Observation**: If any character has frequency > (n+1)/2, impossible. Otherwise, use a max-heap: always place the most frequent character that's different from the last placed character.

**Time Complexity**: O(n log 26) = O(n)
**Space Complexity**: O(1)

**Common Mistakes**:
- Not checking the impossibility condition first.
- Not properly handling the "last placed character" constraint with the heap.

---

### Mastery Framework

| Level | Description | Checkpoint |
|-------|-------------|------------|
| L0 | Always tries greedy first, can't detect when it fails | Gets wrong answers on DP problems |
| L1 | Knows "greedy doesn't always work" but can't articulate why | Hand-wavy justification |
| L2 | Can find counterexamples for greedy on DP problems | Spots Coin Change as non-greedy |
| L3 | Can prove greedy works using exchange argument | Proves Activity Selection |
| L4 | Quickly classifies novel problems as greedy or DP | Correctly decides approach within 3 minutes |
| L5 | Can handle boundary problems (greedy + heap, greedy + BS) | Solves IPO, Min Cost Hire K Workers |

---

## Greedy Mock Interviews

### Mock Interview 1: The Conference Planner

**Format**: Meta Coding Interview
**Duration**: 20 minutes
**Difficulty**: Medium

**Interviewer Script**:
"You're organizing a conference. You have a list of talk proposals, each with a start and end time. You want to attend as many talks as possible, but you can only be in one talk at a time. What's the maximum number of talks you can attend?"

**Expected Clarifying Questions**:
- "Can I leave a talk early?" (No, must attend the full talk)
- "Are the times integers?" (Yes)

**Follow-Up 1**: "Now I want to attend all talks. What's the minimum number of rooms needed?"
**Follow-Up 2**: "What if each talk has a value and I want to maximize total value of attended talks?"

**Hidden Pattern**: Activity Selection → Meeting Rooms II → Weighted Job Scheduling (DP)
**Recognition Process**: "Non-overlapping intervals + maximize count" → sort by end time, greedy selection.

**Evaluation Rubric**:
| Signal | Reject | Hire | Strong Hire |
|--------|--------|------|-------------|
| Speed | >15 min | 8-12 min | <6 min |
| Greedy Justification | Can't explain why | "Earliest ending is best" | Gives exchange argument |
| Follow-Up (rooms) | Stuck | Solves with guidance | Immediately uses sweep line/heap |
| Follow-Up (weighted) | Doesn't know it's DP | Recognizes DP is needed | Explains greedy fails + gives DP solution |

---

### Mock Interview 2: The Candy Distribution

**Format**: Google Onsite
**Duration**: 45 minutes
**Difficulty**: Hard

**Interviewer Script**:
"You're a teacher distributing candy to students in a line. Each student has a rating. You want to give each student at least one candy, and students with higher ratings than their immediate neighbor should get more candy than that neighbor. What's the minimum total candy you need?"

**Follow-Up 1**: "Walk me through why a single pass isn't sufficient."
**Follow-Up 2**: "What if the students are arranged in a circle?"

**Hidden Pattern**: Candy (Two-pass greedy)

**Evaluation Rubric**:
| Signal | Reject | Hire | Strong Hire |
|--------|--------|------|-------------|
| Approach | Tries sorting students | Sees the two-pass need after thinking | Immediately says "two-pass: left-to-right, right-to-left" |
| Correctness | Single pass with bugs | Two passes with minor issues | Clean first-attempt solution |
| Circular Follow-Up | Stuck | Tries but can't handle wraparound | Extends to circular with additional pass |

---

### Mock Interview 3: The CPU Scheduler

**Format**: Amazon Onsite
**Duration**: 45 minutes
**Difficulty**: Medium

**Interviewer Script**:
"You're writing a CPU task scheduler. Tasks are labeled A-Z and have cooldown constraint: after executing task X, you must wait n intervals before executing X again. You can be idle during the wait. Given a list of tasks, find the minimum time to execute all tasks."

**Follow-Up 1**: "Can you explain the mathematical formula instead of simulating?"
**Follow-Up 2**: "What if different tasks have different cooldown periods?"

**Hidden Pattern**: Task Scheduler

**Evaluation Rubric**:
| Signal | Reject | Hire | Strong Hire |
|--------|--------|------|-------------|
| Approach | Brute force simulation | Heap-based simulation | Mathematical formula in O(n) |
| Key Insight | Doesn't see frame structure | Gets frames but wrong formula | `(maxFreq-1)*(n+1)+countMax` immediately |
| Communication | Poor | Adequate | Draws the frame diagram, explains clearly |

---

### Mock Interview 4: The Gas Station Route

**Format**: Google Phone Screen
**Duration**: 45 minutes
**Difficulty**: Medium

**Interviewer Script**:
"You're planning a road trip on a circular route with gas stations. Each station has some gas and some cost to reach the next station. Can you complete the circuit? If so, from which station should you start?"

**Follow-Up 1**: "Prove why your algorithm gives the correct starting station."
**Follow-Up 2**: "What if the route is not circular but linear?"

**Hidden Pattern**: Gas Station

**Evaluation Rubric**:
| Signal | Reject | Hire | Strong Hire |
|--------|--------|------|-------------|
| Approach | O(n²) trying each start | O(n) with running sum | O(n) + proves correctness |
| Proof | Can't explain | Intuitive explanation | Formal: "if total ≥ 0 and deficit resets at s, prefix from s never goes negative" |

---

### Mock Interview 5: The Jumper

**Format**: Uber Technical Interview
**Duration**: 45 minutes
**Difficulty**: Medium

**Interviewer Script**:
"You're in a video game. You stand at position 0 on a number line. Position i lets you jump up to nums[i] positions forward. What's the minimum number of jumps to reach the end?"

**Follow-Up 1**: "What if some positions are traps (nums[i] = 0) and you can't land on them?"
**Follow-Up 2**: "What if you can also jump backward by 1?"

**Hidden Pattern**: Jump Game II → with obstacles → BFS (backward jumps break greedy)

**Evaluation Rubric**:
| Signal | Reject | Hire | Strong Hire |
|--------|--------|------|-------------|
| Approach | O(n²) DP | O(n) BFS-level greedy | O(n) greedy + explains BFS analogy |
| Backward Follow-Up | Tries greedy (wrong) | Recognizes greedy fails | Switches to BFS, explains why greedy breaks |

---

### Mock Interview 6: The Label Maker

**Format**: Meta Coding Interview
**Duration**: 15 minutes (speed round)
**Difficulty**: Medium

**Interviewer Script**:
"Given a string, partition it into as many parts as possible so that each letter appears in at most one part. Return the sizes of these parts."

**Hidden Pattern**: Partition Labels

**Evaluation Rubric**:
| Signal | Reject | Hire | Strong Hire |
|--------|--------|------|-------------|
| Speed | >12 min | 8-12 min | <6 min |
| Insight | Can't figure out partition points | Gets last-occurrence idea with thinking | Immediately pre-computes last occurrence, walks with max-end tracking |

---

### Mock Interview 7: The Number Minimizer

**Format**: Google Onsite
**Duration**: 45 minutes
**Difficulty**: Medium

**Interviewer Script**:
"Given a string of digits and an integer k, remove k digits to make the remaining number as small as possible. The relative order of digits must be preserved."

**Follow-Up 1**: "What if you want the LARGEST number instead?"
**Follow-Up 2**: "What if you can only remove digits that are prime (2, 3, 5, 7)?"

**Hidden Pattern**: Remove K Digits (monotonic stack greedy)

**Evaluation Rubric**:
| Signal | Reject | Hire | Strong Hire |
|--------|--------|------|-------------|
| Pattern | Tries all combinations | Sees "remove left peaks" | Immediately uses monotonic stack |
| Edge Cases | Misses leading zeros | Handles leading zeros with hint | Handles zeros, k≥n, and empty result |
| Largest Follow-Up | Stuck | Reverses comparison | Immediately flips to "pop smaller" |

---

### Mock Interview 8: The String Uniquifier

**Format**: Amazon Onsite
**Duration**: 45 minutes
**Difficulty**: Medium

**Interviewer Script**:
"Given a string with duplicate characters, remove duplicate letters so that every letter appears exactly once, and the result is the smallest possible in lexicographic order among all possible results."

**Hidden Pattern**: Remove Duplicate Letters

**Evaluation Rubric**:
| Signal | Reject | Hire | Strong Hire |
|--------|--------|------|-------------|
| Approach | Brute force (try all subsequences) | Stack-based but missing conditions | Full stack solution with count tracking + in-stack check |
| Correctness | Wrong result | Correct with 1-2 bugs | Correct first attempt |

---

### Mock Interview 9: The Boat Captain

**Format**: Microsoft Interview
**Duration**: 45 minutes
**Difficulty**: Medium

**Interviewer Script**:
"You're rescuing people. Each boat can carry at most 2 people with combined weight ≤ limit. Given everyone's weights, what's the minimum number of boats needed?"

**Follow-Up**: "What if boats can carry up to 3 people?"

**Hidden Pattern**: Boats to Save People

**Evaluation Rubric**:
| Signal | Reject | Hire | Strong Hire |
|--------|--------|------|-------------|
| Approach | Random pairing | Sort + two pointers | Immediately sorts + pairs heaviest with lightest |
| 3-person Follow-Up | Stuck | Tries extension | Discusses complexity increase, proposes greedy heuristic |

---

### Mock Interview 10: The Stock Market

**Format**: FinTech (PhonePe/Razorpay)
**Duration**: 45 minutes
**Difficulty**: Medium

**Interviewer Script**:
"You have daily stock prices. You can make unlimited buy/sell transactions. What's the maximum profit?"

**Follow-Up 1**: "What if there's a 1% transaction fee?"
**Follow-Up 2**: "Can you explain why greedy works here but not for 'at most 2 transactions'?"

**Hidden Pattern**: Stock II (Greedy) → Stock with Fee (DP) → Greedy vs DP boundary

**Evaluation Rubric**:
| Signal | Reject | Hire | Strong Hire |
|--------|--------|------|-------------|
| Stock II | Can't see greedy | Solves with DP (correct but slow) | Immediately: "sum all positive differences" |
| Fee Follow-Up | Greedy breaks, can't adapt | Recognizes need for state machine DP | Explains why fee breaks greedy, writes state machine |
| Boundary Explanation | Can't articulate | Vague explanation | Clear: "greedy works when local optimal = global optimal. Fee creates coupling between decisions." |

---

## Greedy Hiring Evaluation Framework

### Google

| Level | Signal |
|-------|--------|
| **Reject** | Can't determine if greedy works. No proof skills. Wrong approach for 15+ minutes. |
| **Borderline** | Correct greedy but can't prove it. Slow (>20 min for medium). |
| **Hire** | Correct greedy with informal proof. Handles one follow-up. <15 min. |
| **Strong Hire** | Exchange argument proof. Handles all follow-ups. Spots greedy-vs-DP boundary instantly. |

### Meta

| Level | Signal |
|-------|--------|
| **Reject** | Can't solve a medium greedy in 20 min. |
| **Hire** | Clean solution in <12 min. |
| **Strong Hire** | <8 min, discusses edge cases unprompted, mentions alternative approaches. |

### Amazon

| Level | Signal |
|-------|--------|
| **Reject** | Jumps to code without explaining approach. Can't handle follow-ups. |
| **Hire** | Explains approach clearly before coding. Good code quality. |
| **Strong Hire** | Considers multiple approaches (greedy vs DP), communicates tradeoffs, clean code. |

### Uber

| Level | Signal |
|-------|--------|
| **Reject** | Can't model the problem correctly. |
| **Hire** | Correct model + solution. Handles design follow-ups. |
| **Strong Hire** | Anticipates edge cases, discusses production implications. |

---

## Top 10 Greedy Mistakes

### Mistake 1: Applying Greedy Without Proof
**Description**: "It seems like taking the largest/smallest first should work" — but it doesn't.
**Example**: Coin Change with coins {1, 3, 4}, amount 6. Greedy: 4+1+1=3 coins. Optimal: 3+3=2 coins.
**How to Avoid**: Always try to find a counterexample. If you can't, attempt an exchange argument.

### Mistake 2: Wrong Sorting Criterion for Intervals
**Description**: Sorting by start time when end time is needed for maximum non-overlapping.
**Example**: Activity Selection — sorting by start time can include early-starting but long-running activities that block many short ones.
**How to Avoid**: For "maximum non-overlapping" → sort by end time. For "merging" → sort by start time.

### Mistake 3: Confusing "Minimum Removals" with "Maximum Selections"
**Description**: Non-overlapping Intervals asks for minimum removals, not maximum kept.
**Example**: Answer = n - maxNonOverlapping, not maxNonOverlapping itself.
**How to Avoid**: Read the problem carefully. Transform if needed.

### Mistake 4: Not Recognizing Interval Problems in Disguise
**Description**: Partition Labels, Minimum Arrows, and Video Stitching are all interval problems.
**Example**: Partition Labels = interval merging on character ranges.
**How to Avoid**: Whenever you see ranges or "first/last occurrence," think intervals.

### Mistake 5: Using Greedy for Weighted Intervals
**Description**: Activity Selection greedy doesn't work when activities have different values.
**Example**: Two activities: long but valuable vs short but cheap. Greedy picks the short one.
**How to Avoid**: Weighted intervals → DP (Weighted Job Scheduling).

### Mistake 6: Forgetting Leading Zeros in Remove K Digits
**Description**: After removal, "00123" should become "123", and "0" is the result for all zeros.
**How to Avoid**: Always strip leading zeros. Handle empty string → "0".

### Mistake 7: Missing the BFS-Level Analogy in Jump Game II
**Description**: Using O(n²) DP when O(n) greedy works by thinking in "jump levels."
**How to Avoid**: Visualize: each jump creates a "level" of reachable positions, like BFS.

### Mistake 8: Not Checking Total Before Circular Traversal
**Description**: In Gas Station, not checking totalGas ≥ totalCost first.
**How to Avoid**: If total deficit > total surplus, no starting point works.

### Mistake 9: Single Pass for Bidirectional Constraints
**Description**: Candy problem needs two passes (left-to-right AND right-to-left).
**How to Avoid**: If constraints reference both left and right neighbors, one pass isn't enough.

### Mistake 10: Overcomplicating with Simulation When Formula Exists
**Description**: Task Scheduler can be solved with a mathematical formula, but candidates simulate with priority queues.
**How to Avoid**: Look for the pattern: `(maxFreq-1) * (n+1) + countOfMaxFreq`. If total tasks exceed this, answer = total tasks.

---

## Interview Communication Example

**Problem: Jump Game II**

> "I need the minimum jumps to reach the end. Let me think about the structure...
>
> I can model this as BFS, where each 'level' represents all positions reachable with the same number of jumps. The first level is just position 0. The second level is everything reachable from position 0. And so on.
>
> I'll track two things: `currentEnd` — the farthest position in my current BFS level, and `farthest` — the farthest position reachable from any position in my current level.
>
> As I walk from left to right, I update `farthest = max(farthest, i + nums[i])`. When I reach `currentEnd`, I've finished this BFS level — I increment my jump counter and set `currentEnd = farthest`.
>
> Let me code this... [writes clean code]
>
> Time is O(n) — single pass. Space is O(1) — just three variables. Edge case: if n ≤ 1, return 0.
>
> Let me trace through [2, 3, 1, 1, 4]: Level 0: pos 0, farthest=2. Level 1: pos 1-2, farthest=4. We've reached the end in 2 jumps. ✓"
