import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Center, OrbitControls, useGLTF } from "@react-three/drei";

function Model({ url }: { url: string }) {
  const { scene } = useGLTF(url);
  return (
    <Center>
      <primitive object={scene} />
    </Center>
  );
}

export default function PartExpositor({ modelUrl }: { modelUrl: string }) {
  return (
    <div className="w-[50%] aspect-square bg-gray-100 rounded-lg">
      <Canvas camera={{ position: [5, 5, 5], fov: 50 }}>
        <Suspense fallback={null}>
          <Model url={modelUrl} />
        </Suspense>
        <OrbitControls enableZoom={false} enablePan={false} />
      </Canvas>
    </div>
  );
}
