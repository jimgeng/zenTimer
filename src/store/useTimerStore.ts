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
  nextScramble: string;
  solves: Solve[];
  inspectionEnabled: boolean;

  // Actions
  setStatus: (status: TimerStatus) => void;
  setScramble: (scramble: string) => void;
  cycleToNextScramble: () => void; // sets next scramble as current scramble.
  generateScramble: () => void; // for generating scramble during inspection without updating current scramble until solve is added.
  bootstrap: () => void; // generates initial scramble on app load, with logic to prevent overwriting existing scrambles on returning visits.
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
    (set, get) => {
      // Setup listener for receiving scrambles from the worker.
      scrambleWorker.onmessage = (e) => {
        set({ nextScramble: e.data.scramble });
      };

      return {
        status: "idle",
        currentScramble: "",
        nextScramble: "",
        solves: [],
        inspectionEnabled: true,

        // App status management
        setStatus: (status) => set({ status }),

        // Scramble management
        setScramble: (currentScramble) => set({ currentScramble }),
        cycleToNextScramble: () => {
          set((state) => ({ currentScramble: state.nextScramble }));
        },
        generateScramble: () => {
          // Generate a new scramble without updating the current one.
          // Will need to adapt different types of scrambles in the future, for now just 3x3.
          scrambleWorker.postMessage("generate");
        },

        // For first time users
        bootstrap: () => {
          // Generate the initial scramble on app load.
          const { currentScramble, nextScramble } = get();
          // 1. If we have absolutely nothing (First visit)
          if (!currentScramble && !nextScramble) {
            // Temporary listener to catch the FIRST one and put it in 'current'
            const initListener = (e: MessageEvent) => {
              set({ currentScramble: e.data.scramble });
              scrambleWorker.removeEventListener("message", initListener);
              get().generateScramble();
            };
            scrambleWorker.addEventListener("message", initListener);
            scrambleWorker.postMessage("generate");
            return;
          }
          // 2. If we have a current but NO next (Returning user)
          if (currentScramble && !nextScramble) {
            get().generateScramble();
          }
        },

        // Solve management
        addSolve: (timeMs, newScramble?: boolean) =>
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
            currentScramble: newScramble
              ? state.nextScramble
              : state.currentScramble,
          })),
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
        nextScramble: state.nextScramble,
      }),
    },
  ),
);
