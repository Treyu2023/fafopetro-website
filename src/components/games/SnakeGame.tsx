import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";

const CELL = 16;
const COLS = 20;
const ROWS = 16;
const W = COLS * CELL;
const H = ROWS * CELL;

type Pt = { x: number; y: number };

export function SnakeGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(0);
  const [alive, setAlive] = useState(true);
  const [running, setRunning] = useState(false);
  const state = useRef({
    snake: [{ x: 8, y: 8 }] as Pt[],
    dir: { x: 1, y: 0 } as Pt,
    nextDir: { x: 1, y: 0 } as Pt,
    food: { x: 14, y: 8 } as Pt,
    tick: 0,
  });

  const placeFood = useCallback((snake: Pt[]) => {
    let p: Pt;
    do {
      p = {
        x: Math.floor(Math.random() * COLS),
        y: Math.floor(Math.random() * ROWS),
      };
    } while (snake.some((s) => s.x === p.x && s.y === p.y));
    return p;
  }, []);

  const reset = useCallback(() => {
    const snake = [{ x: 8, y: 8 }];
    state.current = {
      snake,
      dir: { x: 1, y: 0 },
      nextDir: { x: 1, y: 0 },
      food: placeFood(snake),
      tick: 0,
    };
    setScore(0);
    setAlive(true);
    setRunning(true);
  }, [placeFood]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const d = state.current.dir;
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
      const nd = map[e.key];
      if (!nd) return;
      e.preventDefault();
      if (nd.x === -d.x && nd.y === -d.y) return;
      state.current.nextDir = nd;
      if (!running && alive) setRunning(true);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [running, alive]);

  useEffect(() => {
    if (!running || !alive) return;
    const id = window.setInterval(() => {
      const s = state.current;
      s.dir = s.nextDir;
      const head = {
        x: s.snake[0].x + s.dir.x,
        y: s.snake[0].y + s.dir.y,
      };
      if (
        head.x < 0 ||
        head.y < 0 ||
        head.x >= COLS ||
        head.y >= ROWS ||
        s.snake.some((p) => p.x === head.x && p.y === head.y)
      ) {
        setAlive(false);
        setRunning(false);
        setBest((b) => Math.max(b, s.snake.length - 1));
        return;
      }
      s.snake.unshift(head);
      if (head.x === s.food.x && head.y === s.food.y) {
        s.food = placeFood(s.snake);
        setScore(s.snake.length - 1);
      } else {
        s.snake.pop();
      }
    }, 110);
    return () => clearInterval(id);
  }, [running, alive, placeFood]);

  useEffect(() => {
    let raf = 0;
    const draw = () => {
      const ctx = canvasRef.current?.getContext("2d");
      if (ctx) {
        const s = state.current;
        ctx.fillStyle = "#0f1114";
        ctx.fillRect(0, 0, W, H);
        ctx.strokeStyle = "#1c2027";
        for (let x = 0; x <= COLS; x++) {
          ctx.beginPath();
          ctx.moveTo(x * CELL, 0);
          ctx.lineTo(x * CELL, H);
          ctx.stroke();
        }
        for (let y = 0; y <= ROWS; y++) {
          ctx.beginPath();
          ctx.moveTo(0, y * CELL);
          ctx.lineTo(W, y * CELL);
          ctx.stroke();
        }
        ctx.fillStyle = "#e8a317";
        ctx.fillRect(s.food.x * CELL + 2, s.food.y * CELL + 2, CELL - 4, CELL - 4);
        s.snake.forEach((p, i) => {
          ctx.fillStyle = i === 0 ? "#f4f4f5" : "#3d8bfd";
          ctx.fillRect(p.x * CELL + 1, p.y * CELL + 1, CELL - 2, CELL - 2);
        });
        if (!alive) {
          ctx.fillStyle = "rgba(0,0,0,0.55)";
          ctx.fillRect(0, 0, W, H);
          ctx.fillStyle = "#eef0f3";
          ctx.font = "600 18px Segoe UI, sans-serif";
          ctx.textAlign = "center";
          ctx.fillText("Game over", W / 2, H / 2);
        }
      }
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, [alive]);

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
        <p className="text-muted">
          Score <span className="font-mono text-fg">{score}</span>
          <span className="mx-2 text-border-strong">|</span>
          Best <span className="font-mono text-fg">{best}</span>
        </p>
        <div className="flex gap-2">
          <Button size="sm" variant="secondary" onClick={() => setRunning((r) => !r)} disabled={!alive}>
            {running ? "Pause" : "Resume"}
          </Button>
          <Button size="sm" onClick={reset}>
            New game
          </Button>
        </div>
      </div>
      <canvas
        ref={canvasRef}
        width={W}
        height={H}
        className="mx-auto w-full max-w-md rounded-xl border border-border bg-bg-elevated touch-none"
      />
      <p className="text-center text-xs text-subtle">
        Arrow keys or WASD · swipe-friendly controls below on mobile
      </p>
      <div className="mx-auto grid max-w-[200px] grid-cols-3 gap-2 sm:hidden">
        <span />
        <Button size="sm" variant="secondary" onClick={() => (state.current.nextDir = { x: 0, y: -1 })}>
          Up
        </Button>
        <span />
        <Button size="sm" variant="secondary" onClick={() => (state.current.nextDir = { x: -1, y: 0 })}>
          Left
        </Button>
        <Button size="sm" variant="secondary" onClick={() => (state.current.nextDir = { x: 0, y: 1 })}>
          Down
        </Button>
        <Button size="sm" variant="secondary" onClick={() => (state.current.nextDir = { x: 1, y: 0 })}>
          Right
        </Button>
      </div>
    </div>
  );
}
