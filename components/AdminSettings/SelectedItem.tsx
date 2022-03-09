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
          <div className="my-1" />
        </div>
      </div>
      <hr className="my-5 opacity-20" />

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
            options={[
              undefined,
              "portal",
              "hint",
              "guidelines",
              "box",
              "jigsaw",
            ].map((o) => ({
              label: o === undefined ? "-" : o,
              value: o,
            }))}
          ></Select>
          <br />

          <label className="block text-left text-xs font-medium mb-2 text-gray-200">
            Name
          </label>
          <input
            value={selectedItem.name}
            onChange={(evt) => {
              props.update({
                name: evt.currentTarget.value,
              });
            }}
            className=" text-sm  bg-transparent w-full focus:outline-none h-10 p-2 border border-gray-600"
          ></input>

          <br />
          {selectedItem.type === "box" ? (
            <>
              <hr className="mb-5 opacity-20" />

              <ul className="">
                {selectedItem.orderInsideTheBox?.map((e, idx) => (
                  <li
                    onClick={() => {
                      updateOrderInBox(e);
                    }}
                    key={e}
                    className={clsx(
                      "relative flex mb-2 items-center text-gray-400 p-2 h-10  bg-opacity-20 cursor-pointer border border-gray-700 w-full"
                    )}
                  >
                    <span className="mr-5">{idx + 1}:</span>
                    <img className="h-fit mr-4 w-7" src={idToSrc(e)} alt="" />
                    <span className="mr-4">{idToName(e)}</span>
                    <span
                      className="ml-auto"
                      onClick={() => updateOrderInBox(e)}
                    >
                      ✖️
                    </span>
                  </li>
                ))}
              </ul>

              <Popover
                label={
                  <button className="w-full mt-4 px-3 py-2 text-center bg-white bg-opacity-20">
                    + Add Item in box
                  </button>
                }
              >
                <AllImage
                  imgs={sceneItems}
                  onClick={(o) => {
                    updateOrderInBox(`${o?._id}`);
                  }}
                />
              </Popover>

              <hr className="my-4 opacity-20" />

              <div>
                <label className="block text-left text-xs font-medium mb-2 text-gray-200">
                  if Order is not correct setError
                </label>
                <textarea
                  className="bg-transparent h-20  w-full text-sm focus:outline-none p-2 border border-gray-600"
                  rows={5}
                  value={selectedItem.orderBoxError}
                  onChange={(evt) => {
                    props.update({
                      orderBoxError: evt.currentTarget.value,
                    });
                  }}
                ></textarea>
              </div>
              <Popover
                label={
                  <>
                    <label className="block text-left text-xs font-medium mb-2 text-gray-200">
                      Reward
                    </label>
                    <div className="border relative p-2 w-full  h-28 text-2xl  border-gray-700 flex items-center justify-center">
                      {selectedItem.boxReward ? (
                        <div className="">
                          <img
                            src={idToSrc(selectedItem.boxReward)}
                            className="w-20 h-auto"
                          />
                          <div className="text-xs w-full  bg-black bg-opacity-20 text-center mt-1">
                            {idToName(selectedItem.boxReward)}
                          </div>
                        </div>
                      ) : (
                        "➕"
                      )}
                    </div>
                  </>
                }
              >
                <AllImage
                  imgs={props.items}
                  onClick={(o) => {
                    props.update({
                      boxReward: o?._id ?? null,
                    });
                  }}
                />
              </Popover>
            </>
          ) : (
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

              <label className="block text-left text-xs font-medium mb-2 text-gray-200">
                jigSaw image url
              </label>
              <input
                value={selectedItem.jigSawUrl}
                onChange={(evt) => {
                  props.update({
                    jigSawUrl: evt.currentTarget.value,
                  });
                }}
                className=" text-sm  bg-transparent w-full focus:outline-none h-10 p-2 border border-gray-600"
              ></input>

              <br />

              <label className="block text-left text-xs font-medium mb-2 text-gray-200">
                onClick trigger
              </label>
              <input
                value={selectedItem.onClickTrigger}
                onChange={(evt) => {
                  props.update({
                    onClickTrigger: evt.currentTarget.value,
                  });
                }}
                className=" text-sm  bg-transparent w-full focus:outline-none h-10 p-2 border border-gray-600"
              ></input>

              <br />

              <label className="block text-left text-xs font-medium mb-2 text-gray-200">
                onClick set Lexigram seperated by comma (,)
              </label>
              <input
                value={selectedItem.lexigram}
                onChange={(evt) => {
                  props.update({
                    lexigram: evt.currentTarget.value,
                  });
                }}
                className=" text-sm  bg-transparent w-full focus:outline-none h-10 p-2 border border-gray-600"
              ></input>

              <br />

              <Popover
                label={
                  <>
                    <label className="block text-left text-xs font-medium mb-2 text-gray-200">
                      Lexigram reward
                    </label>
                    <div className="border p-2 w-full  h-28 text-2xl  border-gray-700 flex items-center justify-center">
                      {selectedItem.lexigramReward ? (
                        <div>
                          <img
                            src={selectedItem.lexigramReward?.src}
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
                  imgs={props.items}
                  onClick={async (o) => {
                    props.update({
                      lexigramReward: o as Item | null,
                    });
                  }}
                />
              </Popover>
              <br />

              <Select
                onChange={(v) => {
                  props.update({
                    onClickOpenModal: v.value as
                      | "hint"
                      | "guidelines"
                      | undefined,
                  });
                }}
                value={selectedItem.onClickOpenModal}
                label="onClick open Guidelines or Hint"
                options={[undefined, "guidelines", "hint"].map((o) => ({
                  label: o === undefined ? "-" : o,
                  value: o,
                }))}
              ></Select>
              <br />
              <>
                <label className="block text-left text-xs font-medium mb-2 text-gray-200">
                  on click set Hint Text
                </label>
                <div>
                  <textarea
                    className="bg-transparent  w-full focus:outline-none p-2 border border-gray-600"
                    rows={5}
                    value={selectedItem.setHint}
                    onChange={(evt) => {
                      props.update({
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
                    className="bg-transparent  w-full focus:outline-none p-2 border border-gray-600"
                    rows={5}
                    value={selectedItem.setGuidelines}
                    onChange={(evt) => {
                      props.update({
                        setGuidelines: evt.currentTarget.value,
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
                      imgs={props.imgs}
                      onClick={(o) => {
                        props.update({
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
                        props.update({
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
                      value={selectedItem.onCollectFail}
                      onChange={(evt) => {
                        props.update({
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
          )}

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
