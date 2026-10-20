// Wersja wzoru na telefon (wąska, tm) — wspólna dla modułów z rachunkiem (Rachunek.astro pokazuje tm, gdy kontener ma < 600 px).
// Długi łańcuch w jednej linii nie mieści się na 390 px. Wąska wersja (tm) dzieli go na wiersze:
// przed każdym ⟺ / ⇒ (gdy są), a gdy ich nie ma — przed każdym „=” (o ile linia nie jest listą z przecinkami).
// dl() to zgrubna szerokość wzoru w „znakach” — dzielimy tylko linie, które naprawdę się nie mieszczą.
const grupa = (s, i) => { let g = 0, j = i; do { if (s[j] === '{') g++; else if (s[j] === '}') g--; j++; } while (g > 0 && j < s.length); return j; };
export function dl(s) {
  let n = 0, i = 0;
  while (i < s.length) {
    const r = s.slice(i);
    let m;
    if ((m = r.match(/^\\c[FGHKR]\{/))) { const j = grupa(s, i + m[0].length - 1); n += dl(s.slice(i + m[0].length, j - 1)); i = j; continue; }
    if ((m = r.match(/^\\[td]?frac(?=\{)/))) {
      const j1 = grupa(s, i + m[0].length), j2 = grupa(s, j1);
      n += Math.max(dl(s.slice(i + m[0].length + 1, j1 - 1)), dl(s.slice(j1 + 1, j2 - 1))) * (m[0] === '\\tfrac' ? 0.75 : 0.85) + 0.4; i = j2; continue;
    }
    if ((m = r.match(/^\\frac(\w)(\w)/))) { n += 1.2; i += m[0].length; continue; }
    if ((m = r.match(/^[\^_]\{/))) { const j = grupa(s, i + 1); n += 0.65 * dl(s.slice(i + 2, j - 1)); i = j; continue; }
    if ((m = r.match(/^[\^_]\\?\w/))) { n += 0.6; i += m[0].length; continue; }
    if ((m = r.match(/^\\text\{/))) { const j = grupa(s, i + 5); n += 0.85 * (j - i - 7); i = j; continue; }
    if ((m = r.match(/^\\begin\{cases\}([\s\S]*?)\\end\{cases\}/))) { n += 1.5 + Math.max(...m[1].split('\\\\').map((w) => dl(w.replace(/&/g, '')))); i += m[0].length; continue; }
    if ((m = r.match(/^\\(iff|Longleftrightarrow)/))) { n += 3.4; i += m[0].length; continue; }
    if ((m = r.match(/^\\(Rightarrow|to)/))) { n += 2.6; i += m[0].length; continue; }
    if ((m = r.match(/^\\(quad)/))) { n += 2; i += m[0].length; continue; }
    if ((m = r.match(/^\\(cdot|leq|geq|neq|colon)/))) { n += 1.8; i += m[0].length; continue; }
    if ((m = r.match(/^\\(ln|det|sin|cos)/))) { n += 1.7; i += m[0].length; continue; }
    if ((m = r.match(/^\\(left|right)/))) { n += 0.5; i += m[0].length; continue; }
    if ((m = r.match(/^\\[a-zA-Z]+/))) { n += 1; i += m[0].length; continue; }
    if ((m = r.match(/^\\./))) { n += 0.4; i += 2; continue; }
    const c = s[i];
    if (c === '=' || c === '<' || c === '>') n += 2;
    else if (c === '+' || c === '-') n += 1.7;
    else if (c === ',') n += 0.8;
    else if (c === '(' || c === ')' || c === '|') n += 0.55;
    else if (/[\s{}&]/.test(c)) n += 0;
    else n += 1;
    i++;
  }
  return n;
}
// pozycje znaków relacji na najwyższym poziomie (poza {…} i \left…\right)
function relacje(s) {
  const out = []; let g = 0, lr = 0;
  for (let i = 0; i < s.length; i++) {
    const r = s.slice(i);
    if (s[i] === '{') g++;
    else if (s[i] === '}') g--;
    else if (r.startsWith('\\left')) lr++;
    else if (r.startsWith('\\right')) lr--;
    if (g || lr) continue;
    const m = r.match(/^(\\iff|\\Rightarrow)(?![a-zA-Z])/);
    if (m) { out.push({ i, n: m[1].length, z: m[1] }); i += m[1].length - 1; }
    else if (s[i] === '=' ) out.push({ i, n: 1, z: '=' });
  }
  return out;
}
export const SZEROKO = 26;
// podział na najwyższym poziomie po „, \\quad” / „, \\qquad”
function przecinki(t) {
  const out = []; let g = 0, lr = 0, a = 0;
  for (let i = 0; i < t.length; i++) {
    const r = t.slice(i);
    if (t[i] === '{') g++; else if (t[i] === '}') g--;
    else if (r.startsWith('\\left')) lr++; else if (r.startsWith('\\right')) lr--;
    if (g || lr) continue;
    const m = r.match(/^,\s*\\q?quad\s*/);
    if (m) { out.push(t.slice(a, i).trim()); a = i + m[0].length; i += m[0].length - 1; }
  }
  out.push(t.slice(a).trim());
  return out.filter(Boolean);
}
export function waskie(t, pelny = false) {
  if (!t || t.includes('\\begin{aligned}') || dl(t) <= SZEROKO) return undefined;
  // dwa wyniki w jednej linii („…, \\quad …”) — każdy w osobnym wierszu, a długi wiersz dalej dzielony
  const listy = przecinki(t);
  if (listy.length > 1) return `\\begin{aligned} ${listy.map((w) => { const n = waskie(w, true); return n ? n.replace(/^\\begin\{aligned\} |\\end\{aligned\}$/g, '').replace(/^(?!&)/, '&') : `&${w}`; }).join(' \\\\ ')} \\end{aligned}`;
  const rel = relacje(t);
  const mocne = rel.filter((r) => r.z !== '=');
  let ciecia = mocne.length ? mocne : rel;
  if (!mocne.length) {
    if (/,|\\quad|\\text|\\colon/.test(t.replace(/\{[^{}]*\}/g, ''))) return undefined;
  }
  if (!ciecia.length) return undefined;
  const czesci = []; let a = 0;
  for (const r of ciecia) { czesci.push(t.slice(a, r.i)); a = r.i; }
  czesci.push(t.slice(a));
  const czysc = (w) => w.replace(/^(\s|\\ )+|(\s|\\ )+$/g, '');
  const [pierwsza, ...reszta] = czesci.map(czysc);
  // krótki początek (np. ∂f/∂x) zostaje w pierwszym wierszu: A &= B \\ &= C; długi — każdy krok od nowego wiersza
  if (!pelny && !mocne.length && dl(pierwsza) <= 7) return `\\begin{aligned} ${pierwsza} ${reszta.map((w) => `&${w}`).join(' \\\\ ')} \\end{aligned}`;
  // w środku listy krótki początek zostaje z pierwszym krokiem: x = … \\ = …
  if (pelny && !mocne.length && dl(pierwsza) <= 7) return `\\begin{aligned} &${pierwsza} ${reszta[0]} ${reszta.slice(1).map((w) => `\\\\ &${w}`).join(' ')} \\end{aligned}`;
  return `\\begin{aligned} &${pierwsza} \\\\ ${reszta.map((w) => `&${w}`).join(' \\\\ ')} \\end{aligned}`;
}
// linie rachunku: każda długa linia bez własnej wersji wąskiej dostaje ją automatycznie
export const zWaskimi = (linie) => linie.map((L) => (L.t && !L.tm && !L.mx && !L.h ? { ...L, tm: waskie(L.t) } : L));
