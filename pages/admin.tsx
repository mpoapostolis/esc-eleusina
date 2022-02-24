import type { NextPage } from "next";
import {
  Canvas,
  extend,
  useFrame,
  useLoader,
  useThree,
} from "@react-three/fiber";
import { Item, Portal, Scene, useStore } from "../store";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import {
  Circle,
  Html,
  meshBounds,
  OrbitControlsProps,
  useProgress,
} from "@react-three/drei";
import { Suspense, useEffect, useRef, useState } from "react";
import {
  DoubleSide,
  Euler,
  MathUtils,
  Mesh,
  Shape,
  Sprite as SpriteType,
  Vector3,
} from "three";
import AdminSettings from "../components/AdminSettings";
import Library from "../components/Library";
import axios from "axios";

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

function Sprite(
  props: Item & {
    update: (v3: Vector3) => void;
  }
) {
  const texture = useLoader(THREE.TextureLoader, props.src);
  const [drag, setDrag] = useState(false);
  const ref = useRef<SpriteType>();
  useFrame((t) => {
    if (!ref.current) return;
    if (drag && !props.hidden) {
      ref.current.position.copy(t.raycaster.ray.direction);
      ref.current.scale.set(props.scale, props.scale, props.scale);
    }
  });

  useEffect(() => {
    if (!ref.current || !props.position) return;
    ref.current.position.copy(props.position);
  }, [props.position, ref.current]);

  const t = useThree();
  return (
    <sprite
      position={props.position ?? t.raycaster.ray.direction}
      onDoubleClick={() => {
        if (!ref.current) return;
        const v3 = new Vector3();
        props.update(v3.copy(ref.current.position));
        setDrag(!drag);
      }}
      scale={props.scale}
      ref={ref}
    >
      <spriteMaterial
        attach="material"
        opacity={props.hidden ? 0 : 1}
        map={texture}
      />
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

export type Conf = Record<Scene, (Item | Portal)[]>;
export const _conf: Conf = {
  intro: [],
  elaiourgeio: [],
  teletourgeio: [],
  karnagio: [],
};

const Svg = (p: { addPortal: boolean; setConf: (i: Item[]) => void }) => {
  // const [points, setPoints] = useState<{ x: number; y: number }[]>([]);
  const shape = new Shape();
  const store = useStore();
  const points = store.portal?.points ?? [];
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

  useEffect(() => {
    const v3 = new Vector3();
    const rot = new Euler();
    if (planeRef.current)
      store.setPortal({
        goToScene: "elaiourgeio",
        position: v3.copy(planeRef.current.position),
        rotation: rot.copy(planeRef.current.rotation),
        points: points,
      });
  }, [points, planeRef.current]);

  return (
    <group raycast={meshBounds}>
      {p.addPortal && (
        <>
          <Circle ref={ref} args={[0.025]} />
          <mesh
            onClick={(e) => {
              if (!planeRef.current) return;
              const dx = t.viewport.width / 5;
              const dy = t.viewport.height / 5;
              const x = (e.spaceX * dx) / 2;
              const y = (e.spaceY * dy) / 2;

              const _p = [
                ...points,
                {
                  x,
                  y,
                },
              ];

              const v3 = new Vector3();
              const rot = new Euler();
              if (planeRef.current)
                store.setPortal({
                  goToScene: "elaiourgeio",
                  position: v3.copy(planeRef.current.position),
                  rotation: rot.copy(planeRef.current.rotation),
                  points: _p,
                });
            }}
            ref={planeRef}
          >
            <planeGeometry
              args={[t.viewport.width / 5, t.viewport.height / 5, 30, 30]}
            />
            <meshBasicMaterial
              side={DoubleSide}
              wireframe
              transparent
              opacity={0.1}
              attach="material"
              color="grey"
            />
          </mesh>
        </>
      )}
    </group>
  );
};

const Home: NextPage = () => {
  const [conf, _setConf] = useState(_conf);
  const [imgs, setImgs] = useState<string[]>([]);

  const store = useStore();
  const setConf = (items: Item[]) => {
    _setConf((s) => ({ ...s, [store.scene]: items }));
  };
  const [hide, setHide] = useState<string[]>([]);
  const setScene = (s: Scene) => store.setScene(s);
  const [portal, _addPortal] = useState(false);
  const [library, _setLibrary] = useState(false);
  const addPortal = () => _addPortal(!portal);
  const setLibrary = () => _setLibrary(!library);

  const shape = new Shape();
  const points = store.portal?.points ?? [];
  points.forEach((p, idx) => {
    if (!p) return;
    if (idx === 0) shape.moveTo(p.x, p.y);
    else shape.lineTo(p.x, p.y);
  });

  useEffect(() => {
    if (!library)
      axios.get("/api/getConf", {}).then((d) => {
        _setConf(d.data.items);
        setImgs(d.data.assets);
      });
  }, [library]);
  const items = conf[store.scene] as Item[];

  return (
    <div className="canvas">
      {!library ? (
        <AdminSettings
          hide={hide}
          imgs={imgs}
          setHide={(idx: string) => {
            const found = hide.includes(idx);
            const hiddenObj = found
              ? hide.filter((e) => e !== idx)
              : [...hide, idx];
            setHide(hiddenObj);
          }}
          conf={conf}
          portal={portal}
          setLibrary={setLibrary}
          addPortal={addPortal}
          setConf={setConf}
          setScene={setScene}
          scene={store.scene}
        />
      ) : (
        <Library setLibrary={setLibrary} />
      )}
      <Canvas flat={true} linear={true} mode="concurrent">
        {!portal && (
          <Controls position={[0, 0, 0]} maxDistance={0.02} fov={75} />
        )}

        <Suspense fallback={<CustomLoader />}>
          {conf[store.scene].map((o) => {
            const isHidden = hide.includes(`${o.id}`);
            const x = o as Item;

            return (
              <Sprite
                update={(v3) => {
                  const idx = items.findIndex((i) => i.id === o.id);
                  items[idx].position = v3;
                  setConf(items);
                }}
                hidden={isHidden}
                key={o.id}
                {...x}
              />
            );
          })}
        </Suspense>
        {portal && <Svg setConf={setConf} addPortal={portal} />}
        {store.portal && (
          <mesh
            position={store.portal.position}
            rotation={store.portal.rotation}
          >
            <shapeGeometry args={[shape]} />
            <meshBasicMaterial color="yellow" opacity={0.25} transparent />
          </mesh>
        )}
        <Suspense fallback={<CustomLoader />}>
          <Environment />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default Home;
