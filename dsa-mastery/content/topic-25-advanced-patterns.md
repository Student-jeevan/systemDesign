# Topic 25: Advanced Interview Patterns — Complete Coverage

> **Priority**: #7 (High ROI) | **Risk**: 9/10 | **Interview Frequency**: ★★★☆☆
>
> Advanced Patterns separate the L4s from the L5/L6s at top tech companies. These are specialized techniques that, if you don't know them, are nearly impossible to invent on the spot during a 45-minute interview. They include Sweep Line, Prefix Sum variants, Rolling Hash, and specialized Two Pointer tricks.

---

## Pattern 25.1: Sweep Line (Line Sweep) Algorithm

### Pattern Description
Imagine a vertical line sweeping horizontally across a 2D plane (or a 1D timeline). Instead of evaluating every point in continuous space, the sweep line "stops" only at critical events (e.g., start points and end points of intervals). At each stop, it updates a running state.

### Core Invariant
**Sort all events (starts and ends) by their x-coordinate (or time). Process events in order. Starts typically add to a running state (+1), and ends remove from it (-1). The max/min/sum of this running state during the sweep is your answer.**

### Recognition Signals
- "Maximum concurrent events/meetings/intersections."
- "Calculate the total area/perimeter of overlapping rectangles."
- Multiple intervals where you care about the density of overlaps, not just whether an overlap exists.

### Curated Questions

---

##### Q1: Meeting Rooms II (Sweep Line variant)
| Field | Value |
|-------|-------|
| **Platform** | LeetCode |
| **Link** | https://leetcode.com/problems/meeting-rooms-ii/ |
| **Difficulty** | Medium |
| **Companies** | Meta, Amazon, Bloomberg |
| **Topic** | Advanced Patterns |
| **Pattern** | Sweep Line |
| **Frequency** | ★★★★★ (5/5) |

**Key Observation**: Transform intervals `[start, end]` into two events: `(start, +1)` and `(end, -1)`. Sort the events by time. *Crucial tie-breaker*: If a start and end happen at the exact same time, process the end (`-1`) *before* the start (`+1`) to free up the room. Keep a running sum of active meetings. The max of this sum is the answer.

**Time Complexity**: O(n log n)
**Space Complexity**: O(n)

---

##### Q2: The Skyline Problem
| Field | Value |
|-------|-------|
| **Platform** | LeetCode |
| **Link** | https://leetcode.com/problems/the-skyline-problem/ |
| **Difficulty** | Hard |
| **Companies** | Google, Meta, Amazon |
| **Topic** | Advanced Patterns |
| **Pattern** | Sweep Line + Heap |
| **Frequency** | ★★★★☆ (4/5) |

**Key Observation**: Events are the left and right edges of buildings. We need to track the *maximum active height* at any given x-coordinate. 
1. Convert `[L, R, H]` into `(L, -H)` (start event, negative to sort taller heights first) and `(R, H)` (end event).
2. Sort events by x-coordinate.
3. Use a Max-Heap to track active heights. For a start event, add height. For an end event, remove height.
4. If the max height changes after processing an event, we have a key point in the skyline.

*(Note: Removing arbitrary elements from a standard heap is O(N). To optimize, use lazy deletion or a TreeMap (Java) / multiset (C++) for O(log N) operations).*

**Time Complexity**: O(n log n)
**Space Complexity**: O(n)

---

## Pattern 25.2: Rolling Hash (Rabin-Karp)

### Pattern Description
Used for string matching in `O(n)` time. Instead of comparing strings character by character `O(m)`, we compare their integer hash values in `O(1)`. The "rolling" part means we can compute the hash of a sliding window in `O(1)` time by mathematically removing the oldest character and adding the newest.

### Core Invariant
**Hash function is based on a polynomial: `Hash = c1*base^k + c2*base^(k-1) + ... + ck*base^0 % MOD`. To slide the window right: `NewHash = ((OldHash - OldChar * base^k) * base + NewChar) % MOD`.**

### Recognition Signals
- "Find the longest repeating substring."
- "Find all occurrences of pattern in text" (when KMP is too hard to implement).
- "Check if two strings are permutations/cyclic shifts."

### Curated Questions

---

##### Q1: Longest Duplicate Substring
| Field | Value |
|-------|-------|
| **Platform** | LeetCode |
| **Link** | https://leetcode.com/problems/longest-duplicate-substring/ |
| **Difficulty** | Hard |
| **Companies** | Amazon, Google |
| **Topic** | Advanced Patterns |
| **Pattern** | Binary Search + Rolling Hash |
| **Frequency** | ★★★☆☆ (3/5) |

**Key Observation**: The length of the duplicate substring is monotonic (if a duplicate of length 10 exists, length 9 exists). Binary search on the length `L`. To check if a duplicate of length `L` exists, use Rolling Hash to hash all windows of length `L` and store them in a HashSet.

**Time Complexity**: O(n log n)
**Space Complexity**: O(n)

---

##### Q2: Repeated String Match
| Field | Value |
|-------|-------|
| **Platform** | LeetCode |
| **Link** | https://leetcode.com/problems/repeated-string-match/ |
| **Difficulty** | Medium |
| **Companies** | Google |
| **Topic** | Advanced Patterns |
| **Pattern** | Rabin-Karp |
| **Frequency** | ★★★☆☆ (3/5) |

