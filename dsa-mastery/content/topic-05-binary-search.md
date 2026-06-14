# Topic 5: Binary Search — Complete Coverage

> **Priority**: #5 (Critical) | **Risk**: 8/10 | **Interview Frequency**: ★★★★★
>
> Binary Search is notorious for off-by-one errors. You can understand the logic perfectly but still fail the interview because your `while` loop condition was `<` instead of `<=` or you updated `left = mid` instead of `left = mid + 1` and got an infinite loop. The key is to memorize ONE robust template and use it for everything.

---

## Binary Search Overview

### The Ultimate Binary Search Template
Instead of memorizing different loop conditions and updates, learn this one template that finds the **first `true`** in a boolean array (e.g., `[F, F, F, T, T, T]`).

```python
def binary_search(array):
    left = 0
    right = len(array) # Note: right is out of bounds initially!
    
    while left < right:
        mid = left + (right - left) // 2
        
        if condition(mid): # Is this a valid answer (a 'True')?
            right = mid    # Keep looking left for a better (earlier) 'True'
        else:
            left = mid + 1 # This is a 'False', the first 'True' MUST be to the right
            
    # At the end, left == right, and points to the FIRST 'True'.
    # If all elements are 'False', left == len(array).
    return left
```

### Why This Template Is Bulletproof:
1. `while left < right`: The loop terminates when `left == right`. You never have to guess whether the answer is at `left` or `right` after the loop. They are the same.
2. `mid = left + (right - left) // 2`: Prevents integer overflow (relevant in C++/Java) and biases `mid` towards `left`.
3. `right = len(array)`: Because the answer might be "none of the elements work", `len(array)` acts as our "Not Found" state.

---

## Pattern 5.1: Basic Binary Search

### Pattern Description
Finding a specific target in a sorted array. Using the ultimate template, we can rephrase "Find target" as "Find the first element >= target". If that element equals target, we found it.

### Core Invariant
**The array must be sorted. We are searching for an exact match.**

### Curated Questions

---

##### Q1: Binary Search
| Field | Value |
|-------|-------|
| **Platform** | LeetCode |
| **Link** | https://leetcode.com/problems/binary-search/ |
| **Difficulty** | Easy |
| **Companies** | Amazon, Microsoft, Apple |
| **Topic** | Binary Search |
| **Pattern** | Basic |
| **Frequency** | ★★★★★ (5/5) |

**Key Observation**: Use standard template.

**Time Complexity**: O(log n)
**Space Complexity**: O(1)

---

## Pattern 5.2: Search Range (First and Last Position)

### Pattern Description
Finding the boundaries of a sequence of identical elements in a sorted array.

### Core Invariant
**Find the first `x >= target` (lower bound). Then find the first `x > target` (upper bound). The last occurrence is `upper_bound - 1`.**

### Curated Questions

---

##### Q1: Find First and Last Position of Element in Sorted Array
| Field | Value |
|-------|-------|
| **Platform** | LeetCode |
| **Link** | https://leetcode.com/problems/find-first-and-last-position-of-element-in-sorted-array/ |
| **Difficulty** | Medium |
| **Companies** | Meta, Amazon, LinkedIn |
| **Topic** | Binary Search |
| **Pattern** | Search Range |
| **Frequency** | ★★★★★ (5/5) |

**Key Observation**: Use the template twice.
1. `condition(mid)`: `nums[mid] >= target`. Result is `start`.
2. `condition(mid)`: `nums[mid] > target`. Result is `end`.
Return `[start, end - 1]`. (Check bounds and existence first!)

**Time Complexity**: O(log n)
**Space Complexity**: O(1)

---

## Pattern 5.3: Search in Rotated Sorted Array

### Pattern Description
The array is sorted but then rotated (e.g., `[4,5,6,7,0,1,2]`). Direct binary search fails because it's not strictly monotonic.

### Core Invariant
**At least one half of the array (left or right) is ALWAYS perfectly sorted. We check if the target lies within the perfectly sorted half. If it does, we search that half. If not, we discard that half.**

### Curated Questions

---

##### Q1: Search in Rotated Sorted Array
| Field | Value |
|-------|-------|
| **Platform** | LeetCode |
| **Link** | https://leetcode.com/problems/search-in-rotated-sorted-array/ |
| **Difficulty** | Medium |
| **Companies** | Meta, Amazon, Microsoft, Bloomberg |
| **Topic** | Binary Search |
| **Pattern** | Rotated Array |
| **Frequency** | ★★★★★ (5/5) |

**Key Observation**:
If `nums[left] <= nums[mid]`, the left half is sorted.
If `nums[left] <= target < nums[mid]`, search left. Else search right.
Otherwise, the right half must be sorted.
If `nums[mid] < target <= nums[right]`, search right. Else search left.

**Time Complexity**: O(log n)
**Space Complexity**: O(1)

