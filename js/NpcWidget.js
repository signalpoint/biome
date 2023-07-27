class NpcWidget extends DesignerWidget {

  constructor({
    id,
    op = 'info',
    npcId
  }) {

    super({
      id,
      op
    })

    this._npcId = npcId

  }

  // methods

  getNpc() { return d.getNpc(this._npcId) }

  getAddWorkerBtn() { return this.getElement().querySelector('button[data-op="addWorker"]') }
  getRemoveWorkerBtns() { return this.getElement().querySelectorAll('button[data-op="removeWorker"]') }

  getPaneContent(op) {

    let html = ''

    let npc = this.getNpc()

    // BELT
    if (npc.belt && !npc.belt.isEmpty()) {
      let items = []
      for (let i = 0; i < npc.belt.getSize(); i++) {
        let item = npc.belt.get(i)
        if (item) {
          items.push(`<li class="list-group-item">${item.type}</li>`)
        }
      }
      html += `<ul class="list-group">${items.join('')}</ul>`
    }

    return html

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

function getNpcWidgetId(npcId) { return 'npcWidget' + npcId }

function loadNpcWidget(npcId) { return _designerWidgets[getNpcWidgetId(npcId)] }

function createNpcWidget(npcId) {
  let npc = d.getNpc(npcId)
  let template = document.getElementById('npcWidget')
  let newWidget = template.cloneNode(true);
  let newId = getNpcWidgetId(npcId)
  newWidget.setAttribute('id', newId)
  template.after(newWidget)
  widget = new NpcWidget({
    id: newId,
    npcId: npcId
  })
  widget.save()
  widget.init()
  widget.setTitle(npc.name)
  widget.refresh()
  return widget
}
