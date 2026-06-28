# Principles — index

Each ladder rung maps to the architects whose philosophy backs it. Load a profile
on demand (e.g. when `/architect-review` flags a `direction:` violation, read
`architects/martin.md`). Do not load all profiles every session.

| Rung | Principle | Architects | Profiles |
|------|-----------|------------|----------|
| 0 | Understand the data before the solution | Acton, Ousterhout | [acton](architects/acton.md), [ousterhout](architects/ousterhout.md) |
| 1 | YAGNI — don't build for a future that may not come | Thomas & Hunt, Acton | [pragmatic](architects/pragmatic.md), [acton](architects/acton.md) |
| 2 | Reuse — the best function is the one not written | Carmack | [carmack](architects/carmack.md) |
| 3 | Native first — stdlib / platform before dependencies | Carmack, Hickey | [carmack](architects/carmack.md), [hickey](architects/hickey.md) |
| 4 | Abstractions have a cost | Carmack, Muratori | [carmack](architects/carmack.md), [muratori](architects/muratori.md) |
| 5 | Dependencies point inward | Martin | [martin](architects/martin.md) |
| 6 | Minimum viable architecture, deep modules | Ousterhout, Beck, Brooks, Torvalds, Pike, Fowler | [ousterhout](architects/ousterhout.md), [beck](architects/beck.md), [brooks](architects/brooks.md), [torvalds](architects/torvalds.md), [pike](architects/pike.md), [fowler](architects/fowler.md) |

## Cross-cutting themes

- **Simplicity is the goal, not the means** — Carmack, Hickey, Pike, Beck, Torvalds
- **Data defines architecture** — Acton, Brooks, Torvalds, Carmack
- **Abstractions have a cost** — Carmack, Muratori, Acton, Hickey
- **Understand before acting** — Acton, Hickey, Ousterhout, Brooks
- **Evolution, not revolution** — Fowler, Brooks, Beck, Thomas & Hunt
- **Automatic guardrails beat good intentions** — Carmack, Martin, Fowler
