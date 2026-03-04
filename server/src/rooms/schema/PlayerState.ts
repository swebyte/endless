import { Schema, type } from "@colyseus/schema";

export class PlayerState extends Schema {
  // Position
  @type("float32") px: number = 0;
  @type("float32") py: number = 0;
  @type("float32") pz: number = 0;

  // Quaternion (x, y, z, w)
  @type("float32") qx: number = 0;
  @type("float32") qy: number = 0;
  @type("float32") qz: number = 0;
  @type("float32") qw: number = 1;

  // Velocity
  @type("float32") vx: number = 0;
  @type("float32") vy: number = 0;
  @type("float32") vz: number = 0;

  // Animation
  @type("float32") dirLength: number = 0;
}
