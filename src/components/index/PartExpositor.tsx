import { Suspense, useRef, useState } from "react";
import { Canvas, useLoader } from "@react-three/fiber";
import { ArcballControls, Center, useGLTF } from "@react-three/drei";
import { TextureLoader, CubeTextureLoader, Vector3, CubeTexture } from "three";
import { ErrorBoundary } from "react-error-boundary";
import { CameraControls } from "@react-three/drei";
import { CameraState, ControlledCamera } from "@/components/three/ControlledCamera";

class Part {
  modelUrl: string;
  description: string;
  model: any;
  background: any;

  constructor(modelUrl: string, description: string) {
    this.modelUrl = modelUrl;
    this.description = description;
    this.model = useGLTF(this.modelUrl);
  }
}

class BackgroundCube {
  cubeTexture: CubeTexture;

  constructor(urls: string[]) {
    this.cubeTexture = new CubeTextureLoader().load(urls);
  }
}

function Model({ model, background }: { model: any; background: BackgroundCube }) {
  const { nodes } = model;
  const [roughness] = useLoader(TextureLoader, ["/materials/steel/roughness.png"]);
  return (
    <group>
      <mesh geometry={nodes.Cube.geometry}>
        <meshStandardMaterial color={"#ffffff"} metalness={1} roughness={0.8} roughnessMap={roughness} envMapIntensity={0.5} envMap={background.cubeTexture} />
      </mesh>
    </group>
  );
}

function Scene({ children, isHovered }: { children: React.ReactNode; isHovered: boolean }) {
  const cameraRef = useRef<CameraControls>(null);

  const positions = [
    new Vector3(5, 5, -5),
    new Vector3(5, 5, -5),
    new Vector3(5, 5, 5),
    new Vector3(5, -5, -5),
    new Vector3(5, -5, 5),
    new Vector3(-5, 5, -5),
    new Vector3(-5, 5, 5),
    new Vector3(-5, -5, -5),
  ];

  let cameraState = new CameraState({
    orbiting: true,
    orbitingRadius: 10,
    animated: true,
    enableUserControls: false,
  });

  if (isHovered) {
    cameraState = new CameraState({
      position: new Vector3(0, 1.5, 0),
      target: new Vector3(0, 1.5, 0),
      animated: true,
      enableUserControls: true,
    });
  }

  return (
    <>
      {Array.from({ length: positions.length }, (_, i) => (
        <spotLight key={i} color={"#ffffff"} intensity={400} position={positions[i]} />
      ))}
      {children}
      <ControlledCamera state={cameraState} />
    </>
  );
}

function SuspenseFallback() {
  // TODO
  return <p className="grow">Loading...</p>;
}

function CanvasFallback() {
  // TODO add fallback images
  return <p className="grow">No WebGL supported</p>;
}

export default function PartExpositor() {
  let parts = [new Part("/blender/PiezaGrupilla/PiezaGrupilla.glb", "Pieza grupilla, parece una colilla")];

  let [currentPartIndex, setCurrentPartIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const path = "/blender/background/";
  const format = ".png";
  let urls = [path + "px" + format, path + "nx" + format, path + "py" + format, path + "ny" + format, path + "pz" + format, path + "nz" + format];
  let background = new BackgroundCube(urls);

  const currentPart = parts[currentPartIndex];

  return (
    <div className="flex flex-row flex-wrap w-full h-full">
      <div className="select-none h-[50vh] aspect-square max-w-full">
        <Suspense fallback={<SuspenseFallback />}>
          <ErrorBoundary fallback={<CanvasFallback />}>
            <Canvas camera={{ position: [9, 9, 9], fov: 60 }} fallback={<CanvasFallback />} onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
              <Scene isHovered={isHovered}>
                <Center>
                  <Model model={currentPart.model} background={background} />
                </Center>
              </Scene>
              <ArcballControls enableRotate={true} enablePan={false} enableZoom={true} minDistance={10} distance maxDistance={20} dampingFactor={10} />
            </Canvas>
          </ErrorBoundary>
        </Suspense>
      </div>
      <div>{currentPart.description}</div>
    </div>
  );
}
