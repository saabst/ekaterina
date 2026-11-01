import { useRef, useState } from "react";
import { GameFrame, useFinish, useInterval, useTimer, type GameProps } from "./shared";

type Kind = "sick" | "healthy";
interface Cell {
  kind: Kind;
  ttl: number;
  max: number;
}

interface Stats {
  caught: number;
  wrong: number;
  missed: number;
}

const DURATION = 25;
const GOAL = 15;
const TICK = 100;

const scoreOf = (s: Stats) => Math.max(0, s.caught - s.wrong) / GOAL;

export default function WhackGame({ onFinish }: GameProps) {
  const finish = useFinish(onFinish);
  const [cells, setCells] = useState<(Cell | null)[]>(Array(9).fill(null));
  const cellsRef = useRef<(Cell | null)[]>(Array(9).fill(null));
  const statsRef = useRef<Stats>({ caught: 0, wrong: 0, missed: 0 });
  const [stats, setStats] = useState<Stats>({ caught: 0, wrong: 0, missed: 0 });
  const tickRef = useRef(0);

  const timeLeft = useTimer(DURATION, () => finish(scoreOf(statsRef.current)));

  useInterval(() => {
    tickRef.current += 1;
    const maxTtl = Math.max(900, 1700 - tickRef.current * 6);
    const next = cellsRef.current.slice();
    let missedNow = 0;

    for (let i = 0; i < next.length; i++) {
      const c = next[i];
      if (!c) continue;
      const ttl = c.ttl - TICK;
      if (ttl <= 0) {
        if (c.kind === "sick") missedNow++;
        next[i] = null;
      } else {
        next[i] = { ...c, ttl };
      }
    }

    if (Math.random() < 0.3) {
      const empty = next.map((c, i) => (c === null ? i : -1)).filter((i) => i >= 0);
      if (empty.length) {
        const i = empty[Math.floor(Math.random() * empty.length)];
        const kind: Kind = Math.random() < 0.7 ? "sick" : "healthy";
        next[i] = { kind, ttl: maxTtl, max: maxTtl };
      }
    }

    if (missedNow) {
      statsRef.current = { ...statsRef.current, missed: statsRef.current.missed + missedNow };
      setStats({ ...statsRef.current });
    }
    cellsRef.current = next;
    setCells(next);
  }, TICK);

  function tap(i: number) {
    const c = cellsRef.current[i];
    if (!c) return;
    const next = cellsRef.current.slice();
    next[i] = null;
    cellsRef.current = next;
    setCells(next);
    statsRef.current =
      c.kind === "sick"
        ? { ...statsRef.current, caught: statsRef.current.caught + 1 }
        : { ...statsRef.current, wrong: statsRef.current.wrong + 1 };
    setStats({ ...statsRef.current });
  }

  return (
    <GameFrame
      title="Карантин"
      hint="Изолируйте больных 🤒. Здоровых 🧑 не трогайте!"
      timeLeft={timeLeft}
    >
      <div className="flex h-full flex-col px-4 pb-4">
        <div className="mb-3 flex justify-around text-xs font-bold">
          <span className="text-emerald-300">✔ Спасено: {stats.caught}</span>
          <span className="text-red-300">✖ Ошибки: {stats.wrong}</span>
          <span className="text-amber-300">Ушли: {stats.missed}</span>
        </div>

        <div className="grid flex-1 grid-cols-3 content-center gap-3">
          {cells.map((c, i) => (
            <button
              key={i}
              type="button"
              onPointerDown={() => tap(i)}
              className="relative flex aspect-square items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-amber-900/40 to-stone-900/70 active:scale-95"
            >
              <span className="absolute text-4xl opacity-25">🏠</span>
              {c && (
                <span
                  className={`relative text-4xl ${c.kind === "sick" ? "animate-bounce" : ""}`}
                >
                  {c.kind === "sick" ? "🤒" : "🧑"}
                </span>
              )}
              {c && (
                <span className="absolute bottom-1.5 left-3 right-3 h-1 overflow-hidden rounded-full bg-white/15">
                  <span
                    className={`block h-full ${c.kind === "sick" ? "bg-amber-300" : "bg-sky-300"}`}
                    style={{ width: `${(c.ttl / c.max) * 100}%` }}
                  />
                </span>
              )}
            </button>
          ))}
        </div>
      </div>
    </GameFrame>
  );
}
