import { useEffect } from "react";
import { useTimer } from "use-timer";
import { getMiniGames } from "../queries";
import { getItems } from "../queries/items";
import { useStore } from "../store";

export default function useTimerHint(str: string, time: number = 0) {
  const store = useStore();

  const { data: miniGames } = getMiniGames();
  const currScene = miniGames.find((e) => e.scene === store.scene);

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
    if (store.status === "RUNNING") timer.start();
    if (store.status !== "RUNNING") timer.pause();
  }, [store.status]);

  useEffect(() => {
    store.setHint(undefined);
    timer.reset();
    timer.start();
  }, [store.scene]);
}
