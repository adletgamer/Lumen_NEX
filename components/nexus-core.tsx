"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useAnimationFrame } from "framer-motion";

type NexusState = "idle" | "processing";

interface NexusCoreProps {
  state?: NexusState;
  size?: number;
  className?: string;
}

interface Particle {
  x: number;
  y: number;
  angle: number;
  radius: number;
  speed: number;
  size: number;
  opacity: number;
}

const IDLE_COLOR = "#00d4aa";
const PROCESSING_COLOR = "#6366f1";
const PARTICLE_COUNT = 80;

export function NexusCore({
  state = "idle",
  size = 320,
  className,
}: NexusCoreProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const timeRef = useRef(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    particlesRef.current = Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
      angle: (i / PARTICLE_COUNT) * Math.PI * 2,
      radius: 60 + Math.random() * 50,
      speed: 0.002 + Math.random() * 0.003,
      size: 1 + Math.random() * 2.5,
      opacity: 0.3 + Math.random() * 0.7,
      x: 0,
      y: 0,
    }));
  }, []);

  useAnimationFrame((time) => {
    if (!canvasRef.current || !mounted) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    timeRef.current = time * 0.001;
    const t = timeRef.current;
    const cx = size / 2;
    const cy = size / 2;
    const color = state === "processing" ? PROCESSING_COLOR : IDLE_COLOR;

    ctx.clearRect(0, 0, size, size);

    // Core glow gradient
    const pulseScale = 1 + Math.sin(t * (state === "processing" ? 4 : 1.5)) * 0.06;
    const glowRadius = 55 * pulseScale;

    const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, glowRadius * 2);
    gradient.addColorStop(0, `${color}40`);
    gradient.addColorStop(0.4, `${color}20`);
    gradient.addColorStop(1, "transparent");

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(cx, cy, glowRadius * 2, 0, Math.PI * 2);
    ctx.fill();

    // Inner core sphere
    const coreGrad = ctx.createRadialGradient(
      cx - glowRadius * 0.3,
      cy - glowRadius * 0.3,
      0,
      cx,
      cy,
      glowRadius * 0.9
    );
    coreGrad.addColorStop(0, `${color}cc`);
    coreGrad.addColorStop(0.5, `${color}66`);
    coreGrad.addColorStop(1, `${color}11`);

    ctx.fillStyle = coreGrad;
    ctx.beginPath();
    ctx.arc(cx, cy, glowRadius * 0.9, 0, Math.PI * 2);
    ctx.fill();

    // Orbital ring
    ctx.strokeStyle = `${color}30`;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.ellipse(cx, cy, glowRadius * 1.8, glowRadius * 0.5, t * 0.3, 0, Math.PI * 2);
    ctx.stroke();

    ctx.strokeStyle = `${color}20`;
    ctx.beginPath();
    ctx.ellipse(cx, cy, glowRadius * 1.5, glowRadius * 0.4, -t * 0.2, 0, Math.PI * 2);
    ctx.stroke();

    // Particles
    particlesRef.current.forEach((p) => {
      p.angle += p.speed * (state === "processing" ? 2 : 1);
      const wave = Math.sin(t * 2 + p.angle * 3) * 8;
      const r = p.radius + wave;
      p.x = cx + Math.cos(p.angle) * r;
      p.y = cy + Math.sin(p.angle) * r * 0.6;

      const dist = Math.hypot(p.x - cx, p.y - cy);
      const depthOpacity = 0.2 + (p.y - cy + size / 2) / size;

      ctx.fillStyle = `${color}${Math.floor(p.opacity * depthOpacity * 255)
        .toString(16)
        .padStart(2, "0")}`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * (state === "processing" ? 1.3 : 1), 0, Math.PI * 2);
      ctx.fill();

      // Connection lines between nearby particles
      if (dist < glowRadius * 2.2 && p.opacity > 0.7) {
        ctx.strokeStyle = `${color}0a`;
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(p.x, p.y);
        ctx.stroke();
      }
    });

    // Central bright dot
    const dotGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, 12);
    dotGrad.addColorStop(0, `${color}ff`);
    dotGrad.addColorStop(0.5, `${color}99`);
    dotGrad.addColorStop(1, "transparent");
    ctx.fillStyle = dotGrad;
    ctx.beginPath();
    ctx.arc(cx, cy, 12, 0, Math.PI * 2);
    ctx.fill();
  });

  return (
    <div
      className={className}
      style={{ width: size, height: size, position: "relative" }}
    >
      {/* Outer ambient glow */}
      <motion.div
        className="absolute inset-0 rounded-full"
        animate={{
          boxShadow:
            state === "processing"
              ? [
                  "0 0 60px rgba(99,102,241,0.3), 0 0 120px rgba(99,102,241,0.1)",
                  "0 0 90px rgba(99,102,241,0.5), 0 0 180px rgba(99,102,241,0.2)",
                  "0 0 60px rgba(99,102,241,0.3), 0 0 120px rgba(99,102,241,0.1)",
                ]
              : [
                  "0 0 60px rgba(0,212,170,0.2), 0 0 120px rgba(0,212,170,0.08)",
                  "0 0 80px rgba(0,212,170,0.35), 0 0 160px rgba(0,212,170,0.12)",
                  "0 0 60px rgba(0,212,170,0.2), 0 0 120px rgba(0,212,170,0.08)",
                ],
        }}
        transition={{
          duration: state === "processing" ? 0.8 : 2.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <canvas
        ref={canvasRef}
        width={size}
        height={size}
        style={{ imageRendering: "pixelated" }}
        aria-label={`Nexus Core — ${state}`}
        role="img"
      />
    </div>
  );
}
