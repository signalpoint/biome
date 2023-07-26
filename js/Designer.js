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

    this._entityIds = []

    // TODO
    // - blocks and buildings should extend Entity
    // - then the Entity layer should have its own index
    // - then replace legacy blocks index, buildings index, etc with the entity index
    // - then we can easily have items and npcs with their own index too!
    // - imagine how much easier it'll be to import/export | save/load stuff when they are all entities too
    // - Player should also extend entity
    // - take Npc.js's "npcs" var out of the global namespace
    // - enemies can be npcs too

    this.blocks = [] // blocks on the map
    this.blocksIndex = {} // an index for blocks on the map
    this._selectedBlocks = [] // a collection of selected blocks (their delta value)

    this.buildings = []
    this.buildingsIndex = {}

    this._mouseDownBlockDelta = null
    this._mouseUpBlockDelta = null

  }

  addEntityId(id) { this._entityIds.push(id) }
  removeEntityId(id) {
    let i = this._entityIds.indexOf(id)
    this._entityIds.splice(i, 1)
  }
  getRandomEntityId() {
    let id = null
    while (true) {
      id = (Math.random() + 1).toString(36).substring(7);
      if (id && !this._entityIds.includes(id)) { break }
    }
    return id
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

  saveCurrentMap() {
    let name = 'BakedLake'
    this.saveMap(name, dStorage.exportMapJson())
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
    // TODO rename x and y to col and row
   return {
      x: Math.floor(x / this.getBlockSize()),
      y: Math.floor(y / this.getBlockSize())
    }
  }
  getBlockDelta(x, y) {
    let coords = this.getBlockCoords(x, y)
    return this.getBlockDeltaFromPos(coords.x, coords.y)
  }

  addBlockToIndex(block) {
    if (!this.blocksIndex[block.type]) { this.blocksIndex[block.type] = [] }
    this.blocksIndex[block.type].push(block.delta)
  }
  removeBlockFromIndex(block) {
    let index = this.blocksIndex[block.type].indexOf(block.delta)
    this.blocksIndex[block.type].splice(index, 1)
  }
  getBlockFromIndexByType(type) {
    return this.blocks[this.blocksIndex[type][0]]
  }
  indexHasBlockType(type) {
    return this.blocksIndex[type] && this.blocksIndex[type].length
  }

  getBlockClass(type) { return dBlocks.getType(type).blockClass }

  /**
   * Given a row and column number, this will return the delta of the block that resides there.
   * @param {number} x The row number, starting at 0
   * @param {number} y The column number, starting at 0
   * @returns {Number}
   */
  getBlockDeltaFromPos(x, y) {
    return y * this.blocksPerRow() + x
  }

  getBlockPosFromDelta(delta) {
    let coords = this.getBlockCoordsFromDelta(delta)
    return {
      x: coords.col * d.getBlockSize(),
      y: coords.row * d.getBlockSize()
    }
  }

  getBlockCoordsFromDelta(delta) {
    return {
      col: delta % d.blocksPerRow(),
      row: Math.floor(delta / d.blocksPerCol())
    }
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
  setMouseDownBlockDelta(delta) { this._mouseDownBlockDelta = delta }
  getMouseDownBlock() { return d.blocks[this._mouseDownBlockDelta] }
  getMouseUpBlockDelta() { return this._mouseUpBlockDelta }
  setMouseUpBlockDelta(delta) { this._mouseUpBlockDelta = delta }
  getMouseUpBlock() { return d.blocks[this._mouseUpBlockDelta] }

  // buildings

  addBuildingToIndex(building) {
    if (!this.buildingsIndex[building.type]) { this.buildingsIndex[building.type] = [] }
    this.buildingsIndex[building.type].push(building.delta)
  }
  removeBuildingFromIndex(building) {
    let index = this.buildingsIndex[building.type].indexOf(building.delta)
    this.buildingsIndex[building.type].splice(index, 1)
  }
  getBuildingFromIndexByType(type) {
    return this.buildings[this.buildingsIndex[type][0]]
  }
  indexHasBuildingType(type) {
    return this.buildingsIndex[type] && this.buildingsIndex[type].length
  }

  getBuildingClass(type) { return dBuildings.getType(type).buildingClass }

  // items

  getItemTypes() { return dItems.getTypes() }
  getItemTypeRequirements(type) { return dItems.getRequirements(type) }
  getItemClass(type) { return dItems.getType(type).itemClass }

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

  getNpcAtMouseUp() {
    let pos = this.getMouseUpCoords()
    for (let i = 0; i < npcs.length; i++) {
      let npc = npcs[i]
//      console.log(`${npc.name} is @ (${npc.x},${npc.y})`)
      if (
        pos.x >= npc.x &&
        pos.y >= npc.y &&
        pos.x < npc.x + npc.width &&
        pos.y < npc.y + npc.height
      ) { return npc }
    }
    return null
  }

  // INIT

  init() {

    // open the last map, if available...

    let lastMapOpened = dStorage.load('LastMapOpened')
    if (lastMapOpened) { dStorage.importMap(lastMapOpened) }
    else {

      // start with an empty map...

      for (let y = 0; y < this.getMapHeight(); y += this.getBlockSize()) {

        for (let x = 0; x < this.getMapWidth(); x += this.getBlockSize()) {

          this.blocks.push(0)
          this.buildings.push(0)

        }

      }

    }

    dMode.init()
    dGame.init()

    initDesignerWidgets()

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

    d.isPlaying() ? playerMode.canvasMouseMoveListener(e) : dMode.canvasMouseMoveListener(e)

  }

  // mouse down
  canvasMouseDownListener(e) {

    let pos = getCanvasMouseCoords(e)
    let delta = d.getBlockDelta(pos.x + dCamera.xOffset(), pos.y + dCamera.yOffset())

    this.setMouseDownCoords(pos)
    this.setMouseDownBlockDelta(delta)

    let block = this.getMouseDownBlock()

    if (e.which == 1) {
      mouse.left.pressed = 1
      mouse.left.timer.start()
      mouse.left.interval = setInterval(
        d.isPlaying() ? playerMode.canvasMouseDownHoldListener : dMode.canvasMouseDownHoldListener,
        block ? block.canvasMouseDownInterval : 500,
        e
      )
    }
    if (e.which == 3) {
      mouse.right.pressed = 1
      mouse.right.timer.start()
      mouse.right.interval = setInterval(
        d.isPlaying() ? playerMode.canvasMouseDownHoldListener : dMode.canvasMouseDownHoldListener,
        block ? block.canvasMouseDownInterval : 500,
        e
      )
    }

    // debug
//    let x = pos.x + dCamera.xOffset()
//    let y = pos.y + dCamera.yOffset()
//    let blockCoords = d.getBlockCoords(x, y);
//    console.log(`${blockCoords.x},${blockCoords.y} => ${delta} @ ${x},${y}`)

    d.isPlaying() ? playerMode.canvasMouseDownListener(e) : dMode.canvasMouseDownListener(e)

  }

  // mouse up
  canvasMouseUpListener(e) {

    if (e.which == 1) {
      mouse.left.timer.stop()
      clearInterval(mouse.left.interval)
    }
    if (e.which == 3) {
      mouse.right.timer.stop()
      clearInterval(mouse.right.interval)
    }

    let pos = getCanvasMouseCoords(e)
    let delta = d.getBlockDelta(pos.x + dCamera.xOffset(), pos.y + dCamera.yOffset())

    this.setMouseUpCoords(pos)
    this.setMouseUpBlockDelta(delta)

    d.isPlaying() ? playerMode.canvasMouseUpListener(e) : dMode.canvasMouseUpListener(e)

    // reset the timer
    if (e.which == 1) {
      mouse.left.pressed = 0
      mouse.left.timer.reset()
    }
    if (e.which == 3) {
      mouse.right.pressed = 0
      mouse.right.timer.reset()
    }

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
