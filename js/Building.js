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

  let building = d.buildings[delta]
  let title = building.type
  let deleteBtnId = `deleteBuildingBtn${delta}`

  let html =

    // Delete Button
    `<button id="${deleteBtnId}" type="button" class="btn btn-danger" title="Delete ${title}" data-delta="${delta}">
      <i class="fas fa-trash"></i>
    </button>`

  widget.setTitle(title)
  widget.setPaneContent('info', html)

  setTimeout(function() {
    document.getElementById(deleteBtnId).addEventListener('click', function(e) {

      let btn = e.target
      while (btn && btn.tagName != 'BUTTON') { btn = btn.parentNode }

      if (window.confirm("Delete building, are you sure?")) {
        d.buildings[delta] = 0
        d.saveCurrentMap()
        refresh()
        widget.hide()
        deleteDesignerWidget(getBuildingWidgetId(delta))
      }

    })
  })

  return widget

}
