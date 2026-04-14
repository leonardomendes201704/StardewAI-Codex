import Phaser from 'phaser'

export class DialogUi {
  private readonly container: Phaser.GameObjects.Container
  private readonly titleText: Phaser.GameObjects.Text
  private readonly bodyText: Phaser.GameObjects.Text

  constructor(scene: Phaser.Scene) {
    const background = scene.add
      .rectangle(256, 238, 488, 86, 0x243628, 0.94)
      .setStrokeStyle(3, 0xf5d787)
      .setScrollFactor(0)

    this.titleText = scene.add
      .text(28, 202, '', {
        color: '#f5d787',
        fontFamily: 'Verdana',
        fontSize: '12px',
      })
      .setScrollFactor(0)

    this.bodyText = scene.add
      .text(28, 222, '', {
        color: '#f6eedc',
        fontFamily: 'Verdana',
        fontSize: '11px',
        wordWrap: { width: 444 },
      })
      .setScrollFactor(0)

    const hintText = scene.add
      .text(424, 272, 'E fecha', {
        color: '#f6eedc',
        fontFamily: 'Verdana',
        fontSize: '10px',
      })
      .setScrollFactor(0)

    this.container = scene.add
      .container(0, 0, [background, this.titleText, this.bodyText, hintText])
      .setDepth(20)
      .setVisible(false)
  }

  show(title: string, lines: string[]) {
    this.titleText.setText(title)
    this.bodyText.setText(lines.join('\n'))
    this.container.setVisible(true)
  }

  hide() {
    this.container.setVisible(false)
  }

  isOpen() {
    return this.container.visible
  }
}
