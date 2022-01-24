import { useEffect, useState } from "react";
import { ReturnValue } from "use-timer/lib/types";
import { useTime } from "../..";
import { useStore } from "../../../store";
import { descriptiveText } from "../DescriptiveText";
import Img from "../Img";
import Portal from "../Portal";

function Archeologikos() {
  const store = useStore();
  const [showText, setShowText] = useState(false);
  useEffect(() => {
    setTimeout(() => {
      store.setDescriptiveText(descriptiveText.archeologikos);
    }, 2000);
  }, []);
  return (
    <group>
      {store.invHas("Αγέλαστος πέτρα") && (
        <>
          <Portal
            onClick={() => store.setScene("karavi")}
            src="karavi"
            position={[10, 0, 0]}
          />
          <Portal
            onClick={() => store.setScene("elaioyrgeio")}
            src="elaioyrgeio"
            position={[-10, 0, 0]}
          />
          <Portal
            onClick={() => store.setScene("intro")}
            src="intro"
            position={[0, 0, 10]}
          />
          <Portal
            onClick={() => store.setScene("livadi")}
            src="livadi"
            position={[0, 0, -10]}
          />
        </>
      )}
      <Img
        hightlightAfter={10}
        hideWhen={store.invHas("Αγέλαστος πέτρα") || store.invHas("stone")}
        src={`/images/stone.png`}
        onClick={() => {
          store.setInventoryNotf("stone");
          store.setInventory({
            name: "stone",
            src: "/images/stone.png",
            description: ``,
          });
        }}
        position={[2, -15, -20]}
      />

      <Img
        hideWhen={!showText}
        src={`/images/keimeno_1.png`}
        onClick={() => setShowText(true)}
        position={[32, 0, -20]}
        offsetScale={5}
        rotY={-1.0}
      />

      <Img
        hideWhen={showText}
        rotY={-1.0}
        offsetScale={3}
        src={`/images/info.png`}
        onClick={() => setShowText(true)}
        position={[32, 0, -20]}
      />

      <Img
        hightlightAfter={10}
        hideWhen={store.invHas("Αγέλαστος πέτρα") || store.invHas("alpha")}
        src={`/images/alpha.png`}
        onClick={() => {
          store.setInventoryNotf("alpha");
          store.setInventory({
            name: "alpha",
            src: "/images/alpha.png",
            description: ``,
          });
        }}
        position={[-10, -15, 99]}
      />
      <Img
        hightlightAfter={10}
        hideWhen={store.invHas("Αγέλαστος πέτρα") || store.invHas("emoji")}
        src={`/images/emoji.png`}
        onClick={() => {
          store.setInventoryNotf("emoji");
          store.setInventory({
            name: "emoji",
            src: "/images/emoji.png",
            description: ``,
          });
        }}
        rotate
        position={[-99, -15, 10]}
      />
      <Img
        hightlightAfter={10}
        hideWhen={store.invHas("Αγέλαστος πέτρα") || store.invHas("istos")}
        src={`/images/istos.png`}
        onClick={() => {
          store.setInventoryNotf("istos");
          store.setInventory({
            name: "istos",
            src: "/images/istos.png",
            description: ``,
          });
        }}
        position={[-10, -0, 10]}
      />
    </group>
  );
}

Archeologikos.getInitialProps = () => {
  const statusCode = 404;
  return { statusCode };
};

export default Archeologikos;
