import { useEffect, useRef } from "react";
import { useTheme } from "@/components/ThemeProvider";
import { getThemeFx, type ThemeFxProfile } from "@/lib/theme-fx";

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  color: string;
  spin: number;
  kind: "core" | "ghost" | "burst";
  /** chromatic offset for steel ghosts */
  chroma?: number;
};

type PointerSample = { x: number; y: number; t: number };

const MAX_HISTORY = 48;

function rand(min: number, max: number) {
  return min + Math.random() * (max - min);
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]!;
}

function spawnParticle(
  x: number,
  y: number,
  fx: ThemeFxProfile,
  kind: Particle["kind"] = "core",
): Particle {
  const angle = Math.random() * Math.PI * 2;
  let speed = rand(0.2, 1.8);
  if (fx.style === "sparks") speed = rand(0.8, 3.5);
  if (fx.style === "dust") speed = rand(0.3, 2.2);
  if (fx.style === "embers") speed = rand(0.15, 1.2);
  if (fx.style === "motes") speed = rand(0.05, 0.7);
  if (fx.style === "steel") speed = rand(0.4, 2.4);

  let vx = Math.cos(angle) * speed + fx.windX * rand(0.5, 1.5);
  let vy = Math.sin(angle) * speed + fx.windY * rand(0.5, 1.5);

  if (fx.style === "embers") {
    vx = rand(-0.4, 0.4) + fx.windX;
    vy = rand(-1.6, -0.3) + fx.windY;
  }
  if (fx.style === "dust") {
    vx = rand(0.4, 2.2) * (Math.random() > 0.35 ? 1 : -0.4) + fx.windX * 4;
    vy = rand(-0.6, 0.8);
  }
  if (kind === "ghost") {
    vx *= 0.35;
    vy *= 0.35;
  }
  if (kind === "burst") {
    const a = Math.random() * Math.PI * 2;
    const s = rand(1.5, 4.5);
    vx = Math.cos(a) * s;
    vy = Math.sin(a) * s;
  }

  return {
    x,
    y,
    vx,
    vy,
    life: 0,
    maxLife: rand(fx.lifeMin, fx.lifeMax) * (kind === "ghost" ? 0.85 : 1),
    size: rand(fx.sizeMin, fx.sizeMax) * (kind === "ghost" ? 0.7 : 1),
    color: pick(fx.colors),
    spin: rand(-0.08, 0.08),
    kind,
    chroma: fx.style === "steel" && kind === "ghost" ? rand(1.5, 4) : 0,
  };
}

/**
 * Full-viewport canvas FX driven by the active theme.
 * pointer-events: none — never steals clicks from ThemePicker / UI.
 */
