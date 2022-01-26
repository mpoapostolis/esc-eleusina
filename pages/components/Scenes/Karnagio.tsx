import { useEffect, useState } from "react";
import { descriptiveText, useStore } from "../../../store";
import Img from "../Img";
import Portals from "../Portals";

function Archeologikos() {
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
      <Img
        hideWhen={["scythe", "dafni"].some(store.invHas)}
        onClick={() => {
          store.setHint("teletourgeio2");
          store.setInventory({
            name: "scythe",
            action: () => {
              store.setHand("scythe");
            },
            src: "/images/scythe.png",
            description: ``,
          });
        }}
        position={[20, -5, 0]}
        src="/images/scythe.png"
      />

      <Img
        hideWhen={hideItem("doxeio1")}
        onClick={() => {
          store.setHint("teletourgeio2");

          store.setInventory({
            name: "doxeio1",
            action: () => store.setHand("doxeio1"),
            src: "https://img.icons8.com/ios/50/000000/wine-glass.png",
            description: ``,
          });
        }}
        position={[-50, -50, 90]}
        src="https://img.icons8.com/ios/50/000000/wine-glass.png"
      />

      <Img
        opacity={1}
        hideWhen={!doIHaveAllItems && box.length < 1}
        onClick={() => {
          store.setIsHintVisible(false);
          if (!store.hand) return;
          const { hand } = store;
          store.setHand(undefined);
          if (hand !== "dafni" && !box.includes("dafni")) {
            store.setTmpHint("teletourgeioGrifosErr1");
            setBox((s) => [...s, hand]);
          } else {
            setBox((s) => [...s, hand]);
            store.removeInvItem(hand);
          }
        }}
        position={[-15, -5, 10]}
        src="/images/woodenBox.png"
      />

      <Img
        hideWhen={hideItem("doxeio2")}
        onClick={() => {
          store.setInventory({
            name: "doxeio2",
            action: () => store.setHand("doxeio2"),
            src: "https://img.icons8.com/ios-glyphs/30/000000/vodka-shot.png",
            description: ``,
          });
        }}
        position={[50, -50, -90]}
        src="https://img.icons8.com/ios-glyphs/30/000000/vodka-shot.png"
      />

      <Img
        onClick={() => {
          store.setTmpHint("teletourgeio4");
        }}
        position={[0, -50, -90]}
        src="/images/emoji.png"
      />

      <Img
        hideWhen={hideItem("dafni")}
        onClick={() => {
          if (!store.invHas("scythe") || store.hand !== "scythe") {
            store.setTmpHint("teletourgeio1");
          } else {
            store.removeInvItem("scythe");
            store.setInventory({
              name: "dafni",
              action: () => store.setHand("dafni"),
              src: "https://img.icons8.com/office/40/000000/spa-flower.png",
              description: ``,
            });
          }
        }}
        position={[0, -20, -90]}
        src="https://img.icons8.com/office/40/000000/spa-flower.png"
      />

      <Img
        hideWhen={hideItem("book")}
        onClick={() => {
          store.setHint("teletourgeio2");
          store.setDescriptiveText(
            descriptiveText["teletourgeioLogotexnikoKeimeno"]
          );
          store.setInventory({
            name: "book",
            src: "https://img.icons8.com/ios/50/000000/open-book.png",
            action: () =>
              store.setDescriptiveText(
                descriptiveText["teletourgeioLogotexnikoKeimeno"]
              ),
            description: ``,
          });
        }}
        position={[0, -20, 80]}
        src="https://img.icons8.com/ios/50/000000/open-book.png"
      />
      {openPortals && <Portals />}
    </group>
  );
}

Archeologikos.getInitialProps = () => {
  const statusCode = 404;
  return { statusCode };
};

export default Archeologikos;
