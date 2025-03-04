import { Suspense, useCallback, useMemo, useRef, useState, useTransition, useEffect } from "react";
import { Canvas, useLoader } from "@react-three/fiber";
import { Center, useGLTF } from "@react-three/drei";
import { TextureLoader, CubeTextureLoader, Vector3, CubeTexture, MeshStandardMaterial, Mesh, Object3D } from "three";
import { ErrorBoundary } from "react-error-boundary";
import { CameraMovementState, CameraState, ControlledCamera } from "@/components/three/ControlledCamera";
import { useSpring, animated } from "@react-spring/three";
import { useTranslationsFromUrl } from "@/i18n/translations";
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

  static Steel(background: BackgroundCube) {
    const [roughness] = useLoader(TextureLoader, ["/materials/steel/roughness.png"]);
    return new Material(
      "Steel",
      new MeshStandardMaterial({
        color: "#ffffff",
        opacity: 1,
        transparent: true,
        metalness: 1,
        roughness: 0.8,
        roughnessMap: roughness,
        envMapIntensity: 0.4,
        envMap: background.cubeTexture,
      }),
    );
  }

  static Aluminium(background: BackgroundCube) {
    const [roughness] = useLoader(TextureLoader, ["/materials/steel/roughness.png"]);
    return new Material(
      "Aluminium",
      new MeshStandardMaterial({
        color: "#ffffff",
        opacity: 1,
        transparent: true,
        metalness: 1,
        roughness: 0.8,
        roughnessMap: roughness,
        envMapIntensity: 0.4,
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

function FadeableModel({ visible, part }: { visible: boolean; part: Part }) {
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
    },
  });

  return (
    <Center>
      <animated.mesh ref={meshRef} geometry={part.geometry} scale={1} visible={visible}>
        <animated.meshStandardMaterial ref={materialRef} attach="material" {...part.material.meshStandardMaterial} opacity={opacity} transparent />
      </animated.mesh>
    </Center>
  );
}

function Scene({ children, isHovered }: { children: React.ReactNode; isHovered: boolean }) {
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

  const cameraState = new CameraState({
    movementState: isHovered ? CameraMovementState.Draggable : CameraMovementState.Orbiting,
    orbitingRadius: isHovered ? 3 : 5, // Adjust radius based on hover
    animated: true,
    minDistance: isHovered ? 3 : 2, // Different constraints for each state
    maxDistance: isHovered ? 6 : 8,
  });
  return (
    <>
      {Array.from({ length: lightPositions.length }, (_, i) => (
        <spotLight key={i} color={"#ffffff"} intensity={200} position={lightPositions[i]} />
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
  const t = useTranslationsFromUrl(new URL(window.location.href));
  let background = BackgroundCube.Estudio();

  let parts = [
    new Part(useGLTF("/blender/PiezaGrupilla/PiezaGrupilla.glb"), "Pieza grupilla, parece una colilla", Material.Steel(background)),
    new Part(useGLTF("/blender/Simetrica/Simetrica.glb"), "Shuriken ninjah primo", Material.Aluminium(background)),
    new Part(useGLTF("/blender/BigMonk.glb"), "ES EL PUTO BIG BONK !!!", Material.Steel(background)),
  ];

  let [currentPartIndex, setCurrentPartIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [delayedHover, setDelayedHover] = useState(false);
  const hoverTimeoutRef = useRef<NodeJS.Timeout>(null);

  useEffect(() => {
    if (isHovered) {
      // Clear any existing timeout when hovering
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
      setDelayedHover(true);
    } else {
      // Set a timeout for hover out
      hoverTimeoutRef.current = setTimeout(() => {
        setDelayedHover(false);
      }, 3000); // 3 seconds delay
    }

    // Cleanup timeout on component unmount
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, [isHovered]);

  const [isPending, startTransition] = useTransition();

  const currentPart = useMemo(() => parts[currentPartIndex], [parts, currentPartIndex]);
  const requestChangeModel = useCallback(() => {
    if (!isPending) {
      startTransition(() => {
        setCurrentPartIndex((prev) => (prev + 1) % parts.length);
      });
    }
  }, [parts, isPending]);

  return (
    <div className="flex flex-col lg:flex-row w-full h-full rounded-lg bg-gray-200 p-4 justify-center">
      <Suspense fallback={<SuspenseFallback />}>
        <div className="grid place-items-center sm:h-[min(60vh,60vw)] min-w-0 max-sm:w-full aspect-square max-w-full rounded-lg overflow-clip">
          <button onClick={requestChangeModel} className="row-[1] col-[1] z-1 size-8 self-center justify-self-start text-white clickable">
            <IconPrevious extraClasses="w-full h-full" />
          </button>
          <div className="row-[1] col-[1] min-w-0 min-h-0 max-w-full max-h-full select-none self-stretch justify-self-stretch">
            <ErrorBoundary fallback={<CanvasFallback />}>
              <Canvas
                className="object-contain"
                camera={{ position: [4, 4, 4], fov: 60 }}
                fallback={<CanvasFallback />}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
              >
                <Scene isHovered={delayedHover}>
                  {parts.map((part, id) => (
                    <FadeableModel key={id} part={part} visible={currentPartIndex === id} />
                  ))}
                </Scene>
              </Canvas>
            </ErrorBoundary>
          </div>
          <button onClick={requestChangeModel} className="row-[1] col-[1] z-1 size-8 self-center justify-self-end clickable text-white">
            <IconNext extraClasses="w-full h-full" />
          </button>
          <div className="row-[1] col-[1] w-full h-full bg-radial from-blue from-40% to-darkblue"></div>
        </div>
      </Suspense>
      <div className="flex flex-col gap-2 p-2">
        <h1 className="text-center text-nowrap">{t("index", "ourProducts")}</h1>
        <div>{currentPart.description}</div>
      </div>
    </div>
  );
}
