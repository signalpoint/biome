const animate = true
if (!animate) { console.log('game animation disabled') }

// The canvas element.
var canvas = null

// The canvas context.
var c = null

// KEYS

const keys = {
  up: {
    pressed: false
  },
  down: {
    pressed: false
  },
  left: {
    pressed: false
  },
  right: {
    pressed: false
  }
}

let mouseDown = false

// 1024x768
const blockWidth = 64
const blockHeight = 64
const blocksPerChunkRow = 16
const blocksPerChunkCol = 12
const blocksPerChunk = blocksPerChunkRow * blocksPerChunkCol

// TODO what about 720p and friends?

let elevation = 1
let maxElevation = 3

let pieces = {

  bigIsland: [
    'w','w','w','w','w','w','w','w','w','w','w','w','w','w','w','w',
    'w','s','s','s','s','s','s','s','s','s','s','s','s','s','s','w',
    'w','s','s','s','s','s','s','s','s','s','s','s','s','s','s','w',
    'w','s','s','s','s','s','s','s','s','s','s','s','s','s','s','w',
    'w','s','s','s','s','s','s','s','s','s','s','s','s','s','s','w',
    'w','s','s','s','s','s','s','s','s','s','s','s','s','s','s','w',
    'w','s','s','s','s','s','s','s','s','s','s','s','s','s','s','w',
    'w','s','s','s','s','s','s','s','s','s','s','s','s','s','s','w',
    'w','s','s','s','s','s','s','s','s','s','s','s','s','s','s','w',
    'w','s','s','s','s','s','s','s','s','s','s','s','s','s','s','w',
    'w','s','s','s','s','s','s','s','s','s','s','s','s','s','s','w',
    'w','w','w','w','w','w','w','w','w','w','w','w','w','w','w','w'
  ],

  mediumIsland: [
    'w','w','w','w','w','w','w','w','w','w','w','w','w','w','w','w',
    'w','w','w','w','w','w','w','w','w','w','w','w','w','w','w','w',
    'w','w','s','s','s','s','s','s','s','s','s','s','s','s','w','w',
    'w','w','s','s','s','s','s','s','s','s','s','s','s','s','w','w',
    'w','w','s','s','s','s','s','s','s','s','s','s','s','s','w','w',
    'w','w','s','s','s','s','s','s','s','s','s','s','s','s','w','w',
    'w','w','s','s','s','s','s','s','s','s','s','s','s','s','w','w',
    'w','w','s','s','s','s','s','s','s','s','s','s','s','s','w','w',
    'w','w','s','s','s','s','s','s','s','s','s','s','s','s','w','w',
    'w','w','s','s','s','s','s','s','s','s','s','s','s','s','w','w',
    'w','w','w','w','w','w','w','w','w','w','w','w','w','w','w','w',
    'w','w','w','w','w','w','w','w','w','w','w','w','w','w','w','w'
  ],

  smallIsland: [
    'w','w','w','w','w','w','w','w','w','w','w','w','w','w','w','w',
    'w','w','w','w','w','w','w','w','w','w','w','w','w','w','w','w',
    'w','w','w','w','w','w','w','w','w','w','w','w','w','w','w','w',
    'w','w','w','s','s','s','s','s','s','s','s','s','s','w','w','w',
    'w','w','w','s','g','g','g','g','g','g','g','g','s','w','w','w',
    'w','w','w','s','g','g','g','g','g','g','g','g','s','w','w','w',
    'w','w','w','s','g','g','g','g','g','g','g','g','s','w','w','w',
    'w','w','w','s','g','g','g','g','g','g','g','g','s','w','w','w',
    'w','w','w','s','s','s','s','s','s','s','s','s','s','w','w','w',
    'w','w','w','w','w','w','w','w','w','w','w','w','w','w','w','w',
    'w','w','w','w','w','w','w','w','w','w','w','w','w','w','w','w',
    'w','w','w','w','w','w','w','w','w','w','w','w','w','w','w','w'
  ],

  smallIslands: [
    'w','w','w','w','w','w','w','w','w','w','w','w','w','w','w','w',
    'w','s','s','s','s','s','w','w','w','w','w','w','w','w','w','w',
    'w','s','g','g','g','s','w','s','s','s','s','s','s','s','w','w',
    'w','s','g','g','g','s','w','s','g','g','g','g','g','s','w','w',
    'w','s','s','s','s','s','w','s','g','g','g','g','g','s','w','w',
    'w','w','w','w','w','w','w','s','g','g','g','g','g','s','w','w',
    'w','w','w','w','w','w','w','s','s','s','s','s','s','s','w','w',
    'w','w','w','w','w','w','w','w','w','w','w','w','w','w','w','w',
    'w','w','w','w','w','w','w','w','w','w','w','w','w','w','w','w',
    'w','w','w','w','w','w','w','w','w','w','w','w','w','w','w','w',
    'w','w','w','w','w','w','w','w','w','w','w','w','w','w','w','w',
    'w','w','w','w','w','w','w','w','w','w','w','w','w','w','w','w'
  ],

  openWater: [
    'w','w','w','w','w','w','w','w','w','w','w','w','w','w','w','w',
    'w','w','w','w','w','w','w','w','w','w','w','w','w','w','w','w',
    'w','w','w','w','w','w','w','w','w','w','w','w','w','w','w','w',
    'w','w','w','w','w','w','w','w','w','w','w','w','w','w','w','w',
    'w','w','w','w','w','w','w','w','w','w','w','w','w','w','w','w',
    'w','w','w','w','w','w','w','w','w','w','w','w','w','w','w','w',
    'w','w','w','w','w','w','w','w','w','w','w','w','w','w','w','w',
    'w','w','w','w','w','w','w','w','w','w','w','w','w','w','w','w',
    'w','w','w','w','w','w','w','w','w','w','w','w','w','w','w','w',
    'w','w','w','w','w','w','w','w','w','w','w','w','w','w','w','w',
    'w','w','w','w','w','w','w','w','w','w','w','w','w','w','w','w',
    'w','w','w','w','w','w','w','w','w','w','w','w','w','w','w','w'
  ]

}

