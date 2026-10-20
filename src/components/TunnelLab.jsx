// TunnelLab — laboratorium wokol PRAWDZIWEGO shadera React Bits (GridScan).
// Suwaki 1:1 z ustawieniami na reactbits.dev + wlacznik swiatla (skanu) i tlo do podgladu styku.
// "Kopiuj ustawienia" zwraca gotowy blok propsow do wklejenia w index.astro.
import { useEffect, useRef, useState } from 'react';
import GridScan from './GridScan.jsx';

const DEF = {
  gridScale: 0.06,      // gestosc kwadratow (mniej = drobniejsze)
  lineThickness: 1,
  linesColor: '#a855ff',
  scanColor: '#ff9ffc',
  light: true,          // wlacznik swiatla (skanu)
  scanOpacity: 0.4,
  scanGlow: 0.5,        // grubosc swiatla
  scanSoftness: 1.6,    // miekkosc
  scanDuration: 2.0,
  scanDelay: 2.0,
  scanPhaseTaper: 0.9,
  scanDirection: 'pingpong',
  bloomOpacity: 0.5,
  lineJitter: 0,
  noiseIntensity: 0,
  tilt: 0,
  yaw: 0,
  lightMode: false,
  showBg: true,
};

const LS = 'unicorner-tunnel-lab';

function Slider({ label, v, min, max, step, on, fmt }) {
  return (
    <label style={{ display: 'block', margin: '9px 0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#cbb9e6', marginBottom: 3 }}>
        <span>{label}</span>
        <span style={{ color: '#fff', fontVariantNumeric: 'tabular-nums' }}>{fmt ? fmt(v) : v}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={v}
        onChange={e => on(parseFloat(e.target.value))}
        style={{ width: '100%', accentColor: '#a855ff' }} />
    </label>
  );
}

