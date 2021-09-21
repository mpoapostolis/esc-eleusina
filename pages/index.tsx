import { Canvas, MeshProps, useFrame } from "@react-three/fiber";
import type { NextPage } from "next";
import Menu from "./components/Menu";
import { useStore } from "../store";
import Ui from "./components/Ui";
import GameOver from "./components/GameOver";
import { Suspense, useEffect, useRef, useState } from "react";
import {
  Environment,
  Html,
  OrbitControls,
  Sphere,
  useGLTF,
} from "@react-three/drei";
import { loadSound } from "../utils";
import clsx from "clsx";

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
      {...props}
      ref={ref}
      scale={active ? 1.5 : 1}
      onClick={(event) => {
        if (dap.play) dap.play();
        setActive(!active);
        props.openGate();
      }}
      onPointerOver={(event) => setHover(true)}
      onPointerOut={(event) => setHover(false)}
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={!active ? "green" : "orange"} />
    </mesh>
  );
}

function Gate(p: MeshProps) {
  const { scene } = useGLTF("/models/gate/scene.gltf");
  const r = useRef<any>();
  useEffect(() => {
    if (r.current) r.current.rotateY(0.14);
  }, [r]);
  return (
    <mesh {...p} ref={r} position={[0, 0, 2.5]}>
      <primitive object={scene} />;
    </mesh>
  );
}

function Key(p: MeshProps) {
  const { scene } = useGLTF("/models/key/scene.gltf");
  const [hidden, setHidden] = useState(false);
  const r = useRef<any>();
  useFrame(() => (r.current.rotation.y += 0.1));

  return (
    <mesh
      onClick={() => {
        setHidden(true);
      }}
      {...p}
      ref={r}
      position={[-2.0, -4.5, -5.25]}
      scale={hidden ? 0 : 10}
    >
      <primitive object={scene} />;
    </mesh>
  );
}

const Home: NextPage = () => {
  const store = useStore();
  const [gate, setOpenGate] = useState(false);
  const [scene, setScene] = useState<string>("castle");
  return (
    <div className="relative">
      <Menu />
      <GameOver />
      {store.stage > 0 && !store.modal && <Ui />}
      <Canvas>
        <pointLight position={[-2, 2, 1.25]} color="white" />
        <pointLight position={[-5, -5, -5]} />
        <Suspense fallback={<Html>loading..</Html>}>
          <Environment files={`/stages/${scene}.hdr`} background />
          {(gate || scene === "studio") && (
            <Gate
              onClick={() => setScene(scene === "castle" ? "studio" : "castle")}
            />
          )}
          {scene === "studio" && <Key />}
          <OrbitControls
            enableZoom={false}
            makeDefault
            maxDistance={0.1}
            enablePan={false}
          />
          {scene === "castle" && (
            <Box openGate={() => setOpenGate(!gate)} position={[0, 5, -15]} />
          )}
        </Suspense>
      </Canvas>
    </div>
  );
};

export default Home;
