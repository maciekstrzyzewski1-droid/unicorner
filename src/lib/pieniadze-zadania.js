// Dane modułu „Środki pieniężne” (kurs Rachunkowość, moduł 6). Wszystkie kwoty na stronie liczą się stąd.
// Schematy księgowań i treści przykładów: konspekt z wykładu „Środki pieniężne i ich ekwiwalenty”.
// Rozwiązań przykładów w konspekcie nie ma — księgowania ułożone według schematów z tego konspektu
// i sprawdzone tym, że konto „Środki pieniężne w drodze” w obu przykładach wychodzi na zero.
// Numery operacji: litery (4a, 5d) są takie jak w treści zadania z wykładu; kropka i cyfra (2.1, 2.2)
// oznaczają części jednego zapisu złożonego (np. dług i odsetki na jednym wekslu).
import { ksieguj } from './konta.js';

// ——— Typowe księgowania z konspektu (same strony, bez kwot) ———
export const SCHEMAT_KASA = [
  { nr: 1, opis: 'Pobranie pieniędzy z banku do kasy', wn: 'Kasa', ma: 'Rachunek bieżący' },
  { nr: 2, opis: 'Przekazanie gotówki z kasy do banku', wn: 'Rachunek bieżący', ma: 'Kasa' },
  { nr: 3, opis: 'Wypłata gotówką wynagrodzeń pracownikom', wn: 'Rozrachunki z pracownikami', ma: 'Kasa' },
  { nr: 4, opis: 'Wpłata należności od odbiorców do kasy', wn: 'Kasa', ma: 'Rozrachunki z odbiorcami' },
  { nr: 5, opis: 'Spłata gotówką zobowiązania wobec dostawców', wn: 'Rozrachunki z dostawcami', ma: 'Kasa' },
  { nr: 6, opis: 'Sprzedaż gotówkowa', wn: 'Kasa', ma: 'Sprzedaż (przychody ze sprzedaży)' },
  { nr: 7, opis: 'Koszty działalności opłacone gotówką', wn: 'Koszty operacyjne', ma: 'Kasa' },
  { nr: 8, opis: 'Stwierdzony niedobór gotówki w kasie', wn: 'Rozliczenie niedoborów, szkód i nadwyżek', ma: 'Kasa' },
  { nr: 9, opis: 'Stwierdzona nadwyżka gotówki w kasie', wn: 'Kasa', ma: 'Rozliczenie niedoborów, szkód i nadwyżek' },
];
export const SCHEMAT_RB = [
  { nr: 1, opis: 'Wpłata gotówki z kasy do banku', wn: 'Rachunek bieżący', ma: 'Kasa' },
  { nr: 2, opis: 'Pobranie gotówki z banku do kasy', wn: 'Kasa', ma: 'Rachunek bieżący' },
  { nr: 3, opis: 'Spłata zobowiązania wobec dostawcy', wn: 'Rozrachunki z dostawcami', ma: 'Rachunek bieżący' },
  { nr: 4, opis: 'Uregulowanie należności przez odbiorcę', wn: 'Rachunek bieżący', ma: 'Rozrachunki z odbiorcami' },
  { nr: 5, opis: 'Uzyskanie kredytu bankowego z przekazaniem pieniędzy na rachunek', wn: 'Rachunek bieżący', ma: 'Kredyt' },
  { nr: 6, opis: 'Spłata raty kredytu', wn: 'Kredyt', ma: 'Rachunek bieżący' },
  { nr: 7, opis: 'Spłata odsetek od kredytu', wn: 'Koszty finansowe', ma: 'Rachunek bieżący' },
];

// ——— Suma wekslowa i odsetki dyskontowe (wzory z konspektu) ———
// Sw = Nf · 100 / (100 − d · t / 365);  Od = Sw · d · t / (100 · 365).  d w procentach rocznie, t w dniach.
export const sumaWekslowa = (nf, d, t) => (nf * 100) / (100 - (d * t) / 365);
export const odsetkiDyskontowe = (sw, d, t) => (sw * d * t) / (100 * 365);
export const WZOR1 = { nf: 4900, d: 7.3, t: 100 }; // d·t/365 = 2 → Sw = 5 000, Od = 100
export const WZOR2 = { nf: 9910, d: 10.95, t: 30 }; // d·t/365 = 0,9 → Sw = 10 000, Od = 90

