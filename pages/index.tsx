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
import { Item, useStore } from "../store";
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
import axios from "axios";
import { _conf } from "./admin";

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
  const texture = useLoader(THREE.TextureLoader, props.src);
  const ref = useRef<SpriteType>();
  useEffect(() => {
    if (!ref.current || !props.position) return;
    ref.current.position.copy(props.position);
  }, [props.position, ref.current]);

  return (
    <sprite scale={props.scale} ref={ref}>
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

const Home: NextPage = () => {
  const [conf, _setConf] = useState(_conf);
  const store = useStore();
  const setConf = (items: Item[]) => {
    _setConf((s) => ({ ...s, [store.scene]: items }));
  };

  const router = useRouter();
  useEffect(() => {
    axios.get("/api/getConf", {}).then((d) => {
      _setConf(d.data.items);
    });
  }, []);

  const bind = useGesture({
    onWheel: (w) =>
      setFov((s) => {
        const n = Math.min(75, s + w.velocity[1] * w.direction[1]);
        if (n > 75) return 75;
        if (n < 40) return 40;
        return n;
      }),
  });
  const items = conf[store.scene];
  const [fov, setFov] = useState(75);
  return (
    <div {...bind()}>
      <Ui time={30} />
      <Menu />
      <div className="canvas">
        <Canvas flat={true} linear={true} mode="concurrent">
          <Controls position={[0, 0, 0]} maxDistance={0.02} fov={fov} />
          <Suspense fallback={<CustomLoader />}>
            {items.map((p, idx) => {
              const item = p as Item;
              return <Sprite key={p.id} {...item} />;
            })}
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