let colorMap = {
  o: '#22577a', // ocean
  w: '#90e0ef', // water
  g: '#25a244', // grass
  s: '#ffe6a7' // sand
}

let waterColors = [
//  '#caf0f8',
  '#ade8f4',
  '#90e0ef'
];
function getRandomWaterColor() {
  return waterColors[Math.floor(Math.random() * waterColors.length)]
}

class Block {

  constructor({
    delta,
    row,
    col,
    slice,
    key,
    fillStyle = '#000'
  }) {

    this._delta = delta
    this._row = row
    this._col = col
    this._slice = slice
    this._key = key
    this._fillStyle = fillStyle

    this._hover = false

  }

  getDelta() { return this._delta }
  getRow() { return this._row }
  getCol() { return this._col }
  getSlice() { return this._slice }
  getKey() { return this._key }

  getHover() { return this._hover }
  setHover(hover) { this._hover = hover }

  setFillStyle(fillStyle) { this._fillStyle = fillStyle }
  getFillStyle() { return this._fillStyle }

  draw(x, y, width, height) {

    switch (this.getKey()) {

      // water
      case 'w':
        c.fillStyle = game.getTime() % (game.getFps() * 4) === 0 ?
          getRandomWaterColor() :
          this.getFillStyle()
        this.setFillStyle(c.fillStyle)
        break;

      default:
        c.fillStyle = this.getFillStyle()
//        c.fillStyle = colorMap[this.getKey()]
        break;

    }

    if (this.getHover()) {
      c.fillStyle = '#ccc'
    }

    c.fillRect(x, y, width, height)

  }

}

class Game {

  constructor() {

    this._animationFrame = null

    this._universe = null
    this._time = 0
    this._fps = 32
    this._blocks = [];
    this._elevation = 1
    this._x = 0 // the pane x coordinate
    this._y = 0 // the pane y coordinate
    this._mouseX = 0
    this._mouseY = 0
    this._mouseLeftClickX = 0
    this._mouseLeftClickY = 0

    this._hoverBlockDelta = null

  }

