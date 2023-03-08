const animate = false

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

var colorMap = {
  o: '#22577a', // ocean
  w: '#90e0ef', // water
  g: '#25a244', // grass
  s: '#ffe6a7' // sand
}
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
    'w','s','s','s','s','w','w','w','w','w','w','w','w','w','w','w',
    'w','s','g','g','s','w','s','s','s','s','s','s','w','w','w','w',
    'w','s','s','s','s','w','s','g','g','g','g','s','w','w','w','w',
    'w','w','w','w','w','w','s','g','g','g','g','s','w','w','w','w',
    'w','w','w','w','w','w','s','s','s','s','s','s','w','w','w','w',
    'w','w','w','w','w','w','w','w','w','w','w','w','w','w','w','w',
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

class Block {

  constructor({
    delta,
    row,
    col,
    slice,
    key
  }) {

    this._delta = delta
    this._row = row
    this._col = col
    this._slice = slice
    this._key = key

    this._hover = false

  }

  getDelta() { return this._delta }
  getRow() { return this._row }
  getCol() { return this._col }
  getSlice() { return this._slice }
  getKey() { return this._key }

  getHover() { return this._hover }
  setHover(hover) { this._hover = hover }

  draw(x, y, width, height) {
    c.fillStyle = this.getHover() ? '#ccc' : colorMap[this.getKey()]
    c.fillRect(x, y, width, height)
  }

}

class Game {

