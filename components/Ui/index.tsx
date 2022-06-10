import { loadSound } from "../../utils";
import { Item, Scene, useStore } from "../../store";
import clsx from "clsx";
import Hint from "../Hint";

export default function Ui(props: { items: Item[]; time: number }) {
  const sound = loadSound("/sounds/hint.wav");
  const store = useStore();

  const transform = { transform: "skewX(-20deg)" };

  const currInv: Item[] = store.inventory.filter(
    // @ts-ignore
    (item) => item?.scene === store.scene
  ) as Item[];
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
      <div
        style={transform}
        className="stroke text-white relative ml-10 drop-shadow-2xl text-4xl font-bold m-4 w-96"
      >
        <h1
          style={{
            textShadow: "-1px -1px 2px #000, 1px 1px 1px #000",
          }}
          className="z-50 text-white mb-2 font-bold text-4xl text-right"
        >
          time remaining
        </h1>

        <div className="w-96 bg-white border border-black ">
          <div
            className="bg-gray-400 flex items-center justify-end h-8"
            style={{
              textShadow: "-1px -1px 2px #000, 1px 1px 1px #000",
              width: `${(props.time / 600) * 100}%`,
            }}
          >
            <div className="relative right-4">{props.time}</div>
          </div>
        </div>
        <div className="border-b mt-2 border-black w-full border-dashed"></div>
      </div>

      <div
        className={clsx(
          "fixed w-full max-w-xl  right-0  mr-4   pointer-events-auto"
        )}
      >
        <Hint />
      </div>

      <div className={clsx("flex p-3 justify-end", {})}>
        <button
          onClick={() => {
            sound.play();
            store.setStatus("MENU");
          }}
          className=" border-dashed rounded-lg border border-black bg-white bg-opacity-30  cursor-pointer pointer-events-auto"
        >
          <img src="/images/menu_icon.svg" className="w-20" alt="" />
        </button>
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

        <div className="border-2 p-2 rounded-2xl  border-gray-800  border-dashed">
          <div className="grid rounded-xl  pointer-events-auto grid-cols-3">
            {inv.map((item, i) => (
              <div
                key={i}
                onClick={() => {
                  if (item?.selectable) store.setHand(item._id);
                  if (item?.action) {
                    item?.action();
                  }

                  if (item.setHint) store.setHint(item.setHint);

                  if (item.setGuidelines)
                    store.setguideLines(item.setGuidelines);

                  if (item.onClickOpenModal === "hint")
                    store.setIsHintVisible(true);
                  if (item.onClickOpenModal === "guidelines")
                    store.setguideLinesVissible(true);

                  if (item.onClickOpenModal === "ancientText") {
                    if (item.ancientText && item.author)
                      store.setAncientText({
                        text: item.ancientText,
                        keys: item.clickableWords?.split(",") ?? [],
                        author: item.author,
                      });
                  }
                }}
                className={clsx(
                  "flex bg-white relative bg-opacity-40 flex-col w-20 h-20 border items-center justify-center  text-white border-gray-800 p-3 z-50 ",
                  {
                    "bg-green-900 ": store.hand && store.hand === item?._id,
                    "cursor-pointer":
                      item.setHint ||
                      item.setGuidelines ||
                      item.selectable ||
                      item?.action,
                    "rounded-tl-2xl": i === 0,
                    "rounded-tr-2xl": i === 2,
                    "rounded-bl-2xl": i === 6,
                    "rounded-br-2xl": i === 8,
                  }
                )}
              >
                {item && (
                  <>
                    <img
                      className="w-full p-1"
                      src={item.inventorySrc ? item?.inventorySrc : item.src}
                      alt=""
                    />
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
