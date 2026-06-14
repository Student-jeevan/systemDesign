# Topic 3: Sliding Window — Complete Coverage

> **Priority**: #12 (Consolidation) | **Risk**: 4/10 | **Interview Frequency**: ★★★★★
>
> Sliding Window is a subset of the Two Pointers technique. It transforms O(N²) nested loops into a single O(N) pass. The hallmark of a sliding window problem is maintaining a contiguous subsegment (array or string) that satisfies a specific condition.

---

## Sliding Window Overview

### The Meta-Strategy
A sliding window consists of two pointers, usually `left` and `right`.
1. Expand the window by moving `right` and incorporating `nums[right]` into the window's state.
2. If the window violates the required condition (or if it reaches a fixed size), shrink the window by moving `left` and removing `nums[left]` from the window's state until the condition is satisfied again.
3. Update your global answer (max length, min length, etc.) either right after expanding or right after shrinking, depending on the problem.

### Fixed vs. Variable Windows
- **Fixed Size**: The window length `K` is constant. You move both `left` and `right` simultaneously once the window hits size `K`.
- **Variable Size**: The window expands as much as possible until a constraint is broken, then shrinks just enough to become valid again.

---

## Pattern 3.1: Fixed Size Window

### Pattern Description
You are given a specific window size `K`. You must find the maximum/minimum sum, average, or number of elements within any contiguous subarray of size `K`.

### Core Invariant
**Maintain a running state (e.g., sum). Add `nums[i]`. If `i >= K`, remove `nums[i - K]`. Once `i >= K - 1`, the window is fully formed and you can evaluate the state.**

### Curated Questions

---

##### Q1: Maximum Average Subarray I
| Field | Value |
|-------|-------|
| **Platform** | LeetCode |
| **Link** | https://leetcode.com/problems/maximum-average-subarray-i/ |
| **Difficulty** | Easy |
| **Companies** | Meta, Amazon |
| **Topic** | Sliding Window |
| **Pattern** | Fixed Size |
| **Frequency** | ★★★★★ (5/5) |

**Key Observation**: Instead of recalculating the sum of `K` elements every time, subtract the element leaving the window and add the element entering the window.

**Time Complexity**: O(N)
**Space Complexity**: O(1)

---

##### Q2: Find All Anagrams in a String
| Field | Value |
|-------|-------|
| **Platform** | LeetCode |
| **Link** | https://leetcode.com/problems/find-all-anagrams-in-a-string/ |
| **Difficulty** | Medium |
| **Companies** | Amazon, Microsoft, Uber |
| **Topic** | Sliding Window |
| **Pattern** | Fixed Size with Hash Map |
| **Frequency** | ★★★★☆ (4/5) |

**Key Observation**: The window size is exactly `p.length`. Maintain a frequency array of size 26 for the current window and compare it to the frequency array of string `p`.

**Time Complexity**: O(N)
**Space Complexity**: O(1) (array of size 26)

---

## Pattern 3.2: Variable Size - Longest Valid Substring/Subarray

### Pattern Description
Find the maximum length of a contiguous subarray that satisfies a condition (e.g., sum <= K, at most K distinct characters).

### Core Invariant
**Expand the window by incrementing `right`. While the condition is INVALID, shrink the window by incrementing `left`. Update the maximum length AFTER the inner `while` loop finishes (because the window is now guaranteed to be valid).**

```python
left = 0
max_len = 0
for right in range(len(nums)):
    # 1. Add nums[right] to state
    
    while invalid():
        # 2. Remove nums[left] from state
        left += 1
        
    # 3. Window is valid here
    max_len = max(max_len, right - left + 1)
```

### Curated Questions

---

##### Q1: Longest Substring Without Repeating Characters
| Field | Value |
|-------|-------|
| **Platform** | LeetCode |
| **Link** | https://leetcode.com/problems/longest-substring-without-repeating-characters/ |
| **Difficulty** | Medium |
| **Companies** | Amazon, Meta, Microsoft, Google |
| **Topic** | Sliding Window |
| **Pattern** | Variable Size (Longest) |
| **Frequency** | ★★★★★ (5/5) |

**Key Observation**: Use a HashSet to track characters in the window. If `s[right]` is in the set, keep removing `s[left]` and incrementing `left` until `s[right]` is no longer in the set.
*(Optimization: Use a HashMap to store the last seen index of each character, allowing `left` to jump directly to `map[s[right]] + 1`).*

**Time Complexity**: O(N)
**Space Complexity**: O(min(N, M)) where M is the charset size.

---

