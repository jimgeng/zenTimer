import clsx from "clsx";
import InfoIcon from "../../assets/icons/InfoIcon";
import TrashIcon from "../../assets/icons/TrashIcon";
import type { Solve } from "../../models/solve";
import { useSessionStore } from "../../store/useSessionStore";
import { useTimerStore } from "../../store/useTimerStore";
import { formatTime } from "../../utils/timeHelpers";
import Button from "../shared/Button";

interface SolveListItemProps {
  solve: Solve;
  index: number;
  latestSolve?: boolean; // for animating new solves, will be true for the most recent solve when added.
  digitWidth: number; // stupid logic to make the number count fit when the digits grow.
}

const SolveListItem = ({
  solve,
  index,
  latestSolve,
  digitWidth,
}: SolveListItemProps) => {
  const deleteThisSolve = () => {
    useSessionStore.getState().deleteSolveFromActiveSession(solve.id);
  };

  const officialTime =
    solve.penalty === "+2" ? solve.timeMs + 2000 : solve.timeMs;

  const stoppedStatus = useTimerStore.getState().status === "stopped";

  return (
    <div className="group text-lg grid grid-cols-[auto_3fr_1fr] gap-x-2">
      <h4
        className={clsx("text-sub row-span-2 text-right border-l-4 border-bg", {
          "w-8": digitWidth === 1,
          "w-10": digitWidth === 2,
          "w-16": digitWidth === 3,
        })}
      >
        #{index}
      </h4>
      <h3
        className={clsx("text-2xl font-light", {
          "animate-mount-glow": stoppedStatus && latestSolve,
        })}
      >
        {formatTime(officialTime)}
        {solve.penalty === "+2" && (
          <span className="font-mono text-xs font-bold text-warning rounded-sm p-0.5">
            +2
          </span>
        )}
        {solve.penalty === "DNF" && (
          <span className="font-mono text-xs font-bold text-danger rounded-sm p-0.5">
            DNF
          </span>
        )}
      </h3>
      <div className="flex gap-1 justify-between text-sub col-start-2 min-w-0">
        <p className="text-sm shrink min-w-0 text-ellipsis text-nowrap overflow-hidden">
          {solve.scramble}
        </p>
        <p className="text-sm grow text-nowrap">
          {new Date(solve.date).toLocaleDateString()}
        </p>
      </div>
      <div className="flex row-start-1 col-start-3 row-span-2 justify-center">
        <Button
          className="text-sub group-hover:opacity-100 hover:opacity-100 opacity-0 transition-opacity w-full"
          size="md"
          variant="subtle"
          icon={InfoIcon}
        />
        <Button
          className="text-sub group-hover:opacity-100 hover:opacity-100 opacity-0 transition-opacity w-full"
          size="md"
          variant="subtle"
          icon={TrashIcon}
          onClick={deleteThisSolve}
        />
      </div>
    </div>
  );
};

SolveListItem.whyDidYouRender = true;

export default SolveListItem;
