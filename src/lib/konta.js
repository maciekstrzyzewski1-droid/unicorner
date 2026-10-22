// Rachunkowość — konta księgowe w układzie teowym (konto „T”), typy operacji i bilans.
// Wszystkie liczby i podpisy kroków liczone przy buildzie — w treści modułu nie wpisujemy sum ręcznie.
//
// Konto: { id, nazwa, typ, sp? }
//   typ: 'A' — konto aktywne (składnik majątku: kasa, rachunek bankowy, towary…)
//        'P' — konto pasywne (źródło finansowania: kapitał, kredyt, zobowiązania…)
//        'K' — konto kosztów (konto wynikowe; tu tylko jako „druga strona” operacji wynikowej)
//   sp: saldo początkowe (liczba ≥ 0; strona wynika z typu: A → Wn, P → Ma)
// Operacja: { nr, opis, kwota, wn: id konta, ma: id konta }
//
// Konwencje z zajęć (arkusz „Konta bilansowe”):
// - strony konta: Wn (Winien, Dt) po lewej, Ma (Ma, Ct) po prawej;
// - numer operacji: po Wn przed kwotą „1) 1 700”, po Ma za kwotą „1 700 (1”;
// - „Obr.” = suma strony RAZEM z saldem początkowym;
// - saldo końcowe = większe obroty − mniejsze obroty; nazwa salda od strony, która przeważa (Sk Wn / Sk Ma),
//   a wpisujemy je po stronie mniejszej, żeby obie strony się zrównały; pod spodem sumy obu stron (równe).

export const NBSP = ' ';

// 1300 → „1 300” (twarda spacja, żeby liczba nie łamała się na dwie linie)
export function zl(n) {
  const s = String(Math.abs(Math.round(n))).replace(/\B(?=(\d{3})+(?!\d))/g, NBSP);
  return n < 0 ? `−${s}` : s;
}

export const NAZWA_TYPU = { A: 'aktywne', P: 'pasywne', K: 'kosztowe (wynikowe)' };
export const STRONA = { wn: 'Wn', ma: 'Ma' };

// po której stronie konta zapisujemy zwiększenie / zmniejszenie
export function stronaZmiany(typ, zmiana) {
  if (typ === 'A' || typ === 'K') return zmiana === '+' ? 'wn' : 'ma';
  if (typ === 'P') return zmiana === '+' ? 'ma' : 'wn';
  throw new Error(`konta.js: nieznany typ konta „${typ}”`);
}
// odwrotnie: zapis po danej stronie oznacza zwiększenie (+) albo zmniejszenie (−)
export function zmianaStrony(typ, strona) {
  return stronaZmiany(typ, '+') === strona ? '+' : '−';
}
export const stronaSp = (typ) => stronaZmiany(typ, '+');

function mapa(konta) {
  const m = new Map();
  for (const k of konta) {
    if (m.has(k.id)) throw new Error(`konta.js: dwa konta o id „${k.id}”`);
    m.set(k.id, k);
  }
  return m;
}

// Typ operacji z tego, które konta rosną, a które maleją.
// Zwraca 'A' | 'P' | 'AP+' | 'AP-' | 'W' (wynikowa — jedna ze stron to konto kosztów)
export function typOperacji(op, konta) {
  const m = mapa(konta);
  const kw = m.get(op.wn), km = m.get(op.ma);
  if (!kw || !km) throw new Error(`konta.js: operacja ${op.nr} — brak konta ${!kw ? op.wn : op.ma}`);
  if (kw.typ === 'K' || km.typ === 'K') return 'W';
  const zw = `${kw.typ}${zmianaStrony(kw.typ, 'wn')}`; // A+ albo P−
  const zm = `${km.typ}${zmianaStrony(km.typ, 'ma')}`; // A− albo P+
  if (zw === 'A+' && zm === 'A−') return 'A';
  if (zw === 'P−' && zm === 'P+') return 'P';
  if (zw === 'A+' && zm === 'P+') return 'AP+';
  if (zw === 'P−' && zm === 'A−') return 'AP-';
  throw new Error(`konta.js: operacja ${op.nr} — nieznany układ ${zw}/${zm}`);
}

