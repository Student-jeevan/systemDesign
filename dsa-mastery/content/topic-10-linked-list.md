# Topic 10: Linked List — Complete Coverage

> **Priority**: #21 (Maintenance) | **Risk**: 1/10 | **Interview Frequency**: ★★★★☆
>
> Linked List problems are tests of your pointer manipulation skills. Can you keep track of `prev`, `curr`, and `next` without losing references and creating memory leaks/null pointer exceptions? The concepts are simple, but the code must be flawless.

---

## Linked List Overview

### The Golden Rules of Linked Lists
1. **Always check for `head == null` or `head.next == null`** as your base case.
2. **Use a Dummy Node:** When the `head` of the list might change (e.g., removing the first element, reversing, merging), create a `dummy` node where `dummy.next = head`. Return `dummy.next` at the end. This eliminates 90% of edge cases.
3. **Save the `next` pointer:** Before you change `curr.next`, you MUST save `temp = curr.next`, otherwise you lose the rest of the list forever.

---

## Pattern 10.1: In-Place Reversal

### Pattern Description
Reversing links between nodes without using extra space.

### Core Invariant
**Maintain `prev` (initially `null`) and `curr` (initially `head`). Loop while `curr` is not null: save `next = curr.next`, reverse the link `curr.next = prev`, advance `prev = curr`, advance `curr = next`. Return `prev`.**

### Curated Questions

---

##### Q1: Reverse Linked List
| Field | Value |
|-------|-------|
| **Platform** | LeetCode |
| **Link** | https://leetcode.com/problems/reverse-linked-list/ |
| **Difficulty** | Easy |
| **Companies** | Amazon, Meta, Apple, Microsoft |
| **Topic** | Linked List |
| **Pattern** | Reversal |
| **Frequency** | ★★★★★ (5/5) |

**Key Observation**: Standard reversal. Memorize the 4 lines of code in the core invariant.
**Time Complexity**: O(N)
**Space Complexity**: O(1)

---

##### Q2: Reverse Nodes in k-Group
| Field | Value |
|-------|-------|
| **Platform** | LeetCode |
| **Link** | https://leetcode.com/problems/reverse-nodes-in-k-group/ |
| **Difficulty** | Hard |
| **Companies** | Amazon, Microsoft, Meta |
| **Topic** | Linked List |
| **Pattern** | Group Reversal |
| **Frequency** | ★★★★★ (5/5) |

**Key Observation**: Use a dummy node. Maintain a `groupPrev` pointer (the node right before the `k` group).
1. Check if there are `k` nodes left. If not, break.
2. Get the `k`th node. This is the `groupNext`.
3. Reverse the `k` nodes using standard reversal, but stop when `curr == groupNext`.
4. Connect `groupPrev.next` to the `k`th node (the new head of this reversed group).
5. Update `groupPrev` to be the *original* first node of the group (which is now the last node).

**Time Complexity**: O(N)
**Space Complexity**: O(1)

---

## Pattern 10.2: Fast and Slow Pointers (Tortoise & Hare)

### Pattern Description
Using two pointers moving at different speeds to find the middle of a list, or to detect cycles.

### Core Invariant
**`slow` moves 1 step, `fast` moves 2 steps. If `fast` reaches null, the list has no cycle and `slow` is at the middle. If `fast == slow`, there is a cycle.**

### Curated Questions

---

##### Q1: Linked List Cycle II
| Field | Value |
|-------|-------|
| **Platform** | LeetCode |
| **Link** | https://leetcode.com/problems/linked-list-cycle-ii/ |
| **Difficulty** | Medium |
| **Companies** | Amazon, Microsoft |
| **Topic** | Linked List |
| **Pattern** | Cycle Detection |
| **Frequency** | ★★★★☆ (4/5) |

**Key Observation**: Once `slow` and `fast` meet inside the cycle, reset `slow` to `head`. Move BOTH pointers at 1 step per loop. The node where they meet again is the exact start of the cycle. (Floyd's Cycle Finding Algorithm).

**Time Complexity**: O(N)
**Space Complexity**: O(1)

---

##### Q2: Reorder List
| Field | Value |
|-------|-------|
| **Platform** | LeetCode |
| **Link** | https://leetcode.com/problems/reorder-list/ |
| **Difficulty** | Medium |
| **Companies** | Meta, Amazon |
| **Topic** | Linked List |
| **Pattern** | Multi-Pattern |
| **Frequency** | ★★★★★ (5/5) |

**Key Observation**: Combines three patterns into one problem:
1. Find the middle using Fast & Slow pointers.
2. Reverse the second half of the list.
3. Merge the two halves by alternating nodes.

**Time Complexity**: O(N)
**Space Complexity**: O(1)

---

## Pattern 10.3: Merge and Two Pointers

### Pattern Description
Merging two sorted lists or finding intersections using a pointer in each list.

### Curated Questions

---

##### Q1: Merge Two Sorted Lists
| Field | Value |
|-------|-------|
| **Platform** | LeetCode |
| **Link** | https://leetcode.com/problems/merge-two-sorted-lists/ |
| **Difficulty** | Easy |
| **Companies** | Amazon, Microsoft, Apple |
| **Topic** | Linked List |
| **Pattern** | Merging |
| **Frequency** | ★★★★★ (5/5) |

**Key Observation**: Use a `dummy` node. Maintain a `tail` pointer. While `l1` and `l2` are not null, append the smaller one to `tail.next` and advance that list's pointer. After the loop, append whichever list is not null.

**Time Complexity**: O(N+M)
**Space Complexity**: O(1)

---
