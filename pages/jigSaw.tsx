import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import React, { Suspense, useRef, useState } from "react";
import * as THREE from "three";
import { Physics, PublicApi, useBox } from "@react-three/cannon";
import { Environment } from "@react-three/drei";
import { EffectComposer, Outline } from "@react-three/postprocessing";
import {
  DoubleSide,
  Mesh,
  MeshBasicMaterial,
  PointLight,
  Vector3,
} from "three";
import clsx from "clsx";
import { useStore } from "../store";
import { loadSound } from "../utils";
import Link from "next/link";
import { useEffect } from "react";
import Column from "./components/Column";

function Cube(props: any) {
  const [drag, setDrag] = useState(false);
  const [ref, api] = useBox(() => ({
    position: props.position,
    // @ts-ignore
    args: [2, 2],
    type: "Static",
  }));
  const three = useThree();

  useFrame(({ mouse: { x, y }, camera, viewport: { height, width } }) => {
    if (ref.current) ref.current?.lookAt(camera.position);

    const vector = new Vector3(x, y, 0);
    vector.unproject(three.camera);
    const dir = vector.sub(three.camera.position).normalize();
    const distance = -three.camera.position.z / dir.z;
    const pos = three.camera.position.clone().add(dir.multiplyScalar(distance));
    drag && api.position.set(pos.x, pos.y, pos.z);
  });
  const toggleDrag = (evt: any) => {
    evt.stopPropagation();
    // @ts-ignore
    if (three.controls) three.controls.enabled = drag;
    setDrag(!drag);
    props.onPointer;
  };
  const map = useLoader(THREE.TextureLoader, props.src as string);

  return (
    <Suspense fallback="loading...">
      <mesh
        onPointerDown={(evt) => {
          toggleDrag(evt);
          props.onPointerDown();
        }}
        onPointerUp={(evt) => {
          toggleDrag(evt);
          props.onPointerUp(api);
        }}
        receiveShadow
        castShadow
        ref={ref}
      >
        <planeGeometry args={[2, 2]} />

        <meshBasicMaterial
          attach="material"
          transparent
          map={map}
          opacity={props.opacity}
        />
      </mesh>
    </Suspense>
  );
}

const Bg = (p: { help: boolean }) => {
  const map = useLoader(THREE.TextureLoader, "/images/jinx.jpg");
  const ref = useRef<Mesh>();
  const meshRef = useRef<MeshBasicMaterial>();
  const three = useThree();
  useEffect(() => {}, [three]);
  const quaternion = new THREE.Quaternion();
  quaternion.setFromAxisAngle(
    new THREE.Vector3(0, 1, 0),
    Math.cos(Math.PI) * 0.03
  );
  useFrame((t, dt) => {
    if (!meshRef.current) return;
    if (!ref.current) return;
    if (p.help) {
      if (t.camera.position.z > 0.01)
        t.camera.position.lerp(new Vector3(11, 0, 0), 0.025);
      if (t.camera.position.z > -9.0) {
        t.camera.position.lerp(new Vector3(0, 0, -9), 0.025);
      }
    }
    if (!p.help) {
      if (t.camera.position.z < -0.01)
        t.camera.position.lerp(new Vector3(11, 0, 0), 0.025);
      if (t.camera.position.z < 9.0) {
        t.camera.position.lerp(new Vector3(0, 0, 9), 0.025);
      }
    }

    t.camera.lookAt(0, 0, 0);
    t.camera.updateProjectionMatrix();

    if (p.help && meshRef.current.opacity < 1.01)
      meshRef.current.opacity += 0.005;
    if (!p.help && meshRef.current.opacity > 0.7)
      meshRef.current.opacity -= 0.005;
  });

  return (
    <mesh castShadow ref={ref} position={[0, 0, -0.1]}>
      <planeGeometry args={[6, 6]} />
      <meshBasicMaterial
        ref={meshRef}
        transparent={!p.help}
        map={map}
        side={DoubleSide}
        opacity={0.7}
        color="white"
      />
    </mesh>
  );
};

