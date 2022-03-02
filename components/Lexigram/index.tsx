import clsx from "clsx";
import { useEffect, useRef, useState } from "react";
import useKeyPress from "../../Hooks/useKeyPress";
import { useStore } from "../../store";
import Keyboard from "../Keyboard";

const greekVowel: Record<string, string> = {
  ά: "α",
  έ: "ε",
  ή: "η",
  ί: "ι",
  ό: "ο",
  ύ: "υ",
  ώ: "ω",
};

const keys = [
  "q",
  "w",
  "e",
  "r",
  "t",
  "y",
  "u",
  "i",
  "o",
  "p",
  "a",
  "s",
  "d",
  "f",
  "g",
  "h",
  "j",
  "k",
  "l",
  "z",
  "x",
  "c",
  "v",
  "b",
  "n",
  "m",
];

function Lexigram() {
  const store = useStore();
  const arr = store.lexigram ?? [""];
  const max = Math.max(...arr?.map((e) => e.length));
  console.log(max);
  const letters = new Set<string>();
  const [wordd, setWord] = useState<string[]>([]);
  const tmpWord = Array(max - Math.min(wordd.length, max)).fill("");
  const word = [...wordd, ...tmpWord];

  store.lexigram
    ?.map((e) => e.split(""))
    .flat(1)

    .forEach((e) => {
      const char = greekVowel[e] ?? e;
      letters.add(char.toUpperCase());
    });

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
          {store.lexigram
            ?.sort((a, b) => a.length - b.length)
            .map((word) => (
              <div key={word} className="flex mb-1">
                {word.split("").map((e, idx) => {
                  const char = greekVowel[e] ?? e;
                  const isCorrect =
                    wordd[idx]?.toLocaleLowerCase() ===
                    char?.toLocaleLowerCase();
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
                      {isCorrect && char.toUpperCase()}
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
            if (e === "Enter") return;
            if (wordd.length === max && e !== "Backspace") return;
            setWord((s) => {
              const tmp = [...s];
              if (e === "Backspace") {
                tmp.pop();
                return tmp;
              } else return [...s, e];
            });
          }}
        />
      </div>
    </div>
  );
}

export default Lexigram;
