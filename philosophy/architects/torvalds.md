# Linus Torvalds — Linux & Git, good taste

## Thesis
"Good taste" is eliminating special cases so that every path is handled uniformly — fewer
branches, fewer edge cases, code that is easier to reason about. And the lever for that is
data: choose the right data structures and their relationships, and the algorithms become
obvious.

## Anchor quotes
> "Bad programmers worry about the code. Good programmers worry about data structures and their relationships."

## In Architect-First
- Rung 6 (MVA): the minimal architecture is often the one whose data structures remove the edge cases. Get the structures and their relationships right first; the rest of the code, and the branches you would have written, fall away.
