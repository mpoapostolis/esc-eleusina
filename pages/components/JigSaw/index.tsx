import { useFrame, useLoader, useThree } from "@react-three/fiber";
import React, { Suspense, useState } from "react";
import * as THREE from "three";
import { Physics, useBox, usePlane } from "@react-three/cannon";

function Plane(props: any) {
  const [ref] = usePlane(() => ({
    rotation: [-Math.PI / 2, 0, 0],
    position: [-55500, -2000, -5000],
    ...props,
    type: "Static",
  }));
  return (
    <mesh ref={ref}>
      <planeGeometry args={[100, 100]} />
      <meshBasicMaterial transparent color="white" />
    </mesh>
  );
}

function Cube(props: any) {
  const [drag, setDrag] = useState(false);
  const [ref, api] = useBox(() => ({
    position: props.position,
    args: [2, 1],
    type: "Static",
    ...props,
  }));

  useFrame(
    ({ mouse: { x, y }, viewport: { height, width } }) =>
      drag && api.position.set((x * width) / 2, (y * height) / 2, 0)
  );
  const three = useThree();
  const toggleDrag = (evt: any) => {
    evt.stopPropagation();
    // @ts-ignore
    if (three.controls) three.controls.enabled = drag;
    api.mass.set(drag ? 0.0 : 0.0);
    setDrag(!drag);
  };
  const map = useLoader(THREE.TextureLoader, props.src);

  return (
    <mesh
      onPointerDown={toggleDrag}
      onPointerUp={toggleDrag}
      receiveShadow
      castShadow
      ref={ref}
    >
      <planeGeometry />
      <meshLambertMaterial
        map={map}
        opacity={drag ? 0.3 : 1}
        transparent
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

const Bg = () => {
  const map = useLoader(THREE.TextureLoader, "/images/jigsaw.jpg");
  return (
    <mesh position={[-1, 2, -1]}>
      <planeGeometry args={[6, 6]} />
      <meshBasicMaterial transparent map={map} color="lightgrey" />
    </mesh>
  );
};

const arr = [8, 9, 7, 5, 6, 4, 2, 3, 1];

function JigSaw() {
  return (
    <Physics>
      <Plane />
      <Suspense fallback="loading...">
        <Plane position={[0, -0.5, 0]} />
        <Bg />
        {arr.map((src, idx) => {
          return (
            <Cube
              src={`/gridImages/${src}.jpg`}
              key={src}
              position={[(idx + 1) % 3, Math.ceil((idx + 1) / 3), 0]}
            />
          );
        })}
      </Suspense>
    </Physics>
  );
}

JigSaw.getInitialProps = () => {
  const statusCode = 404;
  return { statusCode };
};

export default JigSaw;
