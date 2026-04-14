import Phaser from 'phaser'
import { GAME_HEIGHT, GAME_WIDTH } from '../config'

export class FarmScene extends Phaser.Scene {
  constructor() {
    super('farm-scene')
  }

  create() {
    this.add
      .rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, 0x7bb96f)
      .setStrokeStyle(6, 0xf2e2b1)

    this.add.rectangle(GAME_WIDTH / 2, 58, 200, 46, 0x29462b, 0.92).setOrigin(0.5)
    this.add
      .text(GAME_WIDTH / 2, 48, 'StardewAI Codex', {
        color: '#f6eedc',
        fontFamily: 'Verdana',
        fontSize: '22px',
      })
      .setOrigin(0.5)
    this.add
      .text(GAME_WIDTH / 2, 72, 'Canvas baseline pronta para PCs fracos', {
        color: '#f6eedc',
        fontFamily: 'Verdana',
        fontSize: '11px',
      })
      .setOrigin(0.5)

    this.add.rectangle(GAME_WIDTH / 2, 170, 232, 94, 0x6e4e2f).setStrokeStyle(4, 0x4a331e)
    this.add.rectangle(GAME_WIDTH / 2, 152, 252, 34, 34, 0x8c5b35)
    this.add.rectangle(GAME_WIDTH / 2, 186, 34, 50, 0x342012)
    this.add.rectangle(GAME_WIDTH / 2, 200, 14, 22, 0xe1c670)

    this.add
      .text(GAME_WIDTH / 2, 234, 'Placeholder da casinha do personagem', {
        color: '#2b1c12',
        fontFamily: 'Verdana',
        fontSize: '10px',
        backgroundColor: '#f2d58a',
        padding: { left: 6, right: 6, top: 4, bottom: 4 },
      })
      .setOrigin(0.5)

    this.add
      .text(
        GAME_WIDTH / 2,
        258,
        'Proximas tasks: assets, mapa, casa real, player e interacoes.',
        {
          color: '#173322',
          fontFamily: 'Verdana',
          fontSize: '10px',
        },
      )
      .setOrigin(0.5)
  }
}
