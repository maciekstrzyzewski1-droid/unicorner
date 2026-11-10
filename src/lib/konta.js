// Rachunkowość — konta księgowe w układzie teowym (konto „T”), typy operacji i bilans.
// Wszystkie liczby i podpisy kroków liczone przy buildzie — w treści modułu nie wpisujemy sum ręcznie.
//
// Konto: { id, nazwa, typ, sp? }
//   typ: 'A' — konto aktywne (składnik majątku: kasa, rachunek bankowy, towary…)
//        'P' — konto pasywne (źródło finansowania: kapitał, kredyt, zobowiązania…)
//        'K' — konto kosztów (konto wynikowe): koszt rośnie po Wn, saldo Wn albo 0
//        'R' — konto przychodów (konto wynikowe): przychód rośnie po Ma, saldo Ma albo 0
//   sp: saldo początkowe (liczba ≥ 0; strona wynika z typu: A → Wn, P → Ma)
//   ujemne: true — pasywo „na minusie” (strata z lat ubiegłych): typ 'P', ale saldo stoi po Wn,
//           strata rośnie po Wn, maleje po Ma, a w bilansie wchodzi do pasywów ze znakiem minus
//   wynik: true — konto „Wynik finansowy” (typ 'P'): koszty przenosimy na Wn, przychody na Ma;
//          saldo Ma = zysk, saldo Wn = strata; w bilansie pasywa ze znakiem (strata z minusem)
//   obciazenie: true — konto 'K', które nie jest kosztem działalności, tylko obciąża wynik (podatek dochodowy)
//   rodzaj: podpis typu pod nazwą konta (zastępuje domyślny), bil: nazwa w bilansie zamknięcia (np. „Zysk netto”)
// Operacja: { nr, opis, kwota, wn: id konta, ma: id konta, h?: własny podpis kroku (HTML) }
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

export const NAZWA_TYPU = { A: 'aktywne', P: 'pasywne', K: 'kosztowe (wynikowe)', R: 'przychodowe (wynikowe)' };
export const TYP_DOP = { A: 'aktywnego', P: 'pasywnego', K: 'kosztów', R: 'przychodów' };
export const STRONA = { wn: 'Wn', ma: 'Ma' };
export const wynikowe = (k) => k.typ === 'K' || k.typ === 'R';

// po której stronie konta zapisujemy zwiększenie / zmniejszenie
export function stronaZmiany(typ, zmiana) {
  if (typ === 'A' || typ === 'K') return zmiana === '+' ? 'wn' : 'ma';
  if (typ === 'P' || typ === 'R') return zmiana === '+' ? 'ma' : 'wn';
  throw new Error(`konta.js: nieznany typ konta „${typ}”`);
}
// odwrotnie: zapis po danej stronie oznacza zwiększenie (+) albo zmniejszenie (−)
export function zmianaStrony(typ, strona) {
  return stronaZmiany(typ, '+') === strona ? '+' : '−';
}
export const stronaSp = (typ) => stronaZmiany(typ, '+');
// to samo dla konkretnego konta (konto straty ma saldo po Wn, choć jest pasywne)
export const spStrona = (k) => (k.ujemne ? 'wn' : stronaSp(k.typ));
export const plusStrona = (k) => (k.ujemne ? 'wn' : stronaZmiany(k.typ, '+'));
export const typKonta = (k) => k.rodzaj ?? (k.typ === 'K' ? 'konto kosztów' : k.typ === 'R' ? 'konto przychodów' : k.wynik ? 'konto wyniku' : k.ujemne ? 'pasywa na minusie' : `konto ${NAZWA_TYPU[k.typ]}`);

function mapa(konta) {
  const m = new Map();
  for (const k of konta) {
    if (m.has(k.id)) throw new Error(`konta.js: dwa konta o id „${k.id}”`);
    m.set(k.id, k);
  }
  return m;
}

