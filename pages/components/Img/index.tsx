import { loadSound } from "../../../utils";
import * as THREE from "three";
import { MeshProps, useFrame, useLoader } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import { Box } from "@react-three/drei";
import { Mesh } from "three";
import { useStore } from "../../../store";

const img: Record<string, any> = {
  book: {
    src: "https://img.icons8.com/ios/50/000000/open-book.png",
  },
};

function Img(
  props: MeshProps & {
    selectable: boolean;
    name?: string;
    collectable?: boolean;
    onCollectError?: () => void;
    onCollectSucccess?: () => void;
    hideWhen?: boolean;
    addToInventory?: boolean;
    src: string;
    rotY?: number;
    opacity?: number;
    position: [number, number, number];
    rotate?: boolean;
    offsetScale?: number;
    forceScale?: number;
    args?: [number, number, number];
    hightlightAfter?: number;
  }
) {
  const dap = loadSound("/sounds/modal.wav");
  const texture = useLoader(THREE.TextureLoader, props.src);
  const [hovered, setHovered] = useState(false);
  const store = useStore();
  useEffect(() => {
    if (typeof document !== "undefined")
      document.body.style.cursor = hovered ? "pointer" : "auto";
  }, [hovered]);

  const ref = useRef<Mesh>();

  useFrame((three) => {
    if (ref.current) ref.current.lookAt(three.camera.position);
  });

  return props.hideWhen ? (
    <Box args={[0, 0, 0]} />
  ) : (
    <mesh
      ref={ref}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
      scale={props.opacity ? 1 : hovered ? 1.05 : 1}
      {...props}
      onClick={(evt) => {
        if (props.collectable && props.name && props.name in img) {
          dap?.play();
          const item = img[props.name];
          item.name = props.name;
          item.selectable = props.selectable;
          store.setInventory(item);
        }
      }}
    >
      <planeGeometry attach="geometry" args={[10, 10]} />
      <meshBasicMaterial
        opacity={props.opacity ?? hovered ? 1 : 0.8}
        transparent
        attach="material"
        map={texture}
      />
    </mesh>
  );
}
Img.getInitialProps = () => {
  const statusCode = 404;
  return { statusCode };
};

export default Img;
