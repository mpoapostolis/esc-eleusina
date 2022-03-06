import { useEffect, useState } from "react";
import { useStore } from "../store";

export default function useTimerHint(str: string, time: number = 0) {
  const store = useStore();
  const [appear, setAppear] = useState(false);
  useEffect(() => {
    if (store.status === "RUNNING" && !appear)
      setTimeout(() => {
        store.setIsHintVisible(true);
        store.setHint(str);
        setAppear(true);
      }, time * 1000);
  }, [store.status, appear]);
}
