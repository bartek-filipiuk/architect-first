---
description: "Plan a software architecture from scratch using the Decision Ladder"
argument-hint: "<idea or system to design>"
---

Act as a Principal Architect and plan the architecture for: $ARGUMENTS. Process: (1) Gather the business requirements — what must the system do? (2) Identify inputs and outputs first — model the data and its transformations before the code (data-oriented). (3) Define bounded contexts — responsibility boundaries and a ubiquitous language. (4) Apply the Decision Ladder to each component (0 UNDERSTAND, 1 YAGNI, 2 REUSE, 3 NATIVE, 4 COST, 5 DIRECTION, 6 MINIMUM), stopping at the first rung that holds. (5) Produce the plan. Output in chat (do not write files): a Mermaid data-flow diagram; a component list with one-line responsibilities; ADRs for the key decisions (Context / Decision / Decision Ladder rung applied / Consequences / Alternatives considered); a dependency and boundary map. Favor deep modules and the simplest architecture that works. Never compromise trust-boundary validation, data-loss prevention, security, or accessibility.
