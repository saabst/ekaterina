import type { Episode, Strengths } from "../data/game";
import HUD from "./HUD";
import Screen from "./Screen";

interface FactScreenProps {
  episode: Episode;
  stats: Strengths;
  index: number;
  total: number;
  isLast: boolean;
  onNext: () => void;
}

/** Историческая справка после решения. */
export default function FactScreen({ episode, stats, index, total, isLast, onNext }: FactScreenProps) {
  return (
    <Screen>
      <HUD stats={stats} index={index} total={total} focus={episode.strength} />

      <div className="relative mx-3 mt-3 h-[26dvh] shrink-0 overflow-hidden rounded-3xl border border-white/10">
        <img src={episode.image} alt={episode.title} className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#120c26] to-transparent" />
      </div>

      <div className="flex min-h-0 flex-1 flex-col px-3 pb-4 pt-3">
        <div className="anim-fade-up flex min-h-0 flex-1 flex-col overflow-y-auto rounded-3xl border border-sky-300/25 bg-sky-400/5 p-5">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-sky-200">
            📜 Знаете ли вы?
          </p>
          <p className="mt-2 font-display text-lg font-semibold text-sky-100">
            {episode.year} — {episode.title}
          </p>
          <p className="mt-3 text-sm leading-relaxed text-white/90 sm:text-base">{episode.fact}</p>
        </div>

        <button
          type="button"
          onClick={onNext}
          className="mt-3 h-14 w-full rounded-full bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500 text-base font-bold uppercase tracking-wider text-[#2a1605] shadow-xl shadow-amber-900/40 transition-transform active:scale-95"
        >
          {isLast ? "Итоги правления 👑" : "Следующая миссия ➜"}
        </button>
      </div>
    </Screen>
  );
}
