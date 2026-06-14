# Topic 1: Arrays & Hashing — Complete Coverage

> **Priority**: #19 (Maintenance) | **Risk**: 1/10 | **Interview Frequency**: ★★★★★
>
> Arrays and Hash Maps are the bread and butter of programming. Every interview will involve them to some extent. Standalone Array/Hashing problems usually test your ability to utilize auxiliary space (Hash Maps/Sets) to reduce O(N^2) time to O(N), or to manipulate array indices cleverly.

---

## Arrays & Hashing Overview

### The Meta-Strategy
- **Need O(1) Lookups?** Use a Hash Map (`Map<Key, Value>`) or Hash Set (`Set<Key>`).
- **Need to count frequencies?** Use a Hash Map.
- **Need to track if you've seen something before?** Use a Hash Set.
- **Need to map characters?** Use an integer array of size 26 (if only lowercase English letters) or 256 (if ASCII) instead of a Hash Map for better performance.

### Array Manipulation Tricks
- **In-place modifications**: Swapping elements, using the array itself as a hash map (e.g., negating values at indices to mark them as visited).
- **Prefix/Suffix computations**: Precomputing data going left-to-right and right-to-left (Covered in Prefix Sum topic).

---

## Pattern 1.1: Hashing for Fast Lookup

### Pattern Description
Using a Hash Map or Set to remember elements you've seen previously, turning a nested loop (O(N^2)) into a single pass (O(N)).

### Core Invariant
**Iterate through the array. Check if the "complement" or "required element" exists in the Hash Map. If it does, you've found the answer. If not, add the current element to the Hash Map and continue.**

### Curated Questions

---

##### Q1: Two Sum
| Field | Value |
|-------|-------|
| **Platform** | LeetCode |
| **Link** | https://leetcode.com/problems/two-sum/ |
| **Difficulty** | Easy |
| **Companies** | Amazon, Meta, Google, Microsoft, Apple |
| **Topic** | Arrays & Hashing |
| **Pattern** | Hashing for Lookup |
| **Frequency** | ★★★★★ (5/5) |

**Key Observation**: Instead of checking every pair, iterate once. For each `num`, calculate `complement = target - num`. If `complement` is in the map, return their indices. Else, store `map[num] = current_index`.

**Time Complexity**: O(N)
**Space Complexity**: O(N)

---

##### Q2: Contains Duplicate
| Field | Value |
|-------|-------|
| **Platform** | LeetCode |
| **Link** | https://leetcode.com/problems/contains-duplicate/ |
| **Difficulty** | Easy |
| **Companies** | Amazon, Microsoft, Apple |
| **Topic** | Arrays & Hashing |
| **Pattern** | Hash Set |
| **Frequency** | ★★★★★ (5/5) |

**Key Observation**: Insert elements into a Hash Set. If `set.size() < array.length`, there are duplicates. Alternatively, check if element exists before inserting.

**Time Complexity**: O(N)
**Space Complexity**: O(N)

---

## Pattern 1.2: Hashing Frequencies / Anagrams

### Pattern Description
Counting occurrences of elements or characters.

### Core Invariant
**Iterate and build a frequency map. Then iterate again (either over the array or the map's keys) to evaluate conditions based on those frequencies.**

### Curated Questions

---

##### Q1: Valid Anagram
| Field | Value |
|-------|-------|
| **Platform** | LeetCode |
| **Link** | https://leetcode.com/problems/valid-anagram/ |
| **Difficulty** | Easy |
| **Companies** | Amazon, Meta, Google |
| **Topic** | Arrays & Hashing |
| **Pattern** | Frequency Array |
| **Frequency** | ★★★★★ (5/5) |

**Key Observation**: If lengths differ, return false. Use an array `counts[26]`. Increment for characters in string `s`, decrement for characters in string `t`. If all counts are 0, they are anagrams.

**Time Complexity**: O(N)
**Space Complexity**: O(1) (array of size 26)

---

##### Q2: Group Anagrams
| Field | Value |
|-------|-------|
| **Platform** | LeetCode |
| **Link** | https://leetcode.com/problems/group-anagrams/ |
| **Difficulty** | Medium |
| **Companies** | Amazon, Meta, Microsoft, Uber |
| **Topic** | Arrays & Hashing |
| **Pattern** | Hashing with Custom Key |
| **Frequency** | ★★★★★ (5/5) |

**Key Observation**: How do we group strings? We need a universal "key" for all anagrams.
Approach 1: Sort the string. `eat` -> `aet`, `tea` -> `aet`. Key is the sorted string. (O(N * K log K)).
Approach 2: Build a frequency array of size 26, convert it to a string/tuple, and use *that* as the key. (O(N * K)).

**Time Complexity**: O(N * K) where K is max word length.
**Space Complexity**: O(N * K)

---

## Pattern 1.3: In-Place Array Operations

### Pattern Description
Modifying the array without using extra `O(N)` space. Often requires using the array indices themselves as a Hash Map.

### Core Invariant
**Since numbers are in the range `[1, N]`, we can use `nums[i] - 1` as an index. To mark an index as "seen", negate the value at that index: `nums[index] = -abs(nums[index])`.**

### Curated Questions

---

##### Q1: Find All Numbers Disappeared in an Array
| Field | Value |
|-------|-------|
| **Platform** | LeetCode |
| **Link** | https://leetcode.com/problems/find-all-numbers-disappeared-in-an-array/ |
| **Difficulty** | Easy |
| **Companies** | Google, Amazon |
| **Topic** | Arrays |
| **Pattern** | In-Place Index Hashing |
| **Frequency** | ★★★★☆ (4/5) |

**Key Observation**: Iterate through `nums`. For each `val`, go to index `abs(val) - 1`. Make the number there negative.
After the first pass, any index `i` that has a *positive* number means the value `i + 1` never appeared in the array.

**Time Complexity**: O(N)
**Space Complexity**: O(1) (excluding output array)

---

## Pattern 1.4: Matrix / 2D Arrays

### Pattern Description
Traversing or modifying a 2D matrix.

### Curated Questions

---

##### Q1: Valid Sudoku
| Field | Value |
|-------|-------|
| **Platform** | LeetCode |
| **Link** | https://leetcode.com/problems/valid-sudoku/ |
| **Difficulty** | Medium |
| **Companies** | Amazon, Meta, Microsoft |
| **Topic** | Arrays & Hashing |
| **Pattern** | 2D Hashing |
| **Frequency** | ★★★★☆ (4/5) |

**Key Observation**: You need to check rows, columns, and 3x3 sub-boxes.
Use arrays of HashSets (or bitmasks for efficiency).
Row sets: `rows[9]`. Col sets: `cols[9]`. Box sets: `boxes[9]`.
The box index for cell `(r, c)` is `(r // 3) * 3 + (c // 3)`.
Iterate once. If a number is already in the corresponding row, col, or box set, return false.

**Time Complexity**: O(1) (matrix is exactly 9x9)
**Space Complexity**: O(1)

---
