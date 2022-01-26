import { useEffect, useState } from "react";
import { descriptiveText, helps, useStore } from "../../../store";
import Img from "../Img";

function Archeologikos() {
  const store = useStore();
  const [showText, setShowText] = useState(false);

  useEffect(() => {
    store.setHint("teletourgeio1");
    setTimeout(() => {
      store.setDescriptiveText(descriptiveText.teletourgeio);
    }, 2000);
  }, []);

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
        hideWhen={store.invHas("doxeio1")}
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
        hideWhen={store.invHas("doxeio2")}
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
          store.setIsHintVisible(true);
          store.setHint("teletourgeio4");
        }}
        position={[0, -50, -90]}
        src="/images/emoji.png"
      />

      <Img
        hideWhen={store.invHas("dafni")}
        onClick={() => {
          store.setHint("teletourgeio1");
          if (!store.invHas("scythe") || store.hand !== "scythe") {
            store.setIsHintVisible(true);
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
        hideWhen={store.invHas("book")}
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
    </group>
  );
}

Archeologikos.getInitialProps = () => {
  const statusCode = 404;
  return { statusCode };
};

export default Archeologikos;
