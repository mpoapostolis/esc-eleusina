import {
  Box,
  Environment,
  Html,
  OrbitControls,
  useFBX,
} from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import type { NextPage } from "next";
import { Suspense } from "react";
import Intro from "./components/intro";
import { useStore } from "../store";
import { loadSound } from "../utils";
import useKeyPress from "../Hooks/useKeyPress";
import Ui from "./components/Ui";

function Key() {
  let fbx = useFBX("/models/key.FBX");
  return <primitive object={fbx} dispose={null} />;
}

const Home: NextPage = () => {
  const store = useStore();

  let dap = loadSound("/sounds/dap.ogg");
  return (
    <div className="relative">
      {store.stage < 1 && <Intro />}
      {/* <Ui /> */}
      <Canvas>
        <Suspense fallback={<Html>loading..</Html>}>
          <ambientLight color="red" />
          <Environment files="/stages/castle.hdr" background />
          <OrbitControls />
          <Box
            onClick={() => dap.play()}
            args={[5, 5, 5]}
            rotateX={3}
            position={[0, -20, -30]}
          />

          <Box
            onClick={() => dap.play()}
            args={[5, 5, 5]}
            rotateX={3}
            position={[0, 20, -30]}
          />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default Home;
