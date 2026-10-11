// Wspólny silnik „krok po kroku” dla rysunków kursu (oś czasu, plan spłaty…).
// Rysunek to pudełko z atrybutem data-kbox. W środku: sterowanie z Sterowanie.astro (data-kk-*)
// i ukryta lista kroków <ol data-kroki><li data-a=… >podpis</li></ol> (podpisy gotowe z buildu).
// render(st) ustawia stan rysunku PO kroku st (bez animacji), animuj(st) odgrywa przejście do kroku st.
// Szukamy elementów tylko we własnym pudełku: el.closest('[data-kbox]') === box (rysunki mogą się zagnieżdżać).

export const DUR = 650;
export const STAG = 90;
export const EXPR = 1100;
export const PAUZA = 1500;
export const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));
export const reduce = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export function own<T extends Element = HTMLElement>(box: HTMLElement, sel: string): T[] {
  return Array.from(box.querySelectorAll<T>(sel)).filter((el) => el.closest('[data-kbox]') === box);
}

// krótki błysk obwódki (np. kratka, która właśnie dostała wartość)
export function blysk(el?: Element | null) {
  if (!el) return;
  el.classList.remove('k-blysk');
  void (el as HTMLElement).offsetWidth;
  el.classList.add('k-blysk');
  setTimeout(() => el.classList.remove('k-blysk'), 800);
}

// przewija poziomo najbliższy przewijany pojemnik tak, żeby element był widoczny (bez skoku strony w pionie)
export function odslon(el?: Element | null) {
  if (!el) return;
  const sc = el.closest<HTMLElement>('[data-kk-scroll]');
  if (!sc || sc.scrollWidth <= sc.clientWidth) return;
  const r = el.getBoundingClientRect(), s = sc.getBoundingClientRect();
  if (r.left < s.left + 8) sc.scrollLeft -= s.left + 8 - r.left;
  else if (r.right > s.right - 8) sc.scrollLeft += r.right - (s.right - 8);
}

// przewija stronę tak, żeby kratka była widoczna nad przyklejonym podpisem (a pod paskiem strony u góry)
export function widok(box: HTMLElement, el?: Element | null) {
  if (!el) return;
  const ctl = own(box, '[data-kk-ctl]')[0];
  const h = ctl && !ctl.hidden ? ctl.getBoundingClientRect().height : 0;
  const r = el.getBoundingClientRect();
  const gora = 120, dol = window.innerHeight - h - 12;
  if (r.top >= gora && r.bottom <= dol) return;
  const y = r.top - gora - Math.max(0, (dol - gora - r.height) / 3);
  window.scrollBy({ top: y, behavior: reduce() ? 'auto' : 'smooth' });
}

// kopia liczby przelatuje z kratki src nad kratkę dst (pozycje liczone względem pudełka)
export function lot(box: HTMLElement, src: Element | null | undefined, dst: Element | null | undefined,
  o: { html?: string; kolor?: string; delay?: number } = {}): Promise<void> {
  return new Promise((res) => {
    if (reduce() || !src || !dst) return res();
    const b = box.getBoundingClientRect(), r1 = src.getBoundingClientRect(), r2 = dst.getBoundingClientRect();
    if (!r1.width || !r2.width) return res();
    // kratka schowana w przewijanej tabeli: lot zaczyna się (kończy) na krawędzi widocznej części, nie poza ekranem
    const x = (el: Element, r: DOMRect) => {
      const sc = el.closest('[data-kk-scroll]');
      if (!sc) return r.left;
      const c = sc.getBoundingClientRect();
      return Math.min(Math.max(r.left, c.left), Math.max(c.left, c.right - r.width));
    };
    const x1 = x(src, r1), x2 = x(dst, r2);
    const g = document.createElement('div');
    g.className = `k-lot is-${o.kolor ?? 'zloto'}`;
    g.innerHTML = o.html ?? src.querySelector('[data-v]')?.innerHTML ?? '';
    Object.assign(g.style, { left: `${x1 - b.left}px`, top: `${r1.top - b.top}px`, width: `${r1.width}px`, height: `${r1.height}px` });
    box.appendChild(g);
    const dx = x2 + r2.width / 2 - (x1 + r1.width / 2);
    const dy = r2.top + r2.height / 2 - (r1.top + r1.height / 2);
    setTimeout(() => { g.style.transform = `translate(${dx}px, ${dy}px)`; }, 30 + (o.delay ?? 0));
    setTimeout(() => { g.remove(); res(); }, 30 + (o.delay ?? 0) + DUR);
  });
}

