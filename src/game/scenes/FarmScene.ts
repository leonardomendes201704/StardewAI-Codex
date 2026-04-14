import Phaser from 'phaser'
import { createInitialInteractionAnchors } from '../data/interactionData'
import { createWorldData, getPlotStates } from '../data/worldData'
import { DialogUi } from '../ui/DialogUi'

type FarmSceneKeys = Record<'w' | 'a' | 's' | 'd' | 'e', Phaser.Input.Keyboard.Key>

export class FarmScene extends Phaser.Scene {
  private cursors?: Phaser.Types.Input.Keyboard.CursorKeys
  private keys?: FarmSceneKeys
  private player?: Phaser.Physics.Arcade.Sprite
  private interactionAnchors = createInitialInteractionAnchors()
  private activeInteraction?: ReturnType<typeof createInitialInteractionAnchors>[number]
  private promptText?: Phaser.GameObjects.Text
  private dialogUi?: DialogUi
  private decorLayer?: Phaser.Tilemaps.TilemapLayer
  private npc?: Phaser.GameObjects.Sprite
  private plotState: 'calm' | 'grown' = 'calm'
  private lastDirection: 'down' | 'left' | 'up' = 'down'
  private facingRight = false

  constructor() {
    super('farm-scene')
  }

  preload() {
    this.load.spritesheet('world', '/assets/world/farm-slice.png', {
      frameWidth: 16,
      frameHeight: 16,
    })
    this.load.spritesheet('player-walk', '/assets/characters/player-walk.png', {
      frameWidth: 32,
      frameHeight: 32,
    })
    this.load.spritesheet('player-idle', '/assets/characters/player-idle.png', {
      frameWidth: 32,
      frameHeight: 32,
    })
    this.load.spritesheet('npc-idle', '/assets/characters/npc-idle.png', {
      frameWidth: 32,
      frameHeight: 32,
    })
  }

  create() {
    const world = createWorldData()
    const map = this.make.tilemap({
      width: world.columns,
      height: world.rows,
      tileWidth: world.tileSize,
      tileHeight: world.tileSize,
    })
    const tileset = map.addTilesetImage('world')

    if (!tileset) {
      throw new Error('Nao foi possivel criar o tileset do mundo.')
    }

    const groundLayer = map.createBlankLayer('ground', tileset)
    const collisionLayer = map.createBlankLayer('collision', tileset)
    const decorLayer = map.createBlankLayer('decor', tileset)

    if (!groundLayer || !collisionLayer || !decorLayer) {
      throw new Error('Nao foi possivel criar as camadas do mapa.')
    }

    groundLayer.putTilesAt(world.layers.ground, 0, 0)
    collisionLayer.putTilesAt(world.layers.collision, 0, 0)
    decorLayer.putTilesAt(world.layers.decor, 0, 0)

    groundLayer.setDepth(0)
    collisionLayer.setDepth(1)
    decorLayer.setDepth(3)
    collisionLayer.setCollisionByExclusion([-1])
    this.decorLayer = decorLayer

    const worldWidth = world.columns * world.tileSize
    const worldHeight = world.rows * world.tileSize

    this.add
      .rectangle(0, 0, worldWidth, worldHeight, 0x0f1713, 0)
      .setOrigin(0)
      .setStrokeStyle(12, 0xf3e7be)
      .setDepth(3)

    this.add
      .text(
        world.house.tileX * world.tileSize + world.house.width * 8,
        world.house.tileY * world.tileSize - 16,
        'Casinha do personagem',
        {
          color: '#f6eedc',
          fontFamily: 'Verdana',
          fontSize: '12px',
          backgroundColor: '#314c35',
          padding: { left: 8, right: 8, top: 4, bottom: 4 },
        },
      )
      .setOrigin(0.5)
      .setDepth(4)

    this.cameras.main.setBounds(0, 0, worldWidth, worldHeight)
    this.cameras.main.centerOn(world.focusTileX * world.tileSize, world.focusTileY * world.tileSize)
    this.cameras.main.setBackgroundColor('#18241e')
    this.cameras.main.roundPixels = true

    this.physics.world.setBounds(0, 0, worldWidth, worldHeight)
    this.createPlayer(world, collisionLayer)
    this.createNpc()
    this.createInteractionUi()

    const keyboard = this.input.keyboard

    if (!keyboard) {
      throw new Error('Teclado indisponivel para controle do personagem.')
    }

    this.cursors = keyboard.createCursorKeys()
    this.keys = this.createInputKeys(keyboard)
  }

