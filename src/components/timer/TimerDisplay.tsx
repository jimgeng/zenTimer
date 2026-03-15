import { useRef, useState } from "react";
import useSpacebar from "../../hooks/useSpacebar";
import { useTimerStore } from "../../store/useTimerStore";
import clsx from "clsx";
import { HOLD_TO_CONFIRM_MS } from "../../utils/constants";
import { useInspection } from "../../hooks/useInspection";
import { usePrecisTimer } from "../../hooks/usePrecisTimer";
import { calculateTimerText, formatTime } from "../../utils/timeHelpers";

const TimerDisplay = () => {
  const { status, setStatus } = useTimerStore();

  // ready must be a state since we update color to be green on ready.
  // resettedAfterSolveRef is a ref since it's just used to track whether
  // we should go to inspecting on space down from idle, and doesn't affect rendering.
  // if i can get away with not using state i will do it.
  const [readyToSolve, setReadyToSolve] = useState(false);
  const [solveTime, setSolveTime] = useState(0);
  const readyTimeoutRef = useRef<number | null>(null);
  const { seconds: inspectSeconds, penalty: inspectPenalty } =
    useInspection(status);
  const timerRef = useRef<HTMLDivElement>(null);

  const startTimeRef = usePrecisTimer(status, timerRef);

  const onDown = () => {
    if (status === "inspecting") {
      readyTimeoutRef.current = setTimeout(() => {
        setReadyToSolve(true);
      }, HOLD_TO_CONFIRM_MS);
    } else if (status === "running") {
      const endTime = performance.now();
      const elapsed = endTime - (startTimeRef.current ?? endTime);
      // Force update final time before re-mounting react-managed div
      timerRef.current!.textContent = formatTime(elapsed);
      setStatus("stopped");
      setSolveTime(elapsed);
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

  const holdingBeforeInspection =
    status === "stopped" || (status === "idle" && pressed);
  const holdingDuringInspection = status === "inspecting" && pressed;

  const timerClass = clsx("text-2xl font-bold", {
    "text-ok":
      holdingBeforeInspection || (holdingDuringInspection && readyToSolve),
    "text-warning": holdingDuringInspection && !readyToSolve,
  });

  return status === "running" ? (
    <div className={timerClass} ref={timerRef}>
      {/* This div will hold the ref for the animated timer*/}
    </div>
  ) : (
    <div className={timerClass}>
      {/* {status} {inspectSeconds} {inspectPenalty} {formatTime(solveTime)} */}
      {calculateTimerText(status, solveTime, inspectPenalty, inspectSeconds)}
    </div>
  );
};

export default TimerDisplay;
