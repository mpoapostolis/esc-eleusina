import clsx from "clsx";
import { useEffect, useState } from "react";
import { useStore } from "../../store";
import { motion } from "framer-motion";

import { generateUUID } from "three/src/math/MathUtils";
import { addItem } from "../../lib/inventory";
import useMutation from "../../Hooks/useMutation";

export default function AncientText() {
  const store = useStore();
  const [words, setWords] = useState<string[]>([]);

  useEffect(() => {
    if (store.guideLines) store.setguideLines(undefined);
  }, []);
  const [_addItem] = useMutation(addItem, [
    `/api/inventory?scene=${store.scene}`,
  ]);
  useEffect(() => {
    const set = new Set(words);
    if (store.ancientText?.keys.every((a) => set.has(a))) {
      // store.setEpicItem();
      if (store.ancientText.item && store.ancientText.item.collectable)
        _addItem(store.ancientText.item?._id);
      store.setAncientText(undefined);
      store.setHint(undefined);

      setWords([]);
    }
  }, [words]);

  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{
        translateX: store.status === "ANCIENT_TEXT" ? 0 : 750,
        scale: store.status === "ANCIENT_TEXT" ? 1 : 0,
        opacity: store.status === "ANCIENT_TEXT" ? 1 : 0,
      }}
      transition={{
        duration: 0.35,
      }}
      style={{
        fontFamily: "STIX Two Text",
      }}
      className={clsx(
        "fixed  h-screen w-screen flex  pointer-events-auto  items-center  justify-center z-50"
      )}
    >
      <div>
        <div className="ancientText  w-full bg-[#fffcd2] bg-opacity-50 text-black  p-2  relative border-2 border-dashed rounded-2xl   m-auto  text-3xl font-bold  text-left">
          <div className="px-20  bg-opacity-90  opacity-90 border py-10 rounded-2xl text-center">
            {store.ancientText?.text.split("nl").map((k, idx) => (
              <div key={generateUUID()}>
                {k
                  .split(" ")
                  .filter((e) => e)
                  .map((x) => {
                    const str = x
                      // .replace(/[.,/#  !$%^&*;:{}=-_`~()]/g, "")
                      .replace(/s{2,}/g, " ");
                    console.log(store.ancientText?.keys, str);
                    return store.ancientText?.keys.includes(str) ? (
                      <button
                        className={clsx("mr-2", {
                          "font-bold cursor-pointer hover:text-yellow-200":
                            store.ancientText?.keys.includes(str),
                          "font-bold cursor-pointer text-red-500 hover:text-red-500":
                            words.includes(str),
                        })}
                        key={generateUUID()}
                        onClick={() => {
                          store.ancientText?.keys.includes(str) &&
                            setWords(() => {
                              const set = new Set(words);
                              set.add(str);
                              return Array.from(set);
                            });
                        }}
                      >
                        {x}
                      </button>
                    ) : (
                      <span
                        className={clsx("mr-2", {
                          "text-red-500": str.match("redd"),
                        })}
                        key={generateUUID()}
                      >
                        {x.replace("redd", "")}
                      </span>
                    );
                  })}
              </div>
            ))}
            <img
              onClick={() => {
                store.setAncientText(undefined);
              }}
              src="https://s2.svgbox.net/materialui.svg?ic=close&color=000"
              role="button"
              className=" w-10 m-5 h-10 z-50 pointer-events-auto absolute right-0 top-0"
            />
            <div className="w-full text-zinc-800 mt-10 text-right">
              <span className="text-base">{store.ancientText?.author}</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
