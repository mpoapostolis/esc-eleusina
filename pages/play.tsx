import { Canvas, useLoader } from "@react-three/fiber";
import type { NextPage } from "next";
import Menu from "./components/Menu";
import { useStore } from "../store";
import Ui from "./components/Ui";
import GameOver from "./components/GameOver";
import React, { Suspense } from "react";
import { Html, OrbitControls } from "@react-three/drei";
import Inventory from "./components/Inventory";
import * as THREE from "three";
import Scenes from "./components/Scenes";
import MiniGameOrder from "./components/MiniGameOrder";
import { useRouter } from "next/dist/client/router";
import Img from "./components/Img";

const Box = () => {
  const store = useStore();
  const [px, nx, py, ny, pz, nz] = useLoader(THREE.TextureLoader, [
    `/scenes/${store.scene}/px.png`,
    `/scenes/${store.scene}/nx.png`,
    `/scenes/${store.scene}/py.png`,
    `/scenes/${store.scene}/ny.png`,
    `/scenes/${store.scene}/pz.png`,
    `/scenes/${store.scene}/nz.png`,
  ]);
  if (store.scene === "jigSaw") return <mesh />;

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
            {store.scene === "elaioyrgeio" && (
              <Img
                onPointerDown={() => {
                  router.push("/jigSaw");
                }}
                scale={0.5}
                position={[-20, -5, -5]}
                src="/images/jigSaw.png"
              />
            )}
            {store.scene !== "jigSaw" && <Box />}
            <Scenes />
          </Suspense>
        </Canvas>
      </div>
    </div>
  );
};

export default Home;
