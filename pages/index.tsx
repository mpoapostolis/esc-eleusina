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
import { useStore } from "../store";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import {
  Html,
  OrbitControlsProps,
  TransformControls,
  useProgress,
} from "@react-three/drei";
import { Suspense, useEffect, useRef, useState } from "react";
import { useGesture, useWheel } from "@use-gesture/react";
import { MathUtils, Raycaster, Sprite as SpriteType } from "three";
import { useRouter } from "next/router";

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

function Sprite(props: { pos: Pos }) {
  const [move, setMove] = useState(true);
  const texture = useLoader(THREE.TextureLoader, `/images/stone.png`);
  const ref = useRef<SpriteType>();
  const raycaster = new Raycaster();
  useFrame((t) => {
    if (!ref.current || !move) return;
    ref.current.position.copy(t.camera.position);
    ref.current.rotation.copy(t.camera.rotation);
    ref.current.translateZ(-10);
    ref.current.translateX(t.viewport.width * t.mouse.x);
    ref.current.translateY(t.viewport.height * t.mouse.y);
  });
  return (
    <sprite onClick={() => setMove(false)} ref={ref}>
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

type Pos = {
  clientX: number;
  clientY: number;
};

const Home: NextPage = () => {
  const [pos, setPos] = useState<Pos[]>([]);

  const router = useRouter();
  useEffect(() => {
    router.replace("/admin");
  }, []);
  const bind = useGesture({
    onDrag: (w) => {
      if (typeof window !== "undefined")
        window.document.body.style.cursor = "grab";
    },
    onDoubleClick: (evt) => {
      if (typeof window === "undefined") return;
      const pos = {
        clientX: evt.event.clientX,
        clientY: evt.event.clientY,
      };
      setPos((s) => [...s, pos]);
    },
    onDragEnd: () => {
      if (typeof window !== "undefined")
        window.document.body.style.cursor = "auto";
    },
    onWheel: (w) =>
      setFov((s) => {
        const n = Math.min(75, s + w.velocity[1] * w.direction[1]);
        if (n > 75) return 75;
        if (n < 40) return 40;
        return n;
      }),
  });

  const [fov, setFov] = useState(75);
  return (
    <div {...bind()}>
      <Ui time={30} />
      <Menu />
      <div className="canvas">
        <Canvas flat={true} linear={true} mode="concurrent">
          <Controls position={[0, 0, 0]} maxDistance={0.02} fov={fov} />
          <Suspense fallback={<CustomLoader />}>
            {pos.map((p, idx) => (
              <Sprite key={idx} pos={p} />
            ))}
          </Suspense>

          <Suspense fallback={<CustomLoader />}>
            <Environment />
          </Suspense>
        </Canvas>
      </div>
    </div>
  );
};

export default Home;
