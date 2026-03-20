import { useRef, useState } from "react";
import useSpacebar from "../../hooks/useSpacebar";
import { useTimerStore } from "../../store/useTimerStore";
import clsx from "clsx";
import { HOLD_TO_CONFIRM_MS } from "../../utils/constants";
import { useInspection } from "../../hooks/useInspection";
import { usePrecisTimer } from "../../hooks/usePrecisTimer";
import { calculateTimerText } from "../../utils/timeHelpers";

const TimerDisplay = () => {
  const { status, setStatus, addSolve, generateScramble } = useTimerStore();

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
      setStatus("stopped");
      setSolveTime(elapsed);
      addSolve(elapsed, true);
    }
  };

  const onUp = () => {
    clearTimeout(readyTimeoutRef.current!);
    if (status === "idle") {
      setStatus("inspecting");
    } else if (status === "inspecting" && readyToSolve) {
      setStatus("running");
      setReadyToSolve(false);
      generateScramble();
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

  const timerClass = clsx("transition-[scale,color] duration-150", {
    "text-ok":
      holdingBeforeInspection || (holdingDuringInspection && readyToSolve),
    "text-warning": holdingDuringInspection && !readyToSolve,
    "scale-110": holdingDuringInspection && readyToSolve,
  });

  return status === "running" ? (
    <div ref={timerRef} className="scale-110">
      {/* This div will hold the ref for the animated timer*/}
    </div>
  ) : (
    <div className={timerClass}>
      {calculateTimerText(status, solveTime, inspectPenalty, inspectSeconds)}
    </div>
  );
};

export default TimerDisplay;
