# Topic 2: Two Pointers — Complete Coverage

> **Priority**: #18 (Consolidation) | **Risk**: 2/10 | **Interview Frequency**: ★★★★★
>
> Two Pointers is one of the first techniques you learn, but it scales up to extremely difficult problems. The core advantage is reducing `O(N^2)` time complexity to `O(N)` or `O(N log N)` (if sorting is required first). 

---

## Two Pointers Overview

### The Meta-Strategy
Two Pointers generally falls into three distinct sub-patterns:
1. **Collision (Opposite Direction)**: One pointer starts at the beginning, the other at the end. They move towards each other until they meet. The array *must* be sorted for this to be useful (except for simple reversal/palindrome checks).
2. **Same Direction (Fast & Slow)**: Both pointers start at the beginning. One moves faster than the other. Used for cycle detection, removing duplicates, or finding the middle of a Linked List.
3. **Parallel (Two Arrays)**: One pointer in Array A, another in Array B. Used for merging or finding intersections.

---

## Pattern 2.1: Collision Pointers (Sorted Arrays)

### Pattern Description
You have a sorted array and need to find a pair of elements that satisfy a condition (usually a target sum).

### Core Invariant
**`left = 0`, `right = len(nums) - 1`. While `left < right`: evaluate the sum. If the sum is too small, increment `left` (to increase the sum). If the sum is too large, decrement `right` (to decrease the sum). If it's a match, return.**

### Curated Questions

---

##### Q1: Two Sum II - Input Array Is Sorted
| Field | Value |
|-------|-------|
| **Platform** | LeetCode |
| **Link** | https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/ |
| **Difficulty** | Medium |
| **Companies** | Amazon, Apple |
| **Topic** | Two Pointers |
| **Pattern** | Collision |
| **Frequency** | ★★★★★ (5/5) |

**Key Observation**: The textbook application of collision pointers. Because it's sorted, we are guaranteed to find the answer by safely discarding elements from the edges.

**Time Complexity**: O(N)
**Space Complexity**: O(1)

---

##### Q2: 3Sum
| Field | Value |
|-------|-------|
| **Platform** | LeetCode |
| **Link** | https://leetcode.com/problems/3sum/ |
| **Difficulty** | Medium |
| **Companies** | Meta, Amazon, Apple, Bloomberg |
| **Topic** | Two Pointers |
| **Pattern** | Collision + Traversal |
| **Frequency** | ★★★★★ (5/5) |

**Key Observation**: A classic interview question. 
1. Sort the array `O(N log N)`.
2. Iterate `i` from `0` to `len - 2`.
3. If `i > 0` and `nums[i] == nums[i-1]`, skip to prevent duplicate triplets.
4. Run Two Sum II (Collision Pointers) on the remaining array (`left = i + 1`, `right = len - 1`) targeting `-nums[i]`.
5. *Crucial*: When a match is found, increment `left` and decrement `right`. Then, skip any duplicate values for `left` and `right` to avoid duplicate triplets.

**Time Complexity**: O(N^2)
**Space Complexity**: O(1) or O(N) depending on sorting algorithm overhead.

---

##### Q3: Container With Most Water
| Field | Value |
|-------|-------|
| **Platform** | LeetCode |
| **Link** | https://leetcode.com/problems/container-with-most-water/ |
| **Difficulty** | Medium |
| **Companies** | Meta, Amazon, Google |
| **Topic** | Two Pointers |
| **Pattern** | Collision (Greedy optimization) |
| **Frequency** | ★★★★★ (5/5) |

**Key Observation**: Area = `min(height[left], height[right]) * (right - left)`.
Since the width `(right - left)` is strictly decreasing as we move pointers, the only way to find a *larger* area is to increase the height. Therefore, always move the pointer pointing to the *shorter* line.

**Time Complexity**: O(N)
**Space Complexity**: O(1)

---

## Pattern 2.2: Fast & Slow Pointers (Same Direction)

### Pattern Description
Pointers move in the same direction but at different speeds or based on different conditions. Common in Linked Lists (Tortoise & Hare) and in-place array modifications.

### Core Invariant
**The `fast` pointer iterates through the array. The `slow` pointer marks the boundary of the "valid" or "modified" section. When `fast` finds an element that belongs in the valid section, swap/copy it to the `slow` pointer and increment `slow`.**

### Curated Questions

---

##### Q1: Remove Duplicates from Sorted Array
| Field | Value |
|-------|-------|
| **Platform** | LeetCode |
| **Link** | https://leetcode.com/problems/remove-duplicates-from-sorted-array/ |
| **Difficulty** | Easy |
| **Companies** | Meta, Amazon, Microsoft |
| **Topic** | Two Pointers |
| **Pattern** | Fast & Slow |
| **Frequency** | ★★★★★ (5/5) |

**Key Observation**: `slow` tracks where the next unique element should be placed. `fast` iterates to find unique elements. If `nums[fast] != nums[slow - 1]`, then `nums[slow] = nums[fast]` and `slow++`.

**Time Complexity**: O(N)
**Space Complexity**: O(1)

---

## Pattern 2.3: Palindromes and String Reversals

### Pattern Description
Checking symmetric properties of arrays or strings using collision pointers.

### Curated Questions

---

##### Q1: Valid Palindrome
| Field | Value |
|-------|-------|
| **Platform** | LeetCode |
| **Link** | https://leetcode.com/problems/valid-palindrome/ |
| **Difficulty** | Easy |
| **Companies** | Meta, Amazon, Spotify |
| **Topic** | Two Pointers |
| **Pattern** | Collision |
| **Frequency** | ★★★★★ (5/5) |

**Key Observation**: Standard collision pointers. Skip non-alphanumeric characters. Convert to lowercase before comparing.

**Time Complexity**: O(N)
**Space Complexity**: O(1)

---
