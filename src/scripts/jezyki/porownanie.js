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

/** Zaimki osobowe według osoby 0–5 (kolejność jak OSOBY w danych kursu). */
export const ZAIMKI_OS = [['yo'], ['tú'], ['él', 'ella', 'usted'], ['nosotros', 'nosotras'], ['vosotros', 'vosotras'], ['ellos', 'ellas', 'ustedes']];
const ZWROTNE = new Set(['me', 'te', 'se', 'nos', 'os']);
/** Zaimek zwrotny na początku wielowyrazowej formy ('te llamas' → 'te'); w innym razie null. */
export function zaimekZwrotny(forma) {
  const slowa = norm(forma).split(' ');
  return slowa.length > 1 && ZWROTNE.has(slowa[0]) ? slowa[0] : null;
}
// Zdejmuje wpisany zaimek osobowy danej osoby: { reszta, akcent } albo null.
function zdejmijZaimek(wpis, osoba) {
  const slowa = norm(wpis).split(' ');
  if (slowa.length < 2) return null;
  const zaimki = ZAIMKI_OS[osoba] || [];
  const reszta = slowa.slice(1).join(' ');
  if (zaimki.some((z) => norm(z) === slowa[0])) return { reszta, akcent: false };
  if (zaimki.some((z) => bezAkc(z) === slowa[0])) return { reszta, akcent: true };
  return null;
}
/** 'ok' | 'akcent' — forma pasuje (z zaimkiem lub bez); 'zaimek' — brak zaimka zwrotnego; null — źle. */
export function porownajForme(wpis, forma, osoba) {
  const wprost = porownaj(wpis, [forma]);
  if (wprost) return wprost;
  const zdjety = zdejmijZaimek(wpis, osoba);
  let reszta = wpis;
  if (zdjety) {
    const wynik = porownaj(zdjety.reszta, [forma]);
    if (wynik) return zdjety.akcent ? 'akcent' : wynik;
    reszta = zdjety.reszta;
  }
  if (zaimekZwrotny(forma) === null) return null;
  const bezZwrotnego = norm(forma).split(' ').slice(1).join(' ');
  return porownaj(reszta, [bezZwrotnego]) ? 'zaimek' : null;
}
/** 'hasta luego' → 'h____ l____': pierwsza litera każdego słowa, reszta jako '_'. */
export function wzorPodpowiedzi(odp) {
  return String(odp).normalize('NFC').replace(/\p{L}+/gu, (s) => {
    const [pierwsza, ...nastepne] = Array.from(s);
    return pierwsza + '_'.repeat(nastepne.length);
  });
}
