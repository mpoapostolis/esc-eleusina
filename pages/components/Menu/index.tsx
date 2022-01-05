import { useStore } from "../../../store";
import { loadSound } from "../../../utils";
import clsx from "clsx";

export default function Menu() {
  const store = useStore();

  return (
    <div
      style={{ background: "#0008" }}
      className={clsx("h-full absolute z-50 w-screen", {
        hidden: store.modal !== "menu",
      })}
    >
      <div className="w-full h-20 p-3 ">
        <h1 className="text-white text-4xl font-black">{store.level}</h1>
        <h1 className="ml-1 text-white text-sm font-black">{store.scene}</h1>
      </div>
      <hr className="opacity-50" />

      <div className="w-full my-auto h-3/5 rounded-3xl p-5 gap-x-4  md:max-w-sm mx-auto grid grid-cols-1 place-items-center">
        <div className="w-full h-full justify-evenly flex-col flex">
          <div>
            <h1 className="text-white text-2xl font-black">Tips</h1>
            <h5 className="mt-4 mb-10 text-base text-gray-300">
              -Press &quot;esc&quot; to open menu
              <br />
              -Press &quot;i&quot; to open inventory
            </h5>
          </div>

          <a
            onClick={() => {
              store.setOpenModal(undefined);
            }}
            role="button"
            className={`w-full text-shadow  bg-gradient-to-tl  border
                          text-center flex justify-center items-center h-20 text-yellow-50
                          rounded-md transform transition text-lg 
                          hover:underline hover:bg-black duration-150 font-bold shadow-lg`}
          >
            <div className="flex items-center w-64 gap-x-2">
              <img
                className="w-10 mr-10"
                src="https://s2.svgbox.net/materialui.svg?ic=games&color=fffc"
                width="32"
                height="32"
              />
              <span className="">Resume</span>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
}
