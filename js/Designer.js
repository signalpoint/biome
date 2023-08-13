class Designer {

  constructor() {

    this._animationFrame = null

    this._playback = null

    this._mode = null

    this._paintModeBlockType = null

    this._screenWidth = null
    this._screenHeight = null

    this._blockSize = null
    this._chunkSize = null
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
    // - maybe after a while bedrock should turn into grass
    // - weather elements: clouds, rain, lightning, fog, wind, etc
    // - LAYERS: allow layers of blocks? e.g. imagine tree leaves being drawn with some transparency on a layer above players
    // -- this would be cool in the other direction as well, becase could have a layer(s) underground
    // -- the leaves could then auto disappear after some time and drop items, etc - fun
    // - we should put our globals in the "d" namespace, e.g. d.keys, d.mouse, etc

    // x - Block extend Entity
    // x - Building extend Entity
    // x - Player extend entity
    // x - the Entity layer should have its own index

    this.blocks = [] // blocks on the map, keyed by delta, holds full block object
    this.blocksIndex = {} // TODO deprecate

    this._selectedBlocks = [] // a collection of selected blocks (their delta value)

    this.buildings = [] // buildings on the map, keyed by delta, holds full building object
    this.buildingsIndex = {} // TODO deprecate

    this._toasts = {}
    this._modals = {}

    this._mouseDownBlockDelta = null
    this._mouseUpBlockDelta = null

  }

  // INIT

  init() {

    // open the last map, if available...

    let lastMapOpened = dStorage.load('LastMapOpened')
    if (lastMapOpened) { dStorage.importMap(lastMapOpened) }
    else {

      // No map has been opened...

      // Generate a world for the user.
      dMode.generateWorld()
      d.saveCurrentMap()

    }

    game.init()

    initDesignerWidgets()

  }

  // TOAST

  addToast(id) {

    // clone the toast template, set its id and add it to the DOM
    let template = document.getElementById('toastTemplate')
    let newToastEl = template.cloneNode(true);
    newToastEl.setAttribute('id', id)
    template.after(newToastEl)

    // create bs5 toast and set it
    this.setToast(id, new bootstrap.Toast(newToastEl))

  }
  getToast(id) { return this._toasts[id] }
  setToast(id, toast) { this._toasts[id] = toast }

  toast({
    id,
    title,
    body,
    position = [
      'bottom-0',
      'end-0'
    ],
    delay = 5000,

    // events
    hide = null,
    hidden = null,
    show = null,
    shown = null

  }) {

    let toast = this.getToast(id)
    if (!toast) {
      this.addToast(id)
      toast = this.getToast(id)
    }

    // Grab the toast template and its container.
    let toastEl = document.getElementById(id)
    let toastContainer = toastEl.parentNode

    // Set any attributes.
    toastEl.setAttribute('data-bs-delay', delay)

    // Attach any event listeners and send along the element and toast.
    if (hide) { toastEl.addEventListener('hide.bs.toast', () => { hide(toastEl, toast) }) }
    if (hidden) { toastEl.addEventListener('hidden.bs.toast', () => { hidden(toastEl, toast) }) }
    if (show) { toastEl.addEventListener('show.bs.toast', () => { show(toastEl, toast) }) }
    if (shown) { toastEl.addEventListener('shown.bs.toast', () => { shown(toastEl, toast) }) }

    // Remove position classes and add the new cones
    toastContainer.classList.remove(...[
      'top-0',
      'bottom-0',
      'start-0',
      'end-0',
      'top-50',
      'bottom-50',
      'start-50',
      'end-50'
    ])
    toastContainer.classList.add(...position)

    // Set the title and body, then show the toast.
    toastEl.querySelector('.toast-header strong').innerHTML = title
    toastEl.querySelector('.toast-body').innerHTML = body
    toast.show()

  }

  // MODAL

  addModal(id) {

    // clone the modal template, set its id and add it to the DOM
    let template = document.getElementById('modalTemplate')
    let newModalEl = template.cloneNode(true);
    newModalEl.setAttribute('id', id)
    template.after(newModalEl)

    // create bs5 modal and set it
    this.setModal(id, new bootstrap.Modal(newModalEl))

  }
  getModal(id) { return this._modals[id] }
  setModal(id, modal) { this._modals[id] = modal }

  modal({
    id,
    title,
    body,
//    position = [
//      'bottom-0',
//      'end-0'
//    ],
//    delay = 5000,

    // events
    hide = null,
    hidden = null,
    hidePrevented = null,
    show = null,
    shown = null

  }) {

    let modal = this.getModal(id)
    if (!modal) {
      this.addModal(id)
      modal = this.getModal(id)
    }

    // Grab the modal element.
    let modalEl = document.getElementById(id)

    // Set any attributes.
//    modalEl.setAttribute('data-bs-delay', delay)

    // Attach any event listeners and send along the element and modal.
    if (hide) { modalEl.addEventListener('hide.bs.modal', () => { hide(modalEl, modal) }) }
    if (hidden) { modalEl.addEventListener('hidden.bs.modal', () => { hidden(modalEl, modal) }) }
    if (hidePrevented) { modalEl.addEventListener('hidePrevented.bs.modal', () => { hidePrevented(modalEl, modal) }) }
    if (show) { modalEl.addEventListener('show.bs.modal', () => { show(modalEl, modal) }) }
    if (shown) { modalEl.addEventListener('shown.bs.modal', () => { shown(modalEl, modal) }) }

    // Remove position classes and add the new cones
//    modalContainer.classList.remove(...[
//      'top-0',
//      'bottom-0',
//      'start-0',
//      'end-0',
//      'top-50',
//      'bottom-50',
//      'start-50',
//      'end-50'
//    ])
//    modalContainer.classList.add(...position)

    // Set the title and body, then show the modal.
    modalEl.querySelector('.modal-title').innerHTML = title
    modalEl.querySelector('.modal-body').innerHTML = body
    modal.show()

  }

  // SAVE

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

  isCraftable(entityDefinition) {
    return typeof entityDefinition.craftable !== 'undefined' ?
      entityDefinition.craftable :
      true // assumes entity is craftable
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
    dStorage.save('LastMapOpened', name)
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

  initScreenResolution() {

    let screenWidth = window.innerWidth
      || document.documentElement.clientWidth
      || document.body.clientWidth

    let screenHeight = window.innerHeight
      || document.documentElement.clientHeight
      || document.body.clientHeight

    let headerHeight = document.getElementById('d-menu').clientHeight
    let footerHeight = document.querySelector('footer').clientHeight
    let canvasHeight = screenHeight - (headerHeight + footerHeight)

//    console.log('headerHeight', headerHeight)
//    console.log('footerHeight', footerHeight)
//    console.log('canvasHeight', canvasHeight)
//    console.log('screenWidth', screenWidth)
//    console.log('screenHeight', screenHeight)

    // set screen resolution
    d.setScreenResolution(screenWidth, canvasHeight)

    // screen resolution event listener
    screenResolutionSelect.addEventListener('change', function() {
      let resolution = screenResolutionMap[this.value]
      d.setScreenResolution(resolution.w, resolution.h)
    })

//  let resolution = screenResolutionMap[screenResolutionSelect.value]
//  d.setScreenResolution(resolution.w, resolution.h)
//  d.setScreenResolution(innerWidth, innerHeight) // full screen

  }

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

  blockCanBePlacedUpon(block) { return block.isBedrock() || block.type == 'Grass' }

  // chunks

  setChunkSize(size) { this._chunkSize = size }
  getChunkSize() { return this._chunkSize }

  chunksPerRow() { return this.getMapWidth() / this.getChunkSize() }
  chunksPerCol() { return this.getMapHeight() / this.getChunkSize() }

  getChunkFromBlockDelta(delta) {
    let chunkSize = 32
  }

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

  // TODO rename to mine() ? yes! we're already using "mine" concept elsewhere
  dig(block, x, y) {

    c.globalAlpha = (100 - block.health) * .01
    c.fillStyle = 'black'
    c.fillRect(x * d.getBlockSize(), y * d.getBlockSize(), d.getBlockSize(), d.getBlockSize())
    c.globalAlpha = game.getGlobalAlpha()

  }

}
