import { useStore } from "../../../store";
import { loadSound } from "../../../utils";
import clsx from "clsx";
import { useState } from "react";

export default function Inventory() {
  const store = useStore();
  const dap = loadSound("/sounds/dap.ogg");
  const [selected, setSelect] = useState<number | undefined>();
  return (
    <div
      style={{ background: "#000c" }}
      className={clsx("h-full fixed z-50 w-screen min-h-screen", {
        hidden: store.modal !== "inventory",
      })}
    >
      <div className="w-full h-20 flex justify-between">
        <h1 className="m-3 text-white text-5xl font-black">Inventory</h1>
        <button
          onClick={() => {
            store.setOpenModal(undefined);
            setSelect(undefined);
            if (dap.play) dap.play();
          }}
          className="m-3 text-white text-5xl font-black"
        >
          x
        </button>
      </div>

      <hr className="opacity-50" />

      <div
        className={clsx("grid h-full gap-2 transition duration-200", {
          "grid-cols-2": Number(selected) > -1,
        })}
      >
        <div className="mt-20 rounded-3xl p-5 md:max-w-md mx-auto place-items-center">
          <div className="w-full  h-12  overflow rounded-t-2xl"></div>
          <div className="border-dashed w-full rounded-lg p-3 ">
            <div className="grid  grid-cols-3">
              {[...Array(9)].map((_, i) => (
                <div
                  key={i}
                  onClick={() => {
                    if (store.inventoryNotf.length > 0)
                      store.removeInventoryNotf(store.inventory[i].name);
                    setSelect(store.inventory[i] ? i : undefined);
                  }}
                  className={clsx(
                    "border flex flex-col items-center justify-center text-white border-white p-3 w-32 h-32 z-50",
                    {
                      "bg-green-600": selected === i,
                    }
                  )}
                >
                  {store.inventory[i] && (
                    <div className="relative">
                      <div className="text-xs absolute mx-auto -bottom-3  w-full text-center ">
                        {store.inventory[i].name}
                      </div>
                      <img
                        className="w-full"
                        src={store.inventory[i].src}
                        alt=""
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {Number(selected) > -1 && (
          <div className="h-full p-5 text-white">
            <div className="w-full  flex items-center justify-start">
              <img className="w-56 h-56" src="/images/stone.png" alt="" />
            </div>
            <hr className="opacity-25" />
            <div className="text-2xl">
              {store.inventory[Number(selected)]?.description}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
