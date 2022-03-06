import type { NextPage } from "next";
import Menu from "../components/Menu";
import Ui from "../components/Ui";
import { useSpring, animated, config } from "@react-spring/three";
import {
  Canvas,
  extend,
  useFrame,
  useLoader,
  useThree,
} from "@react-three/fiber";
import { Item, loadKey, useStore } from "../store";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { Html, OrbitControlsProps, useProgress } from "@react-three/drei";
import { Suspense, useEffect, useRef, useState } from "react";
import { useGesture } from "@use-gesture/react";
import { DoubleSide, MathUtils, Mesh, Sprite as SpriteType } from "three";
import axios from "axios";
import { Img } from "./admin";
import { useTimer } from "use-timer";
import GuideLines from "../components/GuideLines";
import AncientText from "../components/AncientText";
import Scenes from "../components/Scenes";
import Hand from "../components/Hand";
import EpicItem from "../components/EpicItem";
import Lexigram from "../components/Lexigram";
import useGuideLines from "../Hooks/useGuideLines";
import useTimerHint from "../Hooks/useTimerHint";

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
    giveReward: (s: string) => void;
  }
) {
  const texture = useLoader(THREE.TextureLoader, props.src);
  const ref = useRef<SpriteType>();
  const [hovered, setHovered] = useState(false);
  const [insideBox, setInsideBox] = useState<string[]>([]);
  const store = useStore();
  const isUsed = store.usedItems[`${props._id}`];

  useEffect(() => {
    if (typeof document !== "undefined")
      document.body.style.cursor = hovered ? "pointer" : "auto";
  }, [hovered]);
  useEffect(() => {
    if (!ref.current || !props.position || !props.rotation) return;
    ref.current.position.copy(props.position);
    ref.current.rotation.copy(props.rotation);
  }, [props.position, ref.current]);
  let s = props.scale ?? 0.2;
  if (hovered) s += 0.01;
  const collected = props.collectable && store.invHas(props._id);
  const { scale } = useSpring({
    scale: isUsed || collected ? 0 : s,
    config: config.wobbly,
  });

  useEffect(() => {
    if (props.orderInsideTheBox) {
      const isSame = props.orderInsideTheBox
        .map((x, idx) => {
          return x === insideBox[idx];
        })
        .every(Boolean);
      if (isSame && props.boxReward) {
        props.giveReward(props.boxReward);
      }
    }
  }, [insideBox, props.orderInsideTheBox]);

  if (props.type === "help" && !store.hint) return null;
  if (props.type === "guidelines" && !store.guideLines) return null;
  return (
    <animated.mesh
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
      onClick={(evt) => {
        if (props.type === "box" && props.orderInsideTheBox) {
          if (store.hand === props.orderInsideTheBox[insideBox.length]) {
            const str = store.hand;
            setInsideBox((s) => [...s, str]);
            store.removeInvItem(store.hand);
            store.setHand(undefined);
            store.setIsHintVisible(false);
            store.setUsedItem(store.hand);
          } else {
            store.setHint(props.orderBoxError);
            store.setIsHintVisible(true);
          }
          return;
        }

        if (store.hand && !props.collectableIfHandHas && props.type !== "box") {
          store.setHint("Nothing happened...");
          store.setIsHintVisible(true);
          return;
        }

        if (props.collectableIfHandHas) {
          if (store.hand === props.collectableIfHandHas) {
            store.setUsedItem(store.hand);
            store.removeInvItem(store.hand);
            store.setHand(undefined);
            store.setIsHintVisible(false);
          } else {
            store.setHint(props.onCollectFail);
            store.setIsHintVisible(true);
            return;
          }
        }

        if (props.collectable) {
          store.setInventory(props);
        }

        if (props.setHint) store.setHint(props.setHint);
        if (props.onClickTrigger) {
          store.onTrigger(props.onClickTrigger);
        }

        if (props.setGuidelines) store.setguideLines(props.setGuidelines);

        if (props.onClickOpenModal === "hint") store.setIsHintVisible(true);
        if (props.onClickOpenModal === "guidelines")
          store.setguideLinesVissible(true);
        if (props.onCollectError) props.onCollectError();
        if (props.onClick) props?.onClick(evt);
      }}
      scale={scale}
      ref={ref}
    >
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial
        transparent
        side={DoubleSide}
        attach="material"
        map={texture}
      />
    </animated.mesh>
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

function Portal(props: Item) {
  const countX = 4;
  const countY = 6;
  const fps = 25;
  const texture = useLoader(THREE.TextureLoader, "/images/arrows.png");
  const [hovered, setHovered] = useState(false);
  useEffect(() => {
    if (typeof document !== "undefined")
      document.body.style.cursor = hovered ? "pointer" : "auto";
  }, [hovered]);

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

    ref.current.scale.set(props.scale, props.scale, props.scale);
  });

  const ref = useRef<Mesh>();

  useEffect(() => {
    if (!ref.current || !props.position || !props.rotation) return;
    ref.current.position.copy(props.position);
    ref.current.rotation.copy(props.rotation);
  }, [props.position, ref.current]);

  const store = useStore();

  return (
    <mesh
      onClick={() => {
        if (props.goToScene) store.setScene(props.goToScene);
        if (props.collectable) store.setInventory(props);
      }}
      ref={ref}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
    >
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial
        transparent
        color="white"
        attach="material"
        map={texture}
      />
    </mesh>
  );
}

