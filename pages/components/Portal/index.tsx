import { MeshProps, useFrame, useLoader } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import { DoubleSide, Mesh } from "three";
import { Scene } from "../../../store";

function Portal(p: { src: Scene } & MeshProps) {
  const texture = useLoader(THREE.TextureLoader, `/scenes/${p.src}.jpg`);
  texture.clone();
  const ref = useRef<Mesh>();
  useFrame((three) => {
    if (ref.current) ref.current.rotation.y += 0.001;
  });

  return (
    <group position={p.position} scale={1} ref={ref}>
      <mesh {...p} scale={1} ref={ref} position={[0, 0, 0]}>
        <sphereGeometry attach="geometry" args={[3]} />
        <meshStandardMaterial map={texture} />
      </mesh>
    </group>
  );
}

Portal.getInitialProps = () => {
  const statusCode = 404;
  return { statusCode };
};

export default Portal;
