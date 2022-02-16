import { loadSound } from "../../utils";
import { Item, Scene, useStore } from "../../store";
import clsx from "clsx";
import Hint from "../Hint";
import HelpUiIcon from "../HelpUiIcon";

export const sceneItems: Record<Scene, string[]> = {
  intro: [""],
  karnagio: ["wing", "key", "lingerie", "wing1"],
  teletourgeio: ["scythe", "doxeio1", "doxeio2", "dafni"],
  elaiourgeio: ["mirror1", "mirror2", "dog"],
  jigSaw: [],
};

export default function Ui(props: { time: number }) {
  const sound = loadSound("/sounds/hint.wav");
  const store = useStore();

  const transform = { transform: "skewX(-20deg)" };

  const currInv: Item[] = store.inventory.filter((item) =>
    sceneItems[store.scene].includes(item.name)
  );
  //  sceneItems[store.scene];
  const tmpInv: Item[] = Array(9 - currInv.length).fill({
    name: "",
    src: "",
  });

  const inv: Item[] = [...currInv, ...tmpInv];

  return (
    <div
      className={clsx(
        "fixed flex flex-col justify-between  pointer-events-none z-50 h-screen w-screen",
        { hidden: store.status !== "RUNNING" }
      )}
    >
      <div className="stroke text-white drop-shadow-2xl text-5xl p-3">
        <div className="">Time: {props.time}</div>
      </div>

      <div
        className={clsx(
          "fixed w-full max-w-xl  right-0  mr-4   pointer-events-auto"
        )}
      >
        <Hint />
      </div>

      <div className={clsx("flex p-3 justify-end", {})}>
        <div className="grid grid-cols-2 gap-x-3">
          <HelpUiIcon />

          <button
            onClick={() => {
              sound.play();
              store.setStatus("MENU");
            }}
            className="border-4 p-3 bg-yellow-700 border-yellow-400 cursor-pointer pointer-events-auto"
          >
            <svg
              width="48"
              height="48"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              stroke="#000"
              fill="currentColor"
              color="#ccc"
            >
              <path d="M0 0h24v24H0V0z" fill="none"></path>
              <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58a.49.49 0 00.12-.61l-1.92-3.32a.488.488 0 00-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54a.484.484 0 00-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58a.49.49 0 00-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"></path>
            </svg>
          </button>
        </div>
      </div>

      <div
        className={clsx(
          "absolute -bottom-3 rounded-3xl p-5 md:max-w-md  place-items-center"
        )}
      >
        <div className="relative flex  tracking-wider italic  text-3xl font-bold text-white mb-2 justify-end w-full ">
          <div
            style={transform}
            className="from-transparent absolute -right-2 w-full opacity-90 text-5xl to-gray-500 bg-gradient-to-r h-6  font-normal bottom-0"
          />
          <h1
            style={{
              textShadow: "-1px -1px 2px #000, 1px 1px 1px #000",
            }}
            className="z-50 text-white font-bold text-4xl"
          >
            Inventory
          </h1>
        </div>

        <div className="border-2 p-2 rounded-2xl  border-gray-400  border-dashed">
          <div className="grid rounded-xl  pointer-events-auto grid-cols-3">
            {inv.map((item, i) => (
              <div
                key={i}
                onClick={() => {
                  if (item?.selectable) store.setHand(item.name);
                  if (item?.action) {
                    item?.action();
                  }
                  if (store.inventoryNotf.length > 0)
                    store.removeInventoryNotf(item.name);
                }}
                className={clsx(
                  "flex bg-black relative bg-opacity-70 flex-col w-20 h-20 border items-center justify-center  text-white border-gray-50 p-3 z-50 ",
                  {
                    "bg-green-900 cursor-pointer":
                      store.hand && store.hand === item?.name,
                    "cursor-pointer": item?.action,
                    "rounded-tl-2xl": i === 0,
                    "rounded-tr-2xl": i === 2,
                    "rounded-bl-2xl": i === 6,
                    "rounded-br-2xl": i === 8,
                  }
                )}
              >
                {item && (
                  <>
                    <div className="text-xs absolute mx-auto w-full bottom-0 bg-black bg-opacity-30  text-center ">
                      {item.name}
                    </div>
                    <img className="w-full p-1" src={item.src} alt="" />
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