export const OPIS_TYPU = {
  A: { nazwa: 'aktywna', skrot: 'A', suma: 'bez zmian', zdanie: 'jeden składnik aktywów rośnie, drugi maleje o tyle samo; pasywa się nie zmieniają' },
  P: { nazwa: 'pasywna', skrot: 'P', suma: 'bez zmian', zdanie: 'jeden składnik pasywów rośnie, drugi maleje o tyle samo; aktywa się nie zmieniają' },
  'AP+': { nazwa: 'aktywno-pasywna zwiększająca', skrot: 'AP+', suma: 'rośnie', zdanie: 'aktywa i pasywa rosną o tę samą kwotę' },
  'AP-': { nazwa: 'aktywno-pasywna zmniejszająca', skrot: 'AP−', suma: 'maleje', zdanie: 'aktywa i pasywa maleją o tę samą kwotę' },
  W: { nazwa: 'wynikowa', skrot: 'wynikowa', suma: '—', zdanie: 'jedna ze stron to koszt (albo przychód), czyli operacja zmienia wynik finansowy' },
};

const ZMIANA_SLOWO = { '+': 'rośnie', '−': 'maleje' };

// Jedno zdanie o koncie w operacji: „Kasa” — konto aktywne, rośnie o 4 000 → zapis po Wn.
export function zdanieKonta(k, strona, kwota) {
  const z = zmianaStrony(k.typ, strona);
  const czyje = k.typ === 'K' ? 'konto kosztów — koszt' : `konto ${NAZWA_TYPU[k.typ]},`;
  return `<b>„${k.nazwa}”</b> — ${czyje} ${ZMIANA_SLOWO[z]} o ${zl(kwota)} → zapis po stronie <b>${STRONA[strona]}</b>`;
}

// Podpis kroku dla jednej operacji (używany w animacji i w wyjaśnieniach ćwiczeń)
export function opisOperacji(op, konta) {
  const m = mapa(konta);
  const t = OPIS_TYPU[typOperacji(op, konta)];
  const typ = t.skrot === 'wynikowa' ? 'operacja <b>wynikowa</b>' : `typ <b>${t.skrot}</b> (${t.nazwa}) — ${t.zdanie}`;
  return `${zdanieKonta(m.get(op.wn), 'wn', op.kwota)}. ${zdanieKonta(m.get(op.ma), 'ma', op.kwota)}. To ${typ}.`;
}

// Zamknięcie jednego konta: obroty (z Sp, jak na zajęciach), saldo, sumy.
// wpisy: [{ nr, strona: 'wn'|'ma', kwota }]
export function zamknij(konto, wpisy) {
  const sp = konto.sp ?? 0;
  const sS = stronaSp(konto.typ);
  const wn = wpisy.filter((w) => w.strona === 'wn');
  const ma = wpisy.filter((w) => w.strona === 'ma');
  const skl = (str, lista) => [...(sp && sS === str ? [sp] : []), ...lista.map((w) => w.kwota)];
  const sklWn = skl('wn', wn), sklMa = skl('ma', ma);
  const obrWn = sklWn.reduce((a, b) => a + b, 0);
  const obrMa = sklMa.reduce((a, b) => a + b, 0);
  const saldo = Math.abs(obrWn - obrMa);
  // strona salda = strona, która przeważa; zapisujemy je po przeciwnej
  const saldoStrona = obrWn > obrMa ? 'wn' : obrMa > obrWn ? 'ma' : null;
  const wpisSalda = saldoStrona === 'wn' ? 'ma' : saldoStrona === 'ma' ? 'wn' : null;
  return { sp, spStrona: sS, sklWn, sklMa, obrWn, obrMa, saldo, saldoStrona, wpisSalda, razem: Math.max(obrWn, obrMa) };
}

