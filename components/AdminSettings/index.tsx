import { Conf, Img } from "../../pages/admin";
import { Item, Scene, scenes, useStore } from "../../store";
import Popover from "../Popover";
import Select from "../Select";
import { v4 as uuidv4 } from "uuid";
import { DetailedHTMLProps, InputHTMLAttributes, useEffect } from "react";
import { useRouter } from "next/router";
import SceneSettings from "./SceneSettings";
import SelectedItem from "./SelectedItem";
import { addItem, useItems, useLibrary } from "../../lib/items";
import useMutation from "../../Hooks/useMutation";
import { Reward } from "../../pages";

export function Checkbox(
  props: { label: string } & DetailedHTMLProps<
    InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  >
) {
  const id = uuidv4();
  return (
    <div className="flex items-center text-sm">
      <input
        type="checkbox"
        name=""
        className="checkbox mr-2 checkbox-xs"
        id={id}
        {...props}
      />
      <label htmlFor={id}>{props.label}</label>
    </div>
  );
}

export function AllImage(props: {
  imgs?: (Item | Img | Reward)[] | undefined;
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
        className="p-2 h-full  w-full justify-center items-center border  border-gray-700  bg-black hover:bg-slate-800 flex"
        onClick={() => props.onClick(null)}
      >
        ❌
      </button>
    </div>
  );
}

const Component = (props: {
  update: (p: Partial<Item>) => void;
  portal: boolean;
  setScene: (s: Scene) => void;
  scene: Scene;
}) => {
  const router = useRouter();
  const id = router.query.id;
  const type = router.query.type;
  const { data: items } = useItems();
  const { data: imgs } = useLibrary();

  const store = useStore();
  const [_addItem] = useMutation(addItem, [`/api/items?scene=${store.scene}`], {
    onSuccess: (d) => {
      router.push({
        query: {
          type: "selectedItem",
          id: d.id,
        },
      });
    },
  });

  useEffect(() => {
    if (id) router.push(`/admin?id=${id}&type=selectedItem`);
  }, [id]);

  switch (type) {
    case "scene":
      return (
        <SceneSettings
          update={props.update}
          // @ts-ignore
          items={items}
          imgs={imgs}
        />
      );
    case "selectedItem":
      return <SelectedItem />;

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
            className="btn"
          >
            Scene Settings
          </button>

          <hr className="my-5 opacity-20" />

          <div className="mb-4 grid grid-cols-4 gap-4">
            {items
              ?.filter((e) => !["hint", "guidelines"].includes(`${e.type}`))
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
          <Popover label={<button className="btn w-full">+ Add Item</button>}>
            <AllImage
              imgs={imgs}
              onClick={(id) => {
                _addItem({ scene: store.scene, imgId: `${id?._id}` });
              }}
            />
          </Popover>

          <button
            onClick={() => router.push("/admin?type=library")}
            className="mt-auto btn"
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
  update: (p: Partial<Item>) => void;
  portal: boolean;
  setScene: (s: Scene) => void;
  scene: Scene;
}) {
  return (
    <div className="fixed w-screen z-50 h-screen pointer-events-none bg-transparent">
      <div
        style={{ width: "460px" }}
        className="text-gray-300 flex flex-col overflow-auto absolute pointer-events-auto  right-0  border-l px-10 py-5 border-gray-600 bg-black bg-opacity-90  h-screen"
      >
        <Component {...props} />
      </div>
    </div>
  );
}