  setUniverse(universe) { this._universe = universe }
  getUniverse() { return this._universe }
  getUniverseColCount() { return game.getUniverse()[0].length }
  getUniverseRowCount() { return game.getUniverse().length  }
  initUniverse() {


    let delta = 0
    let row = 0
    let col = 0
    let slice = 0
    let key = null
    let fillStyle = null

    let block = null

    // debug
    let deltaStart = 0
    let deltaEnd = 0

    for (row = 0; row < this._universe.length; row++) {
      for (col = 0; col < this._universe[row].length; col++) {

        deltaStart = delta // debug

        for (slice = 0; slice < this._universe[row][col].length; slice++) {
          key = this._universe[row][col][slice]
          this._blocks[delta] = new Block({
            delta,
            row,
            col,
            slice,
            key,
            fillStyle: key == 'w' ? getRandomWaterColor() : colorMap[key]
          })
          delta++
        }

        // debug
        deltaEnd = delta
        console.log('(' + col + ',' + row + ')', deltaStart, deltaEnd - 1)

      }
      console.log('----')
    }

  }
  init() {

    let self = this

    player = new Player({
      name: 'Tyler',
      x: 576 + 8,
      y: 256 + 4
    })

    players.push(player)

    if (animate) {

      self._animationFrame = requestAnimationFrame(drawUniverse)
      setTimeout(function() {
        console.log('cancel animation')
        cancelAnimationFrame(self._animationFrame)
        self._animationFrame = null
      }, 25000)

    }
    else {

      drawUniverse()

    }

  }

  // abstract - game must implement
  update() { }

  setTime(time) { this._time = time }
  getTime() { return this._time }
  increaseTime() { this._time++ }

  setFps(fps) { this._fps = fps }
  getFps() { return this._fps }

  getBlock(delta) { return this._blocks[delta] }

  blockKey(row, col, chunk, block) {
    return '' + row + col + chunk + block
  }

  setElevation(elevation) { this._elevation = elevation }
  getElevation() { return this._elevation }

  increaseElevation() { this._elevation++ }
  decreaseElevation() { this._elevation-- }

  // panes

  getRowCount() { return this.getUniverse().length }
  getColCount() { return this.getUniverse()[0].length }

  // pane coordinates

  setCoords(x, y) {
    this._x = x
    this._y = y
  }
  getCoords() {
    return {
      x: this._x,
      y: this._y
    }
  }

  setX(x) { this._x = x }
  getX() { return this._x }
  setY(y) { this._y = y }
  getY() { return this._y }

  // mouse coordinates

  setMouseCoords(x, y) {
    this._mouseX = x
    this._mouseY = y
  }
  getMouseCoords() {
    return {
      x: this._mouseX,
      y: this._mouseY
    }
  }

  setMouseX(x) { this._mouseX = x }
  getMouseX() { return this._mouseX }
  setMouseY(y) { this._mouseY = y }
  getMouseY() { return this._mouseY }

  // mouse left click coordinates

  setMouseLeftClickCoords(x, y) {
    this._mouseLeftClickX = x
    this._mouseLeftClickY = y
  }
  getMouseLeftClickCoords() {
    return {
      x: this._mouseLeftClickX,
      y: this._mouseLeftClickY
    }
  }

  setMouseLeftClickX(x) { this._mouseLeftClickX = x }
  getMouseLeftClickX() { return this._mouseLeftClickX }
  setMouseLeftClickY(y) { this._mouseLeftClickY = y }
  getMouseLeftClickY() { return this._mouseLeftClickY }

  // sliding

  canSlideUp() { return !!this.getY() }
  canSlideDown() { return this.getY() < this.getRowCount() - 1 }
  canSlideLeft() { return !!this.getX() }
  canSlideRight() { return this.getX() < this.getColCount() - 1 }

  slideUp() {
    this.setY(this.getY() - 1)
  }
  slideDown() {
    this.setY(this.getY() + 1)
  }
  slideLeft() {
    this.setX(this.getX() - 1)
  }
  slideRight() {
    this.setX(this.getX() + 1)
  }

  // chunks

  getCurrentChunk() {
    return this.getChunk(this.getX(), this.getY());
  }

  getChunk(x, y) {
    return this.getUniverse()[y][x]
  }

  // blocks

