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
        "fixed bg-black bg-opacity-70  h-screen w-screen flex  pointer-events-auto  items-center  justify-center z-50",
        {
          hidden: !store.ancientText,
        }
      )}
    >
      <div>
        <div className="w-full p-2  relative border-2 border-dashed rounded-2xl   m-auto  text-4xl font-bold  text-white text-left">
          <div className="px-20 bg-black bg-opacity-90 opacity-90 border py-10 rounded-2xl">
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
            <img
              onClick={() => {
                store.setAncientText(undefined);
              }}
              src="https://s2.svgbox.net/materialui.svg?ic=close&color=fff"
              role="button"
              className=" w-10 m-5 h-10 z-50 pointer-events-auto absolute right-0 top-0"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
