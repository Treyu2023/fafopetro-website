import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Section, SectionHeading } from "@/components/Section";
import { Badge } from "@/components/ui/badge";
import { games } from "@/data/site";
import { cn } from "@/lib/utils";
import { SnakeGame } from "@/components/games/SnakeGame";
import { BrickBreaker } from "@/components/games/BrickBreaker";
import { MazeRunner } from "@/components/games/MazeRunner";
import { TowerDefense } from "@/components/games/TowerDefense";
import { NightSwarm } from "@/components/games/NightSwarm";

export const Route = createFileRoute("/fun")({
  component: FunPage,
  head: () => ({
    meta: [{ title: "Fun Zone | FAFO Petro Services" }],
  }),
});

type GameId = (typeof games)[number]["id"];

function FunPage() {
  const [active, setActive] = useState<GameId>("snake");

  return (
    <>
      <Section className="pb-6 pt-14">
        <Badge className="mb-4">Fun zone</Badge>
        <SectionHeading
          title="Rebuilt browser games — tighter than the old embeds."
          description="Snake, Brick Breaker, Maze Runner, Tower Defense, and Night Swarm (the old Vampire Survival). Keyboard on desktop; on-screen controls where it matters. Same spirit as the Google Sites Fun Zone, better chrome."
        />
      </Section>

      <Section className="pt-0">
        <div className="mb-6 grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
          {games.map((g) => (
            <button
              key={g.id}
              type="button"
              onClick={() => setActive(g.id)}
              className={cn(
                "min-h-11 rounded-xl border px-4 py-3 text-left text-sm transition-colors",
                active === g.id
                  ? "border-primary/40 bg-primary/10 text-fg amber-glow"
                  : "border-border bg-surface text-muted hover:border-border-strong hover:text-fg",
              )}
            >
              <span className="block font-medium">{g.name}</span>
              <span className="mt-0.5 block text-xs text-subtle">{g.blurb}</span>
            </button>
          ))}
        </div>

        <div className="panel shine-border rounded-2xl p-4 sm:p-6">
          {active === "snake" && <SnakeGame />}
          {active === "brick" && <BrickBreaker />}
          {active === "pac" && <MazeRunner />}
          {active === "tower" && <TowerDefense />}
          {active === "survivor" && <NightSwarm />}
        </div>
      </Section>
    </>
  );
}
