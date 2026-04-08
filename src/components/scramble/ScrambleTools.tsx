import BackIcon from "../../assets/icons/BackIcon";
import RefreshIcon from "../../assets/icons/RefreshIcon";
import { useTimerStore } from "../../store/useTimerStore";
import Button from "../shared/Button";

export default function ScrambleTools() {
  const scrambleHistoryExists = useTimerStore(
    (state) => state.scrambleHistory.length > 0,
  );

  const getPreviousScramble = useTimerStore(
    (state) => state.goToPreviousScramble,
  );

  const getNewScramble = useTimerStore((state) => state.generateNewScramble);

  return (
    <div className="flex justify-center gap-2">
      <Button
        icon={BackIcon}
        disabled={!scrambleHistoryExists}
        onClick={getPreviousScramble}
      />
      <Button icon={RefreshIcon} onClick={getNewScramble} />
    </div>
  );
}
