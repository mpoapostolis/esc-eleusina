import { loadSound } from "../../../utils";
import Link from "next/link";
import { useRouter } from "next/dist/client/router";
import { useStore } from "../../../store";

export default function HelpUiIcon() {
  const hint = loadSound("/sounds/hint.wav");
  const store = useStore();
  return (
    <button
      onClick={() => {
        hint?.play();
        store.setIsHintVisible(!store.isHintVisible);
      }}
      className="relative border-4 p-3 bg-yellow-700 border-yellow-400 cursor-pointer pointer-events-auto"
    >
      <img
        src="https://s2.svgbox.net/materialui.svg?ic=help_outline&color=ddd"
        width={48}
        height={48}
      />
    </button>
  );
}
