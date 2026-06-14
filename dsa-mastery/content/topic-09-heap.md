# Topic 9: Heap / Priority Queue — Complete Coverage

> **Priority**: #8 (High ROI) | **Risk**: 6/10 | **Interview Frequency**: ★★★★☆
>
> Heaps (Priority Queues) are the ultimate tool for finding the "k-th best" or "top k" elements dynamically. They shine in problems involving streaming data, scheduling, or merging multiple sorted sequences. Whenever you hear "K", you should immediately think "Heap".

---

## Heap Overview

### What is a Heap?
A heap is a specialized tree-based data structure that satisfies the heap property:
- **Min-Heap**: The parent is always less than or equal to its children. The root is the minimum element.
- **Max-Heap**: The parent is always greater than or equal to its children. The root is the maximum element.

### Why use a Heap?
Heaps allow you to access the minimum (or maximum) element in `O(1)` time, while insertions and deletions take `O(log N)` time. This is drastically faster than sorting an entire array `O(N log N)` when you only care about a few extreme values.

### The Golden Rule of Heaps
**If you need to find the `Top K Largest` elements, use a `Min-Heap` of size K.**
**If you need to find the `Top K Smallest` elements, use a `Max-Heap` of size K.**

*Why?* To find the K largest elements, you want to easily discard the *smallest* of the K elements you've seen so far to make room for a larger one. A Min-Heap keeps the smallest element at the root (easy access).

---

## Pattern 9.1: Top K Elements

### Pattern Description
The most fundamental use case of a heap. You are given an unsorted array and need to find the K largest, smallest, or most frequent elements.

### Core Invariant
**Maintain a heap of size exactly `K`. Iterate through the elements. For Top K Largest, use a Min-Heap. If the heap is full and the current element is greater than the root, pop the root and push the current element.**

### Recognition Signals
- "Find the Kth largest/smallest..."
- "Top K frequent elements..."
- "K closest points..."

### Curated Questions

---

##### Q1: Kth Largest Element in an Array
| Field | Value |
|-------|-------|
| **Platform** | LeetCode |
| **Link** | https://leetcode.com/problems/kth-largest-element-in-an-array/ |
| **Difficulty** | Medium |
| **Companies** | Meta, Amazon, Microsoft, Spotify |
| **Topic** | Heap |
| **Pattern** | Top K Elements |
| **Frequency** | ★★★★★ (5/5) |

**Key Observation**: Use a Min-Heap of size K. Iterate the array. If heap size > K, pop. The root of the heap at the end is the Kth largest element.
*(Note: Quickselect is O(N) average time and is often requested as a follow-up, but the Heap approach O(N log K) is more reliable for streaming data).*

**Time Complexity**: O(N log K)
**Space Complexity**: O(K)

---

##### Q2: Top K Frequent Elements
| Field | Value |
|-------|-------|
| **Platform** | LeetCode |
| **Link** | https://leetcode.com/problems/top-k-frequent-elements/ |
| **Difficulty** | Medium |
| **Companies** | Amazon, Meta, Google, Uber |
| **Topic** | Heap |
| **Pattern** | Top K Elements |
| **Frequency** | ★★★★★ (5/5) |

**Key Observation**: 
1. Count frequencies using a HashMap: `num -> count`.
2. Push entries into a Min-Heap of size K, comparing by `count`.
3. The heap retains the K elements with the largest counts.

**Alternative**: Bucket Sort is O(N) time and space, highly recommended as an optimal alternative.

**Time Complexity**: O(N log K)
**Space Complexity**: O(N) for map, O(K) for heap.

---

##### Q3: K Closest Points to Origin
| Field | Value |
|-------|-------|
| **Platform** | LeetCode |
| **Link** | https://leetcode.com/problems/k-closest-points-to-origin/ |
| **Difficulty** | Medium |
| **Companies** | Meta, Amazon, DoorDash |
| **Topic** | Heap |
| **Pattern** | Top K Elements |
| **Frequency** | ★★★★★ (5/5) |

**Key Observation**: "Closest" means smallest distance. To find Top K Smallest, use a Max-Heap of size K. Distance = `x^2 + y^2` (no need to compute the square root). Push `[distance, x, y]`. If size > K, pop.

**Time Complexity**: O(N log K)
**Space Complexity**: O(K)

---

## Pattern 9.2: K-Way Merge

### Pattern Description
You are given K sorted arrays (or linked lists) and need to merge them into a single sorted array.

### Core Invariant
**Initialize a Min-Heap with the *first* element from each of the K arrays. The root of the heap is the smallest overall element. Pop it, add it to your result, and push the *next* element from the array that the popped element belonged to.**

### Curated Questions

---

##### Q1: Merge K Sorted Lists
| Field | Value |
|-------|-------|
| **Platform** | LeetCode |
| **Link** | https://leetcode.com/problems/merge-k-sorted-lists/ |
| **Difficulty** | Hard |
| **Companies** | Amazon, Meta, Microsoft, Google |
| **Topic** | Heap |
| **Pattern** | K-Way Merge |
| **Frequency** | ★★★★★ (5/5) |

**Key Observation**: Push the head node of all K lists into a Min-Heap. The heap compares nodes by their value. Pop the minimum node, append it to the result list, and if that node has a `next`, push `node.next` into the heap.

