import { ArcballControls, CameraControls } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";

import { useEffect, useRef } from "react";
import { Vector3 } from "three";

export enum CameraMovementState {
  Static = 0,
  Orbiting = 1,
  Draggable = 2,
}

export class CameraState {
  position: Vector3 | undefined;
  target: Vector3;
  movementState: CameraMovementState;
  orbitingRadius: number;
  animated: boolean;
  minDistance: number;
  maxDistance: number;

  constructor({
    position,
    target = new Vector3(0, 0, 0),
    movementState = CameraMovementState.Draggable,
    orbitingRadius = 4,
    animated = true,
    minDistance = 1,
    maxDistance = 20,
  }: {
    position?: Vector3;
    target?: Vector3;
    movementState?: CameraMovementState;
    orbitingRadius?: number;
    animated?: boolean;
    minDistance?: number;
    maxDistance?: number;
  }) {
    this.position = position;
    this.target = target;
    this.movementState = movementState;
    this.orbitingRadius = orbitingRadius;
    this.animated = animated;
    this.minDistance = minDistance;
    this.maxDistance = maxDistance;
  }
}

export function ControlledCamera({ state }: { state: CameraState }) {
  const { position, target, movementState, animated, orbitingRadius } = state;
  const cameraRef = useRef<CameraControls>(null);
  const startTimeOffset = useRef<number>(0);
  const initialPosition = useRef<Vector3 | null>(null);
  const speed = 0.15;

  useEffect(() => {
    if (movementState == CameraMovementState.Orbiting) {
      startTimeOffset.current = performance.now() / 1000;

      // Capture the current camera position when entering orbiting mode
      if (cameraRef.current) {
        const currentPosition = new Vector3();
        cameraRef.current.getPosition(currentPosition);
        initialPosition.current = currentPosition;

        // Calculate the initial angle based on current position relative to target
        const dx = currentPosition.x - target.x;
        const dz = currentPosition.z - target.z;
        const currentAngle = Math.atan2(dz, dx);

        // Adjust the time offset to match the current angle
        startTimeOffset.current = performance.now() / 1000 - (currentAngle - Math.PI / 2) / speed;
      }
    }
  }, [movementState, target, speed]);

  useFrame(({ clock }, delta) => {
    if (movementState == CameraMovementState.Orbiting && cameraRef.current) {
      const elapsedTime = clock.getElapsedTime() - (startTimeOffset.current || 0);
      const angle = elapsedTime * speed + Math.PI / 2;
      const x = target.x + orbitingRadius * Math.cos(angle);
      const z = target.z + orbitingRadius * Math.sin(angle);

      // Add a vertical offset to position the camera higher than the target
      const yOffset = orbitingRadius * 0.5; // Adjust this value to control how high the camera is

      if (position) {
        cameraRef.current.setPosition(x + position.x, target.y + position.y + yOffset, z + position.z, animated);
        state.position = new Vector3(x + position.x, target.y + position.y + yOffset, z + position.z);
      } else {
        cameraRef.current.setPosition(x, target.y + yOffset, z, animated);
        state.position = new Vector3(x, target.y + yOffset, z);
      }
      cameraRef.current.setTarget(target.x, target.y, target.z, animated);
    }
    if (cameraRef.current) {
      cameraRef.current.update(delta);
    }
  });

  // Always return CameraControls with the ref, but configure it differently based on movement state
  return <CameraControls ref={cameraRef} enabled={movementState === CameraMovementState.Draggable} minDistance={state.minDistance} maxDistance={state.maxDistance} />;
}
