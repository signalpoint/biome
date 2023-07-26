class NpcWidget extends DesignerWidget {

  constructor({
    id,
    op = 'info'
  }) {

    super({
      id,
      op
    })

  }

  // methods

  getNpc() {
//    return d.npcs[this.delta]
    // TODO must have Npc extend Entity and implement an Entity Index to be able to easily load Npcs from
    return null
  }
  getAddWorkerBtn() { return this.getElement().querySelector('button[data-op="addWorker"]') }
  getRemoveWorkerBtns() { return this.getElement().querySelectorAll('button[data-op="removeWorker"]') }

  getPaneContent(op) {

//    let npc = this.getNpc()

    return op

  }

  // overrides

  refresh() {
    super.refresh()
  }

  // abstracts / interfaces

  attachEventListeners() { }

  attachEventListenersAfterRefresh() {

//    let npc = this.getNpc()

  }

  onShow() {}
  onShown() {}

  onHide() {}
  onHidden() {}

}

function getNpcWidgetId(id) { return 'npcWidget' + id }

function loadNpcWidget(id) { return _designerWidgets[getNpcWidgetId(id)] }

function createNpcWidget(id) {

  let template = document.getElementById('npcWidget')
  let newWidget = template.cloneNode(true);
  let newId = getNpcWidgetId(id)
  newWidget.setAttribute('id', newId)
  template.after(newWidget)
  widget = new NpcWidget({
    id: newId
  })
  widget.save()
  widget.init()

  // TODO gotta have entity index working to easily load npcs
//  let npc = d.npcs[delta]

  widget.setTitle('npc.name')
  widget.refresh()

  return widget

}
