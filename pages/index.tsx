import { Canvas, useLoader, useThree } from "@react-three/fiber";
import type { NextPage } from "next";
import Menu from "./components/Menu";
import { useStore } from "../store";
import Ui from "./components/Ui";
import GameOver from "./components/GameOver";
import React, {
  FunctionComponent,
  ReactChild,
  ReactNode,
  Suspense,
} from "react";
import { Html, OrbitControls } from "@react-three/drei";
import Inventory from "./components/Inventory";
import * as THREE from "three";
import Scenes from "./components/Scenes";

function Environment() {
  const store = useStore();
  const { scene } = useThree();
  const texture = useLoader(THREE.TextureLoader, `/scenes/${store.stage}.jpg`);

  texture.mapping = THREE.EquirectangularReflectionMapping;
  texture.encoding = THREE.sRGBEncoding;
  scene.background = texture;
  return null;
}

const Home: NextPage = () => {
  const store = useStore();
  return (
    <div className="relative">
      <Menu />
      <GameOver />
      <Inventory />
      {!store.modal && <Ui />}

      <div className="canvas">
        <Canvas>
          <ambientLight position={[0, 40, 0]} color="#fff" />

          <OrbitControls
            position={[0, 0, 0]}
            makeDefault
            maxDistance={0.4}
            enablePan={false}
          />
          <Suspense fallback={<Html>loading..</Html>}>
            <Environment />
            <Scenes />
          </Suspense>
        </Canvas>
      </div>
    </div>
  );
};

export default Home;
