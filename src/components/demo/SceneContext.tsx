import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useGLTF, useAnimations, CameraControls } from "@react-three/drei";
import * as THREE from "three";
import { Html } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";

class CameraPosition {
  position: THREE.Vector3;
  target: THREE.Vector3;

  constructor(position: THREE.Vector3, target: THREE.Vector3) {
    this.position = position;
    this.target = target;
  }
}

const SceneContext = createContext<any>({
  machineScene: null,
  factoryScene: null,
  playAnimation: null,
  goToNextState: null,
  materials: null,
  nodes: null,
  animations: null,
  currentHtmlComponent: null,
});

function ControlledCamera(
  cameraPosition?: CameraPosition,
  orbiting: boolean = false,
  animated: boolean = true,
) {
  const ref = useRef<CameraControls>(null!);
  if (cameraPosition) {
    if (orbiting) {
      const radius = 4;
      const speed = 0.15;
      const center = new THREE.Vector3(0, 1, 0);
      const positionOffset = new THREE.Vector3(0, 1.4, 0);

      useFrame(({ clock }) => {
        const elapsedTime = clock.getElapsedTime();
        const x = center.x + radius * Math.cos(elapsedTime * speed);
        const z = center.z + radius * Math.sin(elapsedTime * speed);

        // Update the camera's position
        ref.current.setPosition(
          x + positionOffset.x,
          center.y + positionOffset.y,
          z + positionOffset.z,
          animated,
        );

        // Ensure the camera keeps looking at the center
        ref.current.setTarget(center.x, center.y, center.z, animated);
      });
    } else {
      ref.current.setPosition(
        cameraPosition.position.x,
        cameraPosition.position.y,
        cameraPosition.position.z,
        animated,
      );
      ref.current.setTarget(
        cameraPosition.target.x,
        cameraPosition.target.y,
        cameraPosition.target.z,
        animated,
      );
    }
  }

  return <CameraControls ref={ref} />;
}

function HtmlComponent() {
  const { playAnimation } = useSceneContext();

  return (
    <Html position={[2, 1.2, 1.2]} transform>
      <div
        className="flex flex-col font-comic gap-2 rounded-md p-2 bg-red-500"
        onPointerDown={(e) => e.stopPropagation()}
      >
        <button
          onClick={() => playAnimation("Door")}
          className="bg-white text-black rounded-md px-2 py-1"
        >
          Open door
        </button>
        <button
          onClick={() => playAnimation("Door", { backwards: true })}
          className="bg-white text-black rounded-md px-2 py-1"
        >
          Close door
        </button>
      </div>
    </Html>
  );
}

function WelcomeButton() {
  const { goToNextState } = useSceneContext();
  return (
    <Html position={[2, 1.2, 1.2]}>
      <button
        onClick={() => goToNextState()}
        className="bg-white text-black rounded-md px-2 py-1"
      >
        Start
      </button>
    </Html>
  );
}

class DemoState {
  name: string;
  htmlElement?: React.ReactNode;
  cameraPosition?: CameraPosition;
  constructor(
    name: string,
    htmlElement?: React.ReactNode,
    cameraPosition?: CameraPosition,
  ) {
    this.name = name;
    this.htmlElement = htmlElement;
    this.cameraPosition = cameraPosition;
  }

  getCamera() {
    return (
      <ControlledCamera
        cameraPosition={this.cameraPosition}
        orbiting={this.name === "Welcome"}
      />
    );
  }
}

export function SceneContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const {
    scene: machineScene,
    nodes: machineNodes,
    materials: machineMaterials,
    animations: machineAnimations,
  } = useGLTF("/WebTaller/blender/ABX.glb");

  const { scene: factoryScene } = useGLTF("/WebTaller/blender/Factory.glb");
  const { actions } = useAnimations(machineAnimations, machineScene);

  const availableStatuses = useMemo(
    () => [
      new DemoState("Welcome", <WelcomeButton />),
      new DemoState(
        "OpenMachine",
        null,
        new CameraPosition(
          new THREE.Vector3(0, 1.5, 0),
          new THREE.Vector3(0, 1.5, 0),
        ),
      ),
    ],
    [],
  );

  const [currentStateIndex, setCurrentStateIndex] = useState(0);
  const currentState = availableStatuses[currentStateIndex];

  const goToNextState = useCallback(() => {
    if (currentStateIndex === availableStatuses.length - 1) {
      console.warn("No more states to go to");
      return;
    }
    console.log(`Going to next state ${currentStateIndex + 1}`);
    setCurrentStateIndex((prev) => prev + 1);
  }, [currentStateIndex, availableStatuses.length]);

  const playAnimation = (
    name: string,
    options?: { loop?: boolean; backwards?: boolean },
  ) => {
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

  const cameraRef = useRef<CameraControls>(null);

  useEffect(() => {
    cameraRef.current?.setLookAt(-1.4, 2.5, 2.2, 0, 0.6, 0);
  }, []);

  const camera = useMemo(() => {
    return <ControlledCamera />;
  }, [currentState]);

  return (
    <SceneContext.Provider
      value={{
        camera,
        machineScene,
        factoryScene,
        playAnimation,
        goToNextState,
        materials: machineMaterials,
        nodes: machineNodes,
        animations: machineAnimations,
        currentHtmlComponent: availableStatuses[currentStateIndex].htmlElement,
      }}
    >
      {children}
    </SceneContext.Provider>
  );
}

export function useSceneContext() {
  const context = useContext(SceneContext);
  if (context === undefined) {
    throw new Error(
      "useSceneContext must be used within a SceneContextProvider",
    );
  }
  return context;
}