  constructor() {

    this._animationFrame = null

    this._universe = null
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

  refresh() {
    drawUniverse()
  }

  setUniverse(universe) { this._universe = universe }
  getUniverse() { return this._universe }
  getUniverseColCount() { return game.getUniverse()[0].length }
  getUniverseRowCount() { return game.getUniverse().length  }
  initUniverse() {

    let row = 0
    let col = 0
    let chunk = 0
    let slice = 0
    let delta = 0

    // debug
    let deltaStart = 0
    let deltaEnd = 0

    for (row = 0; row < this._universe.length; row++) {
      for (col = 0; col < this._universe[row].length; col++) {

        deltaStart = delta // debug

        for (slice = 0; slice < this._universe[row][col].length; slice++) {
          this._blocks[delta] = new Block({
            delta,
            row,
            col,
            slice,
            key: this._universe[row][col][slice]
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

    if (animate) {

      self._animationFrame = requestAnimationFrame(drawUniverse)
      setTimeout(function() {
        console.log('cancel animation')
        cancelAnimationFrame(self._animationFrame)
        self._animationFrame = null
      }, 15000)

    }
    else {

      drawUniverse()

    }

  }

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
    this.refresh()
  }
  slideDown() {
    this.setY(this.getY() + 1)
    this.refresh()
  }
  slideLeft() {
    this.setX(this.getX() - 1)
    this.refresh()
  }
  slideRight() {
    this.setX(this.getX() + 1)
    this.refresh()
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

const game = new Game();

game.setUniverse([

  [ pieces.smallIslands, pieces.smallIsland, pieces.smallIsland, pieces.smallIslands ],
  [ pieces.mediumIsland, pieces.bigIsland, pieces.bigIsland, pieces.mediumIsland ],
  [ pieces.openWater, pieces.mediumIsland, pieces.mediumIsland, pieces.openWater ],
  [ pieces.smallIslands, pieces.smallIsland, pieces.smallIsland, pieces.smallIslands ]

]);

addEventListener('load', function() {

  // Get canvas element.
  canvas = document.getElementById("biome-bloom")

  // 1024x768
  canvas.width = 1024
  canvas.height = 768

  // Get canvas context.
  c = canvas.getContext("2d")

  // MOUSE

  // down (click)

  canvas.addEventListener('mousedown', function(e) {

//    console.log('mousedown');
    mouseDown = true;

    let coords = getCanvasMouseCoords(e)
    game.setMouseLeftClickCoords(coords.x, coords.y)

    console.log(coords.x + ", " + coords.y)

    updateSideBarMouseLeftClickCoords()

  })

  // up (release)

  canvas.addEventListener("mouseup", function(evt) {
//    console.log('mouseup');
    mouseDown = false;
  });

  // wheel

  canvas.addEventListener('wheel', function(e) {

//    console.log(e);

    // ZOOM OUT
    if (e.deltaY > 0) {

//      console.log('----- zooming out ----------');

      if (game.getElevation() < maxElevation) {
        game.increaseElevation()
        drawUniverse();
      }

//      console.log('----- zoomed out ----------');

    }

    // ZOOM IN
    else {

//      console.log('----- zooming in ----------');

      if (game.getElevation() !== 1) {
        game.decreaseElevation()
        drawUniverse();
      }

//      console.log('----- zoomed in ----------');

    }
    return false;
  }, false);

  // over

  canvas.addEventListener("mouseover", function(evt) {
//    console.log('mouseover');
  });

  // out

  canvas.addEventListener("mouseout", function(evt) {
//    console.log('mouseout');
  });

  // move

  canvas.addEventListener("mousemove", function(e) {

//    var rect = canvas.getBoundingClientRect();
//    game.setMouseCoords(evt.clientX - rect.left, evt.clientY - rect.top)

    let coords = getCanvasMouseCoords(e)

    game.setMouseCoords(coords.x, coords.y)
    game.addHoverToBlock(coords.x, coords.y)
    updateSideBarMouseCoords()
    updateSideBarBlockCoords(coords.x, coords.y)
    updateSideBarBlockDelta(coords.x, coords.y)

  });

  game.initUniverse()

  game.init()

//  drawUniverse()

//  drawMap()

//  drawGrid()

});

// KEY DOWN

addEventListener('keydown', ({ keyCode } ) => {

//    console.log(keyCode);

//  if (game.userInputIsDisabled()) return

  switch (keyCode) {

    // UP
    case 87: // (W)
    case 38: // (up arrow)

      if (!keys.up.pressed && game.canSlideUp()) {
        game.slideUp()
      }

      keys.up.pressed = true

      break

    // DOWN
    case 83: // (S)
    case 40: // (down arrow)

      if (!keys.down.pressed && game.canSlideDown()) {
        game.slideDown()
      }

      keys.down.pressed = true

      break

    // LEFT
    case 65: // (A)
    case 37: // (left arrow)

      if (!keys.left.pressed && game.canSlideLeft()) {
        game.slideLeft()
      }

      keys.left.pressed = true

      break

    // RIGHT
    case 68: // (D)
    case 39: // (right arrow)

      if (!keys.right.pressed && game.canSlideRight()) {
        game.slideRight()
      }

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

function getCanvasMouseCoords(evt) {
  const rect = canvas.getBoundingClientRect()
  const x = evt.clientX - rect.left
  const y = evt.clientY - rect.top
  return {
    x,
    y
  }
}

function clearUniverse() {
  c.clearRect(0, 0, canvas.width, canvas.height);
}

function drawUniverse() {

  clearUniverse()
//  updateSideBar()

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
          if (deltaCol == 0) {
          }
          else {
            deltaStart += col * blocksPerChunk
          }
        }
        deltaEnd = deltaStart + blocksPerChunk - 1

          console.log('-------------- CHUNK (' + deltaCol + ',' + deltaRow + '):', modX, modY, '|', deltaStart, deltaEnd)

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

    console.log('--=--=--=--=--=--=--')

  }


  if (game._animationFrame) { requestAnimationFrame(drawUniverse) }

  return

//  clearUniverse()
//  updateSideBar()
//
//  let elevation = game.getElevation()
//  let sqrt = game.getSqrt()
//  let x = 0
//  let y = 0
//
//  if (elevation === 1) {
//
//    var chunk = game.getCurrentChunk();
//    for (var i = 0; i < chunk.length; i++) {
//      var block = chunk[i]
//      c.fillStyle = colorMap[block];
//      c.fillRect(x, y, blockWidth, blockHeight);
//      x += blockWidth
//      if (x >= canvas.width) {
//        x = 0
//        y += blockHeight
//      }
//    }
//
//  }
//  else {
//
//    console.log('sqrt', sqrt);
//
//    let pos = game.getCoords()
//    let colCount = game.getColCount()
//    let mod = colCount % sqrt
//    let modX = 0
//    let modY = 0
//    let deltaRow = 0
//    let deltaCol = 0
//    let breakX = null
//    let deltaX = 0 // counts block columns across a chunk's rows
//    let deltaWidth = game.getBlockWidthAtCurrentElevation()
//    let deltaHeight = game.getBlockHeightAtCurrentElevation()
//    let chunk = null
//
//    for (var row = pos.x; row < pos.x + sqrt; row++) {
//
//      deltaX = 0
//
//      for (var col = pos.y; col < pos.y + sqrt; col++) {
//
//        breakX = canvas.width / sqrt * (deltaX + 1)
//
//        x = modX
//        y = modY
//
//        console.log('DRAW', row, col, '|', x, y);
//
//        chunk = game.getChunk(col, row);
//
//        for (var i = 0; i < chunk.length; i++) {
//
//          // Draw the block on the canvas.
//          c.fillStyle = colorMap[chunk[i]];
//          c.fillRect(x, y, deltaWidth, deltaHeight);
//
//          // Move over to get ready to draw the next block.
//          x += deltaWidth
//
//          if (i && i % blocksPerChunkRow == blocksPerChunkRow - 1) { // reached end of chunk row
//
//            x = modX
//            y += deltaHeight
//
//          }
//
//        }
//
////        console.log('finished chunk');
//
//        if (deltaX === 0) { // the first game column...
//
//          modX = breakX
////          console.log('first game column', 'move x', modX);
//
//        }
//        else {
//
//          if (deltaX === sqrt - 1) { // the last game column...
//
//            modX = 0
//            modY = canvas.height / sqrt * (deltaRow + 1)
//
////            console.log('last game column', 'move y', modY);
//
//          }
//          else { // an "inside" column (non-perimeter)...
//
//            modX = breakX
//
//          }
//
//        }
//
//        deltaX++
//
//      } // col
//
////      console.log('======================================== ROW')
//
//      deltaRow++
//
//    } // row
//
//  }

}

function updateSideBar() {
  updateSideBarElevation()
  updateSideBarPaneCoords()
  updateSideBarMouseCoords()
//  updateSideBarMouseLeftClickCoords()
//  updateSideBarBlockCoords()
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

function updateSideBarBlockCoords(x, y) {
  let coords = game.getBlockCoordsWithinChunk(x, y)
  document.querySelector('span[data-id="block-coordinates"]').innerHTML = [coords.x, coords.y].join(', ')
}

function updateSideBarBlockDelta(x, y) {
  document.querySelector('span[data-id="block-delta"]').innerHTML = game.getBlockDelta(x, y)
}

function clearMap() {
  c.clearRect(0, 0, canvas.width, canvas.height);
}

function drawMap() {

  clearMap();

  console.log('ELEVATION', elevation);

  let x = 0
  let y = 0

  if (elevation === 1) {

    var chunk = map[0];
    for (var i = 0; i < chunk.length; i++) {
      var block = chunk[i]
      c.fillStyle = colorMap[block];
      c.fillRect(x, y, blockWidth, blockHeight);
      x += blockWidth
      if (x >= canvas.width) {
        x = 0
        y += blockHeight
      }
    }

  }
  else {

//    let z = Math.pow(2, elevation)
    let z = 2;
    for (var i = 1; i < elevation; i++) {
      z = z ** 2;
    }
    let sqrt = Math.sqrt(z)

    console.log('z', z);
    console.log('sqrt', sqrt);

    let modX = 0
    let modY = 0
    let row = 0
    let col = 0

    for (var pane = 0; pane < z; pane++) {

      x = modX
      y = modY

//      let mod = pane % elevation
      let mod = pane % sqrt

      if (mod === 0) { // first col

      }
      else {

        modX = canvas.width / sqrt * mod
        x = modX

        if (mod === sqrt - 1) { // last col

        }

      }

//      if (mod) { // odd... (when elevation is 2)
//
//        modX = canvas.width / elevation
//        x = modX
//
//      }
//      else { // even... (when elevation is 2)
//
//        if (pane) {
//
//          modY = canvas.height / elevation
//          y = modY
//
//        }
//
//      }

      console.log('------------------------');
      console.log('pane', pane);
//      console.log('x, y');
      console.log(x, y);
      console.log('mod', mod);
      console.log('modX', modX);
      console.log('modY', modY);

      var chunk = map[pane];
      for (var i = 0; i < chunk.length; i++) {

        var block = chunk[i];

        // Draw the block on the canvas.
        c.fillStyle = colorMap[block];
//        c.fillRect(x, y, blockWidth / elevation, blockHeight / elevation);
        c.fillRect(x, y, blockWidth / sqrt, blockHeight / sqrt);

        // Move over to get ready to draw the next block.
//        x += (blockWidth / elevation)
        x += (blockWidth / sqrt)

        if (mod) { // odd... (when elevation is 2)

          if (x >= canvas.width) {
            x = modX
//            y += (blockHeight / elevation)
            y += (blockHeight / sqrt)
          }

        }
        else { // even... (when elevation is 2)

//          if (x >= (canvas.width / elevation)) {
          if (x >= (canvas.width / sqrt)) {
            x = 0
//            y += (blockHeight / elevation)
            y += (blockHeight / sqrt)
          }

        }

      }

      console.log('finished pane', pane);

      if (mod === 0) { // first col

        modX = canvas.width / sqrt
        x = modX

        col++

      }
      else {

        modX = canvas.width / sqrt * mod
        x = modX

        col++

        if (mod === sqrt - 1) { // last col

          console.log('/////////////////////////////// ROW');

          row++
          col = 0

          modX = 0
          x = modX

          modY = canvas.height / sqrt
          if (row) { modY *= row; }
          y = modY

        }

      }


//      if (mod === 1) {
//
//        console.log('last pane in row');
//
//        modX = 0
//        x = modX
//
//      }

    }

    col++

  }
}

var gridWidth = 64;
var gridHeight = 64;

function drawGrid(){
  var y = 0;
  for (var y = 0; y < canvas.height; y+= gridHeight) {
    for (var x = 0; x <= canvas.width; x += gridWidth) {
      c.beginPath();
      c.rect(x, y, gridWidth, gridHeight);
      c.stroke();
    }
  }
}
