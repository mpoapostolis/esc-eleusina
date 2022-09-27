import axios from "axios";
import clsx from "clsx";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { mutate } from "swr";
import { AllImage } from ".";
import useMutation from "../../Hooks/useMutation";
import {
  addItem,
  deleteItem,
  useItems,
  Item,
  useMiniGames,
} from "../../lib/items";
import { MiniGame, Reward } from "../../pages";
import { Img } from "../../pages/admin";
import { useStore } from "../../store";
import Load from "../Load";
import Popover from "../Popover";
import Select from "../Select";

const Component = (
  props: MiniGame & {
    update: (p: Record<string, any>) => void;
  }
) => {
  switch (props.type) {
    case "arxaiologikos":
      return (
        <>
          <div key={props.type} className="mt-4">
            <label className="block text-left text-xs font-medium mb-2 text-gray-200">
              jigsaw image url
            </label>
            <input
              value={props.jigSawUrl}
              onChange={(evt) => {
                props.update({
                  jigSawUrl: evt.currentTarget.value,
                });
              }}
              className=" text-sm  bg-transparent w-full focus:outline-none h-10 p-2 border border-gray-600"
            ></input>
          </div>
          <div key={props.type} className="mt-4">
            <label className="block text-left text-xs font-medium mb-2 text-gray-200">
              onClick set clock seperated by comma (,)
            </label>
            <input
              value={props.clock}
              onChange={(evt) => {
                props.update({
                  clock: evt.currentTarget.value,
                });
              }}
              className=" text-sm  bg-transparent w-full focus:outline-none h-10 p-2 border border-gray-600"
            ></input>
          </div>
        </>
      );

    case "jigsaw":
      return (
        <div key={props.type} className="mt-4">
          <label className="block text-left text-xs font-medium mb-2 text-gray-200">
            jigsaw image url
          </label>
          <input
            value={props.jigSawUrl}
            onChange={(evt) => {
              props.update({
                jigSawUrl: evt.currentTarget.value,
              });
            }}
            className=" text-sm  bg-transparent w-full focus:outline-none h-10 p-2 border border-gray-600"
          ></input>
        </div>
      );

    case "clock":
      return (
        <div key={props.type} className="mt-4">
          <label className="block text-left text-xs font-medium mb-2 text-gray-200">
            onClick set clock seperated by comma (,)
          </label>
          <input
            onChange={(evt) => {
              props.update({
                clock: evt.currentTarget.value,
              });
            }}
            className=" text-sm  bg-transparent w-full focus:outline-none h-10 p-2 border border-gray-600"
          ></input>
        </div>
      );

    default:
      return null;
  }
};

export type HintType = "conditional" | "timer";

function Row(props: Item & { sceneItems: Item[] }) {
  const [hint, setHint] = useState<string>();
  const [time, setTime] = useState<number>();
  const [type, setType] = useState<HintType>("timer");
  const [requiredItems, setRequiredItems] = useState<string[]>([]);
  const [deleteLoad, setDeleteLoad] = useState(false);
  const [load, setLoad] = useState(false);
  const { data: items } = useItems();
  useEffect(() => {
    setHint(props.text);
    setTime(props.delayTimeHint);
  }, [items]);

  const updateRequired = (id: string) => {
    const found = requiredItems?.includes(id);
    const tmp = found
      ? requiredItems?.filter((e) => e !== id)
      : [...requiredItems, id];
    setRequiredItems(tmp);
  };
  const store = useStore();
  const [_deleteItem] = useMutation(deleteItem, [
    `/api/items?scene=${store.scene}`,
  ]);

  return (
    <div className="p-4 my-1  border border-gray-500 bg-gray-500 bg-opacity-5">
      <div className="grid gap-x-4 grid-cols-2 mb-4">
        <Select
          value={type}
          onChange={(e) => {
            if (type === "conditional") setTime(undefined);
            if (type === "timer") setRequiredItems([]);
            setType(e.value as HintType);
          }}
          label="Hint Type"
          options={["timer", "conditional"].map((x) => ({
            label: `${x}`,
            value: x,
          }))}
        />

        {type === "timer" && (
          <Select
            value={`${time}`}
            onChange={(e) => setTime(+`${e.value}`)}
            label="Delay seconds"
            options={[5, 10, 15, 20, 25, 30, 60, 120, 240].map((x) => ({
              label: `${x}`,
              value: x,
            }))}
          />
        )}
      </div>
      <textarea
        rows={3}
        placeholder="hint"
        value={hint}
        onChange={(e) => setHint(e.currentTarget.value)}
        className="bg-transparent w-full mb-1 text-sm focus:outline-none p-2 border border-gray-500"
      />

      {type === "conditional" && (
        <>
          <label className="block  text-left text-xs font-medium mb-4 text-gray-300">
            Required items to display hint
          </label>
          <div className="grid gap-2 grid-cols-6">
            {props.sceneItems
              ?.filter(
                (e) => !["hint", "portal", "guidelines"].includes(`${e.type}`)
              )
              .map((i) => {
                const item = i as Item;
                return (
                  <div
                    key={i._id}
                    onClick={() => {
                      updateRequired(`${i._id}`);
                    }}
                    className={clsx(
                      "relative  bg-opacity-20 cursor-pointer border border-gray-700 w-full",
                      {
                        "bg-green-500": requiredItems?.includes(`${i._id}`),
                      }
                    )}
                  >
                    <img
                      className="hover:scale-150 w-full p-2"
                      src={item.src}
                      alt=""
                    />
                  </div>
                );
              })}
          </div>
        </>
      )}
      <div className="grid mt-4 grid-cols-2 gap-x-1">
        <button
          className="btn"
          onClick={async () => {
            _deleteItem(props._id);
          }}
        >
          {deleteLoad ? (
            <Load />
          ) : (
            <img
              src="https://s2.svgbox.net/materialui.svg?ic=delete&color=a88"
              width="26"
              height="26"
            />
          )}
        </button>
        <button
          onClick={async () => {
            setLoad(true);
            await axios
              .put(
                `/api/items/${props._id}`,
                JSON.stringify({
                  hintType: type,
                  text: hint,
                  delayTimeHint: time,
                  requiredItems,
                }),
                {
                  headers: {
                    "Content-Type": "application/json; charset=UTF-8",
                  },
                }
              )
              .then(() => setLoad(false));
          }}
          className="btn"
        >
          {load ? (
            <Load />
          ) : (
            <img
              src="https://s2.svgbox.net/materialui.svg?ic=save&color=777"
              width="26"
              height="26"
            />
          )}
        </button>
      </div>
    </div>
  );
}

