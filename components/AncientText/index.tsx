import clsx from "clsx";
import { useEffect, useState } from "react";
import { useStore } from "../../store";

export const ancientText = {
  text: `
    Φως που σε λάτρεψα, όπως κάθε θνητός nl
    και συ τ’ ουρανού κλέος, nl
    γιατί μ’ αφήσατε; Τί σας έκανε nl
    να τραβηχτείτε από πάνω μου, nl
    για να παραδοθώ στου σκοταδιού την αφή; nl
    `,
  keys: ["Φως", "σκοταδιού"],
};

export default function AncientText() {
  const store = useStore();
  const [words, setWords] = useState<string[]>([]);

  useEffect(() => {
    if (store.guideLines) store.setguideLines(undefined);
  }, []);

  useEffect(() => {
    const set = new Set(words);
    if (store.ancientText?.keys.every((a) => set.has(a))) {
      // store.setEpicItem();
      store.setAncientText(undefined);
      store.setHint(undefined);

      setWords([]);
    }
  }, [words]);

  return (
    <div
      style={{
        fontFamily: "STIX Two Text",
      }}
      className={clsx(
        "fixed  h-screen w-screen flex  pointer-events-auto  items-center  justify-center z-50",
        {
          hidden: !store.ancientText,
        }
      )}
    >
      <div>
        <div className="ancientText  w-full bg-[#fffcd2] bg-opacity-50 text-black  p-2  relative border-2 border-dashed rounded-2xl   m-auto  text-3xl font-bold  text-left">
          <div className="px-20  bg-opacity-90 text-center opacity-90 border py-10 rounded-2xl">
            {store.ancientText?.text.split(" ").map((k, idx) =>
              k === `nl\n` ? (
                <br key={idx} />
              ) : (
                <span
                  onClick={() => {
                    store.ancientText?.keys.includes(k) &&
                      setWords(() => {
                        const set = new Set(words);
                        set.add(k);
                        return Array.from(set);
                      });
                  }}
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
              src="https://s2.svgbox.net/materialui.svg?ic=close&color=000"
              role="button"
              className=" w-10 m-5 h-10 z-50 pointer-events-auto absolute right-0 top-0"
            />
            <div className="w-full text-zinc-800 mt-10 text-right">
              <span className="text-sm">KAPOIOS</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
