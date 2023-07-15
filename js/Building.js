class Building {

  constructor({
    delta,
    type,
    width,
    height
  }) {

    this.delta = delta
    this.type = type
    this.width = width
    this.height = height

  }

  // abstracts

  update() { }

  draw(x, y) { }

}

function getBuildingWidgetId(delta) { return 'buildingWidget' + delta }

function loadBuildingWidget(delta) { return _designerWidgets[getBuildingWidgetId(delta)] }

function createBuildingWidget(delta) {

  let template = document.getElementById('buildingWidget')
  let newWidget = template.cloneNode(true);
  let newId = getBuildingWidgetId(delta)
  newWidget.setAttribute('id', newId)
  template.after(newWidget)
  widget = new DesignerWidget({
    id: newId
  })
  widget.save()
  widget.init()

  console.log(delta)

  let building = d.buildings[delta]

  widget.setTitle(building.type)
  widget.setPaneContent('info', '---')

  return widget

}
