import { Room, Client, CloseCode } from "colyseus";
import { MyRoomState } from "./schema/MyRoomState.js";
import { PlayerState } from "./schema/PlayerState.js";

interface TransformMessage {
  px: number;
  py: number;
  pz: number;
  qx: number;
  qy: number;
  qz: number;
  qw: number;
  vx: number;
  vy: number;
  vz: number;
  dirLength: number;
}

export class MyRoom extends Room {
  maxClients = 32;
  state = new MyRoomState();

  messages = {
    transform: (client: Client, data: TransformMessage) => {
      const player = this.state.players.get(client.sessionId);
      if (!player) return;

      player.px = data.px;
      player.py = data.py;
      player.pz = data.pz;
      player.qx = data.qx;
      player.qy = data.qy;
      player.qz = data.qz;
      player.qw = data.qw;
      player.vx = data.vx;
      player.vy = data.vy;
      player.vz = data.vz;
      player.dirLength = data.dirLength;
    },
  };

  onCreate(options: any) {}

  onJoin(client: Client, options: any) {
    console.log(client.sessionId, "joined!");
    this.state.players.set(client.sessionId, new PlayerState());
  }

  onLeave(client: Client, code: CloseCode) {
    console.log(client.sessionId, "left!", code);
    this.state.players.delete(client.sessionId);
  }

  onDispose() {
    console.log("room", this.roomId, "disposing...");
  }
}
