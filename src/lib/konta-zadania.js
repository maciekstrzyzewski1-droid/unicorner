// Rachunkowość — dane zadań z zajęć do modułów o kontach (liczone w lib/konta.js).
import { rachunekWyniku, podatekDochodowy, przeksiegowania, ksieguj } from './konta.js';

// Zad. 5.5, str. 67 (MIKS): bilans otwarcia na 1.01.20X6, 10 operacji ze stycznia, konta → ZOiS → bilans zamknięcia.
// Kwota operacji 9 (6 000) jak w arkuszu z rozwiązaniem z zajęć (prowadzący zmienił ją względem zbioru).
// Kolejność kont jak w zestawieniu z zajęć.
export const K55 = [
  { id: 'st', nazwa: 'Środki trwałe', typ: 'A', sp: 31000, poz: 'AA2' },
  { id: 'mat', nazwa: 'Materiały', typ: 'A', sp: 18000, poz: 'AB1' },
  { id: 'odb', nazwa: 'Rozrachunki z odbiorcami', typ: 'A', sp: 16000, poz: 'AB2' },
  { id: 'kasa', nazwa: 'Kasa', typ: 'A', sp: 4000, poz: 'AB3' },
  { id: 'rb', nazwa: 'Rachunek bieżący', typ: 'A', sp: 11000, poz: 'AB3' },
  { id: 'kp', nazwa: 'Kapitał podstawowy', typ: 'P', sp: 50000, poz: 'PA1' },
  { id: 'strata', nazwa: 'Strata z lat ubiegłych', typ: 'P', ujemne: true, sp: 7000, poz: 'PA5' },
  { id: 'kred', nazwa: 'Kredyt bankowy krótkoterminowy', typ: 'P', sp: 20000, poz: 'PB3' },
  { id: 'dost', nazwa: 'Rozrachunki z dostawcami', typ: 'P', sp: 12000, poz: 'PB3' },
  { id: 'wyn', nazwa: 'Rozrachunki z tytułu wynagrodzeń', typ: 'P', sp: 5000, poz: 'PB3' },
  { id: 'inw', nazwa: 'Inwestycje długoterminowe', typ: 'A', poz: 'AA4' },
  { id: 'prac', nazwa: 'Pozostałe rozrachunki z pracownikami', typ: 'A', poz: 'AB2' },
];
export const O55 = [
  { nr: 1, kwota: 16000, wn: 'rb', ma: 'odb', opis: 'Odbiorcy wpłacili na rachunek bankowy pieniądze za wcześniejsze dostawy.' },
  { nr: 2, kwota: 6000, wn: 'dost', ma: 'rb', opis: 'Przelewem z rachunku spłacono część długu wobec dostawcy.' },
  { nr: 3, kwota: 5000, wn: 'kred', ma: 'rb', opis: 'Z rachunku bankowego spłacono ratę kredytu.' },
  { nr: 4, kwota: 10000, wn: 'inw', ma: 'rb', opis: 'Kupiono dwuletnie obligacje państwowe, zapłata przelewem.' },
  { nr: 5, kwota: 1000, wn: 'prac', ma: 'kasa', opis: 'Z kasy wypłacono pracownikowi zaliczkę na podróż służbową po kraju.' },
  { nr: 6, kwota: 19000, wn: 'st', ma: 'kp', opis: 'Nowy udziałowiec wniósł do spółki środek trwały.' },
  { nr: 7, kwota: 3000, wn: 'rb', ma: 'kasa', opis: 'Gotówkę z kasy wpłacono na rachunek bankowy.' },
  { nr: 8, kwota: 2000, wn: 'wyn', ma: 'rb', opis: 'Przelewem wypłacono pracownikom zaległe wynagrodzenia.' },
  { nr: 9, kwota: 6000, wn: 'dost', ma: 'mat', opis: 'Część materiałów zwrócono dostawcy, bo były złej jakości.' },
  { nr: 10, kwota: 4000, wn: 'kasa', ma: 'strata', opis: 'Wspólnicy dopłacili gotówką do kasy, a dopłatą pokryto stratę z poprzedniego roku.' },
];

