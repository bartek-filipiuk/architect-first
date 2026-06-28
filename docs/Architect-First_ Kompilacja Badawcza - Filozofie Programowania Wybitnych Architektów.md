# Architect-First: Kompilacja Badawcza - Filozofie Programowania Wybitnych Architektów

**Autor:** Manus AI  
**Data:** 27 czerwca 2026

---

## Wstęp

Niniejszy dokument stanowi kompilację badawczą, która posłużyła jako fundament intelektualny dla narzędzia Architect-First. Zawiera szczegółowe opracowanie filozofii programowania dwunastu wybitnych architektów i inżynierów oprogramowania, wraz z cytatami źródłowymi i analizą ich zastosowania w kontekście narzędzia do planowania architektury.

---

## 1. John Carmack (id Software, Oculus, Keen Technologies)

John Carmack jest powszechnie uznawany za jednego z najwybitniejszych programistów w historii. Jako współzałożyciel id Software stworzył silniki gier Wolfenstein 3D, Doom i Quake, rewolucjonizując branżę gier komputerowych. Jego podejście do programowania charakteryzuje się brutalnym pragmatyzmem i preferencją dla surowej wydajności nad eleganckimi abstrakcjami [1].

### Prostota i Anty-Abstrakcjonizm

Carmack jest znany z głębokiej niechęci do tego, co nazywa "Architecture Astronauts" — programistów, którzy chcą rozmawiać wyłącznie na najwyższym poziomie abstrakcji, pomijając detale implementacji [2]. Jego podejście można streścić jednym cytatem:

> "Sometimes, the elegant implementation is just a function. Not a method. Not a class. Not a framework. Just a function." [3]

Carmack wielokrotnie podkreślał, że koszt abstrakcji jest często niedoceniany. Dodanie nowej warstwy to nie tylko czas na jej napisanie, ale również przeszkoda dla przyszłego rozwoju:

> "The cost of adding a feature isn't just the time it takes to code it. The cost also includes the addition of an obstacle to future expansion." [3]

> "It is not that uncommon for the cost of an abstraction to outweigh the benefit it delivers. Kill one today!" [3]

### Programowanie Funkcyjne i Czystość Stanu

W swoim słynnym emailu z 2007 roku na temat inlinowania kodu, Carmack opisał inspirację płynącą z oprogramowania lotniczego myśliwca Saab Gripen, które nie zawierało wywołań podprogramów ani skoków wstecz [4]. Carmack eksperymentował z tym podejściem w kodzie rakiet Armadillo Aerospace i odkrył, że inlinowanie kodu ujawnia ukryte błędy i prowadzi do czystszego, mniejszego kodu.

Carmack jest gorącym zwolennikiem programowania w stylu funkcyjnym, nawet w językach imperatywnych:

> "A large fraction of the flaws in software development are due to programmers not fully understanding all the possible states their code may execute in. Programming in a functional style makes the state presented to your code explicit, which makes it much easier to reason about." [5]

Czyste funkcje (pure functions) oferują według Carmacka: bezpieczeństwo wątkowe, testowalność, reużywalność i zrozumiałość. Nie musi to być podejście "wszystko albo nic" — każdy krok w stronę czystości poprawia kod [5].

### Inżynieria jako Nauka Społeczna

W keynote na QuakeCon 2012, Carmack dokonał zaskakującego wyznania: inżynieria oprogramowania to w 90% nauka społeczna, a nie ścisła [6]. Algorytmy i optymalizacja to nauka, ale większość pracy programistów to zarządzanie interakcjami społecznymi — z innymi programistami i z samym sobą rozłożonym w czasie.

> "Programmers are making mistakes all the time and constantly. I would like to be able to enable even more restrictive subsets of languages and restrict programmers even more because we make mistakes constantly." [6]

Stąd jego nacisk na static analysis, daily code reviews i automatyczne guardrails zamiast polegania na "dobrych intencjach".

