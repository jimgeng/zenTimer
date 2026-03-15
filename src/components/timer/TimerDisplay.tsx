import { useEffect, useRef, useCallback } from "react";
import { useTimerStore } from "../../store/useTimerStore";
import { useSpacebar } from "../../hooks/useSpacebar";
import { formatTime } from "../../utils/timeHelpers";

const TimerDisplay = () => {
  const { status, setStatus, addSolve } = useTimerStore();
  const timerRef = useRef<HTMLDivElement>(null);
  const startTimeRef = useRef<number>(0);
  const animationFrameRef = useRef<number>(0);
  const inspectionRef = useRef<number>(15);
  const workerRef = useRef<Worker | null>(null);

  // Initialize Web Worker for scrambles
  useEffect(() => {
    workerRef.current = new Worker(
      new URL("../../workers/scrambleWorker.ts", import.meta.url),
      { type: "module" },
    );

    workerRef.current.onmessage = (e) => {
      useTimerStore.getState().setScramble(e.data.scramble);
    };

    // Generate initial scramble
    workerRef.current.postMessage("generate");

    return () => workerRef.current?.terminate();
  }, []);

  const startTimer = useCallback(() => {
    setStatus("running");
    startTimeRef.current = performance.now();

    // Pre-generate the NEXT scramble while solving
    workerRef.current?.postMessage("generate");

    const update = () => {
      if (timerRef.current) {
        const delta = performance.now() - startTimeRef.current;
        timerRef.current.textContent = formatTime(delta);
      }
      animationFrameRef.current = requestAnimationFrame(update);
    };
    animationFrameRef.current = requestAnimationFrame(update);
  }, [setStatus]);

  const stopTimer = useCallback(() => {
    cancelAnimationFrame(animationFrameRef.current);
    const finalDelta = performance.now() - startTimeRef.current;

    if (timerRef.current) {
      timerRef.current.textContent = formatTime(finalDelta);
    }

    addSolve(finalDelta);
  }, [addSolve]);

  // Inspection Logic
  useEffect(() => {
    let interval: number;
    if (status === "inspecting") {
      inspectionRef.current = 15;
      if (timerRef.current) {
        timerRef.current.textContent = "15";
      }

      interval = window.setInterval(() => {
        inspectionRef.current -= 1;
        if (timerRef.current) {
          timerRef.current.textContent = inspectionRef.current.toString();
          if (inspectionRef.current <= 3) {
            timerRef.current.style.color = "var(--main-color)";
          }
        }
        if (inspectionRef.current <= 0) {
          clearInterval(interval);
          startTimer();
        }
      }, 1000);
    } else if (timerRef.current && status !== "running") {
      timerRef.current.style.color = "";
    }
    return () => clearInterval(interval);
  }, [status, startTimer]);

  useSpacebar(startTimer, stopTimer);

  return (
    <div className="grid grid-rows-[1fr_auto_1fr] h-[60vh] place-items-center w-full max-w-4xl mx-auto">
      <div />

      <div
        ref={timerRef}
        className="text-8xl md:text-9xl font-mono font-medium transition-colors duration-100 select-none tabular-nums"
      >
        {status === "idle" ? "0.00" : ""}
      </div>

      <div className="text-sub text-base h-6 font-mono self-start mt-8">
        {status === "running" ? "" : "press space to start"}
      </div>
    </div>
  );
};

export default TimerDisplay;
