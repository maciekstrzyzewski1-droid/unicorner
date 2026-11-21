// Rejestr kursów językowych. Nowy język = nowy plik danych (wzór: hiszpanski.js) + wpis tutaj
// + strona src/pages/<slug>.astro z <Sciezka kurs="<slug>" /> + karta w src/pages/jezyki.astro.
import * as hiszpanski from './hiszpanski.js';

export const JEZYKI = {
  hiszpanski: { KURS: hiszpanski.KURS, ODZNAKI: hiszpanski.ODZNAKI },
};

/** Liczby do opisów (strona kursu, hub języków). */
export function statystyki(KURS) {
  let lekcje = 0, cwiczenia = 0, jednostki = 0;
  for (const s of KURS.sekcje) {
    for (const u of s.jednostki) { jednostki++; for (const l of u.lekcje) { lekcje++; cwiczenia += l.pula.length; } }
    if (s.boss) cwiczenia += s.boss.retos.reduce((a, r) => a + r.pula.length, 0);
  }
  return { lekcje, cwiczenia, jednostki };
}
