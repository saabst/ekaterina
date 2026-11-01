import { useEffect, useRef, useState } from "react";
import { GameFrame, useFinish, useInterval, type GameProps } from "./shared";

const QUESTIONS = [
  {
    q: "С кем из великих философов переписывалась Екатерина II?",
    options: ["Вольтер", "Гоббс", "Макиавелли", "Лейбниц"],
    correct: 0,
  },
  {
    q: "Как называлось первое в России государственное учебное заведение для девушек-дворянок?",
    options: ["Царскосельский лицей", "Смольный институт", "Академия художеств", "Московский университет"],
    correct: 1,
  },
  {
    q: "Что означает слово «Эрмитаж» во французском языке?",
    options: ["Большая библиотека", "Уединённое место", "Королевская галерея", "Парадный зал"],
    correct: 1,
  },
  {
    q: "Какой порт на Чёрном море основан по указу Екатерины в 1794 году?",
    options: ["Севастополь", "Новороссийск", "Одесса", "Очаков"],
    correct: 2,
  },
  {
    q: "Какой фаворит основал Херсон и помогал управлять югом империи?",
    options: ["Орлов", "Зубов", "Потёмкин", "Разумовский"],
    correct: 2,
  },
];

const TIME = 8;

export default function QuizGame({ onFinish }: GameProps) {
  const finish = useFinish(onFinish);
  const [idx, setIdx] = useState(0);
  const [time, setTime] = useState(TIME);
  const [picked, setPicked] = useState<number | null>(null);
  const correctRef = useRef(0);
  const question = QUESTIONS[idx];

  useInterval(
    () => setTime((t) => Math.max(0, t - 0.1)),
    picked === null ? 100 : null
  );

  useEffect(() => {
    if (picked === null && time <= 0) setPicked(-1);
  }, [time, picked]);

  useEffect(() => {
    if (picked === null) return;
    const id = window.setTimeout(() => {
      if (idx + 1 >= QUESTIONS.length) {
        finish(correctRef.current / QUESTIONS.length);
      } else {
        setIdx(idx + 1);
        setTime(TIME);
        setPicked(null);
      }
    }, 1100);
    return () => window.clearTimeout(id);
  }, [picked, idx, finish]);

  function answer(i: number) {
    if (picked !== null) return;
    if (i === question.correct) correctRef.current += 1;
    setPicked(i);
  }

  return (
    <GameFrame title="Викторина Просветителя" hint="Отвечайте, пока не истёк таймер">
      <div className="flex h-full flex-col px-4 pb-4">
        <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full bg-gradient-to-r from-amber-300 to-yellow-500 transition-[width] duration-100"
            style={{ width: `${(time / TIME) * 100}%` }}
          />
        </div>
        <p className="mt-3 text-xs font-semibold uppercase tracking-widest text-amber-200/80">
          Вопрос {idx + 1} из {QUESTIONS.length}
        </p>
        <div key={idx} className="anim-fade-up mt-2 rounded-2xl border border-white/10 bg-white/5 p-4">
          <p className="font-display text-lg font-semibold leading-snug sm:text-xl">{question.q}</p>
        </div>
        <div className="mt-auto grid grid-cols-1 gap-2.5">
          {question.options.map((opt, i) => {
            let cls = "border-white/15 bg-white/5";
            if (picked !== null) {
              if (i === question.correct) cls = "border-emerald-400 bg-emerald-500/25";
              else if (i === picked) cls = "border-red-400 bg-red-500/25";
              else cls = "border-white/5 bg-white/[0.02] opacity-50";
            }
            return (
              <button
                key={opt}
                type="button"
                onPointerDown={() => answer(i)}
                className={`rounded-2xl border px-4 py-3.5 text-left text-sm font-semibold transition-colors active:scale-[0.98] sm:text-base ${cls}`}
              >
                <span className="mr-2 font-display text-amber-200">{String.fromCharCode(65 + i)}.</span>
                {opt}
              </button>
            );
          })}
        </div>
      </div>
    </GameFrame>
  );
}
