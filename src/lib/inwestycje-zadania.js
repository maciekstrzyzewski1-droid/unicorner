// Dane modułu „Inwestycje krótkoterminowe” (kurs Rachunkowość, moduł 7). Wszystkie kwoty na stronie liczą się stąd.
// Schematy księgowań (zakup, prowizja, sprzedaż w trzech zapisach, wzrost i zmniejszenie wartości) i treści pięciu przykładów:
// konspekt z wykładu „Inwestycje krótkoterminowe”. Rozwiązań przykładów w konspekcie nie ma — księgowania według schematów
// z konspektu i art. 35 ust. 3 ustawy o rachunkowości (skutki wyceny → przychody albo koszty finansowe).
import { ksieguj } from './konta.js';

// ——— Wycena na kolejne dni bilansowe ———
// zasada: 'rynkowa' — zawsze cena rynkowa; 'ostrozna' — niższa z dwóch: cena nabycia albo cena rynkowa.
// Zwraca dla każdego dnia: wartość w księgach przed wyceną, wartość rynkową, wartość bilansową i zapis (pf / kf / brak).
export function wycena(zasada, nabycie, rynkowe) {
  let ksiegi = nabycie;
  return rynkowe.map((rynkowa) => {
    const bilansowa = zasada === 'rynkowa' ? rynkowa : Math.min(nabycie, rynkowa);
    const roznica = bilansowa - ksiegi;
    const w = { przed: ksiegi, rynkowa, bilansowa, roznica, konto: roznica > 0 ? 'pf' : roznica < 0 ? 'kf' : null, kwota: Math.abs(roznica) };
    ksiegi = bilansowa;
    return w;
  });
}

const KAF = 'Krótkoterminowe aktywa finansowe';

// ——— Schemat z wykładu (numery jak na slajdzie) ———
export const SCHEMAT = [
  { nr: '1', opis: 'Zakup papierów wartościowych', wn: KAF, ma: 'Rachunek bieżący' },
  { nr: '1a', opis: 'Prowizja maklerska przy zakupie', wn: KAF, ma: 'Rachunek bieżący' },
  { nr: '2a', opis: 'Sprzedaż: wartość w cenie sprzedaży', wn: 'Rachunek bieżący', ma: 'Przychody finansowe' },
  { nr: '2b', opis: 'Sprzedaż: wartość w cenie ewidencyjnej', wn: 'Koszty finansowe', ma: KAF },
  { nr: '2c', opis: 'Prowizja maklerska przy sprzedaży', wn: 'Koszty finansowe', ma: 'Rachunek bieżący' },
  { nr: '3', opis: 'Dzień bilansowy: wzrost wartości', wn: KAF, ma: 'Przychody finansowe' },
  { nr: '4', opis: 'Dzień bilansowy: zmniejszenie wartości', wn: 'Koszty finansowe', ma: KAF },
];

// ——— Przykład 1: zakup z prowizją i sprzedaż (ewidencja w cenie nabycia) ———
export const P1 = { sztuk: 120, cena: 10, prowizjaZakup: 120, sprzedano: 100, cenaSprzedazy: 13, prowizjaSprzedaz: 130 };
export const P1_NABYCIE = P1.sztuk * P1.cena + P1.prowizjaZakup; // 1 320
export const P1_ZA_AKCJE = P1_NABYCIE / P1.sztuk; // 11
export const K1 = [
  { id: 'rb', nazwa: 'Rachunek bieżący', typ: 'A', sp: 8000 },
  { id: 'kaf', nazwa: KAF, typ: 'A' },
  { id: 'pf', nazwa: 'Przychody finansowe', typ: 'R' },
  { id: 'kf', nazwa: 'Koszty finansowe', typ: 'K' },
];
export const O1 = [
  { nr: '1a', kwota: P1.sztuk * P1.cena, wn: 'kaf', ma: 'rb', opis: '15.05, wyciąg bankowy: zakup 120 akcji spółki A po 10 zł.' },
  { nr: '1b', kwota: P1.prowizjaZakup, wn: 'kaf', ma: 'rb', opis: '15.05: prowizja maklerska przy zakupie.' },
  { nr: '2a', kwota: P1.sprzedano * P1.cenaSprzedazy, wn: 'rb', ma: 'pf', opis: '20.07: sprzedaż 100 akcji po 13 zł, wpływ na rachunek bieżący.' },
  { nr: '2b', kwota: P1.sprzedano * P1_ZA_AKCJE, wn: 'kf', ma: 'kaf', opis: '20.07: wyksięgowanie sprzedanych akcji w cenie ewidencyjnej.' },
  { nr: '2c', kwota: P1.prowizjaSprzedaz, wn: 'kf', ma: 'rb', opis: '20.07: prowizja maklerska przy sprzedaży.' },
];

