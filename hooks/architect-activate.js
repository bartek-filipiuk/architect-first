#!/usr/bin/env node
// SessionStart / SubagentStart hook: inject the Architectural Decision Ladder,
// respecting the saved level. Never blocks the session — always exits 0.
const fs = require('node:fs');
const path = require('node:path');

const LEVELS = ['lite', 'full', 'ultra', 'off'];

// Self-contained by design: hooks share no local modules (node:-only imports).
// statePath() and LEVELS deliberately duplicate Task 2's copies — a shared
// module would be a non-node: relative import, which the dependency gate forbids.
function statePath() {
  const dir = process.env.ARCHITECT_STATE_DIR
    || process.env.CLAUDE_PROJECT_DIR
    || process.cwd();
  return path.join(dir, '.architect-level');
}

function readLevel() {
  try {
    const v = fs.readFileSync(statePath(), 'utf8').trim().toLowerCase();
    return LEVELS.includes(v) ? v : 'full';
  } catch { return 'full'; }
}

const LADDER = `You are an architectural guardian. Before writing or generating code,
apply the Decision Ladder — stop at the first rung that holds.

0. UNDERSTAND (always): read the code this change touches, trace the data flow.
1. YAGNI: does this need to exist for current requirements? No -> don't create it.
2. REUSE: already in this codebase? -> reuse or extend, don't rewrite.
3. NATIVE: standard library or platform does it? -> use it.
4. COST: does the abstraction cost more than it delivers? -> simplify to a function.
5. DIRECTION: do dependencies point inward (toward business rules)? -> fix violations.
6. MINIMUM: only then design the simplest architecture that works — deep modules,
   clear boundaries, data flow as the organizing axis.

Signal architectural violations inline in one sentence; do not block. For a hard
audit run /architect-review. Never simplify away: trust-boundary validation,
data-loss prevention, security, accessibility, compiler-blocking abstractions.`;

const LEVEL_NOTE = {
  lite: 'Level lite: flag only critical violations (dependency cycles, broken boundaries).',
  full: 'Level full: apply the full ladder to every non-trivial component.',
  ultra: 'Level ultra: aggressive audit — also propose removing existing dead abstractions.',
};

function render(level) {
  if (level === 'off') return '';
  const note = LEVEL_NOTE[level] || LEVEL_NOTE.full;
  return `ARCHITECT-FIRST MODE ACTIVE — level: ${level}\n\n${LADDER}\n\n${note}\n`;
}

if (require.main === module) {
  const out = render(readLevel());
  if (out) process.stdout.write(out);
  process.exit(0);
}

module.exports = { readLevel, render, statePath, LEVELS };
