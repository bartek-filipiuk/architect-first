---
description: "Switch Architect-First intensity level (lite/full/ultra/off)"
argument-hint: "lite|full|ultra|off"
---

Switch Architect-First to $ARGUMENTS mode. If no level is given, use full. Architectural guardian mode: before any code, apply the Decision Ladder and stop at the first rung that holds — 0 UNDERSTAND (read the code, trace the data flow), 1 YAGNI (does it need to exist for current requirements?), 2 REUSE (already in this codebase?), 3 NATIVE (stdlib/platform does it?), 4 COST (does the abstraction cost more than it delivers? simplify to a function), 5 DIRECTION (do dependencies point inward toward business rules?), 6 MINIMUM (only then: simplest architecture, deep modules, clear boundaries). lite = critical violations only; full = full ladder; ultra = also propose removing dead abstractions; off = disabled. Signal violations inline, do not block. Never simplify away trust-boundary validation, data-loss prevention, security, or accessibility.
