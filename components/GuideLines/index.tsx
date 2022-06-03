import clsx from "clsx";
import { useStore } from "../../store";

const shadow = {
  WebkitTextStroke: "1px black",
};

export default function GuideLines() {
  const store = useStore();
  const getMaxW =
    (store.guideLines?.length ?? 100) > 450 ? "max-w-5xl" : "max-w-2xl";

  return (
    <div
      onClick={() => {
        store.setguideLinesVissible(false);
        store.setStatus("RUNNING");
      }}
      className={clsx(
        "fixed  h-screen w-screen flex  pointer-events-auto  items-center  justify-center z-50",
        {
          hidden: store.status !== "GUIDELINES" || !store.guideLinesVissible,
        }
      )}
    >
      <div
        className={clsx(
          "w-full p-1 max-h-screen  relative border-2 border-dashed rounded-2xl m-auto  text-2xl font-bold  text-white text-center",
          getMaxW
        )}
      >
        <div className="px-20 bg-opacity-50 bg-black border py-10 rounded-2xl">
          <img
            src="https://s2.svgbox.net/materialui.svg?ic=close&color=fff"
            role="button"
            className=" w-10 m-3 h-10 z-50 pointer-events-auto absolute right-0 top-0"
            alt=""
          />
          <div>{store.guideLines}</div>
        </div>
      </div>
    </div>
  );
}
