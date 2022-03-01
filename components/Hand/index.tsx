import { useFrame, useLoader, useThree } from "@react-three/fiber";
import { useRef } from "react";
import { Mesh, TextureLoader } from "three";
import { useStore } from "../../store";

export function Hand() {
  const store = useStore();
  const found = store.inventory.find((s) => store.hand === s.id);
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
  if (!found) return null;
  const texture = useLoader(TextureLoader, found.src);
  return (
    <sprite scale={10} ref={ref} position={[20, -5, 0]}>
      <spriteMaterial attach="material" map={texture} />
    </sprite>
  );
}

Hand.getInitialProps = () => {
  const statusCode = 404;
  return { statusCode };
};

export default Hand;
