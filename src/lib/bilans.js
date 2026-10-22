// Rachunkowość — bilans w układzie z załącznika nr 1 do ustawy o rachunkowości (poziom cyfr rzymskich),
// tak jak „uproszczony bilans” z zajęć. Sumy, kapitał własny i brakujące pozycje liczone przy buildzie.
//
// Składnik: { nr, nazwa, kwota, poz, dlaczego }
//   poz: id pozycji z POZYCJE albo 'X' (nie ujmujemy w bilansie, np. leasing operacyjny)
//   kwota: liczba (strata — ujemna) albo null, gdy kwotę trzeba wyliczyć (np. kapitał podstawowy jako % kapitału własnego)
// Wyliczanie brakujących pozycji pasywów: { procenty: [{ poz, procent }], reszta: 'PA6' }
//   kapitał własny = suma aktywów − zobowiązania i rezerwy; potem pozycje z procentów; „reszta” domyka kapitał własny.

import { zl } from './konta.js';
export { zl };

// Pozycje uproszczonego bilansu z zajęć (formularz „Bilans w parach”): po stronie pasywów bez IV i VII.
export const POZYCJE = [
  { id: 'AA1', strona: 'A', sekcja: 'AA', rz: 'I', nazwa: 'Wartości niematerialne i prawne', co: 'Prawa i wiedza, których nie da się dotknąć, używane dłużej niż rok.', przyklady: 'licencje, oprogramowanie, patenty, prawo do znaku, know-how, wartość firmy' },
  { id: 'AA2', strona: 'A', sekcja: 'AA', rz: 'II', nazwa: 'Rzeczowe aktywa trwałe', co: 'Rzeczy używane w firmie dłużej niż rok — także te jeszcze w budowie.', przyklady: 'grunty (z prawem wieczystego użytkowania), budynki, maszyny, samochody, komputery, meble, środki trwałe w budowie' },
  { id: 'AA3', strona: 'A', sekcja: 'AA', rz: 'III', nazwa: 'Należności długoterminowe', co: 'Pieniądze, które inni oddadzą firmie za więcej niż 12 miesięcy — ale nie za dostawy i usługi.', przyklady: 'pożyczka dla pracownika spłacana przez 3 lata (bez celu zarobkowego), kaucja zwracana po 2 latach' },
  { id: 'AA4', strona: 'A', sekcja: 'AA', rz: 'IV', nazwa: 'Inwestycje długoterminowe', co: 'Pieniądze ulokowane na ponad 12 miesięcy od dnia bilansowego, żeby zarabiały.', przyklady: 'udziały i akcje na dłużej niż rok, obligacje z wykupem za ponad 12 miesięcy, nieruchomości na wynajem, pożyczki udzielone dla zysku z odsetek' },
  { id: 'AA5', strona: 'A', sekcja: 'AA', rz: 'V', nazwa: 'Długoterminowe rozliczenia międzyokresowe', co: 'Koszty zapłacone z góry na okres dłuższy niż rok.', przyklady: 'część czynszu zapłaconego z góry za 3 lata, która dotyczy lat po najbliższych 12 miesiącach' },
  { id: 'AB1', strona: 'A', sekcja: 'AB', rz: 'I', nazwa: 'Zapasy', co: 'Rzeczy do zużycia w produkcji albo do sprzedaży.', przyklady: 'materiały (też części zamienne, ulotki, środki czystości), produkty w toku, produkty gotowe, towary, zaliczki wpłacone na dostawy' },
  { id: 'AB2', strona: 'A', sekcja: 'AB', rz: 'II', nazwa: 'Należności krótkoterminowe', co: 'Pieniądze, które inni są winni firmie. Należności za dostawy i usługi są tu zawsze, nawet z terminem ponad 12 miesięcy.', przyklady: 'od odbiorców, od pracowników, nadpłacony podatek, należności dochodzone w sądzie' },
  { id: 'AB3', strona: 'A', sekcja: 'AB', rz: 'III', nazwa: 'Inwestycje krótkoterminowe', co: 'Pieniądze i to, co da się szybko na nie zamienić (do 12 miesięcy).', przyklady: 'gotówka w kasie, rachunek bankowy (też walutowy), lokata 3-miesięczna, obligacje z wykupem do 12 miesięcy' },
  { id: 'AB4', strona: 'A', sekcja: 'AB', rz: 'IV', nazwa: 'Krótkoterminowe rozliczenia międzyokresowe', co: 'Koszty zapłacone z góry na najbliższe miesiące.', przyklady: 'ubezpieczenie samochodu zapłacone z góry na rok' },
  { id: 'AC', strona: 'A', sekcja: 'AC', rz: '', nazwa: 'Należne wpłaty na kapitał (fundusz) podstawowy', co: 'Kapitał, który wspólnicy obiecali wpłacić, ale jeszcze nie wpłacili.', przyklady: '' },
  { id: 'AD', strona: 'A', sekcja: 'AD', rz: '', nazwa: 'Udziały (akcje) własne', co: 'Własne udziały albo akcje, które spółka odkupiła od wspólników.', przyklady: '' },
  { id: 'PA1', strona: 'P', sekcja: 'PA', rz: 'I', nazwa: 'Kapitał (fundusz) podstawowy', co: 'Kwota wkładów wspólników z umowy spółki albo statutu, wpisana do KRS. Część jeszcze niewpłacona stoi w aktywach C.', przyklady: 'kapitał zakładowy sp. z o.o. albo S.A.' },
  { id: 'PA2', strona: 'P', sekcja: 'PA', rz: 'II', nazwa: 'Kapitał (fundusz) zapasowy', co: 'Zysk z poprzednich lat, który wspólnicy uchwałą zostawili w spółce na stałe. Do tego nadwyżka ceny udziałów lub akcji ponad ich wartość nominalną.', przyklady: '' },
  { id: 'PA3', strona: 'P', sekcja: 'PA', rz: 'III', nazwa: 'Kapitał (fundusz) z aktualizacji wyceny', co: 'Wzrost wartości majątku po przeszacowaniu.', przyklady: '' },
  { id: 'PA5', strona: 'P', sekcja: 'PA', rz: 'V', nazwa: 'Zysk (strata) z lat ubiegłych', co: 'Wynik z poprzednich lat, jeszcze nierozliczony. Strata to liczba ujemna.', przyklady: 'nierozliczony zysk z lat ubiegłych, niepokryta strata z lat ubiegłych' },
  { id: 'PA6', strona: 'P', sekcja: 'PA', rz: 'VI', nazwa: 'Zysk (strata) netto', co: 'Wynik bieżącego roku. W zadaniach zwykle wychodzi jako różnica, „na domknięcie” bilansu.', przyklady: '' },
  { id: 'PB1', strona: 'P', sekcja: 'PB', rz: 'I', nazwa: 'Rezerwy na zobowiązania', co: 'Pewne albo prawie pewne przyszłe wydatki, których dokładna kwota albo termin nie są znane.', przyklady: 'rezerwy na odprawy emerytalne, na reklamacje i zażalenia klientów' },
  { id: 'PB2', strona: 'P', sekcja: 'PB', rz: 'II', nazwa: 'Zobowiązania długoterminowe', co: 'Długi do spłaty za ponad 12 miesięcy od dnia bilansowego — ale nie za dostawy i usługi.', przyklady: 'kredyt na 5 lat, wyemitowane obligacje na 3 lata' },
  { id: 'PB3', strona: 'P', sekcja: 'PB', rz: 'III', nazwa: 'Zobowiązania krótkoterminowe', co: 'Długi do spłaty w ciągu 12 miesięcy oraz wszystkie zobowiązania za dostawy i usługi.', przyklady: 'wobec dostawców, niewypłacone wynagrodzenia, podatki i ZUS do zapłaty, kredyt na 6 miesięcy' },
  { id: 'PB4', strona: 'P', sekcja: 'PB', rz: 'IV', nazwa: 'Rozliczenia międzyokresowe', co: 'Przychody, które firma już dostała, a które dotyczą przyszłych okresów. Zaliczka od klienta na dostawę tu nie trafia — to zobowiązanie krótkoterminowe.', przyklady: 'dotacja do maszyny rozliczana przez lata' },
];
export const SEKCJE = {
  AA: { strona: 'A', lit: 'A', nazwa: 'Aktywa trwałe' },
  AB: { strona: 'A', lit: 'B', nazwa: 'Aktywa obrotowe' },
  AC: { strona: 'A', lit: 'C', nazwa: 'Należne wpłaty na kapitał (fundusz) podstawowy' },
  AD: { strona: 'A', lit: 'D', nazwa: 'Udziały (akcje) własne' },
  PA: { strona: 'P', lit: 'A', nazwa: 'Kapitał (fundusz) własny' },
  PB: { strona: 'P', lit: 'B', nazwa: 'Zobowiązania i rezerwy na zobowiązania' },
};
export const POZ = Object.fromEntries(POZYCJE.map((p) => [p.id, p]));
// etykieta pozycji jak w bilansie: „A.II” (aktywa), „pasywa A.VI”
export function etykieta(id, { strona = true } = {}) {
  if (id === 'X') return 'poza bilansem';
  const p = POZ[id];
  if (!p) throw new Error(`bilans.js: nieznana pozycja „${id}”`);
  const s = SEKCJE[p.sekcja];
  const kod = p.rz ? `${s.lit}.${p.rz}` : s.lit;
  return strona ? `${p.strona === 'A' ? 'aktywa' : 'pasywa'} ${kod}` : kod;
}
// nazwa pozycji bez dopisków w nawiasach („Kapitał (fundusz) zapasowy” → „Kapitał zapasowy”) — do podpisów kroków
export const krotka = (id) => POZ[id].nazwa.replace(' (fundusz)', '').replace(' (strata)', '').replace(' (akcje)', '');
export const pelnaNazwa = (id) => (id === 'X' ? 'nie ujmujemy w bilansie' : `${etykieta(id)} ${POZ[id].nazwa}`);

