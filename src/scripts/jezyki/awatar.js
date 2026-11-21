// Postać do zadania „opisz osobę z obrazka” (kolokwium 1). Rysunek liczony z parametrów,
// więc zdania prawdziwe/fałszywe w ćwiczeniach (src/data/jezyki/hiszpanski.js) zawsze pasują do obrazka.
// Lewa część: portret (włosy, oczy, okulary, broda, wąsy, zmarszczki). Prawa: sylwetka przy miarce
// wzrostu (alto = 1,90 m, bajo = 1,55 m) — wzrostu nie da się pokazać na samym portrecie.

const WLOSY = { rubio: '#f2cf63', moreno: '#3a271b', blanco: '#e9e9ef' };
const OCZY = { azules: '#2f7bff', verdes: '#21b45f', marrones: '#8a5526', negros: '#1b1b1f' };
const SKORA = '#f0c7a0';
const SKORA_CIEN = '#d9a77d';
const KOSZULA = { m: '#6d4bd8', k: '#b04bd8' };

export function awatar(p) {
  const gruby = p.budowa === 'gordo';
  const k = p.plec === 'k';
  const mayor = p.wiek === 'mayor';
  const wl = WLOSY[p.pelo] || WLOSY.moreno;
  const ir = OCZY[p.ojos] || OCZY.marrones;
  // głowa (portret 0–210 w poziomie)
  const cx = 105, cy = 98;
  const rx = gruby ? 50 : 41, ry = gruby ? 54 : 52;
  const czesci = [];

  // tło portretu
  czesci.push(`<rect x="6" y="6" width="198" height="208" rx="18" fill="#141126" stroke="rgba(189,139,255,.35)"/>`);
  // długie włosy z tyłu (kobieta)
  if (k) czesci.push(`<path d="M${cx - rx - 8} ${cy - 10} Q${cx - rx - 14} ${cy + 70} ${cx - rx + 4} ${cy + 92} L${cx + rx - 4} ${cy + 92} Q${cx + rx + 14} ${cy + 70} ${cx + rx + 8} ${cy - 10} Z" fill="${wl}"/>`);
  // tułów
  const bark = gruby ? 92 : 74;
  czesci.push(`<path d="M${cx - bark} 214 Q${cx - bark + 6} ${cy + 66} ${cx} ${cy + 62} Q${cx + bark - 6} ${cy + 66} ${cx + bark} 214 Z" fill="${KOSZULA[p.plec] || KOSZULA.m}"/>`);
  czesci.push(`<rect x="${cx - 13}" y="${cy + 38}" width="26" height="30" rx="8" fill="${SKORA_CIEN}"/>`);
  // uszy
  czesci.push(`<ellipse cx="${cx - rx + 2}" cy="${cy + 6}" rx="8" ry="12" fill="${SKORA_CIEN}"/><ellipse cx="${cx + rx - 2}" cy="${cy + 6}" rx="8" ry="12" fill="${SKORA_CIEN}"/>`);
  // twarz
  czesci.push(`<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${SKORA}"/>`);
  if (gruby) czesci.push(`<ellipse cx="${cx - 26}" cy="${cy + 22}" rx="11" ry="7" fill="#f2a98f" opacity=".55"/><ellipse cx="${cx + 26}" cy="${cy + 22}" rx="11" ry="7" fill="#f2a98f" opacity=".55"/>`);
  // włosy na górze głowy
  if (k) {
    czesci.push(`<path d="M${cx - rx - 4} ${cy - 2} Q${cx - rx} ${cy - ry - 16} ${cx} ${cy - ry - 8} Q${cx + rx} ${cy - ry - 16} ${cx + rx + 4} ${cy - 2} Q${cx + 22} ${cy - ry + 6} ${cx - 6} ${cy - ry + 16} Q${cx - 30} ${cy - ry + 22} ${cx - rx - 4} ${cy - 2} Z" fill="${wl}"/>`);
  } else {
    czesci.push(`<path d="M${cx - rx} ${cy - 8} Q${cx - rx - 2} ${cy - ry - 12} ${cx} ${cy - ry - 6} Q${cx + rx + 2} ${cy - ry - 12} ${cx + rx} ${cy - 8} Q${cx + rx - 8} ${cy - ry + 14} ${cx} ${cy - ry + 12} Q${cx - rx + 8} ${cy - ry + 14} ${cx - rx} ${cy - 8} Z" fill="${wl}"/>`);
  }
  // zmarszczki (osoba starsza)
  if (mayor) czesci.push(`<path d="M${cx - 18} ${cy - 30} q18 -6 36 0 M${cx - 14} ${cy - 23} q14 -5 28 0" stroke="${SKORA_CIEN}" stroke-width="2.5" fill="none" stroke-linecap="round"/>`);
  // brwi
  const brew = p.pelo === 'blanco' ? '#bdbdc8' : (p.pelo === 'rubio' ? '#c9a43f' : '#2a1c14');
  czesci.push(`<path d="M${cx - 30} ${cy - 14} q12 -7 22 0 M${cx + 8} ${cy - 14} q12 -7 22 0" stroke="${brew}" stroke-width="4" fill="none" stroke-linecap="round"/>`);
  // oczy — duże, żeby było widać kolor
  for (const ox of [cx - 19, cx + 19]) {
    czesci.push(`<ellipse cx="${ox}" cy="${cy + 1}" rx="12" ry="9" fill="#fff"/>`);
    czesci.push(`<circle cx="${ox}" cy="${cy + 1}" r="7.2" fill="${ir}"/>`);
    czesci.push(`<circle cx="${ox}" cy="${cy + 1}" r="3.2" fill="#050505"/>`);
    czesci.push(`<circle cx="${ox + 2.6}" cy="${cy - 2}" r="1.8" fill="#fff"/>`);
  }
  if (k) czesci.push(`<path d="M${cx - 31} ${cy - 6} l-5 -4 M${cx + 31} ${cy - 6} l5 -4" stroke="#1b1b1f" stroke-width="2.4" stroke-linecap="round"/>`);
  // okulary
  if (p.gafas) {
    czesci.push(`<g fill="rgba(200,220,255,.12)" stroke="#d8dcff" stroke-width="3"><rect x="${cx - 35}" y="${cy - 11}" width="31" height="24" rx="8"/><rect x="${cx + 4}" y="${cy - 11}" width="31" height="24" rx="8"/></g>`);
    czesci.push(`<path d="M${cx - 4} ${cy - 1} q4 -4 8 0 M${cx - 35} ${cy - 2} l-${rx - 33} -3 M${cx + 35} ${cy - 2} l${rx - 33} -3" stroke="#d8dcff" stroke-width="3" fill="none"/>`);
  }
  // nos
  czesci.push(`<path d="M${cx} ${cy + 6} q-6 14 0 17 q4 1 6 -1" stroke="${SKORA_CIEN}" stroke-width="3" fill="none" stroke-linecap="round"/>`);
  // broda
  if (p.barba) czesci.push(`<path d="M${cx - rx + 4} ${cy + 8} Q${cx - rx + 6} ${cy + ry + 14} ${cx} ${cy + ry + 16} Q${cx + rx - 6} ${cy + ry + 14} ${cx + rx - 4} ${cy + 8} Q${cx + rx - 12} ${cy + 34} ${cx + 16} ${cy + 40} Q${cx} ${cy + 46} ${cx - 16} ${cy + 40} Q${cx - rx + 12} ${cy + 34} ${cx - rx + 4} ${cy + 8} Z" fill="${wl}"/>`);
  // usta
  czesci.push(`<path d="M${cx - 13} ${cy + 33} q13 10 26 0" stroke="#a3413f" stroke-width="3.4" fill="${k ? '#d9606a' : 'none'}" stroke-linecap="round"/>`);
  // wąsy
  if (p.bigote) czesci.push(`<path d="M${cx - 22} ${cy + 30} Q${cx - 12} ${cy + 19} ${cx} ${cy + 26} Q${cx + 12} ${cy + 19} ${cx + 22} ${cy + 30} Q${cx + 10} ${cy + 27} ${cx} ${cy + 30} Q${cx - 10} ${cy + 27} ${cx - 22} ${cy + 30} Z" fill="${wl}" stroke="${p.pelo === 'blanco' ? '#c9c9d4' : wl}" stroke-width="2"/>`);
  // imię
  czesci.push(`<rect x="${cx - 38}" y="186" width="76" height="22" rx="11" fill="rgba(5,5,8,.75)" stroke="rgba(189,139,255,.55)"/><text x="${cx}" y="201.5" text-anchor="middle" font-size="13" font-family="Chakra Petch, sans-serif" fill="#efe6ff">${p.imie || ''}</text>`);

  // ── miarka i sylwetka (220–330) ──
  const podloga = 206, gora = 22; // 0 m → podłoga, 2 m → gora
  const m2y = (m) => podloga - (m / 2) * (podloga - gora);
  const wzrost = p.wzrost === 'alto' ? 1.9 : 1.55;
  const czubek = m2y(wzrost);
  czesci.push(`<rect x="214" y="6" width="120" height="208" rx="18" fill="#141126" stroke="rgba(189,139,255,.35)"/>`);
  czesci.push(`<line x1="234" y1="${gora}" x2="234" y2="${podloga}" stroke="#7d70b8" stroke-width="2"/>`);
  for (let m = 0; m <= 2.001; m += 0.5) {
    const y = m2y(m);
    czesci.push(`<line x1="229" y1="${y}" x2="239" y2="${y}" stroke="#7d70b8" stroke-width="2"/><text x="243" y="${y + 4}" font-size="10" fill="#9b93c4" font-family="Chakra Petch, sans-serif">${String(m.toFixed(1)).replace('.', ',')}</text>`);
  }
  // sylwetka
  const sx = 296, h = podloga - czubek;
  const glowa = h * 0.13, szer = (gruby ? 0.36 : 0.22) * h * 0.55;
  czesci.push(`<g fill="${KOSZULA[p.plec] || KOSZULA.m}">`
    + `<circle cx="${sx}" cy="${czubek + glowa}" r="${glowa}" fill="${SKORA}"/>`
    + `<rect x="${sx - szer}" y="${czubek + glowa * 2.1}" width="${szer * 2}" height="${h * 0.42}" rx="${szer * 0.7}"/>`
    + `<rect x="${sx - szer * 0.8}" y="${czubek + glowa * 2.1 + h * 0.38}" width="${szer * 0.7}" height="${h - glowa * 2.1 - h * 0.38}" rx="4" fill="#3b2f6b"/>`
    + `<rect x="${sx + szer * 0.1}" y="${czubek + glowa * 2.1 + h * 0.38}" width="${szer * 0.7}" height="${h - glowa * 2.1 - h * 0.38}" rx="4" fill="#3b2f6b"/>`
    + `</g>`);
  // włosy sylwetki: czapka na czubku głowy (twarz zostaje odsłonięta), u kobiet dłuższe po bokach
  const gy = czubek + glowa;
  czesci.push(k
    ? `<path d="M${sx - glowa * 1.08} ${gy + glowa * 1.15} L${sx - glowa * 1.08} ${gy} A${glowa * 1.08} ${glowa * 1.08} 0 0 1 ${sx + glowa * 1.08} ${gy} L${sx + glowa * 1.08} ${gy + glowa * 1.15} L${sx + glowa * 0.72} ${gy + glowa * 1.15} L${sx + glowa * 0.72} ${gy - glowa * 0.1} Q${sx} ${gy - glowa * 0.55} ${sx - glowa * 0.72} ${gy - glowa * 0.1} L${sx - glowa * 0.72} ${gy + glowa * 1.15} Z" fill="${wl}"/>`
    : `<path d="M${sx - glowa * 1.04} ${gy - glowa * 0.05} A${glowa * 1.04} ${glowa * 1.04} 0 0 1 ${sx + glowa * 1.04} ${gy - glowa * 0.05} Q${sx} ${gy - glowa * 0.6} ${sx - glowa * 1.04} ${gy - glowa * 0.05} Z" fill="${wl}"/>`);
  czesci.push(`<line x1="234" y1="${czubek}" x2="${sx + 20}" y2="${czubek}" stroke="#ffd84a" stroke-width="1.6" stroke-dasharray="4 3"/>`);
  czesci.push(`<text x="${sx + 22}" y="${czubek - 5}" font-size="12" text-anchor="end" fill="#ffd84a" font-family="Chakra Petch, sans-serif">${String(wzrost.toFixed(2)).replace('.', ',')} m</text>`);
  czesci.push(`<line x1="222" y1="${podloga}" x2="326" y2="${podloga}" stroke="#7d70b8" stroke-width="2"/>`);

  // opis słowny dla czytnika ekranu (bez niego osoba niewidoma nie zrobi ćwiczenia z postacią)
  const f = (m, z) => (k ? z : m);
  const opis = [
    p.wzrost === 'alto' ? `${f('wysoki', 'wysoka')} (1,90 m)` : `${f('niski', 'niska')} (1,55 m)`,
    mayor ? f('starszy', 'starsza') : f('młody', 'młoda'),
    gruby ? f('gruby', 'gruba') : f('szczupły', 'szczupła'),
    { rubio: 'jasne włosy', moreno: 'ciemne włosy', blanco: 'siwe włosy' }[p.pelo],
    { azules: 'niebieskie oczy', verdes: 'zielone oczy', marrones: 'brązowe oczy', negros: 'czarne oczy' }[p.ojos],
    p.gafas && 'okulary', p.barba && 'broda', p.bigote && 'wąsy',
  ].filter(Boolean).join(', ');
  return `<svg class="jz-aw" viewBox="0 0 340 220" role="img" aria-label="${p.imie || 'Postać'}: ${opis}" xmlns="http://www.w3.org/2000/svg">${czesci.join('')}</svg>`;
}
