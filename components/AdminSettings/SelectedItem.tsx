import { update } from "@react-spring/three";
import axios from "axios";
import clsx from "clsx";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Euler, Vector3 } from "three";
import { Checkbox } from ".";
import useMutation from "../../Hooks/useMutation";
import { deleteItem, getItems, updateItem } from "../../lib/items";
import { Img } from "../../pages/admin";
import { Item, useStore } from "../../store";
import Range from "../Range";
import Select from "../Select";
import BoxSettings from "./BoxSettings";
import ItemSettings from "./ItemSettings";
import PortalSettings from "./PortalSettings";

const Component = (props: { type?: string }) => {
  switch (props.type) {
    case "portal":
      return <PortalSettings />;
    case "box":
      return <BoxSettings />;

    default:
      return <ItemSettings />;
  }
};

export default function SelectedItem() {
  const { data: items } = getItems();
  const router = useRouter();
  const id = `${router.query.id}`;
  const idx = items.findIndex((e) => e._id === id);
  const selectedItem = { ...items[idx] };

  useEffect(() => {
    const idx = items.findIndex((e) => e._id === id);
    const selectedItem = { ...items[idx] };
  }, [items]);

  const store = useStore();
  const [_updateItem] = useMutation(updateItem, [
    `/api/items?scene=${store.scene}`,
  ]);

  const updateRequired = (_id: string) => {
    if (!selectedItem) return;
    const requiredItems = selectedItem?.requiredItems ?? [];
    const found = requiredItems?.includes(_id);
    const tmp = found
      ? requiredItems?.filter((e) => e !== _id)
      : [...requiredItems, _id];
    _updateItem(id, { requiredItems: tmp });
  };

  const [_deleteItem] = useMutation(deleteItem, [
    `/api/items?scene=${store.scene}`,
  ]);

  const rotate = (axis: "x" | "y" | "z", rot: number) => {
    if (!store.rot) return;
    const e3 = new Euler().copy(store.rot);
    e3[axis] = rot;
    store.setRot(e3);
  };
  const resetRots = () => {
    store.setScale(null);
    store.setRot(null);
  };

  useEffect(() => {
    const rot = selectedItem.rotation;
    if (rot) store.setRot(rot);
  }, []);

  return (
    <>
      <div className="flex">
        <button
          onClick={() => {
            resetRots();
            router.push({
              query: {
                id: undefined,
              },
            });
          }}
        >
          <img
            src="https://s2.svgbox.net/materialui.svg?ic=arrow_back&color=888"
            width="32"
            height="32"
          />
        </button>
        <button
          className="ml-auto"
          onClick={() => {
            resetRots();
            router.push({
              query: {
                id: undefined,
              },
            });
          }}
        >
          <img
            onClick={async () => {
              resetRots();
              router.push("/admin");
              _deleteItem(id);
            }}
            src="https://s2.svgbox.net/materialui.svg?ic=delete&color=a88"
            width="32"
            height="32"
          />
        </button>
      </div>

      <hr className="my-5 opacity-20" />
      <div className="flex  items-start select-none my-2 text-xs">
        <div className="flex cursor-pointer w-40 h-20 justify-center flex-col items-center bg-white bg-opacity-5 text-center p-2">
          <img className=" w-12 h-12" src={selectedItem.src} />
          {selectedItem.name}
        </div>

        <div className="w-full px-4">
          <Range
            min={0.1}
            max={1}
            step={0.1}
            onPointerUp={(e) => {
              _updateItem(id, {
                rotation: store.rot,
              });
            }}
            onChange={(evt) => {
              const v = +evt.target.value;
              store.setScale(v);
            }}
            label="scale"
          />

          <Range
            min={0}
            max={2 * Math.PI}
            step={0.0174532925}
            onPointerUp={(e) => {
              _updateItem(id, {
                rotation: store.rot,
              });
            }}
            onChange={(evt) => {
              const x = +evt.target.value;
              rotate("x", x);
            }}
            label="Rotate X"
          />

          <Range
            min={0}
            max={2 * Math.PI}
            step={0.0174532925}
            onPointerUp={(e) => {
              _updateItem(id, {
                rotation: store.rot,
              });
            }}
            onChange={(evt) => {
              const y = +evt.target.value;
              rotate("y", y);
            }}
            label="Rotate Y"
          />

          <Range
            min={0}
            max={2 * Math.PI}
            step={0.0174532925}
            onPointerUp={(e) => {
              _updateItem(id, {
                rotate: store.rot,
              });
            }}
            onChange={(evt) => {
              const z = +evt.target.value;
              rotate("z", z);
            }}
            label="Rotate z"
          />
          <br />
          {!selectedItem.type && (
            <>
              <Checkbox
                label="Collect to inventory"
                checked={selectedItem.collectable}
                onChange={(evt) => {
                  _updateItem(id, {
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
                  _updateItem(id, {
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
              _updateItem(id, {
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
                _updateItem(id, {
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
          <Component type={selectedItem.type} />

          <hr className="my-5 opacity-20" />

          <label className="block  text-left text-xs font-medium mb-4 text-gray-300">
            Required items in inventory to show {selectedItem.name}
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
