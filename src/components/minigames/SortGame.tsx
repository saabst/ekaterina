import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { GameFrame, useFinish, type GameProps } from "./shared";

interface Proposal {
  text: string;
  accept: boolean;
  note: string;
}

const PROPOSALS: Proposal[] = [
  {
    text: "Отменить пытки при допросах",
    accept: true,
    note: "Идея «Наказа» и трактата Беккариа «О преступлениях и наказаниях».",
  },
  {
    text: "Все подданные равны перед законом",
    accept: true,
    note: "Равенство перед законом — главная мысль «Наказа», хотя сословия сохранились.",
  },
  {
    text: "Навсегда закрепить крестьян за помещиками без права жалобы",
    accept: false,
    note: "Противоречит духу Просвещения. Крепостное право отменят только в 1861 году.",
  },
  {
    text: "Свобода вероисповедания для всех подданных",
    accept: true,
    note: "Веротерпимость провозглашена в «Наказе» — с оговорками, но для Европы это новость.",
  },
  {
    text: "Казнить за любое неуважительное слово о царице",
    accept: false,
    note: "Смертная казнь за слова противоречила взглядам Беккариа.",
  },
  {
    text: "Созвать выборную Уложенную комиссию",
    accept: true,
    note: "В 1767 году в Москву съехались 564 депутата всех сословий.",
  },
];

export default function SortGame({ onFinish }: GameProps) {
  const finish = useFinish(onFinish);
  const [idx, setIdx] = useState(0);
  const [answer, setAnswer] = useState<{ ok: boolean; accept: boolean } | null>(null);
  const correctRef = useRef(0);
  const dragRef = useRef<number | null>(null);
  const card = PROPOSALS[idx];

  function choose(accept: boolean) {
    if (answer) return;
    const ok = accept === card.accept;
    if (ok) correctRef.current += 1;
    setAnswer({ ok, accept });
  }

  useEffect(() => {
    if (!answer) return;
    const id = window.setTimeout(() => {
      if (idx + 1 >= PROPOSALS.length) {
        finish(correctRef.current / PROPOSALS.length);
      } else {
        setIdx(idx + 1);
        setAnswer(null);
      }
    }, 2000);
    return () => window.clearTimeout(id);
  }, [answer, idx, finish]);

  const onDown = (e: ReactPointerEvent) => {
    dragRef.current = e.clientX;
  };
  const onUp = (e: ReactPointerEvent) => {
    if (dragRef.current === null) return;
    const dx = e.clientX - dragRef.current;
    dragRef.current = null;
    if (Math.abs(dx) > 50) choose(dx > 0);
  };

  const flyDir = answer ? (answer.accept ? 1 : -1) : 0;

  return (
    <GameFrame title="Законы на весах" hint="Проверьте законы на соответствие Просвещению">
      <div className="flex h-full flex-col px-4 pb-4">
        <div className="relative mt-3 flex flex-1 items-center justify-center">
          {PROPOSALS[idx + 1] && (
            <div className="absolute inset-x-8 top-4 bottom-4 scale-95 rounded-3xl border border-white/10 bg-white/5 opacity-60" />
          )}
          <div
            key={idx}
            onPointerDown={onDown}
            onPointerUp={onUp}
            onPointerCancel={() => (dragRef.current = null)}
            className="relative w-full max-w-sm touch-none rounded-3xl border border-amber-300/40 bg-gradient-to-br from-[#2b1a4a] to-[#15102b] p-6 text-center shadow-2xl shadow-black/50 transition-all duration-500"
            style={{
              transform: flyDir
                ? `translateX(${flyDir * 130}%) rotate(${flyDir * 16}deg)`
                : "none",
              opacity: flyDir ? 0 : 1,
            }}
          >
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-amber-200/70">
              Закон {idx + 1} из {PROPOSALS.length}
            </p>
            <p className="mt-3 font-display text-xl font-bold leading-snug">{card.text}</p>
          </div>
        </div>

        <div className="mt-3 min-h-[92px] rounded-2xl border border-white/10 bg-black/30 p-3 text-sm">
          {answer ? (
            <>
              <p className={`font-bold ${answer.ok ? "text-emerald-300" : "text-red-300"}`}>
                {answer.ok ? "✔ Верно!" : "✖ Ошибка"}
              </p>
              <p className="mt-1 text-white/80">{card.note}</p>
            </>
          ) : (
            <p className="text-center text-white/60">Свайп вправо — принять, влево — отклонить</p>
          )}
        </div>

        <div className="mt-3 grid grid-cols-2 gap-3">
          <button
            type="button"
            onPointerDown={() => choose(false)}
            className="h-14 rounded-2xl border border-red-400/40 bg-red-500/15 font-bold text-red-200 active:scale-95"
          >
            ✖ Отклонить
          </button>
          <button
            type="button"
            onPointerDown={() => choose(true)}
            className="h-14 rounded-2xl border border-emerald-400/40 bg-emerald-500/15 font-bold text-emerald-200 active:scale-95"
          >
            ✔ Принять
          </button>
        </div>
      </div>
    </GameFrame>
  );
}
