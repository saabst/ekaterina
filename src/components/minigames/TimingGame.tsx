import { useEffect, useRef, useState } from "react";
import { GameFrame, useFinish, useInterval, type GameProps } from "./shared";

const ROUNDS = 5;

export default function TimingGame({ onFinish }: GameProps) {
  const finish = useFinish(onFinish);
  const [round, setRound] = useState(0);
  const [pos, setPos] = useState(50);
  const [target, setTarget] = useState(() => 25 + Math.random() * 50);
  const [feedback, setFeedback] = useState<{ text: string; good: boolean } | null>(null);
  const angleRef = useRef(0);
  const scoresRef = useRef<number[]>([]);
  const speed = 0.045 + round * 0.013;

  useInterval(
    () => {
      angleRef.current += speed;
      setPos(50 + 48 * Math.sin(angleRef.current));
    },
    feedback ? null : 16
  );

  function strike() {
    if (feedback) return;
    const d = Math.abs(pos - target);
    const s = d <= 2.5 ? 1 : d <= 7 ? 0.6 : 0;
    scoresRef.current.push(s);
    setFeedback({
      text: s === 1 ? "Идеально! 🎯" : s > 0 ? "Хорошо" : "Мимо…",
      good: s > 0,
    });
  }

  useEffect(() => {
    if (!feedback) return;
    const id = window.setTimeout(() => {
      if (round + 1 >= ROUNDS) {
        const sum = scoresRef.current.reduce((a, b) => a + b, 0);
        finish(sum / ROUNDS);
      } else {
        setRound(round + 1);
        setTarget(25 + Math.random() * 50);
        setFeedback(null);
      }
    }, 950);
    return () => window.clearTimeout(id);
  }, [feedback, round, finish]);

  return (
    <GameFrame title="Точный укол" hint="Нажмите, когда стрелка окажется в золотой зоне">
      <div className="flex h-full flex-col justify-center px-4 pb-4">
        <div className="mb-4 flex justify-center gap-2">
          {Array.from({ length: ROUNDS }).map((_, i) => (
            <span
              key={i}
              className={`h-2.5 w-2.5 rounded-full ${
                i < round ? "bg-emerald-400" : i === round ? "animate-pulse bg-amber-300" : "bg-white/20"
              }`}
            />
          ))}
        </div>

        <div className="relative h-24 overflow-hidden rounded-2xl border border-white/15 bg-black/35">
          <div
            className="absolute inset-y-0 bg-emerald-500/30"
            style={{ left: `${target - 7}%`, width: "14%" }}
          />
          <div
            className="absolute inset-y-0 bg-amber-300/60"
            style={{ left: `${target - 2.5}%`, width: "5%" }}
          />
          <div
            className="absolute inset-y-0 w-1 -translate-x-1/2 bg-white shadow-[0_0_12px_white]"
            style={{ left: `${pos}%` }}
          />
        </div>

        <div className="mt-4 flex h-10 items-center justify-center font-display text-xl font-bold">
          {feedback ? (
            <span className={feedback.good ? "text-emerald-300" : "text-red-300"}>
              {feedback.text}
            </span>
          ) : (
            <span className="text-white/50">Раунд {round + 1} из {ROUNDS}</span>
          )}
        </div>

        <button
          type="button"
          onPointerDown={strike}
          className="mx-auto mt-4 h-24 w-24 rounded-full border-4 border-amber-200/60 bg-gradient-to-b from-amber-300 to-amber-600 font-display text-lg font-black text-[#2a1605] shadow-xl shadow-amber-900/50 active:scale-90"
        >
          УКОЛ
        </button>
      </div>
    </GameFrame>
  );
}
