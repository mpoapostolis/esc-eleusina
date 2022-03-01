import { Conf } from "../../pages/admin";
import { Item, Scene, scenes } from "../../store";
import Popover from "../Popover";
import Select from "../Select";
import { v4 as uuidv4 } from "uuid";
import { DetailedHTMLProps, InputHTMLAttributes, useState } from "react";
import Range from "../Range";
import clsx from "clsx";
import axios from "axios";

function Checkbox(
  props: { label: string } & DetailedHTMLProps<
    InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  >
) {
  const id = uuidv4();
  return (
    <div className="flex items-center text-sm">
      <input type="checkbox" name="" className="mr-2" id={id} {...props} />
      <label htmlFor={id}>{props.label}</label>
    </div>
  );
}

function AllImage(props: {
  imgs?: { id?: string; src: string }[];
  onClick: (e?: any) => void;
}) {
  return (
    <div className="max-h-96 grid p-4 gap-4 bg-black grid-cols-2 items-center overflow-auto">
      {props.imgs?.map((o, idx) => (
        <div
          key={o.id}
          onClick={() => props.onClick(o.id)}
          className="p-4 h-full w-full justify-center items-center border  border-gray-700  bg-black hover:bg-slate-800 flex"
        >
          <img className="cursor-pointer w-full" src={o.src} />
        </div>
      ))}
    </div>
  );
}

