const TILE_COLUMNS = 27

export const TILE_SIZE = 16
export const WORLD_COLUMNS = 48
export const WORLD_ROWS = 30

const tile = (column: number, row: number) => row * TILE_COLUMNS + column

const TILES = {
  grassA: tile(0, 0),
  grassB: tile(2, 0),
  grassC: tile(4, 0),
  path: tile(15, 1),
  water: tile(8, 11),
  rock: tile(0, 26),
  mailbox: tile(2, 29),
  cropA: tile(0, 28),
  cropB: tile(1, 28),
  fenceLeft: tile(7, 30),
  fenceMid: tile(8, 30),
  fenceRight: tile(9, 30),
}

const HOUSE_TILES = [
  [tile(4, 27), tile(5, 27), tile(6, 27), tile(7, 27), tile(8, 27), tile(9, 27)],
  [tile(4, 28), tile(5, 28), tile(6, 28), tile(7, 28), tile(8, 28), tile(9, 28)],
  [tile(4, 29), tile(5, 29), tile(6, 29), tile(7, 29), tile(8, 29), tile(9, 29)],
  [tile(4, 30), tile(5, 30), tile(6, 30), tile(7, 30), tile(8, 30), tile(9, 30)],
]

const TREE_TILES = [
  [tile(0, 5), tile(1, 5)],
  [tile(0, 6), tile(1, 6)],
  [tile(0, 7), tile(1, 7)],
]

const HOUSE_FOOTPRINT_TILES = HOUSE_TILES.slice(2)

export interface WorldLayerSet {
  ground: number[][]
  decor: number[][]
  collision: number[][]
}

export interface HouseAnchor {
  tileX: number
  tileY: number
  width: number
  height: number
  doorTileX: number
  doorTileY: number
  mailboxTileX: number
  mailboxTileY: number
}

export interface WorldData {
  columns: number
  rows: number
  tileSize: number
  layers: WorldLayerSet
  focusTileX: number
  focusTileY: number
  house: HouseAnchor
}

const createLayer = (fill: number) =>
  Array.from({ length: WORLD_ROWS }, () => Array.from({ length: WORLD_COLUMNS }, () => fill))

const createEmptyLayer = () => createLayer(-1)

function setTile(layer: number[][], x: number, y: number, frame: number) {
  if (x < 0 || y < 0 || x >= WORLD_COLUMNS || y >= WORLD_ROWS) {
    return
  }

  layer[y][x] = frame
}

function fillRect(layer: number[][], x: number, y: number, width: number, height: number, frame: number) {
  for (let row = y; row < y + height; row += 1) {
    for (let column = x; column < x + width; column += 1) {
      setTile(layer, column, row, frame)
    }
  }
}

function stamp(layer: number[][], x: number, y: number, frames: number[][]) {
  frames.forEach((row, rowIndex) => {
    row.forEach((frame, columnIndex) => {
      setTile(layer, x + columnIndex, y + rowIndex, frame)
    })
  })
}

function createGroundLayer() {
  const ground = createLayer(TILES.grassA)

  for (let y = 0; y < WORLD_ROWS; y += 1) {
    for (let x = 0; x < WORLD_COLUMNS; x += 1) {
      const variant =
        (x + y) % 7 === 0 ? TILES.grassB : (x * 3 + y * 5) % 11 === 0 ? TILES.grassC : TILES.grassA
      ground[y][x] = variant
    }
  }

  fillRect(ground, 4, 9, 7, 5, TILES.water)
  fillRect(ground, 25, 14, 7, 5, TILES.path)
  fillRect(ground, 22, 11, 2, 10, TILES.path)
  fillRect(ground, 27, 12, 4, 3, TILES.path)

  return ground
}

function createDecorLayer() {
  const decor = createEmptyLayer()

  stamp(decor, 20, 8, HOUSE_TILES)
  setTile(decor, 18, 11, TILES.mailbox)

  for (let x = 26; x <= 31; x += 1) {
    setTile(decor, x, 13, TILES.fenceMid)
    setTile(decor, x, 18, TILES.fenceMid)
  }

  for (let y = 14; y <= 17; y += 1) {
    setTile(decor, 25, y, TILES.fenceLeft)
    setTile(decor, 32, y, TILES.fenceRight)
  }

  setTile(decor, 30, 12, TILES.cropA)
  setTile(decor, 31, 12, TILES.cropB)
  setTile(decor, 29, 13, TILES.cropB)
  setTile(decor, 28, 14, TILES.cropA)

  return decor
}

function createCollisionLayer() {
  const collision = createEmptyLayer()

  fillRect(collision, 4, 9, 7, 5, TILES.water)
  stamp(collision, 20, 10, HOUSE_FOOTPRINT_TILES)
  stamp(collision, 2, 3, TREE_TILES)
  stamp(collision, 7, 4, TREE_TILES)
  stamp(collision, 38, 4, TREE_TILES)
  stamp(collision, 42, 7, TREE_TILES)

  setTile(collision, 13, 11, TILES.rock)
  setTile(collision, 14, 12, TILES.rock)
  setTile(collision, 35, 16, TILES.rock)
  setTile(collision, 36, 15, TILES.rock)
  setTile(collision, 24, 19, TILES.rock)

  return collision
}

export function createWorldData(): WorldData {
  return {
    columns: WORLD_COLUMNS,
    rows: WORLD_ROWS,
    tileSize: TILE_SIZE,
    layers: {
      ground: createGroundLayer(),
      decor: createDecorLayer(),
      collision: createCollisionLayer(),
    },
    focusTileX: 24,
    focusTileY: 14,
    house: {
      tileX: 20,
      tileY: 8,
      width: HOUSE_TILES[0].length,
      height: HOUSE_TILES.length,
      doorTileX: 23,
      doorTileY: 12,
      mailboxTileX: 18,
      mailboxTileY: 11,
    },
  }
}
