"use strict";
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["rogue-editor-user-scripts"] = factory();
	else
		root["rogue-editor-user-scripts"] = factory();
})(self, function() {
return (self["webpackChunk_name_"] = self["webpackChunk_name_"] || []).push([["rogue-editor-user-scripts"],{

/***/ "./Assets/rogue_packages/RogueEngine/rogue-rapier/Components/_Editor/RapierBodyWireframe.re.ts":
/*!*****************************************************************************************************!*\
  !*** ./Assets/rogue_packages/RogueEngine/rogue-rapier/Components/_Editor/RapierBodyWireframe.re.ts ***!
  \*****************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ RapierBodyWireframe)
/* harmony export */ });
/* harmony import */ var rogue_engine__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! rogue-engine */ "rogue-engine");
/* harmony import */ var rogue_engine__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(rogue_engine__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var three__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! three */ "three");
/* harmony import */ var three__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(three__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _Colliders_RapierCollider__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../Colliders/RapierCollider */ "./Assets/rogue_packages/RogueEngine/rogue-rapier/Components/Colliders/RapierCollider.ts");
/* harmony import */ var _dimforge_rapier3d_compat__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @dimforge/rapier3d-compat */ "./node_modules/@dimforge/rapier3d-compat/rapier.mjs");
/* harmony import */ var _RapierBody_re__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../RapierBody.re */ "./Assets/rogue_packages/RogueEngine/rogue-rapier/Components/RapierBody.re.ts");
/* harmony import */ var _RE_RogueEngine_rogue_rapier_Lib_RogueRapier__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @RE/RogueEngine/rogue-rapier/Lib/RogueRapier */ "./Assets/rogue_packages/RogueEngine/rogue-rapier/Lib/RogueRapier.ts");
var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });






