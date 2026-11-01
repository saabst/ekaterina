import catherinePortrait from "../assets/catherine-portrait.jpg";
import { getVerdict, type Stars, type Strengths } from "../data/game";
import Radar from "./Radar";
import Screen from "./Screen";

export interface DecisionRecord {
  year: string;
  title: string;
  stars: Stars;
  choice: string;
}

interface EndScreenProps {
  stats: Strengths;
  records: DecisionRecord[];
  onRestart: () => void;
}

/** Финал правления: титул, радар сильных сторон и летопись миссий. */
export default function EndScreen({ stats, records, onRestart }: EndScreenProps) {
  const verdict = getVerdict(stats);

  return (
    <Screen scroll>
      <div className="flex flex-col items-center px-4 pb-8 pt-6 text-center">
        <p className="anim-fade-up text-xs font-bold uppercase tracking-[0.35em] text-amber-200/80">
          17 ноября 1796 года
        </p>
        <div className="anim-pop mt-3 h-20 w-20 overflow-hidden rounded-full border-2 border-amber-300/70 shadow-xl shadow-amber-900/50">
          <img src={catherinePortrait} alt="Екатерина II" className="h-full w-full object-cover" />
        </div>
        <h1 className="anim-fade-up mt-3 font-display text-4xl font-black">{verdict.title}</h1>
        <p className="font-display text-lg italic text-amber-200">{verdict.subtitle}</p>

        <div className="mt-4 w-full max-w-xs">
          <Radar stats={stats} />
        </div>

        <p className="mt-3 max-w-md text-sm leading-relaxed text-white/85">{verdict.text}</p>

        <p className="mt-5 text-xs font-bold uppercase tracking-[0.25em] text-amber-200/80">
          Летопись правления
        </p>
        <div className="mt-2 grid w-full max-w-md grid-cols-4 gap-2">
          {records.map((r, i) => (
            <div key={i} className="rounded-xl border border-white/10 bg-black/35 p-2">
              <p className="text-[10px] font-bold text-amber-200">{r.year}</p>
              <p className="mt-0.5 text-[10px] leading-tight text-white/80">{r.title}</p>
              <p className="mt-1 text-[10px]">{"⭐".repeat(r.stars)}</p>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={onRestart}
          className="mt-6 inline-flex items-center justify-center rounded-full bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500 px-8 py-4 text-base font-bold uppercase tracking-wider text-[#2a1605] shadow-xl shadow-amber-900/40 transition-transform active:scale-95"
        >
          ↺ Сыграть снова
        </button>
        <p className="mt-3 text-xs text-white/45">Другие решения — другая история.</p>
      </div>
    </Screen>
  );
}
