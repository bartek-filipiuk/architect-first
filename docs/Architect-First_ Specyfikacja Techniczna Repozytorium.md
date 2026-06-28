# Architect-First: Specyfikacja Techniczna Repozytorium

**Autor:** Manus AI  
**Wersja:** 1.0  
**Data:** 27 czerwca 2026

---

## 1. Wizja Produktu

**Architect-First** to narzędzie (skill/plugin dla agentów AI), które pełni rolę zautomatyzowanego Principal Architecta. Jego zadaniem jest idealnie zaplanować architekturę nowo tworzonego oprogramowania oraz pilnować, czy rozwój projektu przebiega zgodnie z ustalonymi zasadami. Narzędzie działa w trybie "always-on" jako strażnik jakości architektonicznej, a na żądanie jako aktywny projektant i audytor.

### Różnica względem Ponytail

| Aspekt | Ponytail | Architect-First |
| :--- | :--- | :--- |
| **Cel** | Optymalizacja kodu (mniej linii) | Planowanie i monitorowanie architektury |
| **Kiedy działa** | Podczas pisania kodu | Przed, w trakcie i po pisaniu kodu |
| **Fokus** | Over-engineering w kodzie | Spójność architektoniczna całego systemu |
| **Wejście** | Pojedynczy diff / plik | Cały projekt, wymagania, kontekst biznesowy |
| **Wyjście** | Sugestie usunięcia kodu | Plan architektoniczny, decyzje, audyty, alerty |

---

## 2. Struktura Repozytorium

```
architect-first/
├── AGENTS.md                    # Główne instrukcje (always-on ruleset)
├── README.md                    # Dokumentacja użytkownika
├── LICENSE                      # MIT
├── package.json                 # Wersjonowanie i metadane
│
├── philosophy/                  # Baza wiedzy architektonicznej
│   ├── principles.md            # Skondensowane zasady (z researchu)
│   ├── anti-patterns.md         # Katalog anty-wzorców
│   ├── decision-ladder.md       # Drabina Decyzyjna (szczegółowa)
│   └── architects/              # Profile filozofii poszczególnych architektów
│       ├── carmack.md
│       ├── hickey.md
│       ├── fowler.md
│       ├── martin.md
│       ├── ousterhout.md
│       ├── acton.md
│       ├── beck.md
│       └── brooks.md
│
├── skills/                      # Skille na żądanie
│   ├── architect-plan/          # Planowanie architektury od zera
│   │   └── SKILL.md
│   ├── architect-review/        # Audyt architektoniczny diffa
│   │   └── SKILL.md
│   ├── architect-audit/         # Audyt całego repozytorium
│   │   └── SKILL.md
│   ├── architect-guard/         # Strażnik zależności (dependency direction)
│   │   └── SKILL.md
│   ├── architect-simplify/      # Propozycje uproszczenia
│   │   └── SKILL.md
│   └── architect-help/          # Pomoc i quick reference
│       └── SKILL.md
│
├── templates/                   # Szablony dokumentów architektonicznych
│   ├── adr-template.md          # Architecture Decision Record
│   ├── project-charter.md       # Karta projektu
│   ├── data-flow-template.md    # Szablon przepływu danych
│   └── boundary-map.md          # Mapa granic kontekstów
│
├── rules/                       # Adaptery dla różnych agentów AI
│   ├── .cursor/rules/
│   ├── .windsurf/rules/
│   ├── .clinerules/
│   └── .github/copilot-instructions.md
│
├── hooks/                       # Lifecycle hooks
│   ├── pre-generation.js        # Hook przed generacją kodu
│   ├── post-generation.js       # Hook po generacji (audyt)
│   └── hooks.json
│
├── benchmarks/                  # Mierzalne wyniki
│   ├── methodology.md
│   └── results/
│
├── examples/                    # Przykłady użycia
│   ├── before-after/
│   └── case-studies/
│
└── scripts/                     # Narzędzia pomocnicze
    ├── check-dependencies.js    # Sprawdzanie kierunku zależności
    ├── complexity-score.js      # Obliczanie złożoności
    └── install.js
```

---

## 3. Kluczowe Skille (Szczegółowa Specyfikacja)

### 3.1 architect-plan (Planowanie Architektury)

