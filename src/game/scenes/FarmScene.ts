import Phaser from 'phaser'
import { createInitialInteractionAnchors } from '../data/interactionData'
import { createWorldData } from '../data/worldData'

export class FarmScene extends Phaser.Scene {
  private cursors?: Phaser.Types.Input.Keyboard.CursorKeys
  private keys?: Record<'w' | 'a' | 's' | 'd' | 'e', Phaser.Input.Keyboard.Key>
  private player?: Phaser.Physics.Arcade.Sprite
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
  }

  create() {
    const world = createWorldData()
    const interactionAnchors = createInitialInteractionAnchors()
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
    decorLayer.setDepth(2)

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

    interactionAnchors.forEach((anchor) => {
      this.add
        .text(
          anchor.tileX * world.tileSize + world.tileSize / 2,
          anchor.tileY * world.tileSize - 10,
          'E',
          {
            color: '#2b1c12',
            fontFamily: 'Verdana',
            fontSize: '11px',
            backgroundColor: '#f5d787',
            padding: { left: 4, right: 4, top: 2, bottom: 2 },
          },
        )
        .setOrigin(0.5)
        .setDepth(4)
    })

    this.cameras.main.setBounds(0, 0, worldWidth, worldHeight)
    this.cameras.main.centerOn(
      world.focusTileX * world.tileSize,
      world.focusTileY * world.tileSize,
    )
    this.cameras.main.setBackgroundColor('#18241e')

    this.physics.world.setBounds(0, 0, worldWidth, worldHeight)
    this.createPlayer(world)

    this.cursors = this.input.keyboard?.createCursorKeys()
    const keyboard = this.input.keyboard

    if (!keyboard) {
      throw new Error('Teclado indisponivel para controle do personagem.')
    }

    this.keys = keyboard.addKeys('W,A,S,D,E') as Record<
      'w' | 'a' | 's' | 'd' | 'e',
      Phaser.Input.Keyboard.Key
    >
  }

  update() {
    if (!this.player || !this.cursors || !this.keys) {
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
      return
    }

    this.player.setVelocity(0, 0)
    this.playIdleAnimation()
  }

  private createPlayer(world: ReturnType<typeof createWorldData>) {
    this.createPlayerAnimations()

    const x = world.spawnTileX * world.tileSize + world.tileSize / 2
    const y = world.spawnTileY * world.tileSize + world.tileSize / 2

    this.player = this.physics.add.sprite(x, y, 'player-idle', 0)
    this.player.setDepth(5)
    this.player.setCollideWorldBounds(true)
    this.player.setSize(12, 10)
    this.player.setOffset(10, 20)
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
}
