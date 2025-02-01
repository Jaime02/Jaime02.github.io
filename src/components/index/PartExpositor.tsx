import { Suspense, useCallback, useMemo, useRef, useState, useTransition, useEffect } from "react";
import { Canvas, useLoader } from "@react-three/fiber";
import { Center, useGLTF } from "@react-three/drei";
import { TextureLoader, CubeTextureLoader, Vector3, CubeTexture, MeshStandardMaterial, Mesh } from "three";
import { ErrorBoundary } from "react-error-boundary";
import { CameraControls } from "@react-three/drei";
import { CameraState, ControlledCamera } from "@/components/three/ControlledCamera";
import { useSpring, animated } from "@react-spring/three";
import IconPrevious from "@/img/IconPrevious";
import IconNext from "@/img/IconNext";

class Part {
  description: string;
  material: Material;
  model: any;
  object: any;
  geometry: any;

  constructor(model: any, description: string, material: Material) {
    this.model = model;
    this.description = description;
    this.material = material;
    const { nodes } = model;
    // Find the first mesh in the GLTF model dynamically
    const firstMesh = useMemo(() => Object.values(nodes).find((node) => (node as any).isMesh) as any, [nodes]);
    if (!firstMesh) {
      console.error("No mesh found in GLTF model: ", Object.values(nodes));
    }
    this.object = firstMesh;
    this.geometry = firstMesh.geometry;
  }
}

class Material {
  name: string;
  meshStandardMaterial: any;

  constructor(name: string, meshStandardMaterial: any) {
    this.name = name;
    this.meshStandardMaterial = meshStandardMaterial;
  }

  static Acero(background: BackgroundCube) {
    const [roughness] = useLoader(TextureLoader, ["/materials/steel/roughness.png"]);
    return new Material(
      "Acero",
      new MeshStandardMaterial({
        color: "#ffffff",
        opacity: 1,
        transparent: true,
        metalness: 1,
        roughness: 0.8,
        roughnessMap: roughness,
        envMapIntensity: 0.5,
        envMap: background.cubeTexture,
      }),
    );
  }
}

class BackgroundCube {
  cubeTexture: CubeTexture;

  constructor(urls: string[]) {
    this.cubeTexture = new CubeTextureLoader().load(urls);
  }

  static Estudio() {
    const path = "/blender/background/";
    const format = ".png";
    let urls = [path + "px" + format, path + "nx" + format, path + "py" + format, path + "ny" + format, path + "pz" + format, path + "nz" + format];
    return new BackgroundCube(urls);
  }
}
function FadeableModel({ onFadeComplete, visible, part }: { onFadeComplete: () => void; visible: boolean; part: Part }) {
  const meshRef = useRef<Mesh>(null);
  const materialRef = useRef<MeshStandardMaterial>(part.material.meshStandardMaterial);

  useEffect(() => {
    if (meshRef.current) {
      meshRef.current.visible = visible;
    }
  }, [visible]);

  const { opacity } = useSpring({
    opacity: visible ? 1 : 0,
    config: { duration: 1000 },
    onChange: ({ value }) => {
      if (materialRef.current) {
        materialRef.current.opacity = value.opacity;
      }
    },
    onRest: () => {
      if (!visible && meshRef.current) {
        meshRef.current.visible = false;
      }
      onFadeComplete();
    },
  });

  return (
    <animated.mesh ref={meshRef} geometry={part.geometry} scale={1} visible={visible}>
      <animated.meshStandardMaterial
        ref={materialRef}
        attach="material"
        {...part.material.meshStandardMaterial}
        opacity={opacity}
        transparent
      />
    </animated.mesh>
  );
}

function Scene({ children, isHovered }: { children: React.ReactNode; isHovered: boolean }) {
  const cameraRef = useRef<CameraControls>(null);

  const lightPositions = [
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
      animated: true,
      enableUserControls: true,
    });
  }

  return (
    <>
      {Array.from({ length: lightPositions.length }, (_, i) => (
        <spotLight key={i} color={"#ffffff"} intensity={400} position={lightPositions[i]} />
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
  let background = BackgroundCube.Estudio();

  let parts = [
    new Part(useGLTF("/blender/PiezaGrupilla/PiezaGrupilla.glb"), "Pieza grupilla, parece una colilla", Material.Acero(background)),
    new Part(useGLTF("/blender/BigMonk.glb"), "ES EL PUTO BIG BONK !!!", Material.Acero(background)),
  ];

  let [currentPartIndex, setCurrentPartIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isPending, startTransition] = useTransition();

  const currentPart = useMemo(() => parts[currentPartIndex], [parts, currentPartIndex]);
  const requestChangeModel = useCallback(() => {
    if (!isPending) {
      startTransition(() => {
        setCurrentPartIndex((prev) => (prev + 1) % parts.length);
      });
    }
  }, [parts, isPending]);

  const handleFadeComplete = useCallback(() => {
    // Optional: Add any cleanup or additional logic after fade
  }, []);

  return (
    <div className="flex flex-row flex-wrap w-full h-full">
      <Suspense fallback={<SuspenseFallback />}>
        <div className="grid place-items-center">
          <IconPrevious onClick={requestChangeModel} extraClasses="row-[1] col-[1] z-1 size-8 self-center justify-self-start text-red-500" />
          <div className="row-[1] col-[1] select-none h-[50vh] aspect-square max-w-full">
            <ErrorBoundary fallback={<CanvasFallback />}>
              <Canvas camera={{ position: [9, 9, 9], fov: 60 }} fallback={<CanvasFallback />} onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
                <Scene isHovered={isHovered}>
                  <Center>
                    {parts.map((part, id) => (
                      <FadeableModel key={id} part={part} visible={currentPartIndex === id} onFadeComplete={handleFadeComplete} />
                    ))}
                  </Center>
                </Scene>
              </Canvas>
            </ErrorBoundary>
          </div>
          <IconNext onClick={requestChangeModel} extraClasses="row-[1] col-[1] z-1 size-8 self-center justify-self-end text-red-500" />
        </div>
      </Suspense>
      <div>{currentPart.description}</div>
    </div>
  );
}
