import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useEffect, useRef, useState } from 'react';
import type { Group } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

type ProductObject = 'car' | 'speaker';

type ProductMaterial = {
  id: string;
  label: string;
  body: string;
  trim: string;
  accent: string;
  glow: string;
};

const MATERIALS: ProductMaterial[] = [
  { id: 'pearl', label: 'Pearl White', body: '#f5f0ea', trim: '#d8d7d4', accent: '#7bb9ff', glow: '#dfeeff' },
  { id: 'midnight', label: 'Midnight Blue', body: '#1d4e89', trim: '#a7c9ff', accent: '#8fe3ff', glow: '#93d7ff' },
  { id: 'sunset', label: 'Sunset Orange', body: '#d96a3d', trim: '#fbd8a6', accent: '#ffd166', glow: '#ffe7a8' },
];

const OBJECTS: { id: ProductObject; label: string }[] = [
  { id: 'car', label: 'Car' },
  { id: 'speaker', label: 'Smart Speaker' },
];

const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';

function SpeakerModel({ material }: { material: ProductMaterial }) {
  return (
    <group position={[0, -0.1, 0]}>
      <mesh castShadow position={[0, 0.7, 0]}>
        <cylinderGeometry args={[1.2, 1.4, 1.9, 32]} />
        <meshStandardMaterial color={material.body} metalness={0.7} roughness={0.3} />
      </mesh>

      <mesh castShadow position={[0, 1.7, 0]}>
        <cylinderGeometry args={[0.9, 1.05, 0.5, 32]} />
        <meshStandardMaterial color={material.trim} metalness={0.9} roughness={0.2} />
      </mesh>

      <mesh castShadow position={[0, 0.9, 0.98]}>
        <boxGeometry args={[1.1, 0.62, 0.18]} />
        <meshStandardMaterial color={material.accent} metalness={0.3} roughness={0.65} />
      </mesh>

      <mesh position={[0, 1.05, 1.08]}>
        <boxGeometry args={[0.7, 0.2, 0.06]} />
        <meshStandardMaterial color={material.glow} emissive={material.accent} emissiveIntensity={0.45} />
      </mesh>

      {[-0.45, 0, 0.45].map((x) => (
        <mesh key={x} castShadow position={[x, 0.45, 1.07]}>
          <sphereGeometry args={[0.12, 24, 24]} />
          <meshStandardMaterial color={material.glow} emissive={material.accent} emissiveIntensity={0.8} />
        </mesh>
      ))}

      <mesh castShadow position={[0, -0.5, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.18, 0.12, 18, 60]} />
        <meshStandardMaterial color={material.trim} metalness={0.8} roughness={0.2} />
      </mesh>
    </group>
  );
}

function CarModel({ material }: { material: ProductMaterial }) {
  return (
    <group position={[0, -0.2, 0]}>
      <mesh castShadow position={[0, 0.35, 0]}>
        <boxGeometry args={[2.8, 0.7, 1.5]} />
        <meshStandardMaterial color={material.body} metalness={0.6} roughness={0.35} />
      </mesh>

      <mesh castShadow position={[0.55, 0.85, 0]}>
        <boxGeometry args={[1.4, 0.65, 1.2]} />
        <meshStandardMaterial color={material.trim} metalness={0.8} roughness={0.2} />
      </mesh>

      <mesh position={[0.55, 0.8, 0.62]}>
        <boxGeometry args={[1.05, 0.28, 0.06]} />
        <meshStandardMaterial color={material.glow} emissive={material.accent} emissiveIntensity={0.5} />
      </mesh>

      <mesh position={[0.55, 0.8, -0.62]}>
        <boxGeometry args={[1.05, 0.28, 0.06]} />
        <meshStandardMaterial color={material.glow} emissive={material.accent} emissiveIntensity={0.5} />
      </mesh>

      {[-1.05, 1.05].map((x) => (
        <group key={x} position={[x, -0.2, 0.8]}>
          <mesh castShadow rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.36, 0.36, 0.28, 20]} />
            <meshStandardMaterial color="#1e2430" metalness={0.7} roughness={0.5} />
          </mesh>
        </group>
      ))}

      {[-1.05, 1.05].map((x) => (
        <group key={`rear-${x}`} position={[x, -0.2, -0.8]}>
          <mesh castShadow rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.36, 0.36, 0.28, 20]} />
            <meshStandardMaterial color="#1e2430" metalness={0.7} roughness={0.5} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function ProductModel({ objectType, material }: { objectType: ProductObject; material: ProductMaterial }) {
  switch (objectType) {
    case 'car':
      return <CarModel material={material} />;
    case 'speaker':
    default:
      return <SpeakerModel material={material} />;
  }
}

function SceneContent({ objectType, material, autoRotate, reducedMotion }: { objectType: ProductObject; material: ProductMaterial; autoRotate: boolean; reducedMotion: boolean }) {
  const groupRef = useRef<Group>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const { camera, gl } = useThree();

  useEffect(() => {
    const controls = new OrbitControls(camera, gl.domElement);
    controls.enableDamping = true;
    controls.enablePan = false;
    controls.enableZoom = true;
    controls.minDistance = 4;
    controls.maxDistance = 8;
    controls.minPolarAngle = Math.PI * 0.28;
    controls.maxPolarAngle = Math.PI * 0.72;
    controls.target.set(0, 0.6, 0);
    controls.autoRotate = autoRotate && !reducedMotion;
    controls.autoRotateSpeed = 1.6;
    controlsRef.current = controls;

    return () => {
      controls.dispose();
    };
  }, [camera, gl]);

  useEffect(() => {
    if (!controlsRef.current) {
      return;
    }

    controlsRef.current.autoRotate = autoRotate && !reducedMotion;
  }, [autoRotate, reducedMotion]);

  useFrame(() => {
    if (controlsRef.current) {
      controlsRef.current.update();
    }

    if (groupRef.current && autoRotate && !reducedMotion) {
      groupRef.current.rotation.y += 0.004;
    }
  });

  return (
    <>
      <color attach="background" args={['#071521']} />
      <fog attach="fog" args={['#071521', 6, 12]} />

      <ambientLight intensity={1.2} />
      <directionalLight position={[3, 5, 4]} intensity={1.5} castShadow shadow-mapSize-width={1024} shadow-mapSize-height={1024} />
      <pointLight position={[-3, 2, 3]} intensity={1.1} color={material.accent} />

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.5, 0]} receiveShadow>
        <circleGeometry args={[4.5, 64]} />
        <meshStandardMaterial color="#101d2b" roughness={0.9} metalness={0.1} />
      </mesh>

      <group ref={groupRef}>
        <ProductModel objectType={objectType} material={material} />
      </group>
    </>
  );
}

