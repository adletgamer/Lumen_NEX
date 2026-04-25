"use client";

import { useEffect, useRef } from "react";

interface Beam {
  x: number;
  y: number;
  vx: number;
  vy: number;
  length: number;
  opacity: number;
  color: string;
  life: number;
  maxLife: number;
}

export function BackgroundBeams() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const beamsRef = useRef<Beam[]>([]);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const COLORS = [
      "rgba(0,212,170,",
      "rgba(99,102,241,",
      "rgba(0,212,170,",
    ];

    const spawnBeam = (): Beam => {
      const side = Math.floor(Math.random() * 4);
      let x = 0, y = 0, vx = 0, vy = 0;
      const speed = 0.4 + Math.random() * 0.8;
      if (side === 0) { x = Math.random() * canvas.width; y = 0; vx = (Math.random() - 0.5) * speed; vy = speed; }
      else if (side === 1) { x = canvas.width; y = Math.random() * canvas.height; vx = -speed; vy = (Math.random() - 0.5) * speed; }
      else if (side === 2) { x = Math.random() * canvas.width; y = canvas.height; vx = (Math.random() - 0.5) * speed; vy = -speed; }
      else { x = 0; y = Math.random() * canvas.height; vx = speed; vy = (Math.random() - 0.5) * speed; }
      const maxLife = 180 + Math.random() * 240;
      return {
        x, y, vx, vy,
        length: 60 + Math.random() * 120,
        opacity: 0,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        life: 0,
        maxLife,
      };
    };

    for (let i = 0; i < 6; i++) beamsRef.current.push(spawnBeam());

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Aurora background orbs
      const time = Date.now() * 0.0003;
      const orbs = [
        { x: canvas.width * 0.2, y: canvas.height * 0.3, r: 300, color: "rgba(0,212,170,0.04)" },
        { x: canvas.width * 0.8, y: canvas.height * 0.6, r: 400, color: "rgba(99,102,241,0.04)" },
        { x: canvas.width * 0.5, y: canvas.height * 0.1, r: 250, color: "rgba(0,212,170,0.03)" },
      ];
      orbs.forEach((orb, i) => {
        const px = orb.x + Math.sin(time + i * 2.1) * 60;
        const py = orb.y + Math.cos(time + i * 1.7) * 40;
        const grad = ctx.createRadialGradient(px, py, 0, px, py, orb.r);
        grad.addColorStop(0, orb.color);
        grad.addColorStop(1, "transparent");
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      });

      // Beams
      if (beamsRef.current.length < 8 && Math.random() < 0.02) {
        beamsRef.current.push(spawnBeam());
      }

      beamsRef.current = beamsRef.current.filter((b) => {
        b.x += b.vx;
        b.y += b.vy;
        b.life++;

        const fadeIn = Math.min(b.life / 40, 1);
        const fadeOut = Math.max(1 - (b.life - b.maxLife * 0.7) / (b.maxLife * 0.3), 0);
        b.opacity = fadeIn * fadeOut * 0.6;

        if (b.life > b.maxLife) return false;

        const angle = Math.atan2(b.vy, b.vx);
        const tx = b.x - Math.cos(angle) * b.length;
        const ty = b.y - Math.sin(angle) * b.length;

        const gradient = ctx.createLinearGradient(tx, ty, b.x, b.y);
        gradient.addColorStop(0, `${b.color}0)`);
        gradient.addColorStop(0.7, `${b.color}${b.opacity.toFixed(2)})`);
        gradient.addColorStop(1, `${b.color}${(b.opacity * 1.5).toFixed(2)})`);

        ctx.strokeStyle = gradient;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(tx, ty);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();

        // Bright head dot
        ctx.fillStyle = `${b.color}${Math.min(b.opacity * 2, 1).toFixed(2)})`;
        ctx.beginPath();
        ctx.arc(b.x, b.y, 2, 0, Math.PI * 2);
        ctx.fill();

        return true;
      });

      rafRef.current = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-0"
      aria-hidden="true"
    />
  );
}
