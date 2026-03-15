import TimerDisplay from "./components/timer/TimerDisplay";
import { useTimerStore } from "./store/useTimerStore";
import { calculateAverage } from "./utils/statsHelpers";

function App() {
  const { currentScramble, solves, status } = useTimerStore();

  return (
    <div>
      <header>zenTimer</header>
      <main>
        <div>Scramble Here WIP</div>
        <TimerDisplay />
      </main>
      <footer>Footer</footer>
    </div>
  );
}

export default App;
