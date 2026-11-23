import { h, $$, bezTagow } from './dom.js';

let JEZYK = '';
export const ustawJezyk = (kod) => { JEZYK = kod; };
export const jezyk = () => JEZYK;
export const mowa = typeof window !== 'undefined' && 'speechSynthesis' in window && typeof SpeechSynthesisUtterance !== 'undefined';
export function mow(tekst) {
  if (!mowa) return false;
  try {
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(bezTagow(tekst));
    u.lang = jezyk();
    // Najpierw głos lokalny: działa bez sieci i od razu. Zdalny (localService: false) wysyła czytany tekst
    // (sam tekst kursu, nie dane ucznia) na serwer dostawcy przeglądarki, więc bierzemy go tylko, gdy lokalnego nie ma.
    const pasuje = window.speechSynthesis.getVoices().filter((v) => (v.lang || '').toLowerCase().startsWith(jezyk().slice(0, 2)));
    const glos = pasuje.find((v) => v.localService === true) || pasuje[0];
    if (glos) u.voice = glos;
    u.rate = 0.9;
    window.speechSynthesis.speak(u);
    return true;
  } catch { return false; }
}
export function przyciskMowy(tekst, cls = 'jz-mow') {
  const b = h('button', cls, '🔊');
  b.type = 'button';
  b.setAttribute('aria-label', 'Odsłuchaj: ' + bezTagow(tekst));
  b.addEventListener('click', (e) => { e.stopPropagation(); mow(tekst); });
  return b;
}
/** Dokleja 🔊 do każdego fragmentu po hiszpańsku (span.es) w kontenerze. */
export function ozywMowe(el) {
  if (!mowa) return;
  for (const s of $$('span.es', el)) {
    if (s.dataset.mow) continue;
    s.dataset.mow = '1';
    s.append(przyciskMowy(s.textContent, 'jz-mow jz-mow-mini'));
  }
}
