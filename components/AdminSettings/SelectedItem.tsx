import axios from "axios";
import clsx from "clsx";
import { useRouter } from "next/router";
import { useState } from "react";
import { AllImage, Checkbox } from ".";
import { Img } from "../../pages/admin";
import { Item, Scene, scenes, useStore } from "../../store";
import Load from "../Load";
import Popover from "../Popover";
import Range from "../Range";
import Select from "../Select";
import BoxSettings from "./BoxSettings";
import CompassSettings from "./CompassSettings";
import ItemSettings from "./ItemSettings";
import JigSawSettings from "./JigSawSettings";
import LexigramSettigns from "./LexigramSettigns";

const Component = (props: {
  getItems: () => void;
  items: Item[];
  imgs: Img[];
  update: (p: Partial<Item>) => void;
}) => {
  const router = useRouter();
  const id = router.query.id;
  const idx = props.items.findIndex((e) => e._id === id);
  const selectedItem = { ...props.items[idx] };

  switch (selectedItem.type) {
    case "box":
      return <BoxSettings {...props} />;
    case "jigsaw":
      return <JigSawSettings {...props} />;

    case "lexigram":
      return <LexigramSettigns {...props} />;

    case "compass":
      return <CompassSettings {...props} />;

    default:
      return <ItemSettings {...props} />;
  }
};

export default function SelectedItem(props: {
  getItems: () => void;
  items: Item[];
  imgs: Img[];
  update: (p: Partial<Item>) => void;
}) {
  const [load, setLoad] = useState(false);
  const router = useRouter();
  const id = router.query.id;
  const idx = props.items.findIndex((e) => e._id === id);
  const selectedItem = { ...props.items[idx] };
  const store = useStore();
  const sceneItems = props.items.filter((item) => store?.scene === item.scene);

  const updateOrderInBox = (id: string) => {
    if (!selectedItem) return;
    const orderInsideTheBox = selectedItem?.orderInsideTheBox ?? [];
    const found = orderInsideTheBox?.includes(id);
    const tmp = found
      ? orderInsideTheBox?.filter((e) => e !== id)
      : [...orderInsideTheBox, id];
    tmp;
    props.update({ orderInsideTheBox: tmp });
  };

  const updateRequired = (id: string) => {
    if (!selectedItem) return;
    const requiredItems = selectedItem?.requiredItems ?? [];
    const found = requiredItems?.includes(id);
    const tmp = found
      ? requiredItems?.filter((e) => e !== id)
      : [...requiredItems, id];
    tmp;
    props.update({ requiredItems: tmp });
  };

  const idToName = (id?: string) =>
    props.items.find((e) => {
      return e._id === id;
    })?.name;

  const idToSrc = (id?: string) =>
    props.items.find((e) => {
      return e._id === id;
    })?.src;

  return (
    <>
      <div className="flex">
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
            width="32"
            height="32"
          />
        </button>
        <button
          className="ml-auto mr-4"
          onClick={() =>
            router.push({
              query: {
                id: undefined,
              },
            })
          }
        >
          <img
            onClick={async () => {
              router.push("/admin");
              await axios
                .delete(`/api/items/${id}`)
                .then(() => props.getItems());
            }}
            src="https://s2.svgbox.net/materialui.svg?ic=delete&color=a88"
            width="32"
            height="32"
          />
        </button>
        <button
          onClick={async () => {
            const { _id, v3, e3, ...rest } = selectedItem;
            setLoad(true);
            await axios.put(
              `/api/items/${selectedItem._id}`,
              JSON.stringify({
                ...rest,
                position: v3,
                rotation: e3,
              }),
              {
                headers: {
                  "Content-Type": "application/json; charset=UTF-8",
                },
              }
            );
            setLoad(false);
          }}
        >
          {load ? (
            <Load />
          ) : (
            <img
              src="https://s2.svgbox.net/materialui.svg?ic=save&color=777"
              width="32"
              height="32"
            />
          )}
        </button>
      </div>

      <hr className="my-5 opacity-20" />
      <div className="flex  items-start my-2 text-xs">
        <div className="flex cursor-pointer w-40 h-20 justify-center flex-col items-center bg-white bg-opacity-5 text-center p-2">
          <img className=" w-12 h-12" src={selectedItem.src} />
          {selectedItem.name}
        </div>

        <div className="w-full px-4">
          <Range
            min={0.05}
            max={1}
            step={0.01}
            onChange={(evt) => {
              const value = +evt.target.value;
              props.update({ scale: value });
            }}
            value={selectedItem.scale}
            label="scale"
          />
          {!selectedItem.type && (
            <>
              <Checkbox
                label="Collect to inventory"
                checked={selectedItem.collectable}
                onChange={(evt) => {
                  props.update({
                    selectable: evt.target.checked
                      ? selectedItem.selectable
                      : false,
                    collectable: evt.target.checked,
                  });
                }}
              />
              <div className="my-1" />
              <Checkbox
                label="Select as tool"
                onChange={(evt) => {
                  props.update({
                    collectable: evt.target.checked
                      ? true
                      : selectedItem.collectable,
                    selectable: evt.target.checked,
                  });
                }}
                checked={selectedItem.selectable}
              />{" "}
              <div className="my-1" />
              <Checkbox
                label="Epic Item"
                onChange={(evt) => {
                  props.update({
                    isEpic: evt.target.checked,
                  });
                }}
                checked={selectedItem.isEpic}
              />
            </>
          )}

          <div className="my-1" />
        </div>
      </div>
      <hr className="my-5 opacity-20" />

      {selectedItem.isEpic ? (
        <>
          <label className="block text-left text-xs font-medium mb-2 text-gray-200">
            Description
          </label>
          <textarea
            className="bg-transparent h-20  w-full text-sm focus:outline-none p-2 border border-gray-600"
            rows={5}
            value={selectedItem.description}
            onChange={(evt) => {
              props.update({
                description: evt.currentTarget.value,
              });
            }}
          ></textarea>
        </>
      ) : (
        <>
          <Select
            onChange={(v) => {
              props.update({
                type: v.value as string,
              });
            }}
            value={selectedItem.type}
            label="type"
            options={[undefined, "box", "compass", "jigsaw", "lexigram"].map(
              (o) => ({
                label: o === undefined ? "-" : o,
                value: o,
              })
            )}
          ></Select>

          <hr className="my-5 opacity-20" />
          <Component {...props} />

          <>
            {/* {selectedItem.type === "portal" && (
                <>
                  <Select
                    onChange={(v) => {
                      props.update({
                        goToScene: v.value as Scene,
                      });
                    }}
                    value={selectedItem.goToScene}
                    label="onClick go to scene (360)"
                    options={[undefined, ...scenes].map((o) => ({
                      label: o === undefined ? "-" : o,
                      value: o,
                    }))}
                  ></Select>
                  <br />
                </>
              )} */}
          </>

          <hr className="my-5 opacity-20" />

          <label className="block  text-left text-xs font-medium mb-4 text-gray-300">
            Required items in inventory to show {selectedItem.name}
          </label>
          <div className="grid gap-6 grid-cols-4">
            {props.items.map((i) => {
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
                      "bg-green-500": selectedItem.requiredItems?.includes(
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
        </>
      )}
    </>
  );
}
