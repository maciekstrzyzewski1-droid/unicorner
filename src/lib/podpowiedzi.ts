// Podpowiedzi „po najechaniu” (komputer) albo „po stuknięciu” (telefon): np. etykieta „reguła 4” pokazuje wzór reguły.
// Wyzwalacz: element z atrybutem data-pop i ukrytym dzieckiem .k-pop-src (gotowy HTML z buildu, np. KaTeX).
// Jedna wspólna chmurka (position: fixed) dołączona do .k-shell — dzięki temu nie ucina jej clip-path pudełek
// i ma kolory z palety modułu. Klawiatura: Tab pokazuje, Escape chowa.
let chmurka: HTMLDivElement | null = null;
let otwarty: HTMLElement | null = null;
let zegar = 0;

function warstwa(): HTMLDivElement {
  if (chmurka) return chmurka;
  chmurka = document.createElement('div');
  chmurka.className = 'k-tip';
  chmurka.setAttribute('role', 'tooltip');
  chmurka.hidden = true;
  (document.querySelector('.k-shell') ?? document.body).appendChild(chmurka);
  chmurka.addEventListener('mouseenter', () => clearTimeout(zegar));
  chmurka.addEventListener('mouseleave', () => schowajPo());
  return chmurka;
}

function ustaw(el: HTMLElement) {
  const c = warstwa();
  const r = el.getBoundingClientRect();
  const m = 8;
  const w = c.offsetWidth, h = c.offsetHeight;
  let left = Math.min(Math.max(m, r.left), window.innerWidth - w - m);
  let top = r.bottom + 6;
  if (top + h > window.innerHeight - m && r.top - h - 6 > m) top = r.top - h - 6;
  c.style.left = `${Math.max(m, left)}px`;
  c.style.top = `${top}px`;
}

function pokaz(el: HTMLElement) {
  clearTimeout(zegar);
  const src = el.querySelector<HTMLElement>(':scope > .k-pop-src');
  if (!src) return;
  const c = warstwa();
  if (otwarty !== el) {
    otwarty?.setAttribute('aria-expanded', 'false');
    c.innerHTML = src.innerHTML;
    otwarty = el;
  }
  el.setAttribute('aria-expanded', 'true');
  c.hidden = false;
  ustaw(el);
}

function schowaj() {
  clearTimeout(zegar);
  if (chmurka) chmurka.hidden = true;
  otwarty?.setAttribute('aria-expanded', 'false');
  otwarty = null;
}
function schowajPo() {
  clearTimeout(zegar);
  zegar = window.setTimeout(schowaj, 160);
}

export function podepnijPodpowiedzi(root: ParentNode = document) {
  root.querySelectorAll<HTMLElement>('[data-pop]:not([data-pop-ok])').forEach((el) => {
    el.dataset.popOk = '1';
    el.setAttribute('aria-expanded', 'false');
    // mysz: pokaż przy najechaniu, schowaj po zjechaniu; palec: stuknięcie przełącza; klawiatura: fokus pokazuje
    let wskaznik = '';
    el.addEventListener('pointerdown', (e) => { wskaznik = e.pointerType; });
    el.addEventListener('pointerenter', (e) => { if (e.pointerType === 'mouse') pokaz(el); });
    el.addEventListener('pointerleave', (e) => { if (e.pointerType === 'mouse') schowajPo(); });
    el.addEventListener('focus', () => { if (!wskaznik) pokaz(el); });
    el.addEventListener('blur', () => { wskaznik = ''; schowajPo(); });
    el.addEventListener('click', (e) => {
      e.stopPropagation();
      if (wskaznik === 'mouse') { pokaz(el); return; }
      if (otwarty === el && chmurka && !chmurka.hidden) schowaj(); else pokaz(el);
    });
  });
}

if (typeof window !== 'undefined' && !(window as any).__kPop) {
  (window as any).__kPop = true;
  document.addEventListener('click', (e) => { if (chmurka && !chmurka.contains(e.target as Node)) schowaj(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') schowaj(); });
  window.addEventListener('scroll', () => { if (otwarty) ustaw(otwarty); }, { passive: true });
  window.addEventListener('resize', () => schowaj());
}
