# Topic 24: Data Structure Design Problems — Complete Coverage

> **Priority**: #6 (High ROI) | **Risk**: 9/10 | **Interview Frequency**: ★★★★☆
>
> DS Design problems are the "boss fights" of technical interviews. They test your ability to compose multiple basic data structures (e.g., Hash Maps + Doubly Linked Lists, or Arrays + Hash Maps) to achieve specific O(1) or O(log n) time complexities for a set of operations. 
>
> Interviewers love these because they are difficult to memorize and require deep understanding of time/space tradeoffs.

---

## DS Design Overview

### The Meta-Strategy
Almost every DS Design problem asks you to achieve constant time `O(1)` for a specific set of conflicting operations (e.g., fast lookups AND fast deletions AND fast random selection). 

**The Golden Rules of Composition:**
1. **Hash Maps are mandatory:** If you need `O(1)` lookups, you must use a Hash Map.
2. **Arrays give random access:** If you need `O(1)` random selection, you must use a continuous Array.
3. **Linked Lists give fast middle modifications:** If you need `O(1)` insertions/deletions in the middle of a sequence, you need a Linked List (often Doubly Linked).
4. **Heaps track extremes:** If you need `O(1)` access to the min/max or top-k, you need a Priority Queue/Heap.
5. **The "Glue":** The magic happens when you use a Hash Map to store *pointers* or *indices* to elements in the Array/Linked List. This bridges the `O(1)` lookup with the `O(1)` structural modification.

---

## Pattern 24.1: Hash Map + Doubly Linked List

### Pattern Description
This combination is used when you need `O(1)` lookups (Hash Map) combined with `O(1)` additions/removals and the ability to maintain an ordering based on recency or frequency (Doubly Linked List).

### Core Invariant
**The Hash Map stores `Key -> Node reference`. The Doubly Linked List maintains the nodes in a specific order (e.g., Most Recently Used to Least Recently Used). By holding the node reference in the map, we can splice a node out of the middle of the linked list in `O(1)` time without traversing it.**

### Curated Questions

---

##### Q1: LRU Cache
| Field | Value |
|-------|-------|
| **Platform** | LeetCode |
| **Link** | https://leetcode.com/problems/lru-cache/ |
| **Difficulty** | Medium |
| **Companies** | Amazon, Meta, Google, Microsoft, Bloomberg |
| **Topic** | DS Design |
| **Pattern** | HashMap + DLL |
| **Frequency** | ★★★★★ (5/5) |

**Key Observation**: 
- `get(key)`: If exists, move node to the head (most recently used) and return value.
- `put(key, value)`: If exists, update value and move to head. If new, add to head. If capacity exceeded, remove the tail node (least recently used) and delete its key from the map.
- *Implementation Detail*: Use dummy `head` and `tail` nodes in the DLL to avoid edge cases when inserting/deleting.

**Expected Thought Process**:
1. "Need O(1) lookups -> HashMap."
2. "Need to track recency and evict oldest -> Queue?"
3. "Wait, when an existing item is accessed, it moves to the front. A standard Queue takes O(n) to remove from the middle."
4. "Need O(1) removal from middle -> Doubly Linked List."
5. "Map keys to DLL Nodes. When accessed, use map to find Node in O(1), then detach and reattach at Head in O(1)."

**Time Complexity**: O(1) for both `get` and `put`.
**Space Complexity**: O(capacity)

---

##### Q2: LFU Cache
| Field | Value |
|-------|-------|
| **Platform** | LeetCode |
| **Link** | https://leetcode.com/problems/lfu-cache/ |
| **Difficulty** | Hard |
| **Companies** | Amazon, Google, Microsoft |
| **Topic** | DS Design |
| **Pattern** | HashMap + HashMap of DLLs |
| **Frequency** | ★★★★☆ (4/5) |

**Key Observation**: 
We need to track frequencies. When ties occur, we use LRU.
- Map 1: `key -> Node (key, value, freq)`.
- Map 2: `freq -> DoublyLinkedList`.
- Variable: `minFreq` to know which DLL to evict from when capacity is reached.
When a node is accessed, increment its freq, remove it from `Map2[freq]`, and add it to `Map2[freq+1]`. If `Map2[minFreq]` becomes empty, increment `minFreq`.

**Time Complexity**: O(1) for both `get` and `put`.
**Space Complexity**: O(capacity)

---

##### Q3: All O`one Data Structure
| Field | Value |
|-------|-------|
| **Platform** | LeetCode |
| **Link** | https://leetcode.com/problems/all-oone-data-structure/ |
| **Difficulty** | Hard |
| **Companies** | Meta, LinkedIn, Uber |
| **Topic** | DS Design |
| **Pattern** | HashMap + DLL of HashSets |
| **Frequency** | ★★★☆☆ (3/5) |

