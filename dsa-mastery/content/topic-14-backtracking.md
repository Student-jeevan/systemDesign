# Topic 14: Backtracking — Complete Coverage

> **Priority**: #13 (Consolidation) | **Risk**: 5/10 | **Interview Frequency**: ★★★★☆
>
> Backtracking is essentially Depth First Search (DFS) on an implicit graph of "choices." The defining characteristic of backtracking compared to standard DFS is that you "undo" your choice after exploring it, so that the state object can be reused for the next branch. 

---

## Backtracking Overview

### The Backtracking Template
Almost every backtracking problem fits perfectly into this template:

```python
def backtrack(start_index, current_path):
    # 1. Base Case / Goal State
    if is_goal(current_path):
        result.append(copy(current_path))
        return # Sometimes you return, sometimes you continue (e.g., Subsets)

    # 2. Iterate through all possible choices at this step
    for i in range(start_index, len(choices)):
        # 3. Pruning (Optional but crucial for performance)
        if not is_valid(choices[i]):
            continue
            
        # 4. Make a Choice (Do)
        current_path.append(choices[i])
        
        # 5. Explore that choice (Recurse)
        # Note: Depending on the problem, you might pass i (allow reuse) 
        # or i + 1 (no reuse).
        backtrack(i + 1, current_path) 
        
        # 6. Undo the Choice (Undo)
        current_path.pop()
```

### Why we "Undo"
In python, lists are passed by reference. If you create a `new List()` at every single step, you waste a massive amount of memory and time. By passing the *same* list down the recursive tree, appending to it, and then popping from it when you come back up, you keep the space complexity strictly bounded to `O(Height of Tree)`. 
*Warning: Because it's passed by reference, when you reach the goal state, you MUST append a `copy` of the path to your results array, otherwise all results will end up identical or empty.*

---

## Pattern 14.1: Subsets / Combinations

### Pattern Description
You want to find groups of elements where order does NOT matter. Example: `[1, 2]` is the same as `[2, 1]`.

### Core Invariant
**To prevent generating duplicate groups (like `[1, 2]` and `[2, 1]`), we use a `start_index`. The recursive call only iterates over elements *after* the `start_index`. We never look backwards.**

### Curated Questions

---

##### Q1: Subsets
| Field | Value |
|-------|-------|
| **Platform** | LeetCode |
| **Link** | https://leetcode.com/problems/subsets/ |
| **Difficulty** | Medium |
| **Companies** | Meta, Amazon, Bloomberg |
| **Topic** | Backtracking |
| **Pattern** | Subsets |
| **Frequency** | ★★★★★ (5/5) |

**Key Observation**: EVERY state is a valid goal state. There is no `if is_goal:` check; you just unconditionally append a copy of `current_path` to the results at the very top of the function.

**Time Complexity**: O(N * 2^N)
**Space Complexity**: O(N) for recursion stack.

---

##### Q2: Subsets II (With Duplicates)
| Field | Value |
|-------|-------|
| **Platform** | LeetCode |
| **Link** | https://leetcode.com/problems/subsets-ii/ |
| **Difficulty** | Medium |
| **Companies** | Amazon, Meta |
| **Topic** | Backtracking |
| **Pattern** | Subsets + Pruning |
| **Frequency** | ★★★★☆ (4/5) |

**Key Observation**: Sort the array first! Inside the loop, skip duplicates: `if i > start_index and nums[i] == nums[i-1]: continue`. This ensures that for any duplicate number, we only branch off its *first* occurrence at the current depth level.

**Time Complexity**: O(N * 2^N)
**Space Complexity**: O(N)

---

##### Q3: Combination Sum
| Field | Value |
|-------|-------|
| **Platform** | LeetCode |
| **Link** | https://leetcode.com/problems/combination-sum/ |
| **Difficulty** | Medium |
| **Companies** | Amazon, Airbnb, Meta |
| **Topic** | Backtracking |
| **Pattern** | Combinations with Reuse |
| **Frequency** | ★★★★★ (5/5) |

**Key Observation**: We are allowed to reuse the same number an unlimited number of times. Therefore, when making the recursive call, pass `i` as the start index, NOT `i + 1`. The base case is when `target == 0`. Prune if `target < 0`.

**Time Complexity**: O(N^(T/M)) where T is target, M is min element.
**Space Complexity**: O(T/M)

---

## Pattern 14.2: Permutations

### Pattern Description
You want to find arrangements of elements where order DOES matter. Example: `[1, 2]` is different from `[2, 1]`.

