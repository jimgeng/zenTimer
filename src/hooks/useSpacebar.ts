import { useEffect, useRef } from "react";
import { useTimerStore } from "../store/useTimerStore";

export const useSpacebar = (onStart: () => void, onStop: () => void) => {
  const { status, inspectionEnabled, setStatus } = useTimerStore();
  const isHolding = useRef(false);
  const holdTimeout = useRef<number | null>(null);
  const isReady = useRef(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code !== "Space" || e.repeat) return;
      e.preventDefault();

      if (status === "running") {
        onStop();
        return;
      }

      if (status === "inspecting") {
        onStart(); // Start solve immediately from inspection
        return;
      }

      if (status === "idle" || status === "stopped") {
        isHolding.current = true;
        // Visual feedback for "ready" state (csTimer style)
        // We could use a callback for this, but for now we just track it
        holdTimeout.current = window.setTimeout(() => {
          if (isHolding.current) {
            isReady.current = true;
            // Trigger visual cue if needed
          }
        }, 300);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code !== "Space") return;
      e.preventDefault();

      if (isHolding.current) {
        if (isReady.current) {
          if (inspectionEnabled) {
            setStatus("inspecting");
          } else {
            onStart();
          }
        }
        isHolding.current = false;
        isReady.current = false;
        if (holdTimeout.current) clearTimeout(holdTimeout.current);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [status, inspectionEnabled, onStart, onStop, setStatus]);

  return { isReady: isReady.current };
};
