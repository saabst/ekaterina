import { useRef, useState } from "react";
import { GameFrame, useFinish, useInterval, type GameProps } from "./shared";

interface Block {
  left: number;
  width: number;
}

const GOAL = 9;
const BLOCK_H = 26;
const VISIBLE = 6;

const scoreOf = (placed: number, perfect: number) =>
  (placed / GOAL) * 0.85 + (perfect / GOAL) * 0.15;

export default function StackGame({ onFinish }: GameProps) {
  const finish = useFinish(onFinish);
  const [blocks, setBlocks] = useState<Block[]>([{ left: 20, width: 60 }]);
  const [cur, setCur] = useState(50);
  const [perfect, setPerfect] = useState(0);
  const [note, setNote] = useState("Ставьте блоки ровно — ошибка стоит блока!");
  const [over, setOver] = useState(false);
  const angleRef = useRef(0);

  const top = blocks[blocks.length - 1];
  const placed = blocks.length - 1;

  useInterval(
    () => {
      angleRef.current += 0.035 + placed * 0.005;
      const s = (Math.sin(angleRef.current) + 1) / 2;
      setCur(top.width / 2 + (100 - top.width) * s);
    },
    over ? null : 16
  );

  function drop() {
    if (over) return;
    const prev = top;
    const L = Math.max(cur - prev.width / 2, prev.left);
    const R = Math.min(cur + prev.width / 2, prev.left + prev.width);
    const overlap = R - L;

    if (overlap < 2) {
      setOver(true);
      setNote("Блок сорвался! 💥");
      window.setTimeout(() => finish(scoreOf(placed, perfect)), 900);
      return;
    }

    const isPerfect = Math.abs(cur - (prev.left + prev.width / 2)) < 1.2;
    const nextPerfect = perfect + (isPerfect ? 1 : 0);
    const nb = [...blocks, { left: L, width: overlap }];
    setBlocks(nb);
    setPerfect(nextPerfect);
    setNote(isPerfect ? "Идеально! ✨" : "Ровно! Так держать");

    if (nb.length - 1 >= GOAL) {
      setOver(true);
      setNote("Гавань готова! 🏛️");
      window.setTimeout(() => finish(scoreOf(GOAL, nextPerfect)), 900);
    }
  }

  const camera = Math.max(0, blocks.length - VISIBLE) * BLOCK_H;

  return (
    <GameFrame title="Стройка Севастополя" hint="Укладывайте блоки точно друг на друга">
      <div className="flex h-full flex-col px-4 pb-4">
        <p className="h-6 text-center text-sm font-semibold text-amber-100">{note}</p>

        <div
          onPointerDown={drop}
          className="relative mt-1 min-h-0 flex-1 touch-none overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-sky-900/60 to-[#0d0a1f]"
        >
          <p className="absolute left-3 top-2 z-10 text-xs font-bold text-amber-200">
            Блоков: {placed}/{GOAL} · ✨ {perfect}
          </p>
          <div
            className="absolute inset-x-0 bottom-0 transition-transform duration-500"
            style={{ top: 0, transform: `translateY(${camera}px)` }}
          >
            {blocks.map((b, i) => (
              <div
                key={i}
                className="absolute rounded-md border border-black/30 shadow-md"
                style={{
                  bottom: `${i * BLOCK_H + 8}px`,
                  left: `${b.left}%`,
                  width: `${b.width}%`,
                  height: `${BLOCK_H - 3}px`,
                  background: `hsl(${38 - i * 2} 75% ${Math.max(30, 56 - i * 1.5)}%)`,
                }}
              />
            ))}
            {!over && (
              <div
                className="absolute rounded-md border border-amber-100/60 bg-amber-300/80 shadow-lg shadow-amber-500/40"
                style={{
                  bottom: `${blocks.length * BLOCK_H + 8}px`,
                  left: `${cur - top.width / 2}%`,
                  width: `${top.width}%`,
                  height: `${BLOCK_H - 3}px`,
                }}
              />
            )}
          </div>
        </div>

        <button
          type="button"
          onPointerDown={drop}
          className="mt-3 h-14 rounded-2xl bg-gradient-to-r from-amber-300 to-amber-500 font-display text-lg font-bold text-[#2a1605] shadow-lg shadow-amber-900/40 active:scale-95"
        >
          🔨 Поставить блок
        </button>
      </div>
    </GameFrame>
  );
}
