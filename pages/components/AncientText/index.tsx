import clsx from "clsx";
import { useEffect, useState } from "react";
import { useStore } from "../../../store";

export const ancientText = {
  intro1: {
    text: `
    Φως που σε λάτρεψα, όπως κάθε θνητός nl
    και συ τ’ ουρανού κλέος, nl
    γιατί μ’ αφήσατε; Τί σας έκανε nl
    να τραβηχτείτε από πάνω μου, nl
    για να παραδοθώ στου σκοταδιού την αφή; nl
    `,
    keys: ["Φως", "σκοταδιού"],
  },
};

export default function AncientText() {
  const store = useStore();
  const [words, setWords] = useState<string[]>([]);

  useEffect(() => {
    console.log(words.join(""), store.ancientText?.keys.join(""));
    if (words.sort().join("") === store.ancientText?.keys.sort().join("")) {
      store.setAncientText(undefined);
      store.setInventory({
        name: "stone",
        src: "/images/stone.png",
        description: ``,
      });
      setWords([]);
      store.setHint("Διάλεξε τη σφαίρα που θα σε οδηγήσει στο δωμάτιο.");
    }
  }, [words]);

  return (
    <div
      className={clsx(
        "fixed   bg-black bg-opacity-90 h-screen w-screen flex  pointer-events-auto  items-center  justify-center z-50",
        {
          hidden: !store.ancientText,
        }
      )}
    >
      <div>
        <div
          className={clsx(
            "w-full border-opacity-20 border border-red-50  m-auto px-20 py-10 text-4xl font-semibold bg-opacity-70 text-white text-left"
          )}
        >
          {store.ancientText?.text.split(" ").map((k, idx) =>
            k === `nl\n` ? (
              <br key={idx} />
            ) : (
              <span
                onClick={() => setWords((s) => [...s, k])}
                key={idx}
                className={clsx({
                  "font-bold cursor-pointer hover:text-yellow-200":
                    store.ancientText?.keys.includes(k),
                  "font-bold cursor-pointer text-red-500 hover:text-red-500":
                    words.includes(k),
                })}
              >
                {`${k} `}
              </span>
            )
          )}
        </div>
        <img
          onClick={() => {
            store.setAncientText(undefined);
          }}
          src="https://s2.svgbox.net/materialui.svg?ic=close&color=ddd"
          role="button"
          className=" w-20 h-20 z-50 fixed right-5 top-5"
          alt=""
        />
      </div>
    </div>
  );
}
