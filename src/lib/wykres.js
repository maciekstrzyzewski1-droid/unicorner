// Małe wykresy SVG liczone przy buildzie (moduł „Pochodne” i dalej): skala, osie, krzywa z funkcji, odcinek stycznej.
// Kolory nadają klasy CSS (k-w-*), więc rysunek dostaje paletę modułu. Liczby na osiach piszemy z przecinkiem.

export function skala({ x0, x1, y0, y1, w, h, pad = 28, rowne = false }) {
  let sx = (w - 2 * pad) / (x1 - x0);
  let sy = (h - 2 * pad) / (y1 - y0);
  if (rowne) { const s = Math.min(sx, sy); sx = s; sy = s; }
  const ox = pad + ((w - 2 * pad) - sx * (x1 - x0)) / 2;
  const oy = pad + ((h - 2 * pad) - sy * (y1 - y0)) / 2;
  const X = (x) => ox + (x - x0) * sx;
  const Y = (y) => h - oy - (y - y0) * sy;
  return { X, Y, sx, sy, x0, x1, y0, y1, w, h };
}

const r2 = (v) => Math.round(v * 100) / 100;
export const liczba = (v) => String(Math.round(v * 1000) / 1000).replace('.', ',').replace(/^-/, '−');

// ścieżka krzywej y = f(x) na przedziale [a, b]; punkty poza zakresem osi y są przycinane (krzywa się „urywa”)
export function sciezka(f, a, b, S, n = 160) {
  let d = '', pioro = false;
  for (let i = 0; i <= n; i++) {
    const x = a + ((b - a) * i) / n, y = f(x);
    const ok = Number.isFinite(y) && y >= S.y0 - 0.5 && y <= S.y1 + 0.5;
    if (!ok) { pioro = false; continue; }
    d += `${pioro ? 'L' : 'M'}${r2(S.X(x))} ${r2(S.Y(y))} `;
    pioro = true;
  }
  return d.trim();
}

// osie z podziałką co krok (bez opisu 0 przy obu osiach naraz); etykiety „x” i „y” na końcach
export function osie(S, { kx = 1, ky = 1, opisX = true, opisY = true, siatka = false } = {}) {
  const parts = [];
  const { X, Y } = S;
  if (siatka) {
    for (let x = Math.ceil(S.x0 / kx) * kx; x <= S.x1 + 1e-9; x += kx) parts.push(`<line class="k-w-siatka" x1="${r2(X(x))}" y1="${r2(Y(S.y0))}" x2="${r2(X(x))}" y2="${r2(Y(S.y1))}"/>`);
    for (let y = Math.ceil(S.y0 / ky) * ky; y <= S.y1 + 1e-9; y += ky) parts.push(`<line class="k-w-siatka" x1="${r2(X(S.x0))}" y1="${r2(Y(y))}" x2="${r2(X(S.x1))}" y2="${r2(Y(y))}"/>`);
  }
  const yOs = Math.min(Math.max(0, S.y0), S.y1), xOs = Math.min(Math.max(0, S.x0), S.x1);
  parts.push(`<line class="k-w-os" x1="${r2(X(S.x0))}" y1="${r2(Y(yOs))}" x2="${r2(X(S.x1))}" y2="${r2(Y(yOs))}"/>`);
  parts.push(`<line class="k-w-os" x1="${r2(X(xOs))}" y1="${r2(Y(S.y0))}" x2="${r2(X(xOs))}" y2="${r2(Y(S.y1))}"/>`);
  if (opisX) for (let x = Math.ceil(S.x0 / kx) * kx; x <= S.x1 + 1e-9; x += kx) {
    if (Math.abs(x) < 1e-9) continue;
    parts.push(`<line class="k-w-os" x1="${r2(X(x))}" y1="${r2(Y(yOs) - 4)}" x2="${r2(X(x))}" y2="${r2(Y(yOs) + 4)}"/>`);
    parts.push(`<text class="k-w-podz" x="${r2(X(x))}" y="${r2(Y(yOs) + 19)}" text-anchor="middle">${liczba(x)}</text>`);
  }
  if (opisY) for (let y = Math.ceil(S.y0 / ky) * ky; y <= S.y1 + 1e-9; y += ky) {
    if (Math.abs(y) < 1e-9) continue;
    parts.push(`<line class="k-w-os" x1="${r2(X(xOs) - 4)}" y1="${r2(Y(y))}" x2="${r2(X(xOs) + 4)}" y2="${r2(Y(y))}"/>`);
    parts.push(`<text class="k-w-podz" x="${r2(X(xOs) - 9)}" y="${r2(Y(y) + 5)}" text-anchor="end">${liczba(y)}</text>`);
  }
  parts.push(`<text class="k-w-nazwa" x="${r2(X(S.x1) - 2)}" y="${r2(Y(yOs) - 9)}" text-anchor="end">x</text>`);
  parts.push(`<text class="k-w-nazwa" x="${r2(X(xOs) + 9)}" y="${r2(Y(S.y1) + 14)}">y</text>`);
  return parts.join('');
}

// odcinek prostej przez punkt (x0, y0) o nachyleniu k, o długości ok. dl jednostek osi x w każdą stronę
export function odcinek(x0, y0, k, dl, S) {
  const a = x0 - dl, b = x0 + dl;
  return { x1: r2(S.X(a)), y1: r2(S.Y(y0 + k * (a - x0))), x2: r2(S.X(b)), y2: r2(S.Y(y0 + k * (b - x0))) };
}

// prosta przez (x0, y0) o nachyleniu k, przycięta do prostokąta osi
export function prosta(x0, y0, k, S) {
  const pts = [];
  const f = (x) => y0 + k * (x - x0);
  const add = (x, y) => { if (x >= S.x0 - 1e-9 && x <= S.x1 + 1e-9 && y >= S.y0 - 1e-9 && y <= S.y1 + 1e-9) pts.push([x, y]); };
  add(S.x0, f(S.x0)); add(S.x1, f(S.x1));
  if (Math.abs(k) > 1e-12) { add(x0 + (S.y0 - y0) / k, S.y0); add(x0 + (S.y1 - y0) / k, S.y1); }
  pts.sort((p, q) => p[0] - q[0]);
  const [p, q] = [pts[0], pts[pts.length - 1]];
  return { x1: r2(S.X(p[0])), y1: r2(S.Y(p[1])), x2: r2(S.X(q[0])), y2: r2(S.Y(q[1])) };
}
