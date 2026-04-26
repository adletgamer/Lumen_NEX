"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame, extend } from "@react-three/fiber";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { shaderMaterial } from "@react-three/drei";
import * as THREE from "three";

// ── Amethyst Nebula Shader ───────────────────────────────────────────────────
const NexusShaderMaterial = shaderMaterial(
  {
    uTime: 0,
    uThinking: 0,
    uColorA: new THREE.Color("#6366f1"), // Electric Indigo
    uColorB: new THREE.Color("#8b5cf6"), // Vivid Purple
    uColorC: new THREE.Color("#a855f7"), // Amethyst
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
  /* fragment — fBm swirling nebula */
  `
    uniform float uTime;
    uniform float uThinking;
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
      float a = dot(hash3(i),               f);
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
      for(int i=0;i<5;i++){v+=a*noise(p);p=p*2.1+vec3(1.7,9.2,3.1);a*=0.5;}
      return v;
    }
    void main() {
      float spd = mix(0.3, 1.8, uThinking);
      vec3 p = vPosition * 2.4 + vec3(uTime * spd * 0.25);
      float n1 = fbm(p);
      float n2 = fbm(p + vec3(uTime * spd * 0.14, 0.0, uTime * spd * 0.08));
      float swirl = fbm(vPosition * 3.0 + vec3(
        sin(uTime * spd * 0.45) * 2.1,
        cos(uTime * spd * 0.28) * 2.1,
        uTime * spd * 0.17
      ));

      vec3 col = mix(uColorA, uColorB, n1);
      col = mix(col, uColorC, n2 * 0.6);
      col = mix(col, uColorA * 1.8, swirl * 0.4);

      // Fresnel rim glow — violet edge
      float fresnel = pow(1.0 - abs(dot(vNormal, vec3(0,0,1))), 2.5);
      col += mix(uColorB, uColorC, uThinking) * fresnel * 1.6;

      // Pulse intensity — heartbeat rhythm when thinking
      float pulse = 0.80 + 0.20 * sin(uTime * spd * mix(1.6, 6.0, uThinking));
      col *= pulse;

      // Bright energy streaks
      float streak = smoothstep(0.65, 1.0, swirl) * mix(0.25, 1.4, uThinking);
      col += uColorC * streak * 0.45;

      gl_FragColor = vec4(col, 0.92 + fresnel * 0.08);
    }
  `
);

extend({ NexusShaderMaterial });

// ── Augment @react-three/fiber's JSX namespace for the custom material ───────
type NexusShaderMaterialProps = Omit<
  import("@react-three/fiber").ThreeElements["shaderMaterial"],
  "ref"
> & {
  ref?: React.Ref<THREE.ShaderMaterial & { uTime: number; uThinking: number }>;
  uTime?: number;
  uThinking?: number;
  uColorA?: THREE.Color;
  uColorB?: THREE.Color;
  uColorC?: THREE.Color;
  transparent?: boolean;
};

declare module "@react-three/fiber" {
  interface ThreeElements {
    nexusShaderMaterial: NexusShaderMaterialProps;
  }
}

// ── Orb Scene ────────────────────────────────────────────────────────────────
function OrbScene({ isThinking }: { isThinking: boolean }) {
  const matRef = useRef<THREE.ShaderMaterial & { uTime: number; uThinking: number }>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);
  const timeRef = useRef(0);

  const glowMat = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: isThinking ? "#a855f7" : "#8b5cf6",
        transparent: true,
        opacity: 0.12,
        side: THREE.BackSide,
        depthWrite: false,
      }),
    [isThinking]
  );

  useFrame((state, delta) => {
    timeRef.current += delta;
    const t = timeRef.current;
    const rotMult = isThinking ? 2.0 : 1.0;
    if (matRef.current) {
      matRef.current.uTime = t;
      matRef.current.uThinking = THREE.MathUtils.lerp(
        matRef.current.uThinking,
        isThinking ? 1.0 : 0.0,
        0.05
      );
    }
    if (glowRef.current) {
      glowRef.current.scale.setScalar(1.28 + Math.sin(t * (isThinking ? 3.5 : 1.2)) * 0.06);
    }
    if (ring1Ref.current) {
      ring1Ref.current.rotation.y = t * 0.45 * rotMult;
      ring1Ref.current.rotation.z = t * 0.18 * rotMult;
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.y = -t * 0.32 * rotMult;
      ring2Ref.current.rotation.x = t * 0.22 * rotMult;
    }
  });

  return (
    <>
      {/* Fake glow shell */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[1, 32, 32]} />
        <primitive object={glowMat} attach="material" />
      </mesh>

      {/* Main orb — Amethyst Nebula GLSL */}
      <mesh>
        <sphereGeometry args={[0.78, 128, 128]} />
        <nexusShaderMaterial
          ref={matRef}
          uTime={0}
          uThinking={0}
          uColorA={new THREE.Color("#6366f1")}
          uColorB={new THREE.Color("#8b5cf6")}
          uColorC={new THREE.Color("#a855f7")}
          transparent
        />
      </mesh>

      {/* Orbital rings — violet */}
      <mesh ref={ring1Ref} rotation={[Math.PI / 2.4, 0, 0]}>
        <torusGeometry args={[1.06, 0.007, 8, 128]} />
        <meshBasicMaterial color="#8b5cf6" transparent opacity={0.35} depthWrite={false} />
      </mesh>
      <mesh ref={ring2Ref} rotation={[Math.PI / 3.5, Math.PI / 5, 0]}>
        <torusGeometry args={[1.18, 0.004, 8, 128]} />
        <meshBasicMaterial color="#a855f7" transparent opacity={0.22} depthWrite={false} />
      </mesh>
    </>
  );
}

// ── Public Component ─────────────────────────────────────────────────────────
export type NexusState = "idle" | "processing";

interface NexusCoreProps {
  /** Legacy prop — maps to isThinking internally */
  state?: NexusState;
  /** Direct thinking prop used by agent page */
  isThinking?: boolean;
  size?: number;
  className?: string;
}

export function NexusCore({ state = "idle", isThinking, size = 320, className }: NexusCoreProps) {
  const thinking = isThinking ?? state === "processing";

  return (
    <div
      style={{ width: size, height: size, position: "relative", flexShrink: 0 }}
      className={className}
      aria-label={`NexusCore — ${thinking ? "thinking" : "idle"}`}
      role="img"
    >
      {/* Ambient violet glow behind canvas */}
      <div
        style={{
          position: "absolute",
          inset: "15%",
          borderRadius: "50%",
          background: thinking
            ? "radial-gradient(circle, rgba(168,85,247,0.45) 0%, transparent 70%)"
            : "radial-gradient(circle, rgba(99,102,241,0.35) 0%, transparent 70%)",
          filter: "blur(28px)",
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
        <ambientLight intensity={0.4} />
        <pointLight position={[2, 2, 2]} intensity={1.2} color="#8b5cf6" />
        <pointLight position={[-2, -1, -2]} intensity={0.8} color="#a855f7" />
        <OrbScene isThinking={thinking} />
        {/* Bloom post-processing — subtle violet glow cast onto background */}
        <EffectComposer>
          <Bloom
            intensity={thinking ? 1.8 : 0.9}
            luminanceThreshold={0.3}
            luminanceSmoothing={0.6}
            mipmapBlur
          />
        </EffectComposer>
      </Canvas>
    </div>
  );
}
