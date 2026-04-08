import type { TimerStatus } from "../store/useTimerStore";

export const formatTime = (ms: number): string => {
  if (ms < 0) return "0.00";

  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  const centiseconds = Math.floor((ms % 1000) / 10);

  if (minutes > 0) {
    return `${minutes}:${seconds.toString().padStart(2, "0")}.${centiseconds
      .toString()
      .padStart(2, "0")}`;
  }

  return `${seconds}.${centiseconds.toString().padStart(2, "0")}`;
};

export const calculateTimerText = (
  status: TimerStatus,
  time: number,
  penalty: string,
  inspectSeconds: number,
) => {
  // TODO: move dnf and +2 displayinto a different component so it looks nicer later on.
  if (status === "idle" || status === "stopped") {
    return formatTime(time);
  }
  if (status === "inspecting") {
    if (penalty === "DNF") return "DNF";
    if (penalty === "+2") return "+2";
    return inspectSeconds > 0 ? inspectSeconds.toString() : "0";
  }
};
