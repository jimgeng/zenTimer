import TimerDisplay from "./components/timer/TimerDisplay";

function App() {
  return (
    <div className="font-mono h-svh layout-grid py-8 gap-y-4">
      <header className="text-main text-4xl font-bold main-column">
        zenTimer
      </header>
      <main className="main-column grid grid-rows-[1fr_auto_1fr]">
        <div className="text-lg flex justify-center self-start">
          <div className="p-4 bg-sub-bg rounded-xl">Scramble Here WIP</div>
        </div>
        <div className="text-8xl font-bold place-self-center select-none">
          <TimerDisplay />
        </div>
      </main>
      <footer className="text-sub flex main-column justify-between">
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
