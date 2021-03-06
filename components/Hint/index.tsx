import clsx from "clsx";
import { motion } from "framer-motion";
import { useStore } from "../../store";

export default function Hint() {
  const transform = { transform: "skewX(-20deg)" };
  const shadow = {
    WebkitTextStroke: "1px black",
  };
  const store = useStore();

  const visible = store.isHintVisible && store.hint;

  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{
        translateX: visible ? 0 : 750,
        scale: visible ? 1 : 0,
        opacity: visible ? 1 : 0,
      }}
      transition={{
        duration: 0.35,
      }}
      className={clsx(
        "fixed w-full max-w-xl  right-0  mr-4   pointer-events-auto"
      )}
    >
      <div
        onClick={() => {
          store.setIsHintVisible(false);
        }}
        className="w-full p-10 cursor-pointer hover:cursor-zoom-out"
      >
        <div className=" relative  flex  tracking-wider italic  text-2xl font-bold text-white mb-1 justify-end w-full">
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
          <div className="text-white font-bold text-2xl">{store.hint}</div>
        </div>
        <hr className="border-dashed  border border-black w-3/4" />
      </div>
    </motion.div>
  );
}
