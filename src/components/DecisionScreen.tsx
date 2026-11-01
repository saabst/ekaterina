import {
  STRENGTHS,
  STRENGTH_KEYS,
  type Decision,
  type Episode,
  type Strengths,
} from "../data/game";
import HUD from "./HUD";
import Screen from "./Screen";

interface DecisionScreenProps {
  episode: Episode;
  stats: Strengths;
  index: number;
  total: number;
  picked: Decision | null;
  onPick: (d: Decision) => void;
  onNext: () => void;
}

/** Выбор решения: три варианта, после выбора — последствия и кнопка дальше. */
export default function DecisionScreen({
  episode,
  stats,
  index,
  total,
  picked,
  onPick,
  onNext,
}: DecisionScreenProps) {
  return (
    <Screen>
      <HUD stats={stats} index={index} total={total} focus={episode.strength} />

      <div className="flex min-h-0 flex-1 flex-col px-3 pb-4 pt-3">
        <div className="anim-fade-up rounded-2xl border border-amber-300/30 bg-amber-300/10 p-3">
          <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-amber-200/80">
            Решение · {episode.year}
          </p>
          <p className="mt-1 font-display text-xl font-bold leading-snug">{episode.dilemma}</p>
        </div>

        <div className="mt-3 flex flex-col gap-2.5">
          {episode.decisions.map((d, i) => {
            const isPicked = picked?.id === d.id;
            const dim = picked !== null && !isPicked;
            return (
              <button
                key={d.id}
                type="button"
                disabled={picked !== null}
                onClick={() => onPick(d)}
                className={`flex items-center gap-3 rounded-2xl border p-3 text-left transition-all duration-300 ${
                  isPicked
                    ? "border-amber-300 bg-amber-300/20"
                    : "border-white/15 bg-white/5 active:scale-[0.98]"
                } ${dim ? "opacity-35" : ""}`}
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-400/20 font-display font-bold text-amber-200">
                  {String.fromCharCode(65 + i)}
                </span>
                <span className="flex-1 text-sm font-semibold leading-snug sm:text-base">
                  {d.label}
                </span>
              </button>
            );
          })}
        </div>

        {picked && (
          <div className="anim-fade-up mt-3 min-h-0 flex-1 overflow-y-auto rounded-2xl border border-white/10 bg-black/30 p-3">
            <div className="flex flex-wrap gap-1.5">
              {STRENGTH_KEYS.filter((k) => picked.effects[k]).map((k) => {
                const v = picked.effects[k] ?? 0;
                const good = v > 0;
                return (
                  <span
                    key={k}
                    className={`rounded-full border px-2 py-0.5 text-xs font-bold ${
                      good
                        ? "border-emerald-400/40 bg-emerald-400/15 text-emerald-200"
                        : "border-red-400/40 bg-red-400/15 text-red-200"
                    }`}
                  >
                    {STRENGTHS[k].icon} {STRENGTHS[k].label} {good ? "+" : ""}
                    {v}
                  </span>
                );
              })}
            </div>
            <p className="mt-2 text-sm leading-relaxed text-white/90">{picked.outcome}</p>
          </div>
        )}

        {picked && (
          <button
            type="button"
            onClick={onNext}
            className="anim-fade-up mt-3 h-14 w-full rounded-full bg-gradient-to-r from-sky-300 to-blue-500 text-base font-bold text-[#0a1630] shadow-xl shadow-blue-900/40 transition-transform active:scale-95"
          >
            Как было на самом деле ➜
          </button>
        )}
      </div>
    </Screen>
  );
}
