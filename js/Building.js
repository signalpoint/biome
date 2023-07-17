class Building {

  constructor({
    delta,
    type,
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
    this.width = width
    this.height = height

    this.primaryColor = primaryColor
    this.secondaryColor = secondaryColor

    this.icon = icon
    this.iconUnicode = iconUnicode

    this._maxWorkers = maxWorkers
    this._workers = []

  }

  // abstracts

  update() { }
  getPaneContent(op) { return '' } // for use with BuildingWidget panes

  // methods

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

function getBuildingWidgetId(delta) { return 'buildingWidget' + delta }

function loadBuildingWidget(delta) { return _designerWidgets[getBuildingWidgetId(delta)] }

// TODO we probably need a BuildingWidget class that extends a DesignerWidget

function createBuildingWidget(delta) {

  let template = document.getElementById('buildingWidget')
  let newWidget = template.cloneNode(true);
  let newId = getBuildingWidgetId(delta)
  newWidget.setAttribute('id', newId)
  template.after(newWidget)
  widget = new BuildingWidget({
    id: newId,
    delta: delta
  })
  widget.save()
  widget.init()

  let building = d.buildings[delta]
  let title = building.type

  widget.setTitle(title)
  widget.refresh()

  return widget

}
