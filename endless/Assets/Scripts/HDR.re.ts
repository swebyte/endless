import * as RE from "rogue-engine";
import * as THREE from "three";
import { HDRLoader } from "three/examples/jsm/loaders/HDRLoader";

@RE.registerComponent
export default class HDR extends RE.Component {
  awake() {}

  start() {
    // Hdr loader
    console.log("Loading HDR...");

    const renderer = RE.Runtime.renderer;
    const scene = RE.App.currentScene;
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    pmremGenerator.compileEquirectangularShader();

    new HDRLoader().load(
      "assets/Textures/Cubemaps/qwantani_night_puresky_4k.hdr",
      (texture) => {
        const envMap = pmremGenerator.fromEquirectangular(texture).texture;
        scene.background = envMap;
        scene.environment = envMap;
        texture.dispose();
        pmremGenerator.dispose();
      },
    );
  }

  update() {}
}