### Zasady id Software z lat 90.

John Romero, współzałożyciel id Software, przedstawił na Strange Loop 2022 zasady, które kierowały zespołem w erze Doom i Quake [7]:

1. **No prototypes** — zawsze utrzymuj kod gotowy do wysyłki
2. **Gra musi zawsze działać** — bulletproof engine z defaultami przy błędach ładowania
3. **Natychmiast naprawiaj bugi** — nie kontynuuj z bugami w kodzie
4. **Bądź własnym testerem** — testuj dokładnie przed check-in
5. **Kod absolutnie prosty** — ciągle szukaj sposobów na uproszczenie
6. **Świetne narzędzia** — inwestuj w tooling
7. **System deweloperski lepszy od targetu**

---

## 2. Rich Hickey (Twórca Clojure)

Rich Hickey, twórca języka Clojure i bazy danych Datomic, jest jednym z najbardziej wpływowych myślicieli w dziedzinie projektowania oprogramowania. Jego prelekcja "Simple Made Easy" z 2011 roku jest powszechnie uważana za jedną z najważniejszych prezentacji w historii inżynierii oprogramowania [8].

### Simple vs Easy — Fundamentalne Rozróżnienie

Hickey wprowadza kluczowe rozróżnienie etymologiczne. Słowo "simple" pochodzi od łacińskiego "simplex" (jeden splot/warkocz) — oznacza brak splątania, brak interleaving. Jest to cecha **obiektywna**. Słowo "easy" pochodzi od łacińskiego "adjacens" (leżący blisko) — oznacza znajomość, dostępność, bliskość do naszych umiejętności. Jest to cecha **subiektywna** [8].

> "If you want everything to be familiar, you will never learn anything new because it can't be significantly different from what you already know." [8]

### Konstrukt vs Artefakt

Hickey podkreśla, że programiści są zbyt skupieni na doświadczeniu pisania kodu (konstrukt), zamiast na jakości działającego oprogramowania (artefakt). Użytkownik nie patrzy na kod źródłowy — uruchamia oprogramowanie i żyje z nim latami. Wydajność, możliwość zmian, niezawodność — to atrybuty artefaktu, nie konstruktu [8].

### Złożoność jako Wróg

Złożoność rośnie, a decyzje stają się coraz trudniejsze. Ignorowanie złożoności spowalnia rozwój, ponieważ ogranicza to, co można zrobić, a rozplątywanie złożoności dominuje nad zadaniami. Hickey proponuje konkretne strategie redukcji złożoności: używanie struktur asocjacyjnych (map) zamiast list, plików danych (JSON) zamiast dokumentów z meta-danymi (XML), oraz słowa kluczowego `final` wszędzie, gdzie to możliwe [8].

---

## 3. Robert C. Martin (Uncle Bob) — Clean Architecture

Robert C. Martin, znany jako Uncle Bob, jest autorem "Clean Code" i "Clean Architecture" oraz współautorem Manifestu Agile. Jego wkład w dziedzinę architektury oprogramowania jest fundamentalny [9].

### Zasada Zależności (The Dependency Rule)

Centralną ideą Clean Architecture jest zasada zależności: zależności w kodzie źródłowym mogą wskazywać **wyłącznie do wewnątrz**. Nic w wewnętrznym kręgu nie może wiedzieć czegokolwiek o zewnętrznym kręgu. Dotyczy to funkcji, klas, zmiennych i wszelkich innych nazwanych bytów [9].

### Warstwy Clean Architecture

| Warstwa (od wewnątrz) | Zawartość | Charakterystyka |
| :--- | :--- | :--- |
| **Entities** | Reguły biznesowe przedsiębiorstwa | Najmniej podatne na zmiany |
| **Use Cases** | Reguły biznesowe aplikacji | Orkiestracja przepływu danych |
| **Interface Adapters** | Konwersja formatów danych | MVC, Presenters, Controllers |
| **Frameworks & Drivers** | Detale (DB, Web, UI) | Najbardziej zewnętrzne, najłatwiej wymienne |

