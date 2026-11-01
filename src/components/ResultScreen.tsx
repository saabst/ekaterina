import { STRENGTHS, type Episode, type Stars, type Strengths } from "../data/game";
import HUD from "./HUD";
import Screen from "./Screen";

interface ResultScreenProps {
  episode: Episode;
  score: number;
  stars: Stars;
  stats: Strengths;
  index: number;
  total: number;
  onNext: () => void;
}

/** Итог мини-игры: звёзды, процент и бонус к сильной стороне. */
export default function ResultScreen({
  episode,
  score,
  stars,
  stats,
  index,
  total,
  onNext,
}: ResultScreenProps) {
  const strength = STRENGTHS[episode.strength];
  return (
    <Screen>
      <HUD stats={stats} index={index} total={total} focus={episode.strength} />

      <div className="flex min-h-0 flex-1 flex-col items-center justify-center px-6 text-center">
        <p className="anim-fade-up text-xs font-bold uppercase tracking-[0.3em] text-amber-200/80">
          Результат миссии
        </p>
        <h2 className="anim-fade-up mt-1 font-display text-3xl font-black">{episode.title}</h2>

        <div className="mt-6 flex gap-3">
          {([1, 2, 3] as const).map((n) => (
            <span
              key={n}
              className={`anim-pop text-5xl drop-shadow-lg ${n <= stars ? "" : "opacity-25 grayscale"}`}
              style={{ animationDelay: `${n * 0.15}s` }}
            >
              ⭐
            </span>
          ))}
        </div>

        <p className="mt-5 font-display text-4xl font-black text-amber-200">
          {Math.round(score * 100)}%
        </p>
        <p className="mt-3 max-w-xs text-sm leading-relaxed text-white/85">
          {episode.results[stars - 1]}
        </p>

        {stars > 1 && (
          <p className="anim-fade-up mt-4 rounded-full border border-emerald-400/40 bg-emerald-400/10 px-4 py-1.5 text-sm font-bold text-emerald-200">
            +{stars - 1} {strength.icon} {strength.label}
          </p>
        )}

        <button
          type="button"
          onClick={onNext}
          className="mt-8 w-full max-w-xs rounded-full bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500 px-6 py-4 text-base font-bold uppercase tracking-wider text-[#2a1605] shadow-xl shadow-amber-900/40 transition-transform active:scale-95"
        >
          К решению ➜
        </button>
      </div>
    </Screen>
  );
}
