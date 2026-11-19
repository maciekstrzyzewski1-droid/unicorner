// Rachunkowość — dane zadań z zajęć do modułów o kontach (liczone w lib/konta.js).
import { rachunekWyniku, podatekDochodowy, przeksiegowania, ksieguj } from './konta.js';

// Zad. 5.5, str. 67 (MIKS): bilans otwarcia na 1.01.20X6, 10 operacji ze stycznia, konta → ZOiS → bilans zamknięcia.
// Kwota operacji 9 (6 000) jak w arkuszu z rozwiązaniem z zajęć (prowadzący zmienił ją względem zbioru).
// Kolejność kont jak w zestawieniu z zajęć.
export const K55 = [
  { id: 'st', nazwa: 'Środki trwałe', typ: 'A', sp: 31000, poz: 'AA2' },
  { id: 'mat', nazwa: 'Materiały', typ: 'A', sp: 18000, poz: 'AB1' },
  { id: 'odb', nazwa: 'Rozrachunki z odbiorcami', typ: 'A', sp: 16000, poz: 'AB2' },
  { id: 'kasa', nazwa: 'Kasa', typ: 'A', sp: 4000, poz: 'AB3', stan: 'W kasie zostaje {k} gotówki.' },
  { id: 'rb', nazwa: 'Rachunek bieżący', typ: 'A', sp: 11000, poz: 'AB3', stan: 'Na rachunku zostaje {k}.' },
  { id: 'kp', nazwa: 'Kapitał podstawowy', typ: 'P', sp: 50000, poz: 'PA1' },
  { id: 'strata', nazwa: 'Strata z lat ubiegłych', typ: 'P', ujemne: true, sp: 7000, poz: 'PA5' },
  { id: 'kred', nazwa: 'Kredyt bankowy krótkoterminowy', typ: 'P', sp: 20000, poz: 'PB3', stan: 'Firma jest jeszcze winna bankowi {k}.' },
  { id: 'dost', nazwa: 'Rozrachunki z dostawcami', typ: 'P', sp: 12000, poz: 'PB3' },
  { id: 'wyn', nazwa: 'Rozrachunki z tytułu wynagrodzeń', typ: 'P', sp: 5000, poz: 'PB3' },
  { id: 'inw', nazwa: 'Inwestycje długoterminowe', typ: 'A', poz: 'AA4' },
  { id: 'prac', nazwa: 'Pozostałe rozrachunki z pracownikami', typ: 'A', poz: 'AB2' },
];
export const O55 = [
  { nr: 1, kwota: 16000, wn: 'rb', ma: 'odb', opis: 'Odbiorcy wpłacili na rachunek bankowy pieniądze za wcześniejsze dostawy.', co: { wn: 'odbiorcy przelali pieniądze na rachunek firmy', ma: 'odbiorcy nie są już winni firmie tych pieniędzy' } },
  { nr: 2, kwota: 6000, wn: 'dost', ma: 'rb', opis: 'Przelewem z rachunku spłacono część długu wobec dostawcy.', co: { wn: 'dług wobec dostawcy zmalał, bo spłaciliśmy jego część', ma: 'przelew wyszedł z rachunku' } },
  { nr: 3, kwota: 5000, wn: 'kred', ma: 'rb', opis: 'Z rachunku bankowego spłacono ratę kredytu.', co: { wn: 'dług wobec banku zmalał o spłaconą ratę', ma: 'rata wyszła z rachunku' } },
  { nr: 4, kwota: 10000, wn: 'inw', ma: 'rb', opis: 'Kupiono dwuletnie obligacje państwowe, zapłata przelewem.', co: { wn: 'firma ma obligacje, czyli nowy składnik majątku', ma: 'zapłata za obligacje wyszła z rachunku' } },
  { nr: 5, kwota: 1000, wn: 'prac', ma: 'kasa', opis: 'Z kasy wypłacono pracownikowi zaliczkę na podróż służbową po kraju.', co: { wn: 'pracownik jest teraz winien firmie rozliczenie zaliczki', ma: 'gotówka wyszła z kasy' } },
  { nr: 6, kwota: 19000, wn: 'st', ma: 'kp', opis: 'Nowy udziałowiec wniósł do spółki środek trwały.', co: { wn: 'w firmie przybył środek trwały', ma: 'nowy udziałowiec wniósł wkład, więc kapitał właścicieli rośnie' } },
  { nr: 7, kwota: 3000, wn: 'rb', ma: 'kasa', opis: 'Gotówkę z kasy wpłacono na rachunek bankowy.', co: { wn: 'gotówka trafiła na rachunek', ma: 'te same pieniądze wyszły z kasy' } },
  { nr: 8, kwota: 2000, wn: 'wyn', ma: 'rb', opis: 'Przelewem wypłacono pracownikom zaległe wynagrodzenia.', co: { wn: 'firma nie jest już winna pracownikom tych wynagrodzeń', ma: 'wypłata wyszła z rachunku' } },
  { nr: 9, kwota: 6000, wn: 'dost', ma: 'mat', opis: 'Część materiałów zwrócono dostawcy, bo były złej jakości.', co: { wn: 'firma nie zapłaci za zwrócony towar, więc dług wobec dostawcy maleje', ma: 'materiały wróciły do dostawcy, w magazynie jest ich mniej' } },
  { nr: 10, kwota: 4000, wn: 'kasa', ma: 'strata', opis: 'Wspólnicy dopłacili gotówką do kasy, a dopłatą pokryto stratę z poprzedniego roku.', co: { wn: 'wspólnicy wpłacili gotówkę do kasy', ma: 'dopłatą pokryto część straty, więc minus w kapitale jest mniejszy' } },
];

