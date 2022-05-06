import clsx from "clsx";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { AllImage } from ".";
import { Img } from "../../pages/admin";
import { updateItem } from "../../queries/items";
import { Item, useStore } from "../../store";
import Popover from "../Popover";
import Select from "../Select";

export default function ItemSettings(props: {
  getItems: () => void;
  items: Item[];
  imgs: Img[];
}) {
  const store = useStore();
  const router = useRouter();
  const id = `${router.query.id}`;
  const idx = props.items.findIndex((e) => e._id === id);
  const selectedItem = { ...props.items[idx] };
  const sceneItems = props.items.filter((item) => store?.scene === item.scene);
  const [s, $S] = useState<Record<string, string>>({
    name: "",
    onClickTrigger: "",
    onClickOpenModal: "",
    setHint: "",
    setGuidelines: "",
    inventorySrc: "",
    collectableIfHandHas: "",
    onCollectFail: "",
  });

  useEffect(() => {
    const selectedItem = { ...props.items[idx] };
    const {
      name,
      onClickTrigger,
      onClickOpenModal,
      setHint,
      setGuidelines,
      inventorySrc,
      collectableIfHandHas,
      onCollectFail,
    } = selectedItem;
    setS({
      name,
      onClickTrigger,
      onClickOpenModal,
      setHint,
      setGuidelines,
      inventorySrc,
      collectableIfHandHas,
      onCollectFail,
    });
  }, [props.items, idx]);

  const setS = (y: Partial<Item>) => $S((s) => ({ ...s, ...y }));

  const idToSrc = (id?: string) =>
    props.items.find((e) => {
      return e._id === id;
    })?.src;

  const onBlur = (key: string) =>
    updateItem(id, {
      [key]: s[key],
    });

  return (
    <>
      <label className="block text-left text-xs font-medium mb-2 text-gray-200">
        Name
      </label>
      <input
        value={s.name}
        onBlur={() => onBlur("name")}
        onChange={(evt) => {
          setS({
            name: evt.currentTarget.value,
          });
        }}
        className="text-sm  bg-transparent w-full focus:outline-none h-10 p-2 border border-gray-600"
      ></input>
      <br />
      <label className="block text-left text-xs font-medium mb-2 text-gray-200">
        onClick trigger
      </label>
      <input
        value={s.onClickTrigger}
        onBlur={() => onBlur("onClickTrigger")}
        onChange={(evt) => {
          setS({
            onClickTrigger: evt.currentTarget.value,
          });
        }}
        className="text-sm  bg-transparent w-full focus:outline-none h-10 p-2 border border-gray-600"
      ></input>

      <br />

      <Select
        onChange={(v) => {
          updateItem(id, {
            onClickOpenModal: v.value as "hint" | "guidelines" | undefined,
          });
        }}
        value={s.onClickOpenModal}
        label="onClick open Guidelines or Hint"
        options={[undefined, "guidelines", "hint"].map((o) => ({
          label: o === undefined ? "-" : o,
          value: o === undefined ? null : o,
        }))}
      ></Select>
      <br />
      <label className="block text-left text-xs font-medium mb-2 text-gray-200">
        on click set Hint Text
      </label>
      <div>
        <textarea
          className="bg-transparent  w-full focus:outline-none p-2 border border-gray-600"
          rows={5}
          value={s.setHint}
          onBlur={() => onBlur("setHint")}
          onChange={(evt) => {
            setS({
              setHint: evt.currentTarget.value,
            });
          }}
        ></textarea>
      </div>
      <br />
      <label className="block text-left text-xs font-medium mb-2 text-gray-200">
        on click set Guidance text
      </label>
      <div>
        <textarea
          className="bg-transparent w-full focus:outline-none p-2 border border-gray-600"
          rows={5}
          onBlur={() => onBlur("setGuidelines")}
          value={s.setGuidelines}
          onChange={(evt) => {
            setS({
              setGuidelines: evt.currentTarget.value,
            });
          }}
        ></textarea>
      </div>

      {selectedItem.collectable && (
        <>
          <Popover
            label={
              <>
                <label className="block text-left text-xs font-medium mb-2 text-gray-200">
                  inventory image
                </label>
                <div className="border p-2 w-full  h-28 text-2xl  border-gray-700 flex items-center justify-center">
                  {selectedItem.inventorySrc ? (
                    <div>
                      <img
                        src={selectedItem.inventorySrc}
                        className="w-20 h-auto"
                      />
                    </div>
                  ) : (
                    "➕"
                  )}
                </div>
              </>
            }
          >
            <AllImage
              imgs={props.imgs}
              onClick={(o) => {
                updateItem(id, {
                  inventorySrc: o?.src ?? null,
                });
              }}
            />
          </Popover>
          <br />

          <Popover
            label={
              <>
                <label className="block text-left text-xs font-medium mb-2 text-gray-200">
                  Required tool to colect {selectedItem.name}
                </label>
                <div className="border w-full  h-28 p-4 text-2xl  border-gray-700 flex items-center justify-center">
                  {selectedItem.collectableIfHandHas ? (
                    <img
                      className="w-20 h-auto"
                      src={idToSrc(selectedItem.collectableIfHandHas)}
                    />
                  ) : (
                    "➕"
                  )}
                </div>
              </>
            }
          >
            <AllImage
              imgs={sceneItems}
              onClick={(o) => {
                updateItem(id, {
                  collectableIfHandHas: o?._id ?? null,
                });
              }}
            />
          </Popover>
          <br />

          <label className="block text-left text-xs font-medium mb-2 text-gray-200">
            Hint text when fail to collect (no required tool selected)
          </label>
          <div>
            <textarea
              value={s.onCollectFail}
              onBlur={() => onBlur("onCollectFail")}
              onChange={(evt) => {
                setS({
                  onCollectFail: evt.currentTarget.value,
                });
              }}
              className="bg-transparent  w-full focus:outline-none p-2 border border-gray-600"
              rows={5}
            ></textarea>
          </div>
        </>
      )}
    </>
  );
}
