import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { AllImage } from ".";
import { Item, useStore } from "../../store";
import Load from "../Load";
import Popover from "../Popover";
import Select from "../Select";

export default function Minigame(props: {
  getItems: () => void;
  update: (p: Partial<Item>) => void;

  items: Item[];
}) {
  const store = useStore();
  const [load, setLoad] = useState(false);
  const [loadG, setLoadG] = useState(false);
  const router = useRouter();
  const [guideLines, setGuideLines] = useState<string>();
  const doIHaveGuideLines = props.items.find((e) => e.type === "guidelines");
  useEffect(() => {}, [doIHaveGuideLines]);

  useEffect(() => {
    const doIHaveGuideLines = props.items.find((e) => e.type === "guidelines");
    if (doIHaveGuideLines) setGuideLines(doIHaveGuideLines.text);
  }, [props.items]);

  return (
    <div className="flex flex-col h-screen">
      <div className="flex h-8  text-xl text-gray-400 w-full  font-bold">
        <button
          onClick={() =>
            router.push({
              query: {
                id: undefined,
              },
            })
          }
        >
          <img
            src="https://s2.svgbox.net/materialui.svg?ic=arrow_back&color=888"
            width="24"
            height="24"
          />
        </button>
        <h1 className="ml-3">Mini Game</h1>
      </div>
      <hr className="my-5 opacity-20" />

      <Select
        onChange={(v) => {
          props.update({
            type: v.value as string,
          });
        }}
        label="type"
        options={[undefined, "box", "compass", "jigsaw", "lexigram"].map(
          (o) => ({
            label: o === undefined ? "-" : o,
            value: o,
          })
        )}
      ></Select>
      <br />

      <Popover
        label={
          <>
            <label className="block text-left text-xs font-medium mb-2 text-gray-200">
              Reward
            </label>
            <div className="border relative p-2 w-full  h-28 text-2xl  border-gray-700 flex items-center justify-center">
              ➕
            </div>
          </>
        }
      >
        <AllImage
          imgs={props.items}
          onClick={(o) => {
            props.update({
              boxReward: o?._id ?? null,
            });
          }}
        />
      </Popover>
    </div>
  );
}
