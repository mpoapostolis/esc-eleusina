import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import React, { Suspense, useRef, useState } from "react";
import * as THREE from "three";
import { Physics, PublicApi, useBox } from "@react-three/cannon";
import { OrbitControls, Plane } from "@react-three/drei";
import { EffectComposer, Outline } from "@react-three/postprocessing";
import { Mesh, Vector3 } from "three";
import clsx from "clsx";
import { useStore } from "../store";
import { loadSound } from "../utils";
import Link from "next/link";

function Cube(props: any) {
  const [drag, setDrag] = useState(false);
  const [ref, api] = useBox(() => ({
    position: props.position,
    // @ts-ignore
    args: [2, 2],
    type: "Static",
  }));

  useFrame(({ mouse: { x, y }, viewport: { height, width } }) => {
    const vector = new Vector3(x, y, 0);
    vector.unproject(three.camera);
    const dir = vector.sub(three.camera.position).normalize();
    const distance = -three.camera.position.z / dir.z;
    const pos = three.camera.position.clone().add(dir.multiplyScalar(distance));
    drag && api.position.set(pos.x, pos.y, pos.z);
  });
  const three = useThree();
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
          side={THREE.DoubleSide}
        />
      </mesh>
    </Suspense>
  );
}

const Bg = () => {
  const map = useLoader(THREE.TextureLoader, "/images/jinx.jpg");
  return (
    <mesh position={[0, 0, -0.1]}>
      <planeGeometry args={[6, 6]} />
      <meshBasicMaterial transparent map={map} opacity={0.7} color="white" />
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
function JigSaw() {
  const [isDragging, setIsDragging] = useState<number | null>();
  const [hovered, setHover] = useState<Mesh | null>(null);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const selected = hovered ? [hovered] : undefined;
  const dap = loadSound("/sounds/dap.ogg");
  const [positions, setPositions] = useState<number[][]>(getRandomPos());
  const [winingArr, setWinningArr] = useState<number[]>([]);
  const selectOpacity = (idx: number) => {
    if (isDragging) return idx === isDragging ? 1 : 0.1;
    return 1;
  };
  const store = useStore();
  return (
    <div>
      <div className="fixed flex flex-col justify-end  pointer-events-none z-50 h-screen w-screen">
        <div
          className={clsx("flex p-3  justify-end", {
            hidden: store.dialogue.length > 0,
          })}
        >
          <Link href="/">
            <a
              onClick={() => {
                if (dap.play) dap.play();
                setPositions(getRandomPos());
              }}
              className=" relative border-4 p-3 bg-yellow-700 border-yellow-400 cursor-pointer pointer-events-auto"
            >
              {store.inventoryNotf.length > 0 && (
                <div className="bg-red-500 rounded-full w-8 h-8 -right-4 absolute -top-4 text-white flex justify-center items-center border-yellow-400 border">
                  {store.inventoryNotf.length}
                </div>
              )}

              <img
                src="https://s2.svgbox.net/materialui.svg?ic=exit_to_app&color=220"
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
          <color attach="background" args={["grey"]} />
          <OrbitControls enableRotate={false} makeDefault />
          <Physics>
            <Bg />
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
                      store.setIntentory({
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
