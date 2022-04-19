import axios from "axios";
import clsx from "clsx";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { AllImage } from ".";
import { MiniGame, Reward } from "../../pages";
import { Img } from "../../pages/admin";
import { Item, useStore } from "../../store";
import Load from "../Load";
import Popover from "../Popover";
import Select from "../Select";

const Component = (
  props: MiniGame & {
    update: (p: Record<string, any>) => void;
  }
) => {
  switch (props.type) {
    case "jigsaw":
      return (
        <div className="mt-4">
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

    case "lexigram":
      return (
        <div className="mt-4">
          <label className="block text-left text-xs font-medium mb-2 text-gray-200">
            onClick set Lexigram seperated by comma (,)
          </label>
          <input
            value={props.lexigram}
            onChange={(evt) => {
              props.update({
                lexigram: evt.currentTarget.value,
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

function Row(props: Item & { getItems: () => any; sceneItems: Item[] }) {
  const [hint, setHint] = useState<string>();
  const [time, setTime] = useState<number>();
  const [type, setType] = useState<HintType>("timer");
  const [requiredItems, setRequiredItems] = useState<string[]>([]);
  const [deleteLoad, setDeleteLoad] = useState(false);
  const [load, setLoad] = useState(false);

  useEffect(() => {
    setHint(props.text);
    setTime(props.delayTimeHint);
  }, [props.items]);

  const updateRequired = (id: string) => {
    const found = requiredItems?.includes(id);
    const tmp = found
      ? requiredItems?.filter((e) => e !== id)
      : [...requiredItems, id];
    setRequiredItems(tmp);
  };

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
          className="flex justify-center border border-gray-500 p-2"
          onClick={async () => {
            setDeleteLoad(true);
            await axios.delete(`/api/items/${props._id}`).then(() => {
              props.getItems();
              setDeleteLoad(false);
            });
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
          className="flex justify-center border border-gray-500 p-2"
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
  getItems: () => void;
  update: (p: Partial<Item>) => void;
  items: Item[];
  imgs: Img[];
}) {
  const store = useStore();
  const [load, setLoad] = useState(false);
  const [loadG, setLoadG] = useState(false);
  const router = useRouter();
  const [miniGame, setMiniGame] = useState<MiniGame>({});
  const [guideLines, setGuideLines] = useState<string>();
  const doIHaveGuideLines = props.items.find((e) => e.type === "guidelines");
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

  useEffect(() => {
    const doIHaveGuideLines = props.items.find((e) => e.type === "guidelines");
    if (doIHaveGuideLines) setGuideLines(doIHaveGuideLines.text);
  }, [props.items]);

  const getMiniGames = async () =>
    axios.get("/api/miniGames").then((d) => {
      const [currMinigames] = d.data.filter(
        (e: MiniGame) => e.scene === store.scene
      );
      const { _id, ...rest } = currMinigames;
      setMiniGame(rest);
    });

  useEffect(() => {
    getMiniGames();
  }, []);

  function update(o: MiniGame) {
    setMiniGame((s) => ({ ...s, ...o }));
  }

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
          setLoadG(true);
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
                props.getItems();
                setLoadG(false);
              });
          else
            axios
              .post("/api/items", {
                scene: store.scene,
                type: "guidelines",
                text: guideLines,
              })
              .then(() => {
                props.getItems();
                setLoadG(false);
              });
        }}
        className="flex border py-2 border-gray-500 justify-center"
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
      {props.items
        .filter((e) => e.type === "hint")
        .map((e) => (
          <Row
            sceneItems={props.items?.filter(
              (e) => !["portal", "guidelines"].includes(`${e.type}`)
            )}
            key={e._id}
            getItems={props.getItems}
            {...e}
          />
        ))}
      <button
        onClick={() => {
          setLoad(true);
          axios
            .post("/api/items", {
              scene: store.scene,
              type: "hint",
            })
            .then(() => {
              props.getItems();
              setLoad(false);
            });
        }}
        className="mt-3 flex items-center justify-center w-full px-3 py-2 text-center bg-white bg-opacity-20"
      >
        {load ? <Load /> : `+ Add Hint`}
      </button>
      <hr className="my-5 opacity-20" />

      <Select
        onChange={(v) => {
          update({
            type: v.value as any,
          });
        }}
        value={miniGame.type}
        label="Mini Game"
        options={[
          undefined,
          "compass",
          "jigsaw",
          "lexigram",
          "flowerBox",
          "cerberus",
        ].map((o) => ({
          label: o === undefined ? "-" : o,
          value: o,
        }))}
      />
      <Component {...miniGame} update={update} />
      <br />
      <Popover
        label={
          <>
            <label className="block text-left text-xs font-medium mb-2 text-gray-200">
              Reward
            </label>
            <div className="border p-2 w-full  h-28 text-2xl  border-gray-700 flex items-center justify-center">
              {miniGame.reward ? (
                <div>
                  <img src={miniGame.reward?.src} className="w-20 h-auto" />
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
              reward: o,
            });
          }}
        />
      </Popover>
      <br />

      <label className="block  text-left text-xs font-medium mb-4 text-gray-300">
        Required items in inventory for mini game
      </label>
      <div className="grid gap-2 grid-cols-6">
        {props.items
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
              setMiniGameLoad(false);
            });
        }}
        className="mt-4 flex items-center justify-center w-full px-3 py-2 text-center bg-white bg-opacity-20"
      >
        {miniGameLoad && <Load />}
        Save
      </button>
    </div>
  );
}
