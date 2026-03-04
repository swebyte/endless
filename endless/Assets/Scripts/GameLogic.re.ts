import * as RE from "rogue-engine";
import RapierBody from "@RE/RogueEngine/rogue-rapier/Components/RapierBody.re";
import RapierKinematicCharacterController from "@RE/RogueEngine/rogue-rapier/Components/RapierKinematicCharacterController.re";
import RapierThirdPersonController from "@RE/RogueEngine/rogue-rapier/Components/Controllers/RapierThirdPersonController.re";

@RE.registerComponent
export default class GameLogic extends RE.Component {
  isStaticModel = true;
  @RE.props.prefab() playerPrefab: RE.Prefab;

  start() {
    // Instantiate the local player
    const player = this.playerPrefab.instantiate();

    // Remove the fixed body, enable controllers for local player
    const body = RapierBody.get(player);
    if (body) RE.removeComponent(body);

    const controller = RapierKinematicCharacterController.get(player);
    if (controller) controller.enabled = true;

    const tpc = RapierThirdPersonController.get(player);
    if (tpc) tpc.enabled = true;
  }
}
