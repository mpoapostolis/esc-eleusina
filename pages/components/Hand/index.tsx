import { useFrame, useLoader, useThree } from "@react-three/fiber";
import { useRef } from "react";
import { Mesh, TextureLoader, Vector3 } from "three";
import { useStore } from "../../../store";

export function Hand() {
  const store = useStore();

  const getTexture = () => {
    const obj = store.inventory.find((s) => store.hand === s.name);
    if (obj) {
      const texture = useLoader(TextureLoader, obj.src);
      return texture;
    } else return undefined;
  };
  const { viewport } = useThree();
  useFrame(({ mouse, camera, viewport: { height, width } }) => {
    if (ref.current) {
      ref.current.position.copy(camera.position);
      ref.current.rotation.copy(camera.rotation);
      ref.current.translateZ(-10);
      ref.current.translateX(viewport.width * mouse.x);
      ref.current.translateY(viewport.height * mouse.y);
      ref.current?.lookAt(camera.position);
    }
  });
  const ref = useRef<Mesh>();
  return (
    <mesh ref={ref} position={[20, -5, 0]}>
      <planeGeometry attach="geometry" args={[10, 10]} />
      <meshBasicMaterial transparent attach="material" map={getTexture()} />
    </mesh>
  );
}

Hand.getInitialProps = () => {
  const statusCode = 404;
  return { statusCode };
};

export default Hand;
