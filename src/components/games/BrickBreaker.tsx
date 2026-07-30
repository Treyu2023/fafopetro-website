import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";

const W = 360;
const H = 420;

export function BrickBreaker() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [msg, setMsg] = useState("Click or press Space to launch");
  const g = useRef({
    paddleX: W / 2 - 40,
    ball: { x: W / 2, y: H - 40, vx: 3.2, vy: -3.6 },
    bricks: [] as { x: number; y: number; live: boolean }[],
    running: false,
    pointer: W / 2,
  });

  const buildBricks = () => {
    const bricks = [];
    for (let r = 0; r < 5; r++) {
      for (let c = 0; c < 8; c++) {
        bricks.push({ x: 18 + c * 42, y: 40 + r * 22, live: true });
      }
    }
    return bricks;
  };

  const resetBall = (full = false) => {
    g.current.ball = { x: W / 2, y: H - 40, vx: 3.2, vy: -3.6 };
    g.current.paddleX = W / 2 - 40;
    g.current.running = false;
    if (full) {
      g.current.bricks = buildBricks();
      setScore(0);
      setLives(3);
    }
    setMsg("Click or press Space to launch");
  };

  useEffect(() => {
    g.current.bricks = buildBricks();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const onMove = (clientX: number) => {
      const rect = canvas.getBoundingClientRect();
      const x = ((clientX - rect.left) / rect.width) * W;
      g.current.pointer = x;
      g.current.paddleX = Math.max(0, Math.min(W - 80, x - 40));
    };

    const onPointer = (e: PointerEvent) => onMove(e.clientX);
    const onClick = () => {
      if (!g.current.running) {
        g.current.running = true;
        setMsg("");
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        onClick();
      }
      if (e.key === "ArrowLeft") g.current.paddleX = Math.max(0, g.current.paddleX - 24);
      if (e.key === "ArrowRight") g.current.paddleX = Math.min(W - 80, g.current.paddleX + 24);
    };

    canvas.addEventListener("pointermove", onPointer);
    canvas.addEventListener("pointerdown", onClick);
    window.addEventListener("keydown", onKey);

    let raf = 0;
    const loop = () => {
      const ctx = canvas.getContext("2d");
      const s = g.current;
      if (ctx) {
        if (s.running) {
          s.ball.x += s.ball.vx;
          s.ball.y += s.ball.vy;
          if (s.ball.x < 8 || s.ball.x > W - 8) s.ball.vx *= -1;
          if (s.ball.y < 8) s.ball.vy *= -1;
          if (
            s.ball.y > H - 28 &&
            s.ball.x > s.paddleX &&
            s.ball.x < s.paddleX + 80
          ) {
            s.ball.vy = -Math.abs(s.ball.vy);
            s.ball.vx = ((s.ball.x - (s.paddleX + 40)) / 40) * 4.2;
          }
          if (s.ball.y > H) {
            setLives((L) => {
              const n = L - 1;
              if (n <= 0) {
                setMsg("Out of lives — hit New game");
                s.running = false;
              } else {
                resetBall(false);
              }
              return Math.max(0, n);
            });
          }
          for (const b of s.bricks) {
            if (!b.live) continue;
            if (
              s.ball.x > b.x &&
              s.ball.x < b.x + 38 &&
              s.ball.y > b.y &&
              s.ball.y < b.y + 16
            ) {
              b.live = false;
              s.ball.vy *= -1;
              setScore((sc) => sc + 10);
            }
          }
          if (s.bricks.every((b) => !b.live)) {
            setMsg("Board clear!");
            s.running = false;
          }
        }

        ctx.fillStyle = "#0f1114";
        ctx.fillRect(0, 0, W, H);
        s.bricks.forEach((b, i) => {
          if (!b.live) return;
          ctx.fillStyle = i % 2 === 0 ? "#e8a317" : "#3d8bfd";
          ctx.fillRect(b.x, b.y, 36, 14);
        });
        ctx.fillStyle = "#eef0f3";
        ctx.fillRect(s.paddleX, H - 22, 80, 10);
        ctx.beginPath();
        ctx.arc(s.ball.x, s.ball.y, 6, 0, Math.PI * 2);
        ctx.fillStyle = "#f4f4f5";
        ctx.fill();
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      canvas.removeEventListener("pointermove", onPointer);
      canvas.removeEventListener("pointerdown", onClick);
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
        <p className="text-muted">
          Score <span className="font-mono text-fg">{score}</span>
          <span className="mx-2 text-border-strong">|</span>
          Lives <span className="font-mono text-fg">{lives}</span>
        </p>
        <Button
          size="sm"
          onClick={() => {
            resetBall(true);
          }}
        >
          New game
        </Button>
      </div>
      <canvas
        ref={canvasRef}
        width={W}
        height={H}
        className="mx-auto w-full max-w-sm touch-none rounded-xl border border-border bg-bg-elevated"
      />
      {msg ? <p className="text-center text-xs text-subtle">{msg}</p> : null}
    </div>
  );
}