  getZ() {
    let z = 2;
    for (var i = 1; i < this.getElevation(); i++) {
      z = z ** 2;
    }
    return z
  }
  getSqrt() {
    return this.getElevation() === 1 ? 1 : Math.sqrt(this.getZ())
  }

  getRowWithinChunk(y) {
    // the "row" within the linear chunk array
    return Math.floor(y / game.getBlockHeightAtCurrentElevation())
  }
  getColWithinChunk(x) {
    // the "col" within the linear chunk array
    return Math.floor(x / game.getBlockWidthAtCurrentElevation())
  }
  getIndexWithinChunk() {}

  getBlockCoordsWithinChunk(x, y) {
    return {
      x: this.getColWithinChunk(x),
      y: this.getRowWithinChunk(y)
    }
  }

  getBlockFromCoords(x, y) {
    let rowWithinChunk = this.getRowWithinChunk(y)
    let colWithinChunk = this.getColWithinChunk(x)
    let chunkIndex = rowWithinChunk < 1 ?
      colWithinChunk :
      rowWithinChunk * blocksPerChunkRow + colWithinChunk
//    console.log(colWithinChunk, rowWithinChunk, ':', chunkIndex, this.getCurrentChunk()[chunkIndex])
    return this.getCurrentChunk()[chunkIndex]
  }

  getBlockDelta(x, y) {
    let coords = game.getBlockCoordsWithinChunk(x, y)
    return coords.y * blocksPerChunkRow + coords.x
  }

  getBlockWidthAtCurrentElevation() {
    return blockWidth / this.getSqrt()
  }

  getBlockHeightAtCurrentElevation() {
    return blockHeight / this.getSqrt()
  }

  getHoverBlockDelta() { return this._hoverBlockDelta }
  setHoverBlockDelta(delta) { this._hoverBlockDelta = delta }

  addHoverToBlock(x, y) {
    let blockDelta = this.getBlockDelta(x, y)
    let hoverBlockDelta = this.getHoverBlockDelta()
    if (blockDelta != hoverBlockDelta) {
      if (hoverBlockDelta) {
        this._blocks[hoverBlockDelta].setHover(false)
      }
      this.setHoverBlockDelta(blockDelta)
    }
    this._blocks[blockDelta].setHover(true)
  }

}

class Player {

  constructor({
    name,
    x,
    y
  }) {

    this._name = name

    this._x = x
    this._y = y

    this._width = 24
    this._height = 48

    this._velocityX = 0
    this._velocityY = 0

    this._maxVelocityX = 10
    this._maxVelocityY = 10

  }

  getName() { return this._name }
  setName(name) { this._name = name }

  getX() { return this._x }
  setX(x) { this._x = x }
  getY() { return this._y }
  setY(y) { this._y = y }

  getWidth() { return this._width }
  setWidth(width) { this._width = width }
  getHeight() { return this._height }
  setHeight(height) { this._height = height }

  getVelocity() {
    return {
      x: this._velocityX,
      y: this._velocityY
    }
  }

  getVelocityX() { return this._velocityX }
  setVelocityX(x) { this._velocityX = x }
  getVelocityY() { return this._velocityY }
  setVelocityY(y) { this._velocityY = y }

  getMaxVelocityX() { return this._maxVelocityX }
  setMaxVelocityX(x) { this._maxVelocityX = x }
  getMaxVelocityY() { return this._maxVelocityY }
  setMaxVelocityY(y) { this._maxVelocityY = y }

  increaseVelocityX(x) { this.setVelocityX(this.getVelocityX() + x) }
  decreaseVelocityX(x) { this.setVelocityX(this.getVelocityX() - x) }
  increaseVelocityY(y) { this.setVelocityY(this.getVelocityY() + y) }
  decreaseVelocityY(y) { this.setVelocityY(this.getVelocityY() - y) }

  update() {

//    console.log('player velocity: ' + this.getVelocityX() + ', ' + this.getVelocityY())

    if (this.getVelocityX() !== 0) {
//      console.log('x', this.getX(), 'vX', this.getVelocityX())
      this.setX(this.getX() + this.getVelocityX())
    }

    if (this.getVelocityY() !== 0) {
//      console.log('y', this.getY(), 'vY', this.getVelocityY())
      this.setY(this.getY() + this.getVelocityY())
    }

  }

