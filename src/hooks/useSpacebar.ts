import { useEffect, useState, useRef } from "react";

const useSpacebar = (onDown?: () => void, onUp?: () => void) => {
  const [pressed, setPressed] = useState(false);

  // Use refs for callbacks to avoid re-attaching listeners if functions change
  const onDownRef = useRef(onDown);
  const onUpRef = useRef(onUp);

  useEffect(() => {
    onDownRef.current = onDown;
    onUpRef.current = onUp;
  }, [onDown, onUp]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code !== "Space" || e.repeat) return;

      // Stop page from scrolling
      e.preventDefault();

      setPressed(true);
      onDownRef.current?.();
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code !== "Space") return;

      e.preventDefault();
      setPressed(false);
      onUpRef.current?.();
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []); // Empty array: listeners are attached once

  return pressed;
};

export default useSpacebar;
