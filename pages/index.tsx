import { Canvas, MeshProps, useFrame } from "@react-three/fiber";
import type { NextPage } from "next";
import Menu from "./components/Menu";
import { useStore } from "../store";
import Ui from "./components/Ui";
import GameOver from "./components/GameOver";
import { Suspense, useEffect, useRef, useState } from "react";
import { Environment, Html, OrbitControls, useGLTF } from "@react-three/drei";
import { loadSound } from "../utils";
import Inventory from "./components/Inventory";

function Box(props: any) {
  const dap = loadSound("/sounds/dap.ogg");

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
      ref={ref}
      scale={props.scale ?? 2}
      onClick={(event) => {
        if (dap.play) dap.play();
        setActive(!active);
        props.openGate();
      }}
      onPointerOver={(event) => setHover(true)}
      onPointerOut={(event) => setHover(false)}
      {...props}
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={"green"} />
    </mesh>
  );
}

function Gate(p: MeshProps & { rotate: number }) {
  const { scene } = useGLTF("/models/gate/scene.gltf");
  let s = scene.clone();
  let r = useRef<any>();
  useFrame((state, delta) => {
    r.current.rotation.z += 0.003;
  });
  useEffect(() => {
    r.current.rotation.y = p.rotate;
  }, [r.current]);
  return (
    <mesh {...p} ref={r}>
      <primitive object={s} />;
    </mesh>
  );
}

const Home: NextPage = () => {
  const store = useStore();
  return (
    <div className="relative">
      <Menu />
      <GameOver />
      <Inventory />
      {store.stage > 0 && !store.modal && <Ui />}

      <div className="canvas">
        <Canvas>
          <pointLight position={[-2, 2, 1.25]} color="white" />
          <pointLight position={[-5, -5, -5]} />
          <OrbitControls
            enableZoom={false}
            makeDefault
            maxDistance={0.1}
            enablePan={false}
          />
          <Suspense fallback={<Html>loading..</Html>}>
            <Environment path="/scenes" preset="apartment" background />
            <Gate rotate={-20} position={[5, 0, -3.5]} />
            <Gate rotate={0} position={[0, 0, -5.5]} />
            <Gate rotate={20} position={[-5, -0, -3.5]} />
          </Suspense>
          <Box args={[10, 10, 10]}></Box>
        </Canvas>
      </div>
    </div>
  );
};

export default Home;
