import { useStore } from "../../../store";
import Portal from "../Portal";
import { Suspense, useEffect, useState } from "react";
import Img from "../Img";
import { Preload } from "@react-three/drei";

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

  return (
    <>
      <group>
        <Img
          hideWhen={!store.invHas("Όρκο του Μύστη")}
          forceScale={5}
          src={`/images/orkos.png`}
          onClick={() => setOpenPortals(true)}
          position={[-30, -15, -50]}
        />
        <Img
          hideWhen={
            openPortals ||
            store.invHas("stone") ||
            store.invHas("Όρκο του Μύστη")
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
      </group>
      {openPortals && (
        <Suspense fallback="...">
          <Preload all />
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
              store.setDialogue([]);
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
              store.setDialogue([]);
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
              store.setDialogue([]);
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
              store.setDialogue([]);
              store.setStage("livadi");
            }}
            src="livadi"
            position={[0, 0, -10]}
          />
        </Suspense>
      )}
    </>
  );
}

Intro.getInitialProps = () => {
  const statusCode = 404;
  return { statusCode };
};

export default Intro;
