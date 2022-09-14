import clsx from "clsx";
import { motion } from "framer-motion";
import { useEffect } from "react";
import { useAchievements, useInventory } from "../../lib/inventory";
import { useMiniGames } from "../../lib/items";
import { useStore } from "../../store";
import { loadSound } from "../../utils";

const shadow = {
  WebkitTextStroke: "1px black",
};

export default function MiniGameModal() {
  const store = useStore();
  const { data: inventory } = useInventory();
  const { data: miniGames } = useMiniGames();
  const { data: achievements, isLoading } = useAchievements();
  const rewardModal = loadSound("/sounds/04_are_you_ready.wav");

  const invHas = (id?: string) => inventory.map((e) => e._id).includes(id);
  const [currMinigames] = miniGames.filter((e) => e.scene === store.scene);

  const doIHaveAchievement =
    isLoading ||
    achievements.map((e) => e._id).includes(`${currMinigames?.reward?._id}`);

  useEffect(() => {
    if (!currMinigames || doIHaveAchievement) return;
    if (currMinigames?.requiredItems?.map((i) => invHas(i)).every(Boolean)) {
      rewardModal.play();
      store.setStatus("MINIGAMEMODAL");
    }
  }, [miniGames, doIHaveAchievement, store.scene, inventory]);

  const getMaxW =
    (store.guideLines?.length ?? 100) > 450 ? "max-w-5xl" : "max-w-3xl";

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
