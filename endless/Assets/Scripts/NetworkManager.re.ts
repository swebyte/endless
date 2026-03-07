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
    dirLength: number,
  ) {
    this._instance?.room?.send("transform", {
      px,
      py,
      pz,
      qx,
      qy,
      qz,
      qw,
      vx,
      vy,
      vz,
      dirLength,
    });
  }

  private client: Client;
  private room: Room;
  private remotePlayers: Map<string, THREE.Object3D> = new Map();

  async start() {
    NetworkManager._instance = this;
    // this.client = new Client("http://localhost:2567");
    this.client = new Client("https://endless-server.swevin.se");

    this.room = await this.client.joinOrCreate("my_room");

    window.addEventListener("beforeunload", () => {
      this.room?.leave();
    });
    console.log("Connected to room:", this.room.sessionId);

    // Spawn local player
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

      console.log("Remote player joined:", sessionId);

      const mesh = this.prefab.instantiate();
      this.remotePlayers.set(sessionId, mesh);

      // Disable physics/input on remote player
      const kkc = RapierKinematicCharacterController.get(mesh);
      if (kkc) kkc.enabled = false;
      const rtpc = RapierThirdPersonController.get(mesh);
      if (rtpc) rtpc.enabled = false;
      const body = RapierBody.get(mesh);
      if (body) RE.removeComponent(body);

      // Set remote flag and initialize targets on PlayerController
      const pc = PlayerController.get(mesh);
      if (pc) {
        pc.isRemote = true;
        pc.targetPosition = new THREE.Vector3(0, 20, 0);
        pc.targetQuaternion = new THREE.Quaternion();
      }

      callbacks.onChange(player, () => {
        if (pc) {
          pc.targetPosition.set(player.px, player.py, player.pz);
          pc.targetQuaternion.set(player.qx, player.qy, player.qz, player.qw);
          pc.networkDirLength = player.dirLength;
          pc.networkVelocity.set(player.vx, player.vy, player.vz);
        }
      });
    });

    callbacks.onRemove("players", (_: any, sessionId: string) => {
      console.log("Remote player left:", sessionId);
      const mesh = this.remotePlayers.get(sessionId);
      if (mesh) {
        mesh.parent?.remove(mesh);
        this.remotePlayers.delete(sessionId);
      }
    });
  }

  onDisable() {
    this.room?.leave();
    if (NetworkManager._instance === this) NetworkManager._instance = undefined;
  }
}
