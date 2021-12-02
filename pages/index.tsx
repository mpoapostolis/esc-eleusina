import { Canvas, useLoader } from "@react-three/fiber";
import type { NextPage } from "next";
import Menu from "./components/Menu";
import { useStore } from "../store";
import Ui from "./components/Ui";
import GameOver from "./components/GameOver";
import React, { Suspense } from "react";
import { Html, OrbitControls, useCubeTexture } from "@react-three/drei";
import Inventory from "./components/Inventory";
import * as THREE from "three";
import Scenes from "./components/Scenes";
import MiniGameOrder from "./components/MiniGameOrder";
import { useRouter } from "next/dist/client/router";
import Img from "./components/Img";

const Box = () => {
  const store = useStore();
  const [px, nx, py, ny, pz, nz] = useLoader(THREE.TextureLoader, [
    `/scenes/${store.stage}/px.png`,
    `/scenes/${store.stage}/nx.png`,
    `/scenes/${store.stage}/py.png`,
    `/scenes/${store.stage}/ny.png`,
    `/scenes/${store.stage}/pz.png`,
    `/scenes/${store.stage}/nz.png`,
  ]);
  if (store.stage === "jigSaw") return <mesh />;

  return (
    <mesh position={[0, 0, 0]}>
      <boxGeometry args={[200, 200, 200]} />
      <meshStandardMaterial
        attachArray="material"
        side={THREE.DoubleSide}
        map={px}
      />
      <meshStandardMaterial
        attachArray="material"
        side={THREE.DoubleSide}
        map={nx}
      />
      <meshStandardMaterial
        attachArray="material"
        side={THREE.DoubleSide}
        map={py}
      />
      <meshStandardMaterial
        attachArray="material"
        side={THREE.DoubleSide}
        map={ny}
      />
      <meshStandardMaterial
        attachArray="material"
        side={THREE.DoubleSide}
        map={pz}
      />
      <meshStandardMaterial
        attachArray="material"
        side={THREE.DoubleSide}
        map={nz}
      />
    </mesh>
  );
};

const Home: NextPage = () => {
  const store = useStore();
  const router = useRouter();
  return (
    <div className="relative">
      <Menu />
      <GameOver />
      <Inventory />
      {!store.modal && <Ui />}
      <MiniGameOrder />

      <div className="canvas">
        <Canvas>
          <color attach="background" args={["lightblue"]} />
          <ambientLight position={[0, 40, 0]} color="#fff" />
          <OrbitControls
            // autoRotate
            autoRotateSpeed={0.3}
            makeDefault
            maxDistance={0.000002}
            enablePan={false}
          />
          <Suspense fallback={<Html>loading..</Html>}>
            <Img
              onPointerDown={() => {
                router.push("/jigSaw");
              }}
              position={[0, 0, -35]}
              src="/images/jigSaw.png"
            />
            {store.stage !== "jigSaw" && <Box />}
            <Scenes />
          </Suspense>
        </Canvas>
      </div>
    </div>
  );
};

export default Home;
