import {
  Environment,
  Html,
  OrbitControls,
  SpotLight,
  useFBX,
} from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import type { NextPage } from "next";
import { Suspense, useEffect, useRef, useState } from "react";
import Menu from "./components/Menu";
import { useStore } from "../store";
import { loadSound } from "../utils";
import useKeyPress from "../Hooks/useKeyPress";
import Ui from "./components/Ui";
import clsx from "clsx";

function Key() {
  let fbx = useFBX("/models/key.FBX");
  return <primitive object={fbx} dispose={null} />;
}

function Box(p: any) {
  const store = useStore();

  const ref = useRef<any>();
  const [hovered, setHover] = useState(false);
  const [hp, setHp] = useState(3);
  useFrame((state, delta) => {
    ref.current.rotation.z += 0.01;
    ref.current.rotation.y += 0.01;
    ref.current.rotation.x += 0.01;
  });
  let dap = loadSound("/sounds/dap.ogg");
  return (
    <mesh
      ref={ref}
      scale={hp > 2 ? 1 : hp > 1 ? 0.75 : hp > 0 ? 0.5 : 0}
      position={[0, 0, -5]}
      onClick={(event) => {
        setHp(hp - 1);
        store.setStage(2);
        dap.play();
      }}
      {...p}
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial
        color={hp > 2 ? "greenyellow" : hp > 1 ? "orange" : "red"}
      />
    </mesh>
  );
}

const Home: NextPage = () => {
  const store = useStore();
  const openMenu = useKeyPress("Escape");

  return (
    <div className="relative">
      <Menu />
      {store.stage > 0 && !store.menu && <Ui />}
      <Canvas>
        <Suspense fallback={<Html>loading..</Html>}>
          <Environment files="/stages/castle.hdr" background />
          <OrbitControls />

          <Box />
          <Box position={[0, -5, 15]} />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default Home;
