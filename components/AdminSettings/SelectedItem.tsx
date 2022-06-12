import { update } from "@react-spring/three";
import axios from "axios";
import clsx from "clsx";
import { useRouter } from "next/router";
import { useState } from "react";
import { Euler } from "three";
import { Checkbox } from ".";
import { Img } from "../../pages/admin";
import { updateItem } from "../../queries/items";
import { Item } from "../../store";
import Range from "../Range";
import Select from "../Select";
import BoxSettings from "./BoxSettings";
import ItemSettings from "./ItemSettings";
import PortalSettings from "./PortalSettings";

const Component = (props: {
  items: Item[];
  imgs: Img[];
  update: (p: Partial<Item>) => void;
}) => {
  const router = useRouter();
  const id = router.query.id;
  const idx = props.items.findIndex((e) => e._id === id);
  const selectedItem = { ...props.items[idx] };
  const _items = props.items?.filter(
    (e) => !["hint", "portal", "guidelines"].includes(`${e.type}`)
  );

  const p = { ...props, items: _items };

  switch (selectedItem.type) {
    case "portal":
      return <PortalSettings {...props} />;
    case "box":
      return <BoxSettings imgs={props.imgs} />;

    default:
      return <ItemSettings {...p} />;
  }
};

export default function SelectedItem(props: {
  items: Item[];
  imgs: Img[];
  update: (p: Partial<Item>) => void;
}) {
  const [range, setRange] = useState(0.5);
  const [x, setX] = useState(180);
  const [y, setY] = useState(180);
  const [z, setZ] = useState(180);
  const router = useRouter();
  const id = `${router.query.id}`;
  const idx = props.items.findIndex((e) => e._id === id);
  const selectedItem = { ...props.items[idx] };

  const updateRequired = (_id: string) => {
    if (!selectedItem) return;
    const requiredItems = selectedItem?.requiredItems ?? [];
    const found = requiredItems?.includes(_id);
    const tmp = found
      ? requiredItems?.filter((e) => e !== _id)
      : [...requiredItems, _id];
    updateItem(id, { requiredItems: tmp });
  };

  const rotate = (axis: "x" | "y" | "z", rot: number) => {
    if (!selectedItem.rotation) return;
    const r = new Euler().copy(selectedItem.rotation);
    r[axis] = rot;
    updateItem(id, { rotation: r });
  };

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
          className="ml-auto"
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
              await axios.delete(`/api/items/${id}`);
            }}
            src="https://s2.svgbox.net/materialui.svg?ic=delete&color=a88"
            width="32"
            height="32"
          />
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
              setRange(value);
            }}
            onPointerUp={() => {
              updateItem(id, { scale: range });
            }}
            value={range}
            label="scale"
          />

          <Range
            min={0}
            max={360}
            step={1}
            onChange={(evt) => {
              const value = +evt.target.value;
              setX(value);
            }}
            onPointerUp={() => {
              rotate("x", x);
            }}
            value={x}
            label="Rotate X"
          />

          <Range
            min={0}
            max={360}
            step={1}
            onChange={(evt) => {
              const value = +evt.target.value;
              setY(value);
            }}
            onPointerUp={() => {
              rotate("y", y);
            }}
            value={y}
            label="Rotate Y"
          />

          <Range
            min={0}
            max={360}
            step={1}
            onPointerUp={() => {
              rotate("z", z);
            }}
            onChange={(evt) => {
              const value = +evt.target.value;
              setZ(value);
            }}
            value={z}
            label="Rotate Z"
          />
          {!selectedItem.type && (
            <>
              <Checkbox
                label="Collect to inventory"
                checked={selectedItem.collectable}
                onChange={(evt) => {
                  updateItem(id, {
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
                  updateItem(id, {
                    collectable: evt.target.checked
                      ? true
                      : selectedItem.collectable,
                    selectable: evt.target.checked,
                  });
                }}
                checked={selectedItem.selectable}
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
              updateItem(id, {
                description: evt.currentTarget.value,
              });
            }}
          ></textarea>
        </>
      ) : (
        <>
          {
            <Select
              onChange={(v) => {
                updateItem(id, {
                  type: v.value as string,
                });
              }}
              value={selectedItem.type}
              label="type"
              options={[null, "portal", "box"].map((o) => ({
                label: o === null ? "-" : o,
                value: o,
              }))}
            />
          }
          <hr className="my-5 opacity-20" />
          <Component {...props} />

          <hr className="my-5 opacity-20" />

          <label className="block  text-left text-xs font-medium mb-4 text-gray-300">
            Required items in inventory to show {selectedItem.name}
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
