import { Suspense, useRef } from "react";
import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import { Center, OrbitControls, useGLTF } from "@react-three/drei";
import { TextureLoader, DirectionalLight, Matrix4, CubeTextureLoader } from "three";

function Model({ url }: { url: string }) {
  const { nodes } = useGLTF(url);
  const [colorMap, metalMap, normalMap, roughnessMap] = useLoader(TextureLoader, [
    "/blender/PiezaGrupilla/Poliigon_MetalSteelBrushed_7174_BaseColor.jpg",
    "/blender/PiezaGrupilla/Poliigon_MetalSteelBrushed_7174_Metallic.jpg",
    "/blender/PiezaGrupilla/Poliigon_MetalSteelBrushed_7174_Normal.png",
    "/blender/PiezaGrupilla/Poliigon_MetalSteelBrushed_7174_Roughness.jpg",
  ]);
  const path = "/blender/background/";
  const format = ".jpg";
  const urls = [path + "px" + format, path + "nx" + format, path + "py" + format, path + "ny" + format, path + "pz" + format, path + "nz" + format];

  const reflectionCube = new CubeTextureLoader().load(urls);

  return (
    <Center>
      <group>
        <mesh geometry={nodes.Cube.geometry}>
          <meshPhysicalMaterial
            map={colorMap}
            metalness={0.9}
            roughness={0.5}
            normalMap={normalMap}
            normalScale={[0.3, 0.3]}
            roughnessMap={roughnessMap}
            envMapIntensity={1}
            clearcoat={0.1}
            envMap={reflectionCube}
            clearcoatRoughness={0.4}
          />
        </mesh>
      </group>
    </Center>
  );
}

function Scene({ children }: { children: React.ReactNode }) {
  const lightRef = useRef<DirectionalLight>(null);
  const { camera } = useThree();
  useFrame(() => {
    if (lightRef.current) {
      const cameraPosition = camera.position.clone();
      // Create rotation matrix for 90 degrees around Z axis
      const rotationMatrix = new Matrix4();
      rotationMatrix.makeRotationY(Math.PI / 2);
      // Apply rotation to camera position vector
      cameraPosition.applyMatrix4(rotationMatrix);
      // Update light position
      lightRef.current.position.copy(cameraPosition);
    }
  });
  return (
    <>
      <directionalLight intensity={15} castShadow ref={lightRef} />
      {children}
    </>
  );
}

export default function PartExpositor({ modelUrl }: { modelUrl: string }) {
  return (
    <Canvas camera={{ position: [10, 10, 10], fov: 50 }}>
      <Suspense fallback={null}>
        <Scene>
          <Model url={modelUrl} />
        </Scene>
      </Suspense>
      <OrbitControls enableZoom={false} enablePan={false} />
    </Canvas>
  );
}