class RapierBodyWireframe extends rogue_engine__WEBPACK_IMPORTED_MODULE_0__.Component {
  constructor() {
    super(...arguments);
    this.selectedObjects = [];
    this.colliders = [];
    this.lines = new three__WEBPACK_IMPORTED_MODULE_1__.LineSegments(new three__WEBPACK_IMPORTED_MODULE_1__.BufferGeometry(), new three__WEBPACK_IMPORTED_MODULE_1__.LineBasicMaterial({ color: new three__WEBPACK_IMPORTED_MODULE_1__.Color("#00FF00") }));
    this.initializedPhysics = false;
    this.initializing = false;
    this.handleOnComponentAdded = { stop: () => {
    } };
    this.handleOnComponentRemoved = { stop: () => {
    } };
    this.handleOnPlay = { stop: () => {
    } };
    this.resetHandler = /* @__PURE__ */ __name((component) => {
      component instanceof _Colliders_RapierCollider__WEBPACK_IMPORTED_MODULE_2__["default"] && this.setupImpostors();
    }, "resetHandler");
  }
  async initPhysics() {
    await _dimforge_rapier3d_compat__WEBPACK_IMPORTED_MODULE_5__["default"].init();
  }
  start() {
    try {
      _RE_RogueEngine_rogue_rapier_Lib_RogueRapier__WEBPACK_IMPORTED_MODULE_4__["default"].world.free();
    } catch {
    }
    ;
    _RE_RogueEngine_rogue_rapier_Lib_RogueRapier__WEBPACK_IMPORTED_MODULE_4__["default"].world = void 0;
  }
  doStart() {
    this.initializing = true;
    this.initializedPhysics = false;
    this.lines.geometry.computeBoundingSphere();
    this.lines.frustumCulled = false;
    try {
      _RE_RogueEngine_rogue_rapier_Lib_RogueRapier__WEBPACK_IMPORTED_MODULE_4__["default"].world.free();
    } catch {
    }
    ;
    this.initPhysics().then(() => {
      _RE_RogueEngine_rogue_rapier_Lib_RogueRapier__WEBPACK_IMPORTED_MODULE_4__["default"].world = new _dimforge_rapier3d_compat__WEBPACK_IMPORTED_MODULE_5__["default"].World({ x: 0, y: 0, z: 0 });
      this.initializedPhysics = true;
      this.initializing = false;
    });
    rogue_engine__WEBPACK_IMPORTED_MODULE_0__.App.sceneController.scene.remove(this.lines);
    this.lines.userData.isEditorObject = true;
    rogue_engine__WEBPACK_IMPORTED_MODULE_0__.App.sceneController.scene.add(this.lines);
    this.handleOnComponentAdded.stop();
    this.handleOnComponentRemoved.stop();
    this.handleOnPlay.stop();
    this.handleOnComponentAdded = rogue_engine__WEBPACK_IMPORTED_MODULE_0__.onComponentAdded(this.resetHandler);
    this.handleOnComponentRemoved = rogue_engine__WEBPACK_IMPORTED_MODULE_0__.onComponentRemoved(this.resetHandler);
    this.handleOnPlay = rogue_engine__WEBPACK_IMPORTED_MODULE_0__.Runtime.onPlay(() => {
      try {
        _RE_RogueEngine_rogue_rapier_Lib_RogueRapier__WEBPACK_IMPORTED_MODULE_4__["default"].world.free();
      } catch {
      }
      ;
      this.handleOnComponentAdded.stop();
      this.handleOnComponentRemoved.stop();
      this.initializedPhysics = false;
      this.initializing = false;
    });
  }
  resetComponents() {
    this.selectedObjects.forEach((selected) => {
      if (!selected)
        return;
      selected.traverse((object) => {
        const objComponents = rogue_engine__WEBPACK_IMPORTED_MODULE_0__.components[object.uuid];
        if (!objComponents)
          return;
        objComponents.forEach((component) => {
          if (component instanceof _RapierBody_re__WEBPACK_IMPORTED_MODULE_3__["default"] || component instanceof _Colliders_RapierCollider__WEBPACK_IMPORTED_MODULE_2__["default"]) {
            component.initialized = false;
          }
        });
      });
    });
  }
  afterUpdate() {
    if (!this.enabled)
      return;
    this.lines.visible = false;
    if (!this.initializedPhysics || !_RE_RogueEngine_rogue_rapier_Lib_RogueRapier__WEBPACK_IMPORTED_MODULE_4__["default"].world || !_RE_RogueEngine_rogue_rapier_Lib_RogueRapier__WEBPACK_IMPORTED_MODULE_4__["default"].world.bodies) {
      !this.initializing && !_RE_RogueEngine_rogue_rapier_Lib_RogueRapier__WEBPACK_IMPORTED_MODULE_4__["default"].world && this.doStart();
      return;
    }
    const selectedObjects = window["rogue-editor"].Project.selectedObjects;
    if (!this.arraysAreEqual(selectedObjects, this.selectedObjects)) {
      this.selectedObjects = selectedObjects.slice(0);
      this.resetComponents();
      this.setupImpostors();
    }
    if (!_RE_RogueEngine_rogue_rapier_Lib_RogueRapier__WEBPACK_IMPORTED_MODULE_4__["default"].world || !_RE_RogueEngine_rogue_rapier_Lib_RogueRapier__WEBPACK_IMPORTED_MODULE_4__["default"].world.bodies || _RE_RogueEngine_rogue_rapier_Lib_RogueRapier__WEBPACK_IMPORTED_MODULE_4__["default"].world && _RE_RogueEngine_rogue_rapier_Lib_RogueRapier__WEBPACK_IMPORTED_MODULE_4__["default"].world.bodies.len() === 0) {
      return;
    }
    this.updateImpostors();
  }
  updateImpostors() {
    this.lines.visible = true;
    const flagForRemoval = [];
    this.colliders.forEach((component) => {
      if (component instanceof _Colliders_RapierCollider__WEBPACK_IMPORTED_MODULE_2__["default"] && component.object3d && component.bodyComponent) {
        if (!component.enabled || !component.bodyComponent.enabled) {
          component.initialized = false;
          flagForRemoval.push(component);
          return;
        }
        const pos = component.bodyComponent.object3d.position;
        const rot = component.bodyComponent.object3d.quaternion;
        component.body.setTranslation(new _dimforge_rapier3d_compat__WEBPACK_IMPORTED_MODULE_5__["default"].Vector3(pos.x, pos.y, pos.z), false);
        component.body.setRotation(new _dimforge_rapier3d_compat__WEBPACK_IMPORTED_MODULE_5__["default"].Quaternion(rot.x, rot.y, rot.z, rot.w), false);
        component.setColliderRot();
        component.setColliderPos();
      }
    });
    if (flagForRemoval.length > 0) {
      this.resetComponents();
      this.setupImpostors();
    }
    flagForRemoval.forEach((component) => this.colliders.splice(this.colliders.indexOf(component), 1));
    let buffers = _RE_RogueEngine_rogue_rapier_Lib_RogueRapier__WEBPACK_IMPORTED_MODULE_4__["default"].world.debugRender();
    this.lines.geometry.setAttribute("position", new three__WEBPACK_IMPORTED_MODULE_1__.BufferAttribute(buffers.vertices, 3));
    this.lines.geometry.setAttribute("color", new three__WEBPACK_IMPORTED_MODULE_1__.BufferAttribute(buffers.colors, 4));
  }
  cleanupImpostors() {
    _RE_RogueEngine_rogue_rapier_Lib_RogueRapier__WEBPACK_IMPORTED_MODULE_4__["default"].world && _RE_RogueEngine_rogue_rapier_Lib_RogueRapier__WEBPACK_IMPORTED_MODULE_4__["default"].world.colliders.forEach((col) => _RE_RogueEngine_rogue_rapier_Lib_RogueRapier__WEBPACK_IMPORTED_MODULE_4__["default"].world.removeCollider(col, true));
    _RE_RogueEngine_rogue_rapier_Lib_RogueRapier__WEBPACK_IMPORTED_MODULE_4__["default"].world && _RE_RogueEngine_rogue_rapier_Lib_RogueRapier__WEBPACK_IMPORTED_MODULE_4__["default"].world.bodies.forEach((body) => _RE_RogueEngine_rogue_rapier_Lib_RogueRapier__WEBPACK_IMPORTED_MODULE_4__["default"].world.removeRigidBody(body));
    this.lines.visible = false;
    rogue_engine__WEBPACK_IMPORTED_MODULE_0__.App.sceneController.scene.remove(this.lines);
    this.colliders = [];
  }
  async setupImpostors() {
    this.cleanupImpostors();
    if (this.selectedObjects[0] === rogue_engine__WEBPACK_IMPORTED_MODULE_0__.App.currentScene)
      return;
    this.selectedObjects.forEach((selected) => {
      if (selected === rogue_engine__WEBPACK_IMPORTED_MODULE_0__.App.currentScene)
        return;
      selected.traverse((object) => {
        const objComponents = rogue_engine__WEBPACK_IMPORTED_MODULE_0__.components[object.uuid];
        if (!objComponents)
          return;
        objComponents.forEach((component) => {
          if (component instanceof _RapierBody_re__WEBPACK_IMPORTED_MODULE_3__["default"]) {
            component.init();
            this.colliders.push(component);
          }
          if (component instanceof _Colliders_RapierCollider__WEBPACK_IMPORTED_MODULE_2__["default"]) {
            const bodyComponent = component.getBodyComponent(component.object3d);
            if (bodyComponent) {
              bodyComponent.init();
            }
            component.init();
            this.colliders.push(component);
          }
        });
      });
    });
    rogue_engine__WEBPACK_IMPORTED_MODULE_0__.App.sceneController.scene.add(this.lines);
  }
  arraysAreEqual(array1, array2) {
    if (array1.length !== array2.length)
      return false;
    return array1.every((element, i) => {
      return array2[i] === element;
    });
  }
  onBeforeRemoved() {
    rogue_engine__WEBPACK_IMPORTED_MODULE_0__.App.sceneController.scene.remove(this.lines);
    this.handleOnComponentAdded.stop();
    this.handleOnComponentRemoved.stop();
    this.handleOnPlay.stop();
    this.initializedPhysics = false;
    this.initializing = false;
    this.cleanupImpostors();
  }
}
__name(RapierBodyWireframe, "RapierBodyWireframe");
RapierBodyWireframe.isEditorComponent = true;
rogue_engine__WEBPACK_IMPORTED_MODULE_0__.registerComponent(RapierBodyWireframe);


