import { useThree } from "@react-three/fiber";
import { useEffect } from "react";
import { HelpKey, useStore } from "../store";

export default function useTimerHint(
  str: HelpKey,
  time: number,
  hide: boolean = false
) {
  const t = useThree();
  const store = useStore();
  useEffect(() => {
    t.clock.start();
    return () => t.clock.stop();
  }, []);
  useEffect(() => {
    if (hide) return;
    const elapsedTime = Math.floor(t.clock.elapsedTime);
    if (store.status === "RUNNING" && time === elapsedTime) store.setHint(str);
  }, [t.clock.elapsedTime]);
}
