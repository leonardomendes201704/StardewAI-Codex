import Phaser from 'phaser'
import { FarmScene } from './scenes/FarmScene'

export function createGameConfig(parent: HTMLElement): Phaser.Types.Core.GameConfig {
  return {
    type: Phaser.AUTO,
    parent,
    backgroundColor: '#9fd48f',
    width: 640,
    height: 360,
    scene: [FarmScene],
  }
}
