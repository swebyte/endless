import * as RE from "rogue-engine";

@RE.registerComponent
export default class HelloWorld extends RE.Component {
  awake() {
    console.log("Hello, from HelloWorld:awake()!");
  }

  start() {
    console.log("Hello, from HelloWorld:start()!");
  }

  update() {}
}
