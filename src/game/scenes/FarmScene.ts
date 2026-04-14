import Phaser from 'phaser'
import { createInitialInteractionAnchors } from '../data/interactionData'
import { createWorldData } from '../data/worldData'

export class FarmScene extends Phaser.Scene {
  constructor() {
    super('farm-scene')
  }

  preload() {
    this.load.spritesheet('world', '/assets/world/farm-slice.png', {
      frameWidth: 16,
      frameHeight: 16,
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
  }
}