**Key Observation**: Repeat `A` until its length is `>= B.length`. If `B` is a substring, it must be found here or by adding one more `A`. Use Rabin-Karp to efficiently check if `B` is a substring.

**Time Complexity**: O(m + n)
**Space Complexity**: O(m + n)

---

## Pattern 25.3: Moore's Voting Algorithm

### Pattern Description
An incredibly elegant, O(N) time and O(1) space algorithm to find the majority element (an element appearing strictly more than `N/2` times).

### Core Invariant
**If we cancel out each occurrence of the majority element with a different element, the majority element will still remain at the end.**

### Curated Questions

---

##### Q1: Majority Element
| Field | Value |
|-------|-------|
| **Platform** | LeetCode |
| **Link** | https://leetcode.com/problems/majority-element/ |
| **Difficulty** | Easy |
| **Companies** | Amazon, Meta, Microsoft |
| **Topic** | Advanced Patterns |
| **Pattern** | Moore's Voting |
| **Frequency** | ★★★★★ (5/5) |

**Key Observation**: Track `candidate` and `count`. If `count == 0`, `candidate = num`. If `num == candidate`, `count++`, else `count--`.

**Time Complexity**: O(n)
**Space Complexity**: O(1)

---

##### Q2: Majority Element II
| Field | Value |
|-------|-------|
| **Platform** | LeetCode |
| **Link** | https://leetcode.com/problems/majority-element-ii/ |
| **Difficulty** | Medium |
| **Companies** | Amazon, Google |
| **Topic** | Advanced Patterns |
| **Pattern** | Extended Moore's Voting |
| **Frequency** | ★★★☆☆ (3/5) |

**Key Observation**: Find elements appearing more than `N/3` times. There can be at most 2 such elements. Track `candidate1`, `count1` and `candidate2`, `count2`. Verify the candidates with a second pass.

**Time Complexity**: O(n)
**Space Complexity**: O(1)

---

## Pattern 25.4: Tortoise and Hare (Cycle Detection)

### Pattern Description
Using two pointers moving at different speeds to detect cycles in linked lists or arrays that act like linked lists.

### Core Invariant
**If a cycle exists, the fast pointer (moving 2 steps) will eventually lap the slow pointer (moving 1 step) inside the cycle.**
**To find the cycle start: When they meet, reset one pointer to the start. Move both 1 step at a time. They will meet at the cycle start.**

### Curated Questions

---

##### Q1: Find the Duplicate Number
| Field | Value |
|-------|-------|
| **Platform** | LeetCode |
| **Link** | https://leetcode.com/problems/find-the-duplicate-number/ |
| **Difficulty** | Medium |
| **Companies** | Amazon, Microsoft, Meta |
| **Topic** | Advanced Patterns |
| **Pattern** | Tortoise and Hare |
| **Frequency** | ★★★★★ (5/5) |

**Key Observation**: Given `N+1` numbers in range `[1, N]`, treat the array as a linked list where `nums[i]` points to the index `nums[i]`. The duplicate number is the start of the cycle.

**Time Complexity**: O(n)
**Space Complexity**: O(1)

---

## Pattern 25.5: Difference Array

### Pattern Description
Used when you need to apply multiple range updates (e.g., "add X to all elements from index L to R") and only need to query the array at the end.

### Core Invariant
**Instead of updating `L` to `R` in `O(N)` time, update `diff[L] += X` and `diff[R+1] -= X` in `O(1)` time. A prefix sum of the `diff` array reconstructs the final array.**

### Curated Questions

---

##### Q1: Corporate Flight Bookings
| Field | Value |
|-------|-------|
| **Platform** | LeetCode |
| **Link** | https://leetcode.com/problems/corporate-flight-bookings/ |
| **Difficulty** | Medium |
| **Companies** | Amazon |
| **Topic** | Advanced Patterns |
| **Pattern** | Difference Array |
| **Frequency** | ★★★☆☆ (3/5) |

**Key Observation**: For booking `[first, last, seats]`, `diff[first - 1] += seats`, `diff[last] -= seats`. Prefix sum yields the result.

**Time Complexity**: O(n + bookings)
**Space Complexity**: O(n)

---

## Pattern 25.6: KMP (Knuth-Morris-Pratt) Pattern Matching

### Pattern Description
Finding a substring within a string in strict `O(N+M)` time, avoiding the worst-case `O(N*M)` of naive matching. It precomputes an LPS (Longest Proper Prefix which is also Suffix) array for the pattern to know exactly how far to shift the pattern when a mismatch occurs.

*(Note: Rare in standard interviews, but highly valued for string-heavy domains or staff-level roles).*

### Curated Questions

---

##### Q1: Implement strStr()
| Field | Value |
|-------|-------|
| **Platform** | LeetCode |
| **Link** | https://leetcode.com/problems/find-the-index-of-the-first-occurrence-in-a-string/ |
| **Difficulty** | Easy |
| **Companies** | Amazon, Microsoft, Apple |
| **Topic** | Advanced Patterns |
| **Pattern** | KMP |
| **Frequency** | ★★★☆☆ (3/5) |

**Key Observation**: Construct the LPS array for the needle. Traverse the haystack. On mismatch at `needle[j]`, jump `j` to `LPS[j-1]`.

**Time Complexity**: O(n + m)
**Space Complexity**: O(m)