### Cechy Dobrej Architektury

System zbudowany według Clean Architecture jest: niezależny od frameworków, testowalny (reguły biznesowe bez UI/DB), niezależny od UI, niezależny od bazy danych i niezależny od jakiejkolwiek zewnętrznej agencji [9].

---

## 4. Martin Fowler (ThoughtWorks)

Martin Fowler jest jednym z najbardziej wpływowych autorów w dziedzinie inżynierii oprogramowania, znany z prac nad refaktoringiem, wzorcami architektonicznymi i metodykami Agile [10].

### Definicja Architektury

Fowler przytacza definicję Ralpha Johnsona: "Architecture is about the important stuff. Whatever that is." Oznacza to, że sercem myślenia architektonicznego jest decydowanie, co jest ważne, a następnie inwestowanie energii w utrzymanie tych elementów w dobrym stanie [10].

Druga popularna definicja — "decyzje, które trzeba podjąć wcześnie" — została przez Johnsona skorygowana do: "decyzje, które chciałbyś podjąć poprawnie na początku projektu" [10].

### Architektura Ewolucyjna

Fowler podkreśla, że dobra architektura wspiera własną ewolucję i jest głęboko spleciona z programowaniem. Wysoka jakość wewnętrzna prowadzi do szybszego dostarczania nowych funkcji, ponieważ jest mniej "cruft" (elementów utrudniających zrozumienie oprogramowania) na drodze. Uwaga poświęcona jakości wewnętrznej zwraca się w tygodniach, nie miesiącach [10].

---

## 5. John Ousterhout (Stanford University)

John Ousterhout, profesor Stanford University i twórca języka Tcl, napisał "A Philosophy of Software Design" — książkę opartą na wieloletnich obserwacjach studentów rozwiązujących te same problemy projektowe [11].

### Zarządzanie Złożonością jako Cel Nadrzędny

> "The greatest limitation in writing software is our ability to understand the systems we are creating." [11]

Złożoność narasta z czasem i tworzy ukryty koszt dla organizacji. Ousterhout proponuje walkę ze złożonością poprzez enkapsulację (modularny design) i czynienie kodu prostym i oczywistym.

### Deep Modules vs Shallow Modules

Kluczowym wkładem Ousterhouta jest koncepcja głębokości modułów. **Głębokie moduły** mają prosty, wąski interfejs, który ukrywa skomplikowaną implementację — redukują złożoność systemu. **Płytkie moduły** mają rozbudowany interfejs z trywialną logiką — zwiększają złożoność, ponieważ programista musi rozumieć zarówno interfejs, jak i implementację [11].

> "It's more important for a module to have a simple interface than a simple implementation." [11]

### Tactical vs Strategic Coding

Ousterhout rozróżnia kodowanie taktyczne (gaszenie pożarów, szybkie hackowanie) od strategicznego (budowanie na długi termin). Wymaga to doświadczenia, aby wiedzieć, kiedy które podejście zastosować [11].

---

## 6. Mike Acton (Data-Oriented Design)

Mike Acton, były Engine Director w Insomniac Games, a później w Unity Technologies, jest głównym propagatorem Data-Oriented Design (DOD). Jego prelekcja na CppCon 2014 jest uznawana za jedną z najważniejszych w historii C++ [12].

### Fundamentalne Zasady DOD

Acton formułuje swoje zasady w sposób prowokacyjny i bezpośredni:

> "The purpose of all programs, and all parts of those programs, is to transform data from one form to another." [12]

> "If you don't understand the data, you don't understand the problem." [12]

> "Everything is a data problem. Including usability, maintenance, debug-ability, etc. Everything." [12]

> "Solving problems you probably don't have creates more problems you definitely do." [12]

