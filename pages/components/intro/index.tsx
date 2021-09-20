import { Store, useStore } from "../../../store";
import { loadSound } from "../../../utils";

export default function Intro(props: React.HTMLProps<HTMLElement>) {
  const store = useStore();

  let start = loadSound("/sounds/start.ogg");

  return (
    <div
      style={{ background: "#0008" }}
      className="h-screen absolute z-50 w-screen"
    >
      <div className="w-full h-32">
        <h1 className="m-3 text-white text-5xl font-black">Stage 1</h1>
        <h1 className="m-3 text-white text font-black">Break the boxes</h1>
      </div>

      <div className="w-full my-auto h-3/5 rounded-3xl p-5 gap-x-4  md:max-w-sm mx-auto grid grid-cols-1 place-items-center">
        <div className="w-full h-full justify-center flex-col flex">
          <h1 className="text-white text-3xl font-black">Goal:</h1>

          <h5 className="mt-4 mb-10 text-base text-gray-300">
            -Hit & break the boxes
            <br />
            -Find the key
            <br />
            -Open the door
          </h5>

          <a
            onClick={() => {
              store.setStage(1);
              start.play();
            }}
            role="button"
            className={`w-full text-shadow  bg-gradient-to-tl  border
                          text-center flex justify-center items-center h-20 text-yellow-50
                          rounded-md transform transition text-lg 
                          hover:underline hover:bg-black duration-150 font-bold shadow-lg`}
          >
            <div className="flex items-center w-64 gap-x-2">
              <img
                className="w-10 mr-4"
                src="https://s2.svgbox.net/materialui.svg?ic=games&color=fffc"
                width="32"
                height="32"
              />
              <span>Start Game</span>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
}
