"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Sphere, MeshDistortMaterial } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";

// ── Type for MeshDistortMaterial ref ─────────────────────────────────────────
type DistortMaterialRef = THREE.MeshStandardMaterial & {
  distort: number;
  speed: number;
};

// ── Inner Orb Scene ───────────────────────────────────────────────────────────
function OrbScene({ isThinking }: { isThinking: boolean }) {
  // innerRef syncs distort amplitude with the isThinking prop
  const innerRef = useRef<DistortMaterialRef>(null);

  useFrame((_, delta) => {
    if (!innerRef.current) return;
    const target = isThinking ? 0.55 : 0.3;
    innerRef.current.distort = THREE.MathUtils.lerp(
      innerRef.current.distort,
      target,
      delta * 2.5
    );
  });

  return (
    <Float
      speed={isThinking ? 3 : 1.6}
      rotationIntensity={isThinking ? 1.2 : 0.5}
      floatIntensity={isThinking ? 1.8 : 1.0}
    >
      {/* Amethyst point light co-moves with the Float */}
      <pointLight
        color="#A855F7"
        intensity={isThinking ? 3.5 : 2}
        distance={6}
        decay={2}
      />
      <pointLight
        color="#6366F1"
        intensity={1}
        position={[-1.5, -1, 1]}
        distance={5}
        decay={2}
      />

      <Sphere args={[1, 64, 64]}>
        <MeshDistortMaterial
          ref={innerRef}
          color="#6366F1"
          speed={4}
          distort={0.3}
          roughness={0.08}
          metalness={0.2}
          emissive="#4f46e5"
          emissiveIntensity={isThinking ? 0.6 : 0.3}
          envMapIntensity={1.2}
        />
      </Sphere>
    </Float>
  );
}

// ── Public Component ──────────────────────────────────────────────────────────
export type NexusState = "idle" | "processing";

interface NexusCoreProps {
  state?: NexusState;
  isThinking?: boolean;
  size?: number;
  className?: string;
}

export function NexusCore({
  state = "idle",
  isThinking,
  size = 320,
  className,
}: NexusCoreProps) {
  const thinking = isThinking ?? state === "processing";

  return (
    <div
      style={{ width: size, height: size, position: "relative", flexShrink: 0 }}
      className={className}
      aria-label={`NexusCore — ${thinking ? "thinking" : "idle"}`}
      role="img"
    >
      {/* Radial amethyst glow behind the canvas for depth */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: "10%",
          borderRadius: "50%",
          background: thinking
            ? "radial-gradient(circle, rgba(168,85,247,0.50) 0%, rgba(99,102,241,0.25) 45%, transparent 75%)"
            : "radial-gradient(circle, rgba(99,102,241,0.35) 0%, rgba(168,85,247,0.15) 45%, transparent 72%)",
          filter: "blur(32px)",
          pointerEvents: "none",
          transition: "background 1s ease",
          zIndex: 0,
        }}
      />
      {/* Outer ambient halo */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: "-5%",
          borderRadius: "50%",
          background: thinking
            ? "radial-gradient(circle, rgba(168,85,247,0.18) 0%, transparent 65%)"
            : "radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 65%)",
          filter: "blur(48px)",
          pointerEvents: "none",
          transition: "background 1s ease",
          zIndex: 0,
        }}
      />

      <Canvas
        dpr={[1, 2]}
        camera={{ position: [0, 0, 3.2], fov: 40 }}
        gl={{ antialias: true, alpha: true }}
        style={{ position: "relative", zIndex: 1, background: "transparent" }}
      >
        <ambientLight intensity={0.25} color="#1e1b4b" />
        <OrbScene isThinking={thinking} />
        <EffectComposer>
          <Bloom
            intensity={thinking ? 2.2 : 1.1}
            luminanceThreshold={0.2}
            luminanceSmoothing={0.7}
            mipmapBlur
          />
        </EffectComposer>
      </Canvas>
    </div>
  );
}
