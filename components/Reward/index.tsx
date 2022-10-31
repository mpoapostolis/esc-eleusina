import clsx from "clsx";
import { useStore } from "../../store";

const shadow = {
  WebkitTextStroke: "1px black",
};

export default function Reward() {
  const store = useStore();
  const getMaxW =
    (store.guideLines?.length ?? 100) > 450 ? "max-w-5xl" : "max-w-3xl";
  return (
    <div
      onClick={() => {
        store.setReward(null);
      }}
      className={clsx(
        "fixed  h-screen select-none  w-screen flex  pointer-events-auto  items-center  justify-center z-50",
        {
          hidden: store.status !== "REWARD",
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
          <h1 className=" text-2xl text-yellow-400">
            Συγχαρητήρια κέρδισες το έπαθλο του δωματίου
          </h1>
          <div className="divider"></div>
          <div className="bg-gray-300 bg-opacity-10 w-full h-full p-8 flex justify-center my-auto">
            <img className="w-full" src={store.reward?.src} />
          </div>
          <div className="mt-4" style={shadow}>
            {store.reward?.description}
          </div>
          {/* <div className="my-10 border-b border-white border-opacity-50 " /> */}
          <div className="divider"></div>
          <h1 className=" text-2xl mt-4 text-yellow-400">
            Συνέχισε τη διαδρομή σου
          </h1>
        </div>
      </div>
    </div>
  );
}