export default function AdminSettings(props: {
  conf: Conf;
  imgs: string[];
  hide: string[];
  setHide: (s: string) => void;
  setLibrary: () => void;
  portal: boolean;
  setConf: (i: Item[]) => void;
  setScene: (s: Scene) => void;
  scene: Scene;
}) {
  const items = props.conf[props.scene] as Item[];

  const updateRequired = (id: string) => {
    if (!selectedItem) return;
    const requiredItems = selectedItem?.requiredItems ?? [];
    const found = requiredItems?.includes(id);
    const tmp = found
      ? requiredItems?.filter((e) => e !== id)
      : [...requiredItems, id];
    tmp;
    update({ ...selectedItem, requiredItems: tmp });
  };

  const update = (p: Item) => {
    const idx = items?.findIndex((i) => i.id === p.id);
    items[idx] = p;
    props.setConf(items);
  };
  const idToSrc = (id: string) =>
    props.conf[props.scene].find((e) => e.id === id)?.src;
  const [id, setId] = useState<string>();
  const [load, setLoad] = useState(false);
  const selectedItem = items?.find((i) => i.id === id);
  return (
    <div className="fixed w-screen z-50 h-screen pointer-events-none bg-transparent">
      <div className="text-gray-300 flex flex-col overflow-auto absolute pointer-events-auto  right-0  border-l px-10 py-5 border-gray-600 bg-black bg-opacity-90 w-96 h-screen">
        {selectedItem ? (
          <>
            <button
              onClick={() => setId(undefined)}
              className="w-full px-3 py-2 text-center bg-white bg-opacity-20"
            >
              Back
            </button>
            <hr className="my-5 opacity-50" />
            <div className="flex  items-start my-2 text-xs">
              <div className=" flex cursor-pointer w-32 justify-center flex-col items-center bg-white bg-opacity-5 text-center p-2">
                <img className="w-20 p-1  h-20" src={selectedItem.src} />
                {selectedItem.name}
              </div>

              <div className="w-full px-4">
                <Range
                  min={0.05}
                  max={5}
                  step={0.01}
                  onChange={(evt) => {
                    const value = +evt.target.value;
                    update({ ...selectedItem, scale: value });
                  }}
                  value={selectedItem.scale}
                  label="scale"
                />

                <Checkbox
                  label="Collectable"
                  checked={selectedItem.collectable}
                  onChange={(evt) => {
                    update({
                      ...selectedItem,
                      selectable: evt.target.checked
                        ? selectedItem.selectable
                        : false,
                      collectable: evt.target.checked,
                    });
                  }}
                />
                <div className="my-1" />
                <Checkbox
                  label="Selectable"
                  onChange={(evt) => {
                    update({
                      ...selectedItem,
                      collectable: evt.target.checked
                        ? true
                        : selectedItem.collectable,
                      selectable: evt.target.checked,
                    });
                  }}
                  checked={selectedItem.selectable}
                />
              </div>
            </div>
            <hr className="my-5 opacity-50" />

            <label className="block text-left text-xs font-medium mb-2 text-gray-200">
              Name
            </label>
            <input
              value={selectedItem.name}
              onChange={(evt) => {
                update({
                  ...selectedItem,
                  name: evt.currentTarget.value,
                });
              }}
              className=" text-sm  bg-transparent w-full focus:outline-none h-10 p-2 border border-gray-600"
            ></input>
            <br />
            <Select
              onChange={(v) => {
                update({
                  ...selectedItem,
                  goToScene: v.value as Scene,
                });
              }}
              value={selectedItem.goToScene}
              label="onClick go to scene"
              options={[undefined, ...scenes].map((o) => ({
                label: o === undefined ? "-" : o,
                value: o,
              }))}
            ></Select>
            <br />

            <label className="block text-left text-xs font-medium mb-2 text-gray-200">
              onClick trigger
            </label>
            <input
              value={selectedItem.onClickTrigger}
              onChange={(evt) => {
                update({
                  ...selectedItem,
                  onClickTrigger: evt.currentTarget.value,
                });
              }}
              className=" text-sm  bg-transparent w-full focus:outline-none h-10 p-2 border border-gray-600"
            ></input>

            <br />
            <Select
              onChange={(v) => {
                update({
                  ...selectedItem,
                  onClickOpenModal: v.value as "hint" | "dialogue" | undefined,
                });
              }}
              value={selectedItem.onClickOpenModal}
              label="onClick open"
              options={[undefined, "dialogue", "hint"].map((o) => ({
                label: o === undefined ? "-" : o,
                value: o,
              }))}
            ></Select>
            <br />
            <>
              <label className="block text-left text-xs font-medium mb-2 text-gray-200">
                on click set hint
              </label>
              <div>
                <textarea
                  className="bg-transparent  w-full focus:outline-none p-2 border border-gray-600"
                  rows={5}
                  value={selectedItem.setHint}
                  onChange={(evt) => {
                    update({
                      ...selectedItem,
                      setHint: evt.currentTarget.value,
                    });
                  }}
                ></textarea>
              </div>
              <br />
              <label className="block text-left text-xs font-medium mb-2 text-gray-200">
                on click set dialogue
              </label>
              <div>
                <textarea
                  className="bg-transparent  w-full focus:outline-none p-2 border border-gray-600"
                  rows={5}
                  value={selectedItem.setDialogue}
                  onChange={(evt) => {
                    update({
                      ...selectedItem,
                      setDialogue: evt.currentTarget.value,
                    });
                  }}
                ></textarea>
              </div>
              <br />
            </>

            {selectedItem.collectable && (
              <>
                <Popover
                  label={
                    <>
                      <label className="block text-left text-xs font-medium mb-2 text-gray-200">
                        inventory src
                      </label>
                      <div className="border p-2 w-full  h-28 text-2xl  border-gray-700 flex items-center justify-center">
                        {selectedItem.inventorySrc ? (
                          <img
                            className="w-20 h-auto"
                            src={idToSrc(selectedItem.inventorySrc)}
                          />
                        ) : (
                          "➕"
                        )}
                      </div>
                    </>
                  }
                >
                  <AllImage
                    imgs={props.imgs.map((id) => ({
                      id,
                      src: `https://raw.githubusercontent.com/mpoapostolis/escape-vr/main/public/images/${id}`,
                    }))}
                    onClick={(id: string) => {
                      update({
                        ...selectedItem,
                        inventorySrc: id,
                      });
                    }}
                  />
                </Popover>
                <br />

                <Popover
                  label={
                    <>
                      <label className="block text-left text-xs font-medium mb-2 text-gray-200">
                        Collect if keep
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
                    imgs={props.conf[props.scene]}
                    onClick={(id: string) => {
                      update({
                        ...selectedItem,
                        collectableIfHandHas: id,
                      });
                    }}
                  />
                </Popover>
                <br />

                <label className="block text-left text-xs font-medium mb-2 text-gray-200">
                  onCollect fail open hint
                </label>
                <div>
                  <textarea
                    value={selectedItem.onCollectFail}
                    onChange={(evt) => {
                      update({
                        ...selectedItem,
                        onCollectFail: evt.currentTarget.value,
                      });
                    }}
                    className="bg-transparent  w-full focus:outline-none p-2 border border-gray-600"
                    rows={5}
                  ></textarea>
                </div>
              </>
            )}

            <hr className="my-5 opacity-50" />

            <label className="block  text-left text-xs font-medium mb-4 text-gray-300">
              Required items to appear
            </label>
            <div className="grid gap-6 grid-cols-2">
              {props.conf[props.scene].map((i) => {
                const item = i as Item;
                return (
                  <div
                    key={i.id}
                    onClick={() => {
                      updateRequired(`${i.id}`);
                    }}
                    className={clsx(
                      "relative  bg-opacity-20 cursor-pointer border border-gray-700 w-full",
                      {
                        "bg-green-500": selectedItem.requiredItems?.includes(
                          `${i.id}`
                        ),
                      }
                    )}
                  >
                    <img className="w-full p-4" src={item.src} alt="" />
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          <>
            <button
              onClick={() => {
                setLoad(true);
                axios.put("/api/update", { items: props.conf }).then((d) => {
                  setLoad(false);
                });
              }}
              className="w-full items-center flex justify-center px-3 py-2 text-center bg-white bg-opacity-20"
            >
              {load && (
                <svg
                  role="status"
                  className="mr-2 w-5 h-5 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                  viewBox="0 0 100 101"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                    fill="currentColor"
                  />
                  <path
                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                    fill="currentFill"
                  />
                </svg>
              )}
              save
            </button>
            <hr className="my-5 opacity-50" />
            <div className="w-full bg-opacity-20">
              <Select
                label=""
                value={props.scene}
                onChange={(v) => props.setScene(v.value as Scene)}
                options={scenes.map((addr) => ({
                  label: addr,
                  value: addr.toLocaleLowerCase(),
                }))}
              />
            </div>
            <hr className="my-5 opacity-50" />
            <Popover
              label={
                <button className="w-full px-3 py-2 text-center bg-white bg-opacity-20">
                  + Add Item
                </button>
              }
            >
              <div className="max-h-96 grid p-4 gap-4 bg-black grid-cols-2 items-center overflow-auto">
                {props.imgs?.map((id, idx) => (
                  <div
                    key={id}
                    onClick={() =>
                      props.setConf([
                        {
                          id: uuidv4(),
                          scale: 0.5,
                          name: id === "arrows.png" ? "portal" : "",
                          type: id === "arrows.png" ? "portal" : "",
                          src: `https://raw.githubusercontent.com/mpoapostolis/escape-vr/main/public/images/${id}`,
                        },
                        ...(items ?? []),
                      ])
                    }
                    className="p-4 h-full w-full justify-center items-center border  border-gray-700  bg-black hover:bg-slate-800 flex"
                  >
                    <img
                      className="cursor-pointer w-full"
                      src={`https://raw.githubusercontent.com/mpoapostolis/escape-vr/main/public/images/${id}`}
                    />
                  </div>
                ))}
              </div>
            </Popover>
            <br />
            <div>
              {items?.map((i, idx) => (
                <div key={i.id}>
                  <div className="flex  items-start my-2 text-xs">
                    <div className=" flex cursor-pointer w-32 justify-center flex-col items-center border border-opacity-20 border-gray-200  text-center p-2">
                      <img className="w-16 p-2  h-1w-16" src={i.src} />
                      {i.name}
                    </div>

                    <div className="w-full px-4">
                      <div>
                        <Range
                          min={0.05}
                          max={5}
                          step={0.01}
                          value={i.scale}
                          onChange={(evt) => {
                            const value = +evt.target.value;
                            update({ ...i, scale: value });
                          }}
                          label="scale"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-x-2">
                        <button
                          onClick={() => {
                            props.setHide(`${i.id}`);
                          }}
                          className="w-full px-3 py-2 text-center bg-white bg-opacity-5 border border-gray-500 border-opacity-5"
                        >
                          {props.hide.includes(`${i.id}`) ? "Show" : "Hide"}
                        </button>

                        <button
                          onClick={() => setId(`${i.id}`)}
                          className="w-full px-3 py-2 text-center bg-white bg-opacity-5 border border-gray-500 border-opacity-5"
                        >
                          Edit
                        </button>
                      </div>
                    </div>

                    <span
                      onClick={() => {
                        props.setConf(items?.filter((e) => e.id !== i.id));
                      }}
                      role="button"
                      className="ml-auto w-4"
                      aria-label="close"
                    >
                      ✖️
                    </span>
                  </div>
                  <hr className="my-5 opacity-50" />
                </div>
              ))}
            </div>

            <br />
            <button
              onClick={() => props.setLibrary()}
              className="mt-auto w-full px-3 py-2 text-center bg-white bg-opacity-20"
            >
              library
            </button>
          </>
        )}
      </div>
    </div>
  );
}
