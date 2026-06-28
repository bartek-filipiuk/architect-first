# Architect-First: Fundamenty Narzędzia do Planowania i Monitorowania Architektury Oprogramowania

**Autor:** Manus AI

## Wprowadzenie

W dobie powszechnego wykorzystania sztucznej inteligencji do generowania kodu, rola inżyniera oprogramowania ewoluuje. Solo builderzy oraz zespoły korzystające z asystentów AI często napotykają problemy w środowiskach produkcyjnych, wynikające z braku fundamentalnej wiedzy z zakresu inżynierii oprogramowania. Zjawisko to prowadzi do tworzenia systemów "przeinżynierowanych" (over-engineered), trudnych w utrzymaniu i pełnych długu technologicznego. 

Aby temu zaradzić, proponujemy podejście **"Architect-First"**, w którym projekt architektoniczny i planowanie wysokiego poziomu są priorytetem, a szczegóły implementacyjne są delegowane do AI. Niniejszy dokument stanowi teoretyczną i praktyczną podwalinę dla nowego narzędzia, które będzie planować architekturę tworzonego oprogramowania i rygorystycznie monitorować jej jakość. Koncepcja ta opiera się na syntezie filozofii wybitnych architektów oprogramowania, takich jak John Carmack, Martin Fowler, Kent Beck czy Rich Hickey, oraz na analizie nowoczesnych mechanizmów optymalizacyjnych, reprezentowanych m.in. przez repozytorium Ponytail [1].

## 1. Filozoficzne Fundamenty Architektury

Narzędzie nie narzuca jednego, sztywnego wzorca (np. zawsze mikroserwisy), lecz opiera się na zestawie uniwersalnych zasad, wywodzących się z doświadczeń wiodących inżynierów.

### Prostota jako Cel Nadrzędny
Rich Hickey w swojej prelekcji "Simple Made Easy" wprowadza kluczowe rozróżnienie: "simple" (proste, obiektywne, brak splątania) to nie to samo co "easy" (łatwe, subiektywne, znajome) [2]. Narzędzie musi wymuszać obiektywną prostotę. Jak zauważa John Carmack, "czasami elegancką implementacją jest po prostu funkcja. Nie metoda. Nie klasa. Nie framework. Po prostu funkcja" [3]. Każda abstrakcja niesie za sobą koszt, który może przewyższyć jej korzyści.

### Dane w Centrum Uwagi
Mike Acton, promując Data-Oriented Design, przypomina, że celem każdego programu jest transformacja danych [4]. Jeśli nie rozumiemy danych, nie rozumiemy problemu. Narzędzie architektoniczne powinno najpierw modelować przepływy danych i struktury, a dopiero później zastanawiać się nad kodem, który je obsługuje.

### Głębokie Moduły
Zgodnie z filozofią Johna Ousterhouta, narzędzie powinno promować tworzenie "głębokich modułów" (deep modules) [5]. Są to moduły charakteryzujące się bardzo prostym, wąskim interfejsem, który ukrywa skomplikowaną implementację. Płytkie moduły (rozbudowane interfejsy z trywialną logiką) prowadzą do wycieku informacji i zwiększają złożoność całego systemu.

### Niezależność i Kierunek Zależności
Opierając się na "Clean Architecture" Roberta C. Martina (Uncle Bob), narzędzie musi pilnować zasady zależności (Dependency Rule) [6]. Zależności w kodzie źródłowym mogą wskazywać tylko do wewnątrz, w stronę reguł biznesowych. Mechanizmy takie jak bazy danych czy interfejsy użytkownika muszą pozostać na zewnątrz.

