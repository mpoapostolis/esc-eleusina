import type { GetServerSideProps, NextPage } from "next";
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
import { Html, OrbitControlsProps, useProgress } from "@react-three/drei";
import { Fragment, Suspense, useEffect, useRef, useState } from "react";
import { useGesture } from "@use-gesture/react";
import { MathUtils, Mesh, Vector3 } from "three";
import { useTimer } from "use-timer";
import GuideLines from "../components/GuideLines";
import AncientText from "../components/AncientText";
import Scenes from "../components/Scenes";
import Hand from "../components/Hand";
import Reward from "../components/Reward";
import useGuideLines from "../Hooks/useGuideLines";
import useTimerHint from "../Hooks/useTimerHint";
import JigSaw from "../components/JigSaw";
import Sprite from "../components/Sprite";
import Compass from "../components/Compass";
import MiniGameModal from "../components/MiniGameModal";
import { motion } from "framer-motion";
import { Img } from "./admin";
import Lexigram from "../components/Lexigram";
import { withSessionSsr } from "../lib/withSession";
import { useAchievements, useInventory } from "../lib/inventory";
import { useUser } from "../lib/users";
import { updateUser } from "../lib/users/queries";
import { useItems, useMiniGames } from "../lib/items";

export type MiniGame = {
  scene?: string;
  requiredItems?: string[] | null;
  reward?: Reward | null;
  type?: string;
} & Record<string, any>;

export type Reward = Img & {
  description?: string;
};

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
  const invHas = (id?: string) => inventory.map((e) => e._id).includes(id);
  const { data: inventory } = useInventory();

  const store = useStore();
  const show = props?.requiredItems
    ? props?.requiredItems
        ?.map((v) => {
          return invHas(v) || store.usedItems[v];
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
  const invHas = (id?: string) => inventory.map((e) => e._id).includes(id);
  const { data: inventory } = useInventory();

  const store = useStore();
  useEffect(() => {
    if (props.requiredItems?.map((e) => invHas(e)).every(Boolean)) {
      store.setIsHintVisible(true);
      store.setHint(props.text);
    }
  }, [inventory]);
  return null;
}

function GuideLineItem(props?: Item) {
  useGuideLines(`${props?.text}`);
  return null;
}

function FadeOut() {
  const store = useStore();

  useEffect(() => {
    const scene = store.screenShot;
    if (scene) {
      updateUser({ scene });
      setTimeout(() => store.setScene(scene as any), 125);
    }
  }, [store.fadeOutImg]);

  return (
    <motion.img
      style={{
        zIndex: 40,
      }}
      key={store.scene}
      animate={{
        scale: [1, 2],
        opacity: [1, 0],
      }}
      transition={{
        duration: 1,
      }}
      src={store.fadeOutImg}
      className="fixed  h-50 pointer-events-none"
      alt=""
    />
  );
}

function Screenshot() {
  const store = useStore();
  const { gl, scene, camera } = useThree();

  const changeScene = () => {
    gl.render(scene, camera);
    gl.domElement.toBlob(
      function (blob) {
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        store.setFadeOutImg(url);
      },
      "image/jpg",
      1.0
    );
  };

  useEffect(() => {
    if (store.screenShot) changeScene();
  }, [store.screenShot]);

  return null;
}

function Loader(props: { src?: string }) {
  useLoader(
    THREE.TextureLoader,
    `/scenes/${props.src}.jpg` ?? "/images/empty.png"
  );

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
    initialTime: store.timer,
    timerType: "DECREMENTAL",
    step: 1,
    onTimeUpdate: store.setTimer,
    endTime: 0,
  });

  useEffect(() => {
    if (store.status === "RUNNING") timer.start();
    if (store.status !== "RUNNING") timer.pause();
  }, [store.status]);
  const invHas = (id?: string) => inventory.map((e) => e._id).includes(id);
  const { data: inventory } = useInventory();
  const { data: miniGames } = useMiniGames();
  const { data: sceneItems } = useItems();
  const { data: achievements, isLoading } = useAchievements();
  const [currMinigames] = miniGames.filter((e) => e.scene === store.scene);

  const [fov, setFov] = useState(75);

  useEffect(() => {
    store.setHand(undefined);
  }, [store.scene]);

  const [boxItem] = sceneItems.filter(
    (e) => e.scene === store.scene && e.type === "box"
  );
  const { data: user } = useUser();

  useEffect(() => {
    if (!user) return;
    if (store.scene !== user?.scene) store.setScene(user?.scene);
  }, [user?.scene]);

  const achIds = achievements.map((e) => e._id);
  const rewardId = currMinigames?.reward?._id || boxItem?.reward?._id;
  const rewardScene = currMinigames?.scene || boxItem?.scene;
  const ref = useRef<HTMLAudioElement>(null);

  if (ref.current?.ended && store.sound) {
  }

  useEffect(() => {
    if (!ref.current || !store.sound) return;
    ref.current.currentTime = 0;
    ref.current?.play();
  }, [store.soundId]);

  console.log(achIds, rewardId);

  return (
    <div {...bind()}>
      <FadeOut />
      {store.compass && <Compass />}
      <JigSaw />
      <GuideLines />
      <Lexigram />
      <AncientText />
      <Ui items={sceneItems} time={timer.time} />
      <Reward />
      <div className="canvas">
        <Canvas flat={true} linear={true} mode="concurrent">
          <Controls position={[0, 0, 0]} maxDistance={0.02} fov={fov} />

          <Suspense fallback={<CustomLoader />}>
            {sceneItems
              .filter((e) => ["hint", "guidelines"].includes(`${e.type}`))
              .filter(
                () =>
                  !(
                    rewardScene === store.scene &&
                    achIds.includes(`${rewardId}`)
                  )
              )

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
            {user ? <Environment /> : null}
            {sceneItems
              .filter((e) => !["hint", "guidelines"].includes(`${e.type}`))
              ?.map((p, _idx) => {
                const item = p as Item;
                if (p.type === "portal")
                  return (
                    <Fragment key={p._id}>
                      <Portal
                        onClick={() => {
                          const goTo = p.goToScene;
                          if (goTo) {
                            store.takeScreenShot(goTo);
                          }
                        }}
                        {...item}
                      />
                    </Fragment>
                  );

                if (p.src) return <Sprite key={p._id} {...item} />;
                else return null;
              })}
            <Scenes />
          </Suspense>

          <Screenshot />
          <Suspense fallback={<CustomLoader />}>
            <Hand />
          </Suspense>
          <Suspense fallback="">
            {sceneItems
              .filter((e) => e.type === "portal")
              ?.map((p, _idx) => (
                <Loader key={p._id} src={p.goToScene} />
              ))}
          </Suspense>
        </Canvas>
      </div>
      {store.sound && <audio ref={ref} src={`/sounds/${store.sound}.wav`} />}
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = withSessionSsr(
  async function getServerSideProps({ req }) {
    const user = req.session.user;
    let destination = null;
    if (!user) destination = "/login";
    if (user?.admin) destination = "/admin";
    if (destination)
      return {
        redirect: {
          destination,
          permanent: true,
        },
      };
    else
      return {
        props: {},
      };
  }
);

export default Home;
