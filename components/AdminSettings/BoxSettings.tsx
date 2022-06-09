import clsx from "clsx";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { AllImage } from ".";
import { Img } from "../../pages/admin";
import { getItems, updateItem } from "../../queries/items";
import { getLibrary } from "../../queries/library";
import { useStore } from "../../store";
import { getOnlyItems } from "../../utils";
import Popover from "../Popover";

export default function BoxSettings(props: { imgs: Img[] }) {
  const { data: items } = getItems();
  const [v, setV] = useState<string>();
  const [rewardDescription, setRewardDescription] = useState<string>();
  const router = useRouter();
  const id = `${router.query.id}`;
  const idx = items.findIndex((e) => e._id === id);
  const selectedItem = { ...items[idx] };
  const store = useStore();
  useEffect(() => {
    if (selectedItem.orderBoxError) setV(selectedItem.orderBoxError);
    if (selectedItem.rewardDescription)
      setRewardDescription(selectedItem.rewardDescription);
  }, [selectedItem.orderBoxError, selectedItem.rewardDescription]);

  const updateOrderInBox = (_id: string) => {
    if (!selectedItem) return;
    const orderInsideTheBox = selectedItem?.orderInsideTheBox ?? [];
    const found = orderInsideTheBox?.includes(_id);
    const tmp = found
      ? orderInsideTheBox?.filter((e) => e !== _id)
      : [...orderInsideTheBox, _id];
    updateItem(id, { orderInsideTheBox: tmp });
  };
  const idToName = (id?: string) =>
    items.find((e) => {
      return e._id === id;
    })?.name;

  const idToSrc = (id?: string) =>
    items.find((e) => {
      return e._id === id;
    })?.src;
  const sceneItems = items.filter((item) => store?.scene === item.scene);

  return (
    <>
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
            <span className="ml-auto" onClick={() => updateOrderInBox(e)}>
              ❌
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
          imgs={getOnlyItems(sceneItems)}
          onClick={(o) => {
            if (o) updateOrderInBox(`${o?._id}`);
          }}
        />
      </Popover>

      <hr className="my-4 opacity-10" />

      <div>
        <label className="block text-left text-xs font-medium mb-2 text-gray-200">
          if Order is not correct setError
        </label>
        <textarea
          className="bg-transparent h-20  w-full text-sm focus:outline-none p-2 border border-gray-600"
          rows={5}
          value={v}
          onChange={(evt) => {
            setV(evt.currentTarget.value);
          }}
          onBlur={() => {
            updateItem(id, {
              orderBoxError: v,
            });
          }}
        ></textarea>
        <Popover
          label={
            <>
              <label className="block text-left text-xs font-medium mt-4 mb-2 text-gray-200">
                Reward
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
            imgs={getOnlyItems(props.imgs)}
            onClick={async (o) => {
              updateItem(id, {
                reward: o,
              });
            }}
          />
        </Popover>

        <div>
          <label className="block text-left text-xs font-medium mt-4 mb-2 text-gray-200">
            Reward Msg
          </label>
          <textarea
            className="bg-transparent h-20  w-full text-sm focus:outline-none p-2 border border-gray-600"
            rows={5}
            value={rewardDescription}
            onChange={(evt) => {
              setRewardDescription(evt.currentTarget.value);
            }}
            onBlur={() => {
              updateItem(id, {
                reward: {
                  ...selectedItem.reward,
                  description: rewardDescription,
                },
              });
            }}
          ></textarea>
        </div>
      </div>
    </>
  );
}
