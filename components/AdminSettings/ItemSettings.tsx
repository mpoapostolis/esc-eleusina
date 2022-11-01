import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { mutate } from "swr";
import { Status } from "use-timer/lib/types";
import { AllImage } from ".";
import useMutation from "../../Hooks/useMutation";
import {
  useItems,
  useLibrary,
  updateItem,
  useMiniGames,
} from "../../lib/items";
import { Reward } from "../../pages/game";
import { Img } from "../../pages/admin";
import { Item, statusArr, useStore } from "../../store";
import { getOnlyItems } from "../../utils";
import Popover from "../Popover";
import Select from "../Select";

export default function ItemSettings() {
  const store = useStore();
  const router = useRouter();
  const id = `${router.query.id}`;

  const { data: items } = useItems();
  const { data: imgs } = useLibrary();

  const idx = items.findIndex((e) => e._id === id);
  const { data: miniGames } = useMiniGames();
  const selectedItem = { ...items[idx] };
  const rewards = miniGames.map((e) => e.reward).filter(Boolean) as Reward[];
  const sceneItems = [...items, ...rewards];
  const [_updateItem] = useMutation(updateItem, [
    `/api/items?scene=${store.scene}`,
  ]);

  const [s, $S] = useState<Record<string, string>>({
    name: "",
    clickableWords: "",
    author: "",
    onClickTrigger: "",
    onClickOpenModal: "",
    setHint: "",
    description: "",
    setGuidelines: "",
    ancientText: "",
    inventorySrc: "",
    collectableIfHandHas: "",
    onCollectFail: "",
  });

  useEffect(() => {
    const selectedItem = { ...items[idx] };
    const {
      name,
      author,
      ancientText,
      onClickTrigger,
      onClickOpenModal,
      reward,
      setHint,
      setGuidelines,
      clickableWords,
      inventorySrc,
      collectableIfHandHas,
      onCollectFail,
    } = selectedItem;
    if (idx < 0) return;
    setS({
      name,
      reward,
      ancientText,
      onClickTrigger,
      onClickOpenModal,
      description: reward?.description,
      author,
      setHint,
      clickableWords,
      setGuidelines,
      inventorySrc,
      collectableIfHandHas,
      onCollectFail,
    });
  }, [items, idx]);

  const [miniGame] = miniGames.filter((e) => e.scene === store.scene);

  const setS = (y: Partial<Item>) => $S((s) => ({ ...s, ...y }));

  const idToSrc = (id?: string) =>
    items.find((e) => {
      return e._id === id;
    })?.src;

  const onBlur = (key: string) =>
    _updateItem(id, {
      [key]: s[key],
    });

  return (
    <>
      <label className="block text-left text-xs font-medium mb-2 text-gray-200">
        Name
      </label>
      <input
        value={s.name}
        onBlur={() => onBlur("name")}
        onChange={(evt) => {
          setS({
            name: evt.currentTarget.value,
          });
        }}
        className="text-sm  bg-transparent w-full focus:outline-none h-10 p-2 border border-gray-600"
      ></input>

      <br />

      <Select
        onChange={(v) => {
          _updateItem(id, {
            onClickOpenModal: v.value as
              | "hint"
              | "guidelines"
              | "ancientText"
              | undefined,
          });
        }}
        value={s.onClickOpenModal}
        label="onClick open Guidelines or Hint or AncientText"
        options={[undefined, "guidelines", "ancientText", "hint"].map((o) => ({
          label: o === undefined ? "-" : o,
          value: o === undefined ? null : o,
        }))}
      ></Select>
      {selectedItem.onClickOpenModal === "ancientText" && (
        <>
          <br />
          <label className="block text-left text-xs font-medium mb-2 text-gray-200">
            Author
          </label>
          <input
            value={s.author}
            onBlur={() => onBlur("author")}
            onChange={(evt) => {
              setS({
                author: evt.currentTarget.value,
              });
            }}
            className="text-sm  bg-transparent w-full focus:outline-none h-10 p-2 border border-gray-600"
          ></input>

          <br />
          <label className="block text-left text-xs font-medium mb-2 text-gray-200">
            Ancient text clickable words seperated by comma (,)
          </label>
          <input
            value={s.clickableWords}
            onBlur={() => onBlur("clickableWords")}
            onChange={(evt) => {
              setS({
                clickableWords: evt.currentTarget.value,
              });
            }}
            className="text-sm  bg-transparent w-full focus:outline-none h-10 p-2 border border-gray-600"
          ></input>
        </>
      )}
      <br />
      <label className="block text-left text-xs font-medium mb-2 text-gray-200">
        on click set Ancient text
      </label>
      <div>
        <textarea
          className="bg-transparent w-full focus:outline-none p-2 border border-gray-600"
          rows={5}
          onBlur={() => onBlur("ancientText")}
          value={s.ancientText}
          onChange={(evt) => {
            setS({
              ancientText: evt.currentTarget.value,
            });
          }}
        ></textarea>
        <div className="text-right w-full text-xs text-gray-400">
          nl = new Line
        </div>
      </div>
      <br />

      <label className="block text-left text-xs font-medium mb-2 text-gray-200">
        on click set Hint Text
      </label>
      <div>
        <textarea
          className="bg-transparent  w-full focus:outline-none p-2 border border-gray-600"
          rows={5}
          value={s.setHint}
          onBlur={() => onBlur("setHint")}
          onChange={(evt) => {
            setS({
              setHint: evt.currentTarget.value,
            });
          }}
        ></textarea>
      </div>
      <br />
      <label className="block text-left text-xs font-medium mb-2 text-gray-200">
        on click set Guidance text
      </label>
      <div>
        <textarea
          className="bg-transparent w-full focus:outline-none p-2 border border-gray-600"
          rows={5}
          onBlur={() => onBlur("setGuidelines")}
          value={s.setGuidelines}
          onChange={(evt) => {
            setS({
              setGuidelines: evt.currentTarget.value,
            });
          }}
        ></textarea>
      </div>

      <br />

      <Popover
        label={
          <>
            <label className="block text-left text-xs font-medium mb-2 text-gray-200">
              on click replace to Image
            </label>
            <div className="border p-2 w-full  h-28 text-2xl  border-gray-700 flex items-center justify-center">
              {selectedItem.replaceImg ? (
                <div>
                  <img src={selectedItem.replaceImg} className="w-20 h-auto" />
                </div>
              ) : (
                "➕"
              )}
            </div>
          </>
        }
      >
        <AllImage
          imgs={items}
          onClick={(o) => {
            _updateItem(id, {
              replaceImg: o?.src ?? null,
            });
          }}
        />
      </Popover>

      <br />

      {selectedItem.replaceImg && (
        <>
          <Popover
            label={
              <>
                <label className="block text-left text-xs font-medium mb-2 text-gray-200">
                  Required tool to replace
                </label>
                <div className="border p-2 w-full  h-28 text-2xl  border-gray-700 flex items-center justify-center">
                  {selectedItem.requiredToolToReplace ? (
                    <div>
                      <img
                        src={selectedItem.requiredToolToReplace?.src}
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
              imgs={sceneItems}
              onClick={(o) => {
                _updateItem(id, {
                  requiredToolToReplace: o ?? null,
                });
              }}
            />
          </Popover>

          <Popover
            label={
              <>
                <label className="block text-left text-xs font-medium mt-4 mb-4 text-gray-200">
                  Reward on Replace
                </label>
                <div className="border p-2 w-full  h-28 text-2xl  border-gray-700 flex items-center justify-center">
                  {selectedItem.reward ? (
                    <div>
                      <img
                        src={selectedItem.reward?.src}
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
              imgs={getOnlyItems(items)}
              onClick={async (o) => {
                await axios
                  .post("/api/miniGames", {
                    ...miniGame,
                    scene: store.scene,
                    type: "replace",
                    reward: o,
                  })
                  .then(() => {
                    mutate("/api/miniGames");
                  });

                _updateItem(id, {
                  reward: o,
                });
              }}
            />
          </Popover>
          <br />
          <div>
            <label className="block text-left text-xs font-medium mt-4 mb-2 text-gray-200">
              Reward Msg
            </label>
            <textarea
              className="bg-transparent h-20  w-full text-sm focus:outline-none p-2 border border-gray-600"
              rows={5}
              value={s.description}
              onChange={(evt) => {
                setS({
                  description: evt.currentTarget.value,
                });
              }}
              onBlur={async () => {
                await axios
                  .post("/api/miniGames", {
                    ...miniGame,
                    scene: store.scene,
                    type: "replace",
                    reward: {
                      ...selectedItem.reward,
                      description: s.description,
                    },
                  })
                  .then(() => {
                    mutate("/api/miniGames");
                  });

                _updateItem(id, {
                  reward: {
                    ...selectedItem.reward,
                    description: s.description,
                  },
                });
              }}
            />
          </div>
          <br />
        </>
      )}
      <div className="divider"></div>
      <Select
        onChange={(v) => {
          _updateItem(id, {
            setStatus: v.value as Status,
          });
        }}
        value={selectedItem.setStatus}
        label="onClick setStatus"
        options={[undefined, ...statusArr].map((o) => ({
          label: o === undefined ? "-" : o,
          value: o === undefined ? null : o,
        }))}
      ></Select>

      {selectedItem.collectable && (
        <>
          <Popover
            label={
              <>
                <label className="block text-left text-xs font-medium mb-2 text-gray-200">
                  inventory image
                </label>
                <div className="border p-2 w-full  h-28 text-2xl  border-gray-700 flex items-center justify-center">
                  {selectedItem.inventorySrc ? (
                    <div>
                      <img
                        src={selectedItem.inventorySrc}
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
              imgs={imgs}
              onClick={(o) => {
                _updateItem(id, {
                  inventorySrc: o?.src ?? null,
                });
              }}
            />
          </Popover>
          <br />

          <Popover
            label={
              <>
                <label className="block text-left text-xs font-medium mb-2 text-gray-200">
                  Required tool to colect {selectedItem.name}
                </label>
                <div className="border w-full  h-28 p-4 text-2xl  border-gray-700 flex items-center justify-center">
                  {selectedItem.collectableIfHandHas ? (
                    <img
                      className="w-20 h-auto"
                      src={idToSrc(selectedItem.collectableIfHandHas)}
                    />
                  ) : (
                    "➕"
                  )}
                </div>
              </>
            }
          >
            <AllImage
              imgs={sceneItems}
              onClick={(o) => {
                _updateItem(id, {
                  collectableIfHandHas: o?._id ?? null,
                });
              }}
            />
          </Popover>
          <br />

          <label className="block text-left text-xs font-medium mb-2 text-gray-200">
            Hint text when fail to collect (no required tool selected)
          </label>
          <div>
            <textarea
              value={s.onCollectFail}
              onBlur={() => onBlur("onCollectFail")}
              onChange={(evt) => {
                setS({
                  onCollectFail: evt.currentTarget.value,
                });
              }}
              className="bg-transparent  w-full focus:outline-none p-2 border border-gray-600"
              rows={5}
            ></textarea>
          </div>
        </>
      )}
    </>
  );
}
