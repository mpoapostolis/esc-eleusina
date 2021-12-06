import { loadSound } from "../../../utils";
import * as THREE from "three";
import { MeshProps, useFrame, useLoader } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import { Box } from "@react-three/drei";
import { Mesh } from "three";

function Img(
  props: MeshProps & {
    hideWhen?: boolean;
    src: string;
    rotY?: number;
    position: [number, number, number];
    rotate?: boolean;
    offsetScale?: number;
    forceScale?: number;
    args?: [number, number, number];
    hightlightAfter?: number;
  }
) {
  const dap = loadSound("/sounds/dap.ogg");
  const texture = useLoader(THREE.TextureLoader, props.src);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    if (typeof document !== "undefined")
      document.body.style.cursor = hovered ? "pointer" : "auto";
  }, [hovered]);

  const ref = useRef<Mesh>();

  useFrame((three) => {
    if (ref.current) ref.current.lookAt(three.camera.position);
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
      {...props}
    >
      <planeGeometry attach="geometry" args={[10, 10]} />
      <meshBasicMaterial transparent attach="material" map={texture} />
    </mesh>
  );
}
Img.getInitialProps = () => {
  const statusCode = 404;
  return { statusCode };
};

export default Img;
