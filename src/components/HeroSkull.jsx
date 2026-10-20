import { useRef, useMemo, useState, useEffect, Suspense } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, Environment, Lightformer } from '@react-three/drei';

useGLTF.preload('/assets/skeleton.glb', true);

// Czaszka (assets/skeleton.glb, DRACO) w polerowanym chromie — odbija neonowe
// swiatla na ciemnym tle jak product-shot. Kolysze sie + mozna ja zlapac i obracac.
function Skull({ drag }) {
  const { scene } = useGLTF('/assets/skeleton.glb', true);

  const { obj, k } = useMemo(() => {
    const s = scene.clone(true);
    const mat = new THREE.MeshStandardMaterial({
      color: '#c2c6d6',
      metalness: 1.0,
      roughness: 0.17,
      envMapIntensity: 1.8,
    });
    s.traverse((o) => { if (o.isMesh) o.material = mat; });
    const box = new THREE.Box3().setFromObject(s);
    const c = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());
    s.position.sub(c); // wysrodkuj tresc w (0,0,0)
    return { obj: s, k: 3.4 / Math.max(size.x, size.y, size.z) };
  }, [scene]);

  const grp = useRef(null);

  useFrame((state) => {
    const d = drag.current;
    const t = state.clock.elapsedTime;
    if (!d.active) {
      d.ry += d.vy; d.rx += d.vx;      // bezwladnosc po puszczeniu
      d.vy *= 0.86; d.vx *= 0.86;      // szybsze wygaszanie -> mniej "rozkrecania"
      d.ry += 0.0022;                  // leniwy obrot w spoczynku
    }
    d.rx = Math.max(-0.7, Math.min(0.7, d.rx));
    const g = grp.current;
    if (!g) return;
    g.rotation.y = d.ry;
    g.rotation.x = d.rx;
    g.rotation.z = Math.sin(t * 0.5) * 0.03;      // subtelny wobble
    g.position.y = Math.sin(t * 0.9) * 0.12;      // kolysanie gora-dol
    g.position.x = Math.cos(t * 0.7) * 0.05;
  });

  return (
    <group ref={grp} scale={k}>
      <primitive object={obj} />
    </group>
  );
}

export default function HeroSkull() {
  const drag = useRef({ active: false, px: 0, py: 0, vx: 0, vy: 0, rx: 0, ry: 0 });
  const wrapRef = useRef(null);
  const [onScreen, setOnScreen] = useState(true);
  useEffect(() => {
    const el = wrapRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver(([e]) => setOnScreen(e.isIntersecting), { threshold: 0 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const onDown = (e) => {
    // Na telefonie NIE przechwytujemy gestu — dotyk ma scrollowac strone, nie obracac szkielet.
    // Obrot-przeciaganie zostaje tylko dla myszy/pen (desktop).
    if (e.pointerType === 'touch') return;
    const d = drag.current;
    d.active = true; d.px = e.clientX; d.py = e.clientY; d.vx = 0; d.vy = 0;
    e.currentTarget.setPointerCapture?.(e.pointerId);
    e.currentTarget.style.cursor = 'grabbing';
  };
  const onMove = (e) => {
    const d = drag.current;
    if (!d.active) return;
    const dx = e.clientX - d.px, dy = e.clientY - d.py;
    const F = 0.0055;                              // czulosc obracania (nizej = ciezszy, trudniej rozkrecic)
    const cap = (v) => Math.max(-0.06, Math.min(0.06, v));
    d.ry += dx * F; d.rx += dy * F;
    d.vy = cap(dx * F); d.vx = cap(dy * F);        // limit predkosci -> szybki flick nie rozkreca kilku obrotow
    d.px = e.clientX; d.py = e.clientY;
  };
  const onUp = (e) => {
    drag.current.active = false;
    if (e?.currentTarget) e.currentTarget.style.cursor = 'grab';
  };

  return (
    <div
      ref={wrapRef}
      className="skull-hit"
      onPointerDown={onDown}
      onPointerMove={onMove}
      onPointerUp={onUp}
      onPointerLeave={onUp}
      style={{ width: '100%', height: '100%', cursor: 'grab', touchAction: 'pan-y' }}
    >
      <Canvas
        camera={{ position: [0, 0, 6.2], fov: 34 }}
        gl={{ alpha: true, antialias: true }}
        dpr={[1, 1.5]}
        frameloop={onScreen ? 'always' : 'never'}
      >
        <ambientLight intensity={0.25} />
        {/* neonowe listwy swiatla -> odbicia na chromie (studio look) */}
        <Environment resolution={256}>
          <Lightformer intensity={0.35} color="#3a2f6b" position={[0, 0, -6]} scale={[14, 14, 1]} />
          <Lightformer form="rect" intensity={5} color="#ffffff" position={[2.5, 4, 4]} scale={[3, 10, 1]} rotation={[0, 0, 0.4]} />
          <Lightformer form="rect" intensity={3.5} color="#27e8ff" position={[-5, 1, 3]} scale={[2, 12, 1]} rotation={[0, 0, -0.3]} />
          <Lightformer form="rect" intensity={3.2} color="#ff2e97" position={[5, -2, 2]} scale={[2, 10, 1]} rotation={[0, 0, 0.3]} />
          <Lightformer form="rect" intensity={2.2} color="#a78bfa" position={[-2, -4, 4]} scale={[8, 3, 1]} />
        </Environment>
        <Suspense fallback={null}>
          <Skull drag={drag} />
        </Suspense>
      </Canvas>
    </div>
  );
}
