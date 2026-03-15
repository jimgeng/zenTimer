import TimerDisplay from "./components/timer/TimerDisplay";
import { useTimerStore } from "./store/useTimerStore";
import { formatTime } from "./utils/timeHelpers";
import { calculateAverage } from "./utils/statsHelpers";

function App() {
  const { currentScramble, solves, status } = useTimerStore();

  const ao5 = calculateAverage(solves, 5);
  const ao12 = calculateAverage(solves, 12);

  return (
    <div className="min-h-screen grid grid-rows-[auto_1fr_auto] p-8 md:px-24">
      {/* Header / Scramble */}
      <header className="flex flex-col items-center gap-4">
        <div className="flex justify-between w-full max-w-5xl items-center mb-8">
          <h1 className="text-2xl font-bold tracking-tight text-main font-mono">
            ZenTimer
          </h1>
          <div className="flex gap-6 text-sub font-mono text-sm">
            <div>
              ao5:{" "}
              <span className="text-text">{ao5 ? formatTime(ao5) : "-"}</span>
            </div>
            <div>
              ao12:{" "}
              <span className="text-text">{ao12 ? formatTime(ao12) : "-"}</span>
            </div>
          </div>
        </div>

        <div
          className={`text-center max-w-3xl text-xl md:text-2xl font-medium transition-opacity duration-200 min-h-[4rem] flex items-center
            ${status === "running" || status === "inspecting" ? "opacity-0" : "opacity-100 text-text"}
          `}
        >
          {currentScramble}
        </div>
      </header>

      {/* Main Timer Area */}
      <main className="flex items-center justify-center">
        <TimerDisplay />
      </main>

      {/* Footer / Stats Sneak-peak */}
      <footer className="w-full max-w-5xl mx-auto border-t border-sub/20 pt-8 flex justify-between items-end text-sub font-mono text-xs">
        <div className="flex gap-4">
          <span>solves: {solves.length}</span>
          <span>last: {solves[0] ? formatTime(solves[0].timeMs) : "-"}</span>
        </div>
        <div>v1.0.0 (React 19)</div>
      </footer>
    </div>
  );
}

export default App;
