import { useEffect, useState } from "react";
type K = {
  key: string;
};

export default function useKeyPress(targetKey: string) {
  // State for keeping track of whether key is pressed
  const [keyPressed, setKeyPressed] = useState<boolean>(false);
  // If pressed key is our target key then set to true
  function downHandler({ key }: K) {
    if (key === targetKey) {
      setKeyPressed(false);
    }
  }
  // If released key is our target key then set to false
  const upHandler = ({ key }: K) => {
    if (key === targetKey) {
      setKeyPressed(true);
    }
  };
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
  return keyPressed;
}
