import {
  MAX_STRENGTH,
  STRENGTHS,
  STRENGTH_KEYS,
  type StrengthKey,
  type Strengths,
} from "../data/game";

interface HUDProps {
  stats: Strengths;
  index: number;
  total: number;
  focus?: StrengthKey;
}

/** Верхняя панель: прогресс по миссиям и сильные стороны Екатерины. */
export default function HUD({ stats, index, total, focus }: HUDProps) {
  return (
    <div className="px-3 pt-3">
      <div className="mb-1.5 flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-white/60">
        <span>
          Миссия {index + 1} / {total}
        </span>
        <div className="flex items-center gap-1">
          {Array.from({ length: total }).map((_, i) => (
            <span
              key={i}
              className={`h-1.5 rounded-full transition-all duration-500 ${
                i < index
                  ? "w-3 bg-emerald-400"
                  : i === index
                    ? "w-5 bg-amber-300"
                    : "w-1.5 bg-white/20"
              }`}
            />
          ))}
        </div>
      </div>

      <div className="grid grid-cols-6 gap-1">
        {STRENGTH_KEYS.map((k) => {
          const meta = STRENGTHS[k];
          const active = focus === k;
          return (
            <div
              key={k}
              title={`${meta.label}: ${meta.hint}`}
              className={`rounded-lg border px-0.5 py-1 text-center transition-colors duration-300 ${
                active ? "border-amber-300/70 bg-amber-300/15" : "border-white/10 bg-black/35"
              }`}
            >
              <div className="text-sm leading-none">{meta.icon}</div>
              <div className="mt-0.5 text-[11px] font-bold leading-none tabular-nums">
                {stats[k]}
              </div>
              <div className="mt-1 h-1 overflow-hidden rounded-full bg-white/10">
                <div
                  className={`h-full rounded-full bg-gradient-to-r ${meta.bar} transition-all duration-700`}
                  style={{ width: `${(stats[k] / MAX_STRENGTH) * 100}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
