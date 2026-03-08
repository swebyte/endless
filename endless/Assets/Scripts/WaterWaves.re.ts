import * as RE from "rogue-engine";
import * as THREE from "three";

@RE.registerComponent
export default class WaterWaves extends RE.Component {
  @RE.props.num() waveHeight: number = 5;
  @RE.props.num() waveSpeed: number = 0.5;
  @RE.props.num() waveFrequency: number = 0.02;

  private positions: THREE.BufferAttribute;
  private baseY: Float32Array;
  private baseX: Float32Array;
  private baseZ: Float32Array;
  private time: number = 0;

  start() {
    const mesh = this.object3d as THREE.Mesh;
    if (!mesh.geometry) return;

    mesh.geometry = mesh.geometry.toNonIndexed();
    this.positions = mesh.geometry.attributes.position as THREE.BufferAttribute;

    this.baseX = new Float32Array(this.positions.count);
    this.baseY = new Float32Array(this.positions.count);
    this.baseZ = new Float32Array(this.positions.count);
    for (let i = 0; i < this.positions.count; i++) {
      this.baseX[i] = this.positions.getX(i);
      this.baseY[i] = this.positions.getY(i);
      this.baseZ[i] = this.positions.getZ(i);
    }
  }

  update() {
    if (!this.positions) return;

    this.time += RE.Runtime.deltaTime * this.waveSpeed;
    const f = this.waveFrequency;
    const h = this.waveHeight;

    for (let i = 0; i < this.positions.count; i++) {
      const x = this.baseX[i];
      const y = this.baseY[i];
      // PlaneGeometry lays flat in XY; Z is the up axis in local space
      const z =
        this.baseZ[i] +
        Math.sin(x * f + this.time) * h * 0.5 +
        Math.cos(y * f + this.time) * h * 0.5;
      this.positions.setZ(i, z);
    }

    this.positions.needsUpdate = true;
    (this.object3d as THREE.Mesh).geometry.computeVertexNormals();
  }
}