// ——— Przykład 1 z konspektu: akredytywa (remont za 2 000 zł, faktura 1 845 zł w tym VAT 345 zł) ———
// Sp. rachunku bieżącego w konspekcie to „X”; przyjmujemy 10 000 zł, żeby konto dało się zamknąć.
export const KA = [
  { id: 'rb', nazwa: 'Rachunek bieżący', typ: 'A', sp: 10000 },
  { id: 'akr', nazwa: 'Akredytywa', typ: 'A' },
  { id: 'vat', nazwa: 'Rozrachunki z tytułu VAT', typ: 'A', rodzaj: 'konto rozrachunków (tu: należność od urzędu)' },
  { id: 'dost', nazwa: 'Rozrachunki z dostawcami', typ: 'P' },
  { id: 'uo', nazwa: 'Usługi obce', typ: 'K' },
];
export const OA = [
  { nr: 1, kwota: 2000, wn: 'akr', ma: 'rb', opis: 'Wyciąg bankowy: bank otworzył akredytywę, czyli odłożył 2 000 zł z rachunku na zapłatę za remont.' },
  { nr: '2.1', kwota: 1500, wn: 'uo', ma: 'dost', opis: 'Faktura za remont: wartość netto.' },
  { nr: '2.2', kwota: 345, wn: 'vat', ma: 'dost', opis: 'Faktura za remont: VAT.' },
  { nr: 3, kwota: 1845, wn: 'dost', ma: 'akr', opis: 'Wyciąg bankowy: zapłata za remont z akredytywy.' },
  { nr: 4, kwota: 155, wn: 'rb', ma: 'akr', opis: 'Wyciąg bankowy: zamknięcie akredytywy, niewykorzystana reszta wraca na rachunek.' },
];

// ——— Przykład 2 z konspektu: weksle i czeki obce ———
export const K2 = [
  { id: 'wo', nazwa: 'Weksle obce', typ: 'A', sp: 8000 },
  { id: 'co', nazwa: 'Czeki obce', typ: 'A', sp: 5000 },
  { id: 'spd', nazwa: 'Środki pieniężne w drodze', typ: 'A' },
  { id: 'rb', nazwa: 'Rachunek bieżący', typ: 'A', sp: 9000 },
  { id: 'dost', nazwa: 'Rozrachunki z dostawcami', typ: 'P', sp: 1800 },
  { id: 'kf', nazwa: 'Koszty finansowe', typ: 'K' },
];
export const O2 = [
  { nr: '1.1', kwota: 6000, wn: 'spd', ma: 'wo', opis: 'Oddano do banku weksel obcy do dyskonta (wartość nominalna).' },
  { nr: '1.2', kwota: 5000, wn: 'spd', ma: 'co', opis: 'Oddano do banku czek rozrachunkowy do realizacji.' },
  { nr: '2a.1', kwota: 5850, wn: 'rb', ma: 'spd', opis: 'Wyciąg bankowy: bank przyjął weksel do dyskonta i przelał pieniądze.' },
  { nr: '2a.2', kwota: 150, wn: 'kf', ma: 'spd', opis: 'Wyciąg bankowy: dyskonto pobrane przez bank.' },
  { nr: '2b', kwota: 5000, wn: 'rb', ma: 'spd', opis: 'Wyciąg bankowy: bank zrealizował czek obcy.' },
  { nr: '3.1', kwota: 1800, wn: 'dost', ma: 'wo', opis: 'Indos: weksel obcy przekazano dostawcy, spłacone zobowiązanie.' },
  { nr: '3.2', kwota: 200, wn: 'kf', ma: 'wo', opis: 'Indos: dyskonto, czyli różnica między wekslem a długiem.' },
];

