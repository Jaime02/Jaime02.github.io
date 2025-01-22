import { useSceneContext } from "@/components/demo/SceneContext";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import IconArrowBackward from "@/img/IconArrowBackward";
import IconArrowForward from "@/img/IconArrowForward";

export default function SignComponent({ position, text }: { position: THREE.Vector3; text: string }) {
  const { goToNextState, goToPreviousState } = useSceneContext();

  return (
    <Html position={position} transform scale={0.5} sprite={true}>
      <div className="flex flex-col gap-2 rounded-md p-2 bg-black" onPointerDown={(e) => e.stopPropagation()}>
        <span className="text-white text-center">{text}</span>
        <div className="flex flex-row gap-2">
          {goToPreviousState && (
            <button onClick={() => goToPreviousState()} className="btn-secondary grow">
              <IconArrowBackward extraClasses="size-6" />
            </button>
          )}
          {goToNextState && (
            <button onClick={() => goToNextState()} className="btn-primary grow">
              <IconArrowForward extraClasses="size-6" />
            </button>
          )}
        </div>
      </div>
    </Html>
  );
}