### Trzy Wielkie Kłamstwa Branży

Acton identyfikuje trzy "wielkie kłamstwa", które odciągają programistów od fundamentów: (1) oprogramowanie jest platformą (w rzeczywistości hardware jest platformą), (2) kod powinien modelować świat rzeczywisty (relacja IS-A w świecie realnym nie przekłada się na oprogramowanie), (3) kod jest ważniejszy od danych (skoro cel programu to transformacja danych, dane muszą być ważniejsze) [12].

### Powiązanie z Brooksem

Zasady Actona znajdują potwierdzenie w klasycznej pracy Freda Brooksa "The Mythical Man-Month":

> "Show me your flowcharts and conceal your tables, and I shall continue to be mystified. Show me your tables, and I won't usually need your flowcharts; they'll be obvious." [13]

---

## 7. Kent Beck (Extreme Programming)

Kent Beck jest twórcą Extreme Programming (XP), Test-Driven Development (TDD) i autorem koncepcji "4 Rules of Simple Design", które Martin Fowler opisuje jako jedne z najbardziej użytecznych zasad projektowania [14].

### 4 Zasady Prostego Projektu (w kolejności priorytetów)

1. **Passes the tests** — oprogramowanie musi działać zgodnie z intencją
2. **Reveals intention** — kod musi być łatwy do zrozumienia; komunikuje cel
3. **No duplication** — DRY/SPOT; eliminacja duplikacji napędza dobry design
4. **Fewest elements** — wszystko, co nie służy powyższym trzem zasadom, powinno zostać usunięte

> "At the time there was a lot of 'design is subjective', 'design is a matter of taste' bullshit going around. I disagreed. There are better and worse designs." [14]

### Empatia w Kodzie

Beck podkreśla, że w rzadkich przypadkach konfliktu między zasadami 2 i 3, "empatia wygrywa nad ściśle techniczną metryką" — pisząc kod, zawsze powinniśmy myśleć o czytelniku [14].

---

## 8. Fred Brooks (IBM, UNC Chapel Hill)

Fred Brooks, laureat nagrody Turinga, jest autorem "The Mythical Man-Month" (1975) i eseju "No Silver Bullet" (1986) — dwóch najbardziej wpływowych tekstów w historii inżynierii oprogramowania [13] [15].

### Essential vs Accidental Complexity

Brooks wprowadza fundamentalne rozróżnienie między złożonością **istotną** (essential) — wynikającą z natury problemu, której nie można usunąć — a złożonością **przypadkową** (accidental) — stworzoną przez inżynierów, którą można i należy eliminować [15].

Brooks argumentuje, że dzisiejsi programiści spędzają większość czasu na złożoności istotnej, ponieważ złożoność przypadkowa została już znacząco zredukowana przez języki wysokiego poziomu i nowoczesne narzędzia. Nie istnieje pojedyncze rozwiązanie (silver bullet), które obiecuje dziesięciokrotną poprawę produktywności w ciągu dekady [15].

### Organiczny Wzrost Oprogramowania

Brooks zaleca "hodowanie" oprogramowania organicznie, poprzez rozwój przyrostowy: zaprojektowanie i zaimplementowanie głównych programów i podprogramów na samym początku, a następnie wypełnianie działających podsekcji później. Programowanie w ten sposób ekscytuje inżynierów i zapewnia działający system na każdym etapie rozwoju [15].

---

## 9. Casey Muratori (Handmade Hero, Computer Enhance)

Casey Muratori jest twórcą serii edukacyjnej Handmade Hero i kursu Computer Enhance. Jego artykuł "Clean Code, Horrible Performance" z 2023 roku wywołał szeroką debatę w społeczności programistów [16].

### Krytyka "Czystego Kodu"

