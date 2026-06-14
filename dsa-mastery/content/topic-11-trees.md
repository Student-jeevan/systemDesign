# Topic 11: Trees — Complete Coverage

> **Priority**: #4 (Critical) | **Risk**: 5/10 | **Interview Frequency**: ★★★★★
>
> Trees are the most frequently asked topic in tech interviews. They test your ability to use recursion cleanly and handle base cases. If you struggle with recursion, you will struggle with trees. The key to mastering trees is understanding which traversal (pre-order, in-order, post-order, or level-order) is required for the specific problem.

---

## Trees Overview

### The Golden Rule of Tree Problems
**Almost all tree problems can be solved by answering two questions:**
1. What does this node need to know from its children? (Return value)
2. What does this node need to do with that information, and what does it pass up to its parent? (Processing logic)

If you can answer these two questions, you have the recursive function signature.

### The 4 Traversals

1. **Pre-order (Root, Left, Right)**
   - Use when: You need to explore a node before its children.
   - Typical patterns: Copying a tree, finding paths from root.

2. **In-order (Left, Root, Right)**
   - Use when: You need to visit nodes in ascending order in a Binary Search Tree (BST).
   - Typical patterns: Validating a BST, finding k-th smallest element.

3. **Post-order (Left, Right, Root)**
   - Use when: A node's calculation depends on the results from its children.
   - Typical patterns: Deleting a tree, calculating height/depth, Tree DP (e.g., House Robber III).

4. **Level-order (BFS)**
   - Use when: You need to process nodes level by level, or find the shortest path.
   - Typical patterns: Right side view, minimum depth, zig-zag traversal.

---

## Pattern 11.1: Tree DFS (Post-order / Bottom-Up)

### Pattern Description
This is the most common tree pattern. You traverse down to the leaves and bubble information back up. The processing happens *after* the recursive calls return. This is effectively "Tree DP" (Dynamic Programming on Trees).

### Core Invariant
**The recursive function returns information about the subtree. The parent node waits for both left and right children to return, combines their results with its own value, and returns the combined result to its parent.**

### Recognition Signals
- "Find the maximum/minimum/longest..."
- "Calculate the height/depth..."
- The answer for a node depends *entirely* on the answers from its subtrees.

### Curated Questions

---

##### Q1: Maximum Depth of Binary Tree
| Field | Value |
|-------|-------|
| **Platform** | LeetCode |
| **Link** | https://leetcode.com/problems/maximum-depth-of-binary-tree/ |
| **Difficulty** | Easy |
| **Companies** | Amazon, Microsoft, Apple |
| **Topic** | Trees |
| **Pattern** | Tree DFS (Post-order) |
| **Frequency** | ★★★★★ (5/5) |

**Key Observation**: `depth(node) = 1 + max(depth(node.left), depth(node.right))`

**Time Complexity**: O(n)
**Space Complexity**: O(h)

---

##### Q2: Diameter of Binary Tree
| Field | Value |
|-------|-------|
| **Platform** | LeetCode |
| **Link** | https://leetcode.com/problems/diameter-of-binary-tree/ |
| **Difficulty** | Easy |
| **Companies** | Meta, Amazon, Google |
| **Topic** | Trees |
| **Pattern** | Tree DFS (Post-order) |
| **Variation** | Global state update |
| **Frequency** | ★★★★★ (5/5) |

**Key Observation**: The longest path might not pass through the root. The DFS returns the height of the subtree. At each node, calculate the diameter passing through it (`left_height + right_height`) and update a global maximum.

**Time Complexity**: O(n)
**Space Complexity**: O(h)

---

##### Q3: Lowest Common Ancestor of a Binary Tree
| Field | Value |
|-------|-------|
| **Platform** | LeetCode |
| **Link** | https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-tree/ |
| **Difficulty** | Medium |
| **Companies** | Meta, Amazon, Microsoft, LinkedIn |
| **Topic** | Trees |
| **Pattern** | Tree DFS (Post-order) |
| **Frequency** | ★★★★★ (5/5) |

**Key Observation**: If current node is `p`, `q`, or `null`, return it. Search left and right. If both left and right return non-null, the current node is the LCA. If only one returns non-null, pass that non-null value up.

**Time Complexity**: O(n)
**Space Complexity**: O(h)

---

## Pattern 11.2: Tree DFS (Pre-order / Top-Down)

### Pattern Description
You pass state down from the parent to the children. The processing happens *before* the recursive calls.

### Core Invariant
**The recursive function takes parameters that represent accumulated state from the root down to the current node.**

### Recognition Signals
- "Find all paths from root to leaf."
- "Sum of root-to-leaf paths."
- The answer requires knowing the history of the path taken to reach the node.

### Curated Questions

---

##### Q1: Path Sum II
| Field | Value |
|-------|-------|
| **Platform** | LeetCode |
| **Link** | https://leetcode.com/problems/path-sum-ii/ |
| **Difficulty** | Medium |
| **Companies** | Amazon, Microsoft, Bloomberg |
| **Topic** | Trees |
| **Pattern** | Tree DFS (Pre-order / Backtracking) |
| **Frequency** | ★★★★☆ (4/5) |

