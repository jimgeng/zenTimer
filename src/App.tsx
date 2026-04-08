import { useEffect } from "react";
import SolveEdit from "./components/timer/SolveEdit";
import TimerDisplay from "./components/timer/TimerDisplay";
import { useTimerStore } from "./store/useTimerStore";
import { SOLVE_UI_OPACITY } from "./utils/constants";
import SolveList from "./components/solvelist/SolveList";
import ScrambleDisplay from "./components/ScrambleDisplay";

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
      className="font-sans h-svh layout-grid p-8 gap-y-4"
    >
      <header className="text-main text-4xl full-column">
        <h1>monkeyTimer</h1>
      </header>
      <SolveList />
      <main className="main-column grid grid-rows-[1fr_auto_1fr] font-mono">
        <div className="text-lg flex justify-center self-start transition-opacity hide-on-solve">
          <ScrambleDisplay />
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
