import type { GameKind } from "../../data/game";
import type { GameProps } from "./shared";
import RunnerGame from "./RunnerGame";
import QuizGame from "./QuizGame";
import SortGame from "./SortGame";
import TimingGame from "./TimingGame";
import WhackGame from "./WhackGame";
import ShootingGame from "./ShootingGame";
import SequenceGame from "./SequenceGame";
import StackGame from "./StackGame";

interface MiniGameProps extends GameProps {
  kind: GameKind;
}

/** Выбирает мини-игру по типу миссии. */
export default function MiniGame({ kind, onFinish }: MiniGameProps) {
  switch (kind) {
    case "runner":
      return <RunnerGame onFinish={onFinish} />;
    case "quiz":
      return <QuizGame onFinish={onFinish} />;
    case "sort":
      return <SortGame onFinish={onFinish} />;
    case "timing":
      return <TimingGame onFinish={onFinish} />;
    case "whack":
      return <WhackGame onFinish={onFinish} />;
    case "shoot":
      return <ShootingGame onFinish={onFinish} />;
    case "sequence":
      return <SequenceGame onFinish={onFinish} />;
    default:
      return <StackGame onFinish={onFinish} />;
  }
}