**Trigger:** Użytkownik mówi "zaplanuj architekturę", "nowy projekt", "architect this", "zaprojektuj system"

**Proces:**
1. Zbierz wymagania biznesowe (co system ma robić)
2. Zidentyfikuj dane wejściowe i wyjściowe (Data-Oriented)
3. Zdefiniuj Bounded Contexts (granice odpowiedzialności)
4. Zastosuj Drabinę Decyzyjną do każdego komponentu
5. Wygeneruj Architecture Decision Records (ADR)
6. Stwórz mapę zależności (dependency graph)

**Output:** Dokument architektoniczny w formacie Markdown zawierający:
- Diagram przepływu danych (Mermaid)
- Listę komponentów z ich odpowiedzialnościami
- ADR dla kluczowych decyzji
- Mapę granic i zależności

### 3.2 architect-review (Audyt Diffa)

**Trigger:** `/architect-review`, "review architecture", "sprawdź architekturę tego diffa"

**Proces:**
1. Przeanalizuj diff pod kątem naruszeń architektonicznych
2. Sprawdź kierunek zależności (czy nowe importy nie łamią zasad)
3. Oceń głębokość modułów (czy nowe interfejsy nie są "płytkie")
4. Zidentyfikuj niepotrzebne abstrakcje

**Format wyjścia:**
```
<file>:<line>: <tag> <opis>. <rekomendacja>.
```

**Tagi:**
- `direction:` naruszenie kierunku zależności
- `shallow:` płytki moduł (rozbudowany interfejs, trywialna logika)
- `coupling:` niepotrzebne sprzężenie między kontekstami
- `speculative:` spekulatywna elastyczność (YAGNI)
- `data-leak:` wyciek informacji między warstwami

### 3.3 architect-audit (Audyt Całego Repo)

**Trigger:** `/architect-audit`, "audit architecture", "sprawdź architekturę projektu"

**Proces:**
1. Zbuduj graf zależności całego projektu
2. Zidentyfikuj cykle zależności
3. Oceń spójność (cohesion) i sprzężenie (coupling) modułów
4. Porównaj stan obecny z dokumentacją architektoniczną (jeśli istnieje)
5. Wygeneruj raport z priorytetyzowanymi problemami

**Output:** Raport w formacie:
```
## Architectural Health Score: X/10

### Critical Issues (must fix)
...

### Warnings (should fix)
...

### Suggestions (nice to have)
...

### Metrics
- Dependency cycles: N
- Shallow modules: N
- Boundary violations: N
- Unused abstractions: N
```

### 3.4 architect-guard (Strażnik Zależności)

**Trigger:** Automatyczny (always-on), aktywuje się przy każdej propozycji nowego kodu

**Proces:**
1. Parsuj importy/zależności w proponowanym kodzie
2. Porównaj z ustalonymi granicami architektonicznymi
3. Jeśli naruszenie: BLOKUJ i wyjaśnij dlaczego
4. Zaproponuj alternatywę zgodną z architekturą

**Reguły:**
- Warstwa domenowa NIE MOŻE importować z warstwy infrastruktury
- Warstwa aplikacji NIE MOŻE importować z warstwy prezentacji
- Moduł A nie może bezpośrednio zależeć od modułu B, jeśli nie są w relacji zdefiniowanej w mapie zależności

### 3.5 architect-simplify (Uproszczenie)

**Trigger:** `/architect-simplify`, "uprość architekturę", "simplify"

**Proces:**
1. Zidentyfikuj moduły z jedną implementacją (interfejs bez potrzeby)
2. Znajdź warstwy pass-through (które tylko przekazują dane dalej)
3. Wykryj "Architecture Astronauts" patterns (abstrakcje bez wartości)
4. Zaproponuj konsolidację lub usunięcie

---

## 4. Drabina Decyzyjna (Decision Ladder) - Pełna Specyfikacja

Drabina Decyzyjna to serce narzędzia. Agent MUSI przejść przez każdy szczebel sekwencyjnie, zatrzymując się na pierwszym, który daje odpowiedź.

### Szczebel 0: Zrozumienie (ZAWSZE)
> "Lazy about the solution, never about reading." [Ponytail]

Zanim cokolwiek zaproponujesz:
- Przeczytaj istniejący kod, który zmiana dotyczy
- Prześledź rzeczywisty przepływ danych
- Zrozum kontekst biznesowy wymagania
- Zidentyfikuj, jakie dane wchodzą i wychodzą

