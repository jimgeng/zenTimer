import { nanoid } from "nanoid";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import type { Session } from "../models/sessions";
import type { Penalty, Solve } from "../models/solve";

export const EMPTY_SOLVES: Solve[] = [];

type SessionsById = Record<string, Session>;

const getEarliestSession = (sessionsById: SessionsById): Session | null => {
  const sessions = Object.values(sessionsById);
  if (sessions.length === 0) return null;

  return sessions.reduce((earliest, current) =>
    (current.creationTime ?? 0) < (earliest.creationTime ?? 0)
      ? current
      : earliest,
  );
};

const getDefaultSessionName = (sessionsById: SessionsById) => {
  const sessionNames = Object.values(sessionsById).map(
    (session) => session.name,
  );
  let index = 1;
  while (sessionNames.includes(`New Session ${index}`)) {
    index++;
  }
  return `New Session ${index}`;
};

interface SessionState {
  sessionsById: SessionsById;
  activeSessionId: string | null;
  selectedSolveID: string | null;

  createSession: (name?: string) => string;
  switchSession: (id: string) => void;
  renameSession: (id: string, name: string) => void;
  deleteSession: (id: string) => void;
  setSelectedSolveID: (id: string | null) => void;
  addSolveToActiveSession: (params: {
    timeMs: number;
    penalty: Penalty;
    scramble: string;
  }) => string;
  deleteSolveFromActiveSession: (id: string) => void;
  editSolveInActiveSession: (
    id: string,
    params: { newTimeMs?: number; newPenalty?: Penalty },
  ) => void;
}

export const useSessionStore = create<SessionState>()(
  persist(
    immer((set) => {
      const initialSessionId = nanoid();
      return {
        sessionsById: {
          [initialSessionId]: {
            id: initialSessionId,
            name: "New Session 1",
            creationTime: Date.now(),
            solves: [],
            settings: {},
          },
        },
        activeSessionId: initialSessionId,
        selectedSolveID: null,

        createSession: (name?: string) => {
          const sessionId = nanoid();

          set((state) => {
            const sessionName = name?.trim().length
              ? name.trim()
              : getDefaultSessionName(state.sessionsById);
            state.sessionsById[sessionId] = {
              id: sessionId,
              name: sessionName,
              creationTime: Date.now(),
              solves: [],
              settings: {},
            };
            state.activeSessionId = sessionId;
            state.selectedSolveID = null;
          });

          return sessionId;
        },

        switchSession: (id) =>
          set((state) => {
            if (!state.sessionsById[id]) return;

            state.activeSessionId = id;
            state.selectedSolveID = null;
          }),

        renameSession: (id, name) =>
          set((state) => {
            const trimmedName = name.trim();
            const session = state.sessionsById[id];
            if (!trimmedName.length || !session || session.name === trimmedName)
              return;

            session.name = trimmedName;
          }),

        deleteSession: (id) =>
          set((state) => {
            const allSessions = Object.values(state.sessionsById);
            if (!state.sessionsById[id] || allSessions.length <= 1) {
              return;
            }

            delete state.sessionsById[id];

            if (state.activeSessionId === id) {
              state.activeSessionId =
                getEarliestSession(state.sessionsById)?.id ?? null;
            }
          }),

        setSelectedSolveID: (id) =>
          set((state) => {
            state.selectedSolveID = id;
          }),

        addSolveToActiveSession: ({ timeMs, penalty, scramble }) => {
          const solveId = nanoid();

          const newSolve: Solve = {
            id: solveId,
            timeMs,
            scramble,
            date: Date.now(),
            penalty,
          };

          set((draft) => {
            if (draft.activeSessionId === null) {
              const sessionId = nanoid();
              draft.sessionsById[sessionId] = {
                id: sessionId,
                name: "Session 1",
                creationTime: Date.now(),
                solves: [newSolve],
                settings: {},
              };
              draft.activeSessionId = sessionId;
              return;
            }

            const activeSession = draft.sessionsById[draft.activeSessionId];
            if (!activeSession) return;

            activeSession.solves.unshift(newSolve);
          });

          return solveId;
        },

        deleteSolveFromActiveSession: (id) =>
          set((state) => {
            const activeSessionId = state.activeSessionId;
            if (!activeSessionId) return;

            const activeSession = state.sessionsById[activeSessionId];
            if (!activeSession) return;

            const solveIndex = activeSession.solves.findIndex(
              (solve) => solve.id === id,
            );

            if (solveIndex === -1) return;

            if (state.selectedSolveID === id) {
              state.selectedSolveID = null;
            }

            activeSession.solves.splice(solveIndex, 1);
          }),

        editSolveInActiveSession: (id, { newTimeMs, newPenalty }) =>
          set((state) => {
            const activeSessionId = state.activeSessionId;
            if (!activeSessionId) return;

            const activeSession = state.sessionsById[activeSessionId];
            if (!activeSession) return;

            const solve = activeSession.solves.find((entry) => entry.id === id);
            if (!solve) return;

            const nextTimeMs = newTimeMs ?? solve.timeMs;
            const nextPenalty = newPenalty ?? solve.penalty;
            if (nextTimeMs === solve.timeMs && nextPenalty === solve.penalty) {
              return;
            }

            solve.timeMs = nextTimeMs;
            solve.penalty = nextPenalty;
          }),
      };
    }),
    {
      name: "zentimer-session-storage",
      partialize: (state) => ({
        sessionsById: state.sessionsById,
        activeSessionId: state.activeSessionId,
      }),
    },
  ),
);