**Key Observation**: Maintain the current path list and the current sum as you traverse down. When you hit a leaf, if the sum equals the target, add a *copy* of the path to the results. Backtrack by removing the last element when returning.

**Time Complexity**: O(n^2) worst case if all paths are valid and we copy them. O(n) for traversal.
**Space Complexity**: O(h) for recursion stack.

---

##### Q2: Sum Root to Leaf Numbers
| Field | Value |
|-------|-------|
| **Platform** | LeetCode |
| **Link** | https://leetcode.com/problems/sum-root-to-leaf-numbers/ |
| **Difficulty** | Medium |
| **Companies** | Meta, Amazon |
| **Topic** | Trees |
| **Pattern** | Tree DFS (Pre-order) |
| **Frequency** | ★★★★☆ (4/5) |

**Key Observation**: Pass the running number down: `current = current * 10 + node.val`. Return it at leaves.

**Time Complexity**: O(n)
**Space Complexity**: O(h)

---

## Pattern 11.3: Tree BFS (Level-Order Traversal)

### Pattern Description
Traverse the tree level by level using a Queue. The defining characteristic is the `size` loop inside the `while` loop, which processes exactly one level at a time.

### Core Invariant
**At the start of the `while` loop, the queue contains exactly all the nodes for the current level. Record `size = queue.size()`, then loop `size` times to process the current level and enqueue the next level's children.**

### Recognition Signals
- "Level by level", "Level order".
- "Right side view", "Left side view".
- "Shortest path" (though rare in basic trees, more common in graphs).
- "Minimum depth".

### Curated Questions

---

##### Q1: Binary Tree Level Order Traversal
| Field | Value |
|-------|-------|
| **Platform** | LeetCode |
| **Link** | https://leetcode.com/problems/binary-tree-level-order-traversal/ |
| **Difficulty** | Medium |
| **Companies** | Amazon, Microsoft, LinkedIn |
| **Topic** | Trees |
| **Pattern** | Tree BFS |
| **Frequency** | ★★★★★ (5/5) |

**Key Observation**: The classic BFS template with the inner `for` loop bounded by the queue size.

**Time Complexity**: O(n)
**Space Complexity**: O(n) (queue can hold roughly n/2 nodes at the bottom level)

---

##### Q2: Binary Tree Right Side View
| Field | Value |
|-------|-------|
| **Platform** | LeetCode |
| **Link** | https://leetcode.com/problems/binary-tree-right-side-view/ |
| **Difficulty** | Medium |
| **Companies** | Meta, Amazon, Bloomberg |
| **Topic** | Trees |
| **Pattern** | Tree BFS (or Pre-order with depth track) |
| **Frequency** | ★★★★★ (5/5) |

**Key Observation**: Using BFS, the rightmost element of a level is simply the last element processed in the inner `size` loop.

**Time Complexity**: O(n)
**Space Complexity**: O(n)

---

## Pattern 11.4: Tree Construction

### Pattern Description
Building a tree from arrays (usually traversal outputs like preorder + inorder) or serializing/deserializing a tree.

### Core Invariant
**Use the properties of traversals to identify the root, then partition the remaining elements into left and right subtrees. Recursively build them.**

### Recognition Signals
- "Construct binary tree from..."
- "Serialize and deserialize..."

### Curated Questions

---

##### Q1: Construct Binary Tree from Preorder and Inorder Traversal
| Field | Value |
|-------|-------|
| **Platform** | LeetCode |
| **Link** | https://leetcode.com/problems/construct-binary-tree-from-preorder-and-inorder-traversal/ |
| **Difficulty** | Medium |
| **Companies** | Amazon, Microsoft, Bloomberg |
| **Topic** | Trees |
| **Pattern** | Tree Construction |
| **Frequency** | ★★★★☆ (4/5) |

**Key Observation**: The first element in `preorder` is always the root. Find this root in `inorder`. Elements to its left in `inorder` form the left subtree; elements to its right form the right subtree. Use a HashMap for O(1) lookups in `inorder`.

**Time Complexity**: O(n)
**Space Complexity**: O(n)

---

##### Q2: Serialize and Deserialize Binary Tree
| Field | Value |
|-------|-------|
| **Platform** | LeetCode |
| **Link** | https://leetcode.com/problems/serialize-and-deserialize-binary-tree/ |
| **Difficulty** | Hard |
| **Companies** | Meta, Amazon, LinkedIn |
| **Topic** | Trees |
| **Pattern** | Tree Construction |
| **Frequency** | ★★★★★ (5/5) |

**Key Observation**: Pre-order traversal with a special marker (e.g., "N" or "#") for null pointers allows for unambiguous reconstruction. Alternatively, level-order with markers also works.

**Time Complexity**: O(n)
**Space Complexity**: O(n)

---

## Pattern 11.5: Binary Search Tree (BST) Properties

### Pattern Description
Leveraging the core property of a BST: `left < root < right`. In-order traversal of a BST yields a sorted array.

