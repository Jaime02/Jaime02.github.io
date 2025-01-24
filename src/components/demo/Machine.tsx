import * as THREE from "three";

export default class Machine {
  nodes: { [name: string]: THREE.Object3D };
  materials: { [name: string]: THREE.Material };
  animations: THREE.AnimationClip[];
  door: THREE.Object3D;
  mixer: THREE.AnimationMixer;
  actions: Map<string, THREE.AnimationAction>;

  constructor(
    nodes: { [name: string]: THREE.Object3D },
    materials: { [name: string]: THREE.Material },
    animations: THREE.AnimationClip[]
  ) {
    this.nodes = nodes;
    this.materials = materials;
    this.animations = animations;
    this.door = this.nodes["Door"];
    console.log("Nodes", this.nodes);

    // Initialize AnimationMixer
    this.mixer = new THREE.AnimationMixer(this.nodes["Scene"]);

    // Create actions for each animation clip
    this.actions = new Map();
    this.animations.forEach((clip) => {
      const action = this.mixer.clipAction(clip);
      this.actions.set(clip.name, action);
    });

    console.log("Actions initialized:", this.actions);
  }

  // Get AnimationAction by name
  getAnimationActionByName(name: string): THREE.AnimationAction | null {
    return this.actions.get(name) || null;
  }

  // Play a specific animation action by name
  playAnimationByName(name: string) {
    const action = this.getAnimationActionByName(name);
    if (!action) {
      console.warn(`Animation "${name}" not found.`);
      return;
    }
    console.log("Action", action);
    action.reset().play();
  }

  // Example: Toggle door animation
  toggleDoor() {
    console.log("Toggling door animation.");
    this.playAnimationByName("Door");
  }

  getMeshes() {
    const meshes: THREE.Mesh[] = [];
    for (const node of Object.values(this.nodes)) {
      if (node instanceof THREE.Mesh) {
        meshes.push(node);
      }
    }
    return meshes;
  }

  // Update mixer on each frame (must be called in the render loop)
  update(delta: number) {
    this.mixer.update(delta);
  }
}
