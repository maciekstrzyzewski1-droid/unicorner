export const norm = (s) => String(s).normalize('NFC').toLowerCase().replace(/[¿?¡!.,;:„”"«»()]/g, ' ').replace(/\s+/g, ' ').trim();
export const bezAkc = (s) => norm(s).normalize('NFD').replace(/[\u0300-\u036f]/g, '');
// Słowa, w których akcent zmienia znaczenie (tu = twój, tú = ty; que = że, qué = co?; esta = ta, está = jest).
// Tu brak akcentu to inne słowo, nie literówka. Celowo bez solo/sólo i este/éste: RAE dopuszcza je bez akcentu.
export const AKC_SLOWO = new Set([
  'tu', 'tú', 'mi', 'mí', 'el', 'él', 'si', 'sí', 'se', 'sé', 'te', 'té', 'de', 'dé', 'mas', 'más',
  'que', 'qué', 'como', 'cómo', 'donde', 'dónde', 'adonde', 'adónde', 'cuando', 'cuándo', 'cual', 'cuál', 'cuales', 'cuáles',
  'quien', 'quién', 'quienes', 'quiénes', 'cuanto', 'cuánto', 'cuanta', 'cuánta', 'cuantos', 'cuántos', 'cuantas', 'cuántas',
  'esta', 'está', 'estas', 'estás',
]);
/** 'ok' — dokładnie; 'akcent' — dobrze poza akcentem/ñ; null — źle. */
export function porownaj(wpis, dobre) {
  const w = norm(wpis);
  if (!w) return null;
  for (const d of dobre) if (norm(d) === w) return 'ok';
  const ws = w.split(' ');
  for (const d of dobre) {
    if (bezAkc(d) !== bezAkc(wpis)) continue;
    const ds = norm(d).split(' ');
    if (ds.some((x, i) => x !== ws[i] && AKC_SLOWO.has(x) && AKC_SLOWO.has(ws[i]))) continue;
    return 'akcent';
  }
  return null;
}