| Zasada | Autor / Źródło | Zastosowanie w Narzędziu |
| :--- | :--- | :--- |
| **Simple > Easy** | Rich Hickey | Wymuszanie braku splątania (interleaving) zamiast używania znanych, ale ciężkich frameworków. |
| **Data-Oriented** | Mike Acton | Definiowanie architektury wokół struktur i transformacji danych. |
| **Deep Modules** | John Ousterhout | Promowanie prostych interfejsów ukrywających złożoność implementacji. |
| **Dependency Rule**| Robert C. Martin | Automatyczne blokowanie importów łamiących kierunek zależności (np. domena importująca UI). |
| **Brute-force Pragmatism**| John Carmack | Unikanie przedwczesnej elastyczności; budowanie tego, co potrzebne tu i teraz. |

## 2. Wzorzec Działania: Architektoniczna Drabina Decyzyjna

Inspirując się repozytorium Ponytail, które zmusza agenta AI do myślenia jak "najbardziej leniwy senior dev" [1], nasze narzędzie zaimplementuje Architektoniczną Drabinę Decyzyjną. Zanim AI wygeneruje jakikolwiek kod lub zaplanuje nowy komponent, musi przejść przez rygorystyczny proces weryfikacji.

Narzędzie zatrzymuje się na pierwszym szczeblu, który spełnia warunki:

