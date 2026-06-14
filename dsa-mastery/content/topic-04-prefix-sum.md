# Topic 4: Prefix Sum — Complete Coverage

> **Priority**: #17 (Consolidation) | **Risk**: 3/10 | **Interview Frequency**: ★★★★★
>
> Prefix Sum is a mathematical trick to answer range sum queries in `O(1)` time after an `O(N)` precomputation. It frequently appears hidden inside HashMap problems where you are looking for subarrays that meet a certain sum or divisibility criteria.

---

## Prefix Sum Overview

### The Core Concept
Given an array `A`, a prefix sum array `P` is constructed where `P[i]` is the sum of all elements from `A[0]` to `A[i-1]`.
Usually, we make the prefix sum array 1-indexed (length `N+1`) with `P[0] = 0` to easily handle queries starting at index 0.

### The Magic Formula
**The sum of elements in the subarray `A[i...j]` (inclusive) is strictly: `P[j+1] - P[i]`**.
This reduces a potentially `O(N)` loop to a single `O(1)` subtraction.

---

## Pattern 4.1: Subarray Sum Equals Target

### Pattern Description
You want to find the number of contiguous subarrays that sum to a specific target `K`. The array can contain negative numbers (which breaks Sliding Window).

### Core Invariant
**If `Current_Prefix_Sum - K = Old_Prefix_Sum`, it means the subarray lying between the old prefix and the current index sums exactly to `K`. We use a Hash Map to store the frequencies of all `Old_Prefix_Sums` we have seen so far.**

### Curated Questions

---

##### Q1: Subarray Sum Equals K
| Field | Value |
|-------|-------|
| **Platform** | LeetCode |
| **Link** | https://leetcode.com/problems/subarray-sum-equals-k/ |
| **Difficulty** | Medium |
| **Companies** | Meta, Amazon, Google, Microsoft |
| **Topic** | Prefix Sum |
| **Pattern** | HashMap Subarray Sum |
| **Frequency** | ★★★★★ (5/5) |

**Key Observation**: 
1. Initialize `map = {0: 1}` (Base case: prefix sum of 0 has occurred 1 time before the array starts).
2. Track running `sum`.
3. For each num, `sum += num`.
4. If `sum - K` exists in map, add `map[sum - K]` to the result count.
5. Add the current `sum` to the map (increment its frequency).

**Time Complexity**: O(N)
**Space Complexity**: O(N)

---

##### Q2: Subarray Sums Divisible by K
| Field | Value |
|-------|-------|
| **Platform** | LeetCode |
| **Link** | https://leetcode.com/problems/subarray-sums-divisible-by-k/ |
| **Difficulty** | Medium |
| **Companies** | Amazon, Microsoft |
| **Topic** | Prefix Sum |
| **Pattern** | Modulo Subarray Sum |
| **Frequency** | ★★★★☆ (4/5) |

**Key Observation**: A subarray sums to a multiple of `K` if its start and end prefixes have the *same remainder* when divided by `K`.
(e.g., if prefix sum up to `i` is 14 (14 % 5 = 4), and up to `j` is 29 (29 % 5 = 4), the subarray sum is 15, which is divisible by 5).
Track frequencies of `prefix_sum % K` in a map. If you see the same remainder again, add its frequency to the result.
*Language Trap*: In Python/C++, negative numbers modulo `K` can yield negative remainders. Always normalize: `remainder = ((sum % K) + K) % K`.

**Time Complexity**: O(N)
**Space Complexity**: O(K)

---

##### Q3: Contiguous Array
| Field | Value |
|-------|-------|
| **Platform** | LeetCode |
| **Link** | https://leetcode.com/problems/contiguous-array/ |
| **Difficulty** | Medium |
| **Companies** | Meta, Amazon |
| **Topic** | Prefix Sum |
| **Pattern** | HashMap Subarray State |
| **Frequency** | ★★★★★ (5/5) |

**Key Observation**: Find the maximum length of a contiguous subarray with equal number of 0s and 1s.
Transform the problem: Treat 0s as `-1` and 1s as `1`. The problem is now "find the longest subarray that sums to 0".
Use a map storing the *first index* where a prefix sum was seen: `map = {0: -1}`.
When a sum repeats, the distance is `current_index - map[sum]`.

**Time Complexity**: O(N)
**Space Complexity**: O(N)

---

## Pattern 4.2: 2D Prefix Sum

### Pattern Description
Answering range sum queries on a 2D matrix in `O(1)` time.

### Core Invariant
**`P[r][c]` stores the sum of the rectangle from `(0,0)` to `(r-1, c-1)`.**
**Building it: `P[r][c] = matrix[r-1][c-1] + P[r-1][c] + P[r][c-1] - P[r-1][c-1]`**
**Querying `[r1, c1]` to `[r2, c2]`: `Sum = P[r2+1][c2+1] - P[r1][c2+1] - P[r2+1][c1] + P[r1][c1]`**

### Curated Questions

---

##### Q1: Range Sum Query 2D - Immutable
| Field | Value |
|-------|-------|
| **Platform** | LeetCode |
| **Link** | https://leetcode.com/problems/range-sum-query-2d-immutable/ |
| **Difficulty** | Medium |
| **Companies** | Meta, Amazon |
| **Topic** | Prefix Sum |
| **Pattern** | 2D Prefix Sum |
| **Frequency** | ★★★★☆ (4/5) |

**Key Observation**: Directly apply the 2D Prefix Sum invariant formulas. The `+1` offsets in the arrays prevent out-of-bounds errors when querying from row/col 0.

**Time Complexity**: O(M * N) to build, O(1) per query.
**Space Complexity**: O(M * N)

---

## Pattern 4.3: Prefix & Suffix Products / Arrays

### Pattern Description
Sometimes you need information from both the left side and the right side of an element.

### Core Invariant
**Precompute a `prefix` array going left-to-right, and a `suffix` array going right-to-left. The state at index `i` is a combination of `prefix[i-1]` and `suffix[i+1]`.**

### Curated Questions

---

##### Q1: Product of Array Except Self
| Field | Value |
|-------|-------|
| **Platform** | LeetCode |
| **Link** | https://leetcode.com/problems/product-of-array-except-self/ |
| **Difficulty** | Medium |
| **Companies** | Amazon, Apple, Meta, Microsoft |
| **Topic** | Prefix Sum (Product) |
| **Pattern** | Prefix/Suffix Arrays |
| **Frequency** | ★★★★★ (5/5) |

**Key Observation**: You cannot use division.
Pass 1 (Left to Right): `result[i]` stores the product of all elements to the left of `i`.
Pass 2 (Right to Left): Keep a running `right_product`. Multiply `result[i]` by `right_product`, then multiply `right_product` by `nums[i]`.
This achieves O(1) extra space (excluding the output array).

**Time Complexity**: O(N)
**Space Complexity**: O(1) extra space.

---
