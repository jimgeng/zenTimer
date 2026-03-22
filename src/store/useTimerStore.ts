import { create } from "zustand";
import { persist } from "zustand/middleware";
import { nanoid } from "nanoid";

export type TimerStatus = "idle" | "inspecting" | "running" | "stopped";
export type Penalty = "none" | "+2" | "DNF";

export interface Solve {
  id: string;
  timeMs: number;
  scramble: string;
  date: number;
  penalty: Penalty;
}

interface TimerState {
  status: TimerStatus;
  currentScramble: string;
  solves: Solve[];
  inspectionEnabled: boolean;

  // Actions
  setStatus: (status: TimerStatus) => void;
  setScramble: (scramble: string) => void;
  generateNewScramble: () => void; // for generating scramble during inspection without updating current scramble until solve is added.
  addSolve: (timeMs: number, newScramble?: boolean) => void;
  toggleInspection: () => void;
  deleteSolve: (id: string) => void;
  clearSession: () => void;
}

const scrambleWorker = new Worker(
  new URL("../workers/scrambleWorker.ts", import.meta.url),
  { type: "module" },
);

export const useTimerStore = create<TimerState>()(
  persist(
    (set) => {
      // Setup listener for receiving scrambles from the worker.
      scrambleWorker.onmessage = (e) => {
        set({ currentScramble: e.data.scramble });
      };

      return {
        status: "idle",
        currentScramble: "",
        solves: [],
        inspectionEnabled: true,

        // App status management
        setStatus: (status) => set({ status }),

        // Scramble management
        setScramble: (currentScramble) => set({ currentScramble }),
        generateNewScramble: () => {
          // Generate a new scramble without updating the current one.
          // Will need to adapt different types of scrambles in the future, for now just 3x3.
          scrambleWorker.postMessage("generate");
        },

        // Solve management
        addSolve: (timeMs, newScramble?: boolean) => {
          set((state) => ({
            solves: [
              {
                id: nanoid(),
                timeMs,
                scramble: state.currentScramble,
                date: Date.now(),
                penalty: "none",
              },
              ...state.solves,
            ],
          }));
          if (newScramble) {
            scrambleWorker.postMessage("generate");
          }
        },
        deleteSolve: (id) =>
          set((state) => ({
            solves: state.solves.filter((s) => s.id !== id),
          })),

        // User settings / saved content
        toggleInspection: () =>
          set((state) => ({ inspectionEnabled: !state.inspectionEnabled })),
        clearSession: () => set({ solves: [] }),
      };
    },
    {
      name: "zentimer-storage",
      partialize: (state) => ({
        solves: state.solves,
        inspectionEnabled: state.inspectionEnabled,
        currentScramble: state.currentScramble,
      }),
    },
  ),
);
