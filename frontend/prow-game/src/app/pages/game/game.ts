import { Component, ElementRef, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { SceneManager } from '../../../game-engine/SceneManager';
import { GameLoop } from '../../../game-engine/GameLoop';

@Component({
  selector: 'app-game',
  imports: [],
  templateUrl: './game.html',
  styleUrl: './game.css',
})
export class Game implements OnInit, OnDestroy {
  @ViewChild('gameCanvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private sceneManager!: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private gameLoop!: any;

  ngOnInit(): void {
    const canvas = this.canvasRef.nativeElement;
    this.sceneManager = new SceneManager(canvas);
    this.sceneManager.init();

    this.gameLoop = new GameLoop(
      (dt: number) => this.sceneManager.update(dt),
      () => this.sceneManager.render()
    );
    this.gameLoop.start();
  }

  ngOnDestroy(): void {
    this.gameLoop?.stop();
    this.sceneManager?.dispose();
  }
}