// ——— Przykład 3 z wykładu („2.7, str. 40”): ewidencja środków pieniężnych u podatnika VAT ———
export const K3 = [
  { id: 'kasa', nazwa: 'Kasa', typ: 'A', sp: 4000 },
  { id: 'rb', nazwa: 'Rachunek bieżący', typ: 'A', sp: 20000 },
  { id: 'wo', nazwa: 'Weksle obce', typ: 'A', sp: 6000 },
  { id: 'co', nazwa: 'Czeki obce', typ: 'A', sp: 10000 },
  { id: 'spd', nazwa: 'Środki pieniężne w drodze', typ: 'A' },
  { id: 'odb', nazwa: 'Rozrachunki z odbiorcami', typ: 'A', sp: 5000 },
  { id: 'dost', nazwa: 'Rozrachunki z dostawcami', typ: 'P', sp: 11190 },
  { id: 'zw', nazwa: 'Zobowiązania wekslowe', typ: 'P', sp: 15000 },
  { id: 'vat', nazwa: 'Rozrachunki z tytułu VAT', typ: 'P', rodzaj: 'konto rozrachunków (tu: zobowiązanie wobec urzędu)' },
  { id: 'ps', nazwa: 'Przychody ze sprzedaży usług', typ: 'R' },
  { id: 'pf', nazwa: 'Przychody finansowe', typ: 'R' },
  { id: 'zm', nazwa: 'Zużycie materiałów i energii', typ: 'K' },
  { id: 'kf', nazwa: 'Koszty finansowe', typ: 'K' },
];
export const O3 = [
  { nr: '1.1', kwota: 1000, wn: 'odb', ma: 'ps', opis: 'Faktura za wykonane usługi: wartość netto.' },
  { nr: '1.2', kwota: 230, wn: 'odb', ma: 'vat', opis: 'Faktura za wykonane usługi: VAT 23%.' },
  { nr: '2.1', kwota: 1230, wn: 'wo', ma: 'odb', opis: 'Odbiorca zapłacił wekslem: spłacona należność.' },
  { nr: '2.2', kwota: 170, wn: 'wo', ma: 'pf', opis: 'Odbiorca zapłacił wekslem: dyskonto pobrane przez przedsiębiorstwo.' },
  { nr: '3.1', kwota: 5000, wn: 'spd', ma: 'wo', opis: 'Oddano do banku weksel obcy do dyskonta.' },
  { nr: '3.2', kwota: 7000, wn: 'spd', ma: 'co', opis: 'Oddano do banku czek rozrachunkowy do realizacji.' },
  { nr: '4a', kwota: 2000, wn: 'spd', ma: 'kasa', opis: 'Raport kasowy: wpłata gotówki do banku.' },
  { nr: '4b.1', kwota: 500, wn: 'zm', ma: 'kasa', opis: 'Raport kasowy: materiały biurowe do bezpośredniego zużycia, wartość netto.' },
  { nr: '4b.2', kwota: 115, wn: 'vat', ma: 'kasa', opis: 'Raport kasowy: VAT 23% z faktury za materiały biurowe.' },
  { nr: '5a', kwota: 2000, wn: 'rb', ma: 'spd', opis: 'Wyciąg bankowy: wpływ gotówki z kasy.' },
  { nr: '5b', kwota: 7000, wn: 'rb', ma: 'spd', opis: 'Wyciąg bankowy: realizacja czeku obcego.' },
  { nr: '5c.1', kwota: 4700, wn: 'rb', ma: 'spd', opis: 'Wyciąg bankowy: suma zrealizowana przez bank za weksel przyjęty do dyskonta.' },
  { nr: '5c.2', kwota: 300, wn: 'kf', ma: 'spd', opis: 'Wyciąg bankowy: dyskonto pobrane przez bank.' },
  { nr: '5d', kwota: 10000, wn: 'zw', ma: 'rb', opis: 'Wyciąg bankowy: wykup weksla własnego w terminie.' },
  { nr: '6.1', kwota: 1190, wn: 'dost', ma: 'wo', opis: 'Indos weksla obcego na dostawcę: spłacone zobowiązanie.' },
  { nr: '6.2', kwota: 210, wn: 'kf', ma: 'wo', opis: 'Indos weksla obcego na dostawcę: dyskonto.' },
];

