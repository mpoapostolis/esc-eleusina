import { Conf, Img } from "../../pages/admin";
import { Item, Scene, scenes, useStore } from "../../store";
import Popover from "../Popover";
import Select from "../Select";
import { v4 as uuidv4 } from "uuid";
import { DetailedHTMLProps, InputHTMLAttributes } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import SceneSettings from "./SceneSettings";
import SelectedItem from "./SelectedItem";

export function Checkbox(
  props: { label: string } & DetailedHTMLProps<
    InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  >
) {
  const id = uuidv4();
  return (
    <div className="flex items-center text-sm">
      <input type="checkbox" name="" className="mr-2" id={id} {...props} />
      <label htmlFor={id}>{props.label}</label>
    </div>
  );
}

export function AllImage(props: {
  imgs?: (Item | Img)[];
  onClick: (e?: Item | Img | null) => void;
}) {
  return (
    <div className="max-h-96 grid p-4 gap-4 bg-black grid-cols-4 items-center overflow-auto">
      {props.imgs?.map((o, idx) => (
        <div
          key={o._id}
          onClick={() => {
            props.onClick(o);
          }}
          className="p-2 pb-6 h-full hover:scale-120 w-full relative justify-center items-center border  border-gray-700  bg-black hover:bg-slate-800 flex"
        >
          <img className=" cursor-pointer w-full" src={o.src} />
          <span className="text-xs absolute bottom-0">{o.name}</span>
        </div>
      ))}
      <button
        className="p-2 h-full hover:scale-150 w-full justify-center items-center border  border-gray-700  bg-black hover:bg-slate-800 flex"
        onClick={() => props.onClick(null)}
      >
        ✖️
      </button>
    </div>
  );
}

const Component = (props: {
  items: Item[];
  imgs: Img[];
  getItems: () => void;
  update: (p: Partial<Item>) => void;
  portal: boolean;
  setScene: (s: Scene) => void;
  scene: Scene;
}) => {
  const router = useRouter();
  const id = router.query.id;
  const type = router.query.type;

  const store = useStore();
  const sceneItems = props.items.filter((item) => store?.scene === item.scene);

  switch (type) {
    case "scene":
      return <SceneSettings getItems={props.getItems} items={sceneItems} />;
    case "selectedItem":
      return (
        <SelectedItem
          getItems={props.getItems}
          imgs={props.imgs}
          items={props.items}
          update={props.update}
        />
      );

    default:
      return (
        <>
          <div className="h-8  text-xl text-gray-400 w-full  font-bold">
            <h1>General Settings</h1>
          </div>
          <hr className="my-5 opacity-20" />
          <div className="w-full bg-opacity-20">
            <Select
              label=""
              value={props.scene}
              onChange={(v) => props.setScene(v.value as Scene)}
              options={scenes.map((addr) => ({
                label: addr,
                value: addr.toLocaleLowerCase(),
              }))}
            />
          </div>
          <div className="my-2" />

          <button
            onClick={() =>
              router.push({
                query: {
                  type: "scene",
                },
              })
            }
            className="w-full mb-2 px-3 py-2 text-center bg-white bg-opacity-20"
          >
            Scene Settings
          </button>
          <hr className="my-5 opacity-20" />

          <div className="mb-4 grid grid-cols-3 gap-4">
            {props.items
              ?.filter(
                (e) => !["timerHint", "guidelines"].includes(`${e.type}`)
              )
              ?.map((i, idx) => {
                return (
                  <div
                    className="relative"
                    key={idx}
                    onClick={() =>
                      router.push({
                        query: {
                          type: "selectedItem",
                          id: i._id,
                        },
                      })
                    }
                  >
                    <img
                      className="w-full  text-xs cursor-pointer
                        flex justify-center flex-col items-center 
                        border border-opacity-20 border-gray-200  text-center p-6"
                      src={i.src}
                    />
                    <div className="text-white absolute bottom-0 text-xs text-center  w-full bg-black bg-opacity-30">
                      {i.name}
                    </div>
                  </div>
                );
              })}
          </div>
          <Popover
            label={
              <button className="w-full px-3 py-2 text-center bg-white bg-opacity-20">
                + Add Item
              </button>
            }
          >
            <AllImage
              imgs={props.imgs}
              onClick={(id) => {
                axios
                  .post("/api/items", {
                    scene: store.scene,
                    imgId: id?._id,
                    scale: 0.5,
                  })
                  .then((d) => {
                    props.getItems();
                    router.push({
                      query: {
                        type: "selectedItem",
                        id: d.data.id,
                      },
                    });
                  });
              }}
            />
          </Popover>
          <button
            onClick={() => router.push("/admin?type=library")}
            className="mt-auto w-full px-3 py-2 text-center bg-white bg-opacity-20"
          >
            library
          </button>
        </>
      );
  }
};

export default function AdminSettings(props: {
  items: Item[];
  imgs: Img[];
  getItems: () => void;
  update: (p: Partial<Item>) => void;
  portal: boolean;
  setScene: (s: Scene) => void;
  scene: Scene;
}) {
  return (
    <div className="fixed w-screen z-50 h-screen pointer-events-none bg-transparent">
      <div className="text-gray-300 flex flex-col overflow-auto absolute pointer-events-auto  right-0  border-l px-10 py-5 border-gray-600 bg-black bg-opacity-90 w-96 h-screen">
        <Component {...props} />
      </div>
    </div>
  );
}
