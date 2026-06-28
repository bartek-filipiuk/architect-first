# Architect-First — Design / Spec

**Data:** 2026-06-28
**Status:** Zaakceptowany (brainstorming → writing-plans)
**Autorzy źródłowe:** `docs/Architect-First_*.md` (spec techniczna, fundamenty, kompilacja badawcza)

> **Język:** ten dokument planistyczny jest po polsku (spójnie z `docs/` i rozmową).
> **Artefakty produktu** (AGENTS.md, `*.toml`, profile architektów, README, hooki) piszemy **po angielsku** — plugin jest model-facing i międzynarodowy, jak ponytail.

---

## 1. Cel produktu

Plugin Claude Code (instalowalny przez marketplace, na kształt [ponytail](https://github.com/DietrichGebert/ponytail)) pełniący rolę zautomatyzowanego Principal Architecta. Dwie role:

- **always-on mindset** — Architektoniczna Drabina Decyzyjna wstrzykiwana co sesję, nastawia myślenie, sygnalizuje naruszenia inline, **nie blokuje**.
- **on-demand komendy** — `/architect-plan`, `/architect-review`, `/architect-help`, użyteczne gdziekolwiek podczas kodowania.

Ponytail celuje w długość kodu (over-engineering w diffie); Architect-First w spójność architektoniczną całego systemu (kierunek zależności, głębokość modułów, granice kontekstów). Oba pluginy mogą działać równolegle — różne domeny.

## 2. Zakres MVP (v0.1) — decyzje z brainstormingu

| Decyzja | Wybór |
|---|---|
| **Scope** | Lazy MVP, tylko Claude Code, **z filozofią rozbitą** (12 profili architektów jako osobne pliki ładowane na żądanie). |
| **Komendy** | `/architect-plan`, `/architect-review`, `/architect-help` + always-on Drabina (rdzeń). Review łączy review+guard+simplify ze spec technicznej. |
| **Always-on** | **Mindset jak ponytail** — sygnalizuje inline, nie blokuje. Twardy audyt zostaje dla `/architect-review`. Poziomy lite/full/ultra/off regulują intensywność. |
| **Integracja z innymi skillami** | **Odłożona.** `/architect-plan` na razie wypisuje plan w czacie, bez zapisu pliku i bez wpinania w `/idea-to-mvp`. |
| **Proces budowy** | Hybryda flow Execution z `/idea-to-mvp` (duch dyscypliny, nie SaaS-szkielet) **+ TDD + subagent-driven na Opus 4.8**. Patrz §8. |

## 3. Struktura repozytorium

```
architect-first/
├── .claude-plugin/plugin.json        # manifest → wskazuje hooki
├── hooks/
│   ├── architect-hooks.json          # SessionStart + SubagentStart + UserPromptSubmit
│   ├── architect-activate.js         # wstrzykuje zwięzłą Drabinę (wzór: ponytail-activate.js)
│   └── architect-mode-tracker.js     # śledzi /architect lite|full|ultra|off
├── AGENTS.md                         # źródło always-on rulesetu (pełna Drabina + granice)
├── philosophy/
│   ├── principles.md                 # INDEKS: zasada → architekt → ścieżka pliku
│   └── architects/                   # 12 profili, ładowane NA ŻĄDANIE
│       ├── carmack.md  hickey.md  martin.md  fowler.md
│       ├── ousterhout.md  acton.md  beck.md  brooks.md
│       └── muratori.md  torvalds.md  pike.md  pragmatic.md
├── commands/
│   ├── architect.toml                # przełącznik poziomu lite|full|ultra|off
│   ├── architect-plan.toml
│   ├── architect-review.toml
│   └── architect-help.toml
└── README.md
```

~18 plików. Kod wykonywalny: ~3 lekkie hooki JS (~60 linii każdy). Reszta to markdown/prompty — cała „inteligencja" to prompt engineering, analizę wykonuje LLM (nie JS).

## 4. Always-on: Architektoniczna Drabina Decyzyjna

`architect-activate.js` na `SessionStart` (matcher `startup|resume|clear|compact`) wstrzykuje **zwięzłą** wersję Drabiny + aktualny poziom (z mode-trackera). Pełnia żyje w `AGENTS.md`. Model stosuje Drabinę przy planowaniu/kodzie i sygnalizuje naruszenia inline jednym zdaniem; nie zatrzymuje pracy.

**6 szczebli — zatrzymaj się na pierwszym, który daje odpowiedź:**

| # | Szczebel | Pytanie | Kotwica |
|---|---|---|---|
| 0 | Zrozumienie (ZAWSZE) | Przeczytaj kod, prześledź przepływ danych przed propozycją | Acton, Ousterhout |
| 1 | YAGNI | Czy to musi istnieć dla obecnych, potwierdzonych wymagań? | Acton, Pragmatic |
| 2 | Reuse | Czy podobna logika/struktura już jest w kodzie? | Carmack |
| 3 | Native/stdlib | Czy biblioteka standardowa / platforma to robi? | Carmack, Hickey |
| 4 | Koszt abstrakcji | Czy interfejs/warstwa kosztuje więcej niż daje? | Carmack, Muratori |
| 5 | Kierunek zależności | Czy zależności wskazują do wewnątrz (ku regułom biznesowym)? | Martin |
| 6 | Minimum Viable Architecture | Dopiero teraz: najprostsza struktura, głębokie moduły, jasne granice, dane jako oś | Ousterhout, Beck, Brooks, Torvalds, Pike, Fowler |

**Poziomy** (`/architect <poziom>`, `architect-mode-tracker.js` zapisuje stan na `UserPromptSubmit`):

- `lite` — tylko krytyczne naruszenia (cykle zależności, złamane granice), jako notka.
- `full` — pełna Drabina przy każdym nietrywialnym komponencie. **Domyślny.**
- `ultra` — agresywny: + proponuje usuwanie istniejących abstrakcji (dla projektów z długiem).
- `off` — wyłączony.

## 5. Komendy

Każda komenda to **czysty prompt w `.toml`** (`description` + `prompt`), zero kodu — wzór ponytaila.

### `/architect-plan` — planowanie architektury od zera
Trigger: „zaplanuj architekturę", „nowy projekt", „architect this".
Proces: zbierz wymagania biznesowe → zidentyfikuj dane I/O (data-first, Acton) → bounded contexts (Evans) → Drabina per komponent → mapa zależności.
Output (w czacie, bez zapisu pliku w MVP): diagram przepływu danych (Mermaid), lista komponentów z odpowiedzialnościami, ADR kluczowych decyzji, mapa granic i zależności.

### `/architect-review` — audyt diffu LUB całego repo
Trigger: `/architect-review`, „sprawdź architekturę". Łączy review + guard + simplify ze spec technicznej w jeden ruch.
Format wyjścia: `<plik>:<linia>: <tag> <opis>. <rekomendacja>.`
Tagi:
- `direction:` — naruszenie kierunku zależności (np. domena importuje infrastrukturę)
- `shallow:` — płytki moduł (rozbudowany interfejs, trywialna logika)
- `coupling:` — zbędne sprzężenie między kontekstami
- `speculative:` — spekulatywna elastyczność (YAGNI)
- `data-leak:` — wyciek informacji między warstwami

### `/architect-help` — quick reference
Drabina (6 szczebli), poziomy, tagi review. Tani plik, duża wygoda.

## 6. Filozofia rozbita (12 architektów, ładowanie na żądanie)

`philosophy/principles.md` to **indeks-mapa**: każdy szczebel/zasada → architekci → ścieżka profilu. Komendy i mindset ładują konkretny profil **tylko gdy potrzebny** (np. `/architect-review` wykrywa `direction:` → może doczytać `martin.md` po głębsze uzasadnienie). Always-on niesie tylko zwięzłą Drabinę — 12 profili nie ładuje się co sesję.

Każdy profil ~1 ekran: teza + 2-3 cytaty-kotwice + zastosowanie w narzędziu. Treść pochodzi z `docs/Architect-First_ Kompilacja Badawcza`.

12 profili: Carmack, Hickey, Martin, Fowler, Ousterhout, Acton, Beck, Brooks, Muratori, Torvalds, Pike, `pragmatic` (Thomas & Hunt — DRY/YAGNI/Tracer Bullets/Broken Windows).

## 7. Granice bezpieczeństwa (NIGDY nie upraszczać)

Wprost w `AGENTS.md` i w promptach komend — Drabina tnie złożoność, nigdy tych rzeczy:
- walidacja na granicach zaufania (trust-boundary validation),
- obsługa błędów chroniąca przed utratą danych,
- kontrole bezpieczeństwa,
- dostępność (accessibility basics),
- wydajność: abstrakcje nieblokujące optymalizacji kompilatora (Muratori),
- czytelność: akceptacja minimalnej duplikacji, gdy poprawia zrozumiałość (Beck — empatia > metryka).

## 8. Proces budowy narzędzia (flow Execution z idea-to-mvp — hybryda)

Budujemy Architect-First stosując **ducha Fazy I (Execution) z `/idea-to-mvp`**, dopasowany do pluginu markdown:

1. **Spec** (ten dokument).
2. **Plan** (`superpowers:writing-plans` = nasz etap 21): lista tasków budowy z DoR/DoD, kolejność/zależności, mini-BUILD-CONTEXT (konwencje: format `.toml`, frontmatter skilli, wzór hooka, język EN artefaktów). Plan mode + akceptacja przed buildem.
3. **Build loop** (= etap 22, hybryda **+ TDD + subagent-driven na Opus 4.8**):
   - taski dispatchowane do subagentów na **Opus 4.8** (alias `opus`),
   - per task: **TDD gdzie jest logika** (hooki JS, parsing `.toml`, install — failing `assert`/`__main__` self-check first, zgodnie z ponytail) → `code-refactor` → `code-reviewer` → **verify** (plugin się ładuje, hook `exit 0` w czasie, frontmatter/toml parsuje) → **commit per task** (stan = `git log`, build-resume za darmo),
   - **bez worktree**: taski piszą rozłączne pliki → fala równoległa bezpieczna; **wave-gate** po fali sprawdza, że plugin nadal się ładuje,
   - lekki journal postępu.
4. **Quality/Security gate** (= etap 23, zaadaptowany): hooki bezpieczne (`exit 0`, timeout ≤5s, brak path traversal / wycieku env), komendy parsują, always-on injection faktycznie się pojawia, instalacja czysta.

**Wycięte z idea-to-mvp jako YAGNI dla pluginu:** payment/email/analytics/onboarding sub-taski, 90% coverage TS, Next.js scaffold, `isolation:worktree`, ultracode, 4 JSON validation artifacts, pełny week-by-week / risk-register.

## 9. Co świadomie pomijamy w MVP (i kiedy dodać)

- **Multi-agent adaptery** (Cursor/Windsurf/Cline/Copilot) → v0.5, gdy zechcesz dystrybucję poza Claude Code.
- **JS-analizatory** zależności/złożoności → nie dodawać; LLM robi to z promptu (szczebel Native).
- **benchmarks/** → v0.4, gdy zechcesz mierzalne wyniki.
- **templates/** jako osobne pliki → inline w promptach komend.
- **Zapis `ARCHITECTURE.md` + wpięcie w `/idea-to-mvp`** → gdy MVP udowodni wartość.

## 10. Roadmap

| Faza | Zakres |
|---|---|
| **v0.1 (to)** | plugin.json + hooki + AGENTS.md (Drabina) + `principles.md` + 12 profili + 4 komendy + README |
| v0.2 | dopracowanie tagów review, profile-on-demand tuning |
| v0.4 | benchmarki + metryki |
| v0.5 | multi-agent adaptery |
| v1.0 | zapis artefaktów + integracja z `/idea-to-mvp` + case studies |