// ——— Ćwiczenia (dane wymyślone) ———
export const KC1 = [
  { id: 'kasa', nazwa: 'Kasa', typ: 'A' }, { id: 'rb', nazwa: 'Rachunek bieżący', typ: 'A' }, { id: 'spd', nazwa: 'Środki pieniężne w drodze', typ: 'A' },
  { id: 'odb', nazwa: 'Rozrachunki z odbiorcami', typ: 'A' }, { id: 'rn', nazwa: 'Rozliczenie niedoborów, szkód i nadwyżek', typ: 'A', rodzaj: 'konto rozliczeniowe' },
  { id: 'dost', nazwa: 'Rozrachunki z dostawcami', typ: 'P' }, { id: 'prac', nazwa: 'Rozrachunki z pracownikami', typ: 'P' }, { id: 'kred', nazwa: 'Kredyt', typ: 'P' },
  { id: 'ps', nazwa: 'Przychody ze sprzedaży', typ: 'R' }, { id: 'ko', nazwa: 'Koszty operacyjne', typ: 'K' }, { id: 'kf', nazwa: 'Koszty finansowe', typ: 'K' },
];
export const OC1 = [
  { nr: 1, kwota: 3000, wn: 'kasa', ma: 'rb', opis: 'Pobrano gotówkę z banku do kasy (jeden dokument, pieniądze od razu w kasie).' },
  { nr: 2, kwota: 2600, wn: 'prac', ma: 'kasa', opis: 'Z kasy wypłacono pracownikom wynagrodzenia.' },
  { nr: 3, kwota: 900, wn: 'kasa', ma: 'odb', opis: 'Odbiorca wpłacił należność do kasy.' },
  { nr: 4, kwota: 1200, wn: 'kasa', ma: 'ps', opis: 'Sprzedaż za gotówkę.' },
  { nr: 5, kwota: 4000, wn: 'dost', ma: 'rb', opis: 'Przelewem spłacono zobowiązanie wobec dostawcy.' },
  { nr: 6, kwota: 20000, wn: 'rb', ma: 'kred', opis: 'Bank przelał na rachunek udzielony kredyt.' },
  { nr: 7, kwota: 400, wn: 'kf', ma: 'rb', opis: 'Bank pobrał z rachunku odsetki od kredytu.' },
  { nr: 8, kwota: 50, wn: 'rn', ma: 'kasa', opis: 'Przy liczeniu kasy stwierdzono niedobór gotówki.' },
  { nr: 9, kwota: 1500, wn: 'spd', ma: 'kasa', opis: 'Raport kasowy: gotówkę wpłacono do banku, wyciągu jeszcze nie ma.' },
  { nr: 10, kwota: 1500, wn: 'rb', ma: 'spd', opis: 'Wyciąg bankowy: wpływ gotówki z kasy (z operacji 9).' },
];
export const KC2 = [
  { id: 'wo', nazwa: 'Weksle obce', typ: 'A' }, { id: 'co', nazwa: 'Czeki obce', typ: 'A' }, { id: 'spd', nazwa: 'Środki pieniężne w drodze', typ: 'A' },
  { id: 'rb', nazwa: 'Rachunek bieżący', typ: 'A' }, { id: 'odb', nazwa: 'Rozrachunki z odbiorcami', typ: 'A' },
  { id: 'dost', nazwa: 'Rozrachunki z dostawcami', typ: 'P' }, { id: 'zw', nazwa: 'Zobowiązania wekslowe', typ: 'P' },
  { id: 'pf', nazwa: 'Przychody finansowe', typ: 'R' }, { id: 'ppo', nazwa: 'Pozostałe przychody operacyjne', typ: 'R' }, { id: 'kf', nazwa: 'Koszty finansowe', typ: 'K' },
];
export const OC2 = [
  { nr: '1.1', kwota: 9910, wn: 'wo', ma: 'odb', opis: 'Odbiorca zapłacił wekslem o sumie wekslowej 10 000 zł: spłacona należność.' },
  { nr: '1.2', kwota: 90, wn: 'wo', ma: 'pf', opis: 'Ten sam weksel: odsetki (dyskonto) dla nas.' },
  { nr: 2, kwota: 3000, wn: 'co', ma: 'odb', opis: 'Inny odbiorca zapłacił czekiem rozrachunkowym.' },
  { nr: 3, kwota: 3000, wn: 'spd', ma: 'co', opis: 'Czek złożono w banku do realizacji.' },
  { nr: 4, kwota: 3000, wn: 'rb', ma: 'spd', opis: 'Wyciąg bankowy: bank zrealizował czek.' },
  { nr: '5.1', kwota: 4900, wn: 'dost', ma: 'zw', opis: 'Wystawiono dostawcy weksel własny o sumie wekslowej 5 000 zł: spłacony dług.' },
  { nr: '5.2', kwota: 100, wn: 'kf', ma: 'zw', opis: 'Ten sam weksel własny: dyskonto, czyli nasz koszt.' },
  { nr: 6, kwota: 5000, wn: 'zw', ma: 'rb', opis: 'Wyciąg bankowy: wykupiono weksel własny przelewem.' },
  { nr: '7.1', kwota: 9800, wn: 'rb', ma: 'wo', opis: 'Wyciąg bankowy: bank zdyskontował weksel obcy z operacji 1 i przelał pieniądze (weksel i wyciąg tego samego dnia).' },
  { nr: '7.2', kwota: 200, wn: 'kf', ma: 'wo', opis: 'Ten sam wyciąg: dyskonto pobrane przez bank.' },
];