const suma = (a) => a.reduce((x, y) => x + y, 0);
// „300 000 + 450 000 = 750 000”; liczby ujemne w nawiasie
const zlZ = (n) => (n < 0 ? `(${zl(n)})` : zl(n));
export const dodawanie = (liczby) => (liczby.length === 0 ? '0' : liczby.length === 1 ? zl(liczby[0]) : `${liczby.map(zlZ).join(' + ')} = ${zl(suma(liczby))}`);

export function uzupelnij(skladniki, { procenty = [], reszta = null } = {}) {
  const nr = new Set();
  for (const s of skladniki) {
    if (nr.has(s.nr)) throw new Error(`bilans.js: powtórzony numer składnika ${s.nr}`);
    nr.add(s.nr);
    if (s.poz !== 'X' && !POZ[s.poz]) throw new Error(`bilans.js: składnik ${s.nr} — nieznana pozycja ${s.poz}`);
  }
  const wBilansie = skladniki.filter((s) => s.poz !== 'X');
  const poz = Object.fromEntries(POZYCJE.map((p) => [p.id, { skl: [], kwoty: [], suma: 0 }]));
  for (const s of wBilansie) if (s.kwota != null) { poz[s.poz].skl.push(s); poz[s.poz].kwoty.push(s.kwota); }
  for (const p of POZYCJE) poz[p.id].suma = suma(poz[p.id].kwoty);
  const sek = (k) => suma(POZYCJE.filter((p) => p.sekcja === k).map((p) => poz[p.id].suma));
  const sumaA = sek('AA') + sek('AB') + sek('AC') + sek('AD');
  const sumaPB = sek('PB');
  const KW = sumaA - sumaPB;
  const wyliczone = [];
  for (const pr of procenty) {
    const k = Math.round((KW * pr.procent) / 100);
    const dokl = (KW * pr.procent) / 100;
    poz[pr.poz].kwoty.push(k); poz[pr.poz].suma += k;
    wyliczone.push({ poz: pr.poz, kwota: k, rachunek: `${zl(KW)} · ${String(pr.procent).replace('.', ',')}% = ${String(Math.round(dokl * 100) / 100).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, ' ')} ≈ ${zl(k)}` });
  }
  if (reszta) {
    if (poz[reszta].kwoty.length) throw new Error(`bilans.js: pozycja „reszta” ${reszta} ma już kwoty`);
    const inne = POZYCJE.filter((p) => p.sekcja === 'PA' && p.id !== reszta).flatMap((p) => poz[p.id].kwoty);
    const k = KW - suma(inne);
    poz[reszta].kwoty.push(k); poz[reszta].suma = k;
    wyliczone.push({ poz: reszta, kwota: k, inne, rachunek: `${zl(KW)} − (${inne.map(zlZ).join(' + ')}) = ${zl(k)}` });
  }
  const sekcje = Object.fromEntries(Object.keys(SEKCJE).map((k) => [k, sek(k)]));
  const sumaP = sekcje.PA + sekcje.PB;
  if (sumaP !== sumaA && reszta) throw new Error(`bilans.js: pasywa ${sumaP} ≠ aktywa ${sumaA}`);
  return { poz, sekcje, sumaA, sumaP, KW, sumaPB, wyliczone, poza: skladniki.filter((s) => s.poz === 'X') };
}

