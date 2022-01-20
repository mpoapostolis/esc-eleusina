import { useEffect } from "react";
import { loadSound } from "../../../utils";
import { useStore } from "../../../store";
import { useTimer } from "use-timer";
import clsx from "clsx";
import useKeyPress from "../../../Hooks/useKeyPress";
import { useRouter } from "next/dist/client/router";
import Hint from "../Hint";
import HelpUiIcon from "../HelpUiIcon";

export default function Ui() {
  const dap = loadSound("/sounds/hint.wav");
  const store = useStore();
  const iPressed = useKeyPress("i");
  const escPressed = useKeyPress("Escape");
  const router = useRouter();
  useEffect(() => {
    if (iPressed) router.push("/?type=inventory");
    if (escPressed) router.push("/");
  }, [iPressed, escPressed]);

  const { time, start, pause } = useTimer({
    initialTime: store.timer,
    timerType: "DECREMENTAL",
    onTimeUpdate: (t) => store.setTimer(t),
    step: 1,
    endTime: 0,
    onTimeOver: () => {
      store.setOpenModal("gameOver");
    },
  });

  useEffect(start, []);
  const transform = { transform: "skewX(-20deg)" };

  return (
    <div className="fixed flex flex-col justify-between  pointer-events-none z-50 h-screen w-screen">
      <div className="stroke text-white drop-shadow-2xl text-5xl p-3">
        <div className="">Time: {time}</div>
      </div>
      <div
        className={clsx(
          "fixed w-full max-w-xl  right-0  mr-4   pointer-events-auto",
          {
            "opacity-100": store.hint,
            "w-0 opacity-0": !store.hint,
          }
        )}
      >
        <Hint />
      </div>

      <div
        className={clsx("flex p-3 justify-end", {
          hidden: store.dialogue.length > 0,
        })}
      >
        <div className="grid grid-cols-3 gap-x-3">
          <HelpUiIcon />
          <button
            onClick={() => {
              if (dap.play) dap.play();
              router.push("/?type=inventory");
              pause();
            }}
            className="relative border-4 p-3 bg-yellow-700 border-yellow-400 cursor-pointer pointer-events-auto"
          >
            {store.inventoryNotf.length > 0 && (
              <div className="bg-red-500 rounded-full w-8 h-8 -right-4 absolute -top-4 text-white flex justify-center items-center border-yellow-400 border">
                {store.inventoryNotf.length}
              </div>
            )}

            <img
              src="https://s2.svgbox.net/illlustrations.svg?ic=travel-bag&color=000"
              width={48}
              height={48}
            />
          </button>

          <button
            onClick={() => {
              if (dap.play) dap.play();
              router.push("/?type=menu");
              pause();
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
          "absolute -bottom-3 rounded-3xl p-5 md:max-w-md  place-items-center",
          {
            hidden: store.dialogue.length > 0,
          }
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
            {[...Array(9)].map((_, i) => (
              <div
                key={i}
                onClick={() => {
                  const item = store.inventory[i];
                  if (item.action) item.action();
                  if (store.inventoryNotf.length > 0)
                    store.removeInventoryNotf(item.name);
                }}
                className={clsx(
                  "flex bg-black bg-opacity-70 flex-col w-20 h-20 border items-center justify-center  text-white border-gray-50 p-3 z-50 ",
                  {
                    "rounded-tl-2xl": i === 0,
                    "rounded-tr-2xl": i === 2,
                    "rounded-bl-2xl": i === 6,
                    "rounded-br-2xl": i === 8,
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

      <div
        onClick={() => store.nextDialogue()}
        style={{
          minHeight: "300px",
        }}
        className={clsx(
          "fixed bottom-0 pointer-events-auto  h-80 mb-2 duration-500 transition",
          {
            "w-full opacity-100": store.dialogue.length > 0,
            "w-0 opacity-0": store.dialogue.length < 1,
          }
        )}
      >
        <img
          src="/images/dialogueBox.png"
          className="w-full mx-auto absolute z-10 left-0  h-80 top-0"
          alt=""
        />
        <div className="flex rounded items-start w-full p-4 h-full">
          <button
            onClick={() => {
              store.setDialogue([]);
              if (dap.play) dap.play();
            }}
            className="m-3 text-white  z-50 text-5xl absolute right-10 top-10 font-black"
          >
            x
          </button>
          <div className="text-white z-50 rounded break-words mt-6 text-4xl px-10 py-4 w-full h-full mx-auto ">
            {store.dialogue[0]}
          </div>
          {store.dialogue.length - 1 > 0 && (
            <button className="m-3 text-white z-50 text-3xl animate-pulse absolute right-10 bottom-14 font-black">
              Συνέχεια...
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
