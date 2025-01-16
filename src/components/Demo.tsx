import { Suspense, useRef, useState, useEffect } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls, useGLTF, Html, useAnimations } from "@react-three/drei";
import * as THREE from "three";

class Machine {
  machineNodes: { [name: string]: THREE.Object3D };
  machineMaterials: { [name: string]: THREE.Material };

  door: THREE.Object3D;

  constructor(
    machineNodes: { [name: string]: THREE.Object3D },
    machineMaterials: { [name: string]: THREE.Material },
  ) {
    this.machineNodes = machineNodes;
    this.machineMaterials = machineMaterials;
    /*for (const node of Object.values(this.machineNodes)) {
      console.log(node);
    }*/
    this.door = this.machineNodes["Door"];
  }

  getMeshes() {
    const meshes: THREE.Mesh[] = [];
    for (const node of Object.values(this.machineNodes)) {
      if (node instanceof THREE.Mesh) {
        meshes.push(node);
      }
    }
    return meshes;
  }

  toggleDoor() {
    console.log(this.door);
  }
}

function Scene() {
  const refMachine = useRef<THREE.Group>(null);
  const { scene: machineScene, nodes: machineNodes, materials: machineMaterials, animations: machineAnimations } = useGLTF(
    "/WebTaller/blender/ABX.glb",
  );
  const machine = new Machine(machineNodes, machineMaterials);

  const { scene: glbFactoryScene } = useGLTF("/WebTaller/blender/Factory.glb");
  const [isDoorOpen, setIsDoorOpen] = useState(false);

  const modelAnimations = useAnimations(machineAnimations, machineScene);

  useEffect(() => {
    // Play all animations when the component mounts
    if (modelAnimations && modelAnimations.actions) {
      // Play each animation in the actions collection
      for (const action of Object.values(modelAnimations.actions)) {
        action?.play();
      }
    }
  }, [modelAnimations]); // Run when modelAnimations changes

  return (
    <>
      <ambientLight intensity={0.8} />
      <pointLight position={[0, 3, 1]} intensity={4} decay={0.8} />
      <group ref={refMachine}>
        {machine.getMeshes().map((mesh, index) => (
          <mesh
            key={index}
            geometry={mesh.geometry}
            material={mesh.material}
            position={mesh.position}
            rotation={mesh.rotation}
            scale={mesh.scale}
          />
        ))}
      </group>
      <Html position={[1, 1.05, -0.09]} transform>
        <div className="bg-red-500 font-comic rounded-md px-2">
          <p>Pitooo</p>
          <button
            onClick={() => machine.toggleDoor()}
            className="bg-white text-black rounded-md px-2 py-1"
          >
            {isDoorOpen ? "Close door" : "Open door"}
          </button>
        </div>
      </Html>
      <primitive object={glbFactoryScene} />
      <OrbitControls />
    </>
  );
}

export default function Demo() {
  const refDemo = useRef<HTMLDivElement>(null);

  const [isFullscreen, setIsFullscreen] = useState(false);

  // Check if fullscreen is active on mount
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      refDemo.current?.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  const fullscreenButtonSource = isFullscreen
    ? "/WebTaller/img/CloseFullscreen.svg"
    : "/WebTaller/img/OpenFullscreen.svg";

  return (
    <div
      ref={refDemo}
      className="aspect-video max-w-full max-h-[90vh] relative"
    >
      <Suspense fallback={<p>Loading...</p>}>
        <Canvas className="max-w-full">
          <Scene />
        </Canvas>
      </Suspense>
      <button
        onClick={toggleFullscreen}
        className="absolute top-2 right-2 bg-white rounded-md"
      >
        <img
          className="size-8"
          src={fullscreenButtonSource}
          alt="Toggle fullscreen"
        />
      </button>
    </div>
  );
}

useGLTF.preload("/WebTaller/blender/ABX.glb");