##### Q2: Longest Repeating Character Replacement
| Field | Value |
|-------|-------|
| **Platform** | LeetCode |
| **Link** | https://leetcode.com/problems/longest-repeating-character-replacement/ |
| **Difficulty** | Medium |
| **Companies** | Google, Amazon, Meta |
| **Topic** | Sliding Window |
| **Pattern** | Variable Size (Longest) |
| **Frequency** | ★★★★★ (5/5) |

**Key Observation**: A window is valid if `(window_length) - (most_frequent_char_count) <= k`.
We don't need to strictly maintain the maximum frequency when shrinking the window; the global maximum length only changes when we find a historical maximum frequency that is even larger.

**Time Complexity**: O(N)
**Space Complexity**: O(1) (array of size 26)

---

##### Q3: Max Consecutive Ones III
| Field | Value |
|-------|-------|
| **Platform** | LeetCode |
| **Link** | https://leetcode.com/problems/max-consecutive-ones-iii/ |
| **Difficulty** | Medium |
| **Companies** | Meta, Amazon, Microsoft |
| **Topic** | Sliding Window |
| **Pattern** | Variable Size (Longest) |
| **Frequency** | ★★★★☆ (4/5) |

**Key Observation**: Rephrase the problem: "Find the longest contiguous subarray that contains at most `K` zeros." Track the zero count in the window. While `zeros > K`, move `left` and decrement zero count if `nums[left] == 0`.

**Time Complexity**: O(N)
**Space Complexity**: O(1)

---

## Pattern 3.3: Variable Size - Shortest Valid Substring/Subarray

### Pattern Description
Find the minimum length of a contiguous subarray that satisfies a condition (e.g., sum >= K, contains all characters of a target string).

### Core Invariant
**Expand the window by incrementing `right`. While the condition is VALID, update the minimum length, then shrink the window by incrementing `left`. (Update min length INSIDE the `while` loop, right before shrinking).**

```python
left = 0
min_len = infinity
for right in range(len(nums)):
    # 1. Add nums[right] to state
    
    while valid():
        # 2. Window is valid here, update min_len
        min_len = min(min_len, right - left + 1)
        
        # 3. Remove nums[left] from state
        left += 1
```

### Curated Questions

---

##### Q1: Minimum Size Subarray Sum
| Field | Value |
|-------|-------|
| **Platform** | LeetCode |
| **Link** | https://leetcode.com/problems/minimum-size-subarray-sum/ |
| **Difficulty** | Medium |
| **Companies** | Google, Amazon, Meta |
| **Topic** | Sliding Window |
| **Pattern** | Variable Size (Shortest) |
| **Frequency** | ★★★★★ (5/5) |

**Key Observation**: Since all numbers are positive, the sum monotonically increases as the window expands. While `sum >= target`, update `min_len` and shrink from the left.

**Time Complexity**: O(N)
**Space Complexity**: O(1)

---

##### Q2: Minimum Window Substring
| Field | Value |
|-------|-------|
| **Platform** | LeetCode |
| **Link** | https://leetcode.com/problems/minimum-window-substring/ |
| **Difficulty** | Hard |
| **Companies** | Meta, Amazon, LinkedIn, Uber |
| **Topic** | Sliding Window |
| **Pattern** | Variable Size (Shortest) |
| **Frequency** | ★★★★★ (5/5) |

**Key Observation**: Maintain a `target_map` and a `window_map`. Track a `have` variable (how many unique characters meet the required frequency) and a `need` variable (total unique characters in target). While `have == need`, record the string length, and try shrinking the window by moving `left`.

**Time Complexity**: O(S + T)
**Space Complexity**: O(1) (Hash map size is bounded by charset).

---

## Pattern 3.4: Count Number of Valid Subarrays

### Pattern Description
Counting the exact number of subarrays that meet a condition (e.g., exactly K distinct characters).

### Core Invariant
**"Exactly K" is hard. "At most K" is easy.
Use the principle: `Exactly(K) = AtMost(K) - AtMost(K-1)`.
For "At most K", the number of valid subarrays ending at index `right` is exactly `right - left + 1`.**

### Curated Questions

---

##### Q1: Subarrays with K Different Integers
| Field | Value |
|-------|-------|
| **Platform** | LeetCode |
| **Link** | https://leetcode.com/problems/subarrays-with-k-different-integers/ |
| **Difficulty** | Hard |
| **Companies** | Amazon, Google |
| **Topic** | Sliding Window |
| **Pattern** | Counting Subarrays |
| **Frequency** | ★★★☆☆ (3/5) |

**Key Observation**: Trying to count exactly K in one pass leads to complicated logic involving a third pointer. Using the `AtMost(K)` helper function is extremely clean and reliable.

**Time Complexity**: O(N)
**Space Complexity**: O(N)

---
