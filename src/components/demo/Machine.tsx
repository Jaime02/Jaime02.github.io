import { useAnimations, useGLTF } from "@react-three/drei";
import * as THREE from "three";

export default class Machine {
  machineNodes: { [name: string]: THREE.Object3D };
  machineMaterials: { [name: string]: THREE.Material };
  animations: any;
  door: THREE.Object3D;

  constructor() {
    this.machineNodes = machineNodes;
    this.machineMaterials = machineMaterials;
    this.door = this.machineNodes["Door"];
    console.log(machineAnimations);
    // { ref, mixer, names, actions, clips }

    console.log("assigned", this.animations);
  }
  
  getAnimationByName(name: string) {
    console.log(this.animations.actions);
    return this.animations.actions[name];
  }

  getMeshes() {
    const meshes: THREE.Mesh[] = [];
    for (const node of Object.values(this.machineNodes)) {
      if (node instanceof THREE.Mesh) {
        meshes.push(node);
      }
    }
    return meshes;
  }

  toggleDoor() {
    console.log(this.door);
    this.getAnimationByName("Door").play();
  }
}