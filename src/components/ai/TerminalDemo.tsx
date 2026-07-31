import { useEffect, useState } from "react";

const LINES: { cls?: string; text: string; delay: number }[] = [
  { cls: "ai-terminal__dim", text: "// FAFO field assist — demo transcript", delay: 0 },
  { cls: "ai-terminal__prompt", text: "> intake --site \"Triad C-Store #14\"", delay: 400 },
  { text: "  reading last close…", delay: 900 },
  { cls: "ai-terminal__ok", text: "  ok  variance flags: 2 fuel · 1 merchandise", delay: 1500 },
  { cls: "ai-terminal__prompt", text: "> structure-report --type reconciliation", delay: 2200 },
  { text: "  building sections: sales · fuel · tender · notes", delay: 2800 },
  { cls: "ai-terminal__ok", text: "  ok  outline ready — human review still required", delay: 3400 },
  { cls: "ai-terminal__prompt", text: "> commander status --ports", delay: 4000 },
  { text: "  virtual: up · physical: 3/4 · backup: stale 6d", delay: 4600 },
  { cls: "ai-terminal__ok", text: "  tip  schedule local backup pull (Passport/Verifone)", delay: 5200 },
  { cls: "ai-terminal__dim", text: "// AI accelerates the busywork. You still own the call.", delay: 6000 },
];

export function TerminalDemo() {
  const [visible, setVisible] = useState(0);
  const [typing, setTyping] = useState("");

  useEffect(() => {
    let cancelled = false;
    const timers: number[] = [];

    function runCycle() {
      if (cancelled) return;
      setVisible(0);
      setTyping("");
      LINES.forEach((line, i) => {
        timers.push(
          window.setTimeout(() => {
            if (cancelled) return;
            setVisible(i + 1);
            setTyping(line.text);
          }, line.delay),
        );
      });
      // restart
      timers.push(
        window.setTimeout(() => {
          if (!cancelled) runCycle();
        }, 9000),
      );
    }

    runCycle();
    return () => {
      cancelled = true;
      timers.forEach((t) => window.clearTimeout(t));
    };
  }, []);

  return (
    <div className="ai-terminal">
      <div className="ai-terminal__bar">
        <span className="ai-terminal__dot bg-[#f87171]" />
        <span className="ai-terminal__dot bg-[#fbbf24]" />
        <span className="ai-terminal__dot bg-[#34d399]" />
        <span className="ml-2">fafo-assist · demo</span>
      </div>
      <div className="ai-terminal__body" aria-live="polite">
        {LINES.slice(0, visible).map((line, i) => (
          <div key={`${line.text}-${i}`} className={line.cls}>
            {i === visible - 1 ? (
              <>
                {typing}
                <span className="ai-cursor" />
              </>
            ) : (
              line.text
            )}
          </div>
        ))}
        {visible === 0 ? <span className="ai-cursor" /> : null}
      </div>
    </div>
  );
}
