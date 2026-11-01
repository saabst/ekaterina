import { useEffect, useRef, useState } from "react";
import { GameFrame, useFinish, useInterval, useTimer, type GameProps } from "./shared";

interface Item {
  id: number;
  lane: number;
  y: number;
  kind: "good" | "bad";
}

const LANES = 3;
const DURATION = 25;
const GOAL = 12;
const PLAYER_Y = 84;
const MAX_LIVES = 3;

export default function RunnerGame({ onFinish }: GameProps) {
  const finish = useFinish(onFinish);
  const [lane, setLane] = useState(1);
  const laneRef = useRef(1);
  const [items, setItems] = useState<Item[]>([]);
  const itemsRef = useRef<Item[]>([]);
  const [collected, setCollected] = useState(0);
  const collectedRef = useRef(0);
  const [lives, setLives] = useState(MAX_LIVES);
  const livesRef = useRef(MAX_LIVES);
  const [hitKey, setHitKey] = useState(0);
  const tickRef = useRef(0);
  const idRef = useRef(0);

  const timeLeft = useTimer(DURATION, () => finish(collectedRef.current / GOAL));

  useInterval(() => {
    tickRef.current += 1;
    const t = tickRef.current;
    const speed = 1 + Math.min(0.8, t * 0.0015);

    if (t % 16 === 0) {
      idRef.current += 1;
      itemsRef.current.push({
        id: idRef.current,
        lane: Math.floor(Math.random() * LANES),
        y: -6,
        kind: Math.random() < 0.7 ? "good" : "bad",
      });
    }

    const next: Item[] = [];
    for (const it of itemsRef.current) {
      const y = it.y + speed;
      const crossing = y >= PLAYER_Y - 5 && it.y < PLAYER_Y + 5;
      if (crossing && it.lane === laneRef.current) {
        if (it.kind === "good") {
          collectedRef.current += 1;
          setCollected(collectedRef.current);
        } else {
          livesRef.current -= 1;
          setLives(livesRef.current);
          setHitKey((k) => k + 1);
        }
        continue;
      }
      if (y > 110) continue;
      next.push({ ...it, y });
    }
    itemsRef.current = next;
    setItems(next);

    if (livesRef.current <= 0) finish(collectedRef.current / GOAL);
  }, 40);

  const move = (dir: -1 | 1) => {
    const n = Math.max(0, Math.min(LANES - 1, laneRef.current + dir));
    laneRef.current = n;
    setLane(n);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") move(-1);
      if (e.key === "ArrowRight") move(1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const xPct = (l: number) => ((l + 0.5) * 100) / LANES;

  return (
    <GameFrame
      title="Гонка к казармам"
      hint="Ловите свитки 📜 и объезжайте льдины 🧊"
      timeLeft={timeLeft}
    >
      <div className="flex h-full flex-col">
        <div className="relative mx-4 min-h-0 flex-1 overflow-hidden rounded-2xl border border-white/15 bg-gradient-to-b from-indigo-950 via-slate-800 to-slate-900">
          <div className="absolute inset-0 flex">
            {Array.from({ length: LANES }).map((_, i) => (
              <div key={i} className="flex-1 border-x border-dashed border-white/10" />
            ))}
          </div>

          {items.map((it) => (
            <div
              key={it.id}
              className="absolute -translate-x-1/2 -translate-y-1/2 text-3xl"
              style={{ left: `${xPct(it.lane)}%`, top: `${it.y}%` }}
            >
              {it.kind === "good" ? "📜" : "🧊"}
            </div>
          ))}

          <div
            key={hitKey}
            className={`absolute -translate-x-1/2 -translate-y-1/2 text-4xl transition-[left] duration-150 ease-out ${
              hitKey ? "anim-shake" : ""
            }`}
            style={{ left: `${xPct(lane)}%`, top: `${PLAYER_Y}%` }}
          >
            🛷
          </div>

          <div className="absolute left-2 top-2 text-sm tracking-tight">
            {"❤️".repeat(lives)}
            {"🖤".repeat(MAX_LIVES - lives)}
          </div>
          <div className="absolute right-2 top-2 rounded-full bg-black/40 px-2.5 py-1 text-xs font-bold">
            📜 {collected}/{GOAL}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 p-4">
          <button
            type="button"
            onPointerDown={() => move(-1)}
            className="h-16 rounded-2xl border border-white/15 bg-white/10 text-base font-bold active:scale-95 active:bg-amber-300/30"
          >
            ◀ Влево
          </button>
          <button
            type="button"
            onPointerDown={() => move(1)}
            className="h-16 rounded-2xl border border-white/15 bg-white/10 text-base font-bold active:scale-95 active:bg-amber-300/30"
          >
            Вправо ▶
          </button>
        </div>
      </div>
    </GameFrame>
  );
}
