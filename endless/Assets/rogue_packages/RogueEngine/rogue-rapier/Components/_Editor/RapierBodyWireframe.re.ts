import * as RE from 'rogue-engine';
import * as THREE from 'three';

import RapierCollider from '../Colliders/RapierCollider';
import RAPIER from '@dimforge/rapier3d-compat';
import RapierBody from '../RapierBody.re';
import RogueRapier from '@RE/RogueEngine/rogue-rapier/Lib/RogueRapier';

export default class RapierBodyWireframe extends RE.Component {
  static isEditorComponent = true;

  selectedObjects: THREE.Object3D[] = [];
  colliders: (RapierCollider | RapierBody)[] = [];

  lines = new THREE.LineSegments(
    new THREE.BufferGeometry(),
    new THREE.LineBasicMaterial({ color: new THREE.Color("#00FF00") })
  );

  initializedPhysics = false;
  initializing = false;

  private handleOnComponentAdded = { stop: () => { } };
  private handleOnComponentRemoved = { stop: () => { } };

  private handleOnPlay = { stop: () => { } };

  private resetHandler = (component: RE.Component) => {
    component instanceof RapierCollider && this.setupImpostors();
  }

  async initPhysics() {
    await RAPIER.init();
  }

  start() {
    try {
      RogueRapier.world?.free();
    } catch {};

    RogueRapier.world = undefined as any;
  }

  doStart() {
    this.initializing = true;
    this.initializedPhysics = false;

    this.lines.geometry.computeBoundingSphere();
    this.lines.frustumCulled = false;

    try {
      RogueRapier.world?.free();
    } catch {};

    this.initPhysics().then(() => {
      RogueRapier.world = new RAPIER.World({x: 0, y: 0, z: 0});
      this.initializedPhysics = true;
      this.initializing = false;
    });

    RE.App.sceneController.scene.remove(this.lines);

    this.lines.userData.isEditorObject = true;
    RE.App.sceneController.scene.add(this.lines);

    this.handleOnComponentAdded.stop();
    this.handleOnComponentRemoved.stop();
    this.handleOnPlay.stop();

    this.handleOnComponentAdded = RE.onComponentAdded(this.resetHandler);
    this.handleOnComponentRemoved = RE.onComponentRemoved(this.resetHandler);

    this.handleOnPlay = RE.Runtime.onPlay(() => {
      try {
        RogueRapier.world?.free();
      } catch {};
      this.handleOnComponentAdded.stop();
      this.handleOnComponentRemoved.stop();
      this.initializedPhysics = false;
      this.initializing = false;
    });
  }

  resetComponents() {
    this.selectedObjects.forEach(selected => {
      if (!selected) return;
      selected.traverse(object => {
        const objComponents = RE.components[object.uuid];

        if (!objComponents) return;

        objComponents.forEach(component => {
          if (component instanceof RapierBody || component instanceof RapierCollider) {
            component.initialized = false;
          }
        });
      });
    });
  }

  afterUpdate() {
    if (!this.enabled) return;
    this.lines.visible = false;
    if (!this.initializedPhysics || !RogueRapier.world || !RogueRapier.world?.bodies) {
      !this.initializing && !RogueRapier.world && this.doStart();
      return;
    }

    const selectedObjects = window["rogue-editor"].Project.selectedObjects as THREE.Object3D[];

    if (!this.arraysAreEqual(selectedObjects, this.selectedObjects)) {
      // this.resetComponents();
      this.selectedObjects = selectedObjects.slice(0);
      this.resetComponents();
      this.setupImpostors();
    }

    if (!RogueRapier.world || !RogueRapier.world?.bodies || (RogueRapier.world && RogueRapier.world?.bodies?.len() === 0)) {
      return;
    }

    this.updateImpostors();
  }

  private updateImpostors() {
    this.lines.visible = true;

    // RogueRapier.world.step(RogueRapier.eventQueue);

    const flagForRemoval: (RapierCollider | RapierBody)[] = [];

    this.colliders.forEach(component => {
      if (component instanceof RapierCollider && component.object3d && component.bodyComponent) {
        if (!component.enabled || !component.bodyComponent.enabled) {
          component.initialized = false;
          flagForRemoval.push(component);
          return;
        }
        const pos = component.bodyComponent.object3d.position;
        const rot = component.bodyComponent.object3d.quaternion;
        component.body.setTranslation(new RAPIER.Vector3(pos.x, pos.y, pos.z), false);
        component.body.setRotation(new RAPIER.Quaternion(rot.x, rot.y, rot.z, rot.w), false);
        component.setColliderRot();
        component.setColliderPos();
      }
    });

    if (flagForRemoval.length > 0) {
      this.resetComponents();
      this.setupImpostors();
    }

    flagForRemoval.forEach(component => this.colliders.splice(this.colliders.indexOf(component), 1));

    let buffers = RogueRapier.world.debugRender();

    this.lines.geometry.setAttribute(
      "position",
      new THREE.BufferAttribute(buffers.vertices, 3),
    );

    this.lines.geometry.setAttribute(
      "color",
      new THREE.BufferAttribute(buffers.colors, 4),
    );
  }

  private cleanupImpostors() {
    RogueRapier.world && RogueRapier.world.colliders.forEach(col => RogueRapier.world.removeCollider(col, true));
    RogueRapier.world && RogueRapier.world.bodies.forEach(body => RogueRapier.world.removeRigidBody(body));

    this.lines.visible = false;
    RE.App.sceneController.scene.remove(this.lines);

    this.colliders = [];
  }

  private async setupImpostors() {
    this.cleanupImpostors();

    if (this.selectedObjects[0] === RE.App.currentScene) return;

    this.selectedObjects.forEach(selected => {
      if (selected === RE.App.currentScene) return;
      selected.traverse(object => {
        const objComponents = RE.components[object.uuid];

        if (!objComponents) return;

        objComponents.forEach(component => {
          if (component instanceof RapierBody) {
            component.init();
            this.colliders.push(component);
          }

          if (component instanceof RapierCollider) {
            const bodyComponent = component.getBodyComponent(component.object3d);

            if (bodyComponent) {
              bodyComponent.init();
            }

            component.init();
            // component.collider && 
            // component.collider.setSensor(true);
            this.colliders.push(component);
          }
        });
      });
    });

    RE.App.sceneController.scene.add(this.lines);
  }

  private arraysAreEqual(array1: any[], array2: any[]) {
    if (array1.length !== array2.length) return false;

    return array1.every((element, i) => {
      return array2[i] === element;
    });
  }

  onBeforeRemoved() {
    RE.App.sceneController.scene.remove(this.lines);
    this.handleOnComponentAdded.stop();
    this.handleOnComponentRemoved.stop();
    this.handleOnPlay.stop();
    this.initializedPhysics = false;
    this.initializing = false;
    this.cleanupImpostors();
  }
}

RE.registerComponent(RapierBodyWireframe);
