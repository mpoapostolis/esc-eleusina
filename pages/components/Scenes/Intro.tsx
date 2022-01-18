import { useStore } from "../../../store";
import { useEffect, useRef, useState } from "react";
import Img from "../Img";

import { loadSound } from "../../../utils";
import Portals from "../Portals";
import { helps } from "../HelpUiIcon";
import { descriptiveText } from "../DescriptiveText";
import { ancientText } from "../AncientText";

function Intro() {
  const store = useStore();
  const [openPortals, setOpenPortals] = useState(false);

  let start = loadSound("/sounds/start.ogg");

  useEffect(() => {
    if (store.timer === 540 && !openPortals) store.setHint(helps.intro);
  }, [store.timer, openPortals]);

  useEffect(() => {
    if (store.timer === 598 && !store.descriptiveText)
      store.setDescriptiveText(descriptiveText.intro1);
  }, [store.timer, store.descriptiveText]);

  useEffect(() => {
    if (store.timer === 599 && start.play) {
      store.setTimer(600);
      start.play();
    }
    if (store.timer === 598) {
    }
  }, [start]);

  useEffect(() => {
    if (store.invHas(`stone`)) setOpenPortals(true);
  }, []);

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
