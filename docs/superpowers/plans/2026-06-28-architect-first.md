# Architect-First Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Zbudować plugin Claude Code „Architect-First" — always-on Architektoniczna Drabina Decyzyjna (wstrzykiwana hookiem) + komendy `/architect`, `/architect-plan`, `/architect-review`, `/architect-help`.

**Architecture:** Plugin na wzór ponytaila. Manifest `plugin.json` → konfiguracja hooków. Trzy lekkie hooki Node (`node:` built-ins, zero deps): `architect-activate.js` wstrzykuje Drabinę na `SessionStart`/`SubagentStart`, `architect-mode-tracker.js` śledzi `/architect <level>` na `UserPromptSubmit`. Cała wiedza w markdown (`AGENTS.md` = pełna Drabina + granice; `philosophy/` = 12 profili ładowanych na żądanie). Komendy to czyste prompty `.toml` (zero kodu). Analizę architektury wykonuje LLM, nie JS.

**Tech Stack:** Node.js (built-in `node:fs`, `node:path`, `node:test` — brak npm deps), Markdown, TOML.

## Global Constraints

- **Język artefaktów produktu = ANGIELSKI.** `plugin.json`, `AGENTS.md`, wszystkie `*.toml`, profile architektów, `README.md`, komentarze w hookach — po angielsku. (Ten plan i spec pozostają po polsku.)
- **Hooki: zero zewnętrznych zależności** — tylko moduły `node:*`. Hook ZAWSZE kończy `process.exit(0)` (nigdy nie blokuje sesji). Nigdy nie wypisuje sekretów ani `process.env` na stdout.
- **Wzór hooków = ponytail:** ścieżki przez `${CLAUDE_PLUGIN_ROOT}`, wariant `commandWindows` z guardem `Get-Command node`, `timeout: 5`.
- **Drabina = dokładnie 6 szczebli (0–6)** wg spec §4. Poziomy: `lite` / `full` / `ultra` / `off`, domyślny `full`.
- **Kontrakt stanu poziomu:** plik `.architect-level` w katalogu `process.env.ARCHITECT_STATE_DIR || process.env.CLAUDE_PROJECT_DIR || process.cwd()`, zawartość = jedno słowo (`lite|full|ultra|off`). Override `ARCHITECT_STATE_DIR` istnieje wyłącznie po to, by testy nie pisały po katalogu projektu.
- **Jeden plik = jedna odpowiedzialność. Commit per task.**
- **Testy:** `node --test` (built-in). TDD obowiązuje dla logiki (hooki). Pliki markdown/toml weryfikuje końcowy gate (Task 11) — strukturalnie i pod kątem bezpieczeństwa.
- **Źródło cytatów (anti-hallucination):** wszystkie cytaty architektów pochodzą z `docs/Architect-First_ Kompilacja Badawcza - Filozofie Programowania Wybitnych Architektów.md`. Nie wymyślaj cytatów spoza tego pliku.

---

### Task 1: Manifest pluginu + harness testowy

**Files:**
- Create: `.claude-plugin/plugin.json`
- Create: `package.json`
- Test: `test/manifest.test.js`

**Interfaces:**
- Produces: `plugin.json` ze ścieżką hooków `./hooks/architect-hooks.json` (Task 4 ją tworzy). `package.json` ze skryptem `test` = `node --test`.

- [ ] **Step 1: Napisz failujący test**

`test/manifest.test.js`:
```js
const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');

const root = path.join(__dirname, '..');

test('plugin.json is valid and complete', () => {
  const pj = JSON.parse(fs.readFileSync(path.join(root, '.claude-plugin/plugin.json'), 'utf8'));
  assert.strictEqual(pj.name, 'architect-first');
  assert.ok(typeof pj.version === 'string' && pj.version.length > 0);
  assert.ok(typeof pj.description === 'string' && pj.description.length > 0);
  assert.strictEqual(pj.hooks, './hooks/architect-hooks.json');
});

test('package.json exposes node --test', () => {
  const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
  assert.match(pkg.scripts.test, /node --test/);
});
```

- [ ] **Step 2: Uruchom test — ma failować**

Run: `node --test test/manifest.test.js`
Expected: FAIL (`ENOENT` — brak `plugin.json`/`package.json`).

- [ ] **Step 3: Stwórz pliki**