### Core Invariant
**Do NOT use a `start_index`. Since order matters, we want to look at the entire array in every recursive step. To avoid reusing the exact same element from the input, we either maintain a `visited` boolean array or pass the remaining unused array elements.**

### Curated Questions

---

##### Q1: Permutations
| Field | Value |
|-------|-------|
| **Platform** | LeetCode |
| **Link** | https://leetcode.com/problems/permutations/ |
| **Difficulty** | Medium |
| **Companies** | Amazon, Microsoft, LinkedIn |
| **Topic** | Backtracking |
| **Pattern** | Permutations |
| **Frequency** | ★★★★★ (5/5) |

**Key Observation**: Goal state is when `len(current_path) == len(nums)`. Loop from `0` to `len(nums)`. If `nums[i]` is in `current_path`, skip it (or better, use a `visited` array for O(1) checks).

**Time Complexity**: O(N * N!)
**Space Complexity**: O(N)

---

##### Q2: Permutations II (With Duplicates)
| Field | Value |
|-------|-------|
| **Platform** | LeetCode |
| **Link** | https://leetcode.com/problems/permutations-ii/ |
| **Difficulty** | Medium |
| **Companies** | Meta, LinkedIn |
| **Topic** | Backtracking |
| **Pattern** | Permutations + Pruning |
| **Frequency** | ★★★★☆ (4/5) |

**Key Observation**: Sort the array. Use a `visited` array. The tricky pruning condition: `if visited[i]: continue`. THEN, `if i > 0 and nums[i] == nums[i-1] and not visited[i-1]: continue`. This ensures that identical numbers are always processed in their original sorted order, preventing duplicate branches.

**Time Complexity**: O(N * N!)
**Space Complexity**: O(N)

---

## Pattern 14.3: Constraint Satisfaction / Grid Searching

### Pattern Description
Searching for a valid path or placement on a 2D grid/board.

### Core Invariant
**The recursive state usually involves `(row, col)`. You attempt to place something or move to an adjacent cell, check if it's valid, recurse, and then undo the placement/movement.**

### Curated Questions

---

##### Q1: Word Search
| Field | Value |
|-------|-------|
| **Platform** | LeetCode |
| **Link** | https://leetcode.com/problems/word-search/ |
| **Difficulty** | Medium |
| **Companies** | Amazon, Microsoft, Bloomberg, Meta |
| **Topic** | Backtracking |
| **Pattern** | Grid Search |
| **Frequency** | ★★★★★ (5/5) |

**Key Observation**: Iterate through the grid. If cell matches the first letter, trigger backtrack. Use a `visited` set (or temporarily modify the grid cell to `#`) to prevent reusing the same cell in the current path.
*Crucial*: Return `True` immediately if any recursive branch returns `True` to short-circuit the search.

**Time Complexity**: O(N * 3^L) where N is cells, L is word length.
**Space Complexity**: O(L) for recursion stack.

---

##### Q2: N-Queens
| Field | Value |
|-------|-------|
| **Platform** | LeetCode |
| **Link** | https://leetcode.com/problems/n-queens/ |
| **Difficulty** | Hard |
| **Companies** | Amazon, Meta, Microsoft |
| **Topic** | Backtracking |
| **Pattern** | Constraint Satisfaction |
| **Frequency** | ★★★★☆ (4/5) |

**Key Observation**: Proceed row by row. In the current row, try placing a queen in each column. To validate placement efficiently (O(1)), use three sets: `cols`, `diagonals` (row - col is constant), and `anti_diagonals` (row + col is constant).
Place queen, add to sets, recurse to `row + 1`, then undo.

**Time Complexity**: O(N!)
**Space Complexity**: O(N)

---

##### Q3: Sudoku Solver
| Field | Value |
|-------|-------|
| **Platform** | LeetCode |
| **Link** | https://leetcode.com/problems/sudoku-solver/ |
| **Difficulty** | Hard |
| **Companies** | Microsoft, Amazon |
| **Topic** | Backtracking |
| **Pattern** | Constraint Satisfaction |
| **Frequency** | ★★★☆☆ (3/5) |

**Key Observation**: Find the first empty cell. Try digits 1-9. Check validity (row, col, 3x3 sub-box). If valid, place digit, recurse. If the recursive call returns `True`, return `True`. Otherwise, erase digit and try the next one. If 1-9 all fail, return `False`.

**Time Complexity**: O(9^(Empty Cells))
**Space Complexity**: O(Empty Cells)

---
