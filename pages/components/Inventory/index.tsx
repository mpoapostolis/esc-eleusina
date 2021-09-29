import { useStore } from "../../../store";
import { loadSound } from "../../../utils";
import clsx from "clsx";
import { Canvas, useFrame } from "@react-three/fiber";
import { useRef, useState } from "react";

function Wrapper(props: any) {
  // This reference will give us direct access to the THREE.Mesh object
  const ref = useRef<any>();
  // Set up state for the hovered and active state
  // Subscribe this component to the render-loop, rotate the mesh every frame
  useFrame((state, delta) => {
    ref.current.rotation.y += 0.02;
  });
  // Return the view, these are regular Threejs elements expressed in JSX
  return (
    <mesh ref={ref} scale={props.scale ?? 2} {...props}>
      {props.children}
    </mesh>
  );
}
export default function Inventory() {
  const store = useStore();
  const dap = loadSound("/sounds/dap.ogg");

  return (
    <div
      style={{ background: "#000c" }}
      className={clsx("h-full absolute z-50 w-screen", {
        hidden: store.modal !== "inventory",
      })}
    >
      <div className="w-full h-20 flex justify-between">
        <h1 className="m-3 text-white text-5xl font-black">Inventory</h1>
        <button
          onClick={() => {
            store.setOpenModal(undefined);
            if (dap.play) dap.play();
          }}
          className="m-3 text-white text-5xl font-black"
        >
          x
        </button>
      </div>
      <hr className="opacity-50" />

      <div className="max-w-md h-4/5 mt-20 rounded-3xl p-5 md:max-w-sm mx-auto place-items-center">
        <div className="w-full  h-12  overflow rounded-t-2xl"></div>
        <div className="border-dashed rounded-lg p-3 border-2">
          <div
            style={{
              backgroundImage: `url(/inventory.png)`,
            }}
            className="grid  grid-cols-3"
          >
            {[...Array(9)].map((_, i) => (
              <div
                key={i}
                className="relative border  border-white   w-full h-32 z-50"
              >
                <Canvas>
                  <pointLight position={[0, 0, 2.5]} color="white" />
                  <mesh>
                    <Wrapper>
                      <boxGeometry args={[1, 1, 1]} />
                      <meshStandardMaterial color={"#0f0"} />
                    </Wrapper>
                  </mesh>
                </Canvas>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
