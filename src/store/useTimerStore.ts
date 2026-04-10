import { create } from "zustand";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

export type TimerStatus = "idle" | "inspecting" | "running" | "stopped";

interface TimerState {
  status: TimerStatus;
  currentScramble: string;
  scrambleHistory: string[];
  inspectionEnabled: boolean;

  // Actions
  // App status management
  setStatus: (status: TimerStatus) => void;

  // Scramble management
  setScramble: (scramble: string) => void;
  generateNewScramble: () => void;
  goToPreviousScramble: () => void;

  // User settings / saved content
  toggleInspection: () => void;
}

const scrambleWorker = new Worker(
  new URL("../workers/scrambleWorker.ts", import.meta.url),
  { type: "module" },
);

export const useTimerStore = create<TimerState>()(
  persist(
    immer((set) => {
      // Setup listener for receiving scrambles from the worker.
      scrambleWorker.onmessage = (e) => {
        set({ currentScramble: e.data.scramble });
      };

      return {
        status: "idle",
        currentScramble: "",
        scrambleHistory: [],
        inspectionEnabled: true,

        // App status management
        setStatus: (status) => set({ status }),

        // Scramble management
        setScramble: (currentScramble) => set({ currentScramble }),
        generateNewScramble: () => {
          // Generate a new scramble without updating the current one.
          // Will need to adapt different types of scrambles in the future, for now just 3x3.
          set((state) => {
            state.scrambleHistory.unshift(state.currentScramble);
          });
          scrambleWorker.postMessage("generate");
        },
        goToPreviousScramble: () =>
          set((state) => {
            if (state.scrambleHistory.length === 0) return;

            const previousScramble = state.scrambleHistory.shift();
            if (previousScramble === undefined) return;

            state.currentScramble = previousScramble;
          }),

        // User settings / saved content
        toggleInspection: () =>
          set((state) => ({ inspectionEnabled: !state.inspectionEnabled })),
      };
    }),
    {
      name: "zentimer-timer-store",
      partialize: (state) => ({
        inspectionEnabled: state.inspectionEnabled,
        currentScramble: state.currentScramble,
      }),
    },
  ),
);
