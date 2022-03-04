import { useEffect, useState } from "react";
import { useStore } from "../store";

export default function useGuideLines(str: string, time: number = 0) {
  const store = useStore();
  const [appear, setAppear] = useState(false);
  useEffect(() => {
    if (store.status === "RUNNING" && !appear)
      setTimeout(() => {
        store.setguideLinesVissible(true);
        store.setStatus("MODAL");
        store.setguideLines(str);
        setAppear(true);
      }, time);
  }, [store.status, appear]);
}