Muratori argumentuje, że zasady stojące za metodyką "czystego kodu" (takie jak nadmierne użycie polimorfizmu, hierarchii dziedziczenia i dynamicznego dispatchu) są niemal zawsze szkodliwe dla wydajności. Kluczowy insight: koszt wywołania przez wirtualną funkcję to nie tylko sam dispatch, ale przede wszystkim utracone możliwości optymalizacji kompilatora [16].

> "When you call through a virtual function in languages like C++, if the compiler doesn't directly know exactly what type it's dealing with, it cannot optimize through that virtual function call. And that is by far the biggest cost." [16]

### Architektura Wpływa na Runtime

Muratori podkreśla, że decyzje architektoniczne (np. rozbicie jednej pętli na dwie, użycie hierarchii klas zamiast prostych struktur) tworzą dosłownie inny program, którego kompilator nie jest w stanie zoptymalizować z powrotem do optymalnej formy [16].

---

## 10. Linus Torvalds (Linux, Git)

Linus Torvalds, twórca jądra Linux i systemu kontroli wersji Git, jest znany z bezkompromisowego podejścia do jakości kodu i "dobrego smaku" w programowaniu [17].

### "Good Taste" w Programowaniu

W swoim wystąpieniu na TED, Torvalds zaprezentował koncepcję "dobrego smaku" w kodzie. Istotą jest eliminacja przypadków brzegowych (edge cases) poprzez eleganckie rozwiązania, które traktują wszystkie przypadki jednakowo. Mniej rozgałęzień oznacza kod łatwiejszy do zrozumienia [17].

### Struktury Danych Ponad Algorytmy

> "Bad programmers worry about the code. Good programmers worry about data structures and their relationships." [17]

Torvalds konsekwentnie podkreśla, że wybór właściwej struktury danych jest ważniejszy niż sprytny algorytm. Jeśli struktury danych są poprawne, algorytmy stają się oczywiste.

---

## 11. Rob Pike (Go, Plan 9, Unix)

Rob Pike, współtwórca języka Go i systemu Plan 9, jest jednym z architektów filozofii Unix. Jego podejście do projektowania Go odzwierciedla dekady doświadczeń z systemami operacyjnymi i językami programowania [18].

### Prostota Jest Skomplikowana

W prelekcji "Simplicity is Complicated" (dotGo 2015), Pike wyjaśnia paradoks: Go wydaje się prosty, ale osiągnięcie tej prostoty wymagało niezwykle wyrafinowanego projektowania. Wprowadzając ograniczenia na sposób wyrażania rzeczy, programista jest uwolniony od myślenia o nieistotnych detalach i może skupić się na tym, co naprawdę ważne [18].

### Go jako Język w Służbie Inżynierii

> "Go is more about software engineering than programming language research. Or to rephrase, it is about language design in the service of software engineering." [18]

Go celowo rezygnuje z wielu "nowoczesnych" funkcji językowych (generics przez lata, dziedziczenie, wyjątki) na rzecz prostoty, czytelności i szybkości kompilacji. Kompozycja nad dziedziczeniem, jawność nad domyślnością.

---

## 12. Dave Thomas i Andy Hunt (The Pragmatic Programmer)

Dave Thomas i Andy Hunt są autorami "The Pragmatic Programmer" (1999) — jednej z najważniejszych książek w historii inżynierii oprogramowania, która wprowadziła do powszechnego użytku terminy takie jak DRY i YAGNI [19].

### Kluczowe Zasady