`.claude-plugin/plugin.json`:
```json
{
  "name": "architect-first",
  "version": "0.1.0",
  "description": "Automated Principal Architect. Always-on architectural Decision Ladder (YAGNI, reuse, native, abstraction cost, dependency direction, minimum viable architecture) plus on-demand planning and audit commands.",
  "author": {
    "name": "Bartek Filipiuk"
  },
  "hooks": "./hooks/architect-hooks.json"
}
```

`package.json`:
```json
{
  "name": "architect-first",
  "version": "0.1.0",
  "private": true,
  "description": "Architect-First plugin for Claude Code",
  "scripts": {
    "test": "node --test"
  }
}
```

- [ ] **Step 4: Uruchom test — ma przejść**

Run: `node --test test/manifest.test.js`
Expected: PASS (2 testy).

- [ ] **Step 5: Commit**

```bash
git add .claude-plugin/plugin.json package.json test/manifest.test.js
git commit -m "feat: plugin manifest + test harness"
```

---

### Task 2: Hook — mode-tracker (śledzenie `/architect <level>`)

**Files:**
- Create: `hooks/architect-mode-tracker.js`
- Test: `test/hooks-mode.test.js`

**Interfaces:**
- Produces: moduł eksportujący `{ parseLevel, statePath, main }`. `statePath()` zwraca ścieżkę pliku stanu wg kontraktu z Global Constraints. `parseLevel(prompt)` → `'lite'|'full'|'ultra'|'off'|null`. Task 3 (`activate`) konsumuje ten sam kontrakt `statePath`/format.

- [ ] **Step 1: Napisz failujący test**

`test/hooks-mode.test.js`:
```js
const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const stateDir = fs.mkdtempSync(path.join(os.tmpdir(), 'arch-mode-'));
process.env.ARCHITECT_STATE_DIR = stateDir;
const { parseLevel, statePath, main } = require('../hooks/architect-mode-tracker.js');

test('parseLevel extracts a valid level', () => {
  assert.strictEqual(parseLevel('please /architect ultra now'), 'ultra');
  assert.strictEqual(parseLevel('/architect-mode lite'), 'lite');
  assert.strictEqual(parseLevel('/architect OFF'), 'off');
});

test('parseLevel ignores prompts without the command', () => {
  assert.strictEqual(parseLevel('just write some code'), null);
  assert.strictEqual(parseLevel('/architect-review this diff'), null);
});

test('main persists the level from a UserPromptSubmit payload', () => {
  main(JSON.stringify({ prompt: '/architect ultra' }));
  assert.strictEqual(fs.readFileSync(statePath(), 'utf8').trim(), 'ultra');
});

test('main is a no-op on malformed input (never throws)', () => {
  assert.doesNotThrow(() => main('not json'));
});
```

- [ ] **Step 2: Uruchom test — ma failować**

Run: `node --test test/hooks-mode.test.js`
Expected: FAIL (`Cannot find module '../hooks/architect-mode-tracker.js'`).

- [ ] **Step 3: Napisz implementację**

`hooks/architect-mode-tracker.js`:
```js
#!/usr/bin/env node
// UserPromptSubmit hook: detect `/architect <level>` and persist the chosen level.
// Never blocks the session — always exits 0.
const fs = require('node:fs');
const path = require('node:path');

const LEVELS = ['lite', 'full', 'ultra', 'off'];

function statePath() {
  const dir = process.env.ARCHITECT_STATE_DIR
    || process.env.CLAUDE_PROJECT_DIR
    || process.cwd();
  return path.join(dir, '.architect-level');
}

function parseLevel(prompt) {
  const m = /(?:^|\s)\/architect(?:-mode)?\s+(lite|full|ultra|off)\b/i.exec(prompt || '');
  return m ? m[1].toLowerCase() : null;
}

function main(input) {
  let prompt = '';
  try { prompt = JSON.parse(input || '{}').prompt || ''; } catch { /* ignore */ }
  const level = parseLevel(prompt);
  if (level && LEVELS.includes(level)) {
    try { fs.writeFileSync(statePath(), level, 'utf8'); } catch { /* ignore */ }
  }
}

if (require.main === module) {
  let data = '';
  process.stdin.on('data', (c) => { data += c; });
  process.stdin.on('end', () => { main(data); process.exit(0); });
  process.stdin.on('error', () => process.exit(0));
}

module.exports = { parseLevel, statePath, main, LEVELS };
```

