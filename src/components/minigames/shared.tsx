import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";

export interface GameProps {
  onFinish: (score: number) => void;
}

/** Повторяет callback с заданным интервалом (null — остановлен). */
export function useInterval(callback: () => void, delay: number | null) {
  const saved = useRef(callback);
  useEffect(() => {
    saved.current = callback;
  });
  useEffect(() => {
    if (delay === null) return;
    const id = window.setInterval(() => saved.current(), delay);
    return () => window.clearInterval(id);
  }, [delay]);
}

/** Возвращает стабильную функцию завершения, которая срабатывает только один раз. */
export function useFinish(onFinish: (score: number) => void) {
  const done = useRef(false);
  const cb = useRef(onFinish);
  useEffect(() => {
    cb.current = onFinish;
  });
  return useCallback((score: number) => {
    if (done.current) return;
    done.current = true;
    cb.current(Math.max(0, Math.min(1, score)));
  }, []);
}

/** Обратный отсчёт в секундах. Вызывает onEnd, когда время вышло. */
export function useTimer(seconds: number, onEnd: () => void) {
  const [left, setLeft] = useState(seconds);
  const endRef = useRef(onEnd);
  useEffect(() => {
    endRef.current = onEnd;
  });
  useEffect(() => {
    const start = performance.now();
    const id = window.setInterval(() => {
      const rem = Math.max(0, seconds - (performance.now() - start) / 1000);
      setLeft(rem);
      if (rem <= 0) {
        window.clearInterval(id);
        endRef.current();
      }
    }, 100);
    return () => window.clearInterval(id);
  }, [seconds]);
  return left;
}

interface GameFrameProps {
  title: string;
  hint: string;
  timeLeft?: number;
  children: ReactNode;
}

/** Общая рамка мини-игры: заголовок, подсказка и таймер. Заполняет родителя полностью. */
export function GameFrame({ title, hint, timeLeft, children }: GameFrameProps) {
  const urgent = timeLeft !== undefined && timeLeft <= 5;
  return (
    <div className="absolute inset-0 flex select-none flex-col">
      <div className="flex items-start justify-between gap-3 px-4 pt-2">
        <div className="min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-amber-200/70">
            Мини-игра
          </p>
          <h3 className="font-display text-xl font-bold leading-tight">{title}</h3>
          <p className="text-xs text-white/70">{hint}</p>
        </div>
        {timeLeft !== undefined && (
          <div
            className={`shrink-0 rounded-full border px-3 py-1 font-display text-lg font-bold tabular-nums ${
              urgent
                ? "border-red-400/60 bg-red-500/20 text-red-200"
                : "border-amber-300/40 bg-amber-400/10 text-amber-100"
            }`}
          >
            {Math.ceil(timeLeft)}с
          </div>
        )}
      </div>
      <div className="relative mt-2 min-h-0 flex-1">
        <div className="absolute inset-0 flex flex-col">{children}</div>
      </div>
    </div>
  );
}
