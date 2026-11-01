import { STRENGTHS, type Episode, type Strengths } from "../data/game";
import HUD from "./HUD";
import Screen from "./Screen";

interface StoryScreenProps {
  episode: Episode;
  index: number;
  total: number;
  stats: Strengths;
  onStart: () => void;
}

/** Сюжетная заставка миссии: иллюстрация, история и задача мини-игры. */
export default function StoryScreen({ episode, index, total, stats, onStart }: StoryScreenProps) {
  const strength = STRENGTHS[episode.strength];
  return (
    <Screen>
      <HUD stats={stats} index={index} total={total} focus={episode.strength} />

      <div className="relative mx-3 mt-3 min-h-0 flex-1 overflow-hidden rounded-3xl border border-white/10 shadow-2xl shadow-black/50">
        <img
          src={episode.image}
          alt={episode.title}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#120c26] via-[#120c26]/30 to-transparent" />
        <div className="absolute left-3 top-3 rounded-full border border-amber-300/50 bg-black/50 px-3 py-1 text-xs font-bold tracking-wider text-amber-200">
          {episode.year}
        </div>
        <div className="anim-fade-up absolute inset-x-0 bottom-0 p-4">
          <p className="text-xs text-white/70">📍 {episode.location}</p>
          <h2 className="font-display text-3xl font-black leading-tight">{episode.title}</h2>
        </div>
      </div>

      <div className="anim-fade-up px-3 pb-4 pt-3">
        <p className="text-sm leading-relaxed text-white/90">{episode.story}</p>

        <div className="mt-3 rounded-2xl border border-emerald-400/30 bg-emerald-400/10 p-3 text-sm">
          <p>
            <span className="font-bold text-emerald-200">🎯 Миссия:</span> {episode.mission}
          </p>
          <p className="mt-1 text-xs text-white/70">
            Развивает: {strength.icon} {strength.label}
          </p>
        </div>

        <button
          type="button"
          onClick={onStart}
          className="mt-3 flex h-14 w-full items-center justify-center rounded-full bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500 text-base font-bold uppercase tracking-wider text-[#2a1605] shadow-xl shadow-amber-900/40 transition-transform active:scale-95"
        >
          Начать миссию ➜
        </button>
      </div>
    </Screen>
  );
}
