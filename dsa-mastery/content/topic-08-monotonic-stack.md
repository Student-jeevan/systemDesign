# Topic 8: Monotonic Stack — Complete Coverage

> **Priority**: #3 (Critical) | **Risk**: 7/10 | **Interview Frequency**: ★★★★☆
>
> Monotonic Stack is the most "hidden" pattern in DSA interviews. Candidates who've solved 500+ problems
> still miss it because it's rarely taught as a standalone pattern. Mastering it gives you an unfair
> advantage — interviewers are impressed when candidates recognize it immediately.

---

## Monotonic Stack Overview

### What a Monotonic Stack Is

A monotonic stack is a stack that maintains its elements in either **strictly increasing** or **strictly decreasing** order (from bottom to top). When you push a new element, you pop all elements that violate the monotonic property. The popped elements reveal key relationships — typically the "next greater/smaller element" or "span" information.

### Why It Matters

The monotonic stack transforms O(n²) brute-force solutions (check all pairs) into O(n) solutions by maintaining exactly the information you need. Each element is pushed once and popped once, giving amortized O(1) per element.

### The Two Core Operations

**Monotonic Decreasing Stack** (elements decrease from bottom to top):
- Used for **Next Greater Element** problems.
- When you push element `x`, you pop all elements `< x` — for each popped element, `x` is their NGE.

**Monotonic Increasing Stack** (elements increase from bottom to top):
- Used for **Next Smaller Element** problems.
- When you push element `x`, you pop all elements `> x` — for each popped element, `x` is their NSE.

### The Key Mental Model

Think of the stack as maintaining "candidates" who are waiting for their answer. When a new element arrives and is "better" than candidates in the stack, those candidates get their answer (the new element), and they're removed. Elements that haven't found their answer yet remain in the stack.

---

## Pattern 8.1: Next Greater Element

### Pattern Description

Given an array, for each element, find the first element to its right that is greater. This is the foundational monotonic stack problem. The stack maintains elements in decreasing order (bottom to top), and when a new element is greater than the stack top, it's the NGE for the popped elements.

### Core Invariant

**The stack maintains a decreasing sequence of elements (or their indices) from bottom to top. When a new element `x` is processed, all stack elements less than `x` are popped — `x` is their next greater element.**

### Recognition Signals

- "Next greater element" or "first element to the right that is larger."
- "How many days until a warmer temperature."
- Looking for the nearest larger/smaller element in one direction.
- O(n) solution expected for what seems like an O(n²) problem.
- Keywords: "next", "greater", "warmer", "span", "stock span."

### Common Traps

- **Wrong stack order**: Using increasing stack for NGE (should be decreasing) or vice versa.
- **Pushing values vs indices**: For many problems, push indices (to compute distances) rather than values. But the comparison still uses values at those indices.
- **Circular arrays**: NGE in circular arrays requires processing the array twice (or using modular arithmetic).
- **Not initializing answers for elements with no NGE**: Elements remaining in the stack at the end have no NGE — set their answer to -1 or n.

### Complexity Intuition

- **Time**: O(n) — each element is pushed once and popped at most once.
- **Space**: O(n) — stack can hold all elements in worst case (sorted descending input).

### Curated Questions

---

##### Q1: Next Greater Element I
| Field | Value |
|-------|-------|
| **Platform** | LeetCode |
| **Link** | https://leetcode.com/problems/next-greater-element-i/ |
| **Difficulty** | Easy |
| **Companies** | Amazon, Google, Bloomberg |
| **Topic** | Monotonic Stack |
| **Pattern** | Next Greater Element |
| **Variation** | Basic NGE with mapping |
| **Frequency** | ★★★★☆ (4/5) |

**Key Observation**: Process `nums2` with a monotonic decreasing stack. For each element popped, map it to the current element (its NGE). Then look up `nums1` elements in the map.

**Time Complexity**: O(n + m)
**Space Complexity**: O(n)

---

