// Wspólne pomocniki do pisania kursów językowych (hiszpański, angielski).
// Kurs to zwykły obiekt JS; Sciezka.astro importuje go jako moduł i przekazuje do start({ kurs, odznaki }), a silnik
// (src/scripts/jezyki/silnik.js) losuje z puli każdej lekcji kilka ćwiczeń przy każdym podejściu.
//
// Typy ćwiczeń (pole `t`):
//   wybor  – jedna dobra odpowiedź; dobra jest ZAWSZE pierwsza w `o`, silnik tasuje kolejność
//   wiele  – zaznacz wszystkie prawdziwe; `d` = indeksy dobrych w `o`
//   wpisz  – wpisz słowo/zdanie; `a` = akceptowane odpowiedzi (akcenty: drobna uwaga, nie błąd)
//   uloz   – ułóż zdanie z kafelków; `a` = zdanie, `extra` = kafelki-pułapki,
//            `alt` = inne poprawne szyki z tych samych kafelków (np. podmiot na końcu)
//   pary   – połącz pary; `p` = [[lewe, prawe], …]
//   kat    – posortuj do kategorii; `k` = nazwy kategorii, `e` = [[słowo, indeks albo [indeksy]], …]
//   odm    – odmień czasownik przez 6 osób; `v` = bezokolicznik, `f` = 6 form
//   luki   – tekst z lukami [[odp|inna odp]]; `bank` = słowa do wyboru (opcjonalnie)
//   sluchaj – posłuchaj (synteza mowy) i wybierz; `mow` = tekst do przeczytania, `o` jak w wybor
//   pisz   – wypowiedź własna + wzór + samoocena (nie liczy się do błędów)
//   fiszka – karta: przód `a`, tył `b` (+ przykład `ex`); „Jeszcze nie” = błąd, karta wraca na końcu lekcji
// Każde ćwiczenie może mieć: `x` (wyjaśnienie, pokazywane po sprawdzeniu — także przy dobrej
// odpowiedzi), `aw` (parametry postaci do opisu, rysuje ją src/scripts/jezyki/awatar.js),
// `kol` (próbka koloru), `reto` (numer etapu w escape roomie).

export const W = (q, o, x, ext = {}) => ({ t: 'wybor', q, o, x, ...ext });
export const WIELE = (q, o, d, x, ext = {}) => ({ t: 'wiele', q, o, d, x, ...ext });
export const P = (q, a, x, ext = {}) => ({ t: 'wpisz', q, a: [].concat(a), x, ...ext });
export const U = (q, a, x, extra = [], ext = {}) => ({ t: 'uloz', q, a, extra, x, ...ext });
export const PARY = (p, q = 'Połącz w pary', ext = {}) => ({ t: 'pary', q, p, ...ext });
export const KAT = (q, k, e, x, ext = {}) => ({ t: 'kat', q, k, e, x, ...ext });
export const LUKI = (q, tekst, bank, x, ext = {}) => ({ t: 'luki', q, tekst, bank, x, ...ext });
export const SLUCHAJ = (mow, o, x, ext = {}) => ({ t: 'sluchaj', q: 'Posłuchaj i wybierz, co słyszysz', mow, o, x, ...ext });
export const PISZ = (q, wzor, punkty, x, ext = {}) => ({ t: 'pisz', q, wzor, punkty, x, ...ext });
/** Fiszka: a = przód (w języku kursu), b = znaczenie po polsku, ex = przykład (opcjonalnie). Uczeń sam ocenia: umiem / jeszcze nie. */
export const F = (a, b, ex, ext = {}) => ({ t: 'fiszka', q: 'Pamiętasz, co to znaczy?', a, b, ex, ...ext });

/** Fragment po hiszpańsku w karcie „Nowe” — silnik dokleja do niego przycisk 🔊. */
export const es = (t) => `<span class="es" lang="es">${t}</span>`;
/** Fragment po angielsku — tak samo z przyciskiem 🔊 (silnik czyta go głosem z KURS.jezyk). */
export const en = (t) => `<span class="obcy" lang="en">${t}</span>`;

/** Mała tabela HTML do kart „Nowe” i ściąg. Komórki mogą zawierać HTML. */
export function tab(wiersze, naglowek) {
  const th = naglowek ? `<thead><tr>${naglowek.map((h) => `<th>${h}</th>`).join('')}</tr></thead>` : '';
  const tb = wiersze.map((w) => `<tr>${w.map((c) => `<td>${c}</td>`).join('')}</tr>`).join('');
  return `<table class="jz-tab">${th}<tbody>${tb}</tbody></table>`;
}

/** Ćwiczenia „połącz w pary” z listy [[es, pl], …] — po 5 par w jednym ćwiczeniu. */
export function paryZ(lista, ile = 5, q = 'Połącz słowo z tłumaczeniem') {
  const out = [];
  for (let i = 0; i < lista.length; i += ile) {
    const kawalek = lista.slice(i, i + ile);
    if (kawalek.length < 3) out[out.length - 1].p.push(...kawalek);
    else out.push(PARY(kawalek, q));
  }
  return out;
}

/** „Co znaczy …?” — trzy błędne odpowiedzi to sąsiednie słowa z tej samej listy. */
export function znaczy(lista, idx) {
  return idx.map((i) => {
    const [s, pl] = lista[i];
    const zle = [1, 2, 3].map((k) => lista[(i + k * 2) % lista.length][1]).filter((z) => z !== pl);
    return W(`Co znaczy ${es(s)}?`, [pl, ...zle], `${es(s)} = <b>${pl}</b>.`);
  });
}

/** „Jak powiesz po hiszpańsku …?” — odwrotny kierunek. */
export function jakPowiesz(lista, idx) {
  return idx.map((i) => {
    const [s, pl] = lista[i];
    const zle = [1, 2, 3].map((k) => lista[(i + k * 3) % lista.length][0]).filter((z) => z !== s);
    return W(`Jak powiesz po hiszpańsku: <b>${pl}</b>?`, [s, ...zle], `<b>${pl}</b> = ${es(s)}.`);
  });
}
