import { useEffect } from "react";
import SolveEdit from "./components/timer/SolveTools";
import TimerDisplay from "./components/timer/TimerDisplay";
import { useTimerStore } from "./store/useTimerStore";
import { SOLVE_UI_OPACITY } from "./utils/constants";
import SolveList from "./components/solvelist/SolveList";
import ScrambleDisplay from "./components/scramble/ScrambleDisplay";
import ScrambleTools from "./components/scramble/ScrambleTools";

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
        <div className="mb-auto">
          <div className="text-lg flex justify-between items-center transition-opacity hide-on-solve gap-2">
            <ScrambleDisplay />
            <ScrambleTools />
          </div>
        </div>
        <div className="text-8xl font-bold place-self-center text-center select-none flex flex-col gap-4">
          <TimerDisplay />
          <SolveEdit />
        </div>
      </main>
      <footer className="text-sub flex full-column justify-between">
        <div>Made by Suub</div>
        <div>v0.1.0</div>
      </footer>
    </div>
  );
}

export default App;