- [ ] **Step 4: Uruchom test — ma przejść**

Run: `node --test test/hooks-mode.test.js`
Expected: PASS (4 testy).

- [ ] **Step 5: Commit**

```bash
git add hooks/architect-mode-tracker.js test/hooks-mode.test.js
git commit -m "feat: mode-tracker hook for /architect <level>"
```

---

### Task 3: Hook — activate (injection Drabiny)

**Files:**
- Create: `hooks/architect-activate.js`
- Test: `test/hooks-activate.test.js`

**Interfaces:**
- Consumes: kontrakt `statePath`/format z Task 2 (plik `.architect-level`, jedno słowo).
- Produces: moduł `{ readLevel, render, statePath }`. `render(level)` → string (pusty dla `off`).

- [ ] **Step 1: Napisz failujący test**

`test/hooks-activate.test.js`:
```js
const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const stateDir = fs.mkdtempSync(path.join(os.tmpdir(), 'arch-act-'));
process.env.ARCHITECT_STATE_DIR = stateDir;
const { readLevel, render, statePath } = require('../hooks/architect-activate.js');

test('readLevel defaults to full when no state file', () => {
  assert.strictEqual(readLevel(), 'full');
});

test('readLevel reads a persisted level', () => {
  fs.writeFileSync(statePath(), 'ultra', 'utf8');
  assert.strictEqual(readLevel(), 'ultra');
});

test('render(full) contains the activation marker and all 6 rungs', () => {
  const out = render('full');
  assert.match(out, /ARCHITECT-FIRST MODE ACTIVE/);
  for (const kw of ['UNDERSTAND', 'YAGNI', 'REUSE', 'NATIVE', 'COST', 'DIRECTION', 'MINIMUM']) {
    assert.match(out, new RegExp(kw));
  }
});

test('render(off) is empty', () => {
  assert.strictEqual(render('off'), '');
});

test('render(ultra) adds the aggressive-audit note', () => {
  assert.match(render('ultra'), /ultra/i);
});
```

- [ ] **Step 2: Uruchom test — ma failować**

Run: `node --test test/hooks-activate.test.js`
Expected: FAIL (`Cannot find module '../hooks/architect-activate.js'`).

- [ ] **Step 3: Napisz implementację**

`hooks/architect-activate.js`:
```js
#!/usr/bin/env node
// SessionStart / SubagentStart hook: inject the Architectural Decision Ladder,
// respecting the saved level. Never blocks the session — always exits 0.
const fs = require('node:fs');
const path = require('node:path');

const LEVELS = ['lite', 'full', 'ultra', 'off'];

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
```

- [ ] **Step 4: Uruchom test — ma przejść**

Run: `node --test test/hooks-activate.test.js`
Expected: PASS (5 testów).

- [ ] **Step 5: Commit**

```bash
git add hooks/architect-activate.js test/hooks-activate.test.js
git commit -m "feat: activate hook injecting the Decision Ladder"
```

---

### Task 4: Konfiguracja hooków (`architect-hooks.json`)

**Files:**
- Create: `hooks/architect-hooks.json`
- Test: `test/hooks-config.test.js`

**Interfaces:**
- Consumes: istniejące `hooks/architect-activate.js` (Task 3), `hooks/architect-mode-tracker.js` (Task 2).

- [ ] **Step 1: Napisz failujący test**

`test/hooks-config.test.js`:
```js
const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');

const root = path.join(__dirname, '..');
const cfg = () => JSON.parse(fs.readFileSync(path.join(root, 'hooks/architect-hooks.json'), 'utf8'));

test('config wires the three lifecycle events', () => {
  const h = cfg().hooks;
  assert.ok(h.SessionStart, 'SessionStart missing');
  assert.ok(h.SubagentStart, 'SubagentStart missing');
  assert.ok(h.UserPromptSubmit, 'UserPromptSubmit missing');
});

test('every referenced hook script exists and timeout is bounded', () => {
  const json = JSON.stringify(cfg());
  for (const f of ['architect-activate.js', 'architect-mode-tracker.js']) {
    assert.ok(json.includes(f), `${f} not referenced`);
    assert.ok(fs.existsSync(path.join(root, 'hooks', f)), `${f} missing on disk`);
  }
  for (const t of json.matchAll(/"timeout":\s*(\d+)/g)) {
    assert.ok(Number(t[1]) <= 5, 'timeout must be <= 5s');
  }
});
```

