import * as RE from "rogue-engine";
import RapierKinematicCharacterController from "../Components/RapierKinematicCharacterController.re";

RE.VisualComponent.defineAction({
  type: "Action",
  name: "KinematicController:IsGrounded",
  description: "Gets the angular velocity of a RapierBody",
  params: [
    {type: "Component", valueType: "RapierKinematicCharacterController", name: "controller"},
  ],
  returns: [{type: "Boolean", name: "isGrounded"}],
  do(args, controller: RapierKinematicCharacterController) {
    return controller.isGrounded;
  }
});

RE.VisualComponent.defineAction({
  type: "Action",
  name: "KinematicController:MovementDirection",
  description: "Gets the angular velocity of a RapierBody",
  params: [
    {type: "Component", valueType: "RapierKinematicCharacterController", name: "controller"},
  ],
  returns: [{type: "Vector3", name: "moveDir"}],
  do(args, controller: RapierKinematicCharacterController) {
    return controller.movementDirection;
  }
});
