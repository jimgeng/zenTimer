import clsx from "clsx";
import InfoIcon from "../../assets/icons/InfoIcon";
import TrashIcon from "../../assets/icons/TrashIcon";
import { useTimerStore, type Solve } from "../../store/useTimerStore";
import { formatTime } from "../../utils/timeHelpers";
import Button from "../shared/Button";

interface SolveListItemProps {
  solve: Solve;
  index: number;
  latestSolve?: boolean; // for animating new solves, will be true for the most recent solve when added.
}

const SolveListItem = ({ solve, index, latestSolve }: SolveListItemProps) => {
  const deleteThisSolve = () => {
    useTimerStore.getState().deleteSolve(solve.id);
  };

  const stoppedStatus = useTimerStore.getState().status === "stopped";

  return (
    <div className="group text-lg grid grid-cols-[auto_3fr_1fr] gap-x-2">
      <h4 className="text-sub row-span-2 w-8">#{index}</h4>
      <h3
        className={clsx("text-2xl font-light", {
          "animate-mount-glow": stoppedStatus && latestSolve,
        })}
      >
        {formatTime(solve.timeMs)}
      </h3>
      <p className="text-sub col-start-2 text-sm text-ellipsis text-nowrap min-w-0 overflow-hidden">
        {solve.scramble}
      </p>
      <div className="flex row-start-1 col-start-3 row-span-2 justify-end">
        <Button
          className="text-sub group-hover:opacity-100 hover:opacity-100 opacity-0 transition-opacity"
          size="md"
          variant="subtle"
          icon={InfoIcon}
        />
        <Button
          className="text-sub group-hover:opacity-100 hover:opacity-100 opacity-0 transition-opacity"
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