// Typ operacji z tego, które konta rosną, a które maleją.
// Zwraca 'A' | 'P' | 'AP+' | 'AP-' | 'W' (wynikowa — jedna ze stron to konto kosztów albo przychodów)
//   | 'Z' (przeksięgowanie salda konta wynikowego na konto wyniku finansowego)
export function typOperacji(op, konta) {
  const m = mapa(konta);
  const kw = m.get(op.wn), km = m.get(op.ma);
  if (!kw || !km) throw new Error(`konta.js: operacja ${op.nr} — brak konta ${!kw ? op.wn : op.ma}`);
  if (kw.wynik || km.wynik) {
    const inne = kw.wynik ? km : kw;
    if (!wynikowe(inne)) throw new Error(`konta.js: operacja ${op.nr} — na konto wyniku przenosimy tylko koszty i przychody`);
    if ((inne.typ === 'K') !== Boolean(kw.wynik)) throw new Error(`konta.js: operacja ${op.nr} — koszty przenosimy na Wn wyniku, przychody na Ma`);
    return 'Z';
  }
  if (wynikowe(kw) || wynikowe(km)) return 'W';
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
  Z: { nazwa: 'przeksięgowanie', skrot: 'przeks.', suma: '—', zdanie: 'saldo konta kosztów albo przychodów przenosimy na konto wyniku finansowego' },
};

const ZMIANA_SLOWO = { '+': 'rośnie', '−': 'maleje' };

// Jedno zdanie o koncie w operacji: „Kasa” — konto aktywne, rośnie o 4 000 → zapis po Wn.
export function zdanieKonta(k, strona, kwota) {
  if (k.ujemne) {
    const rosnie = strona === 'wn';
    return `<b>„${k.nazwa}”</b> — strata (pasywa na minusie) ${rosnie ? 'rośnie' : 'maleje'} o ${zl(kwota)}, więc pasywa ${rosnie ? 'maleją' : 'rosną'} → zapis po stronie <b>${STRONA[strona]}</b>`;
  }
  const z = zmianaStrony(k.typ, strona);
  const czyje = k.obciazenie ? `${k.rodzaj ?? 'obciążenie wyniku'} —` : k.typ === 'K' ? 'konto kosztów — koszt' : k.typ === 'R' ? 'konto przychodów — przychód' : `konto ${NAZWA_TYPU[k.typ]},`;
  return `<b>„${k.nazwa}”</b> — ${czyje} ${ZMIANA_SLOWO[z]} o ${zl(kwota)} → zapis po stronie <b>${STRONA[strona]}</b>`;
}

// Podpis przeksięgowania: saldo konta wynikowego przechodzi na konto wyniku finansowego
function opisPrzeksiegowania(op, m) {
  const kw = m.get(op.wn), km = m.get(op.ma);
  const wf = kw.wynik ? kw : km, x = kw.wynik ? km : kw;
  const k = zl(op.kwota);
  if (x.typ === 'R') return `Zamykamy konto <b>„${x.nazwa}”</b>. Ma saldo Ma ${k}. Zapis ${k} po stronie <b>Wn</b> zeruje to konto. Ta sama kwota trafia na <b>Ma</b> „${wf.nazwa}” — przychody zbieramy po Ma. To <b>przeksięgowanie</b>, a nie nowa operacja.`;
  return `Zamykamy konto <b>„${x.nazwa}”</b>. Ma saldo Wn ${k}. Zapis ${k} po stronie <b>Ma</b> zeruje to konto. Ta sama kwota trafia na <b>Wn</b> „${wf.nazwa}” — ${x.obciazenie ? 'podatek, tak jak koszty, zmniejsza wynik' : 'koszty zbieramy po Wn'}. To <b>przeksięgowanie</b>, a nie nowa operacja.`;
}

// Podpis kroku dla jednej operacji (używany w animacji i w wyjaśnieniach ćwiczeń)
export function opisOperacji(op, konta) {
  if (op.h) return op.h;
  const m = mapa(konta);
  const typ0 = typOperacji(op, konta);
  if (typ0 === 'Z') return opisPrzeksiegowania(op, m);
  const t = OPIS_TYPU[typ0];
  const typ = t.skrot === 'wynikowa' ? 'operacja <b>wynikowa</b>' : `typ <b>${t.skrot}</b> (${t.nazwa}) — ${t.zdanie}`;
  return `${zdanieKonta(m.get(op.wn), 'wn', op.kwota)}. ${zdanieKonta(m.get(op.ma), 'ma', op.kwota)}. To ${typ}.`;
}

