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

    // ENTITY INDEX

    // entity ids...
    // [
    //   'abc123',
    //   'def456',
    //   'xyz789'
    // ]
    this._entityIds = []

    // entities...
    // {
    //   block: {
    //     abc123: { type: 'Grass', ... }
    //   },
    //   item: {
    //     def456: { type: 'WoodAxe', ... }
    //   },
    //   building: {
    //     xyz789: { type: 'LumberCamp', ... }
    //   },
    //   ...
    // }
    this._entities = {}

    // bundles...
    // {
    //   block: {
    //     Grass: [ 'abc123' ]
    //   },
    //   item: {
    //     WoodAxe: [ 'def456' ]
    //   },
    //   building: {
    //     LumberCamp: [ 'xyz789' ]
    //   },
    // }
    this._entityBundles = {}

    // TODO

    // x - take Npc.js's "npcs" var out of the global namespace and use entity index instead
    // - the map does need to keep its d.blocks and d.buildings and friends/indexes though; maybe rename them a bit
    // - imagine how much easier it'll be to import/export | save/load stuff when they are all entities too
    // - replace d.blocks[123] holding a full block object to hold just the entity id instead
    // - replace d.buildings[456] holding a full building object to hold just the entity id instead
    // - entity collection indexes may be able to be simplified to just hold ids instead of entities,
    //   and then pull from the new top level entity index
    // - enemies can be npcs too
    // - a single browser should be able to have different profiles for different players
    // - once you place a building down, the grid seems to get thicker/darken
    // - the belt should just contain references to certain items in an entity collection (aka the inventory),
    //     that way the player can hold more than what is in the belt, and we can easily manage in/out entities
    // - the map could be shaded out at first, and as you explore, the blocks begin to draw/alpha themselves
    // - the concept of a roof would be neat, where it is transparent when you're under it, but opaque when outside of it

    // x - Block extend Entity
    // x - Building extend Entity
    // x - Player extend entity
    // x - the Entity layer should have its own index

    this.blocks = [] // blocks on the map, keyed by delta, holds full block object
    this.blocksIndex = {} // TODO deprecate

    this._selectedBlocks = [] // a collection of selected blocks (their delta value)

    this.buildings = [] // buildings on the map, keyed by delta, holds full building object
    this.buildingsIndex = {} // TODO deprecate

    this._mouseDownBlockDelta = null
    this._mouseUpBlockDelta = null

  }

  save() {

    // save the map
    this.saveCurrentMap()

    // save the player
    player.save()

  }

  // entity ids

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

  // entity index

  addEntityToIndex(entityType, entity) {
    if (!this._entities[entityType]) { this._entities[entityType] = {} }
    this._entities[entityType][entity.id] = entity
    this._addEntityToBundleIndex(entityType, entity)
  }
  removeEntityFromIndex(entity) {
    delete this._entities[entity.entityType][entity.id]
    this._removeEntityFromBundleIndex(entity.entityType, entity)
  }

  getEntityFromIndex(entityType, id) { return this._entities[entityType][id] }

  // entity bundle index

  _addEntityToBundleIndex(entityType, entity) {
    if (!this._entityBundles[entityType]) { this._entityBundles[entityType] = {} }
    if (!this._entityBundles[entityType][entity.type]) { this._entityBundles[entityType][entity.type] = [] }
    this._entityBundles[entityType][entity.type].push(entity.id)
  }
  _removeEntityFromBundleIndex(entityType, entity) {
    let i = this._entityBundles[entityType][entity.type].indexOf(entity.id)
    this._entityBundles[entityType][entity.type].splice(i, 1)
  }

  getEntityBundleIndexFromType(entityType) { return this._entityBundles[entityType] }

  // entity proxies

  _hasEntityType(entityType) {
    let bundleIndex = this.getEntityBundleIndexFromType(entityType)
    if (bundleIndex) {
      for (let type in bundleIndex) {
        if (!bundleIndex.hasOwnProperty(type)) { continue }
        if (bundleIndex[type].length) {
          return true
        }
      }
    }
    return false
  }

  create(entityType, bundle) {
    if (entityType == 'block') {
      let blockClass = d.getBlockClass(bundle)
      let block = new blockClass({
//        delta: null
      })
      return block
    }
    else if (entityType == 'item') {
      let itemClass = d.getItemClass(bundle)
      let item = new itemClass({})
      return item
    }
    else if (entityType == 'building') { console.log('TODO create() building') }
  }

  destroy(entity) {
    this.removeEntityId(entity.id)
    this.removeEntityFromIndex(entity)
  }

  getEntityDict(entityType) {
    if (entityType == 'block') { return dBlocks }
    else if (entityType == 'item') { return dItems }
    else if (entityType == 'building') { return dBuildings }
    return null
  }
  getEntityDefinition(entityType, type) {
    return this.getEntityDict(entityType).getType(type)
  }
  getEntityRequirements(entityType, type) {
    return this.getEntityDefinition(entityType, type).requires
  }

  isCraftable(entityDict) {
    return typeof entityDict.craftable !== 'undefined' ? entityDict.craftable : true // assumes entity is craftable
  }

  outputQty(entityType, type) {
    let def = d.getEntityDefinition(entityType, type)
    return def.output ? def.output : 1
  }

  block(delta) { return this.getBlock(d.blocks[delta]) }
  building(delta) { return this.getBuilding(d.buildings[delta]) }

  hasBlock(delta) { return !!d.blocks[delta] }

  hasBlocks() { return this._hasEntityType('block') }
  hasBuildings() { return this._hasEntityType('building') }
  hasItems() { return this._hasEntityType('item') }
  hasNpcs() { return this._hasEntityType('npc') }

  getEntity(entityType, id) { return d.getEntityFromIndex(entityType, id) }
  getBlock(id) { return d.getEntity('block', id) }
  getBuilding(id) { return d.getEntity('building', id) }
  getItem(id) { return d.getEntity('item', id) }
  getNpc(id) { return d.getEntity('npc', id) }

  getBlocks() { return this._entities.block }
  getBuildings() { return this._entities.building }
  getItems() { return this._entities.item }
  getNpcs() { return this._entities.npc }

  getBlockIdsByType(type) { return this._entityBundles['block'][type] }
  getBuildingIdsByType(type) { return this._entityBundles['building'][type] }
  getItemIdsByType(type) { return this._entityBundles['item'][type] }
  getNpcIdsByType(type) { return this._entityBundles['npc'][type] }

  getBlocksByType(type) {
    let blocks = []
    let ids = this.getBlockIdsByType(type)
    for (let i = 0; i < ids.length; i++) {
      blocks.push(d.getBlock(ids[i]))
    }
    return blocks
  }
  getBuildingsByType(type) {
    let buildings = []
    let ids = this.getBuildingIdsByType(type)
    for (let i = 0; i < ids.length; i++) {
      buildings.push(d.getBuilding(ids[i]))
    }
    return buildings
  }
  getItemsByType(type) {
    let items = []
    let ids = this.getItemIdsByType(type)
    for (let i = 0; i < ids.length; i++) {
      items.push(d.getItem(ids[i]))
    }
    return items
  }
  getNpcsByType(type) {
    let npcs = []
    let ids = this.getNpcIdsByType(type)
    for (let i = 0; i < ids.length; i++) {
      npcs.push(d.getNpc(ids[i]))
    }
    return npcs
  }

  hasVillagers() {
    return this._entityBundles.npc &&
      this._entityBundles.npc.villager &&this._entityBundles.npc.villager.length
  }
  getVillagers() { return this.getNpcsByType('villager') }
  getVillagersCount() { return this._entityBundles.npc.villager.length }

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
      d.block(delta).selected = false
    }
    this._selectedBlocks = []
  }

  selectBlock(delta) {
    this.getSelectedBlocks().push(delta)
    d.block(delta).select()
  }
  deselectBlock(delta) {
    this.getSelectedBlocks().splice(this.getSelectedBlocks().indexOf(delta), 1)
    d.block(delta).deselect()
  }
  blockSelected(delta) { return this.getSelectedBlocks().includes(delta) }

  getMouseDownBlockDelta() { return this._mouseDownBlockDelta }
  setMouseDownBlockDelta(delta) { this._mouseDownBlockDelta = delta }
  getMouseDownBlock() { return d.blocks[this._mouseDownBlockDelta] ? d.block(this._mouseDownBlockDelta) : null }
  getMouseUpBlockDelta() { return this._mouseUpBlockDelta }
  setMouseUpBlockDelta(delta) { this._mouseUpBlockDelta = delta }
  getMouseUpBlock() { return d.blocks[this._mouseUpBlockDelta] ? d.block(this._mouseUpBlockDelta) : null }

  // buildings

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
    if (d.hasNpcs()) {
      let pos = this.getMouseUpCoords()
      let npcs = d.getNpcs()
      for (let id in npcs) {
        if (!npcs.hasOwnProperty(id)) { continue }
        let npc = npcs[id]
//        console.log(`${npc.name} is @ (${npc.x},${npc.y})`)
        if (
          pos.x >= npc.x &&
          pos.y >= npc.y &&
          pos.x < npc.x + npc.width &&
          pos.y < npc.y + npc.height
        ) { return npc }
      }
    }
    return null
  }

  // INIT

  init() {

    // start with an empty map...

    for (let y = 0; y < this.getMapHeight(); y += this.getBlockSize()) {

      for (let x = 0; x < this.getMapWidth(); x += this.getBlockSize()) {

        this.blocks.push(0)
        this.buildings.push(0)

      }

    }

    // open the last map, if available...

    let lastMapOpened = dStorage.load('LastMapOpened')
    if (lastMapOpened) { dStorage.importMap(lastMapOpened) }

    game.init()

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

      d.setMouseBlockDelta(blockDelta)

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
        block ? block.hardness : BLOCK_DEFAULT_HARDNESS, // hardness => interval in ms
        e
      )
    }
    if (e.which == 3) {
      mouse.right.pressed = 1
      mouse.right.timer.start()
      mouse.right.interval = setInterval(
        d.isPlaying() ? playerMode.canvasMouseDownHoldListener : dMode.canvasMouseDownHoldListener,
        block ? block.hardness : BLOCK_DEFAULT_HARDNESS, // hardness => interval in ms
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

    d.isPlaying() ? game.canvasMouseWheelListener(e) : dMode.canvasMouseWheelListener(e)

    return false

  }

  // CANVAS CONTEXT

  // TODO rename to mine() ? yes! we're already using "mine" concept elsewhere
  dig(block, x, y) {

    c.globalAlpha = (100 - block.health) * .01
    c.fillStyle = 'black'
    c.fillRect(x * d.getBlockSize(), y * d.getBlockSize(), d.getBlockSize(), d.getBlockSize())
    c.globalAlpha = game.getGlobalAlpha()

  }

}
