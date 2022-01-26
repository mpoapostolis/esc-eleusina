import { useEffect, useRef, useState } from "react";
import { descriptiveText, useStore } from "../../../store";
import { randomNum } from "../../../utils";
import Item, { ImgName } from "../Item";
import Portals from "../Portals";

const ranPos = [...Array(9)].map(() => [
  randomNum(-50, 50),
  randomNum(-40, 10),
  randomNum(-90, -50),
]);
function Karnagio() {
  const store = useStore();
  const [box, setBox] = useState<string[]>([]);
  useEffect(() => {
    store.setHint("teletourgeio1");
    setTimeout(() => {
      store.setDescriptiveText(descriptiveText.karnagio);
    }, 2000);
  }, []);
  const items: ImgName[] = [
    "case",
    "flower",
    "garbage",
    "key",
    "lingerie",
    "rock1",
    "rock",
    "wing1",
    "wing",
  ];
  const doIHaveAllItems = items.every(store.invHas);

  const openPortals = items
    .filter((e) => e !== "wing1")
    .every((e) => box.includes(e));

  useEffect(() => {
    if (doIHaveAllItems) {
      store.setHint("teletourgeioGrifos");
    }
  }, [doIHaveAllItems]);
  useEffect(() => {
    if (openPortals) {
      store.setTmpHint("portals");
      store.setHint("portals");
    }
  }, [openPortals]);

  const hideItem = (s: string) => store.invHas(s) || box.length > 0;
  const ref = useRef();
  return (
    <group>
      {items.map((name, idx) => (
        <Item
          name={name}
          key={name}
          collectable
          selectable
          hideWhen={hideItem(name)}
          // @ts-ignore
          position={ranPos[idx]}
        />
      ))}

      <Item
        name="box"
        opacity={1}
        hideWhen={!doIHaveAllItems && box.length < 1}
        onClick={() => {
          if (!store.hand) return;
          const { hand } = store;
          store.setIsHintVisible(false);
          if (hand === "wing1") {
            store.setTmpHint("karnagioXerouli1");
            store.setHand(undefined);
          } else {
            setBox((s) => [...s, hand]);
            store.removeInvItem(hand);
            store.setHand(undefined);
          }
        }}
        position={[-10, -10, -15]}
      />

      {openPortals && <Portals />}
    </group>
  );
}

Karnagio.getInitialProps = () => {
  const statusCode = 404;
  return { statusCode };
};

export default Karnagio;
