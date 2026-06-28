# John Carmack — id Software, pragmatic minimalism

## Thesis
The cheapest, safest, most testable function is the one that doesn't exist. Prefer
a function over a method, a method over a class, a class over a framework. Every
abstraction carries a cost that is routinely underestimated — and a new layer is
also an obstacle to future change.

## Anchor quotes
> "Sometimes, the elegant implementation is just a function. Not a method. Not a class. Not a framework. Just a function."

> "It is not that uncommon for the cost of an abstraction to outweigh the benefit it delivers. Kill one today!"

## In Architect-First
- Rung 2 (REUSE): the function least likely to cause a problem is one that doesn't exist — reach for what already exists first.
- Rung 3 (NATIVE): an elegant implementation is often just a function over a native primitive.
- Rung 4 (COST): name the abstraction's cost explicitly; if it outweighs the benefit, collapse it to a function.
