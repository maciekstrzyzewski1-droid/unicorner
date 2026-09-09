// TunnelGrid — perspektywiczny POKOJ (Canvas2D), wzorowany na React Bits "Grid Scan".
// Linie glebi startuja w pozycjach linii siatki tla na krawedzi (fold) i biegna do TYLNEJ SCIANY
// -> linie sufitu lacza sie z tlem; pokoj ma skonczona glebie (ciemna tylna sciana), nie "warp".
// Poprzeczne linie = koncentryczne prostokaty z rozstawem PERSPEKTYWY s=j/(j+a) -> kwadratowe kafelki.
// WYDAJNOSC: statyczne warstwy (dim baza + jasna siatka) rysowane RAZ do offscreen-cache;
// co klatke tylko tanie drawImage + gradienty. Gdy swiatlo wylaczone -> rysujemy 1 klatke bez rAF.
import { useEffect, useRef } from 'react';

const hexToRgb = hex => {
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return m ? [parseInt(m[1], 16), parseInt(m[2], 16), parseInt(m[3], 16)] : [168, 85, 255];
};
const clamp01 = v => Math.max(0.0001, Math.min(0.9999, v));

export default function TunnelGrid({
  linesColor = '#a855ff',
  scanColor = '#ff9ffc',
  cell = 48,
  depth = 0.74,
  baseAlpha = 0.5,
  coreWidth = 1.15,     // grubosc linii glebi
  ringWidth = 1,        // grubosc linii poprzecznych
  ringScale = 1,        // mnoznik gestosci poprzecznych (1 = kwadratowe kafelki)
  glow = 0,             // poswiata (halo) statycznej siatki bazowej, 0 = brak
  // --- swiatlo przechodzace przez tunel (opcjonalne) ---
  light = false,
  lightSpeed = 0.5,     // predkosc przelotu (ping-pong)
  lightWidth = 0.12,    // szerokosc pasma swiatla (frakcja promienia)
  lightSoftness = 0.5,  // miekkosc krawedzi pasma
  lightIntensity = 1,   // jasnosc swiatla
  vignette = 0.85,      // ciemny srodek (tylna sciana); 0 = brak
  maxDpr = 1.5,
  className = '',
  style
}) {
  const ref = useRef(null);
  useEffect(() => {
    const ctn = ref.current;
    if (!ctn) return;
    const canvas = document.createElement('canvas');
    canvas.style.display = 'block';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    ctn.appendChild(canvas);
    const ctx = canvas.getContext('2d');
    const baseCache = document.createElement('canvas'); const bctx = baseCache.getContext('2d');
    const litCache = document.createElement('canvas'); const lctx = litCache.getContext('2d');
    const off = document.createElement('canvas'); const octx = off.getContext('2d');
    const LC = hexToRgb(linesColor);
    const SC = hexToRgb(scanColor);
    const rgba = (c, a) => `rgba(${c[0]},${c[1]},${c[2]},${a})`;
    const sBack = clamp01(depth);
    const lerp = (a, b, t) => a + (b - a) * t;

    let W = 1, H = 1, dpr = 1, DW = 1, DH = 1;

    // linie glebi: od krawedzi ekranu (fold) do tylnej sciany (sBack) -> stykaja sie z tlem
    const pathLines = (c, vx, vy) => {
      c.beginPath();
      const seg = (px, py) => { c.moveTo(px, py); c.lineTo(px + (vx - px) * sBack, py + (vy - py) * sBack); };
      for (let x = vx; x <= W + 0.5; x += cell) { seg(x, 0); seg(x, H); }
      for (let x = vx - cell; x >= -0.5; x -= cell) { seg(x, 0); seg(x, H); }
      for (let y = vy; y <= H + 0.5; y += cell) { seg(0, y); seg(W, y); }
      for (let y = vy - cell; y >= -0.5; y -= cell) { seg(0, y); seg(W, y); }
    };
    // poprzeczne = pelne prostokaty; rozstaw PERSPEKTYWY s=j/(j+a).
    // a = vy/cell - 1 -> pierwszy kafelek podlogi/sufitu ~kwadratowy (vy*s1 ~ cell).
    const pathRings = (c, vx, vy) => {
      c.beginPath();
      const a = Math.max(0.6, (vy / cell - 1) / Math.max(0.2, ringScale));
      for (let j = 1; j < 600; j++) {
        const s = j / (j + a);
        if (s > sBack) break;
        const L = lerp(0, vx, s), R = lerp(W, vx, s), T = lerp(0, vy, s), B = lerp(H, vy, s);
        c.rect(L, T, R - L, B - T);
      }
      const L = lerp(0, vx, sBack), R = lerp(W, vx, sBack), T = lerp(0, vy, sBack), B = lerp(H, vy, sBack);
      c.rect(L, T, R - L, B - T);
    };
    const strokeGrid = (c, col, coreA, haloA, ringA, ringHaloA) => {
      const vx = W / 2, vy = H / 2;
      c.lineCap = 'round'; c.lineJoin = 'round';
      if (haloA > 0) { pathLines(c, vx, vy); c.strokeStyle = rgba(col, haloA); c.lineWidth = 5; c.stroke(); }
      pathLines(c, vx, vy); c.strokeStyle = rgba(col, coreA); c.lineWidth = coreWidth; c.stroke();
      if (ringHaloA > 0) { pathRings(c, vx, vy); c.strokeStyle = rgba(col, ringHaloA); c.lineWidth = 4; c.stroke(); }
      pathRings(c, vx, vy); c.strokeStyle = rgba(col, ringA); c.lineWidth = ringWidth; c.stroke();
    };

    const buildCaches = () => {
      bctx.setTransform(dpr, 0, 0, dpr, 0, 0); bctx.clearRect(0, 0, W, H);
      strokeGrid(bctx, LC, baseAlpha, glow, baseAlpha * 0.55, glow * 0.55);
      lctx.setTransform(dpr, 0, 0, dpr, 0, 0); lctx.clearRect(0, 0, W, H);
      strokeGrid(lctx, SC, 1.0, 0.5, 0.82, 0.34);
    };
    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, maxDpr);
      W = Math.max(1, ctn.offsetWidth);
      H = Math.max(1, ctn.offsetHeight);
      DW = Math.round(W * dpr); DH = Math.round(H * dpr);
      canvas.width = off.width = baseCache.width = litCache.width = DW;
      canvas.height = off.height = baseCache.height = litCache.height = DH;
      canvas.style.width = '100%'; canvas.style.height = '100%';
      buildCaches();
      if (!light) drawFrame(0);   // statyczna klatka gdy brak animacji
    };

    const drawFrame = t => {
      const vx = DW / 2, vy = DH / 2;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.globalCompositeOperation = 'source-over';
      ctx.clearRect(0, 0, DW, DH);
      ctx.drawImage(baseCache, 0, 0);

      const Rmax = Math.hypot(vx, vy);

      // swiatlo przechodzace przez tunel (ping-pong front<->tyl)
      if (light) {
        const phase = (t * 0.001 * lightSpeed) % 2;
        const tri = phase < 1 ? phase : 2 - phase;      // 0..1..0
        const s = tri * sBack;                          // glebia czola swiatla
        const rad = Rmax * (1 - s);                     // promien ekranowy tej glebi
        const band = Math.max(3, Rmax * lightWidth * (0.4 + lightSoftness));
        octx.setTransform(1, 0, 0, 1, 0, 0);
        octx.globalCompositeOperation = 'source-over';
        octx.clearRect(0, 0, DW, DH);
        octx.drawImage(litCache, 0, 0);
        octx.globalCompositeOperation = 'destination-in';
        const g = octx.createRadialGradient(vx, vy, Math.max(0, rad - band), vx, vy, rad + band);
        g.addColorStop(0, 'rgba(0,0,0,0)');
        g.addColorStop(0.5, `rgba(0,0,0,${clamp01(lightIntensity)})`);
        g.addColorStop(1, 'rgba(0,0,0,0)');
        octx.fillStyle = g; octx.fillRect(0, 0, DW, DH);
        octx.globalCompositeOperation = 'source-over';
        ctx.globalCompositeOperation = 'lighter';
        ctx.drawImage(off, 0, 0);
        ctx.globalCompositeOperation = 'source-over';
      }

      // glebia — ciemny tyl pokoju
      if (vignette > 0) {
        const rr = Math.max(1, Rmax * (1 - sBack) * 2.4);
        const rg = ctx.createRadialGradient(vx, vy, 0, vx, vy, rr);
        rg.addColorStop(0, `rgba(0,0,0,${clamp01(vignette)})`);
        rg.addColorStop(0.55, `rgba(0,0,0,${clamp01(vignette * 0.6)})`);
        rg.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = rg; ctx.fillRect(0, 0, DW, DH);
      }
    };

    const ro = new ResizeObserver(resize);
    ro.observe(ctn);
    resize();

    let raf = 0;
    let visible = true;
    let tabVisible = document.visibilityState !== 'hidden';
    const loop = t => { drawFrame(t); raf = requestAnimationFrame(loop); };
    const start = () => {
      if (!visible || !tabVisible) return;
      if (light) { if (!raf) raf = requestAnimationFrame(loop); }
      else drawFrame(0);
    };
    const stop = () => { if (raf) { cancelAnimationFrame(raf); raf = 0; } };
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible) start(); else stop(); }, { threshold: 0 });
    io.observe(ctn);
    const onVis = () => { tabVisible = document.visibilityState !== 'hidden'; if (tabVisible) start(); else stop(); };
    document.addEventListener('visibilitychange', onVis);
    start();

    return () => {
      stop();
      ro.disconnect();
      io.disconnect();
      document.removeEventListener('visibilitychange', onVis);
      try { ctn.removeChild(canvas); } catch {}
    };
  }, [linesColor, scanColor, cell, depth, baseAlpha, coreWidth, ringWidth, ringScale, glow,
      light, lightSpeed, lightWidth, lightSoftness, lightIntensity, vignette, maxDpr]);

  return <div ref={ref} className={`gridscan-container ${className}`} style={style} />;
}
