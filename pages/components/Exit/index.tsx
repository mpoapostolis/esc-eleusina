import { MeshProps } from "@react-three/fiber";
import { useState } from "react";
import { DoubleSide } from "three";
import { HelpKey, Scene, useStore } from "../../../store";

export default function Exit(p: MeshProps & { scene: Scene; hover: HelpKey }) {
  const store = useStore();
  const [hover, setHover] = useState(false);
  return (
    <mesh
      onClick={() => store.setScene(p.scene)}
      rotation={p.rotation}
      position={p.position}
      onPointerOver={() => {
        store.setTmpHint(p.hover);
        setHover(true);
        // p.onPointerOver(ref);
      }}
      onPointerLeave={() => {
        store.setTmpHint(undefined);
        store.setIsHintVisible(false);
        setHover(false);
        // p.onPointerOver(null);
      }}
    >
      <boxGeometry args={[8, 8, 1]} />
      <meshPhongMaterial
        color="#ffff00"
        side={DoubleSide}
        opacity={hover ? 0.7 : 0.3}
        transparent
      />
    </mesh>
  );
}
