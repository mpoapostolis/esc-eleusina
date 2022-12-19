import { useGesture } from "@use-gesture/react";
import clsx from "clsx";
import { useRouter } from "next/router";
import { useState } from "react";
import useMutation from "../../Hooks/useMutation";
import { useT } from "../../Hooks/useT";
import { addReward } from "../../lib/inventory";
import { useMiniGames } from "../../lib/items";
import { useStore } from "../../store";
import MiniGameWrapper from "../MiniGameWrapper";

export function Clock() {
  const { data: miniGames = [] } = useMiniGames();
  const miniGame = miniGames?.find((e) => e.scene === "arxaiologikos");
  const { locale } = useRouter();
  const clock = (miniGame?.[locale === "en" ? "enClock" : "clock"]?.split(
    ","
  ) ?? []) as string[];

  const words = clock?.map((s) =>
    s
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toUpperCase()
  ) ?? [""];
  const t = useT();
  const maxWord = words?.reduce((a, b) => (a.length > b.length ? a : b), "");
  const emptyArr = Array.from({ length: maxWord.length }, () => " ");
  const allCh = words?.join("").split("");
  const [found, setFound] = useState<string[]>([]);

  const [selected, setSelected] = useState<string[]>([]);
  const store = useStore();
  const [drag, setDrag] = useState(false);

  const uniqCh = Array.from(new Set(allCh));
  const angle = 360 / uniqCh.length;

  const [_addReward] = useMutation(addReward, [
    `/api/inventory?epic=true`,
    `/api/items?scene=${store.scene}`,
  ]);

  const solve = () => {
    if (!miniGame?.reward) return;
    store.setReward(miniGame?.reward);
    _addReward(miniGame?.reward);
  };

  const bind = useGesture({
    onMouseUp: () => {
      setSelected([]);
      setDrag(false);
    },

    onMouseEnter: ({ args }) => {
      if (!drag) return;
      const [l] = args;
      const word = [...selected, l].join("");
      if (words.includes(word)) {
        if (found.length + 1 === words.length) {
          solve();
        }

        store.setSound("13_word_select");
        setFound((f) => [...f, word]);
        setDrag(false);
      }

      setSelected((s) => [...s, l]);
    },
    onMouseDown: (evt) => {
      const [l] = evt.args;
      setDrag(true);
      setSelected((s) => [...s, l]);
    },
  });
  const reset = () => {
    setSelected([]);
    setDrag(false);
  };
  return (
    <MiniGameWrapper status="CLOCK">
      <div onMouseUp={reset} className="grid grid-cols-[1fr_0.3fr] p-10 h-full">
        <div className="flex    flex-col justify-center items-center w-full h-full">
          <div className="relative gap-x-2  flex">
            {emptyArr.map((_, i) => (
              <div
                key={i}
                className="bg-base-300 text-5xl flex items-center justify-center w-20 h-20 font-bold "
              >
                {selected[i] ?? ""}
              </div>
            ))}
          </div>

          <div className="divider"></div>
          <br />
          <div className="relative w-full flex justify-center ">
            {store.scene === "arxaiologikos" && (
              <div className="absolute left-0 top-0 w-40 h-40 rounded-full grid place-items-center">
                <img
                  className="w-full h-full"
                  src="/images/word_clock_1.png"
                  alt=""
                />
              </div>
            )}
            {store.scene === "arxaiologikos" && (
              <div className="absolute right-0 top-0 w-40 h-40 rounded-full grid place-items-center">
                <img
                  className="w-full h-full"
                  src="/images/word_clock_2.png"
                  alt=""
                />
              </div>
            )}{" "}
            {store.scene === "arxaiologikos" && (
              <div className="absolute left-0 bottom-0 w-40 h-40 rounded-full grid place-items-center">
                <img
                  className="w-full h-full"
                  src="/images/word_clock_3.png"
                  alt=""
                />
              </div>
            )}{" "}
            {store.scene === "arxaiologikos" && (
              <div className="absolute right-0 bottom-0 w-40 h-40 rounded-full grid place-items-center">
                <img
                  className="w-full h-full"
                  src="/images/word_clock_4.png"
                  alt=""
                />
              </div>
            )}
            <div
              onMouseLeave={reset}
              className="rounded-full border border-base-100 overflow-hidden   relative w-96 h-96"
            >
              {uniqCh.map((ch, idx) => {
                const sin = Math.sin(idx * angle * 0.01745329252);
                const cos = Math.cos(idx * angle * 0.01745329252);
                const style = {
                  top: `calc(${sin * 50 + 40}% - ${sin * 32}px)`,
                  left: `calc(${cos * 50 + 39.5}% - ${cos * 32}px)`,
                  transform: `rotate(0deg)`,
                };
                return (
                  <button
                    key={idx}
                    {...bind(ch)}
                    style={style}
                    className={clsx(
                      "absolute  bg-opacity-50 rounded-full text-5xl font-bold h-20 z-50 flex  items-center justify-center w-20",
                      {
                        "bg-green-700": selected.includes(ch),
                        "bg-base-200": !selected.includes(ch),
                      }
                    )}
                  >
                    {ch}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
        <div className="h-full  flex">
          <div className="divider-horizontal divider h-full"></div>
          <div className="w-full h-full p-4">
            {store.scene === "pp5_navagio_int" && (
              <p className="text-md font-bold">{t("clock_pp5_title")}</p>
            )}
            <div className="divider"></div>
            <ul className=" mx-auto list-disc">
              {words.map((word, idx) => (
                <li
                  key={idx}
                  className={clsx("whitespace-nowrap list-item font-bold")}
                >
                  <span
                    className={clsx("opacity-0", {
                      "opacity-100": found.includes(word.replace(/ /g, "")),
                    })}
                  >
                    {word}
                  </span>
                </li>
              ))}
            </ul>
            <div className="divider"></div>
            <div className="bg-white  p-4 bg-opacity-10">
              <span className="w-full text-lg text-left break-words">
                {t(
                  store.scene === "arxaiologikos"
                    ? "clock_text"
                    : "clock_pp5_text"
                )
                  .split("nl")
                  .map((e, idx) => (
                    <div key={idx}>{e}</div>
                  ))}
              </span>
              <br />

              <span className=" text-left ">
                {store.scene === "pp5_navagio_int" &&
                  t("clock_pp5_author")
                    .split("nl")
                    .map((e, idx) => <div key={idx}>{e}</div>)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </MiniGameWrapper>
  );
}
