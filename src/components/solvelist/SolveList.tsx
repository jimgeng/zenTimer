import { useSessionStore } from "../../store/useSessionStore";
import SolveListItem from "./SolveListItem";

const emptySolves: never[] = [];

const SolveList = () => {
  const solves = useSessionStore((state) => {
    const activeSession = state.activeSessionId
      ? state.sessionsById[state.activeSessionId]
      : undefined;
    return activeSession?.solves ?? emptySolves;
  });
  const digitWidth = Math.floor(Math.log10(solves.length)) + 1; // calculate how many digits we need for the index number, to adjust width accordingly.

  return (
    <div className="hide-on-solve bg-sub-bg rounded-xl left-column min-h-0 flex flex-col">
      <div className="text-2xl/6 p-6 leading-5 border-b-4 border-bg">
        Solves
      </div>
      {/* Placeholders, will replace with SolveItemList once logic is implemented. */}
      <div className="p-6 flex flex-col gap-4 h-full overflow-y-auto">
        {solves.length === 0 ? (
          <p className="text-sub text-center">No solves yet. Get to it!</p>
        ) : (
          solves.map((solve, index) => (
            <SolveListItem
              key={solve.id}
              index={solves.length - index}
              solve={solve}
              latestSolve={index === 0} // animate the most recent solve added to the list.
              digitWidth={digitWidth}
            />
          ))
        )}
      </div>
    </div>
  );
};

SolveList.whyDidYouRender = true;

export default SolveList;
