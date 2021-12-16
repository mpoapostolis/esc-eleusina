import React, { useRef } from "react";
import { useGLTF } from "@react-three/drei";
import { GroupProps } from "@react-three/fiber";

function Column(props: GroupProps) {
  const group = useRef();
  const { scale, ...rest } = props;
  //   @ts-ignore
  const { nodes } = useGLTF("/models/Column_Made_By_Tyro_Smith.glb");
  return (
    <group ref={group} {...rest} dispose={null}>
      <mesh
        scale={scale ?? 1.5}
        castShadow
        receiveShadow
        geometry={nodes.Cylinder001.geometry}
        material={nodes.Cylinder001.material}
        position={[0, -5.5, 0]}
      />
    </group>
  );
}

useGLTF.preload("/Column_Made_By_Tyro_Smith.glb");

Column.getInitialProps = () => {
  const statusCode = 404;
  return { statusCode };
};

export default Column;
