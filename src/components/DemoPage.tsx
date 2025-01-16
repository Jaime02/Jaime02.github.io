import { Suspense, useRef } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls, useGLTF, useFBX } from "@react-three/drei";
import * as THREE from 'three'

function Model() {
  const gltf = useGLTF("/WebTaller/blender/ABX.glb");
  return <primitive object={gltf.scene} />;
}


function Background() {
  const fbx = useFBX("/WebTaller/blender/Background.fbx");
  return(
    <primitive object={fbx} />
  )
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.8} />
      <hemisphereLight
        skyColor={0xb1e1ff}
        groundColor={0xb97a20}
        intensity={2}
      />
      <pointLight position={[2, 3, 4]} intensity={2} />
      <Suspense fallback={null}>
        <Model />
        <Background/>
      </Suspense>
      <OrbitControls />
    </>
  );
}

export default function DemoPageComponent() {
  const refButtonFullScreen = useRef<HTMLButtonElement>(null);
  const refCanvas = useRef<HTMLCanvasElement>(null);

  const fullscreenButtonSource = document.fullscreenElement ? `/WebTaller/img/CloseFullscreen.svg` :`/WebTaller/img/OpenFullscreen.svg`;
  return (
    <div className="aspect-video sm:px-4 w-full max-w-full relative">
      <Canvas ref={refCanvas} className="w-full max-w-full">
        <Scene />
      </Canvas>
      <button ref={refButtonFullScreen} onClick={() => refCanvas.current!.requestFullscreen()} className="absolute top-2 right-2"> 
        <img className="size-3" src={fullscreenButtonSource} alt="Toggle fullscreen" />
      </button>
    </div>
  );
}