- [ ] **Step 2: Uruchom test — ma failować**

Run: `node --test test/hooks-config.test.js`
Expected: FAIL (`ENOENT`).

- [ ] **Step 3: Stwórz plik**

`hooks/architect-hooks.json`:
```json
{
  "hooks": {
    "SessionStart": [
      {
        "matcher": "startup|resume|clear|compact",
        "hooks": [
          {
            "type": "command",
            "command": "node \"${CLAUDE_PLUGIN_ROOT}/hooks/architect-activate.js\"; exit 0",
            "commandWindows": "if (Get-Command node -ErrorAction SilentlyContinue) { node \"$env:CLAUDE_PLUGIN_ROOT\\hooks\\architect-activate.js\" }",
            "timeout": 5,
            "statusMessage": "Loading Architect-First mode..."
          }
        ]
      }
    ],
    "SubagentStart": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "node \"${CLAUDE_PLUGIN_ROOT}/hooks/architect-activate.js\"; exit 0",
            "commandWindows": "if (Get-Command node -ErrorAction SilentlyContinue) { node \"$env:CLAUDE_PLUGIN_ROOT\\hooks\\architect-activate.js\" }",
            "timeout": 5,
            "statusMessage": "Loading Architect-First mode..."
          }
        ]
      }
    ],
    "UserPromptSubmit": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "node \"${CLAUDE_PLUGIN_ROOT}/hooks/architect-mode-tracker.js\"; exit 0",
            "commandWindows": "if (Get-Command node -ErrorAction SilentlyContinue) { node \"$env:CLAUDE_PLUGIN_ROOT\\hooks\\architect-mode-tracker.js\" }",
            "timeout": 5,
            "statusMessage": "Tracking Architect-First level..."
          }
        ]
      }
    ]
  }
}
```

- [ ] **Step 4: Uruchom test — ma przejść**

Run: `node --test test/hooks-config.test.js`
Expected: PASS (2 testy).

- [ ] **Step 5: Commit**

```bash
git add hooks/architect-hooks.json test/hooks-config.test.js
git commit -m "feat: hooks config wiring SessionStart/SubagentStart/UserPromptSubmit"
```

---

### Task 5: `AGENTS.md` — pełna Drabina + granice bezpieczeństwa

**Files:**
- Create: `AGENTS.md`

**Interfaces:**
- Produces: kanon rulesetu (pełne 6 szczebli + granice + poziomy). Końcowy gate (Task 11) sprawdza obecność szczebli i sekcji granic.

- [ ] **Step 1: Stwórz plik** (treść EN — to rdzeń produktu)

`AGENTS.md`:
```markdown
# Architect-First

You are an automated Principal Architect. Before writing or generating any code,
apply the Decision Ladder. Stop at the first rung that holds.

## Decision Ladder

0. **UNDERSTAND (always).** Read the code this change touches. Trace the real data
   flow. Identify what data goes in and what comes out. Never propose before you
   understand. "Lazy about the solution, never about reading."
1. **YAGNI.** Does this need to exist for current, confirmed requirements? If it is
   speculative — don't create it, and say so in one line.
2. **REUSE.** Is similar logic or a similar data structure already in this codebase?
   Reuse or extend it instead of rewriting.
3. **NATIVE.** Does the standard library or a native platform feature solve this?
   Use it before adding a dependency.
4. **COST.** Will this interface/layer have more than one implementation, or does it
   just pass data through? If the cost outweighs the benefit, simplify to a function.
5. **DIRECTION.** Do source-code dependencies point inward, toward business rules?
   Business logic must not depend on infrastructure detail. Fix violations by
   inverting the dependency.
6. **MINIMUM VIABLE ARCHITECTURE.** Only now design: the simplest structure that
   works, with deep modules (simple interface, complex implementation), clear
   responsibility boundaries, and data flow as the organizing axis.

The ladder runs AFTER you understand the problem, not instead of it.

## Intensity levels

- **lite** — flag only critical violations (dependency cycles, broken boundaries).
- **full** — apply the full ladder to every non-trivial component. Default.
- **ultra** — aggressive: also propose removing existing dead abstractions.
- **off** — disabled.

Switch with `/architect lite|full|ultra|off`. In always-on mode, signal violations
inline in one sentence — do not block. For a hard audit, run `/architect-review`.

## Safety Boundaries (NEVER compromise)

- Trust-boundary / input validation
- Data-loss prevention and error handling for user-facing flows
- Security controls
- Accessibility basics
- Performance: never introduce abstractions that block compiler optimization
- Readability: accept minimal duplication when it makes intent clearer (empathy
  for the reader wins over a strict metric)

## Principles behind the ladder

- Data flow defines structure, not abstract world models (Acton)
- Deep modules over shallow modules (Ousterhout)
- Simple over easy — no incidental complexity (Hickey)
- The cheapest, safest function is the one that doesn't exist (Carmack)
- Dependencies point inward (Martin)

See `philosophy/principles.md` for the per-rung map to each architect's profile.
```

