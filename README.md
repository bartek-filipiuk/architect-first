# Architect-First

An automated Principal Architect for Claude Code. Always-on architectural Decision
Ladder plus on-demand planning and audit commands. Where ponytail fights code
length, Architect-First guards system-level architecture: dependency direction,
module depth, context boundaries.

## Install

Add this repo as a marketplace, then install the plugin (two separate prompts):

```
/plugin marketplace add bartekfilipiuk/architect
```
```
/plugin install architect-first@architect-first
```

Start a session — `ARCHITECT-FIRST MODE ACTIVE` confirms the Decision Ladder is loaded.

## How it works

On every session start a hook injects the Decision Ladder as a mindset. It signals
architectural violations inline (one sentence) but does not block. For a hard audit,
run `/architect-review`.

## Commands

| Command | Purpose |
|---------|---------|
| `/architect <level>` | Switch intensity: `lite` / `full` (default) / `ultra` / `off` |
| `/architect-plan <idea>` | Design an architecture from scratch (data flow, components, ADRs, boundary map) |
| `/architect-review [target]` | Audit a diff or the whole repo (tagged findings + health summary) |
| `/architect-help` | Quick reference |

## The Decision Ladder

Stop at the first rung that holds: 0 UNDERSTAND · 1 YAGNI · 2 REUSE · 3 NATIVE ·
4 COST · 5 DIRECTION · 6 MINIMUM. Full text in `AGENTS.md`; the per-rung map to each
architect's philosophy is in `philosophy/principles.md`.

## Levels

- **lite** — only critical violations (dependency cycles, broken boundaries)
- **full** — full ladder on every non-trivial component (default)
- **ultra** — also proposes removing existing dead abstractions
- **off** — disabled

## Development

`npm test` runs the hook unit tests and the plugin validation gate (`node --test`,
no external dependencies).

## License

MIT
