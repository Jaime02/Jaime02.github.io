import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { useGLTF, useAnimations } from "@react-three/drei";
import * as THREE from "three";
import { useTranslationsFromUrl } from "@/i18n/translations";
import SignComponent from "./SignComponent";
import { CameraState } from "@/components/three/ControlledCamera";

export type SceneContextType = {
  scene: THREE.Group<THREE.Object3DEventMap>;
  goToPreviousState: (() => void) | null;
  goToNextState: (() => void) | null;
  currentHtmlComponent: React.ReactNode;
  cameraState: CameraState;
};

const SceneContext = createContext<SceneContextType>({} as SceneContextType);

interface DemoStateProps {
  name: string;
  htmlElement?: React.ReactNode;
  cameraState: CameraState;
}

class DemoState {
  name: string;
  htmlElement?: React.ReactNode;
  cameraState: CameraState;
  constructor({ name, htmlElement, cameraState }: DemoStateProps) {
    this.name = name;
    this.htmlElement = htmlElement;
    this.cameraState = cameraState;
  }
}

export function SceneContextProvider({ children }: { children: React.ReactNode }) {
  const t = useTranslationsFromUrl(new URL(window.location.href));
  const { scene, nodes, materials, animations } = useGLTF("/blender/Scene.glb");

  const { actions } = useAnimations(animations, scene);

  const availableStatuses = [
    new DemoState({
      name: "Welcome",
      htmlElement: <SignComponent text={t("demo", "start")} position={new THREE.Vector3(0, 3, 0)} />,
      cameraState: new CameraState({
        position: new THREE.Vector3(0, 1.5, 0),
        target: new THREE.Vector3(0, 1.5, 0),
        orbiting: true,
      }),
    }),
    new DemoState({
      name: "OpenMachine",
      cameraState: new CameraState({
        position: new THREE.Vector3(-1, 1.6, 2),
        target: new THREE.Vector3(0, 1.2, 0),
        enableUserControls: true,
      }),
      htmlElement: <SignComponent text="Segundo estado" position={new THREE.Vector3(0, 2.5, 0)} />,
    }),
  ];

  const [currentStateIndex, setCurrentStateIndex] = useState(0);
  const currentState = useMemo(() => availableStatuses[currentStateIndex], [currentStateIndex, availableStatuses]);

  const goToNextState = useCallback(() => {
    if (currentStateIndex === availableStatuses.length - 1) {
      console.warn("No more states to go to");
      return;
    }
    setCurrentStateIndex((prev) => prev + 1);
  }, [currentStateIndex, availableStatuses.length]);

  const goToPreviousState = useCallback(() => {
    if (currentStateIndex === 0) {
      console.warn("No more states to go to");
      return;
    }
    setCurrentStateIndex((prev) => prev - 1);
  }, [currentStateIndex]);

  const playAnimation = (name: string, options?: { loop?: boolean; backwards?: boolean }) => {
    const action = actions[name];
    if (!action) {
      console.warn(`Animation "${name}" not found.`);
      return;
    }

    action.clampWhenFinished = true;
    action.timeScale = options?.backwards ? -1 : 1;
    action.setLoop(options?.loop ? THREE.LoopPingPong : THREE.LoopOnce, 1);

    if (!options?.backwards) {
      if (action.time === 0) {
        action.reset();
      }
      action.play();
    } else {
      action.paused = false;
    }
  };

  const cameraState = useMemo(() => currentState.cameraState, [currentState]);
  const currentHtmlComponent = useMemo(() => currentState.htmlElement, [currentState]);

  return (
    <SceneContext.Provider
      value={{
        scene,
        goToPreviousState: currentStateIndex !== 0 ? goToPreviousState : null,
        goToNextState: currentStateIndex !== availableStatuses.length - 1 ? goToNextState : null,
        currentHtmlComponent,
        cameraState,
      }}
    >
      {children}
    </SceneContext.Provider>
  );
}

export function useSceneContext(): SceneContextType {
  const context = useContext(SceneContext);
  if (!context) {
    throw new Error("useSceneContext must be used within a SceneContextProvider");
  }
  return context;
}

useGLTF.preload("/blender/ABX.glb");