**Key Observation**: 
Need to increment/decrement string keys and get the string with max/min value in O(1).
- Map: `key -> Node in DLL`.
- DLL Nodes contain: `value` and a `HashSet of strings` that have that value. The DLL is kept sorted by `value`.
- `inc(key)`: Move the key from its current Node to the next Node (current.value + 1). If the next node doesn't exist, create it.
- `getMax()`: Return an element from the `tail` node's HashSet.

**Time Complexity**: O(1) all operations.
**Space Complexity**: O(n)

---

## Pattern 24.2: Hash Map + Array (with Swap & Pop)

### Pattern Description
Used when you need `O(1)` random selection. An array allows `O(1)` random access via index, but standard array deletion is `O(n)`. The trick is to swap the element you want to delete with the *last* element in the array, then pop the last element in `O(1)`.

### Core Invariant
**Array stores the elements. Hash Map stores `Element -> Index in Array`. When deleting an element `X` at index `i`, we move the last element in the array to index `i`, update the last element's index in the Hash Map to `i`, and pop the array. This keeps the array contiguous without shifting.**

### Curated Questions

---

##### Q1: Insert Delete GetRandom O(1)
| Field | Value |
|-------|-------|
| **Platform** | LeetCode |
| **Link** | https://leetcode.com/problems/insert-delete-getrandom-o1/ |
| **Difficulty** | Medium |
| **Companies** | Meta, Amazon, Google, Uber, Bloomberg |
| **Topic** | DS Design |
| **Pattern** | HashMap + Array (Swap & Pop) |
| **Frequency** | ★★★★★ (5/5) |

**Key Observation**: 
- `insert(val)`: Append to array, record `map[val] = array.length - 1`.
- `getRandom()`: Generate random index `0` to `array.length - 1`, return `array[index]`.
- `remove(val)`: Find index of `val` via map. Swap `array[index]` with `array[last]`. Update `map[array[index]] = index`. Pop last element from array. Delete `val` from map.

**Time Complexity**: O(1) expected for all.
**Space Complexity**: O(n)

---

##### Q2: Insert Delete GetRandom O(1) - Duplicates allowed
| Field | Value |
|-------|-------|
| **Platform** | LeetCode |
| **Link** | https://leetcode.com/problems/insert-delete-getrandom-o1-duplicates-allowed/ |
| **Difficulty** | Hard |
| **Companies** | Meta, LinkedIn |
| **Topic** | DS Design |
| **Pattern** | HashMap of HashSets + Array |
| **Frequency** | ★★★★☆ (4/5) |

**Key Observation**: 
Because duplicates exist, a value can have multiple indices.
- Map: `val -> LinkedHashSet of indices`. (LinkedHashSet gives O(1) add, remove, and get arbitrary element).
- `remove(val)`: Get an arbitrary index for `val` from its set. Swap that index in the array with the last element. Update the last element's index set (remove old index, add new index).

**Time Complexity**: O(1) expected.
**Space Complexity**: O(n)

---

## Pattern 24.3: Multiple Stacks / Specialized Stacks

### Pattern Description
Augmenting standard stacks to keep track of minimums, maximums, or frequencies across operations.

### Core Invariant
**You either maintain a parallel stack that tracks the desired metric at that exact height, or you push tuples `(value, metric_at_this_point)` onto a single stack.**

### Curated Questions

---

##### Q1: Min Stack
| Field | Value |
|-------|-------|
| **Platform** | LeetCode |
| **Link** | https://leetcode.com/problems/min-stack/ |
| **Difficulty** | Medium |
| **Companies** | Amazon, Microsoft, Bloomberg |
| **Topic** | DS Design |
| **Pattern** | Tuple Stack |
| **Frequency** | ★★★★★ (5/5) |

**Key Observation**: Push `(val, current_min)` onto the stack. `current_min` is `min(val, top.current_min)`.
Alternatively, keep two stacks: `main_stack` and `min_stack`. Only push to `min_stack` if `val <= min_stack.top()`. Pop from `min_stack` if `popped_val == min_stack.top()`.

**Time Complexity**: O(1) all operations.
**Space Complexity**: O(n)

---

##### Q2: Max Frequency Stack
| Field | Value |
|-------|-------|
| **Platform** | LeetCode |
| **Link** | https://leetcode.com/problems/maximum-frequency-stack/ |
| **Difficulty** | Hard |
| **Companies** | Amazon, Bloomberg |
| **Topic** | DS Design |
| **Pattern** | Map of Stacks |
| **Frequency** | ★★★★☆ (4/5) |

