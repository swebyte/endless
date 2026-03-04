import * as RE from "rogue-engine";
import * as THREE from "three";
import { Client, Room, Callbacks } from "@colyseus/sdk";
import RapierBody from "@RE/RogueEngine/rogue-rapier/Components/RapierBody.re";
import RapierKinematicCharacterController from "@RE/RogueEngine/rogue-rapier/Components/RapierKinematicCharacterController.re";
import RapierThirdPersonController from "@RE/RogueEngine/rogue-rapier/Components/Controllers/RapierThirdPersonController.re";
import PlayerController from "./PlayerController.re";

@RE.registerComponent
export default class NetworkManager extends RE.Component {
  @RE.props.prefab() prefab: RE.Prefab;

  private static _instance: NetworkManager | undefined;

  static get instance() {
    return this._instance;
  }
  static get isReady() {
    return !!this._instance?.room;
  }

  static sendTransform(
    px: number,
    py: number,
    pz: number,
    qx: number,
    qy: number,
    qz: number,
    qw: number,
    vx: number,
    vy: number,
    vz: number,
  ) {
    this._instance?.sendTransform(px, py, pz, qx, qy, qz, qw, vx, vy, vz);
  }

  private client: Client;
  private room: Room;
  private remotePlayers: Map<string, THREE.Object3D> = new Map();

  // Store target transforms for interpolation
  private remoteTargets: Map<
    string,
    { position: THREE.Vector3; quaternion: THREE.Quaternion }
  > = new Map();

  async start() {
    NetworkManager._instance = this;
    this.client = new Client("http://localhost:2567");
    this.room = await this.client.joinOrCreate("my_room");

    window.addEventListener("beforeunload", () => {
      this.room?.leave();
    });
    console.log("Connected to room:", this.room.sessionId);

    const player = this.prefab.instantiate();
    const body = RapierBody.get(player);
    if (body) RE.removeComponent(body);
    const controller = RapierKinematicCharacterController.get(player);
    if (controller) controller.enabled = true;
    const tpc = RapierThirdPersonController.get(player);
    if (tpc) tpc.enabled = true;

    const callbacks = Callbacks.get(this.room);

    callbacks.onAdd("players", (player: any, sessionId: string) => {
      if (sessionId === this.room.sessionId) return;

      const mesh = this.prefab.instantiate();
      this.remotePlayers.set(sessionId, mesh);

      // Disable all controllers on remote player
      const pc = PlayerController.get(mesh);
      if (pc) pc.enabled = false;

      const kkc = RapierKinematicCharacterController.get(mesh);
      if (kkc) kkc.enabled = false;

      const rtpc = RapierThirdPersonController.get(mesh);
      if (rtpc) rtpc.enabled = false;

      const body = RapierBody.get(mesh);
      if (body) RE.removeComponent(body);

      // Initialize target transform
      this.remoteTargets.set(sessionId, {
        position: new THREE.Vector3(),
        quaternion: new THREE.Quaternion(),
      });

      callbacks.onChange(player, () => {
        const target = this.remoteTargets.get(sessionId);
        if (!target) return;
        target.position.set(player.px, player.py, player.pz);
        target.quaternion.set(player.qx, player.qy, player.qz, player.qw);
      });
    });

    callbacks.onRemove("players", (_: any, sessionId: string) => {
      const mesh = this.remotePlayers.get(sessionId);
      if (mesh) {
        mesh.parent?.remove(mesh);
        this.remotePlayers.delete(sessionId);
        this.remoteTargets.delete(sessionId);
      }
    });
  }

  update() {
    // Interpolate remote players towards their target transforms
    this.remotePlayers.forEach((mesh, sessionId) => {
      const target = this.remoteTargets.get(sessionId);
      if (!target) return;
      mesh.position.lerp(target.position, 0.2);
      mesh.quaternion.slerp(target.quaternion, 0.2);
    });
  }

  sendTransform(
    px: number,
    py: number,
    pz: number,
    qx: number,
    qy: number,
    qz: number,
    qw: number,
    vx: number,
    vy: number,
    vz: number,
  ) {
    this.room?.send("transform", { px, py, pz, qx, qy, qz, qw, vx, vy, vz });
  }

  onDisable() {
    this.room?.leave();
    if (NetworkManager._instance === this) NetworkManager._instance = undefined;
  }
}
