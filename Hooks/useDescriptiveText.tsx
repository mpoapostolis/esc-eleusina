import { useEffect } from "react";
import { useStore } from "../store";

export default function useDescriptiveText(str: string, time: number) {
  const store = useStore();
  useEffect(() => {
    setTimeout(() => {
      store.setStatus("MODAL");
      store.setDescriptiveText(str);
    }, time);
  }, []);
}
