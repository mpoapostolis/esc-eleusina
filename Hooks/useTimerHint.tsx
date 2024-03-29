import { useEffect } from "react";
import { useTimer } from "use-timer";
import { useStore } from "../store";

export default function useTimerHint(
  str: string,
  time: number = 0,
  start: boolean = false
) {
  const store = useStore();

  const timer = useTimer({
    initialTime: time,

    timerType: "DECREMENTAL",
    step: 1,
  });
  useEffect(() => {
    if (timer.time === 0) {
      store.setIsHintVisible(true);
      store.setHint(str);
    }
  }, [timer.time]);

  useEffect(() => {
    if (store.status === "RUNNING" && start) timer.start();
    if (store.status !== "RUNNING") timer.pause();
  }, [store.status, start]);

  useEffect(() => {
    store.setHint(undefined);
    timer.reset();
    if (start) timer.start();
  }, [store.scene, start]);
}
