import clsx from "clsx";
import { useRouter } from "next/router";
import { AllImage } from ".";
import { Img } from "../../pages/admin";
import { Item, useStore } from "../../store";
import Popover from "../Popover";
import Select from "../Select";

export default function ItemSettings(props: {
  getItems: () => void;
  items: Item[];
  imgs: Img[];
  update: (p: Partial<Item>) => void;
}) {
  const store = useStore();
  const router = useRouter();
  const id = router.query.id;
  const idx = props.items.findIndex((e) => e._id === id);
  const selectedItem = { ...props.items[idx] };
  const sceneItems = props.items.filter((item) => store?.scene === item.scene);

  const idToSrc = (id?: string) =>
    props.items.find((e) => {
      return e._id === id;
    })?.src;

  return (
    <>
      <label className="block text-left text-xs font-medium mb-2 text-gray-200">
        Name
      </label>
      <input
        value={selectedItem.name}
        onChange={(evt) => {
          props.update({
            name: evt.currentTarget.value,
          });
        }}
        className=" text-sm  bg-transparent w-full focus:outline-none h-10 p-2 border border-gray-600"
      ></input>
      <br />
      <label className="block text-left text-xs font-medium mb-2 text-gray-200">
        onClick trigger
      </label>
      <input
        value={selectedItem.onClickTrigger}
        onChange={(evt) => {
          props.update({
            onClickTrigger: evt.currentTarget.value,
          });
        }}
        className=" text-sm  bg-transparent w-full focus:outline-none h-10 p-2 border border-gray-600"
      ></input>

      <br />

      <Select
        onChange={(v) => {
          props.update({
            onClickOpenModal: v.value as "hint" | "guidelines" | undefined,
          });
        }}
        value={selectedItem.onClickOpenModal}
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
          value={selectedItem.setHint}
          onChange={(evt) => {
            props.update({
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
          className="bg-transparent  w-full focus:outline-none p-2 border border-gray-600"
          rows={5}
          value={selectedItem.setGuidelines}
          onChange={(evt) => {
            props.update({
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
                props.update({
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
                props.update({
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
              value={selectedItem.onCollectFail}
              onChange={(evt) => {
                props.update({
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