**Alternative**: Divide and Conquer merging (merge pairs of lists repeatedly) is also O(N log K) and requires O(1) extra space.

**Time Complexity**: O(N log K) where N is total nodes.
**Space Complexity**: O(K) for the heap.

---

##### Q2: Find K Pairs with Smallest Sums
| Field | Value |
|-------|-------|
| **Platform** | LeetCode |
| **Link** | https://leetcode.com/problems/find-k-pairs-with-smallest-sums/ |
| **Difficulty** | Medium |
| **Companies** | Amazon, Google |
| **Topic** | Heap |
| **Pattern** | K-Way Merge |
| **Frequency** | ★★★★☆ (4/5) |

**Key Observation**: We have two sorted arrays. Let's form pairs `(nums1[0], nums2[0])`, `(nums1[1], nums2[0])`, etc. This forms multiple sorted sequences. 
Initialize Min-Heap with `(nums1[i] + nums2[0], i, 0)` for `i` from 0 to K-1.
Pop the smallest pair `(i, j)`. The next pair to consider from that "sequence" is `(i, j+1)`.

**Time Complexity**: O(K log K)
**Space Complexity**: O(K)

---

## Pattern 9.3: Two Heaps

### Pattern Description
Used when you need to maintain the median (or a specific percentile) of a dynamic stream of numbers.

### Core Invariant
**Maintain a Max-Heap for the smaller half of numbers, and a Min-Heap for the larger half. The top of the Max-Heap is the largest of the small numbers. The top of the Min-Heap is the smallest of the large numbers. Keep their sizes balanced (difference of at most 1). The median is either the top of the larger heap, or the average of both tops.**

### Curated Questions

---

##### Q1: Find Median from Data Stream
| Field | Value |
|-------|-------|
| **Platform** | LeetCode |
| **Link** | https://leetcode.com/problems/find-median-from-data-stream/ |
| **Difficulty** | Hard |
| **Companies** | Amazon, Google, Meta, Microsoft |
| **Topic** | Heap |
| **Pattern** | Two Heaps |
| **Frequency** | ★★★★★ (5/5) |

**Key Observation**:
1. Add `num` to Max-Heap (smaller half).
2. Pop from Max-Heap and push to Min-Heap (larger half) to ensure all elements in Min-Heap are larger.
3. If Min-Heap is larger than Max-Heap, pop Min-Heap and push back to Max-Heap (to maintain balance where Max-Heap can have 1 extra element).
4. `findMedian`: If sizes equal, average of tops. Else, top of Max-Heap.

**Time Complexity**: O(log N) for `addNum`, O(1) for `findMedian`.
**Space Complexity**: O(N)

---

##### Q2: Sliding Window Median
| Field | Value |
|-------|-------|
| **Platform** | LeetCode |
| **Link** | https://leetcode.com/problems/sliding-window-median/ |
| **Difficulty** | Hard |
| **Companies** | Google, Amazon |
| **Topic** | Heap |
| **Pattern** | Two Heaps + Lazy Deletion |
| **Frequency** | ★★★☆☆ (3/5) |

**Key Observation**: Use the Two Heaps approach. However, moving the window requires deleting elements from the middle of the heaps, which is O(N).
*Optimization*: Use "Lazy Deletion". Keep a HashMap to record `element -> count to delete`. When taking the top of a heap, while the top is in the map (count > 0), pop it and decrement the count.

**Time Complexity**: O(N log K)
**Space Complexity**: O(K)

---

## Pattern 9.4: Scheduling / Simulation

### Pattern Description
Using a heap to simulate processes unfolding over time. Typically, you sort events by start time, and use a Min-Heap to track "end times" or "available resources."

### Core Invariant
**Sort input by time. Iterate chronologically. Use a Min-Heap to quickly answer: "What is the earliest time a resource becomes available?"**

### Curated Questions

---

##### Q1: Minimum Number of Refueling Stops
| Field | Value |
|-------|-------|
| **Platform** | LeetCode |
| **Link** | https://leetcode.com/problems/minimum-number-of-refueling-stops/ |
| **Difficulty** | Hard |
| **Companies** | Amazon, Google |
| **Topic** | Heap |
| **Pattern** | Scheduling |
| **Frequency** | ★★★☆☆ (3/5) |

**Key Observation**: As you drive, push the fuel amounts of stations you pass into a Max-Heap. You don't refuel immediately. If you run out of fuel (`current_fuel < next_station_dist`), pop the largest fuel amount from the Max-Heap (representing a retroactive refuel at the best station you passed) until you can reach the next station.

**Time Complexity**: O(N log N)
**Space Complexity**: O(N)

---

##### Q2: Task Scheduler
| Field | Value |
|-------|-------|
| **Platform** | LeetCode |
| **Link** | https://leetcode.com/problems/task-scheduler/ |
| **Difficulty** | Medium |
| **Companies** | Meta, Amazon |
| **Topic** | Heap |
| **Pattern** | Scheduling |
| **Frequency** | ★★★★☆ (4/5) |

*(Note: We covered the O(N) math formula in Greedy. The simulation approach uses a Heap).*
**Key Observation**: Maintain a Max-Heap of task counts. Track time. Pop the most frequent task, execute it, decrement count, and put it in a "cooldown queue" `(count, available_time)`. When `current_time == available_time`, push it back into the Max-Heap.

**Time Complexity**: O(N log 26)
**Space Complexity**: O(1)

---
