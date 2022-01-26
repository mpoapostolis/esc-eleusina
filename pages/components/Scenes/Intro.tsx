import { descriptiveText, helps, useStore } from "../../../store";
import { useEffect, useState } from "react";
import Item from "../Item";

import Portals from "../Portals";
import { ancientText } from "../AncientText";

function Intro() {
  const store = useStore();

  const [openPortals, setOpenPortals] = useState(false);

  useEffect(() => {
    store.setHint("intro1");
    setTimeout(() => {
      store.setDescriptiveText(descriptiveText.intro);
    }, 2000);
  }, []);

  useEffect(() => {
    if (store.invHas(`stone`)) {
      setOpenPortals(true);
      store.setHint("portals");
    }
  }, [store.inventory]);
  return (
    <>
      <Item
        name="stone"
        hideWhen={
          openPortals || store.invHas("stone") || store.invHas("Όρκο του Μύστη")
        }
        collectable
        onCollectSucccess={() => store.setAncientText(ancientText.intro1)}
        position={[-0, -35, -60]}
      />

      {store.invHas("stone") && <Portals />}
    </>
  );
}

Intro.getInitialProps = () => {
  const statusCode = 404;
  return { statusCode };
};

export default Intro;
