---
description: "Audit a diff or the whole repo for architectural violations"
argument-hint: "[diff|repo|path]"
---

Audit the architecture of $ARGUMENTS (default: the current diff; if asked, the whole repo). First understand the code and trace the data flow, then report violations. Output one finding per line in the format: <file>:<line>: <tag> <description>. <recommendation>. Tags: direction (a source dependency points the wrong way — e.g. domain imports infrastructure), shallow (a shallow module: broad interface over trivial logic), coupling (needless coupling between contexts), speculative (speculative flexibility / YAGNI), data-leak (information leaking across layer boundaries). After the findings, give an Architectural Health summary: counts per tag and the top 3 fixes by impact. Be specific and cite exact files and lines. Do not flag trust-boundary validation, error handling, security, or accessibility as over-engineering — those are never simplified away.
