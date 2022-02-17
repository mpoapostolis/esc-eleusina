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
import { useStore as xx } from "@react-three/fiber";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import {
  Circle,
  Html,
  Line,
  meshBounds,
  OrbitControlsProps,
  Plane,
  Polyhedron,
  Tetrahedron,
  TransformControls,
  useCamera,
  useProgress,
} from "@react-three/drei";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { useGesture, useWheel } from "@use-gesture/react";
import {
  BackSide,
  BufferAttribute,
  BufferGeometry,
  BufferGeometryLoader,
  DoubleSide,
  Euler,
  EdgesGeometry,
  MathUtils,
  Mesh,
  Raycaster,
  Shape,
  ShapeGeometry,
  Sprite as SpriteType,
  Vector3,
} from "three";
import AdminSettings from "../components/AdminSettings";
import { Line2 } from "three/examples/jsm/lines/Line2";
import { LineGeometry } from "three/examples/jsm/lines/LineGeometry";

extend({ OrbitControls });

function Controls(props: { fov: number } & OrbitControlsProps) {
  const store = useStore();
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
  const [drag, setDrag] = useState(true);
  const ref = useRef<SpriteType>();
  useFrame((t) => {
    if (!ref.current) return;
    if (drag) ref.current.position.copy(t.raycaster.ray.direction);
    ref.current.rotation.copy(t.camera.rotation);
    ref.current.scale.set(props.scale, props.scale, props.scale);
  });
  return (
    <sprite onDoubleClick={() => setDrag(!drag)} scale={props.scale} ref={ref}>
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

const Svg = (p: { addPortal: boolean }) => {
  const [points, setPoints] = useState<{ x: number; y: number }[]>([]);
  // const [position, setPosition] = useState<Vector3>(new Vector3(0, 0, -1));
  // const [rotation, setRotation] = useState<Euler>(new Euler(0, 0, 0));

  const [position, setPosition] = useState<Vector3>();
  const [rotation, setRotation] = useState<Euler>();

  const shape = new Shape();
  // shape.moveTo(0, 0);
  // shape.lineTo(0, 1);
  // shape.lineTo(1, 1);
  // shape.lineTo(1, 0);
  // shape.lineTo(0, 0);
  points.forEach((p, idx) => {
    if (!p) return;
    if (idx === 0) shape.moveTo(p.x, p.y);
    else shape.lineTo(p.x, p.y);
  });
  const ref = useRef<Mesh>();
  const planeRef = useRef<Mesh>();
  useFrame((t) => {
    if (!ref.current) return;
    ref.current.position.copy(t.camera.position);
    ref.current.rotation.copy(t.camera.rotation);
    if (!planeRef.current) return;

    planeRef.current.position.copy(t.camera.position);
    planeRef.current.rotation.copy(t.camera.rotation);
    planeRef.current.translateZ(-1);
  });
  const t = useThree();
  return (
    <group
      raycast={meshBounds}
      onDoubleClick={(e) => {
        if (!position || !rotation) {
          const v3 = new Vector3();
          const e3 = new Euler();
          setPosition(v3.copy(e.ray.direction));
          setRotation(e3.copy(e.camera.rotation));
        }
      }}
    >
      <Circle ref={ref} args={[0.025]} />
      {position && rotation && (
        <mesh
          onPointerMove={(e) => {
            if (!planeRef.current) return;
            const x = e.point.x - planeRef.current?.position.x;
            const y = e.point?.y - planeRef.current?.position.y;
            console.log(
              planeRef.current.position.x,
              planeRef.current.rotation.y
            );
            if (x && y)
              setPoints((s) => [
                ...s,
                {
                  x,
                  y,
                },
              ]);
          }}
          ref={planeRef}
        >
          <planeGeometry
            args={[t.viewport.width / 5, t.viewport.height / 5, 10, 10]}
          />
          <meshBasicMaterial
            side={DoubleSide}
            wireframe
            attach="material"
            color="red"
          />
          <mesh>
            <shapeGeometry args={[shape]} />
            <meshBasicMaterial side={DoubleSide} />
          </mesh>
        </mesh>
      )}
    </group>
  );
};

const Home: NextPage = () => {
  const [conf, _setConf] = useState(_conf);
  const store = useStore();
  const setConf = (items: Item[]) => {
    _setConf((s) => ({ ...s, [store.scene]: items }));
  };
  const setScene = (s: Scene) => store.setScene(s);
  const [addPortal, setAddPortal] = useState(false);
  const _addPorta = () => setAddPortal(!addPortal);
  return (
    <div className="canvas">
      <AdminSettings
        conf={conf}
        addPortal={_addPorta}
        setConf={setConf}
        setScene={setScene}
        scene={store.scene}
      />
      <Canvas flat={true} linear={true} mode="concurrent">
        <Controls position={[0, 0, 0]} maxDistance={0.02} fov={75} />

        <Suspense fallback={<CustomLoader />}>
          {conf[store.scene].map((o, idx) => (
            <Sprite key={o.id} {...o} />
          ))}
        </Suspense>
        <Svg addPortal={addPortal} />
        <Suspense fallback={<CustomLoader />}>
          <Environment />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default Home;
