import Phaser from 'phaser'
import { FarmScene } from './scenes/FarmScene'

export const GAME_WIDTH = 512
export const GAME_HEIGHT = 288

export function createGameConfig(parent: HTMLElement): Phaser.Types.Core.GameConfig {
  return {
    type: Phaser.CANVAS,
    parent,
    pixelArt: true,
    antialias: false,
    roundPixels: true,
    autoRound: true,
    disableContextMenu: true,
    backgroundColor: '#9fd48f',
    width: GAME_WIDTH,
    height: GAME_HEIGHT,
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    physics: {
      default: 'arcade',
      arcade: {
        fps: 30,
        fixedStep: true,
        debug: false,
      },
    },
    scene: [FarmScene],
  }
}
