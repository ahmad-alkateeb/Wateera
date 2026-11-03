"use client";

import React, { useEffect, useRef } from "react";

/**
 * Self-contained, zero-allocation 3D Perlin/Simplex-style gradient noise
 * optimized for 60fps HTML5 Canvas flow fields alongside WebGPU / Spline 3D.
 */
function createNoise3D(seed = 1337) {
  const p = new Uint8Array(512);
  const perm = new Uint8Array(256);
  for (let i = 0; i < 256; i++) perm[i] = i;

  let s = seed >>> 0;
  for (let i = 255; i > 0; i--) {
    s = (s * 1664525 + 1013904223) >>> 0;
    const j = s % (i + 1);
    const tmp = perm[i];
    perm[i] = perm[j];
    perm[j] = tmp;
  }
  for (let i = 0; i < 512; i++) p[i] = perm[i & 255];

  const fade = (t: number) => t * t * t * (t * (t * 6 - 15) + 10);
  const lerp = (t: number, a: number, b: number) => a + t * (b - a);
  const grad = (hash: number, x: number, y: number, z: number) => {
    const h = hash & 15;
    const u = h < 8 ? x : y;
    const v = h < 4 ? y : h === 12 || h === 14 ? x : z;
    return ((h & 1) === 0 ? u : -u) + ((h & 2) === 0 ? v : -v);
  };

  return (x: number, y: number, z: number): number => {
    const X = Math.floor(x) & 255;
    const Y = Math.floor(y) & 255;
    const Z = Math.floor(z) & 255;

    const fx = x - Math.floor(x);
    const fy = y - Math.floor(y);
    const fz = z - Math.floor(z);

    const u = fade(fx);
    const v = fade(fy);
    const w = fade(fz);

    const A = p[X] + Y;
    const AA = p[A] + Z;
    const AB = p[A + 1] + Z;
    const B = p[X + 1] + Y;
    const BA = p[B] + Z;
    const BB = p[B + 1] + Z;

    return lerp(
      w,
      lerp(
        v,
        lerp(u, grad(p[AA], fx, fy, fz), grad(p[BA], fx - 1, fy, fz)),
        lerp(u, grad(p[AB], fx, fy - 1, fz), grad(p[BB], fx - 1, fy - 1, fz))
      ),
      lerp(
        v,
        lerp(u, grad(p[AA + 1], fx, fy, fz - 1), grad(p[BA + 1], fx - 1, fy, fz - 1)),
        lerp(
          u,
          grad(p[AB + 1], fx, fy - 1, fz - 1),
          grad(p[BB + 1], fx - 1, fy - 1, fz - 1)
        )
      )
    );
  };
}

export interface FlowFieldBackgroundProps {
  /** Number of ultra-fine flowing silk particles (auto-scaled on mobile viewports) */
  particleCount?: number;
  /** Spatial frequency of the sweeping noise field */
  noiseScale?: number;
  /** Base flow velocity multiplier */
  speed?: number;
  /** Translucent pitch-black background fade alpha (0.05 keeps pure black contrast) */
  trailFadeAlpha?: number;
  /** Cursor interactive vortex radius in px */
  cursorRadius?: number;
}

