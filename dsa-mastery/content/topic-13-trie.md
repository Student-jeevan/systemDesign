# Topic 13: Trie (Prefix Tree) — Complete Coverage

> **Priority**: #15 (Consolidation) | **Risk**: 4/10 | **Interview Frequency**: ★★★★☆
>
> A Trie (pronounced "try") is a specialized tree used almost exclusively for string matching, prefix searching, and occasionally bitwise operations. It trades space for blistering `O(L)` time complexity, where L is the length of the string, regardless of how many strings are in the dictionary.

---

## Trie Overview

### The Structure of a Trie Node
Unlike Binary Trees where nodes have a `left` and `right` child, a Trie Node typically has an array or Hash Map of children (one for each character in the alphabet) and a boolean flag.

```python
class TrieNode:
    def __init__(self):
        # Using a Hash Map is more space-efficient than an array of size 26
        # if the tree is sparse or if characters include unicode/symbols.
        self.children = {} 
        self.is_word = False
```

### Time & Space Complexity
- **Insert**: O(L) time, O(L) space (where L is the word length).
- **Search / StartsWith**: O(L) time, O(1) space.
- **Total Space**: O(N * L * AlphabetSize) in the absolute worst-case where no words share prefixes, but significantly better in practice due to prefix sharing.

---

## Pattern 13.1: Standard Prefix Tree Implementation

### Pattern Description
Implementing the core `insert`, `search`, and `startsWith` methods from scratch. This is a fundamental interview question.

### Core Invariant
**Start at the root. For each character, if it doesn't exist in the current node's `children`, create a new `TrieNode`. Move to that child. When the word ends, mark the current node's `is_word` as True.**

### Curated Questions

---

##### Q1: Implement Trie (Prefix Tree)
| Field | Value |
|-------|-------|
| **Platform** | LeetCode |
| **Link** | https://leetcode.com/problems/implement-trie-prefix-tree/ |
| **Difficulty** | Medium |
| **Companies** | Amazon, Google, Microsoft, Meta |
| **Topic** | Trie |
| **Pattern** | Standard Implementation |
| **Frequency** | ★★★★★ (5/5) |

**Key Observation**: 
- `insert`: Traverse/build nodes for each char. Set `is_word = True` at the end.
- `search`: Traverse nodes. If a char is missing, return False. At the end, return `curr.is_word`.
- `startsWith`: Traverse nodes. If a char is missing, return False. At the end, return True (even if `is_word` is False).

**Time Complexity**: O(L) per operation.
**Space Complexity**: O(N * L) for storing N words.

---

## Pattern 13.2: Trie + DFS / Backtracking

### Pattern Description
Using a Trie to optimize searches on a 2D grid or to answer queries involving wildcards.

### Core Invariant
**When exploring paths (like in a grid), instead of doing a full DFS and checking if the resulting string is in a dictionary, pass the current `TrieNode` along with the DFS. If `node.children` doesn't contain the next character, you can immediately prune the search.**

### Curated Questions

---

##### Q1: Design Add and Search Words Data Structure
| Field | Value |
|-------|-------|
| **Platform** | LeetCode |
| **Link** | https://leetcode.com/problems/design-add-and-search-words-data-structure/ |
| **Difficulty** | Medium |
| **Companies** | Meta, Amazon, Google |
| **Topic** | Trie |
| **Pattern** | Trie + DFS (Wildcard) |
| **Frequency** | ★★★★★ (5/5) |

**Key Observation**: The `search` word can contain dots `'.'` which match any letter.
Use standard Trie insertion. For `search`, write a recursive helper: `def dfs(index, node)`.
If `word[index] == '.'`, iterate through ALL `node.children.values()` and recursively call `dfs(index + 1, child)`. If any return True, return True.
If it's a normal character, follow the standard path.

**Time Complexity**: O(M) for words without dots. O(N * 26^M) worst case for all dots.
**Space Complexity**: O(M) for recursion stack.

---

##### Q2: Word Search II (Covered in Trees)
*(Note: Refer to Topic 11 (Trees) for the full breakdown. It combines a 2D Grid DFS with a Trie of all words to search for, allowing massive pruning).*

---

## Pattern 13.3: Map replacement / Prefix matching

### Pattern Description
Using a Trie to group, replace, or validate words based on their prefixes in a sentence.

### Curated Questions

---

##### Q1: Replace Words
| Field | Value |
|-------|-------|
| **Platform** | LeetCode |
| **Link** | https://leetcode.com/problems/replace-words/ |
| **Difficulty** | Medium |
| **Companies** | Uber, Amazon |
| **Topic** | Trie |
| **Pattern** | Prefix Matching |
| **Frequency** | ★★★★☆ (4/5) |

**Key Observation**: Insert all "roots" (prefixes) into a Trie.
For each word in the sentence, traverse the Trie. As soon as you hit a node where `is_word == True`, you've found the shortest root. Replace the word and stop traversing.

**Time Complexity**: O(N) where N is the length of the sentence.
**Space Complexity**: O(Dictionary Size).

---

## Pattern 13.4: Bitwise Trie (XOR Problems)

### Pattern Description
A highly advanced application. Instead of characters, the Trie stores the bits of binary numbers (0s and 1s) from most significant bit (MSB) to least significant bit (LSB).

### Core Invariant
**To find the maximum XOR pair for a number `X`, insert all numbers into a Bitwise Trie. Then, for `X`, traverse the Trie trying to take the *opposite* bit at every step (because `1 ^ 0 = 1`, maximizing the result). If the opposite bit doesn't exist, you are forced to take the same bit.**

### Curated Questions

---

##### Q1: Maximum XOR of Two Numbers in an Array
| Field | Value |
|-------|-------|
| **Platform** | LeetCode |
| **Link** | https://leetcode.com/problems/maximum-xor-of-two-numbers-in-an-array/ |
| **Difficulty** | Medium / Hard |
| **Companies** | Google |
| **Topic** | Trie |
| **Pattern** | Bitwise Trie |
| **Frequency** | ★★★☆☆ (3/5) |

**Key Observation**: 
1. Build a Trie where each node has `children = [None, None]` (for bit 0 and bit 1).
2. Insert all numbers (as 32-bit sequences).
3. For each number, calculate its max XOR by traversing the Trie, preferring the bit `1 - current_bit`. Track the resulting XOR value. Return the global max.

**Time Complexity**: O(N * 32) = O(N)
**Space Complexity**: O(N * 32) = O(N)

---
