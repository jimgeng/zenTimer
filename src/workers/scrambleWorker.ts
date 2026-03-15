import { randomScrambleForEvent } from "cubing/scramble";

self.onmessage = async (e: MessageEvent) => {
  if (e.data === "generate") {
    try {
      const scramble = await randomScrambleForEvent("333");
      self.postMessage({ scramble: scramble.toString() });
    } catch (error) {
      console.error("Scramble generation failed:", error);
    }
  }
};
