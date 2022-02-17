import { Conf } from "../../pages/admin";
import { Item, Scene, scenes, useStore } from "../../store";
import { images } from "../../utils";
import Popover from "../Popover";
import Select from "../Select";
import { v4 as uuidv4 } from "uuid";
import { DetailedHTMLProps, InputHTMLAttributes, useState } from "react";
import Details from "../Details";
import Range from "../Range";

function Checkbox(
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

export default function AdminSettings(props: {
  conf: Conf;
  addPortal: () => void;
  setConf: (i: Item[]) => void;
  setScene: (s: Scene) => void;
  scene: Scene;
}) {
  const items = props.conf[props.scene];

  const update = (p: Item) => {
    const idx = items.findIndex((i) => i.id === p.id);
    items[idx] = p;
    props.setConf(items);
  };

  const [id, setId] = useState<string>();
  const selectedItem = items.find((i) => i.id === id);

  return (
    <div className="fixed w-screen z-50 h-screen pointer-events-none bg-transparent">
      <div className="text-gray-300 overflow-auto absolute pointer-events-auto  right-0  border-l px-10 py-5 border-gray-600 bg-black bg-opacity-90 w-96 h-screen">
        {selectedItem ? (
          <>
            <button
              onClick={() => setId(undefined)}
              className="w-full px-3 py-2 text-center bg-white bg-opacity-20"
            >
              Back
            </button>
            <hr className="my-5 opacity-50" />
            <div className="flex  items-start my-2 text-xs">
              <div className=" flex cursor-pointer w-32 justify-center flex-col items-center bg-white bg-opacity-5 text-center p-2">
                <img className="w-16 p-1  h-16" src={selectedItem.src} />
                <span>{selectedItem.name}</span>
              </div>

              <div className="w-full px-4">
                <Range
                  min={0.05}
                  max={1}
                  step={0.01}
                  onChange={(evt) => {
                    const value = +evt.target.value;
                    update({ ...selectedItem, scale: value });
                  }}
                  label="scale"
                />

                <Checkbox
                  label="Collectable"
                  checked={selectedItem.collectable}
                  onChange={(evt) => {
                    update({
                      ...selectedItem,
                      selectable: evt.target.checked
                        ? selectedItem.selectable
                        : false,
                      collectable: evt.target.checked,
                    });
                  }}
                />
                <div className="my-1" />
                <Checkbox
                  label="Selectable"
                  onChange={(evt) => {
                    update({
                      ...selectedItem,
                      collectable: evt.target.checked
                        ? true
                        : selectedItem.collectable,
                      selectable: evt.target.checked,
                    });
                  }}
                  checked={selectedItem.selectable}
                />
              </div>
            </div>
            <hr className="my-5 opacity-50" />

            <Select
              onChange={(v) => {
                update({
                  ...selectedItem,
                  goToScene: v.value as Scene,
                });
              }}
              value={selectedItem.goToScene}
              label="Portal go to Scene:"
              options={[undefined, ...scenes].map((o) => ({
                label: o === undefined ? "-" : o,
                value: o,
              }))}
            ></Select>
            <br />

            {selectedItem.collectable && (
              <>
                <Select
                  onChange={(v) => {
                    update({
                      ...selectedItem,
                      collectableIfHandHas: v.value as string,
                    });
                  }}
                  value={selectedItem.collectableIfHandHas}
                  label="Collect if hand keeps:"
                  options={images.map((img) => ({
                    label: img.name,
                    src: img.src,
                    value: img.name,
                  }))}
                ></Select>
                <br />
                <label className="block text-left text-xs font-medium mb-2 text-gray-200">
                  onCollect success hint{" "}
                </label>
                <textarea
                  className="bg-transparent w-full focus:outline-none p-2 border border-gray-600"
                  rows={5}
                ></textarea>

                <br />
                <br />
                <label className="block text-left text-xs font-medium mb-2 text-gray-200">
                  onCollect fail hint{" "}
                </label>
                <textarea
                  className="bg-transparent w-full focus:outline-none p-2 border border-gray-600"
                  rows={5}
                ></textarea>
              </>
            )}
            <hr className="my-5 opacity-50" />

            <label className="block mb-4 text-left text-xs font-medium text-gray-300">
              Hide if inventory missing:
            </label>
            <div className="grid gap-2 grid-cols-2">
              {images.map((i) => (
                <Checkbox key={i.name} className=" mr-2" label={i.name} />
              ))}
            </div>
          </>
        ) : (
          <>
            <button className="w-full px-3 py-2 text-center bg-white bg-opacity-20">
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
                <button className="w-full px-3 py-2 text-center bg-white bg-opacity-20">
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
                          scale: 0.5,
                          name: o.name,
                          src: o.src,
                        },
                        ...items,
                      ])
                    }
                    className="p-1 w-full  border-gray-700 bg-black hover:bg-slate-800 flex"
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
                <div key={i.id}>
                  <div className="flex  items-start my-2 text-xs">
                    <div className=" flex cursor-pointer w-32 justify-center flex-col items-center border border-opacity-20 border-gray-200  text-center p-2">
                      <img className="w-14 p-2  h-14" src={i.src} />
                      <span>{i.name}</span>
                    </div>

                    <div className="w-full px-4">
                      <div>
                        <Range
                          min={0.05}
                          max={1}
                          step={0.01}
                          onChange={(evt) => {
                            const value = +evt.target.value;
                            update({ ...i, scale: value });
                          }}
                          label="scale"
                        />
                      </div>
                      <button
                        onClick={() => setId(i.id)}
                        className="w-full px-3 py-2 text-center bg-white bg-opacity-5 border border-gray-500 border-opacity-5"
                      >
                        Edit
                      </button>
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
                  <hr className="my-5 opacity-50" />
                </div>
              ))}
            </div>
            <hr className="my-5 opacity-50" />

            <button
              onClick={() => props.addPortal()}
              className="w-full px-3 py-2 text-center bg-white bg-opacity-20"
            >
              + Add Portal
            </button>
          </>
        )}{" "}
      </div>
    </div>
  );
}
