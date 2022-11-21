import { Canvas } from "@react-three/fiber";
import { Controllers, Hands, VRButton, XR } from "@react-three/xr";

export default function Test() {
  return (
    <>
      <VRButton />
      <Canvas vr>
        <mesh>
          <boxGeometry />
          <meshBasicMaterial color="blue" />
        </mesh>
      </Canvas>
    </>
  );
}
