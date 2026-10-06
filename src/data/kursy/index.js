// Rejestr kursów (przedmiotów prowadzonych jako kurs krok po kroku).
// Nowy kurs: dodaj plik src/data/kursy/<slug>.js (COURSE, MODULES, opcjonalnie SLOWNICZEK) i dopisz go tutaj.
import * as matematyka from './matematyka.js';

export const KURSY = { matematyka };

export function getKurs(slug) {
  const k = KURSY[slug];
  if (!k) throw new Error(`Kurs „${slug}” nie jest zarejestrowany w src/data/kursy/index.js`);
  return { ...k, SLOWNICZEK: k.SLOWNICZEK ?? [] };
}

export const moduleUrl = (kurs, m) => `/${kurs}/${m.slug}.html`;
export const courseUrl = (kurs) => `/${kurs}.html`;

export function neighbours(kurs, slug) {
  const live = getKurs(kurs).MODULES.filter((m) => m.status === 'live');
  const i = live.findIndex((m) => m.slug === slug);
  return { prev: i > 0 ? live[i - 1] : null, next: i >= 0 && i < live.length - 1 ? live[i + 1] : null };
}