const suma = (skl) => (skl.length === 0 ? '0' : skl.length === 1 ? zl(skl[0]) : `${skl.map(zl).join(' + ')} = ${zl(skl.reduce((a, b) => a + b, 0))}`);

// Słowny rachunek zamknięcia konta (do podpisów i wyjaśnień)
export function opisZamkniecia(konto, z) {
  const r = [];
  r.push(`<b>„${konto.nazwa}”</b>. Obroty Wn: ${suma(z.sklWn)}. Obroty Ma: ${suma(z.sklMa)}.`);
  if (!z.saldoStrona) r.push('Obie strony są równe — saldo końcowe wynosi 0, konto się „wyzerowało”.');
  else {
    const wieksze = z.saldoStrona === 'wn' ? z.obrWn : z.obrMa;
    const mniejsze = z.saldoStrona === 'wn' ? z.obrMa : z.obrWn;
    r.push(`Większa jest strona ${STRONA[z.saldoStrona]}, więc to <b>saldo ${STRONA[z.saldoStrona]}</b>: ${zl(wieksze)} − ${zl(mniejsze)} = <b>${zl(z.saldo)}</b>.`);
    r.push(`Wpisujemy je po stronie mniejszej (${STRONA[z.wpisSalda]}), żeby obie strony dały po ${zl(z.razem)}.`);
  }
  return r.join(' ');
}

// Księgowanie całego zadania: konta + operacje → wpisy na każdym koncie, zamknięcia, kroki do animacji, bilans zamknięcia.
// pelny: konta to cały bilans (wtedy sprawdzamy, że otwarcie i zamknięcie się bilansują); przy wycinku bilansu — false.
export function ksieguj(konta, operacje, { pelny = false } = {}) {
  const m = mapa(konta);
  const wpisy = Object.fromEntries(konta.map((k) => [k.id, []]));
  for (const op of operacje) {
    if (!(op.kwota > 0)) throw new Error(`konta.js: operacja ${op.nr} — kwota musi być dodatnia`);
    if (op.wn === op.ma) throw new Error(`konta.js: operacja ${op.nr} — to samo konto po obu stronach`);
    for (const s of ['wn', 'ma']) {
      if (!m.has(op[s])) throw new Error(`konta.js: operacja ${op.nr} — brak konta „${op[s]}”`);
      wpisy[op[s]].push({ nr: op.nr, strona: s, kwota: op.kwota });
    }
  }
  const zam = Object.fromEntries(konta.map((k) => [k.id, zamknij(k, wpisy[k.id])]));
  // saldo konta aktywnego musi wyjść po Wn, pasywnego po Ma (inaczej dane zadania są złe)
  for (const k of konta) {
    const z = zam[k.id];
    if (k.typ !== 'K' && z.saldoStrona && z.saldoStrona !== stronaSp(k.typ)) throw new Error(`konta.js: konto „${k.nazwa}” ma saldo po złej stronie — sprawdź dane`);
  }
  const bilansowe = konta.filter((k) => k.typ !== 'K');
  const sumaA0 = bilansowe.filter((k) => k.typ === 'A').reduce((a, k) => a + (k.sp ?? 0), 0);
  const sumaP0 = bilansowe.filter((k) => k.typ === 'P').reduce((a, k) => a + (k.sp ?? 0), 0);
  const aktywa = bilansowe.filter((k) => k.typ === 'A').map((k) => ({ nazwa: k.nazwa, id: k.id, kwota: zam[k.id].saldo }));
  const pasywa = bilansowe.filter((k) => k.typ === 'P').map((k) => ({ nazwa: k.nazwa, id: k.id, kwota: zam[k.id].saldo }));
  const sumaA = aktywa.reduce((a, x) => a + x.kwota, 0);
  const sumaP = pasywa.reduce((a, x) => a + x.kwota, 0);
  const tylkoBilansowe = pelny && konta.every((k) => k.typ !== 'K');
  if (tylkoBilansowe && sumaA0 !== sumaP0) throw new Error(`konta.js: bilans otwarcia się nie bilansuje (${sumaA0} ≠ ${sumaP0})`);
  if (tylkoBilansowe && sumaA !== sumaP) throw new Error(`konta.js: bilans zamknięcia się nie bilansuje (${sumaA} ≠ ${sumaP})`);
  return { wpisy, zam, aktywa, pasywa, sumaA, sumaP, sumaA0, sumaP0 };
}