// Zad. 4.6 (skan „ZADANIE WYNIK”, materiały z wykładów): przedsiębiorstwo handlowe Star Wars sp. z o.o.,
// bilans na 1.01.20X5, 18 operacji ze stycznia (9a i 9b z jednego wyciągu bankowego), konta bilansowe i wynikowe,
// przeksięgowania na wynik finansowy, podatek dochodowy 19% (w rozwiązaniu z zajęć: 1 500 · 19% = 285), bilans zamknięcia.
// Dopiski z rozwiązania z zajęć: op. 11 → PPO, op. 15 → PKO, op. 14 i 17 → „P-P” (rozrachunki publicznoprawne).
export const K46 = [
  { id: 'st', nazwa: 'Środki trwałe', typ: 'A', sp: 92000 },
  { id: 'tow', nazwa: 'Towary', typ: 'A', sp: 45000 },
  { id: 'odb', nazwa: 'Rozrachunki z odbiorcami', typ: 'A', sp: 50000, bil: 'Należności' },
  { id: 'kasa', nazwa: 'Kasa', typ: 'A', sp: 28000 },
  { id: 'rb', nazwa: 'Rachunek bankowy', typ: 'A', sp: 42000 },
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
  { nr: 1, kwota: 1800, wn: 'tow', ma: 'kasa', opis: 'Kupiono za gotówkę towary i przyjęto je do magazynu.' },
  { nr: 2, kwota: 10000, wn: 'dost', ma: 'kred', opis: 'Zaciągnięto kredyt bankowy i z niego spłacono część zobowiązań.' },
  { nr: 3, kwota: 35000, wn: 'st', ma: 'kz', opis: 'Wspólnik wniósł do spółki aportem środek trwały.' },
  { nr: 4, kwota: 16500, wn: 'rb', ma: 'odb', opis: 'Odbiorca zapłacił należność przelewem na rachunek bankowy.' },
  { nr: 5, kwota: 17000, wn: 'dost', ma: 'kasa', opis: 'Z kasy spłacono część zobowiązań wobec dostawców.' },
  { nr: 6, kwota: 4000, wn: 'kred', ma: 'rb', opis: 'Przelewem z rachunku bankowego spłacono ratę kredytu.' },
  { nr: 7, kwota: 28000, wn: 'st', ma: 'dost', opis: 'Kupiono środek trwały, zapłata w lutym.' },
  { nr: 8, kwota: 900, wn: 'uo', ma: 'dost', opis: 'Przyszła faktura za obsługę prawną i księgową spółki.' },
  { nr: '9a', kwota: 200, wn: 'rb', ma: 'pf', opis: 'Wyciąg bankowy: bank dopisał odsetki do pieniędzy na rachunku.' },
  { nr: '9b', kwota: 300, wn: 'kf', ma: 'rb', opis: 'Wyciąg bankowy: bank pobrał z rachunku odsetki od kredytu.' },
  { nr: 10, kwota: 1300, wn: 'wynag', ma: 'wyn', opis: 'Naliczono wynagrodzenia dla pracowników.' },
  { nr: 11, kwota: 3000, wn: 'dost', ma: 'ppo', opis: 'Kontrahent A umorzył część zobowiązań spółki.' },
  { nr: 12, kwota: 8200, wn: 'odb', ma: 'pst', opis: 'Sprzedano towary, wystawiono fakturę, zapłata później.' },
  { nr: 13, kwota: 3200, wn: 'wst', ma: 'tow', opis: 'Wydano z magazynu sprzedane towary.' },
  { nr: 14, kwota: 200, wn: 'pio', ma: 'pp', opis: 'Naliczono podatek od nieruchomości za bieżący miesiąc.' },
  { nr: 15, kwota: 1000, wn: 'pko', ma: 'tow', opis: 'W pożarze spłonęła część towarów.' },
  { nr: 16, kwota: 3000, wn: 'uo', ma: 'dost', opis: 'Naliczono czynsz za najem hali magazynowej za bieżący miesiąc.' },
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
