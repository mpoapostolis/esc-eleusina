import type { NextPage } from "next";
import {
  Canvas,
  extend,
  useFrame,
  useLoader,
  useThree,
} from "@react-three/fiber";
import { Item, loadKey, Scene, useStore } from "../store";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { Html, OrbitControlsProps, useProgress } from "@react-three/drei";
import { Suspense, useEffect, useRef, useState } from "react";
import { Euler, MathUtils, Mesh, Sprite as SpriteType, Vector3 } from "three";
import AdminSettings from "../components/AdminSettings";
import Library from "../components/Library";
import axios from "axios";
import Menu from "../components/Menu";

extend({ OrbitControls });

type Sprite = Item & {
  update: (p: { e3: Euler; v3: Vector3 }) => void;
};
function Portal(props: Sprite) {
  const countX = 4;
  const countY = 6;
  const fps = 25;
  const texture = useLoader(THREE.TextureLoader, "/images/arrows.png");
  const [hovered, setHovered] = useState(false);
  useEffect(() => {
    if (typeof document !== "undefined")
      document.body.style.cursor = hovered ? "pointer" : "auto";
  }, [hovered]);

  const [drag, setDrag] = useState(false);
  useFrame((three) => {
    if (!ref.current) return;
    const t = three.clock.elapsedTime;
    const x = Math.floor(t * fps) % countX;
    const y = Math.floor(((t * fps) % 32) / 4);
    texture.offset.x = x / countX;
    texture.offset.y = (5 - y) / countY;
    texture.minFilter = THREE.LinearFilter;
    texture.repeat.x = 1 / countX;
    texture.repeat.y = 1 / countY;

    if (drag) {
      ref.current.position.copy(three.raycaster.ray.direction);
      ref.current.rotation.copy(three.camera.rotation);
    }
    ref.current.scale.set(props.scale, props.scale, props.scale);
  });

  const ref = useRef<Mesh>();

  useEffect(() => {
    if (!ref.current || !props.position || !props.rotation) return;
    ref.current.position.copy(props.position);
    ref.current.scale.set(props.scale, props.scale, props.scale);
    ref.current.rotation.copy(props.rotation);
  }, [props.position, ref.current]);

  const t = useThree();
  return (
    <sprite
      position={props.position ?? t.raycaster.ray.direction}
      rotation={props.rotation ?? t.camera.rotation}
      onDoubleClick={() => {
        if (!ref.current) return;
        if (!ref.current) return;
        const v3 = new Vector3().copy(ref.current.position);
        const e3 = new Euler().copy(ref.current.rotation);
        props.update({ e3, v3 });
        setDrag(!drag);
      }}
      ref={ref}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
    >
      <spriteMaterial
        transparent
        color="white"
        attach="material"
        map={texture}
      />
    </sprite>
  );
}

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

function Sprite(props: Sprite) {
  const texture = useLoader(THREE.TextureLoader, props.src);
  const [drag, setDrag] = useState(false);
  const ref = useRef<SpriteType>();
  useFrame((t) => {
    if (!ref.current) return;
    if (drag && !props.hidden) {
      ref.current.position.copy(t.raycaster.ray.direction);
      ref.current.scale.set(props.scale, props.scale, props.scale);
      ref.current.rotation.copy(t.camera.rotation);
    }
  });

  useEffect(() => {
    if (!ref.current || !props.position || !props.rotation) return;
    ref.current.position.copy(props.position);
    ref.current.rotation.copy(props.rotation);
    ref.current.scale.set(props.scale, props.scale, props.scale);
  }, [props.position, ref.current]);

  const t = useThree();
  return (
    <mesh
      position={props.position ?? t.raycaster.ray.direction}
      rotation={props.rotation ?? t.camera.rotation}
      onDoubleClick={() => {
        if (!ref.current) return;
        const v3 = new Vector3().copy(ref.current.position);
        const e3 = new Euler().copy(ref.current.rotation);
        props.update({ e3, v3 });
        setDrag(!drag);
      }}
      scale={props.scale}
      ref={ref}
    >
      <planeGeometry args={[1, 1]} />

      <meshBasicMaterial
        transparent
        attach="material"
        color="white"
        opacity={props.hidden ? 0 : 1}
        map={texture}
      />
    </mesh>
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
export const _conf: Conf = {
  intro: [],
  elaiourgeio: [],
  teletourgeio: [],
  karnagio: [],
  arxaiologikos: [],
  eleusina: [],
  pangal: [],
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
  const setLibrary = () => _setLibrary(!library);

  useEffect(() => {
    const token = loadKey();
    if (token) {
      store.setToken(token);
      store.setStatus("RUNNING");
    }
  }, []);

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
          imgs={["arrows.png", ...imgs]}
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
          setConf={setConf}
          setScene={setScene}
          scene={store.scene}
        />
      ) : (
        <Library setLibrary={setLibrary} />
      )}
      <Menu />

      <Canvas flat={true} linear={true} mode="concurrent">
        <Controls position={[0, 0, 0]} maxDistance={0.02} fov={75} />

        <Suspense fallback={<CustomLoader />}>
          {conf[store.scene]?.map((o) => {
            const isHidden = hide.includes(`${o.id}`);
            const x = o as Item;

            return o.type === "portal" ? (
              <Portal
                {...o}
                key={o.id}
                update={(p) => {
                  const idx = items?.findIndex((i) => i.id === o.id);
                  items[idx].position = p.v3;
                  items[idx].rotation = p.e3;
                  setConf(items);
                }}
              />
            ) : (
              <Sprite
                update={(p) => {
                  const idx = items?.findIndex((i) => i.id === o.id);
                  items[idx].position = p.v3;
                  items[idx].rotation = p.e3;

                  setConf(items);
                }}
                hidden={isHidden}
                key={o.id}
                {...x}
              />
            );
          })}
        </Suspense>
        {/* {portal && <Svg setConf={setConf} addPortal={portal} />} */}
        {/* {store.portal && (
          <mesh
            position={store.portal.position}
            rotation={store.portal.rotation}
          >
            <shapeGeometry args={[shape]} />
            <meshBasicMaterial color="yellow" opacity={0.25} transparent />
          </mesh>
        )} */}
        <Suspense fallback={<CustomLoader />}>
          <Environment />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default Home;
