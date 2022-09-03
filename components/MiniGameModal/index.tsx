import clsx from "clsx";
import { motion } from "framer-motion";
import { getMiniGames } from "../../lib/items";
import { useStore } from "../../store";

const shadow = {
  WebkitTextStroke: "1px black",
};

export default function MiniGameModal() {
  const store = useStore();

  const getMaxW =
    (store.guideLines?.length ?? 100) > 450 ? "max-w-5xl" : "max-w-3xl";

  const { data: miniGames } = getMiniGames();
  const [miniGame] = miniGames.filter((e: any) => e.scene === store.scene);
  const accept = () => {
    switch (miniGame?.type) {
      case "jigsaw":
        store.setJigSaw(miniGame.jigSawUrl, miniGame.reward);
        break;

      case "compass":
        store.setCompass(true, miniGame.reward);
        break;

      case "lexigram":
        store.setLexigram(miniGame?.lexigram?.split(","), miniGame.reward);
        break;

      default:
        break;
    }
  };
  const isOpen = store.status === "MINIGAMEMODAL";
  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{
        translateY: isOpen ? 0 : 250,
        scale: isOpen ? 1 : 0,
        opacity: isOpen ? 1 : 0,
      }}
      transition={{
        duration: 0.35,
      }}
      className={clsx(
        { hidden: !isOpen },
        "fixed  h-screen w-screen flex pointer-events-auto  items-center  justify-center z-50"
      )}
    >
      <div
        className={clsx(
          "w-full p-1 max-h-screen  relative border-2 border-dashed rounded-2xl m-auto  text-3xl font-bold  text-white text-center",
          getMaxW
        )}
      >
        <div className="px-20 bg-opacity-80 bg-black border py-10 rounded-2xl">
          <div style={shadow}>
            Έχετε ολοκληρώσει τη πίστα, <br /> Θα παίξεις το γρίφο;
          </div>
          <div className="grid grid-cols-2 gap-x-4 mt-12">
            <button
              onClick={() => store.setStatus("RUNNING")}
              className="w-full bg-white border-dashed pb-4 hover:bg-opacity-10 bg-opacity-5 rounded py-3 flex items-center justify-center border-gray-700 border"
            >
              Όχι!
            </button>
            <button
              onClick={() => {
                accept();
              }}
              className="w-full bg-white border-dashed pb-4 hover:bg-opacity-10 bg-opacity-5 rounded py-3 flex items-center justify-center border-gray-700 border"
            >
              Ναί!!!
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