- [ ] **Step 2: Weryfikacja ręczna**

Run: `grep -c -E "UNDERSTAND|YAGNI|REUSE|NATIVE|COST|DIRECTION|MINIMUM" AGENTS.md`
Expected: ≥7.

- [ ] **Step 3: Commit**

```bash
git add AGENTS.md
git commit -m "feat: AGENTS.md ruleset (full Decision Ladder + safety boundaries)"
```

---

### Task 6: `philosophy/principles.md` — indeks zasada → architekt → plik

**Files:**
- Create: `philosophy/principles.md`

**Interfaces:**
- Produces: mapę linkującą do 12 plików w `architects/` (Task 7 je tworzy). Gate (Task 11) sprawdza 12 odnośników.

- [ ] **Step 1: Stwórz plik** (EN)

`philosophy/principles.md`:
```markdown
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
```

- [ ] **Step 2: Weryfikacja**

Run: `grep -c "architects/" philosophy/principles.md`
Expected: ≥12 (po jednym odnośniku na architekta, łącznie z powtórzeniami w tabeli).

- [ ] **Step 3: Commit**

```bash
git add philosophy/principles.md
git commit -m "feat: principles index mapping rungs to architect profiles"
```

---

### Task 7: 12 profili architektów

**Files:**
- Create: `philosophy/architects/carmack.md`, `hickey.md`, `martin.md`, `fowler.md`, `ousterhout.md`, `acton.md`, `beck.md`, `brooks.md`, `muratori.md`, `torvalds.md`, `pike.md`, `pragmatic.md`

**Interfaces:**
- Consumes: cytaty WYŁĄCZNIE z `docs/Architect-First_ Kompilacja Badawcza - Filozofie Programowania Wybitnych Architektów.md` (anti-hallucination — najpierw przeczytaj ten plik).

**Szablon każdego profilu (EN, ~1 ekran):**
```markdown
# {Name} — {one-line domain}

## Thesis
{2-4 sentences: the core idea this architect contributes to the ladder.}

## Anchor quotes
> "{verbatim quote from the research compilation}"

> "{verbatim quote from the research compilation}"

## In Architect-First
- Rung {N}: {how this profile is applied when that rung fires.}
```

**Mapowanie profil → szczebel + skąd cytaty (sekcja w kompilacji badawczej):**

| Plik | Architekt | Szczebel | Sekcja źródłowa |
|------|-----------|----------|-----------------|
| carmack.md | John Carmack | 2,3,4 | §1 |
| hickey.md | Rich Hickey | 3 | §2 |
| martin.md | Robert C. Martin | 5 | §3 |
| fowler.md | Martin Fowler | 6 | §4 |
| ousterhout.md | John Ousterhout | 0,6 | §5 |
| acton.md | Mike Acton | 0,1 | §6 |
| beck.md | Kent Beck | 6 | §7 |
| brooks.md | Fred Brooks | 6 | §8 |
| muratori.md | Casey Muratori | 4 | §9 |
| torvalds.md | Linus Torvalds | 6 | §10 |
| pike.md | Rob Pike | 6 | §11 |
| pragmatic.md | Thomas & Hunt | 1 | §12 |

- [ ] **Step 1: Przeczytaj źródło cytatów**

Run: `sed -n '1,310p' "docs/Architect-First_ Kompilacja Badawcza - Filozofie Programowania Wybitnych Architektów.md"`
(Każdy profil używa cytatów dosłownie z odpowiadającej sekcji §1–§12.)

- [ ] **Step 2: Stwórz 12 plików wg szablonu**

