import { useStore } from "../../../store";
import { loadSound } from "../../../utils";

export const helps: Record<string, string> = {
  intro:
    "Ψάξε και βρες την πέτρινη πλάκα με τον Όρκο του Μύστη. Στο κείμενο, δείξε το ζευγάρι των αντίθετων λέξεων που θα φωτίσει τις πύλες μύησης στο σκοτεινό δωμάτιο.",
};

export default function HelpUiIcon() {
  const dap = loadSound("/sounds/dap.ogg");
  const store = useStore();

  return (
    <button
      onClick={() => {
        if (dap.play) dap.play();
        if (store.scene)
          store.setHint(store.hint ? undefined : helps[store.scene]);
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
