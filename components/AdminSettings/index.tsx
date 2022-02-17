import { Conf } from "../../pages/admin";
import { Item, Scene, useStore } from "../../store";
import { images } from "../../utils";
import Popover from "../Popover";
import Select from "../Select";
import { v4 as uuidv4 } from "uuid";
import Details from "../Details";

export default function AdminSettings(props: {
  conf: Conf;
  setConf: (i: Item[]) => void;
  setScene: (s: Scene) => void;
  scene: Scene;
}) {
  const store = useStore();
  const items = props.conf[props.scene];

  const update = (p: Item) => {
    const idx = items.findIndex((i) => i.id === p.id);
    items[idx] = p;
    props.setConf(items);
  };

  return (
    <div className="fixed w-screen z-50 h-screen pointer-events-none bg-transparent">
      <div className="text-gray-300 overflow-auto absolute pointer-events-auto  right-0  border-l px-10 py-5 border-gray-600 bg-black bg-opacity-90 w-96 h-screen">
        <button className="w-full p-3 text-center bg-white bg-opacity-20">
          Save
        </button>
        <hr className="my-5 opacity-50" />

        <div className="w-full bg-opacity-20">
          <Select
            label=""
            value={props.scene}
            onChange={(v) => props.setScene(v.value as Scene)}
            options={["Intro", "Karnagio", "Elaiourgeio"].map((addr) => ({
              label: addr,
              value: addr.toLocaleLowerCase(),
            }))}
          />
        </div>
        <hr className="my-5 opacity-50" />
        <Popover
          label={
            <button className="w-full p-3 text-center bg-white bg-opacity-20">
              + Add Item
            </button>
          }
        >
          <div className="max-h-96 overflow-auto">
            {images.map((o, idx) => (
              <div
                key={idx}
                onClick={() =>
                  props.setConf([
                    {
                      id: uuidv4(),
                      scale: 1,
                      name: o.name,
                      src: o.src,
                    },
                    ...items,
                  ])
                }
                className="p-1 w-full  border-b border-gray-700 bg-black hover:bg-slate-800 flex"
              >
                <img alt="" className="w-10 p-1 mr-4 h-10" src={o.src} />
                {o.name}
              </div>
            ))}
          </div>
        </Popover>
        <br />
        <div>
          {items.map((i, idx) => (
            <Details summary={i.name} key={i.id}>
              <hr className="mt-1 mb-4 opacity-30" />
              <div className="flex  items-start my-2 text-xs">
                <div className=" flex cursor-pointer w-32 justify-center flex-col items-center bg-white bg-opacity-5 text-center p-2">
                  <img
                    onClick={() => store.setSelectItem(i)}
                    className="w-12 p-1  h-12"
                    src={i.src}
                  />
                  <span>{i.name}</span>
                </div>

                <div className="w-full px-4">
                  <div>
                    <label htmlFor="slider">Scale</label>
                    <input
                      min={0.2}
                      max={5}
                      step={0.5}
                      type="range"
                      onChange={(evt) => {
                        const value = +evt.target.value;
                        update({ ...i, scale: value });
                      }}
                      name=""
                      className="w-full"
                      id="slider"
                    />
                  </div>
                  <div className="flex mt-2">
                    <input
                      type="checkbox"
                      name=""
                      className="mr-2"
                      id="slider"
                    />
                    <label htmlFor="slider">Collectable</label>
                  </div>
                  <div className="flex">
                    <input
                      type="checkbox"
                      name=""
                      className="mr-2"
                      id="slider"
                    />
                    <label htmlFor="slider">Selectable</label>
                  </div>
                </div>

                <span
                  onClick={() => {
                    props.setConf(items.filter((e) => e.name !== i.name));
                  }}
                  role="button"
                  className="ml-auto w-4"
                  aria-label="close"
                >
                  ✖️
                </span>
              </div>
              <Select label="Collect when" options={[]}></Select>
              <br />
            </Details>
          ))}
        </div>
      </div>
    </div>
  );
}
