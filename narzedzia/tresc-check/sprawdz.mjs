// tresc-check: szuka w zbudowanym dist/ miejsc, gdzie zamiast liczby albo tekstu stoi kod.
// Uruchomienie: node narzedzia/tresc-check/sprawdz.mjs dist   (exit 1 = znaleziono błąd)
// Bez zależności. Opis reguł: README.md obok.
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const root = process.argv[2] || 'dist';

const html = [];
(function walk(d) {
  for (const f of readdirSync(d)) {
    const p = join(d, f);
    if (statSync(p).isDirectory()) walk(p);
    else if (f.endsWith('.html')) html.push(p);
  }
})(root);

const dekoduj = (s) => s.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;|&#x27;/g, "'").replace(/&amp;/g, '&');

// 1) Wyrażenie JS wpisane we wzór, np. $n = {S.n}$ — MDX nie liczy wartości wewnątrz $…$, KaTeX wypisuje kod.
//    Szukamy grupy {…}, która nie stoi za komendą TeX (\frac{, \text{), ^, _ ani inną klamrą, a w środku ma:
//    nazwa.pole (S.n, A.pop), funkcję o nazwie z 2+ liter (fmt(x), zl(5)) albo nazwę camelCase (sN, sPct[0]).
//    Zwykłe {f(x)} czy {r([A \mid b])} przechodzą.
const JS_W_WZORZE = /(?:^|[^A-Za-z^_}\]\\])\{\s*(?:[A-Za-z_$][\w$]*\.[A-Za-z_$]|[A-Za-z_$][\w$]+\(|[a-z]+[A-Z][\w$]*\s*[[}.(])/;

// 2) Wartości, które JS wypisuje przy błędzie, w widocznym tekście strony.
const SMIECI = /\b(NaN|undefined|Infinity)\b|\[object Object\]/g;

const bledy = [];
for (const plik of html) {
  const s = readFileSync(plik, 'utf8');
  const nazwa = relative(root, plik);

  for (const [, tex] of s.matchAll(/<annotation encoding="application\/x-tex">([\s\S]*?)<\/annotation>/g)) {
    const t = dekoduj(tex);
    if (JS_W_WZORZE.test(t)) bledy.push(`${nazwa}: kod we wzorze: ${t.trim().slice(0, 120)}`);
  }

  if (s.includes('katex-error')) {
    for (const [, e] of s.matchAll(/class="katex-error"[^>]*title="([^"]*)"/g)) bledy.push(`${nazwa}: błąd KaTeX: ${dekoduj(e).slice(0, 120)}`);
  }

  const widoczny = s
    .replace(/<script[\s\S]*?<\/script>/g, ' ')
    .replace(/<style[\s\S]*?<\/style>/g, ' ')
    .replace(/<annotation[\s\S]*?<\/annotation>/g, ' ')
    .replace(/<[^>]+>/g, ' ');
  const tekst = dekoduj(widoczny);
  for (const m of tekst.matchAll(SMIECI)) {
    bledy.push(`${nazwa}: „${m[0]}” w tekście: …${tekst.slice(Math.max(0, m.index - 50), m.index + 40).replace(/\s+/g, ' ').trim()}…`);
  }
}

const unikalne = [...new Set(bledy)];
console.log(`Stron: ${html.length}.`);
if (unikalne.length) {
  for (const b of unikalne) console.log(process.env.GITHUB_ACTIONS ? `::error::${b}` : `BŁĄD ${b}`);
  console.log(`Znaleziono: ${unikalne.length}.`);
  process.exit(1);
}
console.log('OK: we wzorach i w tekście nie ma kodu zamiast wartości.');