// ——— Przykład 2: ostrożna wycena, dwa pakiety akcji ———
export const P2 = [
  { id: 'q', spolka: 'Q', sztuk: 100, nabycie: 70, cenaRynkowa: 95 },
  { id: 's', spolka: 'S', sztuk: 200, nabycie: 50, cenaRynkowa: 45 },
];
// ——— Przykład 4: ceny rynkowe, dwa pakiety akcji ———
export const P4 = [
  { id: 'm', spolka: 'M', sztuk: 500, nabycie: 80, cenaRynkowa: 70 },
  { id: 'k', spolka: 'K', sztuk: 1000, nabycie: 120, cenaRynkowa: 150 },
];
// Wynik: dane pakietu (nabycie i cenaRynkowa to ceny jednej akcji) + pola z wycena() (przed, rynkowa, bilansowa to wartości pakietu).
const pakiety = (P, zasada) => P.map((p) => ({ ...p, ...wycena(zasada, p.sztuk * p.nabycie, [p.sztuk * p.cenaRynkowa])[0] }));
export const W2 = pakiety(P2, 'ostrozna');
export const W4 = pakiety(P4, 'rynkowa');
// Jedno konto „Krótkoterminowe aktywa finansowe” jak w schemacie z wykładu; pakiety akcji rozróżnia opis operacji.
const kontaPakietow = (W) => [
  { id: 'kaf', nazwa: KAF, typ: 'A', sp: W.reduce((a, p) => a + p.przed, 0) },
  { id: 'pf', nazwa: 'Przychody finansowe', typ: 'R' },
  { id: 'kf', nazwa: 'Koszty finansowe', typ: 'K' },
];
const operacjePakietow = (W) => W.filter((p) => p.konto).map((p, i) => ({
  nr: i + 1, kwota: p.kwota,
  wn: p.konto === 'pf' ? 'kaf' : 'kf', ma: p.konto === 'pf' ? 'pf' : 'kaf',
  opis: `Dzień bilansowy: akcje spółki ${p.spolka} ${p.konto === 'pf' ? 'podrożały' : 'potaniały'}, wycena ${p.konto === 'pf' ? 'w górę' : 'w dół'}.`,
}));
export const K2 = kontaPakietow(W2), O2 = operacjePakietow(W2);
export const K4 = kontaPakietow(W4), O4 = operacjePakietow(W4);

// ——— Przykłady 3 i 5: 100 akcji spółki H po 50 zł, trzy dni bilansowe; te same dane, dwie zasady wyceny ———
export const H = { sztuk: 100, nabycie: 50, dni: ['30.06', '30.09', '31.12'], ceny: [70, 30, 65] };
export const H_NABYCIE = H.sztuk * H.nabycie;
export const W3 = wycena('ostrozna', H_NABYCIE, H.ceny.map((c) => c * H.sztuk));
export const W5 = wycena('rynkowa', H_NABYCIE, H.ceny.map((c) => c * H.sztuk));
// Sp. rachunku bieżącego nie ma w treści; przyjmujemy 10 000 zł, żeby pokazać zakup.
const kontaH = () => [
  { id: 'rb', nazwa: 'Rachunek bieżący', typ: 'A', sp: 10000 },
  { id: 'kaf', nazwa: KAF, typ: 'A' },
  { id: 'pf', nazwa: 'Przychody finansowe', typ: 'R' },
  { id: 'kf', nazwa: 'Koszty finansowe', typ: 'K' },
];
const operacjeH = (W) => {
  const ops = [{ nr: 1, kwota: H_NABYCIE, wn: 'kaf', ma: 'rb', opis: '17.05: zakup 100 akcji spółki H po 50 zł.' }];
  W.forEach((w, i) => {
    if (!w.konto) return;
    ops.push({ nr: ops.length + 1, kwota: w.kwota, wn: w.konto === 'pf' ? 'kaf' : 'kf', ma: w.konto === 'pf' ? 'pf' : 'kaf', opis: `${H.dni[i]}: wycena ${w.konto === 'pf' ? 'w górę' : 'w dół'} do ${w.bilansowa} zł.` });
  });
  return ops;
};
export const K3 = kontaH(), O3 = operacjeH(W3);
// Dopowiedzenie spoza konspektu: sprzedaż wszystkich akcji w styczniu po cenie z 31.12 (do porównania obu zasad).
export const H_SPRZEDAZ = H.ceny[2] * H.sztuk;
export const lacznie = (W) => W.reduce((a, w) => a + w.roznica, 0); // łączny wpływ wycen na wynik
export const K5 = kontaH(), O5 = operacjeH(W5);

