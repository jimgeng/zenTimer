import { useRef, useState } from "react";
import useSpacebar from "../../hooks/useSpacebar";
import { useTimerStore } from "../../store/useTimerStore";
import clsx from "clsx";
import { HOLD_TO_CONFIRM_MS } from "../../utils/constants";
import { useInspection } from "../../hooks/useInspection";
import { usePrecisTimer } from "../../hooks/usePrecisTimer";
import { calculateTimerText } from "../../utils/timeHelpers";

const TimerDisplay = () => {
  const status = useTimerStore((state) => state.status);
  const setSelectedSolveID = useTimerStore((state) => state.setSelectedSolveID);
  const setStatus = useTimerStore((state) => state.setStatus);
  const addSolve = useTimerStore((state) => state.addSolve);

  const solveTime = useTimerStore(
    (state) =>
      state.solves.filter((s) => s.id === state.selectedSolveID)[0]?.timeMs ??
      0,
  );

  const [readyToSolve, setReadyToSolve] = useState(false);
  const readyTimeoutRef = useRef<number | null>(null);
  const { seconds: inspectSeconds, penalty: inspectPenalty } =
    useInspection(status);
  const timerRef = useRef<HTMLSpanElement>(null);

  const startTimeRef = usePrecisTimer(status, timerRef);

  const onDown = () => {
    if (status === "inspecting") {
      readyTimeoutRef.current = setTimeout(() => {
        setReadyToSolve(true);
      }, HOLD_TO_CONFIRM_MS);
    } else if (status === "running") {
      const endTime = performance.now();
      const elapsed = endTime - (startTimeRef.current ?? endTime);
      setStatus("stopped");
      const id = addSolve(elapsed, inspectPenalty, true);
      setSelectedSolveID(id);
    }
  };

  const onUp = () => {
    clearTimeout(readyTimeoutRef.current!);
    if (status === "idle") {
      setStatus("inspecting");
    } else if (status === "inspecting" && readyToSolve) {
      setStatus("running");
      setReadyToSolve(false);
    } else if (status === "stopped") {
      setStatus("idle");
    }
  };

  // local state to track ready to solve after inspection.
  // will set true after held down for HOLD_TO_CONFIRM_MS in inspection.
  const pressed = useSpacebar(onDown, onUp);

  // STYLING STUFF
  const holdingBeforeInspection =
    status === "stopped" || (status === "idle" && pressed);
  const holdingDuringInspection = status === "inspecting" && pressed;

  const timerClass = clsx(
    "transition-[scale,color] duration-150 inline-block",
    {
      "text-ok":
        holdingBeforeInspection || (holdingDuringInspection && readyToSolve),
      "text-warning": holdingDuringInspection && !readyToSolve,
      "scale-110": holdingDuringInspection && readyToSolve,
    },
  );

  const timerText = calculateTimerText(
    status,
    solveTime,
    inspectPenalty,
    inspectSeconds,
  );
  console.log(`solveTime: ${solveTime}`);

  return (
    <div>
      {status === "running" ? (
        <span ref={timerRef} className="scale-110 inline-block">
          {/* This span will hold the ref for the animated timer*/}
        </span>
      ) : (
        <span className={timerClass}>{timerText}</span>
      )}
      {(status === "idle" || status === "stopped") &&
        (inspectPenalty === "+2" ? (
          <span className="text-base font-bold text-warning absolute ml-1 mt-1.5">
            +2{" "}
          </span>
        ) : inspectPenalty === "DNF" ? (
          <span className="text-base font-bold text-danger absolute ml-1 mt-1.5">
            DNF
          </span>
        ) : null)}
    </div>
  );
};

export default TimerDisplay;
