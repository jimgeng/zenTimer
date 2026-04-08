import { useEffect } from "react";
import TrashIcon from "../../assets/icons/TrashIcon";
import { useTimerStore, type Penalty } from "../../store/useTimerStore";
import Button from "../shared/Button";
import clsx from "clsx";

const BUTTON_SIZE = "sm";

export default function SolveEdit() {
  const selectedSolveID = useTimerStore((state) => state.selectedSolveID);
  const setSelectedSolveID = useTimerStore((state) => state.setSelectedSolveID);
  const solve = useTimerStore((state) =>
    state.solves.find((s) => s.id === selectedSolveID),
  );

  const disabled = selectedSolveID === null || solve === undefined;

  // Clear the current solve time when escape is pressed.
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && selectedSolveID !== null) {
        setSelectedSolveID(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedSolveID, setSelectedSolveID]);

  const togglePenalty = (penalty: Penalty) => {
    if (solve && solve?.penalty !== penalty) {
      useTimerStore.getState().editSolve(solve!.id, { newPenalty: penalty });
    } else if (solve && solve?.penalty === penalty) {
      useTimerStore.getState().editSolve(solve!.id, { newPenalty: "none" });
    }
  };

  const onPlusTwo = () => {
    togglePenalty("+2");
  };
  const onDNF = () => {
    togglePenalty("DNF");
  };
  const onDelete = () => {
    useTimerStore.getState().deleteSolve(selectedSolveID!);
    setSelectedSolveID(null);
  };

  return (
    <div className="text-base flex gap-12 justify-center hide-on-solve">
      <Button
        className={clsx("transition-colors", {
          "text-warning": solve?.penalty === "+2",
        })}
        size={BUTTON_SIZE}
        variant="subtle"
        text="+2"
        disabled={disabled}
        onClick={onPlusTwo}
      />
      <Button
        className={clsx("transition-colors", {
          "text-danger": solve?.penalty === "DNF",
        })}
        size={BUTTON_SIZE}
        variant="subtle"
        text="DNF"
        disabled={disabled}
        onClick={onDNF}
      />
      <Button
        size={BUTTON_SIZE}
        variant="subtle"
        icon={TrashIcon}
        disabled={disabled}
        onClick={onDelete}
      />
    </div>
  );
}