  update() {
    if (!this.player || !this.cursors || !this.keys) {
      return
    }

    if (this.dialogUi?.isOpen()) {
      this.player.setVelocity(0, 0)
      this.playIdleAnimation()
      this.promptText?.setVisible(false)

      if (Phaser.Input.Keyboard.JustDown(this.keys.e)) {
        this.dialogUi.hide()
      }

      return
    }

    const horizontal =
      (this.cursors.left.isDown || this.keys.a.isDown ? -1 : 0) +
      (this.cursors.right.isDown || this.keys.d.isDown ? 1 : 0)
    const vertical =
      (this.cursors.up.isDown || this.keys.w.isDown ? -1 : 0) +
      (this.cursors.down.isDown || this.keys.s.isDown ? 1 : 0)

    const movement = new Phaser.Math.Vector2(horizontal, vertical)
    const isMoving = movement.lengthSq() > 0

    if (isMoving) {
      movement.normalize().scale(90)
      this.player.setVelocity(movement.x, movement.y)
      this.updateDirection(horizontal, vertical)
      this.playWalkAnimation()
    } else {
      this.player.setVelocity(0, 0)
      this.playIdleAnimation()
    }

    this.activeInteraction = this.resolveNearbyInteraction()
    this.syncPrompt()

    if (this.activeInteraction && Phaser.Input.Keyboard.JustDown(this.keys.e)) {
      this.handleInteraction(this.activeInteraction)
    }
  }

  private createPlayer(
    world: ReturnType<typeof createWorldData>,
    collisionLayer: Phaser.Tilemaps.TilemapLayer,
  ) {
    this.createPlayerAnimations()

    const x = world.spawnTileX * world.tileSize + world.tileSize / 2
    const y = world.spawnTileY * world.tileSize + world.tileSize / 2

    this.player = this.physics.add.sprite(x, y, 'player-idle', 0)
    this.player.setDepth(2)
    this.player.setCollideWorldBounds(true)
    this.player.setSize(12, 10)
    this.player.setOffset(10, 20)
    this.physics.add.collider(this.player, collisionLayer)
    this.cameras.main.startFollow(this.player, true)
    this.playIdleAnimation()
  }

  private createPlayerAnimations() {
    if (!this.anims.exists('player-walk-down')) {
      this.anims.create({
        key: 'player-walk-down',
        frames: this.anims.generateFrameNumbers('player-walk', { start: 0, end: 2 }),
        frameRate: 7,
        repeat: -1,
      })
    }

    if (!this.anims.exists('player-walk-left')) {
      this.anims.create({
        key: 'player-walk-left',
        frames: this.anims.generateFrameNumbers('player-walk', { start: 3, end: 5 }),
        frameRate: 7,
        repeat: -1,
      })
    }

    if (!this.anims.exists('player-walk-up')) {
      this.anims.create({
        key: 'player-walk-up',
        frames: this.anims.generateFrameNumbers('player-walk', { start: 6, end: 8 }),
        frameRate: 7,
        repeat: -1,
      })
    }

    if (!this.anims.exists('player-idle-down')) {
      this.anims.create({
        key: 'player-idle-down',
        frames: [{ key: 'player-idle', frame: 0 }],
      })
    }

    if (!this.anims.exists('player-idle-left')) {
      this.anims.create({
        key: 'player-idle-left',
        frames: [{ key: 'player-idle', frame: 1 }],
      })
    }

    if (!this.anims.exists('player-idle-up')) {
      this.anims.create({
        key: 'player-idle-up',
        frames: [{ key: 'player-idle', frame: 2 }],
      })
    }
  }