1. **Weryfikacja YAGNI (You Ain't Gonna Need It)**: Czy ten komponent jest absolutnie niezbędny do spełnienia obecnych wymagań biznesowych? Jeśli nie – odrzuć pomysł. Najlepszy kod to ten, którego nie trzeba było napisać.
2. **Weryfikacja Ponownego Użycia (Reuse)**: Czy podobna logika lub struktura danych istnieje już w kodzie? Jeśli tak – zintegruj i użyj ponownie, zamiast pisać od nowa.
3. **Weryfikacja Ekosystemu**: Czy biblioteka standardowa języka lub natywne funkcje platformy obsługują ten problem? Jeśli tak – użyj ich. Unikaj zewnętrznych zależności, gdy nie są konieczne.
4. **Weryfikacja Kosztu Abstrakcji**: Czy wprowadzenie nowej klasy/wzorca projektowego jest warte swojej ceny? Jeśli problem można rozwiązać prostą funkcją, narzędzie wymusi użycie funkcji.
5. **Minimum Viable Architecture**: Dopiero gdy wszystkie powyższe szczeble zawiodą, narzędzie projektuje najprostszą możliwą architekturę, która rozwiązuje dany problem.

> "The ladder runs *after* it understands the problem, not instead of it: it reads the code the change touches and traces the real flow before picking a rung. Lazy about the solution, never about reading." [1]

## 3. Fazy Działania Narzędzia

Narzędzie operuje w trzech głównych fazach cyklu życia oprogramowania, zapewniając ciągłą kontrolę nad architekturą.

### Faza 1: Incepcja (Projektowanie)
W tej fazie narzędzie działa jako Główny Architekt. Rozpoczyna od zrozumienia domeny problemu (tworząc Ubiquitous Language według koncepcji Erica Evansa [7]). Następnie definiuje przepływy danych i wyznacza granice kontekstów (Bounded Contexts). Podejmuje kluczowe decyzje, które Martin Fowler określa jako "trudne do zmiany" (np. wybór języka, bazy danych, protokołów komunikacyjnych) [8].

### Faza 2: Planowanie i Sterowanie Generacją
Narzędzie nie generuje bezpośrednio kodu, lecz tworzy "Tracer Bullets" (Pociski Smugowe) – szkielet end-to-end, który weryfikuje architekturę w praktyce [9]. Następnie instruuje agentów AI (np. kodujących), stosując Drabinę Decyzyjną dla każdego zadania. Wymusza tworzenie Głębokich Modułów i dba o to, by agenci nie wprowadzali "architektonicznego spaghetti".

### Faza 3: Monitorowanie i Audyt (Strażnik)
Narzędzie działa w tle jako bezwzględny recenzent kodu. Posiada wbudowane mechanizmy:
- **Continuous Review**: Audytuje zmiany pod kątem over-engineeringu, poszukując niepotrzebnych zależności, martwej elastyczności i wymyślonych na nowo funkcji biblioteki standardowej.
- **Dependency Guard**: Analizuje graf zależności i automatycznie odrzuca propozycje AI, które łamią zasady Clean Architecture (np. gdy warstwa domenowa próbuje importować bibliotekę bazodanową).
- **Complexity Tracking**: Monitoruje poziom złożoności i sygnalizuje, kiedy komponent wymaga refaktoryzacji, przypominając, że kod należy poddawać ponownej ocenie co kilka lat [3].

## 4. Granice Bezpieczeństwa (Safety Boundaries)

Choć narzędzie jest rygorystyczne w eliminowaniu zbędnego kodu, posiada nienaruszalne granice, których nigdy nie przekracza w imię "optymalizacji":

- **Bezpieczeństwo i Walidacja**: Walidacja na granicach zaufania (trust-boundary validation), obsługa błędów i zabezpieczenia przed utratą danych są absolutnie priorytetowe.
- **Czytelność**: Zgodnie z zasadą Kenta Becka "Reveals intention" [10], kod musi jasno komunikować swoje intencje. Czasami oznacza to akceptację minimalnej duplikacji, jeśli poprawia ona zrozumiałość systemu dla człowieka.
- **Wydajność**: Architektura nie może wprowadzać abstrakcji, które uniemożliwiają kompilatorom optymalizację kodu. Jak zauważa Casey Muratori, idee stojące za tzw. czystym kodem (np. nadmierne użycie polimorfizmu) mogą mieć fatalny wpływ na wydajność [11].

## Podsumowanie

Proponowane narzędzie stanowi odpowiedź na problemy generowane przez niekontrolowane użycie AI w programowaniu. Poprzez przyjęcie podejścia "Architect-First", zaimplementowanie Architektonicznej Drabiny Decyzyjnej oraz ciągłe monitorowanie zasad prostoty i przepływu danych, narzędzie to zapewni, że tworzone systemy będą stabilne, wydajne i łatwe w utrzymaniu. Będzie działać nie jako kolejny generator kodu, lecz jako zautomatyzowany Principal Architect, który chroni projekt przed zgubnymi skutkami over-engineeringu.

## Referencje

[1] D. Gebert, "Ponytail: Makes your AI agent think like the laziest senior dev in the room," GitHub, 2026. [Online]. Available: https://github.com/DietrichGebert/ponytail
[2] R. Hickey, "Simple Made Easy," QCon, 2011. [Online]. Available: https://www.infoq.com/presentations/Simple-Made-Easy/
[3] J. Carmack, "Lessons from John Carmack," A. Buteau Blog, 2026. [Online]. Available: https://www.antoinebuteau.com/lessons-from-john-carmack/
[4] M. Acton, "Data-Oriented Design and C++," CppCon, 2014. [Online]. Available: https://www.youtube.com/watch?v=rX0ItVEVjHc
[5] J. Ousterhout, "A Philosophy of Software Design," Yaknyam Press, 2018.
[6] R. C. Martin, "The Clean Architecture," The Clean Code Blog, 2012. [Online]. Available: https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html
[7] E. Evans, "Domain-Driven Design: Tackling Complexity in the Heart of Software," Addison-Wesley Professional, 2003.
[8] M. Fowler, "Software Architecture Guide," MartinFowler.com, 2019. [Online]. Available: https://martinfowler.com/architecture/
[9] D. Thomas and A. Hunt, "The Pragmatic Programmer: Your Journey to Mastery," Addison-Wesley Professional, 1999.
[10] M. Fowler, "Beck Design Rules," MartinFowler.com, 2015. [Online]. Available: https://martinfowler.com/bliki/BeckDesignRules.html
[11] C. Muratori, "Clean Code, Horrible Performance," Computer Enhance, 2023. [Online]. Available: https://www.computerenhance.com/p/clean-code-horrible-performance
