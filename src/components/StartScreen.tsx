import catherinePortrait from "../assets/catherine-portrait.jpg";
import winterPalace from "../assets/winter-palace.jpg";
import Screen from "./Screen";

const GAMES = [
  { icon: "🛷", label: "Гонка" },
  { icon: "📖", label: "Викторина" },
  { icon: "⚖️", label: "Законы" },
  { icon: "🎯", label: "Укол" },
  { icon: "🚢", label: "Морской бой" },
  { icon: "🔨", label: "Стройка" },
];

export default function StartScreen({ onStart }: { onStart: () => void }) {
  return (
    <Screen image={winterPalace}>
      <div className="flex h-full flex-col items-center justify-center px-6 text-center">
        <p className="anim-fade-up text-[11px] font-bold uppercase tracking-[0.35em] text-amber-200/80">
          Историческая аркада
        </p>
        <h1 className="anim-fade-up mt-2 font-display text-5xl font-black leading-none drop-shadow-lg sm:text-6xl">
          Екатерина II
        </h1>
        <p className="anim-fade-up font-display text-xl italic text-amber-200">Путь Великой</p>

        <div className="anim-pop mt-6 h-28 w-28 overflow-hidden rounded-full border-4 border-amber-300/60 shadow-2xl shadow-amber-900/60">
          <img src={catherinePortrait} alt="Портрет Екатерины II" className="h-full w-full object-cover" />
        </div>

        <div className="mt-6 grid w-full max-w-xs grid-cols-3 gap-2">
          {GAMES.map((g) => (
            <div
              key={g.label}
              className="rounded-xl border border-white/15 bg-black/35 px-1 py-2 text-center"
            >
              <div className="text-xl">{g.icon}</div>
              <div className="mt-0.5 text-[10px] font-semibold uppercase tracking-wide text-white/70">
                {g.label}
              </div>
            </div>
          ))}
        </div>

        <p className="mt-5 max-w-xs text-sm leading-relaxed text-white/80">
          8 миссий от переворота 1762 года до Крыма. В каждой — мини-игра, решение и реальный факт.
        </p>

        <button
          type="button"
          onClick={onStart}
          className="mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500 px-8 py-4 text-base font-bold uppercase tracking-wider text-[#2a1605] shadow-xl shadow-amber-900/40 transition-transform active:scale-95"
        >
          Начать правление ➜
        </button>
      </div>
    </Screen>
  );
}
