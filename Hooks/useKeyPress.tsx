import { useEffect, useState } from "react";

export default function useKeyPress() {
  // State for keeping track of whether key is pressed
  const [keyPressed, setKeyPressed] = useState<boolean>(false);
  const [key, setKey] = useState<string>();

  function downHandler(evt: KeyboardEvent) {
    // evt.preventDefault();
    setKeyPressed(true);
    setKey(evt.key);
  }
  // If released key is our target key then set to false
  function upHandler(evt: KeyboardEvent) {
    // evt.preventDefault();
    setKeyPressed(false);
    setKey(undefined);
  }
  // Add event listeners
  useEffect(() => {
    window.addEventListener("keydown", downHandler);
    window.addEventListener("keyup", upHandler);
    // Remove event listeners on cleanup
    return () => {
      window.removeEventListener("keydown", downHandler);
      window.removeEventListener("keyup", upHandler);
    };
  }, []); // Empty array ensures that effect is only run on mount and unmount
  return { keyPressed, key };
}