function TimerHint(props: Item) {
  useTimerHint(`${props.text}`, props.delayTimeHint);
  return null;
}

function GuideLineItem(props?: Item) {
  useGuideLines(`${props?.text}`, 2000);
  return null;
}

const Home: NextPage = () => {
  const store = useStore();

  const bind = useGesture({
    onWheel: (w) =>
      setFov((s) => {
        const n = Math.min(75, s + w.velocity[1] * w.direction[1]);
        if (n > 75) return 75;
        if (n < 40) return 40;
        return n;
      }),
  });

  const timer = useTimer({
    initialTime: 600,
    timerType: "DECREMENTAL",
    step: 1,
    endTime: 0,
  });

  useEffect(() => {
    if (store.status === "RUNNING") timer.start();
    if (store.status !== "RUNNING") timer.pause();
  }, [store.status]);

  const [items, setItems] = useState<Item[]>([]);
  const [imgs, setImgs] = useState<Img[]>([]);

  const getImgs = async () =>
    axios.get("/api/library").then((d) => {
      setImgs(d.data);
    });

  const getItems = async () =>
    axios.get("/api/items").then((d) => {
      setItems(d.data);
    });

  useEffect(() => {
    getItems();
    getImgs();
  }, []);

  const [fov, setFov] = useState(75);

  useEffect(() => {
    const token = loadKey();
    if (token) {
      store.setToken(token);
      store.setStatus("RUNNING");
    }
  }, []);
  const sceneItems = items.filter((e) => e.scene === store.scene && !e.isEpic);
  return (
    <div {...bind()}>
      <GuideLines />
      <AncientText />
      <Lexigram />
      <Ui items={sceneItems} time={timer.time} />
      <Menu />
      <EpicItem />
      <div className="canvas">
        <Canvas flat={true} linear={true} mode="concurrent">
          <Controls position={[0, 0, 0]} maxDistance={0.02} fov={fov} />
          <Suspense fallback={<CustomLoader />}>
            {sceneItems?.map((p, idx) => {
              const item = p as Item;
              const show = item?.requiredItems
                ?.map((v) => {
                  return (
                    store.invHas(v) || store.epicInvHas(v) || store.usedItems[v]
                  );
                })
                .every((e) => e);

              if (!show && item?.requiredItems) return null;
              if (p.type === "timerHint")
                return <TimerHint key={p._id} {...p} />;
              if (p.type === "guidelines")
                return <GuideLineItem key={p._id} {...p} />;
              else
                return p.type === "portal" ? (
                  <Portal key={p._id} {...item} />
                ) : (
                  <Sprite
                    key={p._id}
                    giveReward={(i) => {
                      const found = items.find((e) => e._id === i);
                      if (found) store.setEpicItem(found);
                    }}
                    {...item}
                  />
                );
            })}
            <Environment />
            <Scenes />
          </Suspense>

          <Suspense fallback={<CustomLoader />}>
            <Hand />
          </Suspense>
        </Canvas>
      </div>
    </div>
  );
};

export default Home;
