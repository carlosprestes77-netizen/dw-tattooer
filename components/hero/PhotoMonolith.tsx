"use client";

import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

/**
 * Cena 3D do Hero — a foto de fundo montada num "monólito" (placa 3D) que gira
 * lentamente e surge com uma animação de revelação. Inspirado na abertura do
 * monolithstudio.com. Sem assets externos além da própria foto.
 */

const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const PHOTO = `${BASE}/portfolio/hero.jpg`;

/** Reflexos de estúdio (bordas metálicas) sem precisar baixar HDR. */
function StudioEnvironment() {
  const { gl, scene } = useThree();
  useEffect(() => {
    const pmrem = new THREE.PMREMGenerator(gl);
    const envTex = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = envTex;
    return () => {
      envTex.dispose();
      pmrem.dispose();
    };
  }, [gl, scene]);
  return null;
}

function useReducedMotion() {
  const ref = useRef(false);
  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    ref.current = mq.matches;
    const on = () => (ref.current = mq.matches);
    mq.addEventListener?.("change", on);
    return () => mq.removeEventListener?.("change", on);
  }, []);
  return ref;
}

function Monolith() {
  const pivot = useRef<THREE.Group>(null!); // tilt do mouse + parallax + reveal
  const roller = useRef<THREE.Group>(null!); // rotação no eixo vertical
  const scroll = useRef(0);
  const start = useRef<number | null>(null); // tempo de início p/ revelação
  const reduced = useReducedMotion();
  const { pointer } = useThree();

  const tex = useLoader(THREE.TextureLoader, PHOTO);
  useMemo(() => {
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 8;
  }, [tex]);

  // proporção da foto (998x1600) -> placa retrato
  const W = 2.7;
  const H = (W * tex.image?.height) / (tex.image?.width || 1) || W * 1.6;
  const D = 0.16;

  // materiais das 6 faces do box: frente e verso com a foto, bordas metálicas
  const { materials, faceMats } = useMemo(() => {
    const front = new THREE.MeshBasicMaterial({ map: tex, toneMapped: false, transparent: true });
    const backTex = tex.clone();
    backTex.wrapS = THREE.RepeatWrapping;
    backTex.repeat.x = -1; // espelha o verso
    backTex.offset.x = 1;
    backTex.colorSpace = THREE.SRGBColorSpace;
    const back = new THREE.MeshBasicMaterial({ map: backTex, toneMapped: false, transparent: true });
    const edge = new THREE.MeshStandardMaterial({
      color: "#0c0a08",
      metalness: 0.9,
      roughness: 0.45,
      envMapIntensity: 0.9,
      transparent: true,
    });
    // ordem do BoxGeometry: [px, nx, py, ny, pz(frente), nz(verso)]
    const faces = [edge, edge, edge, edge, front, back];
    return { materials: [front, back, edge], faceMats: faces };
  }, [tex]);

  // progresso de scroll dentro da primeira tela
  useEffect(() => {
    const onScroll = () => {
      const h = window.innerHeight || 1;
      scroll.current = Math.min(1, Math.max(0, window.scrollY / h));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    return () => {
      materials.forEach((m) => {
        m.map?.dispose?.();
        m.dispose();
      });
    };
  }, [materials]);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    const still = reduced.current;
    if (start.current === null) start.current = t;

    // revelação: 0 -> 1 em ~1.4s (ease-out)
    const elapsed = t - start.current;
    const p = still ? 1 : Math.min(1, elapsed / 1.4);
    const ease = 1 - Math.pow(1 - p, 3);

    // rotação no eixo vertical: oscila suave (sempre visível) + impulso do scroll
    // entra girando de -0.9rad e assenta conforme revela ("aparecendo")
    const oscillate = still ? 0 : Math.sin(t * 0.32) * 0.46; // ~±26°
    const scrollSpin = scroll.current * 1.1; // scroll vira mais a placa
    const revealRot = (1 - ease) * -0.9;
    roller.current.rotation.y = oscillate + scrollSpin + revealRot;

    // pivô: parallax do mouse + leve flutuação + reveal (escala/altura)
    const targetYaw = pointer.x * 0.18;
    const targetPitch = -pointer.y * 0.12;
    pivot.current.rotation.y += (targetYaw - pivot.current.rotation.y) * 0.04;
    pivot.current.rotation.x += (targetPitch - pivot.current.rotation.x) * 0.04;
    pivot.current.position.y = (still ? 0 : Math.sin(t * 0.6) * 0.05) + (1 - ease) * -0.3;

    const s = 0.82 + 0.18 * ease;
    pivot.current.scale.setScalar(s);

    // fade-in das faces
    const op = ease;
    faceMats.forEach((m) => (m.opacity = op));
  });

  return (
    <group ref={pivot}>
      <group ref={roller}>
        <mesh material={faceMats}>
          <boxGeometry args={[W, H, D]} />
        </mesh>
      </group>
    </group>
  );
}

function Lights() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <spotLight position={[5, 7, 5]} angle={0.5} penumbra={0.8} intensity={90} color="#fff1dc" distance={30} />
      <directionalLight position={[-6, 2, -5]} intensity={1.6} color="#8fa6c4" />
      <pointLight position={[2.5, -1, 3]} intensity={10} color="#a8834f" distance={12} />
    </>
  );
}

export default function PhotoMonolith() {
  return (
    <Canvas
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      dpr={[1, 1.8]}
      camera={{ position: [0, 0, 6.2], fov: 34 }}
      style={{ pointerEvents: "none" }}
    >
      <StudioEnvironment />
      <Lights />
      <Monolith />
    </Canvas>
  );
}
