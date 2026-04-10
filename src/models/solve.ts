export type Penalty = "none" | "+2" | "DNF";

export interface Solve {
  id: string;
  timeMs: number;
  scramble: string;
  date: number;
  penalty: Penalty;
}