  draw() {
    c.fillStyle = '#000'
    c.fillRect(
      this.getX(),
      this.getY(),
      this.getWidth() / game.getSqrt(),
      this.getHeight() / game.getSqrt()
    )
  }

}

let player = null
let players = []

const game = new Game();

game.setUniverse([

  [ pieces.smallIslands, pieces.smallIsland, pieces.smallIsland, pieces.smallIslands ],
  [ pieces.mediumIsland, pieces.bigIsland, pieces.bigIsland, pieces.mediumIsland ],
  [ pieces.openWater, pieces.mediumIsland, pieces.mediumIsland, pieces.openWater ],
  [ pieces.smallIslands, pieces.smallIsland, pieces.smallIsland, pieces.smallIslands ]

]);

// LOAD

addEventListener('load', function() {

  // Get canvas element.
  canvas = document.getElementById("biome-bloom")

  // 1024x768
  canvas.width = 1024
  canvas.height = 768

  // Get canvas context.
  c = canvas.getContext("2d")

  // CANVAS MOUSE - event listeners
  canvas.addEventListener('mousedown', canvasMouseDown)
  canvas.addEventListener("mouseup", canvasMouseUp);
  canvas.addEventListener('wheel', canvasWheel, false);
  canvas.addEventListener("mouseover", canvasMouseOver);
  canvas.addEventListener("mouseout", canvasMouseOut);
  canvas.addEventListener("mousemove", canvasMouseMouse);

  game.initUniverse()

  game.init()

});

// UPDATE

game.update = function() {

  let sqrt = game.getSqrt()

  // key press velocity changes for player

  if (keys.up.pressed && Math.abs(player.getVelocityY()) < player.getMaxVelocityY() / sqrt) {
    player.decreaseVelocityY(1 / sqrt)
  }
  else if (player.getVelocityY() < 0) {
    player.increaseVelocityY(1 / sqrt)
  }

  if (keys.down.pressed && Math.abs(player.getVelocityY()) < player.getMaxVelocityY() / sqrt) {
    player.increaseVelocityY(1 / sqrt)
  }
  else if (player.getVelocityY() > 0) {
    player.decreaseVelocityY(1 / sqrt)
  }

  if (keys.left.pressed && Math.abs(player.getVelocityX()) < player.getMaxVelocityX() / sqrt) {
    player.decreaseVelocityX(1 / sqrt)
  }
  else if (player.getVelocityX() < 0) {
    player.increaseVelocityX(1 / sqrt)
  }

  if (keys.right.pressed && Math.abs(player.getVelocityX()) < player.getMaxVelocityX() / sqrt) {
    player.increaseVelocityX(1 / sqrt)
  }
  else if (player.getVelocityX() > 0) {
    player.decreaseVelocityX(1 / sqrt)
  }

  // player updates

  for (let p = 0; p < players.length; p++) {
    players[p].update()
  }

  game.increaseTime()

};

// CLEAR

function clearUniverse() {
  c.clearRect(0, 0, canvas.width, canvas.height);
}

// DRAW

