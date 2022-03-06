import { Conf, Img } from "../../pages/admin";
import { Item, Scene, scenes, useStore } from "../../store";
import Popover from "../Popover";
import Select from "../Select";
import { v4 as uuidv4 } from "uuid";
import { DetailedHTMLProps, InputHTMLAttributes, useState } from "react";
import Range from "../Range";
import clsx from "clsx";
import axios from "axios";
import { useRouter } from "next/router";
import { json } from "stream/consumers";

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
  imgs?: (Item | Img)[];
  onClick: (e?: Item | Img | null) => void;
}) {
  return (
    <div className="max-h-96 grid p-4 gap-4 bg-black grid-cols-4 items-center overflow-auto">
      {props.imgs?.map((o, idx) => (
        <div
          key={o._id}
          onClick={() => {
            props.onClick(o);
          }}
          className="p-2 pb-6 h-full hover:scale-120 w-full relative justify-center items-center border  border-gray-700  bg-black hover:bg-slate-800 flex"
        >
          <img className=" cursor-pointer w-full" src={o.src} />
          <span className="text-xs absolute bottom-0">{o.name}</span>
        </div>
      ))}
      <button
        className="p-2 h-full hover:scale-150 w-full justify-center items-center border  border-gray-700  bg-black hover:bg-slate-800 flex"
        onClick={() => props.onClick(null)}
      >
        ✖️
      </button>
    </div>
  );
}

export default function AdminSettings(props: {
  items: Conf;
  imgs: Img[];
  getItems: () => void;
  update: (p: Partial<Item>) => void;
  portal: boolean;
  setScene: (s: Scene) => void;
  scene: Scene;
}) {
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

  const idToName = (id?: string) =>
    props.items.find((e) => {
      return e._id === id;
    })?.name;

  const idToSrc = (id?: string) =>
    props.items.find((e) => {
      return e._id === id;
    })?.src;

  const getImg = (id?: string) =>
    props.imgs.find((e) => {
      return e._id === id;
    });

  const [load, setLoad] = useState(false);
  const router = useRouter();
  const id = router.query.id;
  const idx = props.items.findIndex((e) => e._id === id);
  const selectedItem = { ...props.items[idx] };

  const store = useStore();
  const sceneImgs = props.items.filter((item) => store?.scene === item.scene);

  const imgIdToInfo: Record<string, Img> = {};
  props.imgs.forEach((img) => {
    imgIdToInfo[`${img._id}`] = img;
  });

  return (
    <div className="fixed w-screen z-50 h-screen pointer-events-none bg-transparent">
      <div className="text-gray-300 flex flex-col overflow-auto absolute pointer-events-auto  right-0  border-l px-10 py-5 border-gray-600 bg-black bg-opacity-90 w-96 h-screen">
        {id ? (
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
                  max={5}
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
                          <img
                            className="h-fit mr-4 w-7"
                            src={idToSrc(e)}
                            alt=""
                          />
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
                        imgs={sceneImgs}
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
                                    src={idToSrc(
                                      selectedItem.collectableIfHandHas
                                    )}
                                  />
                                ) : (
                                  "➕"
                                )}
                              </div>
                            </>
                          }
                        >
                          <AllImage
                            imgs={sceneImgs}
                            onClick={(o) => {
                              props.update({
                                collectableIfHandHas: o?._id ?? null,
                              });
                            }}
                          />
                        </Popover>
                        <br />

                        <label className="block text-left text-xs font-medium mb-2 text-gray-200">
                          Hint text when fail to collect (no required tool
                          selected)
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
                            "bg-green-500":
                              selectedItem.requiredItems?.includes(`${i._id}`),
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
        ) : (
          <>
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

            <hr className="my-5 opacity-20" />
            <Popover
              label={
                <button className="w-full px-3 py-2 text-center bg-white bg-opacity-20">
                  + Add Item
                </button>
              }
            >
              <AllImage
                imgs={props.imgs}
                onClick={(id) => {
                  axios
                    .post("/api/items", {
                      scene: store.scene,
                      imgId: id?._id,
                      scale: 0.5,
                    })
                    .then((d) => {
                      props.getItems();
                      router.push({
                        query: {
                          id: d.data.id,
                        },
                      });
                    });
                }}
              />
            </Popover>
            <br />
            <div className=" grid grid-cols-3 gap-4">
              {props.items?.map((i, idx) => {
                return (
                  <div
                    className="relative"
                    key={idx}
                    onClick={() =>
                      router.push({
                        query: {
                          id: i._id,
                        },
                      })
                    }
                  >
                    <img
                      className="w-full  text-xs cursor-pointer
                                flex justify-center flex-col items-center 
                                border border-opacity-20 border-gray-200  text-center p-6"
                      src={i.src}
                    />
                    <div className="text-white absolute bottom-0 text-xs text-center  w-full bg-black bg-opacity-30">
                      {i.name}
                    </div>
                  </div>
                );
              })}
            </div>

            <button
              onClick={() => router.push("/admin?type=library")}
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
