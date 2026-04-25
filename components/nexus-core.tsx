"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame, extend } from "@react-three/fiber";
import { shaderMaterial } from "@react-three/drei";
import * as THREE from "three";

// ── Custom GLSL Shader ───────────────────────────────────────────────────────
const NexusShaderMaterial = shaderMaterial(
  {
    uTime: 0,
    uProcessing: 0,
    uColorA: new THREE.Color("#00d4aa"),
    uColorB: new THREE.Color("#6366f1"),
    uColorC: new THREE.Color("#0ea5e9"),
  },
  /* vertex */
  `
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vPosition;
    void main() {
      vUv = uv;
      vNormal = normalize(normalMatrix * normal);
      vPosition = position;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  /* fragment */
  `
    uniform float uTime;
    uniform float uProcessing;
    uniform vec3 uColorA;
    uniform vec3 uColorB;
    uniform vec3 uColorC;
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vPosition;

    vec3 hash3(vec3 p) {
      p = fract(p * vec3(0.1031, 0.1030, 0.0973));
      p += dot(p, p.yxz + 33.33);
      return fract((p.xxy + p.yxx) * p.zyx);
    }
    float noise(vec3 p) {
      vec3 i = floor(p); vec3 f = fract(p);
      vec3 u = f * f * (3.0 - 2.0 * f);
      float a = dot(hash3(i),              f);
      float b = dot(hash3(i + vec3(1,0,0)), f - vec3(1,0,0));
      float c = dot(hash3(i + vec3(0,1,0)), f - vec3(0,1,0));
      float d = dot(hash3(i + vec3(1,1,0)), f - vec3(1,1,0));
      float e = dot(hash3(i + vec3(0,0,1)), f - vec3(0,0,1));
      float ff= dot(hash3(i + vec3(1,0,1)), f - vec3(1,0,1));
      float g = dot(hash3(i + vec3(0,1,1)), f - vec3(0,1,1));
      float h = dot(hash3(i + vec3(1,1,1)), f - vec3(1,1,1));
      return mix(mix(mix(a,b,u.x),mix(c,d,u.x),u.y),
                 mix(mix(e,ff,u.x),mix(g,h,u.x),u.y),u.z)*0.5+0.5;
    }
    float fbm(vec3 p) {
      float v = 0.0; float a = 0.5;
      for(int i=0;i<5;i++){v+=a*noise(p);p=p*2.0+vec3(1.7,9.2,3.1);a*=0.5;}
      return v;
    }
    void main() {
      float spd = mix(0.35, 1.5, uProcessing);
      vec3 p = vPosition * 2.2 + vec3(uTime * spd * 0.28);
      float n1 = fbm(p);
      float n2 = fbm(p + vec3(uTime * spd * 0.13, 0.0, uTime * spd * 0.09));
      float swirl = fbm(vPosition * 2.8 + vec3(sin(uTime*spd*0.5)*2.0, cos(uTime*spd*0.3)*2.0, uTime*spd*0.18));

      vec3 col = mix(uColorA, uColorB, n1);
      col = mix(col, uColorC, n2 * 0.55);
      col = mix(col, uColorA * 1.6, swirl * 0.38);

      float fresnel = pow(1.0 - abs(dot(vNormal, vec3(0.0,0.0,1.0))), 2.8);
      col += mix(uColorA, uColorB, uProcessing) * fresnel * 1.4;

      float pulse = 0.82 + 0.18 * sin(uTime * spd * mix(1.8, 5.5, uProcessing));
      col *= pulse;

      float streak = smoothstep(0.62, 1.0, swirl) * mix(0.3, 1.2, uProcessing);
      col += uColorA * streak * 0.35;

      gl_FragColor = vec4(col, 0.9 + fresnel * 0.1);
    }
  `
);

extend({ NexusShaderMaterial });

// ── Orb Scene ────────────────────────────────────────────────────────────────
function OrbScene({ processing }: { processing: boolean }) {
  const matRef = useRef<THREE.ShaderMaterial & { uTime: number; uProcessing: number }>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);

  const glowMat = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: processing ? "#6366f1" : "#00d4aa",
        transparent: true,
        opacity: 0.1,
        side: THREE.BackSide,
        depthWrite: false,
      }),
    [processing]
  );

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (matRef.current) {
      matRef.current.uTime = t;
      matRef.current.uProcessing = THREE.MathUtils.lerp(
        matRef.current.uProcessing,
        processing ? 1.0 : 0.0,
        0.04
      );
    }
    if (glowRef.current) {
      glowRef.current.scale.setScalar(1.26 + Math.sin(t * (processing ? 2.8 : 1.1)) * 0.05);
    }
    if (ring1Ref.current) {
      ring1Ref.current.rotation.y = t * 0.4;
      ring1Ref.current.rotation.z = t * 0.15;
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.y = -t * 0.3;
      ring2Ref.current.rotation.x = t * 0.2;
    }
  });

  return (
    <>
      {/* Fake glow shell — use raw <mesh> so ref forwards correctly */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[1, 32, 32]} />
        <primitive object={glowMat} attach="material" />
      </mesh>

      {/* Main orb with GLSL shader */}
      <mesh>
        <sphereGeometry args={[0.78, 128, 128]} />
        {/* @ts-expect-error custom extended material */}
        <nexusShaderMaterial
          ref={matRef}
          uTime={0}
          uProcessing={0}
          uColorA={new THREE.Color("#00d4aa")}
          uColorB={new THREE.Color("#6366f1")}
          uColorC={new THREE.Color("#0ea5e9")}
          transparent
        />
      </mesh>

      {/* Orbital rings */}
      <mesh ref={ring1Ref} rotation={[Math.PI / 2.4, 0, 0]}>
        <torusGeometry args={[1.06, 0.007, 8, 128]} />
        <meshBasicMaterial color="#00d4aa" transparent opacity={0.3} depthWrite={false} />
      </mesh>
      <mesh ref={ring2Ref} rotation={[Math.PI / 3.5, Math.PI / 5, 0]}>
        <torusGeometry args={[1.18, 0.004, 8, 128]} />
        <meshBasicMaterial color="#6366f1" transparent opacity={0.18} depthWrite={false} />
      </mesh>
    </>
  );
}

// ── Public Component ──────────────────────────────────────────────────────────
export type NexusState = "idle" | "processing";

interface NexusCoreProps {
  state?: NexusState;
  size?: number;
  className?: string;
}

export function NexusCore({ state = "idle", size = 320, className }: NexusCoreProps) {
  return (
    <div
      style={{ width: size, height: size, position: "relative", flexShrink: 0 }}
      className={className}
      aria-label={`NexusCore — ${state}`}
      role="img"
    >
      {/* Ambient glow behind canvas */}
      <div
        style={{
          position: "absolute",
          inset: "15%",
          borderRadius: "50%",
          background:
            state === "processing"
              ? "radial-gradient(circle, rgba(99,102,241,0.4) 0%, transparent 70%)"
              : "radial-gradient(circle, rgba(0,212,170,0.32) 0%, transparent 70%)",
          filter: "blur(24px)",
          pointerEvents: "none",
          transition: "background 0.8s ease",
        }}
        aria-hidden="true"
      />
      <Canvas
        dpr={[1, 2]}
        camera={{ position: [0, 0, 2.6], fov: 42 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[2, 2, 2]} intensity={1.4} color="#00d4aa" />
        <pointLight position={[-2, -1, -2]} intensity={0.7} color="#6366f1" />
        <OrbScene processing={state === "processing"} />
      </Canvas>
    </div>
  );
}
