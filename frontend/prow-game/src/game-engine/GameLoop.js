/**
 * Drives the render loop using requestAnimationFrame.
 */
export class GameLoop {
  /**
   * @param {(deltaTime: number) => void} updateFn  called each frame with delta in seconds
   * @param {() => void} renderFn  called each frame after update
   */
  constructor(updateFn, renderFn) {
    this.updateFn = updateFn;
    this.renderFn = renderFn;
    this.animationId = null;
    this.lastTime = 0;
    this.isRunning = false;
  }

  start() {
    if (this.isRunning) return;
    this.isRunning = true;
    this.lastTime = performance.now();
    this.animationId = requestAnimationFrame((ts) => this._loop(ts));
  }

  stop() {
    this.isRunning = false;
    if (this.animationId !== null) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }

  /**
   * @param {number} timestamp
   */
  _loop(timestamp) {
    if (!this.isRunning) return;

    const deltaTime = Math.min((timestamp - this.lastTime) / 1000, 0.1); // cap at 100ms
    this.lastTime = timestamp;

    this.updateFn(deltaTime);
    this.renderFn();

    this.animationId = requestAnimationFrame((ts) => this._loop(ts));
  }
}
