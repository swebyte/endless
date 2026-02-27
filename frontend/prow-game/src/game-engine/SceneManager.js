import * as THREE from 'three';

/**
 * Manages the Three.js scene: camera, renderer, lights, and objects.
 */
export class SceneManager {
  /**
   * @param {HTMLCanvasElement} canvas
   */
  constructor(canvas) {
    this.canvas = canvas;
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.cube = null;
    this.resizeHandler = null;
  }

  init() {
    const width = this.canvas.clientWidth;
    const height = this.canvas.clientHeight;

    // Scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x0f0f1a);
    this.scene.fog = new THREE.Fog(0x0f0f1a, 15, 40);

    // Camera
    this.camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
    this.camera.position.set(0, 2, 6);
    this.camera.lookAt(0, 0, 0);

    // Renderer
    this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas, antialias: true });
    this.renderer.setSize(width, height, false);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;

    this._addLights();
    this._addObjects();
    this._setupResizeHandler();
  }

  _addLights() {
    const ambient = new THREE.AmbientLight(0x223366, 0.8);
    this.scene.add(ambient);

    const dirLight = new THREE.DirectionalLight(0x00d4ff, 1.5);
    dirLight.position.set(5, 8, 5);
    dirLight.castShadow = true;
    this.scene.add(dirLight);

    const rimLight = new THREE.DirectionalLight(0x7b2fff, 0.8);
    rimLight.position.set(-5, 2, -5);
    this.scene.add(rimLight);
  }

  _addObjects() {
    // Rotating cube
    const geo = new THREE.BoxGeometry(1.5, 1.5, 1.5);
    const mat = new THREE.MeshStandardMaterial({
      color: 0x00d4ff,
      metalness: 0.4,
      roughness: 0.3,
      emissive: 0x002233,
    });
    this.cube = new THREE.Mesh(geo, mat);
    this.cube.castShadow = true;
    this.scene.add(this.cube);

    // Wireframe overlay
    const wireGeo = new THREE.BoxGeometry(1.55, 1.55, 1.55);
    const wireMat = new THREE.MeshBasicMaterial({ color: 0x00d4ff, wireframe: true, opacity: 0.25, transparent: true });
    const wire = new THREE.Mesh(wireGeo, wireMat);
    this.cube.add(wire);

    // Ground grid
    const grid = new THREE.GridHelper(20, 20, 0x1a1a3a, 0x1a1a3a);
    grid.position.y = -2;
    this.scene.add(grid);

    // Floor plane for shadows
    const floorGeo = new THREE.PlaneGeometry(20, 20);
    const floorMat = new THREE.MeshStandardMaterial({ color: 0x0a0a18, roughness: 1 });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -2;
    floor.receiveShadow = true;
    this.scene.add(floor);
  }

  _setupResizeHandler() {
    this.resizeHandler = () => {
      const width = this.canvas.clientWidth;
      const height = this.canvas.clientHeight;
      this.camera.aspect = width / height;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(width, height, false);
    };
    window.addEventListener('resize', this.resizeHandler);
  }

  /**
   * @param {number} deltaTime  seconds since last frame
   */
  update(deltaTime) {
    if (this.cube) {
      this.cube.rotation.x += 0.4 * deltaTime;
      this.cube.rotation.y += 0.6 * deltaTime;
    }
  }

  render() {
    this.renderer.render(this.scene, this.camera);
  }

  dispose() {
    if (this.resizeHandler) {
      window.removeEventListener('resize', this.resizeHandler);
    }
    this.renderer.dispose();
  }
}
