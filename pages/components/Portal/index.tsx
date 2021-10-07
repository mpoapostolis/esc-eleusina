import { MeshProps, useFrame, useLoader } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import { Scene } from "../../../store";

function Portal(p: { src: Scene } & MeshProps) {
  const texture = useLoader(THREE.TextureLoader, `/scenes/${p.src}.jpg`);
  texture.clone();
  const ref = useRef<any>();
  useFrame(() => {
    if (ref.current.scale.x < 1) {
      ref.current.scale.x += 0.005;
      ref.current.scale.z += 0.005;
      ref.current.scale.y += 0.005;
    }
    ref.current.rotation.y += 0.004;
  });

  return (
    <>
      <ambientLight color="white" />
      <mesh ref={ref} scale={0} visible {...p}>
        <sphereGeometry attach="geometry" args={[1, 32, 32]} />
        <meshStandardMaterial
          attach="material"
          map={texture}
          roughness={0.1}
          metalness={0.5}
        />
      </mesh>
    </>
  );
}

Portal.getInitialProps = () => {
  const statusCode = 404;
  return { statusCode };
};

export default Portal;
