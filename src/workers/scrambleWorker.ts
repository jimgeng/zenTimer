import { randomScrambleForEvent } from "cubing/scramble";

let cachedScramblePromise: Promise<string> | null = null;

const generateAndCacheScramble = () => {
  cachedScramblePromise = randomScrambleForEvent("333").then((s) =>
    s.toString(),
  );
};

// Initial generation
generateAndCacheScramble();

self.onmessage = async (e: MessageEvent) => {
  if (e.data === "generate") {
    try {
      // If for some reason the promise isn't initialized, create it.
      if (!cachedScramblePromise) {
        generateAndCacheScramble();
      }

      // Wait for the current promise to resolve (could be already resolved or still pending)
      const scramble = await cachedScramblePromise;

      // Send the scramble back immediately
      self.postMessage({ scramble });

      // Start generating the next one in the background
      generateAndCacheScramble();
    } catch (error) {
      console.error("Scramble generation failed:", error);
      // Try to recover by starting a new generation
      generateAndCacheScramble();
    }
  }
};
