import { useEffect } from "react";
import { HelpKey, useStore } from "../store";

export default function useSetHint(str?: HelpKey) {
  const store = useStore();
  useEffect(() => {
    store.setHint(str);
  }, [store.status]);
}