// Zamknięcie jednego konta: obroty (z Sp, jak na zajęciach), saldo, sumy.
// wpisy: [{ nr, strona: 'wn'|'ma', kwota }]
export function zamknij(konto, wpisy) {
  const sp = konto.sp ?? 0;
  const sS = spStrona(konto);
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
    if (wynikowe(konto)) r.push('Saldo konta wynikowego tylko liczymy, nie wpisujemy go na konto. Konto zamknie przeksięgowanie na wynik finansowy.');
    else r.push(`Wpisujemy je po stronie mniejszej (${STRONA[z.wpisSalda]}), żeby obie strony dały po ${zl(z.razem)}.`);
  }
  if (wynikowe(konto) && !z.saldoStrona && (z.obrWn || z.obrMa)) r.push('Konto wynikowe zamknęło przeksięgowanie na wynik finansowy — do bilansu nie wchodzi.');
  if (konto.wynik && z.saldoStrona) r.push(z.saldoStrona === 'ma' ? `Saldo Ma konta wyniku to <b>zysk netto: ${zl(z.saldo)}</b>.` : `Saldo Wn konta wyniku to <b>strata netto: ${zl(z.saldo)}</b>.`);
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
  // saldo konta aktywnego (i kosztów) musi wyjść po Wn, pasywnego (i przychodów) po Ma — inaczej dane zadania są złe;
  // konto wyniku może mieć saldo po obu stronach (zysk albo strata)
  for (const k of konta) {
    const z = zam[k.id];
    if (!k.wynik && z.saldoStrona && z.saldoStrona !== spStrona(k)) throw new Error(`konta.js: konto „${k.nazwa}” ma saldo po złej stronie — sprawdź dane`);
    if (wynikowe(k) && k.sp) throw new Error(`konta.js: konto wynikowe „${k.nazwa}” nie ma salda początkowego`);
  }
  const bilansowe = konta.filter((k) => !wynikowe(k));
  const sumaA0 = bilansowe.filter((k) => k.typ === 'A').reduce((a, k) => a + (k.sp ?? 0), 0);
  const sumaP0 = bilansowe.filter((k) => k.typ === 'P').reduce((a, k) => a + (k.ujemne ? -1 : 1) * (k.sp ?? 0), 0);
  const aktywa = bilansowe.filter((k) => k.typ === 'A').map((k) => ({ nazwa: k.bil ?? k.nazwa, id: k.id, kwota: zam[k.id].saldo }));
  // pasywo z saldem po Wn (strata z lat ubiegłych, strata netto) wchodzi do bilansu z minusem
  const pasywa = bilansowe.filter((k) => k.typ === 'P').map((k) => ({ nazwa: k.bil ?? k.nazwa, id: k.id, kwota: (zam[k.id].saldoStrona === 'wn' ? -1 : 1) * zam[k.id].saldo }));
  const sumaA = aktywa.reduce((a, x) => a + x.kwota, 0);
  const sumaP = pasywa.reduce((a, x) => a + x.kwota, 0);
  // bilans sprawdzamy, gdy wszystkie konta wynikowe są już zamknięte (saldo 0) — wtedy cały wynik siedzi na koncie wyniku
  const tylkoBilansowe = pelny && konta.every((k) => !wynikowe(k) || zam[k.id].saldo === 0);
  if (tylkoBilansowe && sumaA0 !== sumaP0) throw new Error(`konta.js: bilans otwarcia się nie bilansuje (${sumaA0} ≠ ${sumaP0})`);
  if (tylkoBilansowe && sumaA !== sumaP) throw new Error(`konta.js: bilans zamknięcia się nie bilansuje (${sumaA} ≠ ${sumaP})`);
  return { wpisy, zam, aktywa, pasywa, sumaA, sumaP, sumaA0, sumaP0 };
}