// Zad. 5.4, str. 66 (Hurtex): firma zaczyna działalność 1.01.20X6 — bilans otwarcia: rachunek 5 000, kapitał zakładowy 5 000.
// 4 operacje ze stycznia; kwoty operacji 4 nie ma w treści: kredyt spłaca resztę długu wobec dostawcy X = 9 000 − 1 000.
// Polecenie 5: analiza zmian sumy bilansowej i struktury (lib/konta-zadania.js → strukturaHurtex niżej, kontrola w narzedzia/mat-check).
export const K54 = [
  { id: 'rb', nazwa: 'Rachunek bieżący', typ: 'A', sp: 5000, poz: 'AB3', stan: 'Na rachunku zostaje {k}.' },
  { id: 'kasa', nazwa: 'Kasa', typ: 'A', poz: 'AB3', stan: 'W kasie jest {k} gotówki.' },
  { id: 'tow', nazwa: 'Towary', typ: 'A', poz: 'AB1', stan: 'W magazynie są towary warte {k}.' },
  { id: 'kz', nazwa: 'Kapitał zakładowy', typ: 'P', sp: 5000, poz: 'PA1' },
  { id: 'dost', nazwa: 'Rozrachunki z dostawcami', typ: 'P', poz: 'PB3' },
  { id: 'kred', nazwa: 'Kredyty bankowe', typ: 'P', poz: 'PB3', stan: 'Firma jest winna bankowi {k}.' },
];
const DLUG_X = 9000 - 1000; // op. 1 minus op. 3
export const O54 = [
  { nr: 1, kwota: 9000, wn: 'tow', ma: 'dost', opis: 'Kupiono towary do magazynu. Dostawca X wystawił fakturę, zapłata później.', co: { wn: 'do magazynu przyszedł towar', ma: 'nie zapłaciliśmy od razu, więc powstał dług wobec dostawcy X' } },
  { nr: 2, kwota: 2000, wn: 'kasa', ma: 'rb', opis: 'Podjęto gotówkę z rachunku bieżącego do kasy.', co: { wn: 'gotówka trafiła do kasy', ma: 'te same pieniądze zeszły z rachunku' } },
  { nr: 3, kwota: 1000, wn: 'dost', ma: 'rb', opis: 'Przelewem z rachunku spłacono część długu wobec dostawcy X.', co: { wn: 'część długu wobec dostawcy X jest spłacona', ma: 'przelew wyszedł z rachunku' } },
  { nr: 4, kwota: DLUG_X, wn: 'dost', ma: 'kred', opis: 'Zaciągnięto kredyt krótkoterminowy na spłatę reszty długu wobec dostawcy X (9 000 − 1 000).', co: { wn: 'resztę długu wobec dostawcy X spłacił bank', ma: 'firma jest teraz winna te pieniądze bankowi' } },
];