##### Q2: Daily Temperatures
| Field | Value |
|-------|-------|
| **Platform** | LeetCode |
| **Link** | https://leetcode.com/problems/daily-temperatures/ |
| **Difficulty** | Medium |
| **Companies** | Google, Amazon, Meta, Microsoft, Goldman Sachs |
| **Topic** | Monotonic Stack |
| **Pattern** | Next Greater Element |
| **Variation** | NGE with distance computation |
| **Frequency** | ★★★★★ (5/5) |

**Key Observation**: Stack stores indices. When `temperatures[i] > temperatures[stack.top()]`, pop and compute distance: `answer[popped] = i - popped`. This gives "days until warmer."

**Expected Thought Process**:
1. "For each day, find the next warmer day. This is Next Greater Element with distances."
2. "Use monotonic decreasing stack of indices."
3. "When current temp > stack top's temp, pop and record distance."

**Time Complexity**: O(n)
**Space Complexity**: O(n)

**Common Mistakes**:
- Pushing temperatures instead of indices (can't compute distances).
- Wrong comparison direction (should pop when current > top, not ≥).

**Follow-Up Questions**:
- "What about the next COLDER day?" → Monotonic increasing stack.
- "What about the PREVIOUS warmer day?" → Process right-to-left.

---

##### Q3: Next Greater Element II (Circular)
| Field | Value |
|-------|-------|
| **Platform** | LeetCode |
| **Link** | https://leetcode.com/problems/next-greater-element-ii/ |
| **Difficulty** | Medium |
| **Companies** | Google, Amazon |
| **Topic** | Monotonic Stack |
| **Pattern** | Next Greater Element |
| **Variation** | Circular array NGE |
| **Frequency** | ★★★★☆ (4/5) |

**Key Observation**: Process the array twice (indices 0 to 2n-1, using `i % n`). The second pass handles wraparound. Only push indices from the first pass (avoid duplicates).

**Time Complexity**: O(n)
**Space Complexity**: O(n)

---

##### Q4: Online Stock Span
| Field | Value |
|-------|-------|
| **Platform** | LeetCode |
| **Link** | https://leetcode.com/problems/online-stock-span/ |
| **Difficulty** | Medium |
| **Companies** | Amazon, Google, Goldman Sachs |
| **Topic** | Monotonic Stack |
| **Pattern** | Next Greater Element |
| **Variation** | Previous Greater Element (span) |
| **Frequency** | ★★★★☆ (4/5) |

**Key Observation**: Stock span = number of consecutive days before today where price ≤ today's price. Use a monotonic decreasing stack of (price, span) pairs. When current price ≥ stack top, pop and accumulate the popped span.

**Time Complexity**: O(1) amortized per call
**Space Complexity**: O(n)

---

### Mastery Framework

| Level | Description | Checkpoint |
|-------|-------------|------------|
| L0 | Uses O(n²) brute force for NGE | Nested loops checking all elements to the right |
| L1 | Understands monotonic stack concept | Can explain the stack invariant |
| L2 | Implements NGE correctly | Solves Daily Temperatures |
| L3 | Handles circular arrays | Solves NGE II with double traversal |
| L4 | Applies to span/online problems | Solves Stock Span online |
| L5 | Recognizes NGE as a subproblem in complex problems | Uses NGE as building block |

---

## Pattern 8.2: Previous Smaller Element

### Pattern Description

For each element, find the nearest element to its left that is smaller. This uses a monotonic increasing stack (bottom to top). When you push element `x`, pop all elements `≥ x` — the element that remains on top (or -1 if empty) is the Previous Smaller Element for `x`.

### Core Invariant

**The stack maintains an increasing sequence. For each new element, the stack top after popping is its Previous Smaller Element.**

### Curated Questions

---

##### Q1: Sum of Subarray Minimums
| Field | Value |
|-------|-------|
| **Platform** | LeetCode |
| **Link** | https://leetcode.com/problems/sum-of-subarray-minimums/ |
| **Difficulty** | Medium |
| **Companies** | Google, Amazon, Meta, Uber |
| **Topic** | Monotonic Stack |
| **Pattern** | Previous Smaller Element |
| **Variation** | Contribution technique + monotonic stack |
| **Frequency** | ★★★★★ (5/5) |

**Key Observation**: For each element `arr[i]`, count how many subarrays have `arr[i]` as their minimum. This equals `left[i] × right[i]` where `left[i]` = distance to previous smaller element and `right[i]` = distance to next smaller-or-equal element. Total contribution of `arr[i]` = `arr[i] × left[i] × right[i]`.

**Expected Thought Process**:
1. "Sum of min of all subarrays. O(n²) brute force too slow."
2. "For each element, determine how many subarrays it's the minimum of."
3. "Use monotonic stack to find Previous Smaller Element (left boundary) and Next Smaller-or-Equal Element (right boundary)."
4. "Contribution of arr[i] = arr[i] × left_count × right_count."
5. "Handle duplicates: use strict < on one side and ≤ on the other to avoid double-counting."

**Time Complexity**: O(n)
**Space Complexity**: O(n)

**Common Mistakes**:
- Not handling duplicates (using `<` on both sides leads to double-counting).
- Forgetting modular arithmetic (answer mod 10^9+7).
- Wrong boundary calculation (left/right distances).

**Follow-Up Questions**:
- "Sum of subarray maximums?" → Same technique, reverse the stack order.
- "Sum of subarray ranges?" → Sum of max - sum of min for all subarrays.

---

##### Q2: Sum of Subarray Ranges
| Field | Value |
|-------|-------|
| **Platform** | LeetCode |
| **Link** | https://leetcode.com/problems/sum-of-subarray-ranges/ |
| **Difficulty** | Medium |
| **Companies** | Google, Amazon |
| **Topic** | Monotonic Stack |
| **Pattern** | Previous Smaller Element |
| **Variation** | Sum of max - sum of min |
| **Frequency** | ★★★★☆ (4/5) |

**Key Observation**: Range of subarray = max - min. Sum of ranges = sum of all subarray maximums - sum of all subarray minimums. Compute each using the contribution technique with monotonic stacks.

**Time Complexity**: O(n)
**Space Complexity**: O(n)

---

## Pattern 8.3: Histogram Pattern

### Pattern Description

The Histogram Pattern uses the monotonic stack to solve problems involving rectangles in histograms or maximal rectangles in binary matrices. The key insight is that the largest rectangle ending at each bar has a width determined by the nearest shorter bars on both sides.

### Core Invariant

**For each bar in the histogram, the largest rectangle with that bar as the shortest bar extends from the Previous Smaller Element to the Next Smaller Element. Width = right_boundary - left_boundary - 1.**

### Curated Questions

---

##### Q1: Largest Rectangle in Histogram
| Field | Value |
|-------|-------|
| **Platform** | LeetCode |
| **Link** | https://leetcode.com/problems/largest-rectangle-in-histogram/ |
| **Difficulty** | Hard |
| **Companies** | Google, Amazon, Meta, Microsoft, Uber |
| **Topic** | Monotonic Stack |
| **Pattern** | Histogram Pattern |
| **Variation** | Classic histogram max rectangle |
| **Frequency** | ★★★★★ (5/5) |

**Key Observation**: For each bar `h[i]`, the largest rectangle with height `h[i]` extends from the Previous Smaller bar (left bound) to the Next Smaller bar (right bound). Use monotonic increasing stack. When popping bar `j` (because `h[i] < h[j]`), the rectangle width = `i - stack.top() - 1` (or `i` if stack is empty), height = `h[j]`.

**Expected Thought Process**:
1. "Largest rectangle in histogram. Classic monotonic stack problem."
2. "For each bar, find how far left and right it can extend as the shortest bar."
3. "Monotonic increasing stack. When I pop bar j because bar i is shorter:"
4. "Width = distance between current i and new stack top. Height = h[j]."
5. "Area = width × height. Track max area."
6. "After processing all bars, pop remaining stack entries with right bound = n."

**Alternative Solutions**:
- Divide and conquer: O(n log n). Find min bar, compute area, recurse on left and right. O(n²) worst case without range-min query.
- Brute force: O(n²) or O(n³). Far too slow.

**Time Complexity**: O(n)
**Space Complexity**: O(n)

**Common Mistakes**:
- Wrong width calculation when stack is empty (width = i, not i - 0).
- Forgetting to process remaining elements in the stack after the main loop.
- Using decreasing stack instead of increasing (wrong order).

**Follow-Up Questions**:
- "What about the maximal rectangle in a binary matrix?" → Maximal Rectangle (below).
- "Can you solve this without a stack?" → Two-pass approach computing left/right bounds separately.

---

##### Q2: Maximal Rectangle
| Field | Value |
|-------|-------|
| **Platform** | LeetCode |
| **Link** | https://leetcode.com/problems/maximal-rectangle/ |
| **Difficulty** | Hard |
| **Companies** | Google, Amazon, Meta, Microsoft |
| **Topic** | Monotonic Stack |
| **Pattern** | Histogram Pattern |
| **Variation** | 2D histogram (row-by-row) |
| **Frequency** | ★★★★★ (5/5) |

**Key Observation**: Build a histogram for each row: `heights[j]` = number of consecutive 1s above (including current row) in column j. Apply Largest Rectangle in Histogram for each row. Max across all rows is the answer.

**Expected Thought Process**:
1. "Maximal rectangle of 1s in binary matrix."
2. "For each row, build histogram of heights (consecutive 1s from top)."
3. "Apply largest rectangle in histogram for each row."
4. "Track global max across all rows."

**Time Complexity**: O(m × n)
**Space Complexity**: O(n)

**Common Mistakes**:
- Not resetting height to 0 when the cell is '0'.
- Forgetting that heights accumulate row by row (not just current row).

---

## Pattern 8.4: Trapping Pattern

### Pattern Description

Trapping pattern uses monotonic stacks (or two-pointer approaches) to compute how much water or similar substance can be trapped between bars or buildings.

### Curated Questions

---

##### Q1: Trapping Rain Water
| Field | Value |
|-------|-------|
| **Platform** | LeetCode |
| **Link** | https://leetcode.com/problems/trapping-rain-water/ |
| **Difficulty** | Hard |
| **Companies** | Google, Amazon, Meta, Microsoft, Goldman Sachs, Uber |
| **Topic** | Monotonic Stack |
| **Pattern** | Trapping Pattern |
| **Variation** | Water trapping with stack or two-pointer |
| **Frequency** | ★★★★★ (5/5) |

**Key Observation**: Multiple approaches: (1) **Two-pointer**: Water at position i = `min(leftMax, rightMax) - height[i]`. Use two pointers from both ends, moving the pointer with the smaller max. (2) **Monotonic stack**: Process bars left-to-right. When current bar > stack top, trapped water exists between current bar and previous taller bar. (3) **Prefix max**: Pre-compute leftMax and rightMax arrays.

**Expected Thought Process**:
1. "Trapping rain water — classic. Three approaches."
2. "I'll use two pointers for O(1) space. Left pointer, right pointer."
3. "Water level at each position = min(max_left, max_right) - height."
4. "Move the pointer with the smaller max (that's the binding constraint)."

**Alternative Solutions**:
- Stack approach: O(n) time, O(n) space. Processes water layer by layer.
- Prefix/suffix max arrays: O(n) time, O(n) space. Pre-compute leftMax[i] and rightMax[i].
- Two-pointer: O(n) time, O(1) space. Optimal.

**Time Complexity**: O(n) for all approaches
**Space Complexity**: O(1) with two pointers, O(n) with stack or prefix arrays

**Common Mistakes**:
- Not considering that water level is determined by the SHORTER of the two sides.
- Off-by-one in the two-pointer approach (where to initialize left/right pointers).
- With stack approach: wrong water calculation (need to account for both width and bounded height).

**Follow-Up Questions**:
- "2D version (trapping rain water on a 2D heightmap)?" → BFS with priority queue from boundaries.
- "What if there are holes in the walls?" → Different problem; may need simulation.

---

##### Q2: Buildings With an Ocean View
| Field | Value |
|-------|-------|
| **Platform** | LeetCode |
| **Link** | https://leetcode.com/problems/buildings-with-an-ocean-view/ |
| **Difficulty** | Medium |
| **Companies** | Meta, Google |
| **Topic** | Monotonic Stack |
| **Pattern** | Trapping Pattern |
| **Variation** | Suffix maximum / visible buildings |
| **Frequency** | ★★★★☆ (4/5) |

**Key Observation**: Building has ocean view if no taller building to its right. Traverse right to left, tracking max height seen. If current building > maxSoFar, it has a view.

**Time Complexity**: O(n)
**Space Complexity**: O(1) extra

---

## Pattern 8.5: Advanced Monotonic Stack

### Pattern Description

Advanced applications combine monotonic stacks with other techniques like DP, greedy, or specialized comparisons to solve more complex problems.

### Curated Questions

---

##### Q1: Maximum Width Ramp
| Field | Value |
|-------|-------|
| **Platform** | LeetCode |
| **Link** | https://leetcode.com/problems/maximum-width-ramp/ |
| **Difficulty** | Medium |
| **Companies** | Google, Amazon |
| **Topic** | Monotonic Stack |
| **Pattern** | Advanced Monotonic Stack |
| **Variation** | Monotonic stack + reverse scan |
| **Frequency** | ★★★☆☆ (3/5) |

**Key Observation**: Build a monotonic decreasing stack of indices from left to right (candidates for ramp start). Then scan from right to left: for each j, pop stack while `A[stack.top()] <= A[j]`, compute ramp width.

**Time Complexity**: O(n)
**Space Complexity**: O(n)

---

##### Q2: 132 Pattern
| Field | Value |
|-------|-------|
| **Platform** | LeetCode |
| **Link** | https://leetcode.com/problems/132-pattern/ |
| **Difficulty** | Medium |
| **Companies** | Google, Amazon, Uber |
| **Topic** | Monotonic Stack |
| **Pattern** | Advanced Monotonic Stack |
| **Variation** | Reverse scan with tracked value |
| **Frequency** | ★★★★☆ (4/5) |

**Key Observation**: Scan right-to-left. Maintain a monotonic decreasing stack. Track `s3` = the last popped element (the largest value less than some stack element). If current < `s3`, we found the 132 pattern (current=1, stack_element=3, s3=2).

**Time Complexity**: O(n)
**Space Complexity**: O(n)

**Common Mistakes**:
- Scanning left-to-right (much harder to get right).
- Not tracking the "2" element (s3) separately.
- Wrong stack order (must be decreasing for this to work).

---

## Monotonic Stack Mock Interviews

### Mock Interview 1: The Weather App

**Format**: Meta Coding Interview
**Duration**: 15 minutes
**Difficulty**: Medium

**Interviewer Script**:
"You're building a weather app feature. Given an array of daily temperatures, for each day, tell the user how many days they have to wait until a warmer day. If there's no warmer day, return 0."

**Hidden Pattern**: Daily Temperatures (NGE with distances)

**Evaluation Rubric**:
| Signal | Reject | Hire | Strong Hire |
|--------|--------|------|-------------|
| Pattern | Uses nested loops O(n²) | Recognizes monotonic stack | Immediately: "decreasing stack of indices, pop when warmer" |
| Speed | >12 min | 8-12 min | <6 min |
| Edge Cases | Misses last-day = 0 | Handles correctly | Discusses all edge cases upfront |

### Mock Interview 2: The Skyline Problem

**Format**: Google Onsite
**Duration**: 45 minutes
**Difficulty**: Hard

**Interviewer Script**:
"Given bars in a histogram, find the largest rectangle that fits inside. Each bar has width 1 and a given height."

**Follow-Up**: "Now extend this to a binary matrix. Find the largest rectangle of 1s."

**Hidden Pattern**: Largest Rectangle in Histogram → Maximal Rectangle

**Evaluation Rubric**:
| Signal | Reject | Hire | Strong Hire |
|--------|--------|------|-------------|
| Histogram | Can't solve in 20 min | Correct stack solution with debugging | Clean solution with correct width formula |
| Matrix Extension | Can't connect to histogram | Sees the connection with hints | Immediately: "build histogram per row, apply same algorithm" |

### Mock Interview 3: The Rain Catcher

**Format**: Uber Technical Interview
**Duration**: 45 minutes
**Difficulty**: Hard

**Interviewer Script**:
"You're designing a drainage system. Given the height of walls at each position, how much rainwater can be trapped between the walls?"

**Follow-Up 1**: "Can you solve it in O(1) space?"
**Follow-Up 2**: "What about a 2D heightmap?"

**Hidden Pattern**: Trapping Rain Water → Two Pointers → 2D BFS

**Evaluation Rubric**:
| Signal | Reject | Hire | Strong Hire |
|--------|--------|------|-------------|
| Basic | Can't formulate water at each position | Prefix max approach O(n) space | Two-pointer O(1) space |
| 2D Follow-Up | Stuck | Recognizes it's harder | Proposes BFS with priority queue from boundaries |

---

## Monotonic Stack Hiring Evaluation

### Google
| Level | Signal |
|-------|--------|
| **Reject** | Can't solve Daily Temperatures. Uses O(n²). |
| **Hire** | Solves histogram problem. Explains stack invariant. |
| **Strong Hire** | Solves histogram + extends to matrix. Clean code, proofs. |

### Meta
| Level | Signal |
|-------|--------|
| **Reject** | Can't code NGE in 15 minutes. |
| **Hire** | Solves Daily Temperatures in <10 minutes. |
| **Strong Hire** | Solves in <6 minutes, mentions contribution technique for Sum of Subarray Minimums. |

---

## Top 5 Monotonic Stack Mistakes

### Mistake 1: Wrong Stack Order
**Description**: Using decreasing stack for NSE (should be increasing) or vice versa.
**How to Avoid**: Decreasing → finds next GREATER. Increasing → finds next SMALLER.

### Mistake 2: Pushing Values Instead of Indices
**Description**: Can't compute distances when you only have values on the stack.
**How to Avoid**: Always push indices. Compare using `arr[stack.top()]`.

### Mistake 3: Forgetting Remaining Stack Elements
**Description**: After the main loop, elements still in the stack have no NGE/NSE. Must process them (set answer to -1 or n).
**How to Avoid**: Add a sentinel element at the end (e.g., push 0 for histogram problems).

### Mistake 4: Duplicate Handling in Contribution Technique
**Description**: Using `<` on both sides for sum of subarray mins causes double-counting for duplicate values.
**How to Avoid**: Use strict `<` on one side and `<=` on the other.

### Mistake 5: Wrong Width in Histogram
**Description**: When computing rectangle width after popping, using `i - j` instead of `i - stack.top() - 1`.
**How to Avoid**: Width = `i - stack.top() - 1` when stack is non-empty, `i` when empty.

---

## Company-Specific Expectations

**Google**: Histogram and Maximal Rectangle are classics. Expects O(n) monotonic stack solution, not O(n²). Will ask "can you extend to 2D?" as follow-up. Trapping Rain Water is common and they expect the two-pointer O(1) space solution.

**Meta**: Daily Temperatures is a speed problem. Expects under 8 minutes. Sum of Subarray Minimums appears in harder screens and they expect the contribution technique.

**Amazon**: Trapping Rain Water is very common. Expects clear communication about the three approaches (prefix max, stack, two pointers) and their tradeoffs.

**Uber**: May ask 132 Pattern or advanced variants. Expects strong stack intuition and clean code.
