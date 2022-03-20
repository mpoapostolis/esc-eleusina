import clsx from "clsx";
import { useRouter } from "next/router";
import { AllImage } from ".";
import { Img } from "../../pages/admin";
import { Item, useStore } from "../../store";
import Popover from "../Popover";

export default function BoxSettings(props: {
  getItems: () => void;
  items: Item[];
  imgs: Img[];
  update: (p: Partial<Item>) => void;
}) {
  const store = useStore();
  const router = useRouter();
  const id = router.query.id;
  const idx = props.items.findIndex((e) => e._id === id);
  const selectedItem = { ...props.items[idx] };
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
            <div className="border p-2 w-full  h-28 text-2xl  border-gray-700 flex items-center justify-center">
              {selectedItem.reward ? (
                <div>
                  <img src={selectedItem.reward?.src} className="w-20 h-auto" />
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
              reward: o as Item | null,
            });
          }}
        />
      </Popover>
    </>
  );
}