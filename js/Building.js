class Building extends Entity {

  constructor({
    id = null,
    type, // e.g. LumberCamp, ...
    delta,
    x,
    y,
    width,
    height,
    primaryColor = null,
    secondaryColor = null,
    icon = null,
    iconUnicode = null,
    maxWorkers = 0
  }) {

    super({
      id,
      entityType: 'building'
    })

    this.type = type

    this.delta = delta

    this.x = x
    this.y = y

    this.width = width
    this.height = height

    this.primaryColor = primaryColor
    this.secondaryColor = secondaryColor

    this.icon = icon
    this.iconUnicode = iconUnicode

    this._maxWorkers = maxWorkers
    this._workers = []

    this._inventory = []
    this._inventoryIndex = {}

    d.addEntityToIndex('building', this)

  }

  // abstracts / interfaces

  update() { }

  draw(x, y) {

    c.beginPath()

    c.fillStyle = this.primaryColor
    c.fillRect(x * d.getBlockSize(), y * d.getBlockSize(), this.width, this.height)

    c.fillStyle = this.secondaryColor
    c.fillRect(x * d.getBlockSize() + this.width / 4, y * d.getBlockSize() + this.height / 4, this.width / 2, this.height / 2)

    c.strokeStyle = 'black'
    c.lineWidth = 2
    c.strokeRect(x * d.getBlockSize(), y * d.getBlockSize(), this.width, this.height)
    c.strokeRect(x * d.getBlockSize() + this.width / 4, y * d.getBlockSize() + this.height / 4, this.width / 2, this.height / 2)

    c.font = `600 64px "Font Awesome 5 Free"`
    c.fillStyle = 'black'
    c.fillText(this.iconUnicode, x * d.getBlockSize(), y * d.getBlockSize() + this.height)

  }

  getPaneContent(op) { return this.renderInventory() } // for use with BuildingWidget panes

  attachEventListeners() {}

  handleVillagerArrival(villager) {}

  // methods

  getPosition() {
    return {
      x: this.x,
      y: this.y
    }
  }

  getCoordinates() { return d.getBlockCoordsFromDelta(this.delta) }

  getWidget() {
    let widget = loadBuildingWidget(this.delta)
    if (!widget) {
      widget = createBuildingWidget(this.delta)
    }
    return widget
  }
  refreshWidget() { this.getWidget().refresh() }

  // WORKERS

  getWorkers() { return this._workers }
  getWorker(i) { return loadVillager(this.getWorkers()[i]) }
  getWorkerIndex(id) { return this.getWorkers().indexOf(id) }
  getWorkerCount() { return this.getWorkers().length }
  getMaxWorkerCount() { return this._maxWorkers }
  isWorkAvailable() { return this.getWorkerCount() >= this.getMaxWorkerCount() }
  isWorkAllowed() { return !!this.getMaxWorkerCount() }
  hasWorker() { return !!this.getWorkerCount() }
  addWorker(id) {
    this.getWorkers().push(id)
    loadVillager(id).setEmployer(this.delta)
  }
  removeWorker(id) {
    this.getWorkers().splice(this.getWorkerIndex(id), 1)
    loadVillager(id).setEmployer(null)
  }

  // INVENTORY
  // TODO class Inventory extends EntityCollection?

  getInventory() { return this._inventory }
  getInventoryItem(index) { return this._inventory[index] }
  addInventory(block) {
    this._inventory.push(block)
    this.addInventoryToIndex(block)
  }

  getInventoryIndex() { return this._inventoryIndex }
  addInventoryToIndex(block) {
    if (!this._inventoryIndex[block.type]) { this._inventoryIndex[block.type] = [] }
    this._inventoryIndex[block.type].push(block.delta)
  }
  removeInventoryFromIndex(block) {
    let index = this._inventoryIndex[block.type].indexOf(block.delta)
    this._inventoryIndex[block.type].splice(index, 1)
  }
  getInventoryFromIndexByType(type) {
    return this.inventory[this._inventoryIndex[type][0]]
  }

  renderInventory() {
    let html = ''
    let items = []
    let inventoryIndex = this.getInventoryIndex()
    for (let type in inventoryIndex) {
      if (!inventoryIndex.hasOwnProperty(type)) { continue }
      items.push(
        `<li class="list-group-item">
          ${type}
          <span class="badge bg-primary text-light float-end">${inventoryIndex[type].length}</span>
        </li>`
      )
    }
    if (items.length) {
      html += `<ul class="list-group mb-3">${items.join()}</ul>`
    }
    return html
  }

}