// Zad. 4.6 (skan „ZADANIE WYNIK”, materiały z wykładów): przedsiębiorstwo handlowe Star Wars sp. z o.o.,
// bilans na 1.01.20X5, 18 operacji ze stycznia (9a i 9b z jednego wyciągu bankowego), konta bilansowe i wynikowe,
// przeksięgowania na wynik finansowy, podatek dochodowy 19% (w rozwiązaniu z zajęć: 1 500 · 19% = 285), bilans zamknięcia.
// Dopiski z rozwiązania z zajęć: op. 11 → PPO, op. 15 → PKO, op. 14 i 17 → „P-P” (rozrachunki publicznoprawne).
export const K46 = [
  { id: 'st', nazwa: 'Środki trwałe', typ: 'A', sp: 92000 },
  { id: 'tow', nazwa: 'Towary', typ: 'A', sp: 45000 },
  { id: 'odb', nazwa: 'Rozrachunki z odbiorcami', typ: 'A', sp: 50000, bil: 'Należności' },
  { id: 'kasa', nazwa: 'Kasa', typ: 'A', sp: 28000, stan: 'W kasie zostaje {k} gotówki.' },
  { id: 'rb', nazwa: 'Rachunek bankowy', typ: 'A', sp: 42000, stan: 'Na rachunku zostaje {k}.' },
  { id: 'kz', nazwa: 'Kapitał zakładowy', typ: 'P', sp: 157000 },
  { id: 'dost', nazwa: 'Rozrachunki z dostawcami', typ: 'P', sp: 58000, bil: 'Zobowiązania wobec dostawców' },
  { id: 'kred', nazwa: 'Kredyt bankowy', typ: 'P', sp: 42000 },
  { id: 'wyn', nazwa: 'Rozrachunki z tytułu wynagrodzeń', typ: 'P', bil: 'Zobowiązania z tytułu wynagrodzeń' },
  { id: 'pp', nazwa: 'Rozrachunki publicznoprawne', typ: 'P', bil: 'Zobowiązania z tytułu podatków' },
  { id: 'pst', nazwa: 'Przychody ze sprzedaży towarów', typ: 'R' },
  { id: 'ppo', nazwa: 'Pozostałe przychody operacyjne', typ: 'R' },
  { id: 'pf', nazwa: 'Przychody finansowe', typ: 'R' },
  { id: 'wst', nazwa: 'Wartość sprzedanych towarów', typ: 'K' },
  { id: 'uo', nazwa: 'Usługi obce', typ: 'K' },
  { id: 'wynag', nazwa: 'Wynagrodzenia', typ: 'K' },
  { id: 'pio', nazwa: 'Podatki i opłaty', typ: 'K' },
  { id: 'pko', nazwa: 'Pozostałe koszty operacyjne', typ: 'K' },
  { id: 'kf', nazwa: 'Koszty finansowe', typ: 'K' },
  { id: 'pd', nazwa: 'Podatek dochodowy', typ: 'K', obciazenie: true, rodzaj: 'obciążenie wyniku' },
  { id: 'wf', nazwa: 'Wynik finansowy', typ: 'P', wynik: true, rodzaj: 'konto wyniku', bil: 'Zysk netto' },
];
export const O46 = [
  { nr: 1, kwota: 1800, wn: 'tow', ma: 'kasa', opis: 'Kupiono za gotówkę towary i przyjęto je do magazynu.', co: { wn: 'do magazynu przyszedł towar', ma: 'gotówka wyszła z kasy' } },
  { nr: 2, kwota: 10000, wn: 'dost', ma: 'kred', opis: 'Zaciągnięto kredyt bankowy i z niego spłacono część zobowiązań.', co: { wn: 'bank spłacił za firmę część długu wobec dostawców', ma: 'firma jest teraz winna te pieniądze bankowi' } },
  { nr: 3, kwota: 35000, wn: 'st', ma: 'kz', opis: 'Wspólnik wniósł do spółki aportem środek trwały.', co: { wn: 'w firmie przybył środek trwały', ma: 'wspólnik wniósł go jako wkład, więc kapitał właścicieli rośnie' } },
  { nr: 4, kwota: 16500, wn: 'rb', ma: 'odb', opis: 'Odbiorca zapłacił należność przelewem na rachunek bankowy.', co: { wn: 'pieniądze od odbiorcy wpłynęły na rachunek', ma: 'odbiorca nie jest już winien firmie tej kwoty' } },
  { nr: 5, kwota: 17000, wn: 'dost', ma: 'kasa', opis: 'Z kasy spłacono część zobowiązań wobec dostawców.', co: { wn: 'dług wobec dostawców zmalał o spłaconą część', ma: 'gotówka wyszła z kasy' } },
  { nr: 6, kwota: 4000, wn: 'kred', ma: 'rb', opis: 'Przelewem z rachunku bankowego spłacono ratę kredytu.', co: { wn: 'dług wobec banku zmalał o ratę', ma: 'rata wyszła z rachunku' } },
  { nr: 7, kwota: 28000, wn: 'st', ma: 'dost', opis: 'Kupiono środek trwały, zapłata w lutym.', co: { wn: 'w firmie przybył środek trwały', ma: 'zapłata dopiero w lutym, więc powstał dług wobec sprzedawcy' } },
  { nr: 8, kwota: 900, wn: 'uo', ma: 'dost', opis: 'Przyszła faktura za obsługę prawną i księgową spółki.', co: { wn: 'firma zużyła usługę prawną i księgową', ma: 'faktura nie jest zapłacona, więc rośnie dług wobec dostawcy' } },
  { nr: '9a', kwota: 200, wn: 'rb', ma: 'pf', opis: 'Wyciąg bankowy: bank dopisał odsetki do pieniędzy na rachunku.', co: { wn: 'na rachunku przybyło pieniędzy', ma: 'odsetki to zarobek z pieniędzy trzymanych w banku, a nie ze sprzedaży, czyli przychód finansowy' } },
  { nr: '9b', kwota: 300, wn: 'kf', ma: 'rb', opis: 'Wyciąg bankowy: bank pobrał z rachunku odsetki od kredytu.', co: { wn: 'odsetki od kredytu to cena za korzystanie z cudzych pieniędzy, czyli koszt finansowy', ma: 'bank zabrał pieniądze z rachunku' } },
  { nr: 10, kwota: 1300, wn: 'wynag', ma: 'wyn', opis: 'Naliczono wynagrodzenia dla pracowników.', co: { wn: 'praca pracowników w tym miesiącu to koszt działania firmy', ma: 'firma jest winna pracownikom wypłatę' } },
  { nr: 11, kwota: 3000, wn: 'dost', ma: 'ppo', opis: 'Kontrahent A umorzył część zobowiązań spółki.', co: { wn: 'kontrahent darował część długu i firma nie musi go spłacać', ma: 'umorzony dług to korzyść spoza sprzedaży, czyli pozostały przychód operacyjny' } },
  { nr: 12, kwota: 8200, wn: 'odb', ma: 'pst', opis: 'Sprzedano towary, wystawiono fakturę, zapłata później.', co: { wn: 'odbiorca jest winien firmie za towar', ma: 'firma sprzedała towar, więc to przychód ze sprzedaży' } },
  { nr: 13, kwota: 3200, wn: 'wst', ma: 'tow', opis: 'Wydano z magazynu sprzedane towary.', co: { wn: 'towar oddany klientowi to koszt tej sprzedaży, czyli wartość sprzedanych towarów', ma: 'towar wyszedł z magazynu' } },
  { nr: 14, kwota: 200, wn: 'pio', ma: 'pp', opis: 'Naliczono podatek od nieruchomości za bieżący miesiąc.', co: { wn: 'podatek od nieruchomości to koszt działania firmy', ma: 'firma jest winna podatek gminie' } },
  { nr: 15, kwota: 1000, wn: 'pko', ma: 'tow', opis: 'W pożarze spłonęła część towarów.', co: { wn: 'strata w pożarze to koszt spoza zwykłej działalności, czyli pozostały koszt operacyjny', ma: 'towaru w magazynie ubyło' } },
  { nr: 16, kwota: 3000, wn: 'uo', ma: 'dost', opis: 'Naliczono czynsz za najem hali magazynowej za bieżący miesiąc.', co: { wn: 'czynsz za halę to usługa, którą firma zużyła w tym miesiącu', ma: 'czynsz nie jest zapłacony, więc rośnie dług wobec wynajmującego' } },
];
// wynik przed podatkiem — z sald kont wynikowych po operacjach 1–16
export const R46 = rachunekWyniku(K46, O46);
// przeksięgowania przychodów i kosztów na wynik finansowy (P1–P9)
export const P46 = przeksiegowania(K46, O46);
export const PODATEK46 = podatekDochodowy(R46.brutto, 19);
export const O46_17 = { nr: 17, kwota: PODATEK46, wn: 'pd', ma: 'pp', opis: 'Naliczono podatek dochodowy: 19% zysku brutto.' };
// przeksięgowanie podatku na wynik finansowy (P10)
export const P46_POD = przeksiegowania(K46, [...O46, ...P46, O46_17], { od: P46.length + 1, ids: ['pd'] });
export const O46_PELNE = [...O46, ...P46, O46_17, ...P46_POD];
export const NETTO46 = R46.brutto - PODATEK46;
{
  // kontrola z rozwiązaniem z zajęć: zysk brutto 1 500, podatek 285; i z bilansem zamknięcia (ksieguj sprawdza aktywa = pasywa)
  if (R46.brutto !== 1500 || PODATEK46 !== 285) throw new Error(`konta-zadania.js: Zad. 4.6 — brutto ${R46.brutto}, podatek ${PODATEK46} (zajęcia: 1 500 i 285)`);
  const k = ksieguj(K46, O46_PELNE, { pelny: true });
  if (k.zam.wf.saldo !== NETTO46 || k.zam.wf.saldoStrona !== 'ma') throw new Error('konta-zadania.js: Zad. 4.6 — saldo wyniku ≠ zysk netto');
}