export default function App() {
  const [selectedObject, setSelectedObject] = useState<ProductObject>('speaker');
  const [selectedMaterialId, setSelectedMaterialId] = useState(MATERIALS[0].id);
  const [autoRotate, setAutoRotate] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(REDUCED_MOTION_QUERY);

    const updateReducedMotion = () => {
      const isReduced = mediaQuery.matches;
      setReducedMotion(isReduced);
      if (isReduced) {
        setAutoRotate(false);
      }
    };

    updateReducedMotion();
    mediaQuery.addEventListener('change', updateReducedMotion);

    return () => mediaQuery.removeEventListener('change', updateReducedMotion);
  }, []);

  const selectedMaterial = MATERIALS.find((material) => material.id === selectedMaterialId) ?? MATERIALS[0];

  return (
    <main className="app-shell">
      <section className="product-card">
        <div className="info-panel">
          <p className="eyebrow">FlyRank</p>
          <h1>Interactive 3D Experience</h1>
          <p className="description">
            Switch between simple procedural products and explore them with live material choices and orbit controls.
          </p>

          <div className="panel-section">
            <span className="section-label">Object</span>
            <div className="object-list" role="list" aria-label="Product object options">
              {OBJECTS.map((object) => (
                <button
                  key={object.id}
                  type="button"
                  className={`object-button ${selectedObject === object.id ? 'selected' : ''}`}
                  aria-label={`Select ${object.label}`}
                  aria-pressed={selectedObject === object.id}
                  onClick={() => setSelectedObject(object.id)}
                >
                  {object.label}
                </button>
              ))}
            </div>
          </div>

          <div className="panel-section">
            <span className="section-label">Material</span>
            <div className="swatch-list" role="list" aria-label="Product material options">
              {MATERIALS.map((material) => (
                <button
                  key={material.id}
                  type="button"
                  className={`swatch ${selectedMaterial.id === material.id ? 'selected' : ''}`}
                  aria-label={`Select ${material.label}`}
                  aria-pressed={selectedMaterial.id === material.id}
                  onClick={() => setSelectedMaterialId(material.id)}
                >
                  <span className="swatch-color" style={{ background: material.body }} />
                  <span>{material.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="toggle-row">
            <label className="toggle-control" htmlFor="auto-rotate">
              <span>Auto rotate</span>
              <input
                id="auto-rotate"
                type="checkbox"
                checked={autoRotate}
                disabled={reducedMotion}
                onChange={(event) => setAutoRotate(event.target.checked)}
              />
            </label>
          </div>

          <div className="status-text">
            {reducedMotion ? 'Reduced motion enabled: static preview mode.' : 'Drag to inspect the selected product from any angle.'}
          </div>
        </div>

        <div className="viewer-panel">
          <Canvas camera={{ position: [0, 1.2, 5.3], fov: 35 }} shadows>
            <SceneContent objectType={selectedObject} material={selectedMaterial} autoRotate={autoRotate} reducedMotion={reducedMotion} />
          </Canvas>
        </div>
      </section>
    </main>
  );
}