### Szczebel 1: Czy to musi istnieć? (YAGNI)
> "Solving problems you probably don't have creates more problems you definitely do." [Mike Acton]

Pytania weryfikujące:
- Czy jest to wymagane przez obecne, potwierdzone wymagania biznesowe?
- Czy użytkownik końcowy odczuje brak tego komponentu?
- Czy buduję to "na przyszłość" bez konkretnego przypadku użycia?

Jeśli odpowiedź to "nie jest potrzebne" → STOP. Nie twórz.

### Szczebel 2: Czy to już istnieje w kodzie? (Reuse)
> "The function that is least likely to cause a problem is one that doesn't exist." [John Carmack]

Pytania weryfikujące:
- Czy podobna logika istnieje w innym module?
- Czy mogę rozszerzyć istniejący komponent zamiast tworzyć nowy?
- Czy duplikuję transformację danych, która jest już zaimplementowana?

Jeśli istnieje → Użyj ponownie lub rozszerz.

### Szczebel 3: Czy platforma/stdlib to obsługuje? (Native)
> "Sometimes, the elegant implementation is just a function." [John Carmack]

Pytania weryfikujące:
- Czy biblioteka standardowa języka ma tę funkcjonalność?
- Czy natywna funkcja platformy (browser API, OS API) to rozwiązuje?
- Czy potrzebuję zewnętrznej zależności, czy wystarczy wbudowane rozwiązanie?

Jeśli natywne rozwiązanie istnieje → Użyj go.

### Szczebel 4: Jaki jest koszt abstrakcji? (Cost)
> "It is not that uncommon for the cost of an abstraction to outweigh the benefit it delivers. Kill one today!" [John Carmack]

Pytania weryfikujące:
- Czy ten interfejs/klasa abstrakcyjna będzie miał więcej niż jedną implementację?
- Czy ta warstwa dodaje wartość, czy tylko przekazuje dane dalej?
- Czy ta elastyczność jest potrzebna TERAZ, czy "kiedyś"?

Jeśli koszt > korzyść → Uprość do funkcji lub bezpośredniej implementacji.

### Szczebel 5: Czy zależności są poprawne? (Direction)
> "Source code dependencies can only point inwards." [Robert C. Martin]

Pytania weryfikujące:
- Czy ten import nie łamie zasady zależności?
- Czy logika biznesowa nie zależy od szczegółów infrastruktury?
- Czy moduł nie wie za dużo o swoim otoczeniu?

Jeśli kierunek jest zły → Odwróć zależność (Dependency Inversion).

### Szczebel 6: Minimum Viable Architecture
> "The greatest limitation in writing software is our ability to understand the systems we are creating." [John Ousterhout]

Dopiero teraz projektuj:
- Najprostszą strukturę spełniającą wymagania
- Z głębokimi modułami (prosty interfejs, złożona implementacja)
- Z jasnymi granicami odpowiedzialności
- Z przepływem danych jako osią organizacyjną

---

## 5. Always-On Ruleset (AGENTS.md)

Poniżej znajduje się szkielet głównego pliku instrukcji, który będzie aktywny w każdej sesji:

```markdown
# Architect-First

You are an architectural guardian. Before writing or generating any code,
you MUST apply the Decision Ladder.

## Decision Ladder (apply sequentially, stop at first match)

0. UNDERSTAND: Read the code this change touches. Trace the data flow.
   Never propose without understanding.
1. YAGNI: Does this need to exist for current requirements? No → don't create it.
2. REUSE: Already in this codebase? → Reuse or extend, don't rewrite.
3. NATIVE: Standard library or platform does it? → Use it.
4. COST: Does the abstraction cost more than it delivers? → Simplify to a function.
5. DIRECTION: Do dependencies point inward (toward business rules)? → Fix violations.
6. MINIMUM: Only then: design the simplest architecture that works.

## Safety Boundaries (NEVER compromise)

- Trust-boundary validation
- Data-loss prevention
- Security controls
- Error handling for user-facing flows
- Accessibility requirements

## Architectural Principles

- Data flow defines structure, not abstract world models
- Deep modules > shallow modules (simple interface, complex implementation)
- Composition > inheritance
- Explicit > implicit
- Prove it works (tests) before proving it's flexible
```

