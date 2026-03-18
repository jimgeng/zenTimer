import { useEffect } from "react";
import SolveEdit from "./components/timer/SolveEdit";
import TimerDisplay from "./components/timer/TimerDisplay";
import { useTimerStore } from "./store/useTimerStore";
import { SOLVE_UI_OPACITY } from "./utils/constants";

function App() {
  const { status } = useTimerStore();

  useEffect(() => {
    document.documentElement.style.setProperty(
      "--solve-opacity",
      SOLVE_UI_OPACITY.toString(),
    );
  }, []);

  return (
    <div
      data-timer-status={status}
      className="font-mono h-svh layout-grid p-8 gap-y-4"
    >
      <header className="text-main text-4xl font-bold full-column">
        monkeTimer
      </header>
      <main className="main-column grid grid-rows-[1fr_auto_1fr]">
        <div className="text-lg flex justify-center self-start transition-opacity hide-on-solve">
          <div className="p-4 text-xl bg-sub-bg rounded-xl">
            U2 B2 D' R' F' L D F2 R' U2 B2 R D2 B2 D2 L B2 U B'
          </div>
        </div>
        <div className="text-8xl font-bold place-self-center text-center select-none flex flex-col gap-4">
          <TimerDisplay />
          <SolveEdit />
        </div>
      </main>
      <footer className="text-sub flex full-column justify-between">
        <div>Made by Suub</div>
        {/* <div className="flex items-center gap-2">
          <ChevronDoubleDownIcon className="h-5 w-5" />
          Scroll down for history
        </div> */}
        <div>v0.1.0</div>
      </footer>
    </div>
  );
}

export default App;
