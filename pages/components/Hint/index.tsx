import clsx from "clsx";
import { useEffect } from "react";
import { useStore } from "../../../store";
import { loadSound } from "../../../utils";

export default function Hint() {
  const transform = { transform: "skewX(-20deg)" };
  const shadow = {
    WebkitTextStroke: "1px black",
  };
  const store = useStore();
  const hint = loadSound("/sounds/hint.wav");
  useEffect(() => {
    if (hint.play && store.hint) hint.play();
  }, [store.hint]);
  return (
    <div
      className={clsx(
        "fixed w-full max-w-xl  right-0  mr-4   pointer-events-auto",
        {
          "opacity-100": store.hint,
          "w-0 opacity-0": !store.hint,
        }
      )}
    >
      <div
        onClick={() => store.setHint(undefined)}
        className="w-full p-10 cursor-pointer hover:cursor-zoom-out"
      >
        <div className=" relative  flex  tracking-wider italic  text-3xl font-bold text-white mb-1 justify-end w-full">
          <div
            style={transform}
            className="from-transparent absolute -right-2 w-80 opacity-90 text-5xl to-gray-500 bg-gradient-to-r h-7 font-normal bottom-0"
          />
          <h1
            style={{
              textShadow: "-1px -1px 2px #000, 1px 1px 1px #000",
            }}
            className="z-50 text-white font-bold text-4xl"
          >
            hints
          </h1>
        </div>
        <hr className="border-dashed border float-right border-black w-3/4" />

        <div
          style={transform}
          className="m-2 px-4 py-4 min-h-fit  text-2xl rounded-lg  border-2 border-black -skew-x-12  w-full bg-white bg-opacity-40"
        >
          <div className="text-white font-bold text-3xl" style={shadow}>
            {store.hint}
          </div>
        </div>
        <hr className="border-dashed  border border-black w-3/4" />
      </div>
    </div>
  );
}
