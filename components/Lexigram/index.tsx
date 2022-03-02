import clsx from "clsx";
import { useState } from "react";
import { useStore } from "../../store";
import Keyboard from "../Keyboard";

function Lexigram() {
  const store = useStore();

  const normalizeLexi = store.lexigram?.map((s) =>
    s
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toUpperCase()
  ) ?? [""];

  const arr = normalizeLexi ?? [""];
  const max = Math.max(...arr?.map((e) => e.length));
  const [wordd, setWord] = useState<string[]>([]);
  const tmpWord = Array(max - Math.min(wordd.length, max)).fill("");
  const word = [...wordd, ...tmpWord];
  const [correct, setCorrect] = useState<Record<string, boolean>>({});
  return (
    <div
      onClick={() => {}}
      className={clsx(
        "fixed bg-black select-none bg-opacity-80  h-screen w-screen flex  pointer-events-auto  items-center  justify-center z-50",
        {
          hidden: store.status !== "MODAL" || !store.lexigram,
        }
      )}
    >
      <div className="p-10 shadow-inner shadow-gray-500  border border-gray-500  rounded-md max-w-4xl w-full h-fit">
        <div className="grid grid-cols-2">
          {normalizeLexi
            ?.sort((a, b) => a.length - b.length)
            .map((word) => (
              <div key={word} className="flex mb-1">
                {word.split("").map((e, idx) => {
                  const isCorrect = correct[word] || wordd[idx] === e;
                  return (
                    <div
                      key={idx}
                      className={clsx(
                        "border border-gray-700 shadow-inner shadow-gray-500 bg-black w-8  h-8 font-bold text-xs rounded-sm mr-1 text-white flex items-center justify-center text-center ",
                        {
                          "bg-gray-800  bg-opacity-80": isCorrect,
                        }
                      )}
                    >
                      {isCorrect && e}
                    </div>
                  );
                })}
              </div>
            ))}
        </div>
        <div
          style={{
            gridTemplateColumns: `repeat(${max},1fr)`,
          }}
          className={clsx(
            "grid mt-10 border-gray-700 shadow-inner shadow-gray-500 border-b p-3 gap-x-3 rounded-xl w-full"
          )}
        >
          {word.map((char, idx) => (
            <div
              key={idx}
              className="border p-3 border-gray-800 shadow-inner shadow-gray-500 bg-black rounded-xl h-14 font-bold text-lg text-white text-center  flex justify-center items-center"
            >
              {char.toUpperCase()}
            </div>
          ))}
        </div>

        <br />
        <br />

        <Keyboard
          onKeyPress={(e) => {
            if (!wordd) return;
            if (e === "Enter") {
              const word = wordd.join("");
              if (normalizeLexi?.includes(word)) {
                setWord([]);
                setCorrect((s) => ({ ...s, [word]: true }));
              }
              return;
            }
            if (wordd.length === max && e !== "Backspace") return;
            setWord((s) => {
              const tmp = [...s];
              if (e === "Backspace") {
                tmp.pop();
                return tmp;
              } else return [...s, e.toUpperCase()];
            });
          }}
        />
      </div>
    </div>
  );
}

export default Lexigram;