Przykład — `philosophy/architects/carmack.md`:
```markdown
# John Carmack — id Software, pragmatic minimalism

## Thesis
The cheapest, safest, most testable function is the one that doesn't exist. Prefer
a function over a method, a method over a class, a class over a framework. Every
abstraction carries a cost that is routinely underestimated — and a new layer is
also an obstacle to future change.

## Anchor quotes
> "Sometimes, the elegant implementation is just a function. Not a method. Not a class. Not a framework. Just a function."

> "It is not that uncommon for the cost of an abstraction to outweigh the benefit it delivers. Kill one today!"

## In Architect-First
- Rung 2 (REUSE): the function least likely to cause a problem is one that doesn't exist — reach for what already exists first.
- Rung 3 (NATIVE): an elegant implementation is often just a function over a native primitive.
- Rung 4 (COST): name the abstraction's cost explicitly; if it outweighs the benefit, collapse it to a function.
```

Pozostałe 11 plików: ten sam szablon, cytaty dosłownie z odpowiedniej sekcji kompilacji, pole „In Architect-First" odnosi się do szczebli z tabeli wyżej.

- [ ] **Step 3: Weryfikacja kompletności**

Run: `ls philosophy/architects/*.md | wc -l`
Expected: 12.

Run: `for f in philosophy/architects/*.md; do grep -q "## Anchor quotes" "$f" && grep -q "## In Architect-First" "$f" || echo "INCOMPLETE: $f"; done`
Expected: brak outputu.

- [ ] **Step 4: Commit**

```bash
git add philosophy/architects/
git commit -m "feat: 12 architect philosophy profiles (on-demand knowledge base)"
```

---

### Task 8: Komendy `architect.toml` + `architect-help.toml`

**Files:**
- Create: `commands/architect.toml`
- Create: `commands/architect-help.toml`

- [ ] **Step 1: Stwórz `commands/architect.toml`** (EN)

```toml
description = "Switch Architect-First intensity level (lite/full/ultra/off)"
prompt = "Switch Architect-First to {{args}} mode. If no level is given, use full. Architectural guardian mode: before any code, apply the Decision Ladder and stop at the first rung that holds — 0 UNDERSTAND (read the code, trace the data flow), 1 YAGNI (does it need to exist for current requirements?), 2 REUSE (already in this codebase?), 3 NATIVE (stdlib/platform does it?), 4 COST (does the abstraction cost more than it delivers? simplify to a function), 5 DIRECTION (do dependencies point inward toward business rules?), 6 MINIMUM (only then: simplest architecture, deep modules, clear boundaries). lite = critical violations only; full = full ladder; ultra = also propose removing dead abstractions; off = disabled. Signal violations inline, do not block. Never simplify away trust-boundary validation, data-loss prevention, security, or accessibility."
```

- [ ] **Step 2: Stwórz `commands/architect-help.toml`** (EN)

```toml
description = "Architect-First quick reference: the Decision Ladder, levels, and review tags"
prompt = "Show the Architect-First quick reference. The Decision Ladder (stop at the first rung that holds): 0 UNDERSTAND — read the code, trace the data flow; 1 YAGNI — does it need to exist for current requirements?; 2 REUSE — already in this codebase?; 3 NATIVE — stdlib/platform does it?; 4 COST — does the abstraction cost more than it delivers?; 5 DIRECTION — do dependencies point inward?; 6 MINIMUM — simplest architecture, deep modules. Levels: lite (critical only), full (default), ultra (propose removing dead abstractions), off. Commands: /architect <level> (switch level), /architect-plan (design architecture from scratch), /architect-review (audit a diff or the whole repo). Review tags: direction (dependency direction broken), shallow (shallow module), coupling (needless coupling), speculative (YAGNI), data-leak (info leak between layers)."
```

- [ ] **Step 3: Weryfikacja parsowania**

Run: `node -e "const fs=require('node:fs');for(const f of ['commands/architect.toml','commands/architect-help.toml']){const s=fs.readFileSync(f,'utf8');if(!/^description\s*=/m.test(s)||!/^prompt\s*=/m.test(s))throw new Error('bad '+f)}console.log('ok')"`
Expected: `ok`.

- [ ] **Step 4: Commit**

```bash
git add commands/architect.toml commands/architect-help.toml
git commit -m "feat: /architect level switch + /architect-help commands"
```

---

### Task 9: Komendy `architect-plan.toml` + `architect-review.toml`

