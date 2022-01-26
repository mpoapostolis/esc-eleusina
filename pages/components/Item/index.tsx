import * as THREE from "three";
import { MeshProps, useFrame, useLoader } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import { Box } from "@react-three/drei";
import { Mesh } from "three";
import { useStore } from "../../../store";

export type ImgName =
  | "scythe"
  | "doxeio1"
  | "doxeio2"
  | "emoji"
  | "dafni"
  | "book"
  | "stone"
  | "box"
  | "case"
  | "flower"
  | "garbage"
  | "key"
  | "lingerie"
  | "rock1"
  | "rock"
  | "wing1"
  | "wing";

const img: Record<ImgName, any> = {
  scythe: {
    src: "/images/scythe.png",
  },
  case: {
    src: "/images/test/6/case.png",
  },
  flower: {
    src: "/images/test/6/flower.png",
  },
  garbage: {
    src: "/images/test/6/garbage.png",
  },
  key: {
    src: "/images/test/6/key.png",
  },
  lingerie: {
    src: "/images/test/6/lingerie.png",
  },
  rock1: {
    src: "/images/test/6/rock1.png",
  },
  rock: {
    src: "/images/test/6/rock.png",
  },
  wing1: {
    src: "/images/test/6/wing1.png",
  },
  wing: {
    src: "/images/test/6/wing.png",
  },
  stone: {
    src: `/images/stone.png`,
  },
  doxeio1: {
    src: "https://img.icons8.com/ios/50/000000/wine-glass.png",
  },
  doxeio2: {
    src: "https://img.icons8.com/ios-glyphs/30/000000/vodka-shot.png",
  },
  emoji: {
    src: "/images/emoji.png",
  },
  dafni: {
    src: "https://img.icons8.com/office/40/000000/spa-flower.png",
  },
  book: {
    src: "https://img.icons8.com/ios/50/000000/open-book.png",
  },
  box: {
    src: "/images/woodenBox.png",
  },
};

function Item(
  props: MeshProps & {
    selectable?: boolean;
    name: ImgName;
    collectable?: boolean;
    onCollectError?: () => void;
    onCollectSucccess?: () => void;
    hideWhen?: boolean;
    opacity?: number;
  }
) {
  const src = img[props.name].src as string;
  const texture = useLoader(THREE.TextureLoader, src);
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
          const item = img[props.name];
          item.name = props.name;
          item.selectable = props.selectable;
          store.setInventory(item);
          if (props.onCollectSucccess) props.onCollectSucccess();
        } else {
          if (props.onCollectError) props.onCollectError();
        }
        if (props.onClick) props?.onClick(evt);
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
Item.getInitialProps = () => {
  const statusCode = 404;
  return { statusCode };
};

export default Item;
