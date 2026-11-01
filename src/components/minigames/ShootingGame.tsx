import { useRef, useState } from "react";
import { GameFrame, useFinish, useInterval, useTimer, type GameProps } from "./shared";

interface Ship {
  id: number;
  x: number;
  y: number;
  dir: 1 | -1;
  speed: number;
  kind: "enemy" | "friend";
  sunk: number;
}

interface Stats {
  kills: number;
  friendly: number;
}

const DURATION = 25;
const GOAL = 10;
const TICK = 50;

const scoreOf = (s: Stats) => Math.max(0, s.kills - s.friendly * 1.5) / GOAL;

export default function ShootingGame({ onFinish }: GameProps) {
  const finish = useFinish(onFinish);
  const [ships, setShips] = useState<Ship[]>([]);
  const shipsRef = useRef<Ship[]>([]);
  const idRef = useRef(0);
  const tickRef = useRef(0);
  const statsRef = useRef<Stats>({ kills: 0, friendly: 0 });
  const [stats, setStats] = useState<Stats>({ kills: 0, friendly: 0 });

  const timeLeft = useTimer(DURATION, () => finish(scoreOf(statsRef.current)));

  useInterval(() => {
    tickRef.current += 1;
    const t = tickRef.current;

    if (t % 16 === 0) {
      idRef.current += 1;
      const dir: 1 | -1 = Math.random() < 0.5 ? 1 : -1;
      shipsRef.current.push({
        id: idRef.current,
        dir,
        x: dir === 1 ? -6 : 106,
        y: 22 + Math.random() * 50,
        speed: 0.22 + Math.random() * 0.18 + Math.min(0.15, t * 0.0004),
        kind: Math.random() < 0.7 ? "enemy" : "friend",
        sunk: 0,
      });
    }

    const next: Ship[] = [];
    for (const s of shipsRef.current) {
      if (s.sunk > 0) {
        if (s.sunk < 400) next.push({ ...s, sunk: s.sunk + TICK });
        continue;
      }
      const x = s.x + s.dir * s.speed;
      if (x < -8 || x > 108) continue;
      next.push({ ...s, x });
    }
    shipsRef.current = next;
    setShips(next);
  }, TICK);

  function tap(s: Ship) {
    if (s.sunk > 0) return;
    shipsRef.current = shipsRef.current.map((x) =>
      x.id === s.id ? { ...x, sunk: TICK } : x
    );
    statsRef.current =
      s.kind === "enemy"
        ? { ...statsRef.current, kills: statsRef.current.kills + 1 }
        : { ...statsRef.current, friendly: statsRef.current.friendly + 1 };
    setStats({ ...statsRef.current });
    setShips(shipsRef.current);
  }

  return (
    <GameFrame
      title="Морской бой у Чесмы"
      hint="Топите османов 🔴, русские корабли 🔵 не трогайте"
      timeLeft={timeLeft}
    >
      <div className="relative mx-4 mb-4 min-h-0 flex-1 overflow-hidden rounded-2xl border border-white/15 bg-gradient-to-b from-sky-400/40 via-blue-800/70 to-blue-950">
        <div className="absolute inset-x-0 top-0 z-10 flex justify-between px-3 pt-2 text-xs font-bold">
          <span className="rounded-full bg-black/40 px-2 py-1 text-red-200">
            🔴 Потоплено: {stats.kills}/{GOAL}
          </span>
          <span className="rounded-full bg-black/40 px-2 py-1 text-sky-200">
            🔵 Ошибки: {stats.friendly}
          </span>
        </div>

        {[30, 48, 66, 84].map((y) => (
          <div key={y} className="absolute inset-x-0 h-px bg-white/10" style={{ top: `${y}%` }} />
        ))}

        {ships.map((s) => (
          <button
            key={s.id}
            type="button"
            onPointerDown={() => tap(s)}
            className="absolute flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center"
            style={{ left: `${s.x}%`, top: `${s.y}%` }}
          >
            {s.sunk > 0 ? (
              <span className="anim-pop text-4xl">💥</span>
            ) : (
              <>
                <span
                  className="block text-4xl"
                  style={{
                    transform: `scaleX(${-s.dir})`,
                    filter: s.kind === "friend" ? "hue-rotate(170deg) saturate(1.4)" : undefined,
                  }}
                >
                  🚢
                </span>
                <span className="absolute -top-1 left-0 text-[11px]">
                  {s.kind === "enemy" ? "🔴" : "🔵"}
                </span>
              </>
            )}
          </button>
        ))}
      </div>
    </GameFrame>
  );
}
