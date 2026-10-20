import { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame } from '@react-three/fiber';
import { MeshTransmissionMaterial, Environment, Lightformer, Float } from '@react-three/drei';

// Szklany krysztal — MeshTransmissionMaterial (refrakcja + aberracja chromatyczna),
// oswietlony proceduralnymi Lightformerami w palecie Unicornera. Bo material zalamuje
// wlasna scene (nie DOM za canvasem), dajemy mu fioletowe tlo refrakcji + jasne swiatla.
function Crystal() {
  const ref = useRef(null);
  const bg = useMemo(() => new THREE.Color('#2a1650'), []);
  useFrame((_, dt) => {
    if (!ref.current) return;
    ref.current.rotation.y += dt * 0.22;
    ref.current.rotation.x += dt * 0.06;
  });
  return (
    <Float speed={1.1} rotationIntensity={0.28} floatIntensity={0.6}>
      <mesh ref={ref}>
        <icosahedronGeometry args={[1.15, 0]} />
        <MeshTransmissionMaterial
          background={bg}
          samples={8}
          resolution={640}
          thickness={0.55}
          roughness={0.04}
          transmission={1}
          ior={1.42}
          chromaticAberration={0.45}
          anisotropy={0.2}
          distortion={0.2}
          distortionScale={0.3}
          temporalDistortion={0.1}
          backside={true}
          backsideThickness={0.4}
          attenuationColor="#d9c4ff"
          attenuationDistance={3}
        />
      </mesh>
    </Float>
  );
}

export default function GlassObject() {
  return (
    <Canvas
      camera={{ position: [0, 0, 7.4], fov: 30 }}
      gl={{ alpha: true, antialias: true }}
      dpr={[1, 1.5]}
    >
      <ambientLight intensity={0.6} />
      <Environment resolution={256}>
        {/* baza — zeby srodowisko nie bylo czarne */}
        <Lightformer intensity={0.7} color="#8b76c9" position={[0, 0, -5]} scale={[12, 12, 1]} />
        <Lightformer intensity={3} color="#c084fc" position={[0, 3, 4]} scale={[9, 6, 1]} />
        <Lightformer intensity={2.4} color="#38bdf8" position={[-5, -1, 3]} scale={[6, 8, 1]} />
        <Lightformer intensity={2.2} color="#ff2e97" position={[5, 1.5, 2]} scale={[6, 8, 1]} />
        <Lightformer intensity={1.6} color="#ffffff" position={[0, -4, 3]} scale={[8, 4, 1]} />
      </Environment>
      <Crystal />
    </Canvas>
  );
}
