import { useEffect, useState } from "react";
import {
  EPISODES,
  START_STRENGTHS,
  applyEffects,
  bonusFromStars,
  effectOf,
  starsFromScore,
  type Decision,
  type Stars,
  type Strengths,
} from "./data/game";
import Screen from "./components/Screen";
import HUD from "./components/HUD";
import StartScreen from "./components/StartScreen";
import StoryScreen from "./components/StoryScreen";
import MiniGame from "./components/minigames/MiniGame";
import ResultScreen from "./components/ResultScreen";
import DecisionScreen from "./components/DecisionScreen";
import FactScreen from "./components/FactScreen";
import EndScreen, { type DecisionRecord } from "./components/EndScreen";

type Phase = "start" | "story" | "game" | "result" | "decide" | "fact" | "end";

export default function App() {
  const [phase, setPhase] = useState<Phase>("start");
  const [ep, setEp] = useState(0);
  const [stats, setStats] = useState<Strengths>(START_STRENGTHS);
  const [score, setScore] = useState(0);
  const [stars, setStars] = useState<Stars>(1);
  const [picked, setPicked] = useState<Decision | null>(null);
  const [records, setRecords] = useState<DecisionRecord[]>([]);
  const episode = EPISODES[ep];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [phase, ep]);

  function start() {
    setStats(START_STRENGTHS);
    setRecords([]);
    setEp(0);
    setPicked(null);
    setPhase("story");
  }

  function handleGameFinish(s: number) {
    const st = starsFromScore(s);
    setScore(s);
    setStars(st);
    setStats((prev) => applyEffects(prev, effectOf(episode.strength, bonusFromStars(st))));
    setPhase("result");
  }

  function handlePick(d: Decision) {
    if (picked) return;
    setPicked(d);
    setStats((prev) => applyEffects(prev, d.effects));
    setRecords((prev) => [
      ...prev,
      { year: episode.year, title: episode.title, stars, choice: d.label },
    ]);
  }

  function handleFactNext() {
    if (ep + 1 < EPISODES.length) {
      setEp(ep + 1);
      setPicked(null);
      setPhase("story");
    } else {
      setPhase("end");
    }
  }

  const total = EPISODES.length;

  if (phase === "start") {
    return <StartScreen onStart={start} />;
  }

  if (phase === "story") {
    return (
      <StoryScreen
        episode={episode}
        index={ep}
        total={total}
        stats={stats}
        onStart={() => setPhase("game")}
      />
    );
  }

  if (phase === "game") {
    return (
      <Screen>
        <HUD stats={stats} index={ep} total={total} focus={episode.strength} />
        <div className="relative min-h-0 flex-1">
          <MiniGame key={episode.id} kind={episode.game} onFinish={handleGameFinish} />
        </div>
      </Screen>
    );
  }

  if (phase === "result") {
    return (
      <ResultScreen
        episode={episode}
        score={score}
        stars={stars}
        stats={stats}
        index={ep}
        total={total}
        onNext={() => setPhase("decide")}
      />
    );
  }

  if (phase === "decide") {
    return (
      <DecisionScreen
        episode={episode}
        stats={stats}
        index={ep}
        total={total}
        picked={picked}
        onPick={handlePick}
        onNext={() => setPhase("fact")}
      />
    );
  }

  if (phase === "fact") {
    return (
      <FactScreen
        episode={episode}
        stats={stats}
        index={ep}
        total={total}
        isLast={ep === total - 1}
        onNext={handleFactNext}
      />
    );
  }

  return <EndScreen stats={stats} records={records} onRestart={start} />;
}