// Kroki animacji: każdy składnik na swoje miejsce → sumy pozycji aktywów → sumy sekcji i aktywa razem →
// pasywa obce → kapitał własny jako różnica → pozycje wyliczane → pasywa razem.
export function krokiBilansu(skladniki, opcje = {}) {
  const r = uzupelnij(skladniki, opcje);
  const kroki = [];
  for (const s of skladniki) {
    const gdzie = s.poz === 'X' ? '<b>nie ujmuje się w bilansie</b>' : `<b>${etykieta(s.poz)}</b> — ${krotka(s.poz)}`;
    const kw = s.kwota == null ? 'kwota do wyliczenia' : zl(s.kwota);
    kroki.push({ a: 'skl', nr: s.nr, poz: s.poz, html: `<b>${s.nr}. ${s.nazwa}</b> (${kw}) → ${gdzie}. ${s.dlaczego ?? ''}` });
  }
  const opisSek = (k) => POZYCJE.filter((p) => p.sekcja === k && r.poz[p.id].skl.length).map((p) => `${etykieta(p.id, { strona: false })}: ${dodawanie(r.poz[p.id].skl.map((s) => s.kwota))}`).join('; ');
  kroki.push({ a: 'sumyA', html: `<b>Sumujemy pozycje aktywów.</b> ${opisSek('AA')}; ${opisSek('AB')}. Puste pozycje zostają puste.` });
  const kA = ['AA', 'AB'].map((k) => POZYCJE.filter((p) => p.sekcja === k && r.poz[p.id].suma).map((p) => r.poz[p.id].suma));
  kroki.push({ a: 'razemA', html: `<b>Aktywa trwałe (A)</b>: ${dodawanie(kA[0])}. <b>Aktywa obrotowe (B)</b>: ${dodawanie(kA[1])}. <b>Aktywa razem</b>: ${zl(r.sekcje.AA)} + ${zl(r.sekcje.AB)} = <b>${zl(r.sumaA)}</b>.` });
  const kPB = POZYCJE.filter((p) => p.sekcja === 'PB' && r.poz[p.id].suma).map((p) => r.poz[p.id].suma);
  kroki.push({ a: 'sumyPB', html: `<b>Pasywa.</b> Pozycje kapitału własnego, które podaje treść, przepisujemy. Potem kapitał obcy (B): ${opisSek('PB')}. Razem B: ${dodawanie(kPB)}.` });
  kroki.push({ a: 'kw', html: `<b>Kapitał własny (A) jako różnica.</b> Pasywa razem muszą się równać aktywom: ${zl(r.sumaA)}. Kapitał obcy jest już policzony, więc kapitał własny = ${zl(r.sumaA)} − ${zl(r.sumaPB)} = <b>${zl(r.KW)}</b>.` });
  for (const w of r.wyliczone) {
    const czy = w.poz === opcje.reszta;
    kroki.push({ a: 'wyl', poz: w.poz, html: czy
      ? `<b>${krotka(w.poz)}</b> domyka kapitał własny: kapitał własny minus pozostałe jego pozycje. ${w.rachunek}.${w.kwota < 0 ? ' Wynik ujemny — to <b>strata</b>.' : ' Wynik dodatni — to <b>zysk</b>.'}`
      : `<b>${krotka(w.poz)}</b> to według treści zadania procent kapitału własnego: ${w.rachunek}.` });
  }
  kroki.push({ a: 'razemP', html: `<b>Sprawdzenie.</b> Pasywa razem: ${zl(r.sekcje.PA)} + ${zl(r.sekcje.PB)} = <b>${zl(r.sumaP)}</b>. Aktywa razem: <b>${zl(r.sumaA)}</b>. Równe — bilans się zgadza.` });
  return { ...r, kroki };
}
