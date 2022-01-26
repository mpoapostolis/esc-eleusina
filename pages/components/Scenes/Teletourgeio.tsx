import { useEffect, useState } from "react";
import { descriptiveText, helps, useStore } from "../../../store";
import Item from "../Item";
import Portals from "../Portals";

function Teletourgeio() {
  const store = useStore();
  const [box, setBox] = useState<string[]>([]);

  useEffect(() => {
    store.setHint("teletourgeio1");
    setTimeout(() => {
      store.setDescriptiveText(descriptiveText.teletourgeio);
    }, 2000);
  }, []);
  const items = ["doxeio1", "doxeio2", "dafni", "book"];
  const doIHaveAllItems = items.every(store.invHas);

  const openPortals = items
    .filter((e) => e !== "book")
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
  return (
    <group>
      <Item
        hideWhen={["scythe", "dafni"].some(store.invHas)}
        name="scythe"
        collectable
        selectable
        onCollectSucccess={() => store.setHint("teletourgeio2")}
        position={[20, -5, 0]}
      />

      <Item
        name="doxeio1"
        hideWhen={hideItem("doxeio1")}
        selectable
        collectable
        position={[-50, -50, 90]}
      />

      <Item
        name="box"
        opacity={1}
        hideWhen={!doIHaveAllItems && box.length < 1}
        onClick={() => {
          store.setIsHintVisible(false);
          if (!store.hand) return;
          const { hand } = store;
          if (hand !== "dafni" && !box.includes("dafni")) {
            store.setTmpHint("teletourgeioGrifosErr1");
            setBox((s) => [...s, hand]);
            store.setHand(undefined);
          } else {
            setBox((s) => [...s, hand]);
            store.removeInvItem(hand);
          }
        }}
        position={[-15, -5, 10]}
      />

      <Item
        name="doxeio2"
        hideWhen={hideItem("doxeio2")}
        collectable
        selectable
        position={[50, -50, -90]}
      />

      <Item
        name="emoji"
        onClick={() => {
          store.setTmpHint("notCollectable");
        }}
        position={[0, -50, -90]}
      />

      <Item
        name="dafni"
        hideWhen={hideItem("dafni")}
        selectable
        collectable={store.invHas("scythe") && store.hand === "scythe"}
        onCollectError={() => store.setTmpHint("teletourgeio1")}
        onCollectSucccess={() => {
          store.setHint("search");
          store.removeInvItem("scythe");
        }}
        position={[0, -20, -90]}
      />

      <Item
        collectable
        name="book"
        onCollectSucccess={() => {
          store.setDescriptiveText(
            descriptiveText["teletourgeioLogotexnikoKeimeno"]
          );
        }}
        hideWhen={hideItem("book")}
        position={[0, -20, 80]}
      />
      {openPortals && <Portals />}
    </group>
  );
}

Teletourgeio.getInitialProps = () => {
  const statusCode = 404;
  return { statusCode };
};

export default Teletourgeio;
