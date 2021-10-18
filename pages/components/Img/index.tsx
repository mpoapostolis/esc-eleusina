import { loadSound } from "../../../utils";
import * as THREE from "three";
import { MeshProps, useFrame, useLoader } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import { Box } from "@react-three/drei";
import { useStore } from "../../../store";

function Img(
  props: MeshProps & {
    hideWhen?: boolean;
    src: string;
    rotY?: number;
    position: [number, number, number];
    rotate?: boolean;
    offsetScale?: number;
    forceScale?: number;
    size1?: [number, number, number];
    hightlightAfter?: number;
  }
) {
  const dap = loadSound("/sounds/dap.ogg");
  const texture = useLoader(THREE.TextureLoader, props.src);
  const [hoverd, setHovered] = useState(false);
  const [mountTime, setMountTIme] = useState(0);
  const ref = useRef<any>();
  const store = useStore();

  useEffect(() => {
    if (!props.hideWhen) setMountTIme(store.timer);
  }, [props.hideWhen]);

  useFrame(() => {
    if (props.rotate && ref.current) ref.current.rotation.y += 0.05;
    if (props.rotY && ref.current) ref.current.rotation.y = props.rotY;
  });
  const scale = props.forceScale ?? 1;
  const offsetScale = props.offsetScale ?? 0.2;

  !props.hideWhen && console.log(mountTime - store.timer);
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
      scale={hoverd ? scale + offsetScale : scale}
    >
      <boxBufferGeometry attach="geometry" args={props.size1 ?? [7, 10, 0]} />
      <meshBasicMaterial
        transparent
        color={
          props.hightlightAfter &&
          mountTime - store.timer > props.hightlightAfter
            ? "red"
            : "white"
        }
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