// Kroki animacji „Ksiegi”: otwarcie → każda operacja → zamknięcie każdego konta → bilans zamknięcia.
export function krokiKsiegowania(konta, operacje, { bilans = true } = {}) {
  const k = ksieguj(konta, operacje, { pelny: bilans });
  const kroki = [];
  const spA = konta.filter((x) => x.typ === 'A' && x.sp).map((x) => x.nazwa);
  const spP = konta.filter((x) => x.typ === 'P' && x.sp).map((x) => x.nazwa);
  kroki.push({ a: 'otwarcie', html: `<b>Otwieramy konta.</b> Każdy składnik z bilansu dostaje swoje konto, a jego kwota to <b>saldo początkowe (Sp.)</b>. Aktywa (${spA.join(', ')}) — Sp. po stronie <b>Wn</b>. Pasywa (${spP.join(', ')}) — Sp. po stronie <b>Ma</b>. Konta bez kwoty w bilansie otwieramy puste.` });
  let sA = k.sumaA0;
  for (const op of operacje) {
    const t = typOperacji(op, konta);
    let sumaTxt = '';
    if (t === 'AP+') { sumaTxt = ` Suma bilansowa: ${zl(sA)} + ${zl(op.kwota)} = ${zl(sA + op.kwota)}.`; sA += op.kwota; }
    else if (t === 'AP-') { sumaTxt = ` Suma bilansowa: ${zl(sA)} − ${zl(op.kwota)} = ${zl(sA - op.kwota)}.`; sA -= op.kwota; }
    else if (t === 'A' || t === 'P') sumaTxt = ` Suma bilansowa bez zmian: ${zl(sA)}.`;
    kroki.push({ a: 'op', nr: op.nr, wn: op.wn, ma: op.ma, html: `<b>Operacja ${op.nr}</b> (${zl(op.kwota)}). ${opisOperacji(op, konta)}${sumaTxt}` });
  }
  for (const x of konta) kroki.push({ a: 'zamk', konto: x.id, html: opisZamkniecia(x, k.zam[x.id]) });
  if (bilans && konta.every((x) => x.typ !== 'K')) {
    kroki.push({ a: 'bilans', html: `<b>Bilans zamknięcia.</b> Saldo końcowe każdego konta przenosimy do bilansu: konta aktywne → strona aktywów, konta pasywne → strona pasywów. Aktywa: ${k.aktywa.map((x) => zl(x.kwota)).join(' + ')} = <b>${zl(k.sumaA)}</b>. Pasywa: ${k.pasywa.map((x) => zl(x.kwota)).join(' + ')} = <b>${zl(k.sumaP)}</b>. Równe — bilans się zgadza.` });
  }
  return { ...k, kroki };
}

// Wyjaśnienie, dlaczego zdarzenie jest / nie jest operacją gospodarczą — dla ćwiczeń (tekst podaje moduł).
export const KATEGORIE_ZDARZEN = ['Tylko zdarzenie', 'Operacja gospodarcza'];
export const KATEGORIE_TYPOW = ['A', 'P', 'AP+', 'AP−', 'wynikowa'];
export const indeksTypu = (t) => ({ A: 0, P: 1, 'AP+': 2, 'AP-': 3, W: 4 })[t];

// Zapis kwoty z numerem operacji tak jak na zajęciach: Wn „1) 4 000”, Ma „2 500 (2”.
export const zapis = (strona, nr, kwota) => (strona === 'wn' ? `${nr})${NBSP}${zl(kwota)}` : `${zl(kwota)}${NBSP}(${nr}`);