export const FlowFieldBackground: React.FC<FlowFieldBackgroundProps> = ({
  particleCount = 8000,
  noiseScale = 0.001,
  speed = 0.6,
  trailFadeAlpha = 0.015,
  cursorRadius = 250,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    const noise3D = createNoise3D(2026);

    let width = 0;
    let height = 0;
    let dpr = 1;
    let rafId: number | null = null;
    let isVisible = true;
    let zTime = 0;

    // Passive pointer tracking (keeps canvas pointer-events: none while reacting to mouse)
    const mouse = {
      x: -9999,
      y: -9999,
      vx: 0,
      vy: 0,
      active: false,
    };

    // Flat TypedArrays for zero GC allocations per animation frame
    const count =
      typeof window !== "undefined" && window.innerWidth < 768
        ? Math.floor(particleCount * 0.55)
        : particleCount;

    const px = new Float32Array(count);
    const py = new Float32Array(count);
    const prevX = new Float32Array(count);
    const prevY = new Float32Array(count);
    const pSpeed = new Float32Array(count);
    const life = new Float32Array(count);
    const maxLife = new Float32Array(count);

    const respawnParticle = (i: number, randomLife = false) => {
      const x = Math.random() * width;
      const y = Math.random() * height;
      px[i] = x;
      py[i] = y;
      prevX[i] = x;
      prevY[i] = y;
      pSpeed[i] = 0.8 + Math.random() * 0.55;
      maxLife[i] = 350 + Math.random() * 500;
      life[i] = randomLife ? Math.random() * maxLife[i] : 0;
    };

    const resize = () => {
      const parent = canvas.parentElement;
      width = parent ? parent.clientWidth : window.innerWidth;
      height = parent ? parent.clientHeight : window.innerHeight;
      // Cap DPR at 1.5 so Spline 3D WebGPU retains abundant GPU fill-rate budget
      dpr = Math.min(window.devicePixelRatio || 1, 1.5);

      canvas.width = Math.max(1, Math.floor(width * dpr));
      canvas.height = Math.max(1, Math.floor(height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Paint initial pitch-black canvas (#000000)
      ctx.fillStyle = "#000000";
      ctx.fillRect(0, 0, width, height);

      for (let i = 0; i < count; i++) {
        respawnParticle(i, true);
      }
    };

    resize();

    const onPointerMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const nx = e.clientX - rect.left;
      const ny = e.clientY - rect.top;
      if (mouse.active) {
        mouse.vx = (nx - mouse.x) * 0.35 + mouse.vx * 0.65;
        mouse.vy = (ny - mouse.y) * 0.35 + mouse.vy * 0.65;
      }
      mouse.x = nx;
      mouse.y = ny;
      mouse.active =
        nx >= -60 && nx <= width + 60 && ny >= -60 && ny <= height + 60;
    };

    const onPointerLeave = () => {
      mouse.active = false;
    };

    const BATCH_SIZE = 1000;

    const renderFrame = () => {
      if (!isVisible) {
        rafId = null;
        return;
      }

      // Slow coherent evolution so particles trace sharp, continuous silk streamlines
      zTime += 0.00045;
      mouse.vx *= 0.92;
      mouse.vy *= 0.92;

      // 1. Pitch-black translucent trail fade — strictly pure black to prevent muddy color artifacts
      ctx.globalCompositeOperation = "source-over";
      ctx.globalAlpha = 1;
      ctx.fillStyle = "rgba(0, 0, 0, 0.015)";
      ctx.fillRect(0, 0, width, height);

      // 2. Strict HEX Glowing Brand Gradient (#FFFFFF -> #C84BFE -> #8B5CF6 -> #4F46E5)
      const angle = zTime * 0.85;
      const cx = width * 0.5;
      const cy = height * 0.5;
      const rx = Math.cos(angle) * width * 0.55;
      const ry = Math.sin(angle) * height * 0.55;

      const flowGrad = ctx.createLinearGradient(
        cx - rx,
        cy - ry,
        cx + rx,
        cy + ry
      );
      flowGrad.addColorStop(0, "#FFFFFF"); // Pure white for the glowing core
      flowGrad.addColorStop(0.15, "#C84BFE"); // Bright purple
      flowGrad.addColorStop(0.5, "#8B5CF6"); // Mid purple
      flowGrad.addColorStop(1, "#4F46E5"); // Indigo

      const cursorRadiusSq = cursorRadius * cursorRadius;

      // 3. Update particle positions (prevX -> px) along broad, sweeping waves
      for (let i = 0; i < count; i++) {
        prevX[i] = px[i];
        prevY[i] = py[i];

        const x = px[i];
        const y = py[i];

        const n1 = noise3D(x * noiseScale, y * noiseScale, zTime);
        const n2 = noise3D(
          x * noiseScale * 0.5 + 31.7,
          y * noiseScale * 0.5 - 14.2,
          zTime * 0.6
        );
        const theta = (n1 * 1.15 + n2 * 0.55) * Math.PI * 2;

        let vx = Math.cos(theta) * pSpeed[i] * speed;
        let vy = Math.sin(theta) * pSpeed[i] * speed;

        // Interactive cursor deflection & silky vortex wake
        if (mouse.active) {
          const dx = x - mouse.x;
          const dy = y - mouse.y;
          const distSq = dx * dx + dy * dy;
          if (distSq < cursorRadiusSq && distSq > 1) {
            const dist = Math.sqrt(distSq);
            const force = (1 - dist / cursorRadius) * 2.0;
            vx +=
              (-dy / dist) * force * 0.85 +
              (dx / dist) * force * 0.45 +
              mouse.vx * 0.05 * force;
            vy +=
              (dx / dist) * force * 0.85 +
              (dy / dist) * force * 0.45 +
              mouse.vy * 0.05 * force;
          }
        }

        px[i] = x + vx;
        py[i] = y + vy;
        life[i] += 1;

        // Constant uniform respawning prevents voids & clumping
        if (Math.random() < 0.015) {
          respawnParticle(i, false);
        } else if (
          life[i] >= maxLife[i] ||
          px[i] < -20 ||
          px[i] > width + 20 ||
          py[i] < -20 ||
          py[i] > height + 20
        ) {
          respawnParticle(i, false);
        }
      }

      // 4. Connected Glowing Hair Lines with Additive Blending ("lighter")
      ctx.globalCompositeOperation = "lighter";
      ctx.strokeStyle = flowGrad;
      ctx.lineWidth = 0.6;
      ctx.globalAlpha = 0.85;
      ctx.lineCap = "round";

      for (let start = 0; start < count; start += BATCH_SIZE) {
        const end = Math.min(start + BATCH_SIZE, count);
        ctx.beginPath();
        for (let i = start; i < end; i++) {
          // Skip only the exact respawn frame (where prev === current) so connected lines never jump across screen
          if (life[i] === 0) continue;
          ctx.moveTo(prevX[i], prevY[i]);
          ctx.lineTo(px[i], py[i]);
        }
        ctx.stroke();
      }

      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = "source-over";

      rafId = requestAnimationFrame(renderFrame);
    };

    const startLoop = () => {
      if (rafId === null && isVisible) {
        rafId = requestAnimationFrame(renderFrame);
      }
    };

    const stopLoop = () => {
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
    };

    // Pause animation automatically when tab is hidden or hero scrolls out of view
    const onVisibilityChange = () => {
      isVisible = document.visibilityState === "visible";
      if (isVisible) startLoop();
      else stopLoop();
    };

    const intersectionObserver = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry) return;
        isVisible = entry.isIntersecting && document.visibilityState === "visible";
        if (isVisible) startLoop();
        else stopLoop();
      },
      { threshold: 0.01 }
    );
    intersectionObserver.observe(canvas);

    const resizeObserver = new ResizeObserver(() => resize());
    if (canvas.parentElement) {
      resizeObserver.observe(canvas.parentElement);
    }

    window.addEventListener("mousemove", onPointerMove, { passive: true });
    window.addEventListener("mouseleave", onPointerLeave, { passive: true });
    document.addEventListener("visibilitychange", onVisibilityChange);

    startLoop();

    return () => {
      stopLoop();
      intersectionObserver.disconnect();
      resizeObserver.disconnect();
      window.removeEventListener("mousemove", onPointerMove);
      window.removeEventListener("mouseleave", onPointerLeave);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [cursorRadius, noiseScale, particleCount, speed, trailFadeAlpha]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: "absolute",
        inset: 0,
        zIndex: -1,
        pointerEvents: "none",
      }}
      className="w-full h-full block select-none"
    />
  );
};
