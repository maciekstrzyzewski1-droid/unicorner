export const $ = (s, el = document) => el.querySelector(s);
export const $$ = (s, el = document) => [...el.querySelectorAll(s)];
export const h = (tag, cls, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; };
export const tasuj = (a) => { const b = [...a]; for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; };
/** Zwykły tekst (do syntezy mowy i aria-label — nigdy do HTML): bez znaczników, powtarzane aż do skutku, potem bez pojedynczych < i >. */
export const bezTagow = (s) => {
  let t = String(s), poprzedni;
  do { poprzedni = t; t = t.replace(/<[^<>]*>/g, ''); } while (t !== poprzedni);
  return t.replace(/[<>]/g, '');
};
export const ruch = () => !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