const arr = [8, 9, 7, 5, 6, 4, 2, 3, 1];

const pos = [
  [-2, 2, 0],
  [-0, 2, 0],
  [2, 2, 0],

  [-2, 0, 0],
  [-0, 0, 0],
  [2, 0, 0],

  [-2, -2, 0],
  [-0, -2, 0],
  [2, -2, 0],
];

const EmptyPlane = (p: any) => {
  const ref = useRef<Mesh>();

  return (
    <mesh ref={ref} {...p} onPointerOver={() => p.onPointerOver(ref)}>
      <planeGeometry args={[2, 2]} />
      <meshBasicMaterial transparent opacity={0} />
    </mesh>
  );
};

const max = 4;
const min = -4;
const getRandom = () => Math.floor(Math.random() * (max - min + 1) + min);
const getRandomPos = () =>
  Array(9)
    .fill("")
    .map(() => [getRandom(), getRandom(), 0]);

function Lights() {
  const ref = useRef<PointLight>();
  useFrame((t) => {
    if (!ref.current) return;
    ref.current.position.copy(t.camera.position);
    ref.current.lookAt(0, 0, 0);
  });
  return (
    <group>
      <pointLight
        ref={ref}
        position={[0, 10, 5]}
        intensity={2}
        color={0x0000ff}
        distance={12}
      />
    </group>
  );
}

