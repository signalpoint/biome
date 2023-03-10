class Designer {

  constructor() {

    this._mode = null

    this._screenWidth = null
    this._screenHeight = null

    this._blockSize = null
    this._grid = false

    this._mapWidth = null
    this._mapHeight = null

    this._mouseDownX = null
    this._mouseDownY = null
    this._mouseUpX = null
    this._mouseUpY = null
    this._mouseBlockDelta = null

    this.blocks = []

  }

  // mode

  setMode(m) { this._mode = m }
  getMode() { return this._mode }

  // screen

  setScreenWidth(w) { this._screenWidth = w }
  getScreenWidth() { return this._screenWidth }

  setScreenHeight(h) { this._screenHeight = h }
  getScreenHeight() { return this._screenHeight }

  setScreenResolution(w, h) {
    this._screenWidth = w
    this._screenHeight = h
    canvas.width = w
    canvas.height = h
  }

  // grid

  setGrid(grid) { this._grid = grid }
  getGrid() { return this._grid }

  showGrid() { return !!this.getGrid() }

  // blocks

  setBlockSize(size) { this._blockSize = size }
  getBlockSize() { return this._blockSize }

  blocksPerRow() { return this.getMapWidth() / this.getBlockSize() }
  blocksPerCol() { return this.getMapHeight() / this.getBlockSize() }

  blocksPerScreenRow() { return this.getScreenWidth() / this.getBlockSize() }
  blocksPerScreenCol() { return this.getScreenHeight() / this.getBlockSize() }

  getBlockCoords(x, y) {
   return {
      x: Math.floor(x / this.getBlockSize()),
      y: Math.floor(y / this.getBlockSize())
    }
  }
  getBlockDelta(x, y) {
    let coords = this.getBlockCoords(x, y)
    return this.getBlockDeltaFromPos(coords.x, coords.y)
  }

  getBlockDeltaFromPos(x, y) {
    return y * this.blocksPerRow() + x
  }

  // map

  setMapWidth(width) { this._mapWidth = width }
  getMapWidth() { return this._mapWidth }

  setMapHeight(height) { this._mapHeight = height }
  getMapHeight() { return this._mapHeight }

  // mouse

  setMouseDownX(x) { this._mouseDownX = x }
  getMouseDownX() { return this._mouseDownX }

  setMouseDownY(y) { this._mouseDownY = y }
  getMouseDownY() { return this._mouseDownY }

  setMouseDownCoords(coords) {
    this._mouseDownX = coords.x
    this._mouseDownY = coords.y
  }

  getMouseDownCoords() {
    return {
      x: this._mouseDownX,
      y: this._mouseDownY
    }
  }

  setMouseUpCoords(coords) {
    this._mouseUpX = coords.x
    this._mouseUpY = coords.y
  }

  getMouseUpCoords() {
    return {
      x: this._mouseUpX,
      y: this._mouseUpY
    }
  }

  setMouseBlockDelta(delta) { this._mouseBlockDelta = delta }
  getMouseBlockDelta() { return this._mouseBlockDelta }

  // INIT

  init() {

    for (let y = 0; y < this.getMapHeight(); y += this.getBlockSize()) {

      for (let x = 0; x < this.getMapWidth(); x += this.getBlockSize()) {

        this.blocks.push(0)

      }

    }

  }

  update() {

    // TODO remember!!! all update() calls should happen before the next draw() calls!

  }

  // DRAW

  draw() {

    c.clearRect(0, 0, canvas.width, canvas.height);

    // blocks
    let startX = 0 // this will change as viewport changes
    let startY = 0 // this will change as viewport changes
    let blockDelta = null
    let block = null

    for (var y = startY; y < this.blocksPerScreenCol(); y++) {

      for (var x = startX; x < this.blocksPerScreenRow(); x++) {

        blockDelta = this.getBlockDeltaFromPos(x, y)
        block = this.blocks[blockDelta]

        // If the block exists...
        if (block) {

          block.draw(x, y)

        }

        // block mouse hover effect
        if (this.getMouseBlockDelta() == blockDelta) {
          c.beginPath()
          c.strokeStyle = 'rgba(0,0,0,1)';
          c.rect(x * this.getBlockSize(), y * this.getBlockSize(), this.getBlockSize(), this.getBlockSize());
          c.stroke();
        }

      }

    }

    // grid
    if (this.showGrid()) {
      c.strokeStyle = 'rgba(0,0,0,0.2)';
      for (var y = 0; y < canvas.height; y+= this.getBlockSize()) {
        for (var x = 0; x < canvas.width; x += this.getBlockSize()) {
          c.beginPath()
          c.rect(x, y, this.getBlockSize(), this.getBlockSize())
          c.stroke()
        }
      }
    }

  }

  // CANVAS MOUSE EVENT LISTENERS

  // move
  canvasMouseMoveListener(e) {

    // show mouse x,y coords
    let coords = getCanvasMouseCoords(e)
    canvasMouseCoordsBadge.innerHTML = coords.x + ',' + coords.y

    // track which block delta the mouse is over
    let blockDelta = d.getBlockDelta(coords.x, coords.y)
    if (blockDelta != d.getMouseBlockDelta()) {
      d.setMouseBlockDelta(blockDelta)
      d.draw()
    }

  }

  // mouse down
  canvasMouseDownListener(e) {

    // Get the mouse coordinates.
    let coords = getCanvasMouseCoords(e)

    // Set aside the mouse coordinates.
    this.setMouseDownCoords(coords)

    // Get block delta and coordinates
    let delta = this.getBlockDelta(coords.x, coords.y)
    let blockCoords = this.getBlockCoords(coords.x, coords.y);
    console.log(`${blockCoords.x},${blockCoords.y} => ${delta} @ ${coords.x},${coords.y}`)

    let existingBlock = !!this.blocks[delta]
    let block = existingBlock ? this.blocks[delta] : null

    switch (d.getMode()) {

      case 'select':

        if (existingBlock) {

          console.log(block)

        }
        else {

          console.log('-')

        }

        break;

      case 'paint':

        // If the block already exists...
        if (existingBlock) {

        }
        else {

          // The block does not exist...

          this.blocks[delta] = new Water(delta)
          console.log(this.blocks[delta])

        }

        break;

    }

  }

  // mouse up
  canvasMouseUpListener(e) {

    this.setMouseUpCoords(getCanvasMouseCoords(e))

    this.draw()

  }

  // mouse wheel
  canvasMouseWheelListener(e) {

//    console.log(e);

    // ZOOM OUT
    if (e.deltaY > 0) {

    }

    // ZOOM IN
    else {

    }

    return false

  }

}