**Files:**
- Create: `commands/architect-plan.toml`
- Create: `commands/architect-review.toml`

- [ ] **Step 1: Stwórz `commands/architect-plan.toml`** (EN)

```toml
description = "Plan a software architecture from scratch using the Decision Ladder"
prompt = "Act as a Principal Architect and plan the architecture for: {{args}}. Process: (1) Gather the business requirements — what must the system do? (2) Identify inputs and outputs first — model the data and its transformations before the code (data-oriented). (3) Define bounded contexts — responsibility boundaries and a ubiquitous language. (4) Apply the Decision Ladder to each component (0 UNDERSTAND, 1 YAGNI, 2 REUSE, 3 NATIVE, 4 COST, 5 DIRECTION, 6 MINIMUM), stopping at the first rung that holds. (5) Produce the plan. Output in chat (do not write files): a Mermaid data-flow diagram; a component list with one-line responsibilities; ADRs for the key decisions (Context / Decision / Decision Ladder rung applied / Consequences / Alternatives considered); a dependency and boundary map. Favor deep modules and the simplest architecture that works. Never compromise trust-boundary validation, data-loss prevention, security, or accessibility."
```

- [ ] **Step 2: Stwórz `commands/architect-review.toml`** (EN)

```toml
description = "Audit a diff or the whole repo for architectural violations"
prompt = "Audit the architecture of {{args}} (default: the current diff; if asked, the whole repo). First understand the code and trace the data flow, then report violations. Output one finding per line in the format: <file>:<line>: <tag> <description>. <recommendation>. Tags: direction (a source dependency points the wrong way — e.g. domain imports infrastructure), shallow (a shallow module: broad interface over trivial logic), coupling (needless coupling between contexts), speculative (speculative flexibility / YAGNI), data-leak (information leaking across layer boundaries). After the findings, give an Architectural Health summary: counts per tag and the top 3 fixes by impact. Be specific and cite exact files and lines. Do not flag trust-boundary validation, error handling, security, or accessibility as over-engineering — those are never simplified away."
```

- [ ] **Step 3: Weryfikacja parsowania**

Run: `node -e "const fs=require('node:fs');for(const f of ['commands/architect-plan.toml','commands/architect-review.toml']){const s=fs.readFileSync(f,'utf8');if(!/^description\s*=/m.test(s)||!/^prompt\s*=/m.test(s))throw new Error('bad '+f)}console.log('ok')"`
Expected: `ok`.

- [ ] **Step 4: Commit**

```bash
git add commands/architect-plan.toml commands/architect-review.toml
git commit -m "feat: /architect-plan + /architect-review commands"
```

---

### Task 10: `README.md`

**Files:**
- Create: `README.md`

- [ ] **Step 1: Stwórz plik** (EN)

`README.md`:
```markdown
# Architect-First

An automated Principal Architect for Claude Code. Always-on architectural Decision
Ladder plus on-demand planning and audit commands. Where ponytail fights code
length, Architect-First guards system-level architecture: dependency direction,
module depth, context boundaries.

## Install

Add this plugin via your Claude Code plugin marketplace, then start a session —
`ARCHITECT-FIRST MODE ACTIVE` confirms the Decision Ladder is loaded.

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
```

- [ ] **Step 2: Weryfikacja**

Run: `grep -c -E "^## (Install|Commands|The Decision Ladder)" README.md`
Expected: 3.

- [ ] **Step 3: Commit**

```bash
git add README.md
git commit -m "docs: README (install, commands, ladder, levels)"
```

---

### Task 11: Verify + security gate (`test/validate-plugin.js`)

**Files:**
- Create: `test/validate-plugin.js`

**Interfaces:**
- Consumes: wszystkie wcześniejsze artefakty. To odpowiednik etap-22 verify + etap-23 security gate — uruchamiany jako część `npm test`.

- [ ] **Step 1: Napisz całościowy gate (test-first — pokaże braki, jeśli coś pominięto)**

