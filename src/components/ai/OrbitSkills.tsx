const NODES = [
  "Prompts",
  "Reports",
  "Commander",
  "Backups",
  "Recon",
  "PA-DSS",
  "Price book",
  "Integrations",
];

export function OrbitSkills() {
  const n = NODES.length;
  return (
    <div className="ai-orbit" aria-hidden="true">
      <div className="ai-orbit__ring ai-orbit__ring--rev" />
      <div className="ai-orbit__ring">
        {NODES.map((label, i) => {
          const angle = (360 / n) * i;
          return (
            <div
              key={label}
              className="ai-orbit__node"
              style={{
                transform: `rotate(${angle}deg) translateY(-9.2rem) rotate(${-angle}deg)`,
              }}
            >
              <span className="ai-orbit__pill">{label}</span>
            </div>
          );
        })}
      </div>
      <div className="ai-orbit__core">
        <div className="text-center">
          <p className="font-sign text-2xl tracking-wide text-primary">AI</p>
          <p className="font-condensed text-[0.65rem] font-bold uppercase tracking-[0.2em] text-muted">
            Field-ready
          </p>
        </div>
      </div>
    </div>
  );
}
