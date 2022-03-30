import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useState } from "react";
import { useTimer } from "use-timer";
import { useStore } from "../store";

export default function useTimerHint(str: string, time: number = 0) {
  const store = useStore();
  const timer = useTimer({
    initialTime: time,
    timerType: "DECREMENTAL",
    step: 1,
    endTime: 0,
  });

  useEffect(() => {
    console.log(timer.time);
    if (timer.time === 0) {
      store.setIsHintVisible(true);
      store.setHint(str);
    }
  }, [timer.time]);

  useEffect(() => {
    if (store.status === "RUNNING") timer.start();
    if (store.status !== "RUNNING") timer.pause();
  }, [store.status]);

  const [appear, setAppear] = useState(false);
  // useEffect(() => {
  //   if (store.status === "RUNNING" && !appear)
  //     setTimeout(() => {
  //       setAppear(true);
  //     }, time * 1000);
  // }, [store.status, appear, store.scene]);

  useEffect(() => {
    store.setHint(undefined);
    timer.reset();
    timer.start();
  }, [store.scene]);

  useFrame((t) => {});
}
