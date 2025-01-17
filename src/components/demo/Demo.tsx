import { Suspense, useRef, useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF, Html, useAnimations } from "@react-three/drei";
import * as THREE from "three";
import FullScreenButton from "@/components/demo/FullScreenButton";
import LoadingScreen from "@/components/demo/LoadingScreen";
import Machine from "@/components/demo/Machine";


function MachineComponent() {
  const {
    scene: machineScene,
    nodes: machineNodes,
    materials: machineMaterials,
    animations: machineAnimations,
  } = useGLTF("/WebTaller/blender/ABX.glb");

  this.animations = useAnimations(machineAnimations, machineScene);
  
}


function Scene() {
  const refMachine = useRef<THREE.Group>(null);
  const machine = new Machine();

  const { scene: glbFactoryScene } = useGLTF("/WebTaller/blender/Factory.glb");
  const [isDoorOpen, setIsDoorOpen] = useState(false);

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
      <Html position={[1, 1.5, 1.6]} transform>
        <div
          className="bg-red-500 font-comic rounded-md px-2"
          onPointerDown={(e) => e.stopPropagation()}
        >
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

export default function DemoComponent() {
  const refDemo = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={refDemo}
      className="aspect-video max-w-full max-h-[90vh] relative"
    >
      <Suspense fallback={<LoadingScreen />}>
        <Canvas gl={{ antialias: true }} className="max-w-full">
          <Scene />
        </Canvas>
      </Suspense>
      <FullScreenButton refDemo={refDemo} />
    </div>
  );
}

useGLTF.preload("/WebTaller/blender/ABX.glb");
