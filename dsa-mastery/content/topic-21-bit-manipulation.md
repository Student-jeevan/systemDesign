# Topic 21: Bit Manipulation — Complete Coverage

> **Priority**: #23 (Maintenance) | **Risk**: 2/10 | **Interview Frequency**: ★★☆☆☆
>
> Bit manipulation is rarely the core of an interview unless you're interviewing for systems programming or quantitative finance. However, knowing the basic XOR trick and bitmask operations is a powerful tool to have in your back pocket.

---

## Bit Manipulation Overview

### Core Operators
- `&` (AND): Returns 1 if both bits are 1. Used to mask/clear bits.
- `|` (OR): Returns 1 if either bit is 1. Used to set bits.
- `^` (XOR): Returns 1 if bits are different. `n ^ n = 0`, `n ^ 0 = n`.
- `~` (NOT): Flips all bits.
- `<<` (Left Shift): `n << 1` multiplies by 2.
- `>>` (Right Shift): `n >> 1` divides by 2.

### Critical Tricks
1. **Check if power of 2**: `(n > 0) && (n & (n - 1)) == 0`
2. **Remove the lowest set bit**: `n & (n - 1)`
3. **Isolate the lowest set bit**: `n & -n`
4. **Multiply/Divide by 2**: `n << 1` and `n >> 1`

---

## Pattern 21.1: XOR Tricks

### Pattern Description
Using the property that identical numbers XOR to 0, and 0 XOR any number is the number itself.

### Curated Questions

---

##### Q1: Single Number
| Field | Value |
|-------|-------|
| **Platform** | LeetCode |
| **Link** | https://leetcode.com/problems/single-number/ |
| **Difficulty** | Easy |
| **Companies** | Amazon, Microsoft |
| **Topic** | Bit Manipulation |
| **Pattern** | XOR |
| **Frequency** | ★★★★★ (5/5) |

**Key Observation**: Every element appears twice except for one. XORing all elements together cancels out the duplicates, leaving only the single number. `res ^= num`.

**Time Complexity**: O(N)
**Space Complexity**: O(1)

---

##### Q2: Missing Number
| Field | Value |
|-------|-------|
| **Platform** | LeetCode |
| **Link** | https://leetcode.com/problems/missing-number/ |
| **Difficulty** | Easy |
| **Companies** | Amazon |
| **Topic** | Bit Manipulation |
| **Pattern** | XOR / Math |
| **Frequency** | ★★★★☆ (4/5) |

**Key Observation**: 
Approach 1 (Math): Sum of `1..n` is `n*(n+1)/2`. Subtract array sum.
Approach 2 (XOR): XOR all array indices and array values together. The missing number will be left over.

**Time Complexity**: O(N)
**Space Complexity**: O(1)

---

## Pattern 21.2: Bit Counting

### Pattern Description
Counting the number of 1s in the binary representation of a number.

### Curated Questions

---

##### Q1: Number of 1 Bits (Hamming Weight)
| Field | Value |
|-------|-------|
| **Platform** | LeetCode |
| **Link** | https://leetcode.com/problems/number-of-1-bits/ |
| **Difficulty** | Easy |
| **Companies** | Apple, Microsoft |
| **Topic** | Bit Manipulation |
| **Pattern** | Bit Masking |
| **Frequency** | ★★★★☆ (4/5) |

**Key Observation**: While `n > 0`, do `n &= (n-1)` and increment count. This strips the lowest set bit one by one.

**Time Complexity**: O(1) (max 32 iterations)
**Space Complexity**: O(1)

---

##### Q2: Counting Bits
| Field | Value |
|-------|-------|
| **Platform** | LeetCode |
| **Link** | https://leetcode.com/problems/counting-bits/ |
| **Difficulty** | Easy |
| **Companies** | Amazon, Meta |
| **Topic** | Bit Manipulation + DP |
| **Pattern** | Bit Counting |
| **Frequency** | ★★★★☆ (4/5) |

**Key Observation**: Return an array counting 1s for all numbers from `0` to `n`.
`dp[i] = dp[i >> 1] + (i & 1)`. 
(The number of 1s in `i` is the number of 1s in `i / 2` plus 1 if `i` is odd).

**Time Complexity**: O(N)
**Space Complexity**: O(N)

---
