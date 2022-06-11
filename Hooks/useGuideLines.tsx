import { useEffect } from "react";
import { useTimer } from "use-timer";
import { useStore } from "../store";

export default function useGuideLines(str: string, time: number = 2) {
  const store = useStore();
  const timer = useTimer({
    initialTime: time,
    timerType: "DECREMENTAL",
    step: 1,
  });

  useEffect(() => {
    if (timer.time === 0) {
      store.setguideLinesVissible(true);
      store.setguideLines(str);
    }
  }, [timer.time]);

  useEffect(() => {
    if (store.status === "RUNNING") timer.start();
    if (store.status !== "RUNNING") timer.pause();
  }, [store.status]);

  useEffect(() => {
    store.setguideLines(undefined);
    timer.reset();
    timer.start();
  }, [store.scene]);
}
