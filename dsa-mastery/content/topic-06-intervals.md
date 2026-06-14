# Topic 6: Intervals — Complete Coverage

> **Priority**: #14 (Consolidation) | **Risk**: 3/10 | **Interview Frequency**: ★★★★☆
>
> Interval problems are relatively easy to conceptualize but notoriously tricky to implement flawlessly due to edge cases (e.g., `[1,4]` and `[4,5]` — do they overlap?). Mastering intervals is purely about mastering the sorting step and knowing exactly when to update the `end` boundary.

---

## Intervals Overview

### The Meta-Strategy
Almost every interval problem follows this exact 3-step process:
1. **Sort**: Sort the intervals based on their **start** time. If start times are equal, you usually don't need to sort by end time, but it doesn't hurt. `intervals.sort(key=lambda x: x[0])`.
2. **Initialize**: Create a `results` list. Push the first interval into `results`.
3. **Iterate and Merge**: Loop through the remaining intervals. Compare the *current* interval with the *last* interval in the `results` list.
   - If they overlap (i.e., `current.start <= last.end`), merge them by updating the `end` of the last interval: `last.end = max(last.end, current.end)`.
   - If they don't overlap, append `current` to `results`.

### What defines an Overlap?
Given Interval A `[startA, endA]` and Interval B `[startB, endB]` (where A is sorted before B, so `startA <= startB`):
**Overlap occurs if: `startB <= endA`**
*(Note: If the problem states `[1, 4]` and `[4, 5]` do NOT overlap, the condition becomes `startB < endA`).*

---

## Pattern 6.1: Merge Intervals

### Pattern Description
The foundational pattern. Given a collection of intervals, merge all overlapping ones into a consolidated list of disjoint intervals.

### Core Invariant
**Sort by start time. Iterate. If `curr.start <= prev.end`, update `prev.end = max(prev.end, curr.end)`. Else, add `curr` to results.**

### Curated Questions

---

##### Q1: Merge Intervals
| Field | Value |
|-------|-------|
| **Platform** | LeetCode |
| **Link** | https://leetcode.com/problems/merge-intervals/ |
| **Difficulty** | Medium |
| **Companies** | Amazon, Meta, Google, Microsoft |
| **Topic** | Intervals |
| **Pattern** | Merge Intervals |
| **Frequency** | ★★★★★ (5/5) |

**Key Observation**: The textbook application of the pattern. Remember to use `max()` when updating the end boundary, because a subsequent interval might be fully swallowed by the previous one (e.g., `[1, 10]` and `[2, 5]`).

**Time Complexity**: O(N log N) due to sorting.
**Space Complexity**: O(N) for the results array (or O(log N) for sorting algorithms in languages like Python/Java).

---

##### Q2: Insert Interval
| Field | Value |
|-------|-------|
| **Platform** | LeetCode |
| **Link** | https://leetcode.com/problems/insert-interval/ |
| **Difficulty** | Medium |
| **Companies** | Google, Meta, Amazon |
| **Topic** | Intervals |
| **Pattern** | Merge Intervals (Pre-sorted) |
| **Frequency** | ★★★★★ (5/5) |

**Key Observation**: The list is ALREADY sorted. Don't append and resort (that makes it O(N log N)). Do it in O(N).
1. Add all intervals ending *before* the `newInterval` starts.
2. While intervals overlap with `newInterval`, merge them into `newInterval` (`new_start = min(...)`, `new_end = max(...)`).
3. Add the merged `newInterval`.
4. Add the remaining intervals.

**Time Complexity**: O(N)
**Space Complexity**: O(N)

---

## Pattern 6.2: Interval Intersections

### Pattern Description
Finding the overlapping regions between two separate, sorted lists of disjoint intervals.

### Core Invariant
**Use Two Pointers (`i` for list A, `j` for list B). An intersection exists if `max(A[i].start, B[j].start) <= min(A[i].end, B[j].end)`. The pointer that moves forward is the one whose interval ends *first*, because it has exhausted its potential to overlap with anything else.**

### Curated Questions

---

##### Q1: Interval List Intersections
| Field | Value |
|-------|-------|
| **Platform** | LeetCode |
| **Link** | https://leetcode.com/problems/interval-list-intersections/ |
| **Difficulty** | Medium |
| **Companies** | Meta, Amazon, Uber |
| **Topic** | Intervals |
| **Pattern** | Two Pointer Intersections |
| **Frequency** | ★★★★★ (5/5) |

**Key Observation**: 
`start_max = max(A[i][0], B[j][0])`
`end_min = min(A[i][1], B[j][1])`
If `start_max <= end_min`, they overlap. The overlap is `[start_max, end_min]`.
Advance pointer `i` if `A[i][1] < B[j][1]`, else advance `j`.

**Time Complexity**: O(N + M)
**Space Complexity**: O(1) (excluding output list)

---

## Pattern 6.3: Non-Overlapping / Greedy Intervals

### Pattern Description
You need to find the minimum number of intervals to remove to make the rest disjoint, or the maximum number of non-overlapping intervals you can pick.

### Core Invariant
**Sort by END time, not start time. (Or sort by start time and track the minimum end time). If an overlap occurs, greedily keep the interval that ends *earlier*, because it leaves more room for subsequent intervals.**

### Curated Questions

---

##### Q1: Non-overlapping Intervals
| Field | Value |
|-------|-------|
| **Platform** | LeetCode |
| **Link** | https://leetcode.com/problems/non-overlapping-intervals/ |
| **Difficulty** | Medium |
| **Companies** | Meta, Amazon, Google |
| **Topic** | Intervals |
| **Pattern** | Greedy Intervals |
| **Frequency** | ★★★★☆ (4/5) |

**Key Observation**: This is exactly the classic Activity Selection problem. Sort intervals by `end` time. Track `prev_end`. Iterate: if `curr.start >= prev_end`, we can include this interval (`prev_end = curr.end`). If they overlap, we MUST remove one. To minimize removals, we always keep the one ending earlier (which we already did by sorting by end time, so we just increment `removals` and don't update `prev_end`).

*(Note: If sorting by start time, when an overlap happens, you must explicitly update `prev_end = min(prev_end, curr.end)`).*

**Time Complexity**: O(N log N)
**Space Complexity**: O(1)

---

##### Q2: Minimum Number of Arrows to Burst Balloons
| Field | Value |
|-------|-------|
| **Platform** | LeetCode |
| **Link** | https://leetcode.com/problems/minimum-number-of-arrows-to-burst-balloons/ |
| **Difficulty** | Medium |
| **Companies** | Amazon, Meta |
| **Topic** | Intervals |
| **Pattern** | Greedy Intervals |
| **Frequency** | ★★★☆☆ (3/5) |

**Key Observation**: Functionally identical to Non-overlapping Intervals. Sort by end time. An arrow shot at `prev_end` bursts everything starting before or at `prev_end`. When you find a balloon starting strictly *after* `prev_end`, you need a new arrow, and `prev_end` becomes this new balloon's end.

**Time Complexity**: O(N log N)
**Space Complexity**: O(1)

---
