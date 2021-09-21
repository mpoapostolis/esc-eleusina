import { useStore } from "../../../store";
import { loadSound } from "../../../utils";
import clsx from "clsx";

export default function GameOver() {
  const store = useStore();

  return (
    <div
      style={{ background: "#0008" }}
      className={clsx("h-screen absolute z-50 w-screen", {
        hidden: store.modal !== "gameOver",
      })}
    >
      <div className="w-full h-28">
        <h1 className="m-3 text-white text-5xl font-black">Stage 1</h1>
        <h1 className="m-3 text-white text font-black">Break the boxes</h1>
      </div>
      <hr className="opacity-50" />

      <div className="w-full my-auto h-3/5 rounded-3xl p-5 gap-x-4  md:max-w-sm mx-auto grid grid-cols-1 place-items-center">
        <div className="w-full h-full justify-end flex-col flex">
          <h1 className="text-white text-6xl font-black">Game over</h1>
          <h5 className="mt-4 text-base text-gray-300"></h5>
          <br />
          <br />
          <a
            onClick={() => {
              store.setStage(1);
              store.setTimer(60);
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
                src="https://s2.svgbox.net/materialui.svg?ic=refresh&color=fffc"
                alt="game over"
                width="32"
                height="32"
              />
              <span className="">Play again</span>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
}
