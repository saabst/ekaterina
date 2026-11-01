import { MAX_STRENGTH, STRENGTHS, STRENGTH_KEYS, type Strengths } from "../data/game";

const R = 78;

/** Точка на радаре: 6 осей, начиная с верхней, по часовой стрелке. */
function point(i: number, value: number) {
  const angle = ((-90 + i * 60) * Math.PI) / 180;
  const r = (value / MAX_STRENGTH) * R;
  return [Math.cos(angle) * r, Math.sin(angle) * r] as const;
}

export default function Radar({ stats }: { stats: Strengths }) {
  const poly = STRENGTH_KEYS.map((k, i) => point(i, stats[k]).join(",")).join(" ");
  const rings = [0.25, 0.5, 0.75, 1];

  return (
    <svg viewBox="-150 -130 300 260" className="h-auto w-full" role="img" aria-label="Сильные стороны">
      {rings.map((f) => (
        <polygon
          key={f}
          points={STRENGTH_KEYS.map((_, i) => point(i, MAX_STRENGTH * f).join(",")).join(" ")}
          fill="none"
          stroke="rgba(255,255,255,0.15)"
          strokeWidth="1"
        />
      ))}
      {STRENGTH_KEYS.map((k, i) => {
        const [x, y] = point(i, MAX_STRENGTH);
        return <line key={k} x1="0" y1="0" x2={x} y2={y} stroke="rgba(255,255,255,0.15)" />;
      })}
      <polygon
        points={poly}
        fill="rgba(251,191,36,0.35)"
        stroke="#fbbf24"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      {STRENGTH_KEYS.map((k, i) => {
        const [x, y] = point(i, stats[k]);
        return <circle key={k} cx={x} cy={y} r="3.5" fill="#fde68a" />;
      })}
      {STRENGTH_KEYS.map((k, i) => {
        const [x, y] = point(i, MAX_STRENGTH + 2.6);
        return (
          <text
            key={k}
            x={x}
            y={y}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize="10.5"
            fill="white"
          >
            {STRENGTHS[k].icon} {STRENGTHS[k].label} {stats[k]}
          </text>
        );
      })}
    </svg>
  );
}
