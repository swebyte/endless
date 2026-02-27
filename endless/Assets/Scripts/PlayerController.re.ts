import RogueAnimator from "@RE/RogueEngine/rogue-animator/RogueAnimator.re";
import RapierKinematicCharacterController from "@RE/RogueEngine/rogue-rapier/Components/RapierKinematicCharacterController.re";
import * as RE from "rogue-engine";

@RE.registerComponent
export default class PlayerController extends RE.Component {
  @RapierKinematicCharacterController.require()
  controller!: RapierKinematicCharacterController;

  @RogueAnimator.require()
  animator!: RogueAnimator;

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
  }
}