function drawUniverse() {

  game.update()

  clearUniverse()

  // CHUNKS / BLOCKS

  let elevation = game.getElevation()
  let x = 0
  let y = 0
  let deltaStart = null
  let deltaEnd = null

  if (elevation === 1) {

    // 1 chunk to render...

    deltaStart = game.getX() * game.getY()
    deltaEnd = deltaStart + blocksPerChunk;

//    console.log(deltaStart, deltaEnd)

    for (let delta = deltaStart; delta < deltaEnd; delta++) {
      game.getBlock(delta).draw(x, y, blockWidth, blockHeight)
      x += blockWidth
      if (x >= canvas.width) {
        x = 0
        y += blockHeight
      }
    }

  }
  else {

    // multiple chunks to render...

    let z = game.getZ()
    let sqrt = game.getSqrt()
    let pos = game.getCoords()

    let delta = null
    let modX = 0
    let modY = 0
    let deltaX = 0
    let deltaY = 0
    let deltaRow = 0
    let deltaCol = 0
    let deltaWidth = game.getBlockWidthAtCurrentElevation()
    let deltaHeight = game.getBlockHeightAtCurrentElevation()
    let breakX = 0
    let breakY = 0

    for (var row = pos.x; row < pos.x + sqrt; row++) {

      deltaCol = 0

      for (var col = pos.y; col < pos.y + sqrt; col++) {

        // a pane/chunk...

        // determine delta range for blocks...
        if (deltaRow == 0) {
          deltaStart = col * blocksPerChunk
        }
        else {
          deltaStart = row * blocksPerChunk * game.getUniverseColCount()
          if (deltaCol == 0) { }
          else {
            deltaStart += col * blocksPerChunk
          }
        }
        deltaEnd = deltaStart + blocksPerChunk - 1

//        console.log('-------------- CHUNK (' + deltaCol + ',' + deltaRow + '):', modX, modY, '|', deltaStart, deltaEnd)

        deltaX = 0

        // render each block in the chunk...
        for (let delta = deltaStart; delta <= deltaEnd; delta++) {

          x = modX
          y = modY

          game.getBlock(delta).draw(x, y, deltaWidth, deltaHeight)

          modX += deltaWidth

          if (deltaX && (deltaX + 1) % blocksPerChunkRow == 0) { // last block in chunk's row...
            modX = deltaWidth * blocksPerChunkRow * deltaCol
            modY += deltaHeight
          }

          if (delta == deltaEnd) { // last block in chunk...
            modY = deltaHeight * blocksPerChunkCol * deltaRow // reset modY for the game row
          }

          deltaX++

        }
        // done rendering each block in the chunk

        // move to the next pane...

        breakX = deltaWidth * blocksPerChunkRow

        modX = breakX

        if (deltaRow === 0) { // the first game row
          modY = 0
        }
        else {

          if (deltaRow === sqrt - 1) { // the last game row...

          }
          else { // an "inside" row...

          }

        }

        if (deltaCol === 0) { // the first game column...

        }
        else {

          if (deltaCol === sqrt - 1) { // the last game column...

            modX = 0
            modY = deltaHeight * blocksPerChunkCol * (deltaRow + 1)

          }
          else { // an "inside" column...

            modX = breakX * (deltaCol + 1)

          }

        }

        deltaCol++

      }

      deltaRow++

    }

//    console.log('--=--=--=--=--=--=--')

  }

  // PLAYER
  for (let p = 0; p < players.length; p++) {
    players[p].draw()
  }

  // GRID

//  drawGrid()

  if (game._animationFrame) { requestAnimationFrame(drawUniverse) }

}

// KEY DOWN

addEventListener('keydown', ({ keyCode } ) => {

//    console.log(keyCode);

//  if (game.userInputIsDisabled()) return

  switch (keyCode) {

    // UP
    case 87: // (W)
    case 38: // (up arrow)

//      if (!keys.up.pressed && game.canSlideUp()) {
//        game.slideUp()
//      }

      keys.up.pressed = true

      break

    // DOWN
    case 83: // (S)
    case 40: // (down arrow)

//      if (!keys.down.pressed && game.canSlideDown()) {
//        game.slideDown()
//      }

      keys.down.pressed = true

      break

    // LEFT
    case 65: // (A)
    case 37: // (left arrow)

//      if (!keys.left.pressed && game.canSlideLeft()) {
//        game.slideLeft()
//      }

      keys.left.pressed = true

      break

    // RIGHT
    case 68: // (D)
    case 39: // (right arrow)

//      if (!keys.right.pressed && game.canSlideRight()) {
//        game.slideRight()
//      }

      keys.right.pressed = true

      break

  }

});

// KEY UP

addEventListener('keyup', ({ keyCode }) => {

//  if (game.userInputIsDisabled()) return

  switch (keyCode) {

    // UP
    case 87: // (W)
    case 38: // (up arrow)

      keys.up.pressed = false

      break

    // DOWN
    case 83: // (S)
    case 40: // (down arrow)

      keys.down.pressed = false

      break

    // LEFT
    case 65: // (A)
    case 37: // (left arrow)

      keys.left.pressed = false

      break

    // RIGHT
    case 68: // (D)
    case 39: // (right arrow)

      keys.right.pressed = false

      break

  }

});