// Kroki animacji „Ksiegi”: otwarcie → każda operacja → zamknięcie każdego konta → bilans zamknięcia.
export function krokiKsiegowania(konta, operacje, { bilans = true } = {}) {
  const k = ksieguj(konta, operacje, { pelny: bilans });
  const kroki = [];
  const spA = konta.filter((x) => x.typ === 'A' && x.sp).map((x) => x.nazwa);
  const spP = konta.filter((x) => x.typ === 'P' && !x.ujemne && x.sp).map((x) => x.nazwa);
  const spU = konta.filter((x) => x.ujemne && x.sp).map((x) => x.nazwa);
  const uTxt = spU.length ? ` ${spU.join(', ')} to pasywo ze znakiem minus — jego Sp. stoi po stronie <b>Wn</b>.` : '';
  const maK = konta.some((x) => x.typ === 'K'), maR = konta.some((x) => x.typ === 'R'), maW = konta.some((x) => x.wynik);
  const wTxt = maK || maR ? ` Konta ${maK && maR ? 'kosztów i przychodów' : maK ? 'kosztów' : 'przychodów'}${maW ? ' oraz konto wyniku' : ''} też startują puste — nie mają salda początkowego.` : '';
  kroki.push({ a: 'otwarcie', html: `<b>Otwieramy konta.</b> Każdy składnik z bilansu dostaje swoje konto, a jego kwota to <b>saldo początkowe (Sp.)</b>. Aktywa (${spA.join(', ')}) — Sp. po stronie <b>Wn</b>. Pasywa (${spP.join(', ')}) — Sp. po stronie <b>Ma</b>.${uTxt} Konta bez kwoty w bilansie otwieramy puste.${wTxt}` });
  let sA = k.sumaA0;
  for (const op of operacje) {
    const t = typOperacji(op, konta);
    let sumaTxt = '';
    if (t === 'AP+') { sumaTxt = ` Suma bilansowa: ${zl(sA)} + ${zl(op.kwota)} = ${zl(sA + op.kwota)}.`; sA += op.kwota; }
    else if (t === 'AP-') { sumaTxt = ` Suma bilansowa: ${zl(sA)} − ${zl(op.kwota)} = ${zl(sA - op.kwota)}.`; sA -= op.kwota; }
    else if (t === 'A' || t === 'P') sumaTxt = ` Suma bilansowa bez zmian: ${zl(sA)}.`;
    kroki.push({ a: 'op', nr: op.nr, wn: op.wn, ma: op.ma, html: `<b>${t === 'Z' ? 'Przeksięgowanie' : 'Operacja'} ${op.nr}</b> (${zl(op.kwota)}). ${opisOperacji(op, konta)}${sumaTxt}${op.dopisek ?? ''}` });
  }
  for (const x of konta) kroki.push({ a: 'zamk', konto: x.id, html: opisZamkniecia(x, k.zam[x.id]) });
  if (bilans && konta.every((x) => !wynikowe(x) || k.zam[x.id].saldo === 0)) {
    const zlN = (n) => (n < 0 ? `(${zl(n)})` : zl(n));
    const minus = konta.some((x) => x.ujemne) ? ' Strata wchodzi do pasywów z minusem.' : '';
    const wf = konta.find((x) => x.wynik);
    const wfTxt = wf ? ` Konta kosztów i przychodów mają saldo 0, więc do bilansu nie wchodzą. Saldo konta „${wf.nazwa}” trafia do pasywów jako „${wf.bil ?? wf.nazwa}”.` : '';
    kroki.push({ a: 'bilans', html: `<b>Bilans zamknięcia.</b> Saldo końcowe każdego konta przenosimy do bilansu: konta aktywne → strona aktywów, konta pasywne → strona pasywów.${minus}${wfTxt} Aktywa: ${k.aktywa.map((x) => zlN(x.kwota)).join(' + ')} = <b>${zl(k.sumaA)}</b>. Pasywa: ${k.pasywa.map((x) => zlN(x.kwota)).join(' + ')} = <b>${zl(k.sumaP)}</b>. Równe — bilans się zgadza.` });
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
    kroki.push({ a: 'op', nr: zm.nr, html: `<b>Operacja ${zm.nr}</b>: ${zm.opis}. Konto „${konto.nazwa}” <b>${ZMIANA_SLOWO[zm.zmiana]}</b> o ${zl(zm.kwota)}. ${zm.zmiana === '+' ? 'Zwiększenie' : 'Zmniejszenie'} konta ${TYP_DOP[konto.typ]} zapisujemy po stronie <b>${STRONA[w.strona]}</b> → „${zapis(w.strona, zm.nr, zm.kwota)}”.` });
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

// Zestawienie obrotów i sald (ZOiS) — jak arkusz z zajęć (Zad. 5.5):
// saldo początkowe (Wn, Ma) | obroty za okres (Wn, Ma) — same operacje, BEZ Sp. | obroty narastająco (Wn, Ma) — Sp. + obroty
// okresu, czyli to samo co „Obr.” na koncie | saldo końcowe (Wn, Ma). Wiersz „Razem” — w każdej parze Wn = Ma.
// Zwraca wiersze z liczbami i z wyjaśnieniem każdej kratki (do klikania i do ćwiczeń).
export const KOLUMNY_ZOIS = [
  { id: 'sp', nazwa: 'Saldo początkowe', skrot: 'Sp.' },
  { id: 'ob', nazwa: 'Obroty za okres', skrot: 'Obroty' },
  { id: 'na', nazwa: 'Obroty narastająco', skrot: 'Narast.' },
  { id: 'sk', nazwa: 'Saldo końcowe', skrot: 'Sk' },
];
export function zestawienie(konta, operacje, { okres = 'okres' } = {}) {
  const k = ksieguj(konta, operacje);
  const dod = (l) => (l.length === 0 ? '0' : l.length === 1 ? zl(l[0]) : `${l.map(zl).join(' + ')} = ${zl(l.reduce((a, b) => a + b, 0))}`);
  const wiersze = konta.map((x, i) => {
    const z = k.zam[x.id];
    const w = k.wpisy[x.id];
    const v = { sp: { wn: 0, ma: 0 }, ob: { wn: 0, ma: 0 }, na: { wn: z.obrWn, ma: z.obrMa }, sk: { wn: 0, ma: 0 } };
    v.sp[z.spStrona] = z.sp;
    for (const s of ['wn', 'ma']) v.ob[s] = w.filter((e) => e.strona === s).reduce((a, e) => a + e.kwota, 0);
    if (z.saldoStrona) v.sk[z.saldoStrona] = z.saldo;
    if (v.na.wn !== v.sp.wn + v.ob.wn || v.na.ma !== v.sp.ma + v.ob.ma) throw new Error(`konta.js: ZOiS „${x.nazwa}” — narastająco ≠ Sp. + obroty`);
    const nz = `<b>„${x.nazwa}”</b>`;
    const czyje = x.ujemne ? 'Strata z lat ubiegłych to pasywo ze znakiem minus, więc jej saldo stoi po Wn.' : x.typ === 'A' ? 'To konto aktywne, więc saldo początkowe stoi po Wn.' : 'To konto pasywne, więc saldo początkowe stoi po Ma.';
    const d = { sp: {}, ob: {}, na: {}, sk: {} };
    for (const s of ['wn', 'ma']) {
      const S = STRONA[s];
      d.sp[s] = z.sp
        ? (z.spStrona === s ? `${nz}, Sp. ${S}: przepisujemy saldo z bilansu otwarcia — <b>${zl(z.sp)}</b>. ${czyje}` : `${nz}, Sp. ${S}: <b>0</b>. ${czyje} Po ${S} nie ma nic.`)
        : `${nz}, Sp. ${S}: <b>0</b>. Tego składnika nie było w bilansie otwarcia, konto otwieramy bez Sp.`;
      const ws = w.filter((e) => e.strona === s);
      d.ob[s] = ws.length
        ? `${nz}, obroty ${S} za ${okres}: dodajemy wpisy po ${S} <b>bez Sp.</b> — ${ws.map((e) => zapis(s, e.nr, e.kwota)).join('; ')}. Razem: ${dod(ws.map((e) => e.kwota))}.`
        : `${nz}, obroty ${S} za ${okres}: <b>0</b>. W tym okresie nic nie zapisano po ${S}.`;
      d.na[s] = `${nz}, obroty ${S} narastająco: Sp. ${S} + obroty ${S} za ${okres} = ${zl(v.sp[s])} + ${zl(v.ob[s])} = <b>${zl(v.na[s])}</b>. To ta sama liczba co „Obr.” po ${S} na koncie.`;
      if (!z.saldoStrona) d.sk[s] = `${nz}, saldo końcowe: narastająco Wn i Ma są równe (${zl(z.obrWn)} i ${zl(z.obrMa)}), więc saldo wynosi <b>0</b> w obu kolumnach.`;
      else if (z.saldoStrona === s) {
        const [wi, mn] = s === 'wn' ? [z.obrWn, z.obrMa] : [z.obrMa, z.obrWn];
        d.sk[s] = `${nz}, saldo końcowe ${S}: większe narastająco minus mniejsze = ${zl(wi)} − ${zl(mn)} = <b>${zl(z.saldo)}</b>. Przeważa ${S}, więc liczba stoi w kolumnie ${S}. Na koncie to „Sk ${S}”, wpisane po stronie mniejszej (${STRONA[z.wpisSalda]}).`;
      } else d.sk[s] = `${nz}, saldo końcowe ${S}: <b>0</b>. Saldo wyszło po ${STRONA[z.saldoStrona]} (${zl(z.saldo)}), więc w kolumnie ${S} jest zero.`;
    }
    return { lp: i + 1, konto: x, v, d, wpisy: w };
  });
  const razem = {};
  for (const c of KOLUMNY_ZOIS) {
    razem[c.id] = {};
    for (const s of ['wn', 'ma']) razem[c.id][s] = wiersze.reduce((a, r) => a + r.v[c.id][s], 0);
    if (razem[c.id].wn !== razem[c.id].ma) throw new Error(`konta.js: ZOiS — „${c.nazwa}” Wn ${razem[c.id].wn} ≠ Ma ${razem[c.id].ma}`);
  }
  const dRazem = {};
  for (const c of KOLUMNY_ZOIS) {
    dRazem[c.id] = {};
    for (const s of ['wn', 'ma']) {
      const l = wiersze.map((r) => r.v[c.id][s]).filter((n) => n);
      dRazem[c.id][s] = `<b>Razem, ${c.nazwa.toLowerCase()} ${STRONA[s]}</b>: dodajemy całą kolumnę — ${dod(l)}. Musi wyjść tyle samo co w kolumnie ${STRONA[s === 'wn' ? 'ma' : 'wn']} obok: ${zl(razem[c.id][s === 'wn' ? 'ma' : 'wn'])}.`;
    }
  }
  return { ...k, wiersze, razem, dRazem };
}

// ——— Konta wynikowe i wynik finansowy (moduł „Konta wynikowe i wynik finansowy”) ———

// Rachunek wyniku z sald kont wynikowych PRZED przeksięgowaniem: przychody (R) i koszty (K bez obciążeń wyniku, np. podatku).
export function rachunekWyniku(konta, operacje) {
  const k = ksieguj(konta, operacje);
  const lista = (f) => konta.filter(f).map((x) => ({ id: x.id, nazwa: x.nazwa, kwota: k.zam[x.id].saldo })).filter((x) => x.kwota);
  const przychody = lista((x) => x.typ === 'R');
  const koszty = lista((x) => x.typ === 'K' && !x.obciazenie);
  const sumaP = przychody.reduce((a, x) => a + x.kwota, 0);
  const sumaK = koszty.reduce((a, x) => a + x.kwota, 0);
  return { przychody, koszty, sumaP, sumaK, brutto: sumaP - sumaK, zam: k.zam };
}

// Podatek dochodowy jak w zadaniach z zajęć: stawka % od zysku brutto, do pełnych złotych; przy stracie 0.
export const podatekDochodowy = (brutto, stawka = 19) => (brutto > 0 ? Math.round((brutto * stawka) / 100) : 0);

// Przeksięgowania na koniec okresu: saldo każdego konta wynikowego (z listy `ids` albo wszystkich) przenosimy na konto wyniku.
// Przychody: Wn konto przychodów / Ma wynik. Koszty (i podatek): Wn wynik / Ma konto kosztów. Numery P1, P2, … (od `od`).
// Kolejność: najpierw przychody, potem koszty — w kolejności kont na liście.
export function przeksiegowania(konta, operacje, { od = 1, prefiks = 'P', ids } = {}) {
  const wf = konta.find((x) => x.wynik);
  if (!wf) throw new Error('konta.js: przeksięgowania — brak konta wyniku (wynik: true)');
  const k = ksieguj(konta, operacje);
  const wyb = konta.filter((x) => wynikowe(x) && (!ids || ids.includes(x.id)) && k.zam[x.id].saldo !== 0);
  const kolejne = [...wyb.filter((x) => x.typ === 'R'), ...wyb.filter((x) => x.typ === 'K')];
  return kolejne.map((x, i) => {
    const kwota = k.zam[x.id].saldo;
    const nr = `${prefiks}${od + i}`;
    return x.typ === 'R'
      ? { nr, kwota, wn: x.id, ma: wf.id, opis: `Saldo „${x.nazwa}” przenosimy na wynik finansowy.` }
      : { nr, kwota, wn: wf.id, ma: x.id, opis: `Saldo „${x.nazwa}” przenosimy na wynik finansowy.` };
  });
}
