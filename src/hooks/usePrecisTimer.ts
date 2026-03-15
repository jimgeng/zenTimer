import { useEffect, useRef, type RefObject } from "react";
import type { TimerStatus } from "../store/useTimerStore";
import { formatTime } from "../utils/timeHelpers";

// TODO: replace HTMLElement with more specific type if possible
export const usePrecisTimer = (
  status: TimerStatus,
  timerRef: RefObject<HTMLElement | null>,
) => {
  const animationFrameRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);

  useEffect(() => {
    const update = () => {
      if (!startTimeRef.current) startTimeRef.current = performance.now();

      const now = performance.now();
      const elapsed = now - startTimeRef.current;

      if (timerRef.current) {
        // Direct DOM manipulation bypasses React render cycle
        timerRef.current.textContent = formatTime(elapsed);
      }

      animationFrameRef.current = requestAnimationFrame(update);
    };

    if (status === "running") {
      startTimeRef.current = performance.now();
      animationFrameRef.current = requestAnimationFrame(update);
    } else {
      // Stop the loop if status is anything else (idle, stopped, inspecting)
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    }

    return () => {
      if (animationFrameRef.current)
        cancelAnimationFrame(animationFrameRef.current);
    };
  }, [status, timerRef]);

  return startTimeRef;
};
