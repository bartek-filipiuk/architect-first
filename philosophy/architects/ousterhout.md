# John Ousterhout — Stanford, A Philosophy of Software Design

## Thesis
The dominant cost of software is our ability to understand it, so the goal of design is
to manage complexity. Favor deep modules — a simple, narrow interface hiding a complex
implementation — over shallow ones whose elaborate interface forces you to understand
both sides.

## Anchor quotes
> "The greatest limitation in writing software is our ability to understand the systems we are creating."

> "It's more important for a module to have a simple interface than a simple implementation."

## In Architect-First
- Rung 0 (UNDERSTAND): the binding constraint is comprehension — understand the system before reaching for a solution.
- Rung 6 (MVA): build deep modules. A simple interface over a complex implementation reduces system complexity; many shallow modules increase it.
