import clsx from "clsx";
import { useEffect, useMemo, useState } from "react";
import { useStore } from "../../store";
import { loadSound } from "../../utils";
import Keyboard from "../Keyboard";

function Lexigram() {
  // const [lexigram, setLexigram] = useState<string[]>([]);
  const [count, setCount] = useState(0);
  const [found, setFound] = useState<Record<string, boolean>>({});
  const store = useStore();
  const lexigram = store.lexigram;
  const normalizeLexi = lexigram?.map((s) =>
    s
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toUpperCase()
  ) ?? [""];
  const groups = new Set<number>();
  normalizeLexi.map((e) => groups.add(e.length));

  const arr = normalizeLexi ?? [""];
  const max = Math.max(...arr?.map((e) => e.length));
  const [wordd, setWord] = useState<string[]>([]);
  const [correct, setCorrect] = useState<Record<string, boolean>>({});
  const [history, setHistory] = useState<
    {
      correct: boolean;
      word: string;
    }[]
  >([]);

  const howManyLetter = useMemo(
    () =>
      lexigram
        ?.map((e) => e.length)
        .reduce((acc, curr) => {
          // @ts-ignore
          return { ...acc, [curr]: !isNaN(acc[curr]) ? acc[curr] + 1 : 1 };
        }, {}) ?? {},
    [lexigram]
  );

  const foundTotalLetter = useMemo(
    () =>
      Object.keys(found)
        .map((e) => e.length)
        .reduce((acc, curr) => {
          // @ts-ignore
          return { ...acc, [curr]: !isNaN(acc[curr]) ? acc[curr] + 1 : 1 };
        }, {}),
    [found]
  );

  useEffect(() => {
    const total = Object.values<number>(foundTotalLetter).reduce(
      (acc, curr) => acc + curr,
      0
    );
    if (store.lexigram?.length === total && store.reward) {
      store.setReward(store.reward);
    }
  }, [foundTotalLetter]);

  return (
    <div
      className={clsx(
        "fixed bg-black select-none bg-opacity-90  h-screen w-screen flex  pointer-events-auto  items-center  justify-center z-50",
        {
          hidden: store.status !== "LEXIGRAM",
        }
      )}
    >
      <img
        onClick={() => {
          store.setStatus("RUNNING");
        }}
        src="https://s2.svgbox.net/materialui.svg?ic=close&color=fff"
        role="button"
        className=" w-10 m-5 h-10 z-50 pointer-events-auto absolute right-0 top-0"
      />
      <div className="md:p-10  rounded-lg p-4 bg-black max-w-2xl w-full shadow-inner  border border-gray-900 flex flex-col h-screen">
        <div className="grid mt-10 grid-cols-2 gap-4 text-gray-400">
          {Array.from(groups)
            .sort((a, b) => a - b)
            .map((c, idx) => (
              <div key={idx} className="flex flex-col">
                <label
                  className={clsx("text-xs font-bold mb-2", {
                    // @ts-ignore
                    "opacity-20": howManyLetter[c] === foundTotalLetter[c],
                  })}
                >
                  {c} γράμματα
                </label>
                <div>
                  {normalizeLexi
                    .filter((e) => e.length === c)

                    .map((word) => (
                      <div
                        key={word}
                        className={clsx("flex mb-1", {
                          "opacity-30": found[word],
                        })}
                      >
                        {word.split("").map((e, idx) => {
                          let isCorrect1 = false;
                          history.map((h) => {
                            const arr = h.word.split("");
                            if (arr[idx] === e) isCorrect1 = true;
                          });
                          const isCorrect = correct[word] || isCorrect1;
                          return (
                            <div
                              key={idx}
                              className={clsx(
                                "shadow text-gray-100 shadow-gray-500 bg-black bg-opacity-5  w-6  h-6 font-bold text-xs rounded-sm mr-1 flex items-center justify-center text-center ",
                                {
                                  "bg-green-400  bg-opacity-70": isCorrect,
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
              </div>
            ))}
        </div>
        <br />
        <div className=" mb-2 ">
          <div>
            <label className="text-sm text-gray-500 font-semibold mb-2">
              Ιστορίκο
            </label>
            <h5 className="text-gray-500  text-xs mt-1">
              💻 Απομένουν {count} προσπάθειες
            </h5>
          </div>
          <hr className="mt-2 border-black opacity-5" />

          <div className="mb-5 mt-2 opacity-50" />
          <ul className=" max-h-24 md:max-h-52 overflow-auto">
            {history.map((m, idx) => (
              <li
                className="mb-2 flex  text-gray-200 font-black text-xs"
                key={idx}
              >
                <span>{m.word}</span>
                <span className="ml-auto">{m.correct ? "✅" : "❌"}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="mt-auto" />
        <div
          className={clsx(
            "flex md:h-16 h-12 items-center mt-10 justify-center shadow-inner border-b border-gray-600 p-3 gap-x-3 rounded-xl w-full"
          )}
        >
          <div className="md:h-12 h-8" />
          {wordd.map((char, idx) => (
            <div
              key={idx}
              className={`
              md:h-12 md:w-12 md:p-3 w-8 h-8 border-gray-700 shadow-inner shadow-gray-500 bg-black 
              rounded-xl text-center uppercase font-black text-white
              `}
            >
              {char.toUpperCase()}
            </div>
          ))}
        </div>
        <br />{" "}
        <Keyboard
          onKeyPress={(e) => {
            if (e === "Enter") {
              if (wordd.length === 0) return;
              const word = wordd.join("");
              const correct = normalizeLexi?.includes(word);
              setHistory((h) => [{ correct, word }, ...h]);
              setWord([]);
              if (correct && wordd.length > 0) {
                setFound((s) => ({ ...s, [word]: true }));
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
            if (!["Backspace", "Enter"].includes(e)) {
              setCount((s) => s + 1);
            }
          }}
        />
      </div>
    </div>
  );
}

export default Lexigram;