/***/ })

},
/******/ __webpack_require__ => { // webpackRuntimeModules
/******/ var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
/******/ var __webpack_exports__ = (__webpack_exec__("./Assets/rogue_packages/RogueEngine/rogue-animator/Bricks.ts"), __webpack_exec__("./Assets/rogue_packages/RogueEngine/rogue-animator/RogueAnimator.re.ts"), __webpack_exec__("./Assets/rogue_packages/RogueEngine/rogue-rapier/Bricks/KinematicControllerBricks.ts"), __webpack_exec__("./Assets/rogue_packages/RogueEngine/rogue-rapier/Bricks/RapierBricks.ts"), __webpack_exec__("./Assets/rogue_packages/RogueEngine/rogue-rapier/Components/_Editor/RapierBodyWireframe.re.ts"), __webpack_exec__("./Assets/rogue_packages/RogueEngine/rogue-rapier/Components/Colliders/RapierBall.re.ts"), __webpack_exec__("./Assets/rogue_packages/RogueEngine/rogue-rapier/Components/Colliders/RapierCapsule.re.ts"), __webpack_exec__("./Assets/rogue_packages/RogueEngine/rogue-rapier/Components/Colliders/RapierCollider.ts"), __webpack_exec__("./Assets/rogue_packages/RogueEngine/rogue-rapier/Components/Colliders/RapierCone.re.ts"), __webpack_exec__("./Assets/rogue_packages/RogueEngine/rogue-rapier/Components/Colliders/RapierCuboid.re.ts"), __webpack_exec__("./Assets/rogue_packages/RogueEngine/rogue-rapier/Components/Colliders/RapierCylinder.re.ts"), __webpack_exec__("./Assets/rogue_packages/RogueEngine/rogue-rapier/Components/Colliders/RapierTrimesh.re.ts"), __webpack_exec__("./Assets/rogue_packages/RogueEngine/rogue-rapier/Components/Controllers/RapierFirstPersonController.re.ts"), __webpack_exec__("./Assets/rogue_packages/RogueEngine/rogue-rapier/Components/Controllers/RapierRaycastVehicleController.re.ts"), __webpack_exec__("./Assets/rogue_packages/RogueEngine/rogue-rapier/Components/Controllers/RapierThirdPersonController.re.ts"), __webpack_exec__("./Assets/rogue_packages/RogueEngine/rogue-rapier/Components/Controllers/RapierWheelInfo.re.ts"), __webpack_exec__("./Assets/rogue_packages/RogueEngine/rogue-rapier/Components/RapierBody.re.ts"), __webpack_exec__("./Assets/rogue_packages/RogueEngine/rogue-rapier/Components/RapierConfig.re.ts"), __webpack_exec__("./Assets/rogue_packages/RogueEngine/rogue-rapier/Components/RapierKinematicCharacterController.re.ts"), __webpack_exec__("./Assets/rogue_packages/RogueEngine/rogue-rapier/Lib/RogueRapier.ts"), __webpack_exec__("./Assets/Scripts/GameLogic.re.ts"), __webpack_exec__("./Assets/Scripts/NetworkManager.re.ts"), __webpack_exec__("./Assets/Scripts/PlayerController.re.ts"));
/******/ return __webpack_exports__;
/******/ }
]);
});
//# sourceMappingURL=rogue-editor-user-scripts.js.map