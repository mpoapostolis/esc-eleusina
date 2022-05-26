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
import { Item, loadKey, useStore } from "../store";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { Html, OrbitControlsProps, useProgress } from "@react-three/drei";
import { Suspense, useEffect, useRef, useState } from "react";
import { useGesture } from "@use-gesture/react";
import {
  DoubleSide,
  MathUtils,
  Mesh,
  Sprite as SpriteType,
  Vector3,
} from "three";
import axios from "axios";
import { useTimer } from "use-timer";
import GuideLines from "../components/GuideLines";
import AncientText from "../components/AncientText";
import Scenes from "../components/Scenes";
import Hand from "../components/Hand";
import EpicItem from "../components/EpicItem";
import Lexigram from "../components/Lexigram";
import useGuideLines from "../Hooks/useGuideLines";
import useTimerHint from "../Hooks/useTimerHint";
import JigSaw from "../components/JigSaw";
import Sprite from "../components/Sprite";
import Compass from "../components/Compass";
import MiniGameModal from "../components/MiniGameModal";
import UnityMiniGame from "../components/UnityMiniGame";

export type MiniGame = {
  scene?: string;
  requiredItems?: string[] | null;
  reward?: Reward | null;
  type?: string;
} & Record<string, any>;

export interface Reward {
  _id?: string;
  src?: string;
  name?: string;
  description?: string;
}

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

const FocusOn = (p: { focusItem?: Item }) => {
  const { x, y, z } = p.focusItem?.position ?? {};
  const v3 = new Vector3(x, y, z).multiplyScalar(-1);
  useFrame((t) => {
    if (x && z) t.camera.position.copy(t.camera.position).lerp(v3, 0.001);
  });
  return null;
};

function Environment() {
  const { scene } = useThree();
  const store = useStore();
  const texture = useLoader(THREE.TextureLoader, `/scenes/${store.scene}.jpg`);

  texture.mapping = THREE.EquirectangularReflectionMapping;
  scene.background = texture;
  return null;
}

export function CustomLoader() {
  const { progress } = useProgress();
  return (
    <Html
      center
      className="w-screen h-screen bg-opacity-50 bg-black flex justify-center items-center"
    >
      <div>
        <div className="animate-spin rounded-full h-32 w-32 border-b-8 border-white"></div>
        <span className="text-white  font-bold text-xl">
          {progress.toFixed(0)} % loaded
        </span>
      </div>
    </Html>
  );
}

function Portal(props: Item) {
  const countX = 4;
  const countY = 6;
  const fps = 25;
  const texture = useLoader(THREE.TextureLoader, "/images/portal.png");
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

    ref.current.scale.set(props.scale / 2, props.scale / 3, 1);
  });

  const ref = useRef<Mesh>();

  useEffect(() => {
    if (!ref.current || !props.position || !props.rotation) return;
    ref.current.position.copy(props.position);
    ref.current.rotation.copy(props.rotation);
  }, [props.position, ref.current]);

  const store = useStore();
  const show = props?.requiredItems
    ? props?.requiredItems
        ?.map((v) => {
          return store.invHas(v) || store.epicInvHas(v) || store.usedItems[v];
        })
        .every((e) => e)
    : true;

  return show ? (
    <mesh
      onClick={props.onClick}
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
  ) : null;
}

function TimerHint(props: Item) {
  useTimerHint(`${props.text}`, props.delayTimeHint);
  return null;
}

function ConditionalHint(props: Item) {
  const store = useStore();
  useEffect(() => {
    if (props.requiredItems?.map((e) => store.invHas(e)).every(Boolean)) {
      store.setIsHintVisible(true);
      store.setHint(props.text);
    }
  }, [store.inventory]);
  return null;
}

function GuideLineItem(props?: Item) {
  useGuideLines(`${props?.text}`);
  return null;
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
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
  const [miniGames, setMiniGames] = useState<MiniGame[]>([]);

  const getItems = async () =>
    axios.get("/api/items").then((d) => {
      setItems(d.data);
    });

  const getMiniGames = async () =>
    axios.get("/api/miniGames").then((d) => {
      setMiniGames(d.data);
    });

  useEffect(() => {
    getItems();
    getMiniGames();
  }, []);

  useEffect(() => {
    const [currMinigames] = miniGames.filter((e) => e.scene === store.scene);
    if (!currMinigames) return;
    const doIHaveEpicItem = store.epicInvHas(`${currMinigames.reward?._id}`);
    const arr = (currMinigames.requiredItems ?? [])?.length > 0;

    if (
      !doIHaveEpicItem &&
      arr &&
      currMinigames.requiredItems?.map((i) => store.invHas(i)).every(Boolean)
    )
      store.setStatus("MINIGAMEMODAL");
  }, [miniGames, store.scene, store.inventory]);

  const [fov, setFov] = useState(75);

  useEffect(() => {
    const token = loadKey();
    if (token) {
      store.setToken(token);
      store.setStatus("RUNNING");
    }
  }, []);

  const sceneItems = items.filter((e) => e.scene === store.scene && !e.isEpic);
  const [focusItem, setFocusItem] = useState<Item>();

  return (
    <div {...bind()}>
      {store.compass && <Compass />}
      <JigSaw />
      <GuideLines />
      <AncientText />
      {/* <Lexigram /> */}
      <Ui items={sceneItems} time={timer.time} />
      <MiniGameModal />
      <Menu />
      <EpicItem />
      <UnityMiniGame />
      {sceneItems
        .filter((e) => ["hint", "guidelines"].includes(`${e.type}`))
        .map((p) => {
          if (p.type === "hint")
            return p.hintType === "conditional" ? (
              <ConditionalHint key={p._id} {...p} />
            ) : (
              <TimerHint key={p._id} {...p} />
            );
          if (p.type === "guidelines")
            return <GuideLineItem key={p._id} {...p} />;
        })}
      <div className="canvas">
        <Canvas flat={true} linear={true} mode="concurrent">
          <Controls position={[0, 0, 0]} maxDistance={0.02} fov={fov} />
          <FocusOn focusItem={focusItem} />

          <Suspense fallback={<CustomLoader />}>
            {sceneItems
              .filter((e) => !["hint", "guidelines"].includes(`${e.type}`))
              ?.map((p, idx) => {
                const item = p as Item;
                if (p.type === "portal")
                  return (
                    <Portal
                      onClick={() => {
                        const goTo = p.goToScene;
                        if (goTo) {
                          Promise.resolve()
                            .then(() => setFocusItem(p))
                            .then(() => sleep(400))
                            .then(() => setFov(0))
                            .then(() => sleep(400))
                            .then(() => store.setScene(goTo))
                            .then(() => setFov(75))
                            .then(() => setFocusItem(undefined));
                        }
                        if (p.collectable) store.setInventory(p);
                      }}
                      key={p._id}
                      {...item}
                    />
                  );

                if (p.src)
                  return (
                    <Sprite
                      key={p._id}
                      giveReward={(i) => {
                        const found = items.find((e) => e._id === i);
                        if (found) store.setEpicItem(found);
                      }}
                      {...item}
                    />
                  );
                else return null;
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