### Core Invariant
**Every node in the left subtree must be strictly less than the root, and every node in the right subtree must be strictly greater. This bounding range (min, max) must be passed down during validation.**

### Recognition Signals
- The problem explicitly mentions "Binary Search Tree" or "BST".
- "Validate", "K-th smallest", "In-order successor".

### Curated Questions

---

##### Q1: Validate Binary Search Tree
| Field | Value |
|-------|-------|
| **Platform** | LeetCode |
| **Link** | https://leetcode.com/problems/validate-binary-search-tree/ |
| **Difficulty** | Medium |
| **Companies** | Amazon, Bloomberg, Microsoft |
| **Topic** | Trees |
| **Pattern** | BST Properties |
| **Variation** | Range bounding |
| **Frequency** | ★★★★★ (5/5) |

**Key Observation**: A common mistake is just checking `left < root < right` for each node locally. This fails. You must pass down the valid range: `isValid(node, min_val, max_val)`. For the left child, the new max is `node.val`. For the right child, the new min is `node.val`.

**Time Complexity**: O(n)
**Space Complexity**: O(h)

---

##### Q2: Kth Smallest Element in a BST
| Field | Value |
|-------|-------|
| **Platform** | LeetCode |
| **Link** | https://leetcode.com/problems/kth-smallest-element-in-a-bst/ |
| **Difficulty** | Medium |
| **Companies** | Meta, Amazon, Google |
| **Topic** | Trees |
| **Pattern** | BST Properties |
| **Variation** | In-order traversal |
| **Frequency** | ★★★★☆ (4/5) |

**Key Observation**: In-order traversal processes nodes in sorted order. Keep a counter and return the node when `count == k`.

**Time Complexity**: O(h + k)
**Space Complexity**: O(h)

---

## Pattern 11.6: Tree Manipulation (Pointers & Structure)

### Pattern Description
Problems that require altering the structure of the tree, moving nodes, or converting the tree into a different data structure (like a linked list).

### Core Invariant
**Carefully save references to children before modifying pointers. Often requires returning the head or tail of the modified structure to the parent.**

### Curated Questions

---

##### Q1: Flatten Binary Tree to Linked List
| Field | Value |
|-------|-------|
| **Platform** | LeetCode |
| **Link** | https://leetcode.com/problems/flatten-binary-tree-to-linked-list/ |
| **Difficulty** | Medium |
| **Companies** | Meta, Amazon, Microsoft |
| **Topic** | Trees |
| **Pattern** | Tree Manipulation |
| **Frequency** | ★★★★☆ (4/5) |

**Key Observation**: Post-order traversal. Flatten left, flatten right. Then, attach the flattened left subtree to `root.right`, and attach the flattened right subtree to the end of that newly attached left subtree.

**Time Complexity**: O(n)
**Space Complexity**: O(h)

---

## Pattern 11.7: Lowest Common Ancestor (BST vs General Tree)

### Pattern Description
Finding the lowest node that has both `p` and `q` as descendants. The approach differs drastically between a BST and a regular Binary Tree.

### Core Invariant
**In a general tree, search both sides and bubble up findings (Pattern 11.1). In a BST, leverage the sorted property to navigate left or right without exploring the whole tree.**

### Curated Questions

---

##### Q1: Lowest Common Ancestor of a Binary Search Tree
| Field | Value |
|-------|-------|
| **Platform** | LeetCode |
| **Link** | https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-search-tree/ |
| **Difficulty** | Medium |
| **Companies** | Amazon, LinkedIn, Microsoft |
| **Topic** | Trees |
| **Pattern** | LCA in BST |
| **Frequency** | ★★★★★ (5/5) |

**Key Observation**: If both `p` and `q` are smaller than root, LCA is in left subtree. If both are larger, LCA is in right subtree. If they split (one smaller, one larger) OR if root equals `p` or `q`, the current root IS the LCA.

**Time Complexity**: O(h) (O(log n) for balanced)
**Space Complexity**: O(1) (can be done iteratively easily)

---

## Pattern 11.8: Trie (Prefix Tree) Integration

### Pattern Description
While Tries are their own topic, they are fundamentally trees. Problems often combine a Trie with DFS/Backtracking on a grid (like Boggle).

### Core Invariant
**Each node represents a character. The path from root to node represents a prefix. The `isWord` flag marks the end of a valid word.**

### Curated Questions

---

##### Q1: Word Search II
| Field | Value |
|-------|-------|
| **Platform** | LeetCode |
| **Link** | https://leetcode.com/problems/word-search-ii/ |
| **Difficulty** | Hard |
| **Companies** | Amazon, Microsoft, Uber |
| **Topic** | Trees (Trie) + Graph DFS |
| **Pattern** | Trie Integration |
| **Frequency** | ★★★★★ (5/5) |

**Key Observation**: Instead of searching the grid for every word (TLE), build a Trie of all words. Then, run DFS from every cell in the grid, simultaneously traversing the Trie.

**Time Complexity**: O(M * N * 4^L) where L is max word length.
**Space Complexity**: O(Total chars in words)

---
