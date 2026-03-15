import { useEffect, useState } from "react";
import type { Penalty, TimerStatus } from "../store/useTimerStore";
import { INSPECTION_TIME_S } from "../utils/constants";

export const useInspection = (status: TimerStatus) => {
  const [seconds, setSeconds] = useState(INSPECTION_TIME_S);
  const [penalty, setPenalty] = useState<Penalty>("none");

  useEffect(() => {
    let interval: number;
    if (status === "inspecting") {
      setSeconds(INSPECTION_TIME_S);
      setPenalty("none");
      interval = setInterval(() => {
        setSeconds((s) => {
          const nextSec = s - 1;
          // Transition to +2 at 0
          if (nextSec === 0) setPenalty("+2");
          // Transition to DNF at -2 (which is 17 seconds total)
          else if (nextSec === -2) setPenalty("DNF");
          return nextSec;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [status]);

  return { seconds, penalty };
};
