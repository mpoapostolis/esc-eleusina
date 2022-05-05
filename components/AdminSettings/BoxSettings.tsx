import clsx from "clsx";
import { useEffect, useState } from "react";
import { AllImage } from ".";
import { MiniGame } from "../../pages";
import { getItems, getMiniGames, updateMiniGame } from "../../queries";
import { useStore } from "../../store";
import Popover from "../Popover";

export default function BoxSettings(props: MiniGame) {
  const { data: items } = getItems();
  const { data: miniGames } = getMiniGames();
  const [v, setV] = useState<string>();

  const store = useStore();
  const idx = miniGames.findIndex((e) => e.scene === store.scene);
  const miniGame = { ...miniGames[idx] };
  const sceneItems = items.filter((item) => store?.scene === item.scene);

  useEffect(() => {
    if (miniGame.orderBoxError) setV(miniGame.orderBoxError);
  }, [miniGame.orderBoxError]);

  const updateOrderInBox = (id: string) => {
    if (!miniGame) return;
    const orderInsideTheBox = miniGame?.orderInsideTheBox ?? [];
    const found = orderInsideTheBox?.includes(id);
    const tmp = found
      ? orderInsideTheBox?.filter((e) => e !== id)
      : [...orderInsideTheBox, id];
    updateMiniGame({ ...props, orderInsideTheBox: tmp });
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
        {miniGame.orderInsideTheBox?.map((e, idx) => (
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
          imgs={sceneItems}
          onClick={(o) => {
            updateOrderInBox(`${o?._id}`);
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
            updateMiniGame({
              ...props,
              orderBoxError: v,
            });
          }}
        ></textarea>
      </div>
    </>
  );
}
