import Phaser from 'phaser'

const VIEWPORT_WIDTH = 640
const VIEWPORT_HEIGHT = 360

export class FarmScene extends Phaser.Scene {
  constructor() {
    super('farm-scene')
  }

  create() {
    this.add
      .rectangle(VIEWPORT_WIDTH / 2, VIEWPORT_HEIGHT / 2, VIEWPORT_WIDTH, VIEWPORT_HEIGHT, 0x7bb96f)
      .setStrokeStyle(6, 0xf2e2b1)

    this.add.rectangle(VIEWPORT_WIDTH / 2, 72, 210, 54, 0x29462b, 0.92).setOrigin(0.5)
    this.add
      .text(VIEWPORT_WIDTH / 2, 60, 'StardewAI Codex', {
        color: '#f6eedc',
        fontFamily: 'Verdana',
        fontSize: '26px',
      })
      .setOrigin(0.5)
    this.add
      .text(VIEWPORT_WIDTH / 2, 92, 'Base da cena principal pronta', {
        color: '#f6eedc',
        fontFamily: 'Verdana',
        fontSize: '12px',
      })
      .setOrigin(0.5)

    this.add.rectangle(VIEWPORT_WIDTH / 2, 214, 300, 118, 0x6e4e2f).setStrokeStyle(4, 0x4a331e)
    this.add.rectangle(VIEWPORT_WIDTH / 2, 193, 330, 44, 0x8c5b35)
    this.add.rectangle(VIEWPORT_WIDTH / 2, 232, 42, 64, 0x342012)
    this.add.rectangle(VIEWPORT_WIDTH / 2, 250, 18, 28, 0xe1c670)

    this.add
      .text(VIEWPORT_WIDTH / 2, 305, 'Placeholder da casinha do personagem', {
        color: '#2b1c12',
        fontFamily: 'Verdana',
        fontSize: '11px',
        backgroundColor: '#f2d58a',
        padding: { left: 8, right: 8, top: 5, bottom: 5 },
      })
      .setOrigin(0.5)

    this.add
      .text(
        VIEWPORT_WIDTH / 2,
        334,
        'TASK-009 e TASK-010 vao substituir esta base por tiles e interacoes reais.',
        {
          color: '#173322',
          fontFamily: 'Verdana',
          fontSize: '10px',
        },
      )
      .setOrigin(0.5)
  }
}
