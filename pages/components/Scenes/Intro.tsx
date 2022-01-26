import { descriptiveText, helps, useStore } from "../../../store";
import { useEffect, useState } from "react";
import Img from "../Img";

import Portals from "../Portals";
import { ancientText } from "../AncientText";
import { useRouter } from "next/dist/client/router";

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
      <Img
        hideWhen={
          openPortals || store.invHas("stone") || store.invHas("Όρκο του Μύστη")
        }
        src={`/images/stone.png`}
        onClick={() => {
          store.setAncientText(ancientText.intro1);
        }}
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
