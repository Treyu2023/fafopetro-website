import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";

const W = 360;
const H = 320;
const PATH = [
  { x: 0, y: 160 },
  { x: 80, y: 160 },
  { x: 80, y: 60 },
  { x: 200, y: 60 },
  { x: 200, y: 240 },
  { x: 320, y: 240 },
  { x: 320, y: 120 },
  { x: 360, y: 120 },
];

type Enemy = { t: number; hp: number; max: number };
type Tower = { x: number; y: number; cd: number };

function posOnPath(t: number) {
  let dist = t;
  for (let i = 0; i < PATH.length - 1; i++) {
    const a = PATH[i];
    const b = PATH[i + 1];
    const seg = Math.hypot(b.x - a.x, b.y - a.y);
    if (dist <= seg) {
      const u = dist / seg;
      return { x: a.x + (b.x - a.x) * u, y: a.y + (b.y - a.y) * u };
    }
    dist -= seg;
  }
  return { ...PATH[PATH.length - 1] };
}

function pathLength() {
  let d = 0;
  for (let i = 0; i < PATH.length - 1; i++) {
    d += Math.hypot(PATH[i + 1].x - PATH[i].x, PATH[i + 1].y - PATH[i].y);
  }
  return d;
}

export function TowerDefense() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gold, setGold] = useState(80);
  const [lives, setLives] = useState(10);
  const [wave, setWave] = useState(0);
  const [status, setStatus] = useState("Place towers, then Start wave");
  const g = useRef({
    towers: [] as Tower[],
    enemies: [] as Enemy[],
    spawnLeft: 0,
    spawnTimer: 0,
    running: false,
    totalPath: pathLength(),
  });

  const placeTower = (clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas || gold < 25) return;
    const rect = canvas.getBoundingClientRect();
    const x = ((clientX - rect.left) / rect.width) * W;
    const y = ((clientY - rect.top) / rect.height) * H;
    // keep off path roughly
    for (let i = 0; i < PATH.length - 1; i++) {
      const a = PATH[i];
      const b = PATH[i + 1];
      const dx = b.x - a.x;
      const dy = b.y - a.y;
      const len2 = dx * dx + dy * dy || 1;
      let u = ((x - a.x) * dx + (y - a.y) * dy) / len2;
      u = Math.max(0, Math.min(1, u));
      const px = a.x + u * dx;
      const py = a.y + u * dy;
      if (Math.hypot(x - px, y - py) < 28) return;
    }
    g.current.towers.push({ x, y, cd: 0 });
    setGold((v) => v - 25);
  };

  const startWave = () => {
    if (g.current.running) return;
    const w = wave + 1;
    setWave(w);
    g.current.spawnLeft = 6 + w * 2;
    g.current.spawnTimer = 0;
    g.current.running = true;
    setStatus(`Wave ${w}`);
  };

  useEffect(() => {
    let raf = 0;
    let last = performance.now();
    const loop = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const s = g.current;
      if (s.running) {
        s.spawnTimer -= dt;
        if (s.spawnLeft > 0 && s.spawnTimer <= 0) {
          const hp = 28 + wave * 10;
          s.enemies.push({ t: 0, hp, max: hp });
          s.spawnLeft--;
          s.spawnTimer = 0.65;
        }
        s.enemies.forEach((e) => {
          e.t += 55 * dt;
        });
        const survivors: Enemy[] = [];
        for (const e of s.enemies) {
          if (e.t >= s.totalPath) {
            setLives((L) => {
              const n = L - 1;
              if (n <= 0) {
                s.running = false;
                setStatus("Base lost");
              }
              return Math.max(0, n);
            });
          } else if (e.hp > 0) survivors.push(e);
        }
        s.enemies = survivors;
        s.towers.forEach((tw) => {
          tw.cd -= dt;
          if (tw.cd > 0) return;
          let target: Enemy | null = null;
          let best = 9999;
          for (const e of s.enemies) {
            const p = posOnPath(e.t);
            const d = Math.hypot(p.x - tw.x, p.y - tw.y);
            if (d < 70 && d < best) {
              best = d;
              target = e;
            }
          }
          if (target) {
            target.hp -= 12 + wave * 2;
            tw.cd = 0.45;
            if (target.hp <= 0) setGold((gld) => gld + 8);
          }
        });
        s.enemies = s.enemies.filter((e) => e.hp > 0);
        if (s.spawnLeft === 0 && s.enemies.length === 0) {
          s.running = false;
          setStatus("Wave cleared — place more or start next");
          setGold((gld) => gld + 20);
        }
      }

      const ctx = canvasRef.current?.getContext("2d");
      if (ctx) {
        ctx.fillStyle = "#0f1114";
        ctx.fillRect(0, 0, W, H);
        ctx.strokeStyle = "#2a3038";
        ctx.lineWidth = 22;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.beginPath();
        PATH.forEach((p, i) => (i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y)));
        ctx.stroke();
        ctx.strokeStyle = "#3d4654";
        ctx.lineWidth = 12;
        ctx.beginPath();
        PATH.forEach((p, i) => (i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y)));
        ctx.stroke();
        s.towers.forEach((tw) => {
          ctx.fillStyle = "#e8a317";
          ctx.beginPath();
          ctx.arc(tw.x, tw.y, 10, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = "rgba(232,163,23,0.25)";
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.arc(tw.x, tw.y, 70, 0, Math.PI * 2);
          ctx.stroke();
        });
        s.enemies.forEach((e) => {
          const p = posOnPath(e.t);
          ctx.fillStyle = "#f87171";
          ctx.beginPath();
          ctx.arc(p.x, p.y, 8, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = "#1c2027";
          ctx.fillRect(p.x - 10, p.y - 14, 20, 3);
          ctx.fillStyle = "#34d399";
          ctx.fillRect(p.x - 10, p.y - 14, 20 * (e.hp / e.max), 3);
        });
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [wave]);

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
        <p className="text-muted">
          Gold <span className="font-mono text-fg">{gold}</span>
          <span className="mx-2 text-border-strong">|</span>
          Lives <span className="font-mono text-fg">{lives}</span>
          <span className="mx-2 text-border-strong">|</span>
          Wave <span className="font-mono text-fg">{wave}</span>
        </p>
        <div className="flex gap-2">
          <Button size="sm" variant="secondary" onClick={startWave}>
            Start wave
          </Button>
          <Button
            size="sm"
            onClick={() => {
              g.current.towers = [];
              g.current.enemies = [];
              g.current.running = false;
              setGold(80);
              setLives(10);
              setWave(0);
              setStatus("Place towers, then Start wave");
            }}
          >
            Reset
          </Button>
        </div>
      </div>
      <canvas
        ref={canvasRef}
        width={W}
        height={H}
        className="mx-auto w-full max-w-sm touch-none rounded-xl border border-border bg-bg-elevated"
        onClick={(e) => placeTower(e.clientX, e.clientY)}
      />
      <p className="text-center text-xs text-subtle">
        Tap map to place a tower (25 gold). {status}
      </p>
    </div>
  );
}
