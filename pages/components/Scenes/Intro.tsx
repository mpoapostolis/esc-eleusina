import { useStore } from "../../../store";
import { useEffect, useRef, useState } from "react";
import Img from "../Img";

import { loadSound } from "../../../utils";
import { MeshProps } from "@react-three/fiber";
import { DoubleSide } from "three";

function Pl(p: MeshProps & { dims: [number, number] }) {
  const [hover, setHover] = useState(false);
  return (
    <mesh
      rotation={p.rotation}
      position={p.position}
      onPointerOver={() => {
        setHover(true);
        // p.onPointerOver(ref);
      }}
      onPointerLeave={() => {
        setHover(false);
        // p.onPointerOver(null);
      }}
    >
      <boxGeometry args={[...p.dims, 1]} />
      <meshPhongMaterial
        color="#ffff00"
        side={DoubleSide}
        opacity={hover ? 0.5 : 0}
        transparent
      />
    </mesh>
  );
}

const OrkosMisti = `Φως που σε λάτρεψα, όπως κάθε θνητός
και συ τ’ ουρανού κλέος,
γιατί μ’ αφήσατε; Τί σας έκανε
να τραβηχτείτε από πάνω μου,
για να παραδοθώ στου σκοταδιού την αφή;`;

function Intro() {
  const store = useStore();
  const [openPortals, setOpenPortals] = useState(false);
  const [hovered, setHover] = useState<any>(null);
  const selected = hovered ? [hovered] : undefined;

  let start = loadSound("/sounds/start.ogg");

  useEffect(() => {
    if (store.timer === 586 && !openPortals)
      store.setDialogue(["Ψάξε στο έδαφος για μία πέτρινη πλάκα"]);
  }, [store.timer, openPortals]);

  useEffect(() => {
    if (store.timer === 599 && start.play) {
      store.setTimer(600);
      start.play();
    }
  }, [start]);

  useEffect(() => {
    if (store.invHas(`Όρκο του Μύστη`)) setOpenPortals(true);
  }, []);

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
      <Pl
        rotation={[0, 0, 0.02]}
        dims={[7.5, 8.5]}
        position={[-0.45, 0.5, -14]}
      />
      <Pl rotation={[0, 0, -0.02]} dims={[6, 15]} position={[-25.5, 0, 35]} />
    </>
  );
}

Intro.getInitialProps = () => {
  const statusCode = 404;
  return { statusCode };
};

export default Intro;
