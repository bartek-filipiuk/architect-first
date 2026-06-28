---
description: "Architect-First quick reference: the Decision Ladder, levels, and review tags"
---

Show the Architect-First quick reference. The Decision Ladder (stop at the first rung that holds): 0 UNDERSTAND — read the code, trace the data flow; 1 YAGNI — does it need to exist for current requirements?; 2 REUSE — already in this codebase?; 3 NATIVE — stdlib/platform does it?; 4 COST — does the abstraction cost more than it delivers?; 5 DIRECTION — do dependencies point inward?; 6 MINIMUM — simplest architecture, deep modules. Levels: lite (critical only), full (default), ultra (propose removing dead abstractions), off. Commands: /architect <level> (switch level), /architect-plan (design architecture from scratch), /architect-review (audit a diff or the whole repo). Review tags: direction (dependency direction broken), shallow (shallow module), coupling (needless coupling), speculative (YAGNI), data-leak (info leak between layers).
