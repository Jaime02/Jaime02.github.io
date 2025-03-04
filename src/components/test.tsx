import React, { useEffect, useRef, useState } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { ArcballControls, CameraControls } from "@react-three/drei";
import { CameraMovementState, CameraState } from "@/components/three/ControlledCamera";

function CameraController({ state }: { state: CameraState }) {
  const { position, target, movementState, animated, orbitingRadius, minDistance, maxDistance } = state;

  const cameraRef = useRef(null);
  const arcballRef = useRef(null);
  let camera = useThree((state) => state.camera);

  useEffect(() => {
    if (!arcballRef.current || !cameraRef.current) {
      return;
    }

    let p = camera.position.clone();
    if (movementState != CameraMovementState.Draggable) {
      console.log("Arcball reset");
      arcballRef.current.reset();
      arcballRef.current.enabled = false;
      cameraRef.current.enabled = true;
    } else {
      console.log("Camera reset");
      cameraRef.current.reset();
      cameraRef.current.enabled = false;
      arcballRef.current.enabled = true;
    }
    console.log(camera.position, p);
    camera.position.copy(p);
  }, [camera, movementState]);

  return (
    <>
      <CameraControls ref={cameraRef}/>
      <ArcballControls
        ref={arcballRef}
        enableRotate={true}
        enablePan={false}
        enableZoom={true}
        dampingFactor={10}
      />
    </>
  );
}

const arcballState = new CameraState({
  movementState: CameraMovementState.Draggable,
  orbitingRadius: 2,
  animated: true,
});

const orbitingState = new CameraState({
  movementState: CameraMovementState.Orbiting,
  orbitingRadius: 5,
  animated: true,
});

export default function Scene() {
  const [controlIndex, setControlIndex] = useState(0);
  const [cameraState, setCameraState] = useState(arcballState);
  const toggleControlStyle = () => {
    if (controlIndex === 0) {
      setCameraState(orbitingState);
    } else {
      setCameraState(arcballState);
    }
    setControlIndex((prev) => (prev + 1) % 2);
  };

  return (
    <div className="h-[640px]">
      <button onClick={toggleControlStyle}>Change camera controller</button>
      <div>{cameraState.movementState == 2 ? "Draggable, Arcball" : "Orbiting, Camera controls"} {controlIndex}</div>
      <Canvas className="h-[240px]">
        <CameraController state={cameraState} />
        <gridHelper args={[10, 10]} />
        <axesHelper args={[8]} />
      </Canvas>
    </div>
  );
}
