import { useSpring, animated, config } from "@react-spring/three";
import { useFrame, useLoader, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import { Mesh, TextureLoader } from "three";
import useMutation from "../../Hooks/useMutation";
import { useInventory, useItem } from "../../lib/inventory";
import { useItems } from "../../lib/items";
import { useStore } from "../../store";

export function Hand() {
  const store = useStore();
  const { data: items } = useItems();
  const { data: inventory } = useInventory();
  const invHas = (id?: string) => inventory.map((e) => e._id).includes(id);
  const [_useItem] = useMutation(useItem, [
    `/api/inventory?scene=${store.scene}`,
  ]);
  const found = items.find((s) => store.hand === s._id);
  const [src, setSrc] = useState<string>();
  const [vissible, setVissible] = useState(false);
  const collectables = items
    .filter(
      (e) => e.collectableIfHandHas === store.hand && e.scene === store.scene
    )
    ?.map((e) => invHas(e._id));

  const dispose = collectables.length > 0 && collectables?.every(Boolean);

  useEffect(() => {
    if (!store.hand || !dispose) return;
    _useItem(store.hand);
    store.setHand(undefined);
  }, [inventory, dispose, store.hand]);
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
    scale: vissible ? 0.1 : 0,
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
