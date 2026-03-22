import { useEffect } from "react";
import { useTimerStore } from "../store/useTimerStore";

export default function ScrambleDisplay() {
  const { currentScramble } = useTimerStore();

  useEffect(() => {
    if (!currentScramble) {
      useTimerStore.getState().generateNewScramble();
    }
  }, [currentScramble]);

  return (
    <div className="p-3 text-center text-xl/6 font-semibold bg-sub-bg rounded-lg">
      <h2>{currentScramble}</h2>
    </div>
  );
}