export interface KrokowkaOpts {
  render: (st: number, li: HTMLElement) => void;
  animuj?: (st: number, li: HTMLElement) => Promise<void>;
  zamknij?: () => void;
}

// podpina przyciski Start / Wstecz / Dalej / Odtwórz / Zamknij; zwraca null, gdy pudełko nie ma kroków
export function krokowka(box: HTMLElement, o: KrokowkaOpts) {
  const kroki = own<HTMLLIElement>(box, '[data-kroki] > li');
  const go = own(box, '[data-kk-go]')[0];
  if (!kroki.length || !go) return null;
  go.hidden = false;
  const ctl = own(box, '[data-kk-ctl]')[0];
  const cap = own(box, '[data-kk-cap]')[0];
  const licz = own(box, '[data-kk-licz]')[0];
  const [bStart] = own<HTMLButtonElement>(box, '[data-kk-start]');
  const [bPrev] = own<HTMLButtonElement>(box, '[data-kk-prev]');
  const [bNext] = own<HTMLButtonElement>(box, '[data-kk-next]');
  const [bAuto] = own<HTMLButtonElement>(box, '[data-kk-auto]');
  const [bStop] = own<HTMLButtonElement>(box, '[data-kk-stop]');
  let s = -1, busy = false, auto = false;

  const pokaz = (st: number) => {
    s = st;
    o.render(st, kroki[st]);
    cap.innerHTML = kroki[st].innerHTML;
    licz.textContent = `krok ${st + 1} z ${kroki.length}`;
    bPrev.disabled = st <= 0;
    bNext.disabled = st >= kroki.length - 1;
  };
  // w trakcie animacji „Wstecz” i „Dalej” są wyszarzone — kliknięcie nie ginie po cichu
  const idz = async (st: number, anim: boolean) => {
    if (busy) return;
    busy = true;
    pokaz(st);
    if (anim && o.animuj) {
      bPrev.disabled = true;
      bNext.disabled = true;
      await o.animuj(st, kroki[st]);
      bPrev.disabled = s <= 0;
      bNext.disabled = s >= kroki.length - 1;
    }
    busy = false;
  };
  const stopAuto = () => { auto = false; bAuto.textContent = '▶ Odtwórz'; };
  const zamknij = () => {
    stopAuto();
    s = -1;
    o.zamknij?.();
    ctl.hidden = true;
    go.hidden = false;
    box.classList.remove('is-ruch');
  };
  bStart.addEventListener('click', () => {
    go.hidden = true;
    ctl.hidden = false;
    box.classList.add('is-ruch');
    idz(0, false);
    const r = box.getBoundingClientRect();
    if (r.top < 60 || r.top > window.innerHeight * 0.5) box.scrollIntoView({ behavior: reduce() ? 'auto' : 'smooth', block: 'start' });
  });
  bNext.addEventListener('click', () => { stopAuto(); if (s < kroki.length - 1) idz(s + 1, true); });
  bPrev.addEventListener('click', () => { stopAuto(); if (s > 0) idz(s - 1, false); });
  bStop.addEventListener('click', zamknij);
  bAuto.addEventListener('click', async () => {
    if (auto) { stopAuto(); return; }
    auto = true;
    bAuto.textContent = '⏸ Zatrzymaj';
    if (s >= kroki.length - 1) await idz(0, false);
    while (auto && s < kroki.length - 1) {
      await idz(s + 1, true);
      if (!auto) break;
      await sleep(PAUZA);
    }
    stopAuto();
  });
  return { get krok() { return s; }, kroki };
}
