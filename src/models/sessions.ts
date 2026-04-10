import type { Solve } from "./solve";

export type SessionSettings = Record<string, unknown>; // WIP for settings

export interface Session {
  id: string;
  name: string;
  creationTime: number;
  solves: Solve[];
  settings: SessionSettings;
}
