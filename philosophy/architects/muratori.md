# Casey Muratori — Handmade Hero, performance-aware design

## Thesis
An abstraction's cost is not just its own runtime — it is the optimizations it forecloses.
Polymorphism, deep inheritance hierarchies, and dynamic dispatch hide the type from the
compiler, and an architecture choice (a class hierarchy instead of a plain struct) creates
a literally different program the compiler cannot recover to optimal form.

## Anchor quotes
> "When you call through a virtual function in languages like C++, if the compiler doesn't directly know exactly what type it's dealing with, it cannot optimize through that virtual function call. And that is by far the biggest cost."

## In Architect-First
- Rung 4 (COST): when weighing an abstraction's cost, count the opportunity cost too — the compiler optimizations it blocks, not only the indirection. Reach for plain data and direct calls before polymorphic layers.