**DRY (Don't Repeat Yourself)** — każdy element wiedzy powinien mieć pojedynczą, jednoznaczną reprezentację w systemie. Nie chodzi tylko o duplikację kodu, ale o duplikację wiedzy [19].

**YAGNI (You Ain't Gonna Need It)** — nie implementuj czegoś, dopóki nie jest to faktycznie potrzebne. Spekulatywna elastyczność to forma długu technologicznego [19].

**Tracer Bullets** — zbuduj najpierw szkielet end-to-end (od UI przez logikę po bazę danych), który działa, choć w uproszczonej formie. Weryfikuje architekturę w praktyce, zanim zainwestujesz w szczegóły [19].

**Broken Windows Theory** — jeden zepsuty element (zły design, hack, brak testów) prowadzi do kaskady zaniedbań. Naprawiaj natychmiast [19].

---

## Podsumowanie Syntezy

Analizując filozofie wszystkich dwunastu architektów, wyłania się zaskakująco spójny obraz. Pomimo różnic w kontekście (gry, systemy operacyjne, aplikacje webowe, języki programowania), wszyscy zgadzają się co do fundamentalnych zasad:

| Zasada | Kto ją promuje |
| :--- | :--- |
| **Prostota jest celem, nie środkiem** | Carmack, Hickey, Pike, Beck, Torvalds |
| **Dane definiują architekturę** | Acton, Brooks, Torvalds, Carmack |
| **Abstrakcje mają koszt** | Carmack, Muratori, Acton, Hickey |
| **Zrozumienie przed działaniem** | Acton, Hickey, Ousterhout, Brooks |
| **Ewolucja, nie rewolucja** | Fowler, Brooks, Beck, Thomas/Hunt |
| **Automatyczne guardrails > dobre intencje** | Carmack, Martin, Fowler |
| **Buduj produkty, nie architekturę** | Carmack, Thomas/Hunt, Beck |

---

## Referencje

[1]: https://www.antoinebuteau.com/lessons-from-john-carmack/ "Lessons from John Carmack - Antoine Buteau"
[2]: https://rappstar.com/2021/11/11/architectural-astronauts/ "Architectural Astronauts - Jordan Rapp"
[3]: https://www.antoinebuteau.com/lessons-from-john-carmack/ "Lessons from John Carmack - Quotes Collection"
[4]: https://cbarrete.com/carmack.html "John Carmack on inlined code and functional programming"
[5]: http://www.sevangelatos.com/john-carmack-on/ "John Carmack on Functional Programming in C++"
[6]: https://medium.com/bits-and-behavior/john-carmack-discusses-the-art-and-science-of-software-engineering-a56e100c27aa "John Carmack discusses the art and science of software engineering"
[7]: https://charlesboury.fr/articles/id-software-principles.html "id Software Principles - Charles Boury"
[8]: https://www.infoq.com/presentations/Simple-Made-Easy/ "Simple Made Easy - Rich Hickey, QCon 2011"
[9]: https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html "The Clean Architecture - Robert C. Martin"
[10]: https://martinfowler.com/architecture/ "Software Architecture Guide - Martin Fowler"
[11]: https://blog.pragmaticengineer.com/a-philosophy-of-software-design-review/ "A Philosophy of Software Design Review - Pragmatic Engineer"
[12]: https://accu.org/journals/overload/30/167/teodorescu/ "Revisiting Data-Oriented Design - ACCU"
[13]: https://www.cs.unc.edu/techreports/86-020.pdf "No Silver Bullet - Fred Brooks"
[14]: https://martinfowler.com/bliki/BeckDesignRules.html "Beck Design Rules - Martin Fowler"
[15]: https://en.wikipedia.org/wiki/No_Silver_Bullet "No Silver Bullet - Wikipedia"
[16]: https://se-radio.net/2023/08/se-radio-577-casey-muratori-on-clean-code-horrible-performance/ "SE Radio 577: Casey Muratori on Clean Code, Horrible Performance"
[17]: https://medium.com/@bartobri/applying-the-linus-tarvolds-good-taste-coding-requirement-99749f37684a "Applying the Linus Torvalds Good Taste Coding Requirement"
[18]: https://go.dev/talks/2012/splash.article "Go at Google: Language Design in the Service of Software Engineering"
[19]: https://betterprogramming.pub/the-pragmatic-programmer-20th-anniversary-edition-15e19ca76e40 "The Pragmatic Programmer, 20th Anniversary Edition"
