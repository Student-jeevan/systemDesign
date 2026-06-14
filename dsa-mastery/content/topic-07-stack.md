# Topic 7: Stack — Complete Coverage

> **Priority**: #20 (Maintenance) | **Risk**: 2/10 | **Interview Frequency**: ★★★★☆
>
> A Stack operates on the LIFO (Last-In-First-Out) principle. While we already covered the highly complex *Monotonic Stack* (Topic 8), standard stack problems are much simpler. They almost exclusively deal with parsing, matching, and reversing strings or sequences.

---

## Stack Overview

### The Meta-Strategy
Whenever you are processing a sequence and your current action depends heavily on the *most recently seen* uncompleted item, you need a stack.
- `push()`: Add an item to the top.
- `pop()`: Remove and return the top item.
- `peek()`: Look at the top item without removing it.

---

## Pattern 7.1: Parentheses Matching

### Pattern Description
The quintessential stack problem. Validating that brackets, parentheses, or HTML tags open and close in the correct order.

### Core Invariant
**When you see an opening bracket, `push` it. When you see a closing bracket, check if the stack is empty (Invalid). If not, `pop` the top of the stack and ensure it is the matching opening bracket type (Invalid if not). At the end of the string, the stack MUST be empty (Invalid if not).**

### Curated Questions

---

##### Q1: Valid Parentheses
| Field | Value |
|-------|-------|
| **Platform** | LeetCode |
| **Link** | https://leetcode.com/problems/valid-parentheses/ |
| **Difficulty** | Easy |
| **Companies** | Amazon, Meta, Google, Apple |
| **Topic** | Stack |
| **Pattern** | Matching |
| **Frequency** | ★★★★★ (5/5) |

**Key Observation**: Use a Hash Map for clean code: `map = {')': '(', '}': '{', ']': '['}`.
Iterate through string. If char is in `map` values (an opening bracket), push. If it's a key (closing bracket), pop and check if it matches `map[char]`.

**Time Complexity**: O(N)
**Space Complexity**: O(N)

---

##### Q2: Minimum Add to Make Parentheses Valid
| Field | Value |
|-------|-------|
| **Platform** | LeetCode |
| **Link** | https://leetcode.com/problems/minimum-add-to-make-parentheses-valid/ |
| **Difficulty** | Medium |
| **Companies** | Meta, Amazon |
| **Topic** | Stack (Optimized to Greedy) |
| **Pattern** | Matching |
| **Frequency** | ★★★★☆ (4/5) |

**Key Observation**: Since there is only one type of parenthesis `()`, we don't actually need a stack!
Keep two variables: `open_needed` and `close_needed`.
If `(`, `close_needed++`.
If `)`, and `close_needed > 0`, `close_needed--`. Else, `open_needed++`.
Return `open_needed + close_needed`.

**Time Complexity**: O(N)
**Space Complexity**: O(1)

---

## Pattern 7.2: String Parsing / Evaluation

### Pattern Description
Evaluating mathematical expressions or parsing specific string formats where operations follow an order of precedence or grouping.

### Core Invariant
**When reading a number or variable, build it. When reading an operator or parenthesis, push it to the stack or process the top of the stack according to the rules of the expression.**

### Curated Questions

---

##### Q1: Evaluate Reverse Polish Notation
| Field | Value |
|-------|-------|
| **Platform** | LeetCode |
| **Link** | https://leetcode.com/problems/evaluate-reverse-polish-notation/ |
| **Difficulty** | Medium |
| **Companies** | Amazon, LinkedIn, Google |
| **Topic** | Stack |
| **Pattern** | Parsing |
| **Frequency** | ★★★★★ (5/5) |

**Key Observation**: RPN (Postfix notation) is designed specifically for stacks.
Iterate tokens. If it's a number, push it.
If it's an operator `+, -, *, /`, pop the top two numbers `b` and `a`. (Note: `a` is popped second but was pushed first, so it is the left operand).
Apply operator: `result = a (op) b`. Push `result` back to stack.
Return the only element left in the stack.
*Language Trap*: In Python, integer division truncates toward negative infinity (`-1 // 2 = -1`), but RPN requires truncation toward zero (`int(-1 / 2) = 0`).

**Time Complexity**: O(N)
**Space Complexity**: O(N)

---

##### Q2: Basic Calculator II
| Field | Value |
|-------|-------|
| **Platform** | LeetCode |
| **Link** | https://leetcode.com/problems/basic-calculator-ii/ |
| **Difficulty** | Medium |
| **Companies** | Meta, Amazon, Microsoft |
| **Topic** | Stack |
| **Pattern** | Evaluation with Precedence |
| **Frequency** | ★★★★☆ (4/5) |

**Key Observation**: Handle `+ - * /` without parentheses.
Iterate string. Build the current `number`. Track the `last_operator` (initialize to `+`).
When you hit a new operator (or end of string):
If `last_operator` was `+`, push `number`.
If `-`, push `-number`.
If `*`, pop, multiply by `number`, push.
If `/`, pop, divide by `number` (truncate toward zero), push.
Finally, update `last_operator` and reset `number = 0`.
Sum the stack.

**Time Complexity**: O(N)
**Space Complexity**: O(N) (can be optimized to O(1) by keeping a running sum instead of a stack).

---

## Pattern 7.3: Subproblem State Preservation

### Pattern Description
When exploring a structure (like decoding a string with nested brackets), you use a stack to remember the "outer" context while you dive into the "inner" context.

### Core Invariant
**When you "dive deeper" (e.g., hit a `[`), push the current accumulated string and multipliers onto the stack, and reset them to start fresh for the inner content. When you "surface" (e.g., hit a `]`), pop the previous state, apply the multiplier to your current inner content, and append it to the popped outer string.**

### Curated Questions

---

##### Q1: Decode String
| Field | Value |
|-------|-------|
| **Platform** | LeetCode |
| **Link** | https://leetcode.com/problems/decode-string/ |
| **Difficulty** | Medium |
| **Companies** | Google, Amazon, Bloomberg |
| **Topic** | Stack |
| **Pattern** | State Preservation |
| **Frequency** | ★★★★★ (5/5) |

**Key Observation**: E.g., `3[a2[c]]`.
Maintain `current_string` and `current_num`.
- Digit: build `current_num`.
- Letter: append to `current_string`.
- `[`: push `(current_string, current_num)` to stack. Reset both.
- `]`: pop `(prev_string, num)`. `current_string = prev_string + num * current_string`.

**Time Complexity**: O(Output Length)
**Space Complexity**: O(Output Length) for recursion stack/string builder.

---
