import { create } from "zustand";
import { persist } from "zustand/middleware";
import { nanoid } from "nanoid";

export type TimerStatus = "idle" | "inspecting" | "running" | "stopped";

export interface Solve {
  id: string;
  timeMs: number;
  scramble: string;
  date: number;
  penalty: "none" | "+2" | "DNF";
}

interface TimerState {
  status: TimerStatus;
  currentScramble: string;
  solves: Solve[];
  inspectionEnabled: boolean;

  // Actions
  setStatus: (status: TimerStatus) => void;
  setScramble: (scramble: string) => void;
  addSolve: (timeMs: number) => void;
  toggleInspection: () => void;
  deleteSolve: (id: string) => void;
  clearSession: () => void;
}

export const useTimerStore = create<TimerState>()(
  persist(
    (set) => ({
      status: "idle",
      currentScramble: "Generating scramble...",
      solves: [],
      inspectionEnabled: true,

      setStatus: (status) => set({ status }),
      setScramble: (currentScramble) => set({ currentScramble }),
      addSolve: (timeMs) =>
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
          status: "stopped",
        })),
      toggleInspection: () =>
        set((state) => ({ inspectionEnabled: !state.inspectionEnabled })),
      deleteSolve: (id) =>
        set((state) => ({
          solves: state.solves.filter((s) => s.id !== id),
        })),
      clearSession: () => set({ solves: [] }),
    }),
    {
      name: "zentimer-storage",
    },
  ),
);
