import { Canvas, useLoader } from "@react-three/fiber";
import type { NextPage } from "next";
import { Scene, useStore } from "../store";
import Ui from "./components/Ui";
import React, { Suspense, useEffect } from "react";
import { Html, OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import Scenes from "./components/Scenes";
import MiniGameOrder from "./components/MiniGameOrder";
import { useRouter } from "next/dist/client/router";
import Img from "./components/Img";
import { TextureLoader } from "three";
import Menu from "./components/Menu";

const Box = (props: { scene: Scene }) => {
  const px = useLoader(TextureLoader, `/scenes/${props.scene}/px.jpg`);
  const nx = useLoader(TextureLoader, `/scenes/${props.scene}/nx.jpg`);
  const py = useLoader(TextureLoader, `/scenes/${props.scene}/py.jpg`);
  const ny = useLoader(TextureLoader, `/scenes/${props.scene}/ny.jpg`);
  const pz = useLoader(TextureLoader, `/scenes/${props.scene}/pz.jpg`);
  const nz = useLoader(TextureLoader, `/scenes/${props.scene}/nz.jpg`);
  return (
    <mesh position={[0, 0, 0]} onPointerMove={console.log}>
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
  const { type } = router.query;
  useEffect(() => {
    router.push("/?type=menu");
  }, []);
  return (
    <div className="relative">
      {!type && <Ui />}
      <MiniGameOrder />
      <Menu />
      <div className="canvas">
        <Canvas frameloop="demand">
          <ambientLight position={[0, 40, 0]} color="#fff" />
          <OrbitControls
            maxDistance={0.00003}
            enableRotate
            makeDefault
            enablePan={false}
          />
          <Suspense fallback={<Html>loading...</Html>}>
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
            <Box scene={store.scene} />
            <Scenes />
          </Suspense>
        </Canvas>
      </div>
    </div>
  );
};

export default Home;
