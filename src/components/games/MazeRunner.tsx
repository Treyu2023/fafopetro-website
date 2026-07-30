import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";

const TILE = 18;
const COLS = 19;
const ROWS = 15;
const W = COLS * TILE;
const H = ROWS * TILE;

// 1 = wall, 0 = path, 2 = pellet
const LEVEL = [
  "1111111111111111111",
  "1000000001000000001",
  "1011110101010111101",
  "1000000000000000001",
  "1011011110111101101",
  "1001000001000001001",
  "1111011101110111011",
  "0000000100001000000",
  "1111011110111101111",
  "1000000001000000001",
  "1011110101010111101",
  "1000010000001000001",
  "1011011110111101101",
  "1000000001000000001",
  "1111111111111111111",
].map((row) => row.split("").map(Number));

type Pt = { x: number; y: number };

function openCells(): Pt[] {
  const cells: Pt[] = [];
  for (let y = 0; y < ROWS; y++) {
    for (let x = 0; x < COLS; x++) {
      if (LEVEL[y][x] === 0) cells.push({ x, y });
    }
  }
  return cells;
}

export function MazeRunner() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [status, setStatus] = useState("Move with arrows / WASD");
  const g = useRef({
    player: { x: 1, y: 1 },
    ghosts: [
      { x: 9, y: 7 },
      { x: 8, y: 7 },
    ],
    pellets: new Set<string>(),
    dir: { x: 0, y: 0 },
    alive: true,
  });

  const initPellets = () => {
    const set = new Set<string>();
    openCells().forEach((c) => {
      if (!(c.x === 1 && c.y === 1)) set.add(`${c.x},${c.y}`);
    });
    return set;
  };

  const reset = () => {
    g.current = {
      player: { x: 1, y: 1 },
      ghosts: [
        { x: 9, y: 7 },
        { x: 8, y: 7 },
      ],
      pellets: initPellets(),
      dir: { x: 0, y: 0 },
      alive: true,
    };
    setScore(0);
    setStatus("Move with arrows / WASD");
  };

  useEffect(() => {
    g.current.pellets = initPellets();
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const map: Record<string, Pt> = {
        ArrowUp: { x: 0, y: -1 },
        ArrowDown: { x: 0, y: 1 },
        ArrowLeft: { x: -1, y: 0 },
        ArrowRight: { x: 1, y: 0 },
        w: { x: 0, y: -1 },
        s: { x: 0, y: 1 },
        a: { x: -1, y: 0 },
        d: { x: 1, y: 0 },
      };
      const d = map[e.key];
      if (!d) return;
      e.preventDefault();
      g.current.dir = d;
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    const can = (x: number, y: number) => {
      if (x < 0) x = COLS - 1;
      if (x >= COLS) x = 0;
      if (y < 0 || y >= ROWS) return false;
      return LEVEL[y][x] === 0;
    };

    const step = window.setInterval(() => {
      const s = g.current;
      if (!s.alive) return;
      const nx = s.player.x + s.dir.x;
      const ny = s.player.y + s.dir.y;
      let px = nx;
      let py = ny;
      if (px < 0) px = COLS - 1;
      if (px >= COLS) px = 0;
      if (can(px, py)) {
        s.player = { x: px, y: py };
        const key = `${px},${py}`;
        if (s.pellets.has(key)) {
          s.pellets.delete(key);
          setScore((sc) => sc + 10);
          if (s.pellets.size === 0) {
            s.alive = false;
            setStatus("Maze cleared!");
          }
        }
      }
      s.ghosts = s.ghosts.map((gh) => {
        const options: Pt[] = [
          { x: 0, y: -1 },
          { x: 0, y: 1 },
          { x: -1, y: 0 },
          { x: 1, y: 0 },
        ].filter((d) => can(gh.x + d.x, gh.y + d.y));
        if (!options.length) return gh;
        // bias toward player
        options.sort((a, b) => {
          const da =
            Math.abs(gh.x + a.x - s.player.x) + Math.abs(gh.y + a.y - s.player.y);
          const db =
            Math.abs(gh.x + b.x - s.player.x) + Math.abs(gh.y + b.y - s.player.y);
          return da - db + (Math.random() - 0.5);
        });
        const pick = options[0];
        return { x: gh.x + pick.x, y: gh.y + pick.y };
      });
      if (s.ghosts.some((gh) => gh.x === s.player.x && gh.y === s.player.y)) {
        s.alive = false;
        setStatus("Caught — try again");
      }
    }, 160);

    let raf = 0;
    const draw = () => {
      const ctx = canvasRef.current?.getContext("2d");
      const s = g.current;
      if (ctx) {
        ctx.fillStyle = "#070809";
        ctx.fillRect(0, 0, W, H);
        for (let y = 0; y < ROWS; y++) {
          for (let x = 0; x < COLS; x++) {
            if (LEVEL[y][x] === 1) {
              ctx.fillStyle = "#1c2a44";
              ctx.fillRect(x * TILE, y * TILE, TILE, TILE);
            }
          }
        }
        s.pellets.forEach((key) => {
          const [x, y] = key.split(",").map(Number);
          ctx.fillStyle = "#e8a317";
          ctx.beginPath();
          ctx.arc(x * TILE + TILE / 2, y * TILE + TILE / 2, 2.5, 0, Math.PI * 2);
          ctx.fill();
        });
        ctx.fillStyle = "#f4f4f5";
        ctx.beginPath();
        ctx.arc(
          s.player.x * TILE + TILE / 2,
          s.player.y * TILE + TILE / 2,
          6,
          0,
          Math.PI * 2,
        );
        ctx.fill();
        s.ghosts.forEach((gh, i) => {
          ctx.fillStyle = i === 0 ? "#f87171" : "#3d8bfd";
          ctx.beginPath();
          ctx.arc(gh.x * TILE + TILE / 2, gh.y * TILE + TILE / 2, 6, 0, Math.PI * 2);
          ctx.fill();
        });
      }
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);

    return () => {
      clearInterval(step);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
        <p className="text-muted">
          Score <span className="font-mono text-fg">{score}</span>
        </p>
        <Button size="sm" onClick={reset}>
          New game
        </Button>
      </div>
      <canvas
        ref={canvasRef}
        width={W}
        height={H}
        className="mx-auto w-full max-w-md rounded-xl border border-border bg-bg"
      />
      <p className="text-center text-xs text-subtle">{status}</p>
      <div className="mx-auto grid max-w-[200px] grid-cols-3 gap-2 sm:hidden">
        <span />
        <Button size="sm" variant="secondary" onClick={() => (g.current.dir = { x: 0, y: -1 })}>
          Up
        </Button>
        <span />
        <Button size="sm" variant="secondary" onClick={() => (g.current.dir = { x: -1, y: 0 })}>
          Left
        </Button>
        <Button size="sm" variant="secondary" onClick={() => (g.current.dir = { x: 0, y: 1 })}>
          Down
        </Button>
        <Button size="sm" variant="secondary" onClick={() => (g.current.dir = { x: 1, y: 0 })}>
          Right
        </Button>
      </div>
    </div>
  );
}
