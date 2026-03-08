import * as RE from "rogue-engine";
import * as THREE from "three";

@RE.registerComponent
export default class TerrainRepeat extends RE.Component {
  awake() {}

  start() {
    console.log("Hello, from TerrainRepeat:start()!");
    const mesh = this.object3d as THREE.Mesh;
    const material = mesh.material as THREE.MeshStandardMaterial;
    const repeat = 40;
    if (material.map) {
      material.map.wrapS = THREE.RepeatWrapping;
      material.map.wrapT = THREE.RepeatWrapping;
      material.map.repeat.set(repeat, repeat);
      material.map.needsUpdate = true;
    }

    if (material.normalMap) {
      material.normalMap.wrapS = THREE.RepeatWrapping;
      material.normalMap.wrapT = THREE.RepeatWrapping;
      material.normalMap.repeat.set(repeat, repeat);
      material.normalMap.needsUpdate = true;
    }

    if (material.roughnessMap) {
      material.roughnessMap.wrapS = THREE.RepeatWrapping;
      material.roughnessMap.wrapT = THREE.RepeatWrapping;
      material.roughnessMap.repeat.set(repeat, repeat);
      material.roughnessMap.needsUpdate = true;
    }
  }

  update() {}
}