export default function SceneSettings(props: {
  update: (p: Partial<Item>) => void;
  imgs: Img[];
}) {
  const store = useStore();
  const [load, setLoad] = useState(false);
  const [loadG, setLoadG] = useState(false);
  const router = useRouter();
  const [miniGame, setMiniGame] = useState<MiniGame>({});
  const [guideLines, setGuideLines] = useState<string>();
  const { data: items } = useItems();
  const doIHaveGuideLines = items.find((e) => e.type === "guidelines");
  const [miniGameLoad, setMiniGameLoad] = useState(false);

  const updateRequired = (id: string) => {
    if (!miniGame) return;
    const requiredItems = miniGame?.requiredItems ?? [];
    const found = requiredItems?.includes(id);
    const tmp = found
      ? requiredItems?.filter((e) => e !== id)
      : [...requiredItems, id];
    update({ requiredItems: tmp });
  };
  const [_addItem] = useMutation(addItem, [`/api/items?scene=${store.scene}`]);

  const currBox = items.find((e) => e.type === "box");

  useEffect(() => {
    const doIHaveGuideLines = items.find((e) => e.type === "guidelines");
    if (doIHaveGuideLines) setGuideLines(doIHaveGuideLines.text);
  }, [items]);

  const { data: miniGames } = useMiniGames();
  useEffect(() => {
    const [currMinigames] = miniGames.filter(
      (e: MiniGame) => e.scene === store.scene
    );
    const { _id, ...rest } = currMinigames ?? {};
    setMiniGame(rest);
  }, [miniGames]);

  function update(o: MiniGame) {
    setMiniGame((s) => ({ ...s, ...o }));
  }
  const replacedReward = items.find((e) => e.reward)?.reward;

  return (
    <div className="flex flex-col h-screen">
      <div className="flex h-8  text-xl text-gray-400 w-full  font-bold">
        <button
          onClick={() =>
            router.push({
              query: {
                id: undefined,
              },
            })
          }
        >
          <img
            src="https://s2.svgbox.net/materialui.svg?ic=arrow_back&color=888"
            width="24"
            height="24"
          />
        </button>
        <h1 className="ml-3">Scene Settings</h1>
      </div>
      <hr className="my-5 opacity-20" />
      <div className="">
        <label className="block text-left text-xs font-medium mb-2 text-gray-200">
          Guidelines
        </label>
        <textarea
          value={guideLines}
          onChange={(evt) => setGuideLines(evt.currentTarget.value)}
          className="bg-transparent mb-4  w-full text-sm focus:outline-none p-2 border border-gray-600"
          rows={5}
        />
      </div>
      <button
        onClick={async () => {
          if (doIHaveGuideLines)
            await axios
              .put(
                `/api/items/${doIHaveGuideLines._id}`,
                JSON.stringify({ text: guideLines }),
                {
                  headers: {
                    "Content-Type": "application/json; charset=UTF-8",
                  },
                }
              )
              .then(() => {
                mutate(`/api/items?scenes=${store.scene}`);
              });
          else
            _addItem({
              scene: store.scene,
              type: "guidelines",
              text: guideLines,
            });
        }}
        className="btn"
      >
        {loadG ? (
          <Load />
        ) : (
          <img
            src="https://s2.svgbox.net/materialui.svg?ic=save&color=777"
            width="26"
            height="26"
          />
        )}
      </button>
      <hr className="my-5 opacity-20" />
      {items
        .filter((e) => e.type === "hint")
        .map((e) => (
          <Row
            sceneItems={items?.filter(
              (e) => !["portal", "guidelines"].includes(`${e.type}`)
            )}
            key={e._id}
            {...e}
          />
        ))}
      <button
        onClick={() => {
          _addItem({
            scene: store.scene,
            type: "hint",
            delayTimeHint: 10,
          });
        }}
        className="btn mt-4 "
      >
        {load ? <Load /> : `+ Add Hint`}
      </button>
      <hr className="my-5 opacity-20" />

      <Select
        onChange={(v) => {
          axios
            .post("/api/miniGames", {
              scene: store.scene,
              ...miniGame,
              type: v.value,
            })
            .then(() => {
              mutate("/api/miniGames");
              setMiniGameLoad(false);
            });

          setMiniGame({
            type: v.value as any,
          });
        }}
        value={currBox ? "box" : miniGame.type}
        label="Mini Game"
        options={[
          undefined,
          "collect",
          "arxaiologikos",
          "jigsaw",
          "clock",
          "compass",
          "box",
          "replace",
        ].map((o) => ({
          label: o === undefined ? "-" : o,
          value: o,
        }))}
      />
      <Component {...miniGame} update={update} />
      <br />
      <Popover
        disabled={["box", "replace"].includes(miniGame.type ?? "")}
        label={
          <>
            <label className="block text-left text-xs font-medium mb-2 text-gray-200">
              Reward{" "}
              {miniGame.type === "box"
                ? `(change reward from the box item)`
                : ""}
              {miniGame.type === "replace"
                ? `(change reward from the replace item)`
                : ""}
            </label>
            <div
              className={clsx(
                "border  p-2 w-full  h-28 text-2xl  border-gray-700 flex items-center justify-center",
                {
                  "cursor-not-allowed": ["box", "replace"].includes(
                    miniGame.type ?? ""
                  ),
                }
              )}
            >
              {miniGame.reward || currBox?.reward ? (
                <div>
                  <img
                    src={
                      miniGame.reward?.src ||
                      replacedReward?.src ||
                      currBox?.reward?.src
                    }
                    className="w-20 h-auto"
                  />
                </div>
              ) : (
                "➕"
              )}
            </div>
          </>
        }
      >
        <AllImage
          imgs={props.imgs}
          onClick={async (o) => {
            update({
              reward: o as Img | null,
            });
          }}
        />
      </Popover>
      <div
        className={clsx({
          "cursor-not-allowed pointer-events-none": ["box", "replace"].includes(
            miniGame.type ?? ""
          ),
        })}
      >
        <label className="block text-left text-xs font-medium mt-4 mb-2 text-gray-200">
          Reward Msg
        </label>
        <textarea
          className="bg-transparent h-20  w-full text-sm focus:outline-none p-2 border border-gray-600"
          rows={5}
          disabled={["box", "replace"].includes(miniGame.type ?? "")}
          value={miniGame.reward?.description}
          onChange={(evt) => {
            const r = miniGame.reward;
            if (r)
              update({
                reward: {
                  ...r,
                  description: evt.currentTarget.value,
                },
              });
          }}
        />
      </div>
      <br />

      <label className="block  text-left text-xs font-medium mb-4 text-gray-300">
        Required items in inventory for mini game
      </label>
      <div className="grid gap-2 grid-cols-6">
        {items
          ?.filter(
            (e) => !["hint", "portal", "guidelines"].includes(`${e.type}`)
          )
          .map((i) => {
            const item = i as Item;
            return (
              <div
                key={i._id}
                onClick={() => {
                  updateRequired(`${i._id}`);
                }}
                className={clsx(
                  "relative  bg-opacity-20 cursor-pointer border border-gray-700 w-full",
                  {
                    "bg-green-500": miniGame.requiredItems?.includes(
                      `${i._id}`
                    ),
                  }
                )}
              >
                <img
                  className="hover:scale-150 w-full p-2"
                  src={item.src}
                  alt=""
                />
              </div>
            );
          })}
      </div>
      <button
        onClick={() => {
          setMiniGameLoad(true);
          axios
            .post("/api/miniGames", {
              scene: store.scene,
              ...miniGame,
            })
            .then(() => {
              mutate("/api/miniGames");
              setMiniGameLoad(false);
            });
        }}
        className="btn mt-4"
      >
        {miniGameLoad && <Load />}
        Save
      </button>
    </div>
  );
}
