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
    if (ref.current) ref.current.lookAt(three.camera.position);
  });

  return (
    <group position={p.position} scale={1} ref={ref}>
      <mesh position={[0, 0, -1]}>
        <planeGeometry args={[10.7, 10.7]} />
        <meshBasicMaterial color="white" side={DoubleSide} />
      </mesh>
      <mesh {...p} scale={1} position={[0, 0, 0]}>
        <planeGeometry attach="geometry" args={[10, 10]} />
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
