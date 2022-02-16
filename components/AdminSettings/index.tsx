import { useState } from "react";
import { Conf } from "../../pages/admin";
import { Item, Scene, useStore } from "../../store";
import { images } from "../../utils";
import Popover from "../Popover";
import Select from "../Select";

export default function AdminSettings(props: {
  conf: Conf;
  setConf: (i: Item[]) => void;
  setScene: (s: Scene) => void;
  scene: Scene;
}) {
  return (
    <div className="fixed w-screen z-50 h-screen pointer-events-none bg-transparent">
      <div className="text-gray-300 absolute pointer-events-auto  right-0  border-l p-10 border-gray-600 bg-black bg-opacity-70 w-96 h-screen">
        <div className="w-full bg-opacity-20">
          <Select
            label="Scene"
            value={props.scene}
            onChange={(v) => props.setScene(v.value as Scene)}
            options={["Intro", "Karnagio", "Elaiourgeio"].map((addr) => ({
              label: addr,
              value: addr.toLocaleLowerCase(),
            }))}
          />
        </div>
        <hr className="my-5 opacity-50" />
        <div>
          {props.conf[props.scene].map((i, idx) => (
            <div
              role="button"
              className="flex hover:bg-white hover:bg-opacity-10 transition duration-100  items-center my-2"
            >
              <img className="w-10 p-1 mr-4 h-10" src={i.src} />
              <span>{i.name}</span>
            </div>
          ))}
          <br />

          <Popover
            label={
              <button className="w-full p-3 text-center bg-white bg-opacity-20">
                + Add Item
              </button>
            }
          >
            <div className="max-h-96 overflow-auto">
              {images.map((o) => (
                <div
                  onClick={() =>
                    props.setConf([
                      ...props.conf[props.scene],

                      {
                        name: o.name,
                        src: o.src,
                      },
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
        </div>
      </div>
    </div>
  );
}
