class Designer {

  constructor() {

    this._animationFrame = null

    this._playback = null

    this._mode = null

    this._paintModeBlockType = null

    this._screenWidth = null
    this._screenHeight = null

    this._blockSize = null
    this._grid = false

    this._mapWidth = null
    this._mapHeight = null

    this._mouseX = null
    this._mouseY = null
    this._mouseDownX = null
    this._mouseDownY = null
    this._mouseUpX = null
    this._mouseUpY = null
    this._mouseBlockDelta = null

    this.blocks = []
    this._selectedBlocks = [] // a collection of selected blocks (their delta value)

    this._mouseDownBlockDelta = null
    this._mouseUpBlockDelta = null

  }

  // maps

  loadMaps() {
    let maps = dStorage.load('CanvasMaps')
    if (!maps) { maps = [] }
    return maps
  }

  saveMaps(maps) {
    dStorage.save('CanvasMaps', maps)
  }

  saveMap(name, data) {
    dStorage.save(name, data)
  }
  loadMap(name) {
    return dStorage.load(name)
  }

  // playback

  setPlayback(p) { this._playback = p } // pause, play
  getPlayback() { return this._playback }

  isPaused() { return this.getPlayback() == 'pause' }
  isPlaying() { return this.getPlayback() == 'play' }

  // mode

  setMode(m) { this._mode = m }
  getMode() { return this._mode }

  setPaintModeBlockType(t) { this._paintModeBlockType = t }
  getPaintModeBlockType() { return this._paintModeBlockType }

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

  blocksPerScreenRow() { return Math.ceil(this.getScreenWidth() / this.getBlockSize()) }
  blocksPerScreenCol() { return Math.ceil(this.getScreenHeight() / this.getBlockSize()) }

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

  /**
   * Given a row and column number, this will return the delta of the block that resides there.
   * @param {number} x The row number, starting at 0
   * @param {number} y The column number, starting at 0
   * @returns {Number}
   */
  getBlockDeltaFromPos(x, y) {
    return y * this.blocksPerRow() + x
  }

  getSelectedBlocks() { return this._selectedBlocks }
  clearSelectedBlocks() {
    let selectedBlocks = this.getSelectedBlocks()
    for (let i = 0; i < selectedBlocks.length; i++) {
      let delta = selectedBlocks[i]
      d.blocks[delta].selected = false
    }
    this._selectedBlocks = []
  }

  selectBlock(delta) {
    this.getSelectedBlocks().push(delta)
    this.blocks[delta].select()
  }
  deselectBlock(delta) {
    this.getSelectedBlocks().splice(this.getSelectedBlocks().indexOf(delta), 1)
    this.blocks[delta].deselect()
  }
  blockSelected(delta) { return this.getSelectedBlocks().includes(delta) }

  getMouseDownBlockDelta() { return this._mouseDownBlockDelta }
  setMouseDownBlockDelta(delta) { this._mouseDownBlockDelta = delta}
  getMouseUpBlockDelta() { return this._mouseUpBlockDelta }
  setMouseUpBlockDelta(delta) { this._mouseUpBlockDelta = delta}

  // map

  setMapWidth(width) { this._mapWidth = width }
  getMapWidth() { return this._mapWidth }

  setMapHeight(height) { this._mapHeight = height }
  getMapHeight() { return this._mapHeight }

  // mouse

  setMouseX(x) { this._mouseX = x }
  getMouseX() { return this._mouseX }

  setMouseY(y) { this._mouseY = y }
  getMouseY() { return this._mouseY }

  setMouseCoords(coords) {
    this._mouseX = coords.x
    this._mouseY = coords.y
  }

  getMouseCoords() {
    return {
      x: this._mouseX,
      y: this._mouseY
    }
  }

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

    // open the last map, if available...

    let lastMapOpened = dStorage.load('LastMapOpened')
    if (lastMapOpened) {
      dStorage.importMap(lastMapOpened)
    }
    else {

      // start with an empty map...

      for (let y = 0; y < this.getMapHeight(); y += this.getBlockSize()) {

        for (let x = 0; x < this.getMapWidth(); x += this.getBlockSize()) {

          this.blocks.push(0)

        }

      }

    }

    dMode.init()
    dGame.init()

  }

  // CANVAS MOUSE EVENT LISTENERS

  // move
  canvasMouseMoveListener(e) {

    let coords = getCanvasMouseCoords(e)

    this.setMouseX(coords.x)
    this.setMouseY(coords.y)

    // show mouse x,y coords

    canvasMouseCoordsBadge.innerHTML = coords.x + ',' + coords.y

    let blockDelta = d.getBlockDelta(coords.x, coords.y)

    if (blockDelta != d.getMouseBlockDelta()) {

      // track which block delta the mouse is over
      d.setMouseBlockDelta(blockDelta)

//      refresh()

    }

    d.isPlaying() ? dGame.canvasMouseMoveListener(e) : dMode.canvasMouseMoveListener(e)

  }

  // mouse down
  canvasMouseDownListener(e) {

    mouse.left.pressed = 1

    let pos = getCanvasMouseCoords(e)
    let delta = d.getBlockDelta(pos.x + dCamera.xOffset(), pos.y + dCamera.yOffset())

    // start the timer
    mouse.left.timer.start()

    this.setMouseDownCoords(pos)
    this.setMouseDownBlockDelta(delta)

    d.isPlaying() ? dGame.canvasMouseDownListener(e) : dMode.canvasMouseDownListener(e)

  }

  // mouse up
  canvasMouseUpListener(e) {

    mouse.left.pressed = 0

    let pos = getCanvasMouseCoords(e)
    let delta = d.getBlockDelta(pos.x + dCamera.xOffset(), pos.y + dCamera.yOffset())

    // stop the timer
    mouse.left.timer.stop()

    this.setMouseUpCoords(pos)
    this.setMouseUpBlockDelta(delta)

    d.isPlaying() ? dGame.canvasMouseUpListener(e) : dMode.canvasMouseUpListener(e)

    // reset the timer
    mouse.left.timer.reset()

  }

  // mouse wheel
  canvasMouseWheelListener(e) {

//    console.log(e);

    // BACKWARD / ZOOM OUT
    if (e.deltaY > 0) {

    }

    // FORWARD / ZOOM IN
    else {

    }

    d.isPlaying() ? dGame.canvasMouseWheelListener(e) : dMode.canvasMouseWheelListener(e)

    return false

  }

}
