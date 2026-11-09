// Rachunkowość — dane zadań z zajęć do modułów o kontach (liczone w lib/konta.js).
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