// ——— Ćwiczenia (dane wymyślone) ———
export const C1 = { sztuk: 200, cena: 25, prowizjaZakup: 100, sprzedano: 150, cenaSprzedazy: 30, prowizjaSprzedaz: 90 };
export const C1_NABYCIE = C1.sztuk * C1.cena + C1.prowizjaZakup; // 5 100
export const C1_ZA_AKCJE = C1_NABYCIE / C1.sztuk; // 25,5
export const KC = [
  { id: 'rb', nazwa: 'Rachunek bieżący', typ: 'A' }, { id: 'kaf', nazwa: KAF, typ: 'A' },
  { id: 'pf', nazwa: 'Przychody finansowe', typ: 'R' }, { id: 'kf', nazwa: 'Koszty finansowe', typ: 'K' },
];
export const OC = [
  { nr: '1a', kwota: C1.sztuk * C1.cena, wn: 'kaf', ma: 'rb', opis: 'Kupiono 200 akcji po 25 zł, zapłata z rachunku.' },
  { nr: '1b', kwota: C1.prowizjaZakup, wn: 'kaf', ma: 'rb', opis: 'Prowizja maklerska przy zakupie.' },
  { nr: '2a', kwota: C1.sprzedano * C1.cenaSprzedazy, wn: 'rb', ma: 'pf', opis: 'Sprzedano 150 akcji po 30 zł: wartość w cenie sprzedaży.' },
  { nr: '2b', kwota: C1.sprzedano * C1_ZA_AKCJE, wn: 'kf', ma: 'kaf', opis: 'Sprzedane akcje: wartość w cenie ewidencyjnej.' },
  { nr: '2c', kwota: C1.prowizjaSprzedaz, wn: 'kf', ma: 'rb', opis: 'Prowizja maklerska przy sprzedaży.' },
  { nr: 3, kwota: 200, wn: 'kaf', ma: 'pf', opis: 'Dzień bilansowy, wycena w cenach rynkowych: pozostałe akcje są warte o 200 zł więcej niż w księgach.' },
  { nr: 4, kwota: 350, wn: 'kf', ma: 'kaf', opis: 'Następny dzień bilansowy: te same akcje są warte o 350 zł mniej niż w księgach.' },
];
export const CW = { nabycie: 6000, ceny: [6800, 5200, 6300] }; // jeden pakiet, trzy dni bilansowe
export const CW_OSTR = wycena('ostrozna', CW.nabycie, CW.ceny);
export const CW_RYN = wycena('rynkowa', CW.nabycie, CW.ceny);

// ——— Kontrola przy buildzie ———
{
  const blad = (t) => { throw new Error(`inwestycje-zadania.js: ${t}`); };
  const r1 = ksieguj(K1, O1);
  if (P1_NABYCIE !== 1320 || P1_ZA_AKCJE !== 11 || r1.zam.kaf.saldo !== 220 || r1.zam.rb.saldo !== 7850 || r1.zam.pf.saldo !== 1300 || r1.zam.kf.saldo !== 1230) blad('Przykład 1');
  const r2 = ksieguj(K2, O2), r4 = ksieguj(K4, O4);
  if (W2[0].bilansowa !== 7000 || W2[1].bilansowa !== 9000 || r2.zam.kaf.saldo !== 16000 || r2.zam.kf.saldo !== 1000 || O2.length !== 1) blad('Przykład 2');
  if (W4[0].bilansowa !== 35000 || W4[1].bilansowa !== 150000 || r4.zam.kaf.saldo !== 185000 || r4.zam.kf.saldo !== 5000 || r4.zam.pf.saldo !== 30000) blad('Przykład 4');
  const r3 = ksieguj(K3, O3), r5 = ksieguj(K5, O5);
  if (JSON.stringify(W3.map((w) => w.bilansowa)) !== '[5000,3000,5000]' || r3.zam.kaf.saldo !== 5000 || r3.zam.kf.saldo !== 2000 || r3.zam.pf.saldo !== 2000) blad('Przykład 3');
  if (JSON.stringify(W5.map((w) => w.bilansowa)) !== '[7000,3000,6500]' || r5.zam.kaf.saldo !== 6500 || r5.zam.kf.saldo !== 4000 || r5.zam.pf.saldo !== 5500) blad('Przykład 5');
  // obie zasady dają ten sam łączny wynik: wyceny + sprzedaż = cena sprzedaży − cena nabycia
  for (const W of [W3, W5]) if (lacznie(W) + (H_SPRZEDAZ - W[2].bilansowa) !== H_SPRZEDAZ - H_NABYCIE) blad('porównanie zasad');
  if (!Number.isInteger(C1.sprzedano * C1_ZA_AKCJE)) blad('ćwiczenie: cena ewidencyjna');
  for (const o of OC) if (!KC.some((k) => k.id === o.wn) || !KC.some((k) => k.id === o.ma)) blad('ćwiczenie: konta');
}
