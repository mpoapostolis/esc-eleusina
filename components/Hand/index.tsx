import { useFrame, useLoader, useThree } from "@react-three/fiber";
import { useRef } from "react";
import { Mesh, TextureLoader } from "three";
import { useStore } from "../../store";

export function Hand() {
  const store = useStore();
  const found = store.inventory.find((s) => store.hand === s.name);

  const texture = useLoader(
    TextureLoader,
    found ? found.src : "/images/emoji.png"
  );
  const { viewport } = useThree();
  useFrame(({ mouse, camera, viewport }) => {
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
      <planeGeometry attach="geometry" args={[3, 3]} />
      <meshBasicMaterial transparent attach="material" map={texture} />
    </mesh>
  );
}

Hand.getInitialProps = () => {
  const statusCode = 404;
  return { statusCode };
};

export default Hand;
