import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Item, useStore } from "../../store";
import Load from "../Load";
import Select from "../Select";

function Row(props: Item & { getItems: () => any }) {
  const [hint, setHint] = useState<string>();
  const [time, setTime] = useState<number>();
  const [deleteLoad, setDeleteLoad] = useState(false);
  const [load, setLoad] = useState(false);

  useEffect(() => {
    setHint(props.text);
    setTime(props.delayTimeHint);
  }, [props.items]);

  return (
    <div className="flex  items-end mb-4">
      <div className="mr-2 ">
        <label className="block text-left text-xs font-medium mb-2 text-gray-200">
          Hint
        </label>

        <input
          value={hint}
          onChange={(e) => setHint(e.currentTarget.value)}
          className="bg-transparent h-9  w-full text-sm focus:outline-none p-2 border border-gray-500"
        />
      </div>
      <div className="w-40">
        <Select
          value={`${time}`}
          onChange={(e) => setTime(+`${e.value}`)}
          label="Delay seconds"
          options={[5, 10, 15, 20, 25, 30, 60, 120, 240].map((x) => ({
            label: `${x}`,
            value: x,
          }))}
        />
      </div>
      <div className="grid  grid-cols-2 w-1/2 gap-x-1 ml-2">
        <button className="flex justify-center">
          {load ? (
            <Load />
          ) : (
            <img
              onClick={async () => {
                setLoad(true);
                await axios
                  .put(
                    `/api/items/${props._id}`,
                    JSON.stringify({
                      text: hint,
                      delayTimeHint: time,
                    }),
                    {
                      headers: {
                        "Content-Type": "application/json; charset=UTF-8",
                      },
                    }
                  )
                  .then(() => setLoad(false));
              }}
              src="https://s2.svgbox.net/materialui.svg?ic=save&color=777"
              width="26"
              height="26"
            />
          )}
        </button>
        <button
          className="flex justify-center"
          onClick={async () => {
            setDeleteLoad(true);
            await axios.delete(`/api/items/${props._id}`).then(() => {
              props.getItems();
              setDeleteLoad(false);
            });
          }}
        >
          {deleteLoad ? (
            <Load />
          ) : (
            <img
              src="https://s2.svgbox.net/materialui.svg?ic=delete&color=a88"
              width="26"
              height="26"
            />
          )}
        </button>
      </div>
    </div>
  );
}

export default function SceneSettings(props: {
  getItems: () => void;
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
        <h1 className="ml-3">Scene Settings</h1>
      </div>
      <hr className="my-5 opacity-20" />
      <div className="">
        <label className="block text-left text-xs font-medium mb-2 text-gray-200">
          Guidelines
        </label>
        <textarea
          value={guideLines}
          onChange={(evt) => setGuideLines(evt.currentTarget.value)}
          className="bg-transparent mb-4  w-full text-sm focus:outline-none p-2 border border-gray-600"
          rows={5}
        />
      </div>

      <button
        onClick={async () => {
          setLoadG(true);
          if (doIHaveGuideLines)
            await axios
              .put(
                `/api/items/${doIHaveGuideLines._id}`,
                JSON.stringify({ text: guideLines }),
                {
                  headers: {
                    "Content-Type": "application/json; charset=UTF-8",
                  },
                }
              )
              .then(() => {
                props.getItems();
                setLoadG(false);
              });
          else
            axios
              .post("/api/items", {
                scene: store.scene,
                type: "guidelines",
                text: guideLines,
              })
              .then(() => {
                props.getItems();
                setLoadG(false);
              });
        }}
        className="flex border py-2 border-gray-500 justify-center"
      >
        {loadG ? (
          <Load />
        ) : (
          <img
            src="https://s2.svgbox.net/materialui.svg?ic=save&color=777"
            width="26"
            height="26"
          />
        )}
      </button>
      <hr className="my-5 opacity-20" />

      {props.items
        .filter((e) => e.type === "timerHint")
        .map((e) => (
          <Row key={e._id} getItems={props.getItems} {...e} />
        ))}
      <button
        onClick={() => {
          setLoad(true);
          axios
            .post("/api/items", {
              scene: store.scene,
              type: "timerHint",
            })
            .then(() => {
              props.getItems();
              setLoad(false);
            });
        }}
        className="mt-auto flex items-center justify-center w-full px-3 py-2 text-center bg-white bg-opacity-20"
      >
        {load ? <Load /> : `+ Add Timer Hint`}
      </button>
    </div>
  );
}
