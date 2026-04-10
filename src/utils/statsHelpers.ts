import type { Solve } from "../models/solve";

export const calculateAverage = (
  solves: Solve[],
  count: number,
): number | null => {
  if (solves.length < count) return null;

  const times = solves
    .slice(0, count)
    .map((s) => (s.penalty === "+2" ? s.timeMs + 2000 : s.timeMs));

  if (count === 3) {
    return times.reduce((a, b) => a + b, 0) / 3;
  }

  // WCA average: remove best and worst
  const sorted = [...times].sort((a, b) => a - b);
  const trimmed = sorted.slice(1, -1);
  return trimmed.reduce((a, b) => a + b, 0) / trimmed.length;
};

export const getBestSolve = (solves: Solve[]): number | null => {
  if (solves.length === 0) return null;
  return Math.min(...solves.map((s) => s.timeMs));
};
