import { Canvas } from "@react-three/fiber";
import React, { Suspense } from "react";
import { Environment, OrbitControls, Plane } from "@react-three/drei";
import { DoubleSide } from "three";

function ReOrder() {
  return (
    <div className="canvas">
      <Canvas camera={{ position: [0, 0, 8] }} className="canvas">
        <OrbitControls />
        <Suspense fallback="loading...">
          <Environment
            background
            files={[
              "/scenes/miniGame/px.jpg",
              "/scenes/miniGame/nx.jpg",
              "/scenes/miniGame/py.jpg",
              "/scenes/miniGame/ny.jpg",
              "/scenes/miniGame/pz.jpg",
              "/scenes/miniGame/nz.jpg",
            ]}
          />
        </Suspense>
        <Plane
          args={[50, 50]}
          position={[0, -5, -4]}
          rotation={[Math.PI / 2, 0, 0]}
        >
          <meshBasicMaterial side={DoubleSide} />
        </Plane>
      </Canvas>
    </div>
  );
}

ReOrder.getInitialProps = () => {
  const statusCode = 404;
  return { statusCode };
};

export default ReOrder;
