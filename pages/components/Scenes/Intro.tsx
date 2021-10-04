import { useLoader } from "@react-three/fiber";
import { useStore } from "../../../store";
import Portal from "../Portal";
import * as THREE from "three";
import { useContext, useState } from "react";
import { loadSound } from "../../../utils";

function Intro() {
  const store = useStore();
  const texture = useLoader(THREE.TextureLoader, "/images/stone.png");
  const [hoverd, setHovered] = useState(false);
  const dap = loadSound("/sounds/dap.ogg");
  console.log(store.inventory);
  return (
    <>
      <Portal
        onClick={() => store.setStage("archeologikos")}
        src="archeologikos"
        position={[10, 0, 0]}
      />
      <Portal
        onClick={() => store.setStage("elaioyrgeio")}
        src="elaioyrgeio"
        position={[-10, 0, 0]}
      />
      <Portal
        onClick={() => store.setStage("karavi")}
        src="karavi"
        position={[0, 0, 10]}
      />
      <Portal
        onClick={() => store.setStage("livadi")}
        src="livadi"
        position={[0, 0, -10]}
      />
      {!store.invHas("stone") && (
        <mesh
          onPointerEnter={() => setHovered(true)}
          onPointerLeave={() => setHovered(false)}
          onClick={() => {
            if (dap.play) dap.play();
            store.setInventoryNotf(1);
            store.setIntentory({
              name: "stone",
              src: "/images/stone.png",
            });
          }}
          position={[0, -10, -11]}
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
