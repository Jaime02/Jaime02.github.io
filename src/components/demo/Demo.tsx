import { Suspense, useEffect, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { useGLTF, CameraControls } from "@react-three/drei";
import FullScreenButton from "@/components/demo/FullScreenButton";
import LoadingScreen from "@/components/demo/LoadingScreen";
import { SceneContextProvider, useSceneContext } from "@/components/demo/SceneContext";

function Scene() {
  const {camera, machineScene, factoryScene, currentHtmlComponent} = useSceneContext();

  return (
    <>
      <ambientLight intensity={0.8} />
      <pointLight position={[0, 3, 1]} intensity={4} decay={0.8} />
      <primitive object={machineScene} />
      <primitive object={factoryScene} />
      {currentHtmlComponent}
      {camera}
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
          <SceneContextProvider>
            <Scene />
          </SceneContextProvider>
        </Canvas>
      </Suspense>
      <FullScreenButton refDemo={refDemo} />
    </div>
  );
}

useGLTF.preload("/WebTaller/blender/ABX.glb");
