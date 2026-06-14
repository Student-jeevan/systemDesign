# Topic 22: Segment Tree — Complete Coverage

> **Priority**: #24 (Maintenance) | **Risk**: 1/10 | **Interview Frequency**: ★☆☆☆☆
>
> Segment Trees are extremely rare in standard interviews, usually reserved for competitive programming or hyper-specific HFT/trading firm interviews. They are used for answering range queries (Sum, Min, Max) on an array where the array elements are *frequently updated*.

---

## Segment Tree Overview

### Why not Prefix Sum?
Prefix Sum arrays answer range sum queries in `O(1)` time. However, if you update an element in the array, you have to rebuild the prefix sum array from that point forward, which takes `O(N)` time. 
A Segment Tree allows BOTH updates and queries to happen in `O(log N)` time.

### The Structure
A Segment Tree is a binary tree where:
- The root represents the entire array `[0, N-1]`.
- Each leaf represents a single element `[i, i]`.
- An internal node represents the combined result (sum/min/max) of its two children, effectively covering the range `[start, end]`.

---

## Pattern 22.1: Point Update & Range Query

### Pattern Description
Building a segment tree from an array, updating single indices, and querying ranges.

### Curated Questions

---

##### Q1: Range Sum Query - Mutable
| Field | Value |
|-------|-------|
| **Platform** | LeetCode |
| **Link** | https://leetcode.com/problems/range-sum-query-mutable/ |
| **Difficulty** | Medium |
| **Companies** | Google, Amazon |
| **Topic** | Segment Tree |
| **Pattern** | Range Sum |
| **Frequency** | ★★☆☆☆ (2/5) |

**Key Observation**: The problem explicitly requires O(log N) updates and O(log N) queries.
You can implement this using an array representation of a binary tree (size 4N is standard safe size) or using explicit TreeNode classes.

**Time Complexity**: `build`: O(N). `update`: O(log N). `query`: O(log N).
**Space Complexity**: O(N)

---

##### Q2: Count of Smaller Numbers After Self
| Field | Value |
|-------|-------|
| **Platform** | LeetCode |
| **Link** | https://leetcode.com/problems/count-of-smaller-numbers-after-self/ |
| **Difficulty** | Hard |
| **Companies** | Google, Amazon, Microsoft |
| **Topic** | Segment Tree (or Merge Sort) |
| **Pattern** | Value Range Query |
| **Frequency** | ★★☆☆☆ (2/5) |

**Key Observation**: Iterate from right to left. We need to know how many elements we've already seen that are smaller than the current element.
We can use a Segment Tree (or Fenwick Tree) where the "indices" are the actual *values* (or compressed values). For `nums[i]`, we query the sum in the tree for the range `[min_val, nums[i] - 1]`, then we update the tree by incrementing the count at index `nums[i]`.

**Time Complexity**: O(N log N)
**Space Complexity**: O(N)

---
