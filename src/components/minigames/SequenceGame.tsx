import { useEffect, useState } from "react";
import { GameFrame, useFinish, type GameProps } from "./shared";

const PADS = [
  { icon: "🦅", base: "bg-red-700", lit: "bg-red-300" },
  { icon: "⚜️", base: "bg-amber-700", lit: "bg-amber-200" },
  { icon: "🌹", base: "bg-rose-800", lit: "bg-rose-300" },
  { icon: "⭐", base: "bg-sky-800", lit: "bg-sky-200" },
];

const LEVELS = 5;
const START_LEN = 3;
const MAX_MISTAKES = 2;
const STEP = 650;

const randomPad = () => Math.floor(Math.random() * PADS.length);

export default function SequenceGame({ onFinish }: GameProps) {
  const finish = useFinish(onFinish);
  const [seq, setSeq] = useState<number[]>(() =>
    Array.from({ length: START_LEN }, randomPad)
  );
  const [done, setDone] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [phase, setPhase] = useState<"show" | "input">("show");
  const [lit, setLit] = useState<number | null>(null);
  const [pos, setPos] = useState(0);
  const [msg, setMsg] = useState("Запоминайте порядок сигналов…");

  useEffect(() => {
    if (phase !== "show") return;
    const timers: number[] = [];
    seq.forEach((p, i) => {
      timers.push(window.setTimeout(() => setLit(p), 500 + i * STEP));
      timers.push(window.setTimeout(() => setLit(null), 500 + i * STEP + 420));
    });
    timers.push(
      window.setTimeout(() => {
        setPos(0);
        setMsg("Ваша очередь — повторите!");
        setPhase("input");
      }, 500 + seq.length * STEP)
    );
    return () => timers.forEach((t) => window.clearTimeout(t));
  }, [phase, seq]);

  function press(p: number) {
    if (phase !== "input") return;
    setLit(p);
    window.setTimeout(() => setLit(null), 180);

    if (p !== seq[pos]) {
      const m = mistakes + 1;
      setMistakes(m);
      if (m >= MAX_MISTAKES) {
        finish(done / LEVELS);
        return;
      }
      setMsg("Ошибка! Слушайте ещё раз…");
      setPhase("show");
      return;
    }

    if (pos + 1 < seq.length) {
      setPos(pos + 1);
      return;
    }

    const d = done + 1;
    setDone(d);
    if (d >= LEVELS) {
      finish(d / LEVELS - mistakes * 0.1);
      return;
    }
    setSeq([...seq, randomPad()]);
    setMsg("Верно! Шифровка становится длиннее…");
    setPhase("show");
  }

  return (
    <GameFrame title="Шифровка для казаков" hint="Запомните порядок знаков и повторите его">
      <div className="flex h-full flex-col px-4 pb-4">
        <div className="mt-1 flex items-center justify-between text-xs font-bold uppercase tracking-widest text-amber-200/80">
          <span>
            Уровень {Math.min(done + 1, LEVELS)} / {LEVELS}
          </span>
          <span className="text-red-300">
            {"✖".repeat(mistakes)}
            <span className="text-white/30">{"·".repeat(MAX_MISTAKES - mistakes)}</span>
          </span>
        </div>
        <p className="mt-2 text-center font-display text-lg text-white/90">{msg}</p>

        <div className="mx-auto mt-4 grid w-full max-w-xs flex-1 grid-cols-2 content-center gap-4">
          {PADS.map((pad, i) => (
            <button
              key={i}
              type="button"
              onPointerDown={() => press(i)}
              disabled={phase !== "input"}
              className={`flex aspect-square items-center justify-center rounded-3xl border-4 border-white/20 text-5xl shadow-xl transition-all duration-150 ${
                lit === i ? `${pad.lit} scale-105 brightness-125` : pad.base
              } ${phase === "input" ? "active:scale-95" : "opacity-90"}`}
            >
              {pad.icon}
            </button>
          ))}
        </div>
      </div>
    </GameFrame>
  );
}
