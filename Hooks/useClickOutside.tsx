import { useCallback, useEffect, useState } from "react";

function useClickOutside<T extends HTMLElement>(element: T | null) {
  const [clickOutside, setClickOutside] = useState(false);

  const listener = useCallback(
    (event: MouseEvent | TouchEvent) => {
      const target = event.target as HTMLElement;
      if (element) {
        setClickOutside(!element.contains(target));
      }
    },
    [element]
  );

  useEffect(() => {
    const onWindowBlur = () => {
      setClickOutside(true);
    };

    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);
    window.addEventListener("blur", onWindowBlur);
    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
      window.removeEventListener("blur", onWindowBlur);
    };
  }, [listener]);
  return clickOutside;
}

export default useClickOutside;
