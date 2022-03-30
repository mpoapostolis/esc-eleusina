import axios from "axios";
import clsx from "clsx";
import { useEffect, useState } from "react";
import { MiniGame } from "../../pages";
import { useStore } from "../../store";

const shadow = {
  WebkitTextStroke: "1px black",
};

export default function MiniGameModal() {
  const store = useStore();
  const [miniGames, setMiniGames] = useState<MiniGame>();

  const getMaxW =
    (store.guideLines?.length ?? 100) > 450 ? "max-w-5xl" : "max-w-3xl";

  const getMiniGames = async () =>
    axios.get("/api/miniGames").then((d) => {
      const [game] = d.data.filter((e: any) => e.scene === store.scene);
      setMiniGames(game);
    });

  useEffect(() => {
    getMiniGames();
  }, []);

  const accept = () => {
    switch (miniGames?.type) {
      case "jigsaw":
        store.setJigSaw(miniGames.jigSawUrl, miniGames.reward);
        break;

      case "compass":
        store.setCompass(true, miniGames.reward);
        break;

      case "lexigram":
        store.setLexigram(miniGames.lexigram.split(","), miniGames.reward);
        break;

      default:
        break;
    }
  };

  return (
    <div
      className={clsx(
        "fixed  h-screen w-screen flex  pointer-events-auto  items-center  justify-center z-50",
        {
          hidden: store.status !== "MINIGAMEMODAL",
        }
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
            Έχετε ολοκληρώσει τη πίστα, <br /> Άνοιγμα mini game
          </div>
          <div className="grid grid-cols-2 gap-x-4 mt-12">
            <button
              onClick={() => store.setStatus("RUNNING")}
              className="w-full bg-white border-dashed pb-4 hover:bg-opacity-10 bg-opacity-5 rounded py-3 flex items-center justify-center border-gray-700 border"
            >
              Άκυρο
            </button>
            <button
              onClick={() => accept()}
              className="w-full bg-white border-dashed pb-4 hover:bg-opacity-10 bg-opacity-5 rounded py-3 flex items-center justify-center border-gray-700 border"
            >
              Άνοιγμα
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
