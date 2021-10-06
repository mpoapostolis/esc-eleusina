import { loadSound } from "../../../utils";
import * as THREE from "three";
import { MeshProps, useFrame, useLoader } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import { Box } from "@react-three/drei";

export default function Img(
  props: MeshProps & {
    hideWhen: boolean;
    src: string;
    position: [number, number, number];
    rotate?: boolean;
  }
) {
  const dap = loadSound("/sounds/dap.ogg");
  const texture = useLoader(THREE.TextureLoader, props.src);
  const [hoverd, setHovered] = useState(false);
  const ref = useRef<any>();

  useFrame(() => {
    if (props.rotate && ref.current) ref.current.rotation.y += 0.05;
  });

  return props.hideWhen ? (
    <Box />
  ) : (
    <mesh
      ref={ref}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
      onClick={(evt) => {
        if (dap.play) dap.play();
        if (props.onClick) props.onClick(evt);
      }}
      position={props.position}
      scale={hoverd ? 1.2 : 1}
    >
      <boxBufferGeometry attach="geometry" args={[7, 10, 0]} />
      <meshBasicMaterial transparent attach="material" map={texture} />
    </mesh>
  );
}
