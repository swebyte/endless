import RogueAnimator from "@RE/RogueEngine/rogue-animator/RogueAnimator.re";
import RapierKinematicCharacterController from "@RE/RogueEngine/rogue-rapier/Components/RapierKinematicCharacterController.re";
import * as RE from "rogue-engine";
import NetworkManager from "./NetworkManager.re";

@RE.registerComponent
export default class PlayerController extends RE.Component {
  @RapierKinematicCharacterController.require()
  controller!: RapierKinematicCharacterController;

  // @NetworkManager.require()
  // net!: NetworkManager;

  @RogueAnimator.require()
  animator!: RogueAnimator;

  private sendRate = 0.05;
  private sendTimer = 0;

  init() {}
  update() {
    if (this.controller.isGrounded) {
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

    this.updateNetwork();
  }

  private updateNetwork() {
    this.sendTimer += RE.Runtime.deltaTime;
    if (this.sendTimer >= this.sendRate) {
      this.sendTimer = 0;
      const p = this.object3d.position;
      const q = this.object3d.quaternion;
      NetworkManager.sendTransform(p.x, p.y, p.z, q.x, q.y, q.z, q.w, 0, 0, 0);
    }
  }
}
