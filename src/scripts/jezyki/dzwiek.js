// Krótkie dźwięki lekcji (dobrze / źle / fiszka „jeszcze nie” / koniec lekcji), syntezowane Web Audio:
// bez plików i bez sieci. Włącznik 🔊 w górnej belce lekcji; wybór zapisany w tej przeglądarce.
// Na iPhonie przełącznik wyciszenia też je wycisza.
const KLUCZ = 'uc-jezyki-dzwiek';
let ctx = null;

export function dzwiekWl() {
  try { return localStorage.getItem(KLUCZ) !== '0'; } catch { return true; }
}
export function ustawDzwiek(wl) {
  try { localStorage.setItem(KLUCZ, wl ? '1' : '0'); } catch { /* prywatne okno: wybór tylko do przeładowania */ }
}

function ton(f, start, dlugosc, typ = 'sine', glosnosc = 0.12) {
  const o = ctx.createOscillator(), g = ctx.createGain();
  o.type = typ;
  o.frequency.setValueAtTime(f, start);
  g.gain.setValueAtTime(0.0001, start);
  g.gain.exponentialRampToValueAtTime(glosnosc, start + 0.012);
  g.gain.exponentialRampToValueAtTime(0.0001, start + dlugosc);
  o.connect(g).connect(ctx.destination);
  o.start(start);
  o.stop(start + dlugosc + 0.02);
}

/** rodzaj: 'ok' | 'zle' | 'pyk' | 'koniec'. Zawsze wołane z akcji ucznia (klik), więc przeglądarka pozwala grać. */
export function dzwiek(rodzaj) {
  if (!dzwiekWl()) return;
  try {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    ctx = ctx || new AC();
    if (ctx.state === 'suspended') ctx.resume();
    const t = ctx.currentTime + 0.01;
    if (rodzaj === 'ok') { ton(784, t, 0.12); ton(1175, t + 0.09, 0.22); }
    else if (rodzaj === 'zle') { ton(233, t, 0.2, 'triangle', 0.1); ton(185, t + 0.13, 0.26, 'triangle', 0.08); }
    else if (rodzaj === 'pyk') ton(523, t, 0.12, 'sine', 0.07);
    else if (rodzaj === 'koniec') [523, 659, 784, 1047].forEach((f, i) => ton(f, t + i * 0.11, 0.3, 'sine', 0.1));
  } catch { /* bez dźwięku */ }
}
