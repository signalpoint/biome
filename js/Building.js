class Building {

  constructor({
    delta,
    type,
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

    this.delta = delta
    this.type = type

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

  getPaneContent(op) { return '' } // for use with BuildingWidget panes

  handleVillagerArrival() {}

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

}
