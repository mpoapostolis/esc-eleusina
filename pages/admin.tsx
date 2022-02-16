import type { NextPage } from "next";
import Menu from "../components/Menu";
import Ui from "../components/Ui";
import {
  Canvas,
  extend,
  useFrame,
  useLoader,
  useThree,
} from "@react-three/fiber";
import { Item, Scene, useStore } from "../store";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import {
  Html,
  OrbitControlsProps,
  TransformControls,
  useProgress,
} from "@react-three/drei";
import { Suspense, useRef, useState } from "react";
import { useGesture, useWheel } from "@use-gesture/react";
import { MathUtils, Raycaster, Sprite as SpriteType } from "three";
import AdminSettings from "../components/AdminSettings";

extend({ OrbitControls });

function Controls(props: { fov: number } & OrbitControlsProps) {
  const { camera, gl } = useThree();
  const ref = useRef<OrbitControlsProps>();
  useFrame((t) => {
    // @ts-ignore
    t.camera.fov = MathUtils.lerp(t.camera.fov, props.fov, 0.1);
    t.camera.updateProjectionMatrix();
    ref.current?.update && ref?.current?.update();
  });
  return (
    // @ts-ignore
    <orbitControls
      enableDamping
      ref={ref}
      target={[0, 0, 0]}
      makeDefault
      enableZoom={false}
      {...props}
      args={[camera, gl.domElement]}
    />
  );
}

function Sprite(props: Item) {
  const [move, setMove] = useState(false);
  const texture = useLoader(THREE.TextureLoader, props.src);
  const [drag, setDrag] = useState(false);
  const [fov, setFov] = useState(1);

  const ref = useRef<SpriteType>();
  const bind = useGesture({
    onDrag: (w) => {
      if (typeof window !== "undefined")
        window.document.body.style.cursor = "grab";
      setDrag(true);
    },
    onDragEnd: () => {
      if (typeof window !== "undefined")
        window.document.body.style.cursor = "auto";
      setDrag(false);
    },
    onWheel: (w) =>
      setFov((s) => {
        const n = Math.min(2, s + w.velocity[1] * w.direction[1]);
        if (n > 2) return 2;
        if (n < 0.5) return 0.5;
        return n;
      }),
  });

  useFrame((t) => {
    if (!ref.current) return;
    ref.current.scale.set(fov, fov, fov);
    if (!drag) return;
    ref.current.position.copy(t.camera.position);
    ref.current.rotation.copy(t.camera.rotation);
    ref.current.translateZ(-10);
    ref.current.translateX(t.viewport.width * t.mouse.x);
    ref.current.translateY(t.viewport.height * t.mouse.y);
    console.log(ref.current.position);
  });
  return (
    <sprite
      {...bind()}
      position={[0, 0, -10]}
      onClick={() => setMove(!move)}
      ref={ref}
    >
      <spriteMaterial attach="material" map={texture} />
    </sprite>
  );
}

function Environment() {
  const { scene } = useThree();
  const store = useStore();
  const texture = useLoader(THREE.TextureLoader, `/scenes/${store.scene}.jpg`);

  texture.mapping = THREE.EquirectangularReflectionMapping;
  scene.background = texture;
  return null;
}
function CustomLoader() {
  const { progress } = useProgress();
  return (
    <Html center>
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white"></div>
      <span style={{ color: "white" }}>{progress.toFixed(0)} % loaded</span>
    </Html>
  );
}

export type Conf = Record<Scene, Item[]>;
const _conf: Conf = {
  intro: [],
  elaiourgeio: [],
  teletourgeio: [],
  karnagio: [],
};

const Home: NextPage = () => {
  const [conf, _setConf] = useState(_conf);
  const store = useStore();
  const setConf = (item: Item[]) => {
    _setConf((s) => ({ ...s, [store.scene]: item }));
  };
  const setScene = (s: Scene) => store.setScene(s);
  return (
    <div className="canvas">
      <AdminSettings
        conf={conf}
        setConf={setConf}
        setScene={setScene}
        scene={store.scene}
      />
      <Canvas flat={true} linear={true} mode="concurrent">
        <Controls position={[0, 0, 0]} maxDistance={0.02} fov={75} />
        <Suspense fallback={<CustomLoader />}>
          {conf[store.scene].map((o) => (
            <Sprite key={o.name} {...o} />
          ))}
        </Suspense>

        <Suspense fallback={<CustomLoader />}>
          <Environment />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default Home;