  private createInputKeys(keyboard: Phaser.Input.Keyboard.KeyboardPlugin): FarmSceneKeys {
    return {
      w: keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
      a: keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
      s: keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),
      d: keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D),
      e: keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E),
    }
  }

  private playWalkAnimation() {
    if (!this.player) {
      return
    }

    switch (this.lastDirection) {
      case 'left':
        this.player.play('player-walk-left', true)
        break
      case 'up':
        this.player.play('player-walk-up', true)
        break
      default:
        this.player.play('player-walk-down', true)
        break
    }

    this.player.setFlipX(this.facingRight)
  }

  private playIdleAnimation() {
    if (!this.player) {
      return
    }

    switch (this.lastDirection) {
      case 'left':
        this.player.play('player-idle-left', true)
        break
      case 'up':
        this.player.play('player-idle-up', true)
        break
      default:
        this.player.play('player-idle-down', true)
        break
    }

    this.player.setFlipX(this.facingRight)
  }

  private updateDirection(horizontal: number, vertical: number) {
    if (!this.player) {
      return
    }

    if (horizontal > 0) {
      this.lastDirection = 'left'
      this.facingRight = true
      return
    }

    if (horizontal < 0) {
      this.lastDirection = 'left'
      this.facingRight = false
      return
    }

    if (vertical < 0) {
      this.lastDirection = 'up'
      this.facingRight = false
      return
    }

    if (vertical > 0) {
      this.lastDirection = 'down'
      this.facingRight = false
    }
  }

  private createInteractionUi() {
    this.dialogUi = new DialogUi(this)
    this.promptText = this.add
      .text(12, 248, '', {
        color: '#1e1a10',
        fontFamily: 'Verdana',
        fontSize: '11px',
        backgroundColor: '#f5d787',
        padding: { left: 8, right: 8, top: 5, bottom: 5 },
      })
      .setDepth(10)
      .setScrollFactor(0)
      .setVisible(false)
  }

  private resolveNearbyInteraction() {
    if (!this.player) {
      return undefined
    }

    const player = this.player

    return this.interactionAnchors.find((anchor) => {
      const anchorX = anchor.tileX * 16 + 8
      const anchorY = anchor.tileY * 16 + 8
      return Phaser.Math.Distance.Between(player.x, player.y, anchorX, anchorY) <= anchor.radius
    })
  }

  private syncPrompt() {
    if (!this.promptText) {
      return
    }

    if (!this.activeInteraction) {
      this.promptText.setVisible(false)
      return
    }

    this.promptText.setText(`E: ${this.activeInteraction.prompt}`)
    this.promptText.setVisible(true)
  }

  private createNpc() {
    this.npc = this.add.sprite(36 * 16 + 8, 12 * 16 + 8, 'npc-idle', 0)
    this.npc.setDepth(2)
  }

  private handleInteraction(anchor: ReturnType<typeof createInitialInteractionAnchors>[number]) {
    switch (anchor.id) {
      case 'farm-plot':
        this.togglePlotState()
        this.dialogUi?.show(anchor.title, [
          ...anchor.dialogLines,
          this.plotState === 'grown'
            ? 'Agora o canteiro parece mais cheio e pronto para a proxima fase.'
            : 'As mudas voltaram ao estado inicial de demonstracao.',
        ])
        break
      case 'village-npc':
        if (this.npc && this.player) {
          this.npc.setFlipX(this.player.x < this.npc.x)
        }
        this.dialogUi?.show(anchor.title, anchor.dialogLines)
        break
      default:
        this.dialogUi?.show(anchor.title, anchor.dialogLines)
        break
    }
  }

  private togglePlotState() {
    if (!this.decorLayer) {
      return
    }

    this.plotState = this.plotState === 'calm' ? 'grown' : 'calm'
    const states = getPlotStates()
    const nextState = states[this.plotState]

    ;[
      { x: 28, y: 12 },
      { x: 29, y: 12 },
      { x: 30, y: 12 },
      { x: 31, y: 12 },
      { x: 28, y: 13 },
      { x: 29, y: 13 },
      { x: 30, y: 13 },
      { x: 31, y: 13 },
      { x: 28, y: 14 },
      { x: 29, y: 14 },
      { x: 30, y: 14 },
      { x: 31, y: 14 },
    ].forEach(({ x, y }) => this.decorLayer?.removeTileAt(x, y))

    nextState.forEach(({ x, y, frame }) => {
      this.decorLayer?.putTileAt(frame, x, y)
    })
  }
}
