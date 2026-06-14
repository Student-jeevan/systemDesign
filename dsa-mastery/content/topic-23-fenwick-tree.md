# Topic 23: Fenwick Tree (Binary Indexed Tree) — Complete Coverage

> **Priority**: #25 (Maintenance) | **Risk**: 1/10 | **Interview Frequency**: ★☆☆☆☆
>
> A Fenwick Tree (Binary Indexed Tree / BIT) solves the exact same problem as a Segment Tree (Range Sum Queries with Point Updates) but is significantly easier to code, uses exactly O(N) space, and has smaller constant factors. However, it only works for inverse operations (like Sum, but NOT Min/Max).

---

## Fenwick Tree Overview

### The Magic of LSB
The entire data structure relies on isolating the Lowest Set Bit (LSB) of an index `i`.
`LSB(i) = i & -i`

A Fenwick Tree is simply a 1-indexed array.
- **To update an element at index `i`**: You add the value to `tree[i]`, then move to the next responsible index by adding the LSB (`i += i & -i`), and repeat until you hit the end of the array.
- **To query the sum from `1` to `i`**: You add `tree[i]` to your total, then move to the previous responsible index by subtracting the LSB (`i -= i & -i`), and repeat until `i == 0`.

### The Template
```python
class FenwickTree:
    def __init__(self, size):
        self.tree = [0] * (size + 1)
        
    def update(self, i, delta):
        while i < len(self.tree):
            self.tree[i] += delta
            i += i & -i
            
    def query(self, i):
        s = 0
        while i > 0:
            s += self.tree[i]
            i -= i & -i
        return s
```

---

## Pattern 23.1: BIT Operations

### Curated Questions

---

##### Q1: Range Sum Query - Mutable (Covered in Segment Tree)
*(Note: Implementing the template above solves this perfectly. O(log N) for both `update` and `query`).*

##### Q2: Count Inversions in an Array
| Field | Value |
|-------|-------|
| **Platform** | Classic Interview |
| **Difficulty** | Hard |
| **Companies** | Google |
| **Topic** | Fenwick Tree / Merge Sort |
| **Pattern** | Frequency Counting |
| **Frequency** | ★★☆☆☆ (2/5) |

**Key Observation**: An inversion is a pair `(i, j)` where `i < j` but `nums[i] > nums[j]`.
Iterate the array right-to-left. For each number, query the Fenwick Tree to count how many numbers smaller than it have already been seen. Add this to the total. Then update the Fenwick Tree to record that we've seen this number.
*(Note: Requires coordinate compression if numbers are large, or just use Merge Sort).*

**Time Complexity**: O(N log N)
**Space Complexity**: O(N)

---
