import { Item, Scene, useStore } from "../../store";
import clsx from "clsx";
import Hint from "../Hint";
import Link from "next/link";
import { useAchievements, useInventory } from "../../lib/inventory";
import { useMiniGames } from "../../lib/items";
import { useEffect } from "react";
import { useUsed } from "../../lib/used";

export default function Ui(props: { items: Item[]; time: number }) {
  const store = useStore();

  const transform = { transform: "skewX(-20deg)" };
  const { data: inventory } = useInventory();
  const { data: miniGames } = useMiniGames();
  const { data: achievements, isLoading } = useAchievements();
  const { data: usedItems } = useUsed();
  const usedIds = usedItems.map((e) => e.itemId);
  const ach = achievements
    ?.filter((e) => e.scene === store.scene)
    .filter((e) => !usedIds.includes(`${e.rewardId}`));
  const currInv = inventory
    .filter((e) => !e.hideFromInventory)
    .filter((e) => !usedIds.includes(`${e._id}`));

  const tmpInv: Item[] = Array(
    Math.min(Math.abs(9 - ach?.length - currInv?.length), 9)
  ).fill({
    name: "",
    src: "",
  });
  const [currMinigames] = miniGames.filter((e) => e.scene === store.scene);

  const doIHaveAchievement =
    isLoading ||
    achievements.map((e) => e._id).includes(`${currMinigames?.reward?._id}`);

  const invHas = (id?: string) => inventory.map((e) => e._id).includes(id);
  const _achievements = achievements
    .filter((e) => e.scene === store.scene)
    .filter((e) => !usedIds.includes(`${e.rewardId}`));

  const [miniGame] = miniGames.filter((e: any) => e.scene === store.scene);

  const doINeedToUseForGame =
    usedIds.length === miniGame?.requiredItems?.length;

  const miniGameBnt =
    !doIHaveAchievement &&
    (miniGame?.useRequiredItems
      ? doINeedToUseForGame
      : currMinigames?.requiredItems
          ?.map((i) => {
            return invHas(i);
          })
          .every(Boolean));
  const inv = [...currInv, ..._achievements, ...tmpInv];

  useEffect(() => {
    if (miniGameBnt) store.setSound(`04_are_you_ready`);
  }, [miniGameBnt]);

  const openMiniGame = () => {
    switch (miniGame?.type) {
      case "jigsaw":
        store.setJigSaw(
          miniGame.jigSawUrl,
          miniGame.reward,
          miniGame?.jigSawUrl2
        );
        break;

      case "compass":
        store.setCompass(true, miniGame.reward);
        break;

      case "clock":
        store.setStatus("CLOCK");
        break;

      case "lexigram":
        store.setLexigram(miniGame?.lexigram?.split(","), miniGame.reward);
        break;

      default:
        break;
    }
  };

  return (
    <div
      className={clsx(
        "fixed flex flex-col justify-between  pointer-events-none z-50 h-screen w-screen"
      )}
    >
      <div
        style={transform}
        className="stroke text-white relative ml-10 drop-shadow-2xl text-4xl font-bold m-4 w-96"
      >
        <h1
          style={{
            textShadow: "-1px -1px 2px #000, 1px 1px 1px #000",
          }}
          className="z-50 text-white mb-2 font-bold text-4xl text-right"
        >
          time remaining
        </h1>

        <div className="w-96 bg-white border border-black ">
          <div
            className="bg-gray-400 flex items-center justify-end h-8"
            style={{
              textShadow: "-1px -1px 2px #000, 1px 1px 1px #000",
              width: `${Math.min(props.time / 600, 1) * 100}%`,
            }}
          >
            <div className="relative right-4">{props.time}</div>
          </div>
        </div>
        <div className="border-b mt-2 border-black w-full border-dashed"></div>
      </div>

      <div className="absolute flex gap-x-4 top-0 right-0 m-4">
        {achievements
          .filter((e) => e.superDuper)
          .map((e) => (
            <img className="w-10 h-10" src={e.src} />
          ))}
      </div>

      <div
        className={clsx(
          "fixed w-full max-w-xl  right-0  mr-4   pointer-events-auto",
          {
            hidden: store.status !== "RUNNING",
          }
        )}
      >
        <Hint />
      </div>

      {miniGameBnt && (
        <button
          onClick={() => {
            openMiniGame();
          }}
          className={clsx(
            " border-dashed absolute right-4 top-[50%]  p-2 w-fit rounded-lg border border-black bg-black animate-pulse bg-opacity-100  cursor-pointer pointer-events-auto",
            {
              hidden: store.status !== "RUNNING",
            }
          )}
        >
          <span className="text-4xl font-bold ">Παίξε το παιχνίδι</span>
        </button>
      )}
      <div
        className={clsx("flex gap-x-4 p-3 justify-end", {
          hidden: store.status !== "RUNNING",
        })}
      >
        <button
          onClick={() => {
            store.setMute();
          }}
          className=" border-dashed flex items-center justify-center w-20 rounded-lg border border-black bg-white bg-opacity-30  cursor-pointer pointer-events-auto"
        >
          <img
            src={
              store.mute
                ? "https://s2.svgbox.net/octicons.svg?ic=mute-bold"
                : "https://s2.svgbox.net/octicons.svg?ic=unmute-bold"
            }
            className="w-12"
            alt=""
          />
        </button>

        <Link href="/menu">
          <button
            onClick={() => {
              store.setSound(`01_click`);
            }}
            className=" border-dashed rounded-lg border border-black bg-white bg-opacity-30  cursor-pointer pointer-events-auto"
          >
            <img src="/images/menu_icon.svg" className="w-20" alt="" />
          </button>
        </Link>
      </div>

      <div
        className={clsx(
          "absolute -bottom-3 rounded-3xl p-5 md:max-w-md  place-items-center",
          {
            hidden: store.status !== "RUNNING",
          }
        )}
      >
        <div className="relative flex  tracking-wider italic  text-3xl font-bold text-white mb-2 justify-end w-full ">
          <div
            style={transform}
            className="from-transparent absolute -right-2 w-full opacity-90 text-5xl to-gray-500 bg-gradient-to-r h-6  font-normal bottom-0"
          />
          <h1
            style={{
              textShadow: "-1px -1px 2px #000, 1px 1px 1px #000",
            }}
            className="z-50 text-white font-bold text-4xl"
          >
            Η συλλογή μου
          </h1>
        </div>

        <div className="border-2 p-2 rounded-2xl  border-gray-800  border-dashed">
          <div className="grid rounded-xl   pointer-events-auto grid-cols-3">
            {inv.map((item, i) => (
              <div
                key={i}
                onClick={() => {
                  if (item?.selectable || item?.isEpic) store.setHand(item._id);
                  if (item?.action) {
                    item?.action();
                  }

                  if (item.setHint) store.setHint(item.setHint);

                  if (item.setGuidelines)
                    store.setguideLines(item.setGuidelines);

                  if (item.onClickOpenModal === "hint")
                    store.setIsHintVisible(true);
                  if (item.onClickOpenModal === "guidelines")
                    store.setguideLinesVissible(true);

                  if (item.onClickOpenModal === "ancientText") {
                    if (item.ancientText && item.author)
                      store.setAncientText({
                        text: item.ancientText,
                        keys: item.clickableWords?.split(",") ?? [],
                        author: item.author,
                      });
                  }
                }}
                className={clsx(
                  "flex bg-white relative bg-opacity-40 flex-col w-20 h-20 border items-center overflow-hidden justify-center  text-white border-gray-800 p-3 hover:p-0 z-50 ",
                  {
                    "bg-green-900 ": store.hand && store.hand === item?._id,
                    "cursor-pointer":
                      item.isEpic ||
                      item.setHint ||
                      item.setHint ||
                      item.ancientText ||
                      item.setGuidelines ||
                      item.selectable ||
                      item?.action,
                    "rounded-tl-2xl": i === 0,
                    "rounded-tr-2xl": i === 2,
                    "rounded-bl-2xl": i === 6,
                    "rounded-br-2xl": i === 8,
                  }
                )}
              >
                {item && (
                  <div className="relative h-full w-full flex items-center justify-center">
                    <img
                      className="w-full p-1"
                      src={item.inventorySrc ? item?.inventorySrc : item.src}
                      alt=""
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
