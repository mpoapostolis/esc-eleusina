import { useStore } from "../../../store";
import { useEffect, useRef, useState } from "react";
import Img from "../Img";

import { loadSound } from "../../../utils";
import Portals from "../Portals";
import { helps } from "../HelpUiIcon";
import { descriptiveText } from "../DescriptiveText";
import { ancientText } from "../AncientText";
import { useTime } from "../..";
import { ReturnValue } from "use-timer/lib/types";

function Intro() {
  const store = useStore();
  const timer = useTime();
  const [openPortals, setOpenPortals] = useState(false);

  let start = loadSound("/sounds/start.ogg");

  useEffect(() => {
    setTimeout(() => {
      store.setDescriptiveText(descriptiveText.intro);
    }, 2000);
  }, []);

  useEffect(() => {
    if (timer.time === 540 && !openPortals) store.setHint(helps.intro);
  }, [timer, openPortals]);

  useEffect(() => {
    if (timer.time === 599 && timer.status === "RUNNING" && start.play) {
      start.play();
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