// CANVAS MOUSE - event listeners

// mouse down

function canvasMouseDown(e) {

  mouseDown = true;

  let coords = getCanvasMouseCoords(e)
  game.setMouseLeftClickCoords(coords.x, coords.y)

  console.log(coords.x + ", " + coords.y)

  updateSideBarMouseLeftClickCoords()

}

// mouse up

function canvasMouseUp(e) {
  mouseDown = false;
}

// mouse wheel

function canvasWheel(e) {

//    console.log(e);

  // ZOOM OUT
  if (e.deltaY > 0) {

    if (game.getElevation() < maxElevation) {

      // Increase the elevation.
      game.increaseElevation()

      // Scale in the player's position.
      player.setX(player.getX() / 2)
      player.setY(player.getY() / 2)

    }
  }

  // ZOOM IN
  else {

    if (game.getElevation() !== 1) {

      // Decrease the elevation.
      game.decreaseElevation()

      // Scale out the player's position.
      player.setX(player.getX() * 2)
      player.setY(player.getY() * 2)
    }
  }

  return false;

}

// mouse over

function canvasMouseOver(e) { }

// mouse out

function canvasMouseOut(e) { }

// mouse move

function canvasMouseMouse(e) {

//    var rect = canvas.getBoundingClientRect();
//    game.setMouseCoords(evt.clientX - rect.left, evt.clientY - rect.top)

  let coords = getCanvasMouseCoords(e)

  game.setMouseCoords(coords.x, coords.y)
  game.addHoverToBlock(coords.x, coords.y)
  updateSideBarMouseCoords()
  updateSideBarBlockPosition(coords.x, coords.y)
  updateSideBarBlockDelta(coords.x, coords.y)
  updateSideBarBlockCoords(coords.x, coords.y)

}

/**
 * HELPERS
 */

function getCanvasMouseCoords(evt) {
  const rect = canvas.getBoundingClientRect()
  const x = evt.clientX - rect.left
  const y = evt.clientY - rect.top
  return {
    x,
    y
  }
}

function updateSideBar() {
  updateSideBarElevation()
  updateSideBarPaneCoords()
  updateSideBarMouseCoords()
}

// elevation
function updateSideBarElevation() {
  document.querySelector('span[data-id="elevation"]').innerHTML = game.getElevation()
}

// pane coords
function updateSideBarPaneCoords() {
  let coords = game.getCoords()
  document.querySelector('span[data-id="pane"]').innerHTML = [coords.x, coords.y].join(', ')
}

// mouse coords
function updateSideBarMouseCoords() {
  let coords = game.getMouseCoords()
  document.querySelector('span[data-id="mouse"]').innerHTML = [coords.x, coords.y].join(', ')
}

// mouse left click coords
function updateSideBarMouseLeftClickCoords() {
  let coords = game.getMouseLeftClickCoords()
  document.querySelector('span[data-id="mouse-left-click"]').innerHTML = [coords.x, coords.y].join(', ')
}

function updateSideBarBlockPosition(x, y) {
  let coords = game.getBlockCoordsWithinChunk(x, y)
  document.querySelector('span[data-id="block-position"]').innerHTML = [coords.x, coords.y].join(', ')
}

function updateSideBarBlockDelta(x, y) {
  document.querySelector('span[data-id="block-delta"]').innerHTML = game.getBlockDelta(x, y)
}

function updateSideBarBlockCoords(x, y) {
  let coords = game.getBlockCoordsWithinChunk(x, y)
  document.querySelector('span[data-id="block-coordinates"]').innerHTML = [
    coords.x * game.getBlockWidthAtCurrentElevation(),
    coords.y * game.getBlockWidthAtCurrentElevation()
  ].join(', ')
}

var gridWidth = 64;
var gridHeight = 64;

function drawGrid() {
  gridWidth = game.getBlockWidthAtCurrentElevation()
  gridHeight = game.getBlockHeightAtCurrentElevation()
  var y = 0;
  for (var y = 0; y < canvas.height; y+= gridHeight) {
    for (var x = 0; x <= canvas.width; x += gridWidth) {
      c.beginPath();
      c.rect(x, y, gridWidth, gridHeight);
      c.stroke();
    }
  }
}