---

##### Q2: Find Minimum in Rotated Sorted Array
| Field | Value |
|-------|-------|
| **Platform** | LeetCode |
| **Link** | https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/ |
| **Difficulty** | Medium |
| **Companies** | Amazon, Microsoft |
| **Topic** | Binary Search |
| **Pattern** | Rotated Array |
| **Frequency** | ★★★★☆ (4/5) |

**Key Observation**: Compare `nums[mid]` with `nums[right]`. If `nums[mid] < nums[right]`, the minimum is in the left half (including mid). `right = mid`. If `nums[mid] > nums[right]`, minimum is in the right half (excluding mid). `left = mid + 1`.

**Time Complexity**: O(log n)
**Space Complexity**: O(1)

---

## Pattern 5.4: Binary Search on Answer (Minimax / Maximin)

### Pattern Description
This is the most powerful application of Binary Search in competitive programming and hard interviews. The array itself might not be sorted, but the *search space of answers* is monotonic.
Example: "Find the minimum capacity required to ship packages within D days".
- Can I ship with capacity 10? False.
- Capacity 20? False.
- Capacity 30? True.
- Capacity 40? True.
The boolean array is `[F, F, T, T]`. We use the template to find the first `True`!

### Core Invariant
**Define a function `isValid(x)` that returns True if condition is met with answer `x`. The result of `isValid(x)` must be monotonic (e.g., `False, False, True, True`). Binary search over the range of possible values for `x`.**

### Recognition Signals
- "Find the minimum X such that condition Y holds."
- "Maximize the minimum distance..."
- "Minimize the maximum cost..."

### Curated Questions

---

##### Q1: Koko Eating Bananas
| Field | Value |
|-------|-------|
| **Platform** | LeetCode |
| **Link** | https://leetcode.com/problems/koko-eating-bananas/ |
| **Difficulty** | Medium |
| **Companies** | Meta, Amazon, Airbnb |
| **Topic** | Binary Search |
| **Pattern** | BS on Answer |
| **Frequency** | ★★★★★ (5/5) |

**Key Observation**: The answer `k` (bananas/hour) ranges from `1` to `max(piles)`. `isValid(k)` checks if total hours to eat all piles is `<= h`. Since higher `k` means fewer hours, it's monotonic. First `True` is our answer.

**Time Complexity**: O(n log M) where M is max(piles)
**Space Complexity**: O(1)

---

##### Q2: Split Array Largest Sum
| Field | Value |
|-------|-------|
| **Platform** | LeetCode |
| **Link** | https://leetcode.com/problems/split-array-largest-sum/ |
| **Difficulty** | Hard |
| **Companies** | Google, Amazon |
| **Topic** | Binary Search |
| **Pattern** | BS on Answer (Minimize the Max) |
| **Frequency** | ★★★★☆ (4/5) |

**Key Observation**: Search space for the sum is `[max(nums), sum(nums)]`. `isValid(mid)` checks if we can split the array into `<= k` subarrays such that no subarray sum exceeds `mid`. First `True` is the answer.

**Time Complexity**: O(n log(sum - max))
**Space Complexity**: O(1)

---

## Pattern 5.5: Binary Search on 2D Matrix

### Pattern Description
Searching in a matrix where rows and columns are sorted.

### Core Invariant
**Treat the 2D matrix as a 1D array OR start from a corner where movement directions have opposite effects on value.**

### Curated Questions

---

##### Q1: Search a 2D Matrix
| Field | Value |
|-------|-------|
| **Platform** | LeetCode |
| **Link** | https://leetcode.com/problems/search-a-2d-matrix/ |
| **Difficulty** | Medium |
| **Companies** | Amazon, Microsoft |
| **Topic** | Binary Search |
| **Pattern** | 2D Matrix |
| **Frequency** | ★★★★☆ (4/5) |

**Key Observation**: The matrix is strictly sorted. Treat it as a 1D array of length `m * n`. Convert 1D index to 2D using `row = idx / n`, `col = idx % n`.

**Time Complexity**: O(log(m*n))
**Space Complexity**: O(1)

---

##### Q2: Search a 2D Matrix II
| Field | Value |
|-------|-------|
| **Platform** | LeetCode |
| **Link** | https://leetcode.com/problems/search-a-2d-matrix-ii/ |
| **Difficulty** | Medium |
| **Companies** | Amazon, Microsoft |
| **Topic** | Binary Search |
| **Pattern** | 2D Matrix (Corner Traversal) |
| **Frequency** | ★★★★☆ (4/5) |

**Key Observation**: The matrix is sorted by row and col, but rows don't strictly continue to the next. Start at top-right corner. If `val > target`, move left (decrease val). If `val < target`, move down (increase val).

**Time Complexity**: O(m + n)
**Space Complexity**: O(1)

---