---

## 6. Architecture Decision Records (ADR)

Narzędzie generuje i zarządza ADR-ami w formacie:

```markdown
# ADR-001: [Tytuł Decyzji]

## Status
Accepted / Proposed / Deprecated

## Context
[Jaki problem rozwiązujemy? Jakie dane przepływają?]

## Decision
[Co postanowiliśmy i DLACZEGO]

## Decision Ladder Applied
[Który szczebel drabiny doprowadził do tej decyzji?]

## Consequences
[Pozytywne i negatywne skutki tej decyzji]

## Alternatives Considered
[Co odrzuciliśmy i dlaczego]
```

---

## 7. Metryki i Benchmarki

Narzędzie mierzy swoją skuteczność poprzez:

| Metryka | Opis | Cel |
| :--- | :--- | :--- |
| **Architectural Violations** | Liczba naruszeń kierunku zależności | 0 |
| **Shallow Module Ratio** | % modułów z rozbudowanym interfejsem i trywialną logiką | < 10% |
| **Dependency Cycles** | Liczba cykli w grafie zależności | 0 |
| **YAGNI Score** | % kodu, który nie jest używany przez żadne wymaganie | < 5% |
| **Abstraction Cost Ratio** | Stosunek warstw abstrakcji do rzeczywistej logiki | < 1:3 |
| **Data Flow Clarity** | Czy przepływ danych jest czytelny bez dokumentacji | Subiektywna ocena |

---

## 8. Poziomy Intensywności

Podobnie jak Ponytail, narzędzie oferuje poziomy:

| Poziom | Opis |
| :--- | :--- |
| **lite** | Tylko krytyczne naruszenia (cykle zależności, złamane granice). Nie blokuje, tylko informuje. |
| **full** | Pełna Drabina Decyzyjna. Kwestionuje każdą nową abstrakcję. Domyślny tryb. |
| **ultra** | Agresywny audyt. Proponuje usunięcie istniejących abstrakcji. Dla projektów z dużym długiem. |
| **off** | Wyłączony. Agent działa bez ograniczeń architektonicznych. |

---

## 9. Roadmap

| Faza | Zakres | Priorytet |
| :--- | :--- | :--- |
| **v0.1** | AGENTS.md + Decision Ladder + architect-plan skill | MVP |
| **v0.2** | architect-review + architect-guard (dependency checking) | Core |
| **v0.3** | architect-audit + templates (ADR, data-flow) | Expansion |
| **v0.4** | Benchmarki + metryki + scoring | Measurement |
| **v0.5** | Multi-agent adaptery (Cursor, Windsurf, Codex, etc.) | Distribution |
| **v1.0** | Pełna integracja + case studies + dokumentacja | Release |

---

## 10. Inspiracje i Źródła Wiedzy

Narzędzie czerpie z następujących źródeł:

| Źródło | Wkład |
| :--- | :--- |
| John Carmack (id Software) | Pragmatyzm, prostota, anty-architecture astronauts, functional purity |
| Rich Hickey (Clojure) | Rozróżnienie simple vs easy, obiektywna prostota, composing simple components |
| Mike Acton (Data-Oriented Design) | Dane w centrum, transformacje danych jako cel programu |
| John Ousterhout (Stanford) | Deep modules, managing complexity, tactical vs strategic |
| Robert C. Martin (Clean Architecture) | Dependency Rule, separation of concerns, SOLID |
| Martin Fowler (ThoughtWorks) | Evolutionary architecture, refactoring, architecture as hard-to-change decisions |
| Kent Beck (XP) | 4 Rules of Simple Design, TDD, empathy in code |
| Fred Brooks (IBM) | Essential vs accidental complexity, no silver bullet, incremental growth |
| Linus Torvalds (Linux) | Good taste, data structures first, elimination of edge cases |
| Casey Muratori (Handmade Hero) | Performance-aware architecture, cost of abstractions |
| Dave Thomas & Andy Hunt (Pragmatic) | DRY, YAGNI, Tracer Bullets, Broken Windows |
| Eric Evans (DDD) | Ubiquitous Language, Bounded Contexts, domain modeling |
| Ponytail (DietrichGebert) | Mechanizm drabiny decyzyjnej, always-on + on-demand, safety boundaries |