// ——— Trening przed kolokwium (moduł 5): trzy zadania na kontach z pułapkami ———
// Wycinki bilansu (bez kapitału własnego), więc bilansu otwarcia nie sprawdzamy — tylko podwójny zapis operacji.
// Pułapki: spłata długu (oba konta maleją, strony różne), reklamacja uznana przez dostawcę (AP−, bez przychodu),
// towar otrzymany za darmo (Wn Towary, Ma Pozostałe przychody operacyjne — rachunek bankowy się nie zmienia).
export const KT1 = [
  { id: 'rb', nazwa: 'Rachunek bankowy', typ: 'A', sp: 40000, stan: 'Na rachunku zostaje {k}.' },
  { id: 'tow', nazwa: 'Towary', typ: 'A', sp: 15000, stan: 'W magazynie są towary warte {k}.' },
  { id: 'dost', nazwa: 'Rozrachunki z dostawcami', typ: 'P', sp: 10000, stan: 'Firma jest jeszcze winna dostawcom {k}.' },
  { id: 'uo', nazwa: 'Usługi obce', typ: 'K' },
];
export const OT1 = [
  { nr: 1, kwota: 12000, wn: 'tow', ma: 'dost', opis: 'Kupiono towary na fakturę z zapłatą za 30 dni.', co: { wn: 'do magazynu przyszedł nowy towar', ma: 'nie zapłaciliśmy od razu, więc rośnie dług wobec dostawcy' } },
  { nr: 2, kwota: 6500, wn: 'dost', ma: 'rb', opis: 'Przelewem spłacono część starego długu wobec dostawcy.', co: { wn: 'część długu jest spłacona', ma: 'przelew wyszedł z rachunku' } },
  { nr: 3, kwota: 1500, wn: 'dost', ma: 'tow', opis: 'Dostawca uznał reklamację wadliwego towaru i obniżył cenę.', co: { wn: 'po obniżce ceny firma jest winna dostawcy mniej', ma: 'towar w magazynie kosztował mniej, niż zapisaliśmy przy zakupie' } },
  { nr: 4, kwota: 2400, wn: 'uo', ma: 'dost', opis: 'Przyszła faktura za obsługę księgową, płatna za 14 dni.', co: { wn: 'firma zużyła usługę księgową', ma: 'faktura nie jest zapłacona, więc rośnie dług wobec biura rachunkowego' } },
  { nr: 5, kwota: 2400, wn: 'dost', ma: 'rb', opis: 'Przelewem zapłacono fakturę za obsługę księgową.', co: { wn: 'dług za usługę księgową znika', ma: 'przelew wyszedł z rachunku' } },
];
export const KT2 = [
  { id: 'rb', nazwa: 'Rachunek bankowy', typ: 'A', sp: 60000, stan: 'Na rachunku zostaje {k}.' },
  { id: 'tow', nazwa: 'Towary', typ: 'A', sp: 20000, stan: 'W magazynie są towary warte {k}.' },
  { id: 'kred', nazwa: 'Kredyty bankowe', typ: 'P', sp: 25000, stan: 'Firma jest jeszcze winna bankowi {k}.' },
  { id: 'dost', nazwa: 'Rozrachunki z dostawcami', typ: 'P', sp: 8000, stan: 'Firma jest winna dostawcom {k}.' },
  { id: 'ppo', nazwa: 'Pozostałe przychody operacyjne', typ: 'R' },
  { id: 'zme', nazwa: 'Zużycie materiałów i energii', typ: 'K' },
];
export const OT2 = [
  { nr: 1, kwota: 4000, wn: 'tow', ma: 'ppo', opis: 'Hurtownia przekazała nieodpłatnie partię towarów w podziękowaniu za współpracę.', co: { wn: 'do magazynu przyszedł towar', ma: 'firma dostała go za darmo, a taką korzyść ustawa zalicza do pozostałych przychodów operacyjnych' } },
  { nr: 2, kwota: 5000, wn: 'kred', ma: 'rb', opis: 'Z rachunku spłacono ratę kredytu.', co: { wn: 'dług wobec banku zmalał o ratę', ma: 'rata wyszła z rachunku' } },
  { nr: 3, kwota: 7000, wn: 'tow', ma: 'rb', opis: 'Kupiono towary i od razu zapłacono przelewem.', co: { wn: 'do magazynu przyszedł towar', ma: 'zapłata od razu wyszła z rachunku, więc żaden dług nie powstał' } },
  { nr: 4, kwota: 1800, wn: 'zme', ma: 'dost', opis: 'Przyszła faktura za energię elektryczną w magazynie, płatna za 14 dni.', co: { wn: 'firma zużyła prąd', ma: 'faktura nie jest zapłacona, więc rośnie dług wobec dostawcy prądu' } },
  { nr: 5, kwota: 8000, wn: 'dost', ma: 'rb', opis: 'Z rachunku spłacono cały początkowy dług wobec dostawcy.', co: { wn: 'stary dług wobec dostawcy jest spłacony', ma: 'przelew wyszedł z rachunku' } },
];
export const KT3 = [
  { id: 'rb', nazwa: 'Rachunek bankowy', typ: 'A', sp: 50000, stan: 'Na rachunku zostaje {k}.' },
  { id: 'tow', nazwa: 'Towary', typ: 'A', sp: 30000, stan: 'W magazynie są towary warte {k}.' },
  { id: 'dost', nazwa: 'Rozrachunki z dostawcami', typ: 'P', sp: 14000, stan: 'Firma jest jeszcze winna dostawcom {k}.' },
  { id: 'kred', nazwa: 'Kredyty bankowe', typ: 'P', sp: 20000, stan: 'Firma jest jeszcze winna bankowi {k}.' },
  { id: 'uo', nazwa: 'Usługi obce', typ: 'K' },
  { id: 'ppo', nazwa: 'Pozostałe przychody operacyjne', typ: 'R' },
];
export const OT3 = [
  { nr: 1, kwota: 10000, wn: 'tow', ma: 'dost', opis: 'Kupiono towary na fakturę z zapłatą za 21 dni.', co: { wn: 'do magazynu przyszedł towar', ma: 'zapłata będzie później, więc rośnie dług wobec dostawcy' } },
  { nr: 2, kwota: 1200, wn: 'dost', ma: 'tow', opis: 'Dostawca uznał reklamację towarów z operacji 1 i obniżył cenę.', co: { wn: 'po obniżce firma jest winna dostawcy mniej', ma: 'towar kosztował mniej, niż zapisaliśmy przy zakupie' } },
  { nr: 3, kwota: 9000, wn: 'dost', ma: 'rb', opis: 'Przelewem spłacono część długu wobec dostawców.', co: { wn: 'część długu jest spłacona', ma: 'przelew wyszedł z rachunku' } },
  { nr: 4, kwota: 3500, wn: 'uo', ma: 'dost', opis: 'Przyszła faktura za kampanię reklamową, płatna za 14 dni.', co: { wn: 'firma zużyła usługę agencji reklamowej', ma: 'faktura nie jest zapłacona, więc rośnie dług wobec agencji' } },
  { nr: 5, kwota: 2000, wn: 'tow', ma: 'ppo', opis: 'Partner przysłał za darmo promocyjną dostawę towarów.', co: { wn: 'do magazynu przyszedł towar', ma: 'firma dostała go za darmo, więc to pozostały przychód operacyjny' } },
  { nr: 6, kwota: 4000, wn: 'kred', ma: 'rb', opis: 'Z rachunku spłacono część kredytu.', co: { wn: 'dług wobec banku zmalał', ma: 'spłata wyszła z rachunku' } },
];
