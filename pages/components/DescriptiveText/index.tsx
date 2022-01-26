import clsx from "clsx";
import { useEffect } from "react";
import { useTime } from "../..";
import { Scene, useStore } from "../../../store";

const shadow = {
  WebkitTextStroke: "1px black",
};

export default function DescriptiveText() {
  const store = useStore();
  const t = useTime();
  useEffect(() => {
    if (store.descriptiveText) t.pause();
  }, [store.descriptiveText]);

  return (
    <div
      onClick={() => {
        store.setDescriptiveText(undefined);
        t.start();
      }}
      className={clsx(
        "fixed  h-screen w-screen flex  pointer-events-auto  items-center  justify-center z-50",
        {
          hidden: !store.descriptiveText,
        }
      )}
    >
      <div className="w-full p-1  relative border-2 border-dashed rounded-2xl   max-w-xl   m-auto  text-4xl font-bold  text-white text-center">
        <div className="px-20 bg-opacity-90 bg-black border py-10 rounded-2xl">
          <img
            src="https://s2.svgbox.net/materialui.svg?ic=close&color=fff"
            role="button"
            className=" w-10 m-3 h-10 z-50 pointer-events-auto absolute right-0 top-0"
            alt=""
          />
          <div style={shadow}>{store.descriptiveText}</div>
        </div>
      </div>
    </div>
  );
}
