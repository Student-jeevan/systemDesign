# Topic 12: Binary Search Tree (BST) — Complete Coverage

> **Priority**: #22 (Maintenance) | **Risk**: 2/10 | **Interview Frequency**: ★★★★☆
>
> We covered validating and searching a BST in Topic 11 (Trees). This topic focuses purely on standard BST operations (Insert, Delete, LCA) and structural properties.

---

## BST Overview

### Core Invariant
**For every node, all nodes in its left subtree are strictly less than its value, and all nodes in its right subtree are strictly greater.**

### Time Complexity
- Average Case (balanced): `O(log N)` for Search, Insert, Delete.
- Worst Case (skewed line): `O(N)`.

---

## Pattern 12.1: BST Traversal / Value Extraction

### Pattern Description
Exploiting the fact that an In-Order traversal of a BST yields a perfectly sorted array.

### Curated Questions

---

##### Q1: Kth Smallest Element in a BST (Covered in Trees)
*(Note: See Topic 11 for details. In-order traversal tracks a counter until it hits k).*

##### Q2: Construct Binary Search Tree from Preorder Traversal
| Field | Value |
|-------|-------|
| **Platform** | LeetCode |
| **Link** | https://leetcode.com/problems/construct-binary-search-tree-from-preorder-traversal/ |
| **Difficulty** | Medium |
| **Companies** | Amazon |
| **Topic** | BST |
| **Pattern** | Structural Range |
| **Frequency** | ★★★☆☆ (3/5) |

**Key Observation**: In Preorder (Root, Left, Right), the first element is the root. We can use a recursive function `build(bound)`.
We process the array. If the current value exceeds the `bound` passed from the parent, return `null`. Otherwise, create node, increment array index. `node.left = build(node.val)`, `node.right = build(bound)`.

**Time Complexity**: O(N)
**Space Complexity**: O(N)

---

## Pattern 12.2: Structural Modification (Delete / Insert)

### Pattern Description
Modifying the BST while maintaining the core invariant. Insertion is easy. Deletion is the hardest basic BST operation.

### Curated Questions

---

##### Q1: Delete Node in a BST
| Field | Value |
|-------|-------|
| **Platform** | LeetCode |
| **Link** | https://leetcode.com/problems/delete-node-in-a-bst/ |
| **Difficulty** | Medium |
| **Companies** | Amazon, Microsoft |
| **Topic** | BST |
| **Pattern** | Modification |
| **Frequency** | ★★★★☆ (4/5) |

**Key Observation**: Find the node. There are 3 cases:
1. No children: return `null`.
2. One child: return the non-null child.
3. Two children: Find the *in-order successor* (the smallest node in the right subtree). Copy its value to the current node, then recursively delete the in-order successor from the right subtree.

**Time Complexity**: O(H) (Height of tree)
**Space Complexity**: O(H) for recursion stack.

---

##### Q2: Lowest Common Ancestor of a BST (Covered in Trees)
*(Note: See Topic 11 for details. If `p` and `q` are both smaller than root, go left. If both larger, go right. Else, root is LCA).*

---