// Jedno konto „bez podwójnego zapisu” (jak w zad. 5.2 i 5.3): zmiany = [{ nr, kwota, zmiana: '+'|'−', opis }].
// Kroki: otwarcie → każda zmiana → obroty Wn → obroty Ma → saldo → sumy.
export function krokiJednegoKonta(konto, zmiany) {
  const wpisy = zmiany.map((z) => {
    if (z.zmiana !== '+' && z.zmiana !== '−') throw new Error(`konta.js: zmiana „${z.zmiana}” — użyj '+' albo '−' (półpauza)`);
    return { nr: z.nr, strona: stronaZmiany(konto.typ, z.zmiana), kwota: z.kwota };
  });
  const z = zamknij(konto, wpisy);
  const typ = NAZWA_TYPU[konto.typ];
  const plus = STRONA[stronaZmiany(konto.typ, '+')], minus = STRONA[stronaZmiany(konto.typ, '−')];
  const kroki = [];
  kroki.push({ a: 'otwarcie', html: `<b>Otwieramy konto „${konto.nazwa}”.</b> To konto ${typ}: zwiększenia zapisujemy po <b>${plus}</b>, zmniejszenia po <b>${minus}</b>. Saldo początkowe ${zl(z.sp)} to stan na start, więc stoi po stronie zwiększeń: „Sp. ${zl(z.sp)}” po ${plus}.` });
  zmiany.forEach((zm, i) => {
    const w = wpisy[i];
    kroki.push({ a: 'op', nr: zm.nr, html: `<b>Operacja ${zm.nr}</b>: ${zm.opis}. „${konto.nazwa}” <b>${ZMIANA_SLOWO[zm.zmiana]}</b> o ${zl(zm.kwota)}. ${zm.zmiana === '+' ? 'Zwiększenie' : 'Zmniejszenie'} konta ${NAZWA_TYPU[konto.typ] === 'aktywne' ? 'aktywnego' : 'pasywnego'} idzie na <b>${STRONA[w.strona]}</b> → wpisujemy „${zapis(w.strona, zm.nr, zm.kwota)}”.` });
  });
  const obr = (s, skl) => `<b>Obroty ${STRONA[s]}</b> — dodajemy wszystko po stronie ${STRONA[s]}${skl.length && z.sp && z.spStrona === s ? ' (razem z Sp.)' : ''}: ${suma(skl)}.`;
  kroki.push({ a: 'obr', strona: 'wn', html: obr('wn', z.sklWn) });
  kroki.push({ a: 'obr', strona: 'ma', html: obr('ma', z.sklMa) });
  if (z.saldoStrona) {
    const [wi, mn] = z.saldoStrona === 'wn' ? [z.obrWn, z.obrMa] : [z.obrMa, z.obrWn];
    kroki.push({ a: 'sk', html: `<b>Saldo końcowe.</b> Porównujemy obroty: ${zl(z.obrWn)} po Wn i ${zl(z.obrMa)} po Ma. Przeważa ${STRONA[z.saldoStrona]}, więc to <b>saldo ${STRONA[z.saldoStrona]}</b> (Sk ${STRONA[z.saldoStrona]}): ${zl(wi)} − ${zl(mn)} = <b>${zl(z.saldo)}</b>. Wpisujemy je po stronie mniejszej, czyli ${STRONA[z.wpisSalda]}.` });
    const mnSkl = z.wpisSalda === 'wn' ? z.obrWn : z.obrMa;
    kroki.push({ a: 'razem', html: `<b>Sprawdzenie.</b> Strona ${STRONA[z.wpisSalda]}: ${zl(mnSkl)} + ${zl(z.saldo)} = ${zl(z.razem)} — tyle samo co ${STRONA[z.saldoStrona]}. Obie strony równe, konto zamknięte. <b>Stan na koniec: ${zl(z.saldo)} zł.</b>` });
  } else {
    kroki.push({ a: 'sk', html: `<b>Saldo końcowe.</b> Obie strony mają po ${zl(z.obrWn)}, więc saldo wynosi 0.` });
  }
  return { wpisy, zam: z, kroki };
}
