import { Suspense, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import FullScreenButton from "@/components/demo/FullScreenButton";
import LoadingScreen from "@/components/demo/LoadingScreen";
import { SceneContextProvider, useSceneContext } from "@/components/demo/SceneContext";
import {ControlledCamera} from "./ControlledCamera";

function Scene() {
  const {cameraState, scene, currentHtmlComponent} = useSceneContext();

  return (
    <>
      <ambientLight intensity={0.8} />
      <pointLight position={[0, 3, 1]} intensity={4} decay={0.8} />
      <primitive object={scene} />
      {currentHtmlComponent}
      <ControlledCamera state={cameraState}/>
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
        <Canvas gl={{ antialias: true }} className="max-w-full rounded-md">
          <SceneContextProvider>
            <Scene />
          </SceneContextProvider>
        </Canvas>
        <FullScreenButton refDemo={refDemo} />
      </Suspense>
    </div>
  );
}
