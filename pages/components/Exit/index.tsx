import { MeshProps } from "@react-three/fiber";
import { useState } from "react";
import { DoubleSide } from "three";
import { Scene, useStore } from "../../../store";

export default function Exit(p: MeshProps & { scene: Scene }) {
  const store = useStore();
  const [hover, setHover] = useState(false);
  return (
    <mesh
      onClick={() => store.setScene(p.scene)}
      rotation={p.rotation}
      position={p.position}
      onPointerOver={() => {
        setHover(true);
        // p.onPointerOver(ref);
      }}
      onPointerLeave={() => {
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