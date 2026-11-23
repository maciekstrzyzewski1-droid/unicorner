import { h, $$, bezTagow } from './dom.js';

let JEZYK = '';
export const ustawJezyk = (kod) => { JEZYK = kod; };
export const jezyk = () => JEZYK;
export const mowa = typeof window !== 'undefined' && 'speechSynthesis' in window && typeof SpeechSynthesisUtterance !== 'undefined';
export function mow(tekst) {
  if (!mowa) return false;
  try {
    const ss = window.speechSynthesis;
    if (ss.speaking || ss.pending) ss.cancel();
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
const KLUCZ_WSKAZOWKI = 'uc-jezyki-glos-wskazowka';
let wskazowkaPokazana = false;
const naIOS = () => /iP(hone|ad|od)/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
/** Jednorazowa wskazówka o przełączniku wyciszenia iPhone'a. Wołana tylko z kliknięć 🔊, nigdy z automatycznego odtwarzania. */
export function wskazowkaGlosu() {
  if (wskazowkaPokazana || !naIOS()) return;
  let flaga = false;
  try { flaga = !!localStorage.getItem(KLUCZ_WSKAZOWKI); } catch { /* prywatne okno: wskazówka raz na wczytanie strony */ }
  if (flaga) return;
  const body = document.querySelector('.jz-lekcja .jz-l-body');
  if (!body) return;
  const info = document.createElement('div');
  info.className = 'jz-glos-info';
  info.setAttribute('role', 'status');
  const tekst = document.createElement('span');
  tekst.textContent = "Nic nie słychać? Przestaw przełącznik wyciszenia z boku iPhone'a i podgłośnij.";
  const x = document.createElement('button');
  x.type = 'button';
  x.className = 'jz-glos-x';
  x.setAttribute('aria-label', 'Zamknij wskazówkę');
  x.textContent = '✕';
  x.addEventListener('click', () => info.remove());
  info.append(tekst, x);
  body.prepend(info);
  wskazowkaPokazana = true;
  try { localStorage.setItem(KLUCZ_WSKAZOWKI, '1'); } catch { /* bez zapisu */ }
}
export function przyciskMowy(tekst, cls = 'jz-mow') {
  const b = h('button', cls, '🔊');
  b.type = 'button';
  b.setAttribute('aria-label', 'Odsłuchaj: ' + bezTagow(tekst));
  b.addEventListener('click', (e) => { e.stopPropagation(); mow(tekst); wskazowkaGlosu(); });
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