export function PointerFx() {
  const { themeId } = useTheme();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const themeIdRef = useRef(themeId);
  themeIdRef.current = themeId;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;

    if (reduced) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        canvas.width = 0;
        canvas.height = 0;
      }
      return;
    }

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let raf = 0;
    let running = true;
    let w = 0;
    let h = 0;
    let dpr = 1;
    const particles: Particle[] = [];
    const history: PointerSample[] = [];
    let pointer = { x: -9999, y: -9999, active: false };
    let lastT = performance.now();
    let ambientAcc = 0;
    let moveAcc = 0;
    let lastMove = { x: -9999, y: -9999 };

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const onMove = (e: PointerEvent) => {
      pointer.x = e.clientX;
      pointer.y = e.clientY;
      pointer.active = true;
      history.push({ x: e.clientX, y: e.clientY, t: performance.now() });
      while (history.length > MAX_HISTORY) history.shift();
    };

    const onLeave = () => {
      pointer.active = false;
    };

    const onDown = (e: PointerEvent) => {
      pointer.x = e.clientX;
      pointer.y = e.clientY;
      pointer.active = true;
      const fx = getThemeFx(themeIdRef.current);
      const n = fx.burst;
      for (let i = 0; i < n; i++) {
        if (particles.length >= fx.maxParticles) particles.shift();
        particles.push(spawnParticle(e.clientX, e.clientY, fx, "burst"));
      }
    };

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("pointerleave", onLeave);
    document.addEventListener("mouseleave", onLeave);

    const tick = (now: number) => {
      if (!running) return;
      const dt = Math.min(0.033, (now - lastT) / 1000);
      lastT = now;
      const fx = getThemeFx(themeIdRef.current);

      // ambient spawn
      ambientAcc += fx.ambientRate * dt;
      while (ambientAcc >= 1) {
        ambientAcc -= 1;
        if (particles.length < fx.maxParticles) {
          const x = rand(0, w);
          const y = fx.style === "embers" ? h + rand(0, 40) : rand(0, h);
          particles.push(spawnParticle(x, y, fx, "core"));
        }
      }

      // move spawn + delayed ghosts
      if (pointer.active) {
        const dx = pointer.x - lastMove.x;
        const dy = pointer.y - lastMove.y;
        const speed = Math.hypot(dx, dy);
        if (speed > 0.5) {
          moveAcc += fx.moveRate * dt * Math.min(speed / 12, 3);
          while (moveAcc >= 1) {
            moveAcc -= 1;
            if (particles.length < fx.maxParticles) {
              particles.push(
                spawnParticle(
                  pointer.x + rand(-6, 6),
                  pointer.y + rand(-6, 6),
                  fx,
                  "core",
                ),
              );
            }
          }
        }
        lastMove.x = pointer.x;
        lastMove.y = pointer.y;

        // delayed trail ghosts
        const targetT = now - fx.trailDelayMs;
        for (let i = 0; i < fx.trailCount; i++) {
          const lookback = targetT - i * (fx.trailDelayMs / Math.max(fx.trailCount, 1));
          let sample: PointerSample | null = null;
          for (let j = history.length - 1; j >= 0; j--) {
            const s = history[j]!;
            if (s.t <= lookback) {
              sample = s;
              break;
            }
          }
          if (sample && Math.random() < 0.35 * dt * 60) {
            if (particles.length < fx.maxParticles) {
              particles.push(spawnParticle(sample.x, sample.y, fx, "ghost"));
            }
          }
        }
      }

      // physics
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i]!;
        p.life += dt;
        if (p.life >= p.maxLife) {
          particles.splice(i, 1);
          continue;
        }

        // proximity warp — push particles near pointer
        if (pointer.active && fx.warpStrength > 0) {
          const wx = p.x - pointer.x;
          const wy = p.y - pointer.y;
          const dist = Math.hypot(wx, wy) || 1;
          if (dist < fx.warpRadius) {
            const falloff = 1 - dist / fx.warpRadius;
            const force = falloff * falloff * fx.warpStrength * 180 * dt;
            p.vx += (wx / dist) * force;
            p.vy += (wy / dist) * force;
          }
        }

        p.vx += fx.windX * dt * 10;
        p.vy += (fx.gravity + fx.windY) * dt * 60;
        if (fx.style === "dust") {
          p.vx += Math.sin(now * 0.002 + p.y * 0.01) * 0.04;
        }
        if (fx.style === "embers") {
          p.vx += Math.sin(now * 0.003 + p.y * 0.02) * 0.03;
        }

        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.992;
        p.vy *= 0.992;

        if (p.x < -40 || p.x > w + 40 || p.y < -40 || p.y > h + 40) {
          particles.splice(i, 1);
        }
      }

      // draw
      ctx.clearRect(0, 0, w, h);

      if (fx.additive) {
        ctx.globalCompositeOperation = "lighter";
      } else {
        ctx.globalCompositeOperation = "source-over";
      }

      // soft proximity glow / warp ring
      if (pointer.active) {
        const g = ctx.createRadialGradient(
          pointer.x,
          pointer.y,
          0,
          pointer.x,
          pointer.y,
          fx.warpRadius,
        );
        const c0 = fx.colors[0] ?? "#fff";
        g.addColorStop(0, withAlpha(c0, 0.14));
        g.addColorStop(0.45, withAlpha(c0, 0.05));
        g.addColorStop(1, withAlpha(c0, 0));
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(pointer.x, pointer.y, fx.warpRadius, 0, Math.PI * 2);
        ctx.fill();

        // outer warp ring
        ctx.strokeStyle = withAlpha(c0, 0.2);
        ctx.lineWidth = 1.25;
        ctx.beginPath();
        ctx.arc(
          pointer.x,
          pointer.y,
          fx.warpRadius * (0.72 + Math.sin(now * 0.006) * 0.04),
          0,
          Math.PI * 2,
        );
        ctx.stroke();
      }

      for (const p of particles) {
        const t = p.life / p.maxLife;
        const alpha = p.kind === "ghost" ? (1 - t) * 0.45 : (1 - t) * 0.85;
        const size = p.size * (1 - t * 0.35);

        if (p.chroma && p.chroma > 0) {
          // chromatic ghost (pipeline)
          ctx.fillStyle = withAlpha("#38bdf8", alpha * 0.5);
          ctx.beginPath();
          ctx.arc(p.x - p.chroma, p.y, size, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = withAlpha("#f87171", alpha * 0.45);
          ctx.beginPath();
          ctx.arc(p.x + p.chroma, p.y, size, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.fillStyle = withAlpha(p.color, alpha);
        ctx.beginPath();
        if (fx.style === "sparks" && p.kind !== "ghost") {
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(Math.atan2(p.vy, p.vx));
          ctx.fillRect(-size * 2, -size * 0.35, size * 4, size * 0.7);
          ctx.restore();
        } else if (fx.style === "dust") {
          ctx.arc(p.x, p.y, size * (0.6 + Math.random() * 0.05), 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      ctx.globalCompositeOperation = "source-over";
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-fx-canvas"
      aria-hidden
      data-theme-fx={themeId}
    />
  );
}

function withAlpha(color: string, alpha: number): string {
  const a = Math.max(0, Math.min(1, alpha));
  if (color.startsWith("#") && (color.length === 7 || color.length === 4)) {
    const hex =
      color.length === 4
        ? `#${color[1]}${color[1]}${color[2]}${color[2]}${color[3]}${color[3]}`
        : color;
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r},${g},${b},${a})`;
  }
  return color;
}
