import { useStore } from "../../../store";
import Portal from "../Portal";
import { EffectComposer, Outline } from "@react-three/postprocessing";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import Img from "../Img";
import { meshBounds, Preload } from "@react-three/drei";
import { useLoader } from "@react-three/fiber";
import { DoubleSide, TextureLoader } from "three";
import { SVGLoader } from "three-stdlib";
import Portals from "../Portals";

const OrkosMisti = `Φως που σε λάτρεψα, όπως κάθε θνητός
και συ τ’ ουρανού κλέος,
γιατί μ’ αφήσατε; Τί σας έκανε
να τραβηχτείτε από πάνω μου,
για να παραδοθώ στου σκοταδιού την αφή;`;

function Intro() {
  const store = useStore();
  const [openPortals, setOpenPortals] = useState(false);
  useEffect(() => {
    if (store.timer === 586 && !openPortals)
      store.setDialogue(["Ψάξε στο έδαφος για μία πέτρινη πλάκα"]);
  }, [store.timer, openPortals]);

  useEffect(() => {
    if (store.invHas(`Όρκο του Μύστη`)) setOpenPortals(true);
  }, []);
  const { paths } = useLoader(SVGLoader, "/svg/12_TEXTBOX02.svg");
  const ref = useRef();

  return (
    <>
      <Img
        hideWhen={!store.invHas("Όρκο του Μύστη")}
        forceScale={5}
        src={`/images/orkos.png`}
        onClick={() => setOpenPortals(true)}
        position={[-14, -2, -15]}
      />
      <Img
        hideWhen={
          openPortals || store.invHas("stone") || store.invHas("Όρκο του Μύστη")
        }
        src={`/images/stone.png`}
        onClick={() => {
          store.setInventoryNotf("stone");
          store.setIntentory({
            name: "stone",
            src: "/images/stone.png",
            description: OrkosMisti,
            action: () => {
              store.setIntentory({
                name: "Όρκο του Μύστη",
                description: OrkosMisti,
                src: "/images/orkos.png",
              });
              store.removeInvItem("stone");
            },
          });
          setTimeout(() => {
            store.setDialogue([
              `Άνοιξε το inventory και διάβασε τον όρκο του Μύστη για να εμφανιστούν οι πύλες`,
            ]);
          }, 2000);
        }}
        position={[-0, -35, -60]}
      />
      {openPortals && <Portals />}
    </>
  );
}

Intro.getInitialProps = () => {
  const statusCode = 404;
  return { statusCode };
};

export default Intro;