`test/validate-plugin.js`:
```js
const test = require('node:test');
const assert = require('node:assert');
const { execFileSync } = require('node:child_process');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const root = path.join(__dirname, '..');
const r = (p) => path.join(root, p);

test('all required files exist', () => {
  const required = [
    '.claude-plugin/plugin.json', 'package.json', 'AGENTS.md', 'README.md',
    'hooks/architect-hooks.json', 'hooks/architect-activate.js', 'hooks/architect-mode-tracker.js',
    'philosophy/principles.md',
    'commands/architect.toml', 'commands/architect-plan.toml',
    'commands/architect-review.toml', 'commands/architect-help.toml',
  ];
  for (const f of required) assert.ok(fs.existsSync(r(f)), `missing ${f}`);
  assert.strictEqual(fs.readdirSync(r('philosophy/architects')).filter(f => f.endsWith('.md')).length, 12);
});

test('all JSON and TOML parse', () => {
  for (const f of ['.claude-plugin/plugin.json', 'package.json', 'hooks/architect-hooks.json']) {
    JSON.parse(fs.readFileSync(r(f), 'utf8'));
  }
  for (const f of fs.readdirSync(r('commands'))) {
    const s = fs.readFileSync(r(path.join('commands', f)), 'utf8');
    assert.match(s, /^description\s*=/m, `${f} missing description`);
    assert.match(s, /^prompt\s*=/m, `${f} missing prompt`);
  }
});

test('AGENTS.md has all 6 rungs + safety boundaries', () => {
  const s = fs.readFileSync(r('AGENTS.md'), 'utf8');
  for (const kw of ['UNDERSTAND', 'YAGNI', 'REUSE', 'NATIVE', 'COST', 'DIRECTION', 'MINIMUM']) {
    assert.match(s, new RegExp(kw), `AGENTS.md missing ${kw}`);
  }
  assert.match(s, /Safety Boundaries/i);
});

test('SECURITY: hooks run cleanly (exit 0) and emit no env secrets', () => {
  const stateDir = fs.mkdtempSync(path.join(os.tmpdir(), 'arch-gate-'));
  const env = { ...process.env, ARCHITECT_STATE_DIR: stateDir, SECRET_CANARY: 'do-not-leak' };
  const act = execFileSync('node', [r('hooks/architect-activate.js')], { env, encoding: 'utf8' });
  assert.ok(!act.includes('do-not-leak'), 'activate leaked an env var');
  assert.ok(act.includes('ARCHITECT-FIRST MODE ACTIVE'));
  // mode-tracker consumes stdin and must exit 0 even on junk
  execFileSync('node', [r('hooks/architect-mode-tracker.js')], { env, input: 'not-json', encoding: 'utf8' });
});

test('SECURITY: hooks declare no external dependencies', () => {
  for (const f of ['architect-activate.js', 'architect-mode-tracker.js']) {
    const s = fs.readFileSync(r(path.join('hooks', f)), 'utf8');
    for (const m of s.matchAll(/require\(['"]([^'"]+)['"]\)/g)) {
      assert.ok(m[1].startsWith('node:'), `${f} requires non-builtin ${m[1]}`);
    }
  }
});
```

- [ ] **Step 2: Uruchom pełny zestaw**

Run: `npm test`
Expected: PASS — wszystkie pliki testowe (manifest, hooks-mode, hooks-activate, hooks-config, validate-plugin) zielone. Jeśli gate wskaże brak — uzupełnij brakujący artefakt z odpowiedniego tasku i powtórz.

- [ ] **Step 3: Commit**

```bash
git add test/validate-plugin.js
git commit -m "test: plugin verify + security gate"
```

---

## Self-review (wypełnione przez autora planu)

**Spec coverage:** §1 cel → README/AGENTS; §2 decyzje → wszystkie taski; §3 struktura → Task 1–11 pokrywają każdy plik; §4 Drabina + poziomy → Task 3 (render), Task 5 (AGENTS), Task 8 (switch); §5 komendy + tagi → Task 8/9; §6 filozofia rozbita → Task 6/7; §7 granice bezpieczeństwa → Task 5 + gate Task 11; §8 proces budowy → ten plan (TDD hooków, commit per task, gate); §9 pominięcia → świadomie poza zakresem. Brak luk.

**Placeholder scan:** brak TBD/TODO; jedyne „szablonowe" miejsce (Task 7) ma pełny szablon + konkretne mapowanie + przykład `carmack.md` + wskazane źródło cytatów — to instrukcja, nie placeholder.

**Type/contract consistency:** `statePath()` i format `.architect-level` identyczne w Task 2 i 3; `ARCHITECT_STATE_DIR` użyty spójnie w testach i gate; nazwy eksportów (`parseLevel`, `render`, `readLevel`) zgodne między implementacją a testami.
