import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import type { NextPage } from "next";
import { Scene, useStore } from "../store";
import Ui from "./components/Ui";
import React, { createContext, Suspense, useContext, useEffect } from "react";
import { Html, OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import Scenes from "./components/Scenes";
import { useRouter } from "next/dist/client/router";
import Item from "./components/Item";
import { TextureLoader } from "three";
import Menu from "./components/Menu";
import DescriptiveText from "./components/DescriptiveText";
import AncientText from "./components/AncientText";
import { useTimer } from "use-timer";
import { Status } from "use-timer/lib/types";
import Hand from "./components/Hand";

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

export const Time = createContext<{
  pause: () => void;
  reset: () => void;
  start: () => void;
  status: Status;
  time: number;
}>({
  pause: () => void 0,
  reset: () => void 0,
  start: () => void 0,
  status: "STOPPED",
  time: 600,
});

const Home: NextPage = () => {
  const store = useStore();
  const router = useRouter();
  const { type } = router.query;
  const timer = useTimer({
    initialTime: 600,
    timerType: "DECREMENTAL",
    step: 1,
  });

  useEffect(() => {
    router.replace("/?type=menu");
  }, []);

  useEffect(() => {
    if (router.query.type) timer.pause();
    else if (timer.status === "PAUSED" && !router.query.type) timer.start();
  }, [router.query]);

  return (
    <div className="relative">
      <Time.Provider value={timer}>
        {!type && !store.descriptiveText && !store.ancientText && <Ui />}
        <Menu />
        {!type && <DescriptiveText />}
        {!type && <AncientText />}
      </Time.Provider>

      <div className="canvas">
        <Canvas>
          <ambientLight position={[0, 40, 0]} color="#fff" />
          <OrbitControls
            maxDistance={0.00003}
            enableRotate
            makeDefault
            enablePan={false}
          />
          {store.hand && <Hand />}{" "}
          <Suspense fallback={<Html>loading...</Html>}>
            <Box scene={store.scene} />
            <Scenes />
          </Suspense>
        </Canvas>
      </div>
    </div>
  );
};

export const useTime = () => useContext(Time);

export default Home;
