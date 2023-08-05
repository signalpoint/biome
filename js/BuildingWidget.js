class BuildingWidget extends DesignerWidget {

  constructor({
    id,
    op = 'info',
    delta
  }) {

    super({
      id,
      op
    })

    this.delta = delta

  }

  // methods

  getBuilding() { return d.building(this.delta) }
  getAddWorkerBtn() { return this.getElement().querySelector('button[data-op="addWorker"]') }
  getRemoveWorkerBtns() { return this.getElement().querySelectorAll('button[data-op="removeWorker"]') }

  getPaneContent(op) {

    let building = this.getBuilding()
    let title = building.type
    let delta = this.delta
    let deleteBtnId = `deleteBuildingBtn${delta}`
    let maxWorkers = building.getMaxWorkerCount()
    let hasWorker = building.hasWorker()

    // Worker List
    let workerList = null
    if (hasWorker) {
      let workers = []
      for (let i = 0; i < building.getWorkerCount(); i++) {
        let worker = building.getWorker(i)
        workers.push(
          `<li class="list-group-item">
            ${worker.name}
            <button class="btn btn-outline-secondary btm-sm float-end" title="Remove Worker" data-op="removeWorker" data-id="${worker.id}">
              <i class="fas fa-minus"></i>
            </button>
          </li>`
        )
      }
      workerList = `<ul class="list-group mb-3">${workers.join('')}</ul>`
    }

    let html =

      // Worker Count / Add Worker
      (maxWorkers ? `<div class="mb-3">
        <span class="me-2">Workers: ${building.getWorkerCount()} / ${maxWorkers}</span>
        <button class="btn btn-outline-secondary btn-sm" title="Add Worker"data-op="addWorker">
          <i class="fas fa-plus"></i>
        </button>
      </div>` : '') +

      // Worker List
      (workerList ? workerList : '') +

      // Content
      `<div class="mb-3 border-bottom">${building.getPaneContent(widget.getOp())}</div>` +

      // Delete Button
      `<button id="${deleteBtnId}" type="button" class="btn btn-outline-danger btn-sm" title="Delete ${title}" data-delta="${delta}">
        <i class="fas fa-trash"></i>
      </button>`

    return html

  }

  // overrides

  refresh() {
    super.refresh()
    this.getBuilding().attachEventListeners()
  }

  // abstracts / interfaces

  attachEventListeners() {

    let building = this.getBuilding()

    // on buildings that allow work...
    if (building.isWorkAllowed()) {

      let self = this

    }

  }

  attachEventListenersAfterRefresh() {

    let building = this.getBuilding()
    let delta = this.delta

    // "delete building" btn click handler
    let deleteBtnId = `deleteBuildingBtn${delta}`
    document.getElementById(deleteBtnId).addEventListener('click', function(e) {
      if (window.confirm("Delete building, are you sure?")) {
        d.buildings[delta] = 0
        d.removeEntityFromIndex(building)
        d.saveCurrentMap()
        refresh()
        widget.hide()
        deleteDesignerWidget(getBuildingWidgetId(delta))
      }
    })

    // on buildings that allow work...
    if (building.isWorkAllowed()) {

      let self = this

      // "add worker" btn click listener
      this.getAddWorkerBtn().addEventListener('click', function(e) {

        let unemployedVillager = getUnemployedVillager()
        if (unemployedVillager) {
          building.addWorker(unemployedVillager.id)
          self.refresh()
        }

      })

      // "remove worker" btn click handlers
      let removeWorkerBtns = this.getRemoveWorkerBtns()
      if (removeWorkerBtns) {
        for (let i = 0; i < removeWorkerBtns.length; i++) {
          removeWorkerBtns[i].addEventListener('click', function(e) {
            let btn = getBtnFromEvent(e)
            let workerId = btn.getAttribute('data-id')
            building.removeWorker(workerId)
            self.refresh()
          })
        }
      }

    }

  }

  onShow() {}
  onShown() {}

  onHide() {}
  onHidden() {}

}

function getBuildingWidgetId(delta) { return 'buildingWidget' + delta }

function loadBuildingWidget(delta) { return _designerWidgets[getBuildingWidgetId(delta)] }

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

  let building = d.building(delta)
  let title = building.type

  widget.setTitle(title)
  widget.refresh()

  return widget

}
