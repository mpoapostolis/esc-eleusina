import { Canvas, useFrame } from "@react-three/fiber";
import type { NextPage } from "next";
import Menu from "./components/Menu";
import { useStore } from "../store";
import Ui from "./components/Ui";
import GameOver from "./components/GameOver";
import { Suspense, useRef, useState } from "react";
import { Environment, Html, OrbitControls } from "@react-three/drei";

function Box(props: any) {
  // This reference will give us direct access to the THREE.Mesh object
  const ref = useRef<any>();
  // Set up state for the hovered and active state
  const [hovered, setHover] = useState(false);
  const [active, setActive] = useState(false);
  // Subscribe this component to the render-loop, rotate the mesh every frame
  useFrame((state, delta) => (ref.current.rotation.x += 0.01));
  // Return the view, these are regular Threejs elements expressed in JSX
  return (
    <mesh
      {...props}
      ref={ref}
      scale={active ? 1.5 : 1}
      onClick={(event) => setActive(!active)}
      onPointerOver={(event) => setHover(true)}
      onPointerOut={(event) => setHover(false)}
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={hovered ? "hotpink" : "orange"} />
    </mesh>
  );
}

const Home: NextPage = () => {
  const store = useStore();

  return (
    <div className="relative">
      <Menu />
      <GameOver />
      {store.stage > 0 && !store.modal && <Ui />}
      <Canvas>
        <Suspense fallback={<Html>loading..</Html>}>
          <Environment files="/stages/castle.hdr" background />
          <OrbitControls enableZoom={false} makeDefault enablePan={false} />
          <Box />
          <Box position={[0, -5, 15]} />
        </Suspense>{" "}
      </Canvas>
    </div>
  );
};

export default Home;