**Key Observation**: 
Need to pop the most frequent element, resolving ties by recency.
- Map 1: `val -> freq`
- Map 2: `freq -> Stack of vals`
- Variable: `maxFreq`
- `push(x)`: Increment freq. Push `x` to `Map2[freq]`. Update `maxFreq` if `freq > maxFreq`.
- `pop()`: Pop from `Map2[maxFreq]`. Decrement freq of popped element. If `Map2[maxFreq]` is empty, `maxFreq--`.

**Time Complexity**: O(1) for push and pop.
**Space Complexity**: O(n)

---

## Pattern 24.4: Design by Requirements (Queues / HashMaps)

### Pattern Description
Implementing fundamental data structures from scratch or combining them for very specific system-design-like requirements (e.g., hit counters, rate limiters, snapshot arrays).

### Curated Questions

---

##### Q1: Snapshot Array
| Field | Value |
|-------|-------|
| **Platform** | LeetCode |
| **Link** | https://leetcode.com/problems/snapshot-array/ |
| **Difficulty** | Medium |
| **Companies** | Google |
| **Topic** | DS Design |
| **Pattern** | Array of Binary Searchable Lists |
| **Frequency** | ★★★★★ (5/5) |

**Key Observation**: Copying the whole array on every `snap()` is O(n) and will TLE.
Instead, use an array of lists: `List<int[]>[] history`.
`history[i]` stores pairs of `[snap_id, value]`.
When `get(index, snap_id)` is called, perform Binary Search on `history[index]` to find the largest recorded `snap_id` that is `<= target_snap_id`.

**Time Complexity**: `set`: O(1), `snap`: O(1), `get`: O(log S) where S is number of snaps for that index.
**Space Complexity**: O(S) where S is total number of `set` calls.

---

##### Q2: Design Hit Counter
| Field | Value |
|-------|-------|
| **Platform** | LeetCode |
| **Link** | https://leetcode.com/problems/design-hit-counter/ |
| **Difficulty** | Medium |
| **Companies** | Dropbox, Amazon, Google |
| **Topic** | DS Design |
| **Pattern** | Fixed Size Arrays / Queue |
| **Frequency** | ★★★★☆ (4/5) |

**Key Observation**: We only care about the last 300 seconds (5 minutes).
Approach 1: A Queue storing timestamps. On `getHits`, pop while `front <= timestamp - 300`. Return size. (Fails if millions of hits happen at the exact same second).
Approach 2 (Scalable): Two arrays of size 300: `times[300]` and `hits[300]`.
`index = timestamp % 300`. If `times[index] != timestamp`, reset `times[index] = timestamp` and `hits[index] = 1`. Else, `hits[index]++`. `getHits` sums up `hits[i]` where `times[i] > timestamp - 300`.

**Time Complexity**: `hit`: O(1), `getHits`: O(300) = O(1).
**Space Complexity**: O(300) = O(1).

---

##### Q3: Design Tic-Tac-Toe
| Field | Value |
|-------|-------|
| **Platform** | LeetCode |
| **Link** | https://leetcode.com/problems/design-tic-tac-toe/ |
| **Difficulty** | Medium |
| **Companies** | Amazon, Microsoft, Meta |
| **Topic** | DS Design |
| **Pattern** | State Accumulation Arrays |
| **Frequency** | ★★★★☆ (4/5) |

**Key Observation**: Checking the whole board is O(N). Instead, track the sums.
Maintain `rows[n]`, `cols[n]`, `diagonal`, `antiDiagonal`.
Player 1 adds `1`, Player 2 adds `-1`. If `abs(rows[row]) == n`, that player wins.

**Time Complexity**: O(1) per move.
**Space Complexity**: O(n)

---

## DS Design Hiring Evaluation

### What Makes a Candidate Reject / Borderline / Hire / Strong Hire

#### Meta
| Level | Signal |
|-------|--------|
| **Reject** | Fails to recognize O(1) requirements. Uses Arrays with O(N) shifts. |
| **Borderline** | Knows HashMap + DLL is needed for LRU but struggles with pointer manipulation. |
| **Hire** | Flawless execution of LRU Cache or Insert/Delete/GetRandom. Clean code. |
| **Strong Hire** | Solves LFU Cache or O(1) with Duplicates efficiently with no bugs. |

#### Google
| Level | Signal |
|-------|--------|
| **Reject** | Uses brute force (e.g., copying whole array for Snapshot Array). |
| **Hire** | Identifies the correct combination of data structures. Evaluates tradeoffs well. |
| **Strong Hire** | Optimizes space usage, writes clean object-oriented code, anticipates edge cases. |