export default function TunnelLab() {
  const [p, setP] = useState(DEF);
  const [copied, setCopied] = useState(false);
  const loaded = useRef(false);
  const panelRef = useRef(null);
  const set = (k) => (val) => setP(s => ({ ...s, [k]: val }));

  // kolko myszy nad suwakiem NIE zmienia wartosci — zamiast tego przewija panel
  useEffect(() => {
    const el = panelRef.current;
    if (!el) return;
    const onWheel = (e) => {
      if (e.target && e.target.matches && e.target.matches('input[type=range]')) {
        e.preventDefault();
        el.scrollTop += e.deltaY;
      }
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, []);

  // przywroc / zapisz ustawienia (zeby suwaki nie gubily sie miedzy reloadami)
  useEffect(() => {
    try { const s = JSON.parse(localStorage.getItem(LS) || 'null'); if (s) setP(v => ({ ...v, ...s })); } catch {}
    loaded.current = true;
  }, []);
  useEffect(() => {
    if (!loaded.current) return;
    try { localStorage.setItem(LS, JSON.stringify(p)); } catch {}
  }, [p]);

  const bgGrid = {
    position: 'absolute', inset: 0, pointerEvents: 'none', opacity: p.showBg ? 1 : 0,
    background:
      `linear-gradient(rgba(168,85,255,.55) 1px, transparent 1px) 0 0/100% 48px,` +
      `linear-gradient(90deg, rgba(168,85,255,.55) 1px, transparent 1px) 0 0/48px 100%`,
    WebkitMaskImage: 'linear-gradient(to bottom,#000,#000 55%,transparent 96%)',
    maskImage: 'linear-gradient(to bottom,#000,#000 55%,transparent 96%)',
  };

  // efektywne wartosci -> propsy shadera
  const scanOpacity = p.light ? p.scanOpacity : 0;

  const propStr =
    `gridScale={${p.gridScale}} lineThickness={${p.lineThickness}} linesColor="${p.linesColor}" scanColor="${p.scanColor}" ` +
    `scanOpacity={${scanOpacity}} scanGlow={${p.scanGlow}} scanSoftness={${p.scanSoftness}} ` +
    `scanDuration={${p.scanDuration}} scanDelay={${p.scanDelay}} scanPhaseTaper={${p.scanPhaseTaper}} ` +
    `scanDirection="${p.scanDirection}" bloomOpacity={${p.bloomOpacity}} lineJitter={${p.lineJitter}} ` +
    `noiseIntensity={${p.noiseIntensity}} tilt={${p.tilt}} yaw={${p.yaw}} lightMode={${p.lightMode}}`;

  const copy = async () => {
    try { await navigator.clipboard.writeText(propStr); setCopied(true); setTimeout(() => setCopied(false), 1400); } catch {}
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: '#050505', overflow: 'hidden', fontFamily: 'system-ui, sans-serif' }}>
      {/* TLO strony (podglad styku) */}
      <div style={bgGrid} />

      {/* SHADER React Bits (pelny pokoj) — dolny panel */}
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: '66vh' }}>
        <GridScan
          style={{ position: 'absolute', inset: 0 }}
          gridScale={p.gridScale}
          lineThickness={p.lineThickness}
          linesColor={p.linesColor}
          scanColor={p.scanColor}
          scanOpacity={scanOpacity}
          scanGlow={p.scanGlow}
          scanSoftness={p.scanSoftness}
          scanDuration={p.scanDuration}
          scanDelay={p.scanDelay}
          scanPhaseTaper={p.scanPhaseTaper}
          scanDirection={p.scanDirection}
          bloomOpacity={p.bloomOpacity}
          lineJitter={p.lineJitter}
          noiseIntensity={p.noiseIntensity}
          tilt={p.tilt}
          yaw={p.yaw}
          lightMode={p.lightMode}
        />
      </div>

      <div style={{ position: 'absolute', left: 12, bottom: '66vh', transform: 'translateY(-6px)', fontSize: 11, letterSpacing: 2, color: '#8b7bb0', pointerEvents: 'none' }}>
        ↓ STYK Z TŁEM ↓
      </div>

      {/* PANEL sterowania */}
      <div ref={panelRef} style={{
        position: 'absolute', top: 14, right: 14, width: 306, maxHeight: 'calc(100vh - 28px)', overflowY: 'auto',
        background: 'rgba(16,12,24,.93)', border: '1px solid rgba(168,85,255,.28)', borderRadius: 14,
        padding: '14px 16px', backdropFilter: 'blur(8px)', boxShadow: '0 10px 40px rgba(0,0,0,.5)', color: '#e9e0f7'
      }}>
        <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: 1, marginBottom: 8, color: '#fff' }}>GRID SCAN — LAB</div>

        <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: 1, color: '#a98fd0', margin: '10px 0 2px' }}>Siatka</div>
        <Slider label="Gęstość kwadratów (mniej = drobniej)" v={p.gridScale} min={0.02} max={0.16} step={0.005} on={set('gridScale')} fmt={v => v.toFixed(3)} />
        <Slider label="Grubość linii" v={p.lineThickness} min={0.4} max={3} step={0.05} on={set('lineThickness')} />
        <Slider label="Szum (noise)" v={p.noiseIntensity} min={0} max={0.08} step={0.002} on={set('noiseIntensity')} fmt={v => v.toFixed(3)} />
        <Slider label="Drżenie linii (jitter)" v={p.lineJitter} min={0} max={1} step={0.02} on={set('lineJitter')} />

        <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: 1, color: '#a98fd0', margin: '10px 0 2px' }}>Perspektywa</div>
        <Slider label="Pochylenie (tilt)" v={p.tilt} min={-0.5} max={0.5} step={0.01} on={set('tilt')} />
        <Slider label="Obrót (yaw)" v={p.yaw} min={-0.6} max={0.6} step={0.01} on={set('yaw')} />

        <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: 1, color: '#a98fd0', margin: '14px 0 2px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>Światło (skan)</span>
          <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', color: '#fff' }}>
            <input type="checkbox" checked={p.light} onChange={e => set('light')(e.target.checked)} style={{ accentColor: '#ff9ffc' }} />
            {p.light ? 'ON' : 'OFF'}
          </label>
        </div>
        <div style={{ opacity: p.light ? 1 : 0.4, pointerEvents: p.light ? 'auto' : 'none', transition: 'opacity .2s' }}>
          <Slider label="Intensywność (opacity)" v={p.scanOpacity} min={0} max={1} step={0.02} on={set('scanOpacity')} />
          <Slider label="Grubość światła (glow)" v={p.scanGlow} min={0.1} max={2} step={0.05} on={set('scanGlow')} />
          <Slider label="Softness (miękkość)" v={p.scanSoftness} min={0.2} max={3} step={0.05} on={set('scanSoftness')} />
          <Slider label="Poświata (bloom)" v={p.bloomOpacity} min={0} max={1} step={0.02} on={set('bloomOpacity')} />
          <Slider label="Czas przelotu (s)" v={p.scanDuration} min={0.5} max={5} step={0.1} on={set('scanDuration')} />
          <Slider label="Przerwa między (s)" v={p.scanDelay} min={0} max={5} step={0.1} on={set('scanDelay')} />
          <Slider label="Zwężenie (taper)" v={p.scanPhaseTaper} min={0} max={0.49} step={0.01} on={set('scanPhaseTaper')} />
          <label style={{ display: 'block', margin: '9px 0', fontSize: 12, color: '#cbb9e6' }}>
            Kierunek
            <select value={p.scanDirection} onChange={e => set('scanDirection')(e.target.value)}
              style={{ width: '100%', marginTop: 4, padding: '5px 8px', borderRadius: 8, background: 'rgba(0,0,0,.4)', color: '#fff', border: '1px solid rgba(168,85,255,.25)' }}>
              <option value="forward">w głąb</option>
              <option value="reverse">do przodu</option>
              <option value="pingpong">tam i z powrotem</option>
            </select>
          </label>
        </div>

        <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: 1, color: '#a98fd0', margin: '14px 0 2px' }}>Kolory / tło</div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
          <label style={{ fontSize: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
            <input type="color" value={p.linesColor} onChange={e => set('linesColor')(e.target.value)} /> linie
          </label>
          <label style={{ fontSize: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
            <input type="color" value={p.scanColor} onChange={e => set('scanColor')(e.target.value)} /> światło
          </label>
        </div>
        <div style={{ display: 'flex', gap: 16, marginTop: 8 }}>
          <label style={{ fontSize: 12, display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
            <input type="checkbox" checked={p.showBg} onChange={e => set('showBg')(e.target.checked)} /> pokaż tło
          </label>
          <label style={{ fontSize: 12, display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
            <input type="checkbox" checked={p.lightMode} onChange={e => set('lightMode')(e.target.checked)} /> tryb „światło"
          </label>
        </div>

        <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
          <button onClick={copy} style={{ flex: 1, padding: '9px 10px', borderRadius: 9, border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: 12, background: copied ? '#3ddc84' : 'linear-gradient(90deg,#27e8ff,#ff2e97)', color: copied ? '#062a15' : '#fff' }}>
            {copied ? 'Skopiowano ✓' : 'Kopiuj ustawienia'}
          </button>
          <button onClick={() => setP(DEF)} style={{ padding: '9px 10px', borderRadius: 9, border: '1px solid rgba(255,255,255,.2)', cursor: 'pointer', fontSize: 12, background: 'transparent', color: '#e9e0f7' }}>
            Reset
          </button>
        </div>
        <textarea readOnly value={propStr} style={{ width: '100%', height: 76, marginTop: 10, fontSize: 10.5, lineHeight: 1.4, background: 'rgba(0,0,0,.4)', color: '#b7a6d6', border: '1px solid rgba(168,85,255,.2)', borderRadius: 8, padding: 8, resize: 'none' }} />
      </div>
    </div>
  );
}
