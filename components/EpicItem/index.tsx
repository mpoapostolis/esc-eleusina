import clsx from "clsx";
import { useStore } from "../../store";

const shadow = {
  WebkitTextStroke: "1px black",
};

export default function EpicItem() {
  const store = useStore();

  const getMaxW =
    (store.guideLines?.length ?? 100) > 450 ? "max-w-5xl" : "max-w-3xl";
  return (
    <div
      onClick={() => {
        store.setEpicItem(undefined);
      }}
      className={clsx(
        "fixed  h-screen w-screen flex  pointer-events-auto  items-center  justify-center z-50",
        {
          hidden: store.status !== "EPIC_ITEM" || !store.epicItem,
        }
      )}
    >
      <div
        className={clsx(
          "w-full p-1 max-h-screen  relative border-2 border-dashed rounded-2xl m-auto  text-3xl font-bold  text-white text-center",
          getMaxW
        )}
      >
        <div className="px-20 bg-opacity-80 bg-black border  py-10 rounded-2xl">
          <div className="bg-gray-300 bg-opacity-10 w-full h-full p-8 flex justify-center my-auto">
            <img src={store.epicItem?.src} />
          </div>
          <div className="mt-8" style={shadow}>
            {store.epicItem?.description}
          </div>
        </div>
      </div>
    </div>
  );
}