function JigSaw() {
  const [isDragging, setIsDragging] = useState<number | null>();
  const [hovered, setHover] = useState<Mesh | null>(null);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const selected = hovered ? [hovered] : undefined;
  const dap = loadSound("/sounds/hint.wav");
  const [positions, setPositions] = useState<number[][]>(getRandomPos());
  const [winingArr, setWinningArr] = useState<number[]>([]);
  const selectOpacity = (idx: number) => {
    if (isDragging) return idx === isDragging ? 1 : 0.1;
    return 1;
  };
  const [help, setHelp] = useState(false);
  const store = useStore();

  return (
    <div>
      <div className="fixed flex flex-col justify-end  pointer-events-none z-50 h-screen w-screen">
        <div
          className={clsx("flex p-3  justify-end", {
            hidden: store.dialogue.length > 0,
          })}
        >
          <div
            onClick={() => {
              if (dap.play) dap.play();
              setHelp(!help);
            }}
            className=" relative mr-2 border-4 p-3 bg-yellow-700 border-yellow-400 cursor-pointer pointer-events-auto"
          >
            {store.inventoryNotf.length > 0 && (
              <div className="bg-red-500 rounded-full w-8 h-8 -right-4 absolute -top-4 text-white flex justify-center items-center border-yellow-400 border">
                {store.inventoryNotf.length}
              </div>
            )}

            <img
              src="https://s2.svgbox.net/materialui.svg?ic=help_outline&color=ffd"
              width={48}
              height={48}
            />
          </div>
          <Link href="/">
            <a
              onClick={() => {
                if (dap.play) dap.play();
              }}
              className="relative border-4 p-3 bg-yellow-700 border-yellow-400 cursor-pointer pointer-events-auto"
            >
              {store.inventoryNotf.length > 0 && (
                <div className="bg-red-500 rounded-full w-8 h-8 -right-4 absolute -top-4 text-white flex justify-center items-center border-yellow-400 border">
                  {store.inventoryNotf.length}
                </div>
              )}

              <img
                src="https://s2.svgbox.net/materialui.svg?ic=exit_to_app&color=ffd"
                width={48}
                height={48}
              />
            </a>
          </Link>
        </div>

        <div
          onClick={() => store.nextDialogue()}
          style={{
            minHeight: "300px",
          }}
          className={clsx(
            "fixed bottom-0 pointer-events-auto  h-80 mb-2 duration-500 transition",
            {
              "w-full opacity-100": store.dialogue.length > 0,
              "w-0 opacity-0": store.dialogue.length < 1,
            }
          )}
        >
          <img
            src="/images/dialogueBox.png"
            className="w-full mx-auto absolute z-10 left-0  h-80 top-0"
            alt=""
          />
          <div className="flex rounded items-start w-full p-4 h-full">
            <button
              onClick={() => {
                store.setDialogue([]);
                if (dap.play) dap.play();
              }}
              className="m-3 text-white  z-50 text-5xl absolute right-10 top-10 font-black"
            >
              x
            </button>
            <div className="text-white z-50 rounded break-words mt-6 text-4xl px-10 py-4 w-full h-full mx-auto ">
              {store.dialogue[0]}
            </div>
            {store.dialogue.length - 1 > 0 && (
              <button className="m-3 text-white z-50 text-3xl animate-pulse absolute right-10 bottom-14 font-black">
                Συνέχεια...
              </button>
            )}
          </div>
        </div>
      </div>{" "}
      <div className="canvas">
        <Canvas camera={{ position: [0, 0, 8] }} className="canvas">
          <Suspense fallback="loading...">
            <Environment
              background
              files={[
                "/scenes/miniGame/px.jpg",
                "/scenes/miniGame/nx.jpg",
                "/scenes/miniGame/py.jpg",
                "/scenes/miniGame/ny.jpg",
                "/scenes/miniGame/pz.jpg",
                "/scenes/miniGame/nz.jpg",
              ]}
            />
            <Column />
          </Suspense>
          {/* <Lights /> */}
          <Physics>
            <Bg help={help} />
            {arr.map((_, idx) => (
              <EmptyPlane
                key={idx}
                onPointerOver={(evt: Mesh) => {
                  if (isDragging !== null) {
                    setHover(evt);
                    setHoveredIdx(idx);
                  }
                }}
                onPointerLeave={() => {
                  setHover(null);
                  setHoveredIdx(null);
                }}
                position={pos[idx]}
              />
            ))}

            {arr.map((src, idx) => (
              <Cube
                key={src}
                onPointerDown={() => {
                  setIsDragging(idx);
                }}
                onPointerUp={(api: PublicApi) => {
                  if (hoveredIdx !== null) {
                    // @ts-ignore
                    api.position.set(...pos[hoveredIdx]);
                    const tmp = [...winingArr];
                    tmp[hoveredIdx] = idx;
                    if (
                      [8, 6, 7, 5, 3, 4, 2, 0, 1].toString() === tmp.toString()
                    ) {
                      store.setDialogue(["Μπράβο έλυσες το γρίφο"]);
                      store.setInventory({
                        name: "Αγέλαστος πέτρα",
                        description: `Η αγέλαστος πέτρα είναι βράχος στην Ελευσίνα. Ο τόπος αυτός θεωρείτο ιερός διότι σύμφωνα με την παράδοση η Δήμητρα κάθησε εδώ για να ξαποστάσει και να μοιρολογήσει την κόρη της Περσεφόνη που την άρπαξε ο Πλούτωνας. Ο Όττο Ρούμπενζον υποστήριζε την άποψη ότι η «αγέλαστος πέτρα» αποτελείτο από σειρά τριών βράχων που έδειχναν την είσοδο μιας σπηλιάς που θεωρείτο ότι ήταν η είσοδος για τον κάτω κόσμο. Οι τρεις βράχοι συνοδεύονταν και από τρεις πηγές νερού, τις Ανθίων, Πανθίων και Καλλίχρονον.`,
                        src: "/images/agelastospetra.jpg",
                      });
                    }
                    setWinningArr(tmp);
                  }
                  setIsDragging(null);
                }}
                opacity={selectOpacity(idx)}
                src={`/gridImages/${src}.jpg`}
                position={positions[idx]}
              />
            ))}
          </Physics>
          <EffectComposer multisampling={1000} autoClear={false}>
            {/*  @ts-ignore */}
            <Outline selection={selected} visibleEdgeColor="yellow" />
          </EffectComposer>
        </Canvas>
      </div>
    </div>
  );
}

JigSaw.getInitialProps = () => {
  const statusCode = 404;
  return { statusCode };
};

export default JigSaw;
