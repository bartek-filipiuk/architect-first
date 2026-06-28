# Architect-First

An automated Principal Architect for Claude Code. It loads an architectural
**Decision Ladder** into every session and gives you on-demand commands to plan
and audit system design. The goal: keep AI-generated code from drifting into
over-engineering, wrong-way dependencies, and shallow modules — before the drift
becomes debt.

It is a *mindset*, not a linter. There is no runtime analyzer to configure; the
ladder and the architects' philosophy are prompts the model reasons with.

## Why

AI writes code fast, but it doesn't hold a system in its head. Left alone it adds
a layer "just in case", points a domain module at the database, or wraps one
implementation in an interface. Architect-First injects the discipline a senior
architect would apply on every change — cheaply, as context, on every turn.

## Install

Add the marketplace, then install the plugin (two separate prompts):

```
/plugin marketplace add bartek-filipiuk/architect-first
```
```
/plugin install architect-first@architect-first
```

Start a session — `ARCHITECT-FIRST MODE ACTIVE — level: full` confirms the ladder
is loaded.

## How it works

Three hooks, all zero-dependency Node (`node:*` only), all guaranteed to exit 0
(a hook can never block your session):

| Hook | Event | Job |
|------|-------|-----|
| `architect-activate.js` | `SessionStart`, `SubagentStart` | Inject the Decision Ladder + current level |
| `architect-mode-tracker.js` | `UserPromptSubmit` | Detect `/architect <level>` and persist it |

The level lives in a `.architect-level` file in your project. In always-on mode the
model flags architectural violations inline, in one sentence — it does not stop your
work. For a hard, line-by-line audit, run `/architect-review`.

## Commands

| Command | Purpose |
|---------|---------|
| `/architect <level>` | Switch intensity: `lite` / `full` (default) / `ultra` / `off` |
| `/architect-plan <idea>` | Design an architecture from scratch: data flow first, bounded contexts, the ladder applied per component, ADRs, and a dependency/boundary map — printed in chat |
| `/architect-review [target]` | Audit a diff (default) or the whole repo, with tagged findings + an architectural-health summary |
| `/architect-help` | Quick reference: ladder, levels, tags |

`/architect-review` emits one finding per line as `file:line: tag description. recommendation.`

| Tag | Means |
|-----|-------|
| `direction:` | A dependency points the wrong way (e.g. domain imports infrastructure) |
| `shallow:` | A shallow module — broad interface over trivial logic |
| `coupling:` | Needless coupling between contexts |
| `speculative:` | Speculative flexibility (YAGNI) |
| `data-leak:` | Information leaking across a layer boundary |

## The Decision Ladder

Before writing or generating code, the model walks the ladder and **stops at the
first rung that holds**:

| # | Rung | The question |
|---|------|--------------|
| 0 | UNDERSTAND *(always)* | Read the code this change touches; trace the real data flow |
| 1 | YAGNI | Does this need to exist for current requirements? |
| 2 | REUSE | Is similar logic already in this codebase? |
| 3 | NATIVE | Does the standard library or platform already do it? |
| 4 | COST | Does the abstraction cost more than it delivers? |
| 5 | DIRECTION | Do dependencies point inward, toward business rules? |
| 6 | MINIMUM | Only then: the simplest architecture that works — deep modules, clear boundaries |

Full text in [`AGENTS.md`](AGENTS.md); the per-rung map to each architect is in
[`philosophy/principles.md`](philosophy/principles.md).

## Levels

- **lite** — flag only critical violations (dependency cycles, broken boundaries)
- **full** — apply the full ladder to every non-trivial component *(default)*
- **ultra** — also propose removing existing dead abstractions
- **off** — disabled

## The architects behind it

The ladder isn't invented — it distills the working philosophy of engineers who
spent careers fighting complexity. Each ships as a one-screen profile in
[`philosophy/architects/`](philosophy/architects/), loaded on demand when a rung
needs deeper backing.

| Architect | What they contribute |
|-----------|----------------------|
| **John Carmack** | A function beats a method beats a class beats a framework; abstractions have a real, underestimated cost |
| **Rich Hickey** | *Simple* (unentangled) is not *easy* (familiar); design for the artifact, not the typing |
| **Robert C. Martin** | The Dependency Rule — source dependencies point inward, toward business rules |
| **John Ousterhout** | Deep modules: a simple interface over a complex implementation; manage complexity first |
| **Mike Acton** | Data-oriented design — every program transforms data; understand the data first |
| **Martin Fowler** | Evolutionary architecture — invest in the parts that are hard to change |
| **Kent Beck** | Four rules of simple design; readability is empathy for the next reader |
| **Fred Brooks** | Separate essential complexity from the accidental kind you created |
| **Casey Muratori** | Architecture is runtime: layers the compiler can't see through cost performance |
| **Linus Torvalds** | "Good taste" — pick data structures that delete edge cases |
| **Rob Pike** | Simplicity is hard-won; composition over inheritance, explicit over implicit |
| **Thomas & Hunt** | DRY, YAGNI, tracer bullets — the pragmatic baseline |

## Safety boundaries

The ladder cuts complexity, never these: trust-boundary/input validation,
data-loss prevention, security controls, accessibility, performance-blocking
abstractions, and readability (minimal duplication is fine when it clarifies
intent). These are stated in `AGENTS.md` and in every command prompt.

## Project layout

```
.claude-plugin/        plugin.json + marketplace.json (self-installable)
hooks/                 3 Node hooks + architect-hooks.json wiring
AGENTS.md              the always-on ruleset (full ladder + boundaries)
philosophy/
  principles.md        rung -> architect index
  architects/          12 one-screen profiles, loaded on demand
commands/              4 .toml commands (pure prompts, no code)
test/                  node --test: hook unit tests + plugin validation gate
```

## Development

```
npm test
```

Runs the hook unit tests and the whole-plugin validation + security gate
(`node --test`, no external dependencies). The gate checks that every file
parses, the ladder is intact, all 12 profiles exist, and the hooks exit 0
without leaking environment variables.

## License

MIT
