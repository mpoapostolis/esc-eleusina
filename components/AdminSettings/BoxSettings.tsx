import clsx from "clsx";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { AllImage } from ".";
import useMutation from "../../Hooks/useMutation";
import { getItems, updateItem } from "../../lib/items";
import { Img } from "../../pages/admin";
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

  const [_updateItem] = useMutation(updateItem, [
    `/api/items?scene=${store.scene}`,
  ]);

  useEffect(() => {
    if (selectedItem.orderBoxError) setV(selectedItem.orderBoxError);
    if (selectedItem.reward?.description)
      setRewardDescription(selectedItem.reward?.description);
  }, [selectedItem.orderBoxError, selectedItem.reward]);

  const updateOrderInBox = (_id: string) => {
    if (!selectedItem) return;
    const orderInsideTheBox = selectedItem?.orderInsideTheBox ?? [];
    const found = orderInsideTheBox?.includes(_id);
    const tmp = found
      ? orderInsideTheBox?.filter((e) => e !== _id)
      : [...orderInsideTheBox, _id];
    _updateItem(id, { orderInsideTheBox: tmp });
  };
  const idToName = (id?: string) =>
    items.find((e) => {
      return e._id === id;
    })?.name;

  const idToSrc = (id?: string) =>
    items.find((e) => {
      return e._id === id;
    })?.src;

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
        label={<button className="btn mt-4 w-full">+ Add Item in box</button>}
      >
        <AllImage
          imgs={getOnlyItems(items)}
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
            _updateItem(id, {
              orderBoxError: v,
            });
          }}
        ></textarea>
        <br />
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
                    <img
                      src={selectedItem.replaceImg}
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
              _updateItem(id, {
                replaceImg: o?.src ?? null,
              });
            }}
          />
        </Popover>
        <br />
        {selectedItem.replaceImg && (
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
              // @ts-ignore
              imgs={items}
              onClick={(o) => {
                _updateItem(id, {
                  requiredToolToReplace: o ?? null,
                });
              }}
            />
          </Popover>
        )}
        <br />{" "}
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
              _updateItem(id, {
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
              _updateItem(id, {
                reward: {
                  ...selectedItem.reward,
                  description: rewardDescription,
                },
              });
            }}
          />
        </div>
      </div>
    </>
  );
}
