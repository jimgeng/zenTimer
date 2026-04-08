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
  selectedSolveID: string | null; // for editing specific solves in the future, currently just used for the most recent solve after it's added.
  inspectionEnabled: boolean;

  // Actions
  // App status management
  setStatus: (status: TimerStatus) => void;

  // Scramble management
  setScramble: (scramble: string) => void;
  generateNewScramble: () => void; // for generating scramble during inspection without updating current scramble until solve is added.

  // Solve management
  setSelectedSolveID: (id: string | null) => void;
  addSolve: (timeMs: number, penalty: Penalty, newScramble?: boolean) => string;
  deleteSolve: (id: string) => void;
  editSolve: (
    id: string,
    params: {
      newTimeMs?: number;
      newPenalty?: Penalty;
    },
  ) => void; // for editing the most recent solve, used in SolveEdit component after solve is added.

  // User settings / saved content
  toggleInspection: () => void;
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
        selectedSolveID: null,
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
        setSelectedSolveID: (selectedSolveID) => set({ selectedSolveID }),
        addSolve: (timeMs, penalty, newScramble?: boolean) => {
          const newSolveID = nanoid();
          set((state) => ({
            solves: [
              {
                id: newSolveID,
                timeMs,
                scramble: state.currentScramble,
                date: Date.now(),
                penalty: penalty,
              },
              ...state.solves,
            ],
          }));
          if (newScramble) {
            scrambleWorker.postMessage("generate");
          }
          return newSolveID; // Return the ID of the newly added solve
        },
        deleteSolve: (id) =>
          set((state) => ({
            solves: state.solves.filter((s) => s.id !== id),
          })),
        editSolve: (id, { newTimeMs, newPenalty }) => {
          set((state) => {
            const solves = [...state.solves];
            const solveIndex = solves.findIndex((s) => s.id === id);
            if (solveIndex === -1) return { solves }; // No solve found, no update.
            const solve = solves[solveIndex];
            solves[solveIndex] = {
              ...solve,
              timeMs: newTimeMs ?? solve.timeMs,
              penalty: newPenalty ?? solve.penalty,
            };
            return { solves };
          });
        },

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