// ——— Kontrola przy buildzie ———
{
  const blad = (t) => { throw new Error(`pieniadze-zadania.js: ${t}`); };
  const r2 = ksieguj(K2, O2), r3 = ksieguj(K3, O3), ra = ksieguj(KA, OA);
  // środki pieniężne w drodze: wszystko, co oddano do banku, bank potwierdził wyciągiem
  if (r2.zam.spd.saldo !== 0 || r3.zam.spd.saldo !== 0) blad('środki pieniężne w drodze nie wychodzą na zero');
  if (r2.zam.wo.saldo !== 0 || r2.zam.co.saldo !== 0 || r2.zam.dost.saldo !== 0 || r2.zam.rb.saldo !== 19850 || r2.zam.kf.saldo !== 350) blad('Przykład 2 — salda');
  if (r3.zam.kasa.saldo !== 1385 || r3.zam.rb.saldo !== 23700 || r3.zam.wo.saldo !== 1000 || r3.zam.co.saldo !== 3000 || r3.zam.odb.saldo !== 5000 || r3.zam.dost.saldo !== 10000 || r3.zam.zw.saldo !== 5000 || r3.zam.vat.saldo !== 115 || r3.zam.kf.saldo !== 510 || r3.zam.pf.saldo !== 170) blad('Przykład 3 — salda');
  if (ra.zam.akr.saldo !== 0 || ra.zam.dost.saldo !== 0 || ra.zam.rb.saldo !== 8155) blad('akredytywa — salda');
  // ćwiczenia: konta nie mają Sp., więc sprawdzamy tylko, że każda operacja wskazuje istniejące konta
  for (const [K, O] of [[KC1, OC1], [KC2, OC2]]) for (const o of O) if (!K.some((k) => k.id === o.wn) || !K.some((k) => k.id === o.ma)) blad(`ćwiczenie — brak konta w operacji ${o.nr}`);
  for (const w of [WZOR1, WZOR2]) {
    const sw = sumaWekslowa(w.nf, w.d, w.t), od = odsetkiDyskontowe(sw, w.d, w.t);
    if (Math.abs(sw - Math.round(sw)) > 1e-6 || Math.abs(sw - od - w.nf) > 1e-6) blad('wzory: suma wekslowa minus odsetki ma dać należność');
  }
}
