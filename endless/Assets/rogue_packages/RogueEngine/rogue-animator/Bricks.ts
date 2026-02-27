import * as RE from "rogue-engine";
import RogueAnimator from "./RogueAnimator.re";

RE.VisualComponent.defineAction({
  type: "Action",
  name: "RE:Animator:Mix",
  params: [
    {type: "Component", valueType: "RogueAnimator", name: "RogueAnimator"} as any,
    {type: "String", name: "actionName", value: "actionName"},
    {type: "Number", name: "transitionTime", value: 0.1, optional: true},
    {type: "Number", name: "weight", value: 1, optional: true},
    {type: "Boolean", name: "warp", value: true, optional: true},
  ],
  do(args, animator: RogueAnimator, actionName: string, transitionTime: number = 0.1, weight = 1, warp = true) {
    animator.mix(actionName, transitionTime, weight, warp);
  },
});

RE.VisualComponent.defineAction({
  type: "Action",
  name: "RE:Animator:SetBaseAction",
  params: [
    {type: "Component", valueType: "RogueAnimator", name: "RogueAnimator"} as any,
    {type: "String", name: "actionName", value: "actionName"},
  ],
  do(args, animator: RogueAnimator, actionName: string) {
    animator.setBaseAction(actionName);
  },
});
