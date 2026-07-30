import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";

const W = 360;
const H = 360;

type Entity = { x: number; y: number; hp: number };
type Bullet = { x: number; y: number; vx: number; vy: number };

export function NightSwarm() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [time, setTime] = useState(0);
  const [kills, setKills] = useState(0);
  const [alive, setAlive] = useState(true);
  const g = useRef({
    player: { x: W / 2, y: H / 2, hp: 100 },
    keys: new Set<string>(),
    enemies: [] as Entity[],
    bullets: [] as Bullet[],
    spawn: 0,
    fire: 0,
    elapsed: 0,
    running: true,
  });

  const reset = () => {
    g.current = {
      player: { x: W / 2, y: H / 2, hp: 100 },
      keys: new Set(),
      enemies: [],
      bullets: [],
      spawn: 0,
      fire: 0,
      elapsed: 0,
      running: true,
    };
    setTime(0);
    setKills(0);
    setAlive(true);
  };

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      g.current.keys.add(e.key.toLowerCase());
    };
    const up = (e: KeyboardEvent) => {
      g.current.keys.delete(e.key.toLowerCase());
    };
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
    };
  }, []);

  useEffect(() => {
    let raf = 0;
    let last = performance.now();
    const loop = (now: number) => {
      const dt = Math.min(0.04, (now - last) / 1000);
      last = now;
      const s = g.current;
      if (s.running) {
        s.elapsed += dt;
        setTime(Math.floor(s.elapsed));
        let mx = 0;
        let my = 0;
        if (s.keys.has("w") || s.keys.has("arrowup")) my -= 1;
        if (s.keys.has("s") || s.keys.has("arrowdown")) my += 1;
        if (s.keys.has("a") || s.keys.has("arrowleft")) mx -= 1;
        if (s.keys.has("d") || s.keys.has("arrowright")) mx += 1;
        const len = Math.hypot(mx, my) || 1;
        s.player.x = Math.max(12, Math.min(W - 12, s.player.x + (mx / len) * 140 * dt));
        s.player.y = Math.max(12, Math.min(H - 12, s.player.y + (my / len) * 140 * dt));

        s.spawn -= dt;
        if (s.spawn <= 0) {
          const ang = Math.random() * Math.PI * 2;
          const r = 220;
          s.enemies.push({
            x: s.player.x + Math.cos(ang) * r,
            y: s.player.y + Math.sin(ang) * r,
            hp: 18 + s.elapsed * 0.8,
          });
          s.spawn = Math.max(0.25, 0.9 - s.elapsed * 0.015);
        }

        s.fire -= dt;
        if (s.fire <= 0 && s.enemies.length) {
          let target = s.enemies[0];
          let best = 1e9;
          for (const e of s.enemies) {
            const d = Math.hypot(e.x - s.player.x, e.y - s.player.y);
            if (d < best) {
              best = d;
              target = e;
            }
          }
          const dx = target.x - s.player.x;
          const dy = target.y - s.player.y;
          const d = Math.hypot(dx, dy) || 1;
          s.bullets.push({
            x: s.player.x,
            y: s.player.y,
            vx: (dx / d) * 280,
            vy: (dy / d) * 280,
          });
          s.fire = 0.22;
        }

        s.bullets.forEach((b) => {
          b.x += b.vx * dt;
          b.y += b.vy * dt;
        });
        s.bullets = s.bullets.filter(
          (b) => b.x > -20 && b.x < W + 20 && b.y > -20 && b.y < H + 20,
        );

        s.enemies.forEach((e) => {
          const dx = s.player.x - e.x;
          const dy = s.player.y - e.y;
          const d = Math.hypot(dx, dy) || 1;
          e.x += (dx / d) * (55 + s.elapsed) * dt;
          e.y += (dy / d) * (55 + s.elapsed) * dt;
        });

        for (const b of s.bullets) {
          for (const e of s.enemies) {
            if (Math.hypot(b.x - e.x, b.y - e.y) < 12) {
              e.hp -= 14;
              b.x = -999;
            }
          }
        }
        const before = s.enemies.length;
        s.enemies = s.enemies.filter((e) => e.hp > 0);
        const gained = before - s.enemies.length;
        if (gained) setKills((k) => k + gained);

        for (const e of s.enemies) {
          if (Math.hypot(e.x - s.player.x, e.y - s.player.y) < 14) {
            s.player.hp -= 28 * dt;
          }
        }
        if (s.player.hp <= 0) {
          s.running = false;
          setAlive(false);
        }
      }

      const ctx = canvasRef.current?.getContext("2d");
      if (ctx) {
        ctx.fillStyle = "#070809";
        ctx.fillRect(0, 0, W, H);
        // subtle grid
        ctx.strokeStyle = "#15181d";
        for (let i = 0; i < W; i += 24) {
          ctx.beginPath();
          ctx.moveTo(i, 0);
          ctx.lineTo(i, H);
          ctx.stroke();
        }
        s.enemies.forEach((e) => {
          ctx.fillStyle = "#f87171";
          ctx.beginPath();
          ctx.arc(e.x, e.y, 9, 0, Math.PI * 2);
          ctx.fill();
        });
        s.bullets.forEach((b) => {
          ctx.fillStyle = "#e8a317";
          ctx.fillRect(b.x - 2, b.y - 2, 4, 4);
        });
        ctx.fillStyle = "#eef0f3";
        ctx.beginPath();
        ctx.arc(s.player.x, s.player.y, 10, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#1c2027";
        ctx.fillRect(12, 12, 100, 6);
        ctx.fillStyle = "#34d399";
        ctx.fillRect(12, 12, Math.max(0, s.player.hp), 6);
        if (!s.running) {
          ctx.fillStyle = "rgba(0,0,0,0.5)";
          ctx.fillRect(0, 0, W, H);
          ctx.fillStyle = "#eef0f3";
          ctx.font = "600 18px Segoe UI, sans-serif";
          ctx.textAlign = "center";
          ctx.fillText("Swarmed", W / 2, H / 2);
        }
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
        <p className="text-muted">
          Time <span className="font-mono text-fg">{time}s</span>
          <span className="mx-2 text-border-strong">|</span>
          Kills <span className="font-mono text-fg">{kills}</span>
        </p>
        <Button size="sm" onClick={reset}>
          New run
        </Button>
      </div>
      <canvas
        ref={canvasRef}
        width={W}
        height={H}
        className="mx-auto w-full max-w-sm touch-none rounded-xl border border-border bg-bg"
      />
      <p className="text-center text-xs text-subtle">
        {alive ? "WASD / arrows to move — auto fire" : "Run ended — New run to try again"}
      </p>
      <div className="mx-auto grid max-w-[220px] grid-cols-3 gap-2 sm:hidden">
        <span />
        <Button
          size="sm"
          variant="secondary"
          onPointerDown={() => g.current.keys.add("w")}
          onPointerUp={() => g.current.keys.delete("w")}
          onPointerLeave={() => g.current.keys.delete("w")}
        >
          Up
        </Button>
        <span />
        <Button
          size="sm"
          variant="secondary"
          onPointerDown={() => g.current.keys.add("a")}
          onPointerUp={() => g.current.keys.delete("a")}
          onPointerLeave={() => g.current.keys.delete("a")}
        >
          Left
        </Button>
        <Button
          size="sm"
          variant="secondary"
          onPointerDown={() => g.current.keys.add("s")}
          onPointerUp={() => g.current.keys.delete("s")}
          onPointerLeave={() => g.current.keys.delete("s")}
        >
          Down
        </Button>
        <Button
          size="sm"
          variant="secondary"
          onPointerDown={() => g.current.keys.add("d")}
          onPointerUp={() => g.current.keys.delete("d")}
          onPointerLeave={() => g.current.keys.delete("d")}
        >
          Right
        </Button>
      </div>
    </div>
  );
}
