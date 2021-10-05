import { useLoader } from "@react-three/fiber";
import { useStore } from "../../../store";
import Portal from "../Portal";
import * as THREE from "three";
import { useEffect, useState } from "react";
import { loadSound } from "../../../utils";

function Intro() {
  const store = useStore();
  const texture = useLoader(THREE.TextureLoader, "/images/stone.png");
  const [hoverd, setHovered] = useState(false);
  const dap = loadSound("/sounds/dap.ogg");

  useEffect(() => {
    if (store.timer === 55)
      store.setDialogue([
        "Ψάξε στο έδαφος για μία πέτρινη πλάκα",
        "Ανοίξε το inventory, διαβάσε τον Όρκο του Μύστη για να εμφανιστούν οι πύλες",
      ]);
  }, [store.timer]);

  return (
    <>
      {store.invHas("stone") && store.inventoryNotf.length === 0 && (
        <>
          <Portal
            onPointerLeave={() => {
              store.setDialogue([]);
            }}
            onPointerEnter={() => {
              store.setDialogue([
                `Η μάνα Γη 
                γερνάει 
                όταν χαθεί η Κόρη.`,
              ]);
            }}
            onClick={() => {
              store.setStage("archeologikos");
            }}
            src="archeologikos"
            position={[10, 0, 0]}
          />
          <Portal
            onPointerLeave={() => {
              store.setDialogue([]);
            }}
            onPointerEnter={() => {
              store.setDialogue([
                `Κι άξαφνα
                είδα ορθωμένα μπρος στα μάτια μου τα δυο κατάμαυρα άλογά του
                σαν τυφλωμένα απ’ το φως..`,
              ]);
            }}
            onClick={() => {
              store.setStage("elaioyrgeio");
            }}
            src="elaioyrgeio"
            position={[-10, 0, 0]}
          />
          <Portal
            onPointerLeave={() => {
              store.setDialogue([]);
            }}
            onPointerEnter={() => {
              store.setDialogue([
                `Τα ίδια μαύρα κουρελιασμένα σύννεφα
                να μπλέχουν στα κατάρτια τους...`,
              ]);
            }}
            onClick={() => {
              store.setStage("karavi");
            }}
            src="karavi"
            position={[0, 0, 10]}
          />
          <Portal
            onPointerLeave={() => {
              store.setDialogue([]);
            }}
            onPointerEnter={() => {
              store.setDialogue([
                `Όταν έπαιζε µε του Ωκεανού τις κόρες  στον τρυφερό λειµώνα..`,
              ]);
            }}
            onClick={() => {
              store.setStage("livadi");
            }}
            src="livadi"
            position={[0, 0, -10]}
          />
        </>
      )}
      {!store.invHas("stone") && (
        <mesh
          onPointerEnter={() => setHovered(true)}
          onPointerLeave={() => setHovered(false)}
          onClick={() => {
            if (dap.play) dap.play();
            store.setInventoryNotf("stone");
            store.setIntentory({
              name: "stone",
              src: "/images/stone.png",
              description: `Φως που σε λάτρεψα, όπως κάθε θνητός
              και συ τ’ ουρανού κλέος,
              γιατί μ’ αφήσατε; Τί σας έκανε
              να τραβηχτείτε από πάνω μου,
              για να παραδοθώ στου σκοταδιού την αφή;`,
            });
          }}
          position={[0, -15, -11]}
          scale={hoverd ? 1.2 : 1}
        >
          <planeBufferGeometry attach="geometry" args={[4, 7]} />
          <meshBasicMaterial attach="material" map={texture} transparent />
        </mesh>
      )}
    </>
  );
}

Intro.getInitialProps = () => {
  const statusCode = 404;
  return { statusCode };
};

export default Intro;
