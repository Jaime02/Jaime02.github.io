import { CameraControls } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useSceneContext } from "./SceneContext";
import { useEffect, useRef } from "react";

export class CameraState {
  position: THREE.Vector3;
  target: THREE.Vector3;
  orbiting: boolean;
  animated: boolean;
  enableUserControls: boolean;

  constructor({
    position,
    target,
    orbiting = false,
    animated = true,
    enableUserControls = false,
  }: {
    position: THREE.Vector3;
    target: THREE.Vector3;
    orbiting?: boolean;
    animated?: boolean;
    enableUserControls?: boolean;
  }) {
    this.position = position;
    this.target = target;
    this.orbiting = orbiting;
    this.animated = animated;
    this.enableUserControls = enableUserControls;
  }
}

export function ControlledCamera({ state }: { state: CameraState }) {
  const { position, target, orbiting, animated, enableUserControls } = state;
  const { cameraRef } = useSceneContext();
  const startTimeOffset = useRef<number>(0);
  useEffect(() => {
    if (orbiting) {
      startTimeOffset.current = performance.now() / 1000;
    }
  }, [orbiting]);

  const radius = 4;
  const speed = 0.15;

  useFrame(({ clock }, delta) => {
    if (orbiting) {
      const elapsedTime = clock.getElapsedTime() - (startTimeOffset.current || 0);
      const angle = elapsedTime * speed + Math.PI / 2;
      const x = target.x + radius * Math.cos(angle);
      const z = target.z + radius * Math.sin(angle);
      cameraRef.current?.setPosition(x + position.x, target.y + position.y, z + position.z, animated);
      cameraRef.current?.setTarget(target.x, target.y, target.z, animated);
    } else if (!enableUserControls) {
      cameraRef.current?.setPosition(position.x, position.y, position.z, animated);
      cameraRef.current?.setTarget(target.x, target.y, target.z, animated);
    }
    cameraRef.current?.update(delta);
  });
  if (enableUserControls) {
    cameraRef.current?.setPosition(position.x, position.y, position.z, animated);
    cameraRef.current?.setTarget(target.x, target.y, target.z, animated);
  }
  return <CameraControls ref={cameraRef} enabled={enableUserControls} />;
}
