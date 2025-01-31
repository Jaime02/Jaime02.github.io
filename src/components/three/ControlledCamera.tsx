import { CameraControls } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";

import { useEffect, useRef } from "react";
import { Vector3 } from "three";

export class CameraState {
  position: Vector3 | undefined;
  target: Vector3;
  orbiting: boolean;
  orbitingRadius: number;
  animated: boolean;
  enableUserControls: boolean;

  constructor({
    position,
    target = new Vector3(0, 0, 0),
    orbiting = false,
    orbitingRadius = 4,
    animated = true,
    enableUserControls = false,
  }: {
    position?: Vector3;
    target?: Vector3;
    orbiting?: boolean;
    orbitingRadius?: number;
    animated?: boolean;
    enableUserControls?: boolean;
  }) {
    this.position = position;
    this.target = target;
    this.orbiting = orbiting;
    this.orbitingRadius = orbitingRadius;
    this.animated = animated;
    this.enableUserControls = enableUserControls;
  }
}

export function ControlledCamera({ state }: { state: CameraState }) {
  const { position, target, orbiting, animated, enableUserControls, orbitingRadius } = state;
  const cameraRef = useRef<CameraControls>(null);
  const startTimeOffset = useRef<number>(0);
  useEffect(() => {
    if (orbiting) {
      startTimeOffset.current = performance.now() / 1000;
    }
  }, [orbiting]);

  const speed = 0.15;

  useFrame(({ clock }, delta) => {
    if (orbiting) {
      const elapsedTime = clock.getElapsedTime() - (startTimeOffset.current || 0);
      const angle = elapsedTime * speed + Math.PI / 2;
      const x = target.x + orbitingRadius * Math.cos(angle);
      const z = target.z + orbitingRadius * Math.sin(angle);
      if (position) {
        cameraRef.current?.setPosition(x + position.x, target.y + position.y, z + position.z, animated);
      } else {
        cameraRef.current?.setPosition(x, target.y, z, animated);
      }
      cameraRef.current?.setTarget(target.x, target.y, target.z, animated);
    } else if (!enableUserControls) {
      if (position) {
        cameraRef.current?.setPosition(position.x, position.y, position.z, animated);
      }
      cameraRef.current?.setTarget(target.x, target.y, target.z, animated);
    }
    cameraRef.current?.update(delta);
  });

  if (enableUserControls) {
    if (position) {
      cameraRef.current?.setPosition(position.x, position.y, position.z, animated);
    }
    cameraRef.current?.setTarget(target.x, target.y, target.z, animated);
  }
  return <CameraControls ref={cameraRef} enabled={enableUserControls} />;
}
