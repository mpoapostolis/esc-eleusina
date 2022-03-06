import { useSpring, animated, config } from "@react-spring/three";
import { useFrame, useLoader, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import { Mesh, TextureLoader } from "three";
import { useStore } from "../../store";

function H(props: { src: string }) {}

export function Hand() {
  const store = useStore();
  const found = store.inventory.find((s) => store.hand === s._id);
  const [src, setSrc] = useState<string>();
  const [vissible, setVissible] = useState(false);

  useEffect(() => {
    if (store.hand) {
      setVissible(true);
      setSrc(found?.src);
    } else {
      setVissible(false);
    }
  }, [store.hand, found]);

  useFrame(({ mouse, camera, viewport }) => {
    if (ref.current) {
      ref.current.position.copy(camera.position);
      ref.current.rotation.copy(camera.rotation);
      ref.current.translateZ(-0.5);
      ref.current.translateX((viewport.width / 20) * mouse.x);
      ref.current.translateY((viewport.height / 20) * mouse.y);
      ref.current?.lookAt(camera.position);
    }
  });
  const ref = useRef<Mesh>();
  const texture = useLoader(TextureLoader, src ?? "/images/empty.png");

  const { scale } = useSpring({
    scale: vissible ? 0.5 : 0,
    config: config.wobbly,
  });

  return (
    <animated.mesh scale={scale} ref={ref}>
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial
        transparent
        opacity={1}
        color="white"
        attach="material"
        map={texture}
      />
    </animated.mesh>
  );
}

Hand.getInitialProps = () => {
  const statusCode = 404;
  return { statusCode };
};

export default Hand;
