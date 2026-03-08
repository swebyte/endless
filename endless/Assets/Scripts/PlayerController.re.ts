import RogueAnimator from "@RE/RogueEngine/rogue-animator/RogueAnimator.re";
import RapierKinematicCharacterController from "@RE/RogueEngine/rogue-rapier/Components/RapierKinematicCharacterController.re";
import * as RE from "rogue-engine";
import * as THREE from "three";
import NetworkManager from "./NetworkManager.re";

@RE.registerComponent
export default class PlayerController extends RE.Component {
  @RapierKinematicCharacterController.require()
  controller!: RapierKinematicCharacterController;

  @RogueAnimator.require()
  animator!: RogueAnimator;

  isRemote: boolean = false;
  targetPosition: THREE.Vector3 = new THREE.Vector3();
  targetQuaternion: THREE.Quaternion = new THREE.Quaternion();
  networkDirLength: number = 0;
  networkVelocity: THREE.Vector3 = new THREE.Vector3();

  private sendRate = 0.05;
  private sendTimer = 0;

  private isGrounded = false;
  private groundedTimer = 0;
  private groundedGrace = 0.15;

  private isAttacking = false;

  start() {
    this.animator.onAnimationFinished(() => {
      if (this.isAttacking) {
        this.isAttacking = false;
        this.animator.mix("idle", 0.3);
      }
    });
  }

  update() {
    if (this.isRemote) {
      this.targetPosition.x += this.networkVelocity.x * RE.Runtime.deltaTime;
      this.targetPosition.y += this.networkVelocity.y * RE.Runtime.deltaTime;
      this.targetPosition.z += this.networkVelocity.z * RE.Runtime.deltaTime;
      // Interpolate towards server position
      this.object3d.position.lerp(this.targetPosition, 0.2);
      this.object3d.quaternion.slerp(this.targetQuaternion, 0.2);

      if (this.networkDirLength > 0) {
        this.animator.setBaseAction("idle");
        this.animator.mix("run", 0.1, this.networkDirLength);
      } else {
        this.animator.mix("idle");
      }
      return;
    }

    this.handleInput();

    this.sendTimer += RE.Runtime.deltaTime;
    if (this.sendTimer >= this.sendRate) {
      this.sendTimer = 0;
      const p = this.object3d.position;
      const q = this.object3d.quaternion;
      const dir = this.controller.movementDirection;
      const vel = this.controller.playerVelocity;
      const dirLength = dir.length();
      NetworkManager.sendTransform(
        p.x,
        p.y,
        p.z,
        q.x,
        q.y,
        q.z,
        q.w,
        vel.x,
        vel.y,
        vel.z,
        dirLength,
      );
    }
  }

  private handleInput() {
    // Grace timer prevents flicker on uneven terrain
    if (this.controller.isGrounded) {
      this.groundedTimer = this.groundedGrace;
      this.isGrounded = true;
    } else {
      this.groundedTimer -= RE.Runtime.deltaTime;
      if (this.groundedTimer <= 0) this.isGrounded = false;
    }

    if (RE.Input.mouse.isLeftButtonPressed && !this.isAttacking) {
      this.isAttacking = true;
      const attackAction = this.animator.getAction("attack");
      if (attackAction) {
        attackAction.loop = THREE.LoopOnce;
        attackAction.clampWhenFinished = true;
      }
      this.animator.mix("attack");
    } else if (this.isAttacking) {
      // hold attack animation until finished
    } else if (this.isGrounded) {
      const dirLength = this.controller.movementDirection.length();
      if (dirLength > 0) {
        this.animator.setBaseAction("idle");
        this.animator.mix("run", 0.1, dirLength);
      } else {
        this.animator.mix("idle");
      }
    } else {
      this.animator.mix("falling");
    }
  }
}
