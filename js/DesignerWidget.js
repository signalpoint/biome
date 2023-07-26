let _designerWidgets = {}
let _designerWidgetToDrag = null

class DesignerWidget {

  constructor({
    id,
    op = null
  }) {
    this.id = id
    this._open = false // open or closed (aka shown or hidden)
    this._op = op // the current operation (aka nav item)
    this._offsetX = null
    this._offsetY = null
  }

  init() {
    this.getLegend().addEventListener('mousedown', designerWidgetDragMouseDown) // handle widget drag
    this.getCloseBtn().addEventListener('click', designerWidgetCloseBtnOnclick)
    let self = this
    setTimeout(function() {
      self.attachEventListeners()
    })
  }

  getElement() { return document.getElementById(this.id) }
  getNav() { return this.getElement().querySelector('.designer-widget-nav') }
  getNavBtns() { return this.getNav().querySelectorAll('[data-op]') }
  getNavBtn(op) { return this.getNav().querySelector(`[data-op="${op}"]`) }
  getActiveNavBtn() { return this.getNav().querySelector('.active') }
  getLegend() { return this.getElement().querySelector('legend') }
  getTitle() { return this.getLegend().querySelector('span').innerHTML }
  setTitle(title) { this.getLegend().querySelector('span').innerHTML = title }
  getCloseBtn() { return this.getElement().querySelector('.designer-widget-close') }

  save() { _designerWidgets[this.id] = this }

  show() {
    this.onShow()
    this.getElement().classList.remove('d-none')
    this._open = true
    this.onShown()
  }
  hide() {
    this.onHide()
    this.getElement().classList.add('d-none')
    this._open = false
    this.onHidden()
  }

  isOpen() { return this._open }
  isClosed() { return !this._open }

  getOp() { return this._op }
  setOp(op) { this._op = op }

  getDefaultOp() { return this.getNavBtns()[0].getAttribute('data-op') }

  getOffsetX() { return this._offsetX }
  setOffsetX(x) { this._offsetX = x }
  getOffsetY() { return this._offsetY }
  setOffsetY(y) { this._offsetY = y }

  getPanes() { return this.getElement().querySelector('.designer-widget-panes') }
  getPane(op) { return this.getPanes().querySelector(`[data-op="${op}"]`) }
  showPane(op) {

    // change nav
    this.getActiveNavBtn().classList.remove('active')
    this.getNavBtn(op).classList.add('active')

    // change pane
    let panes = this.getPanes()
    for (var i = 0; i < panes.children.length; i++) {
      panes.children[i].classList.add('d-none')
      panes.children[i].classList.remove('active')
    }
    let activePane = this.getPane(op)
    activePane.classList.remove('d-none')

    // set op
    this.setOp(op)

    // update mode
    d.setMode(op)

  }

  setPaneContent(op, html) { this.getPane(op).innerHTML = html }

  refresh() {
    let op = this.getOp()
    this.setPaneContent(op, this.getPaneContent(op))
    this.attachEventListenersAfterRefresh()
  }

  move(x, y) {
    let fieldset = this.getElement()
    fieldset.style.left = x + 'px'
    fieldset.style.top = y + 'px'
  }

  // abstracts / interfaces

  attachEventListeners() {}
  attachEventListenersAfterRefresh() {}

  onShow() {}
  onShown() {}

  onHide() {}
  onHidden() {}

  getPaneContent() { return '' }

}

function loadDesignerWidget(id) { return _designerWidgets[id] }
function deleteDesignerWidget(id) {
  delete _designerWidgets[id]
  document.getElementById(id).remove()
  saveDesignerWidgets()
}

function designerWidgetDragMouseDown(e) {

  if (e.which === 1) { // left click

    let widget = loadDesignerWidget(this.parentNode.getAttribute('id'))

    _designerWidgetToDrag = widget

    let fieldset = widget.getElement()

    // Calculate the initial offset between the mouse and the element's position
    let offsetX = e.clientX - fieldset.offsetLeft
    let offsetY = e.clientY - fieldset.offsetTop

//    console.log(`(${e.clientX},${e.clientY}) - (${fieldset.offsetLeft},${fieldset.offsetTop}) (${offsetX},${offsetY})`)
//    console.log('-----')

    widget.setOffsetX(offsetX)
    widget.setOffsetY(offsetY)

    document.addEventListener('mousemove', designerWidgetDragMouseMove)
    document.addEventListener('mouseup', designerWidgetDragMouseUp)

  }

}

function designerWidgetDragMouseMove(e) {

  let widget = _designerWidgetToDrag

  // Calculate the new position of the element
  const x = e.clientX - widget.getOffsetX()
  const y = e.clientY - widget.getOffsetY()

//  console.log(`(${e.clientX},${e.clientY}) - (${widget.getOffsetX()},${widget.getOffsetY()}) (${x},${y})`)

  widget.move(x, y)

}

function designerWidgetDragMouseUp(e) {

  let widget = _designerWidgetToDrag

  document.removeEventListener('mousemove', designerWidgetDragMouseMove);
  document.removeEventListener('mouseup', designerWidgetDragMouseUp);

  const x = e.clientX - widget.getOffsetX()
  const y = e.clientY - widget.getOffsetY()

  widget.setOffsetX(x)
  widget.setOffsetY(y)

  saveDesignerWidgets()

  _designerWidgetToDrag = null

}

function initDesignerWidgets() {

  // fieldsets
  let designerWidgets = document.querySelectorAll('.designer-widget')
  for (var i = 0; i < designerWidgets.length; i++) {

    let fieldset = designerWidgets[i]
    let legend = fieldset.querySelector('legend')

    // instantiate widget
    let id = fieldset.getAttribute('id')
    let widget = new DesignerWidget({
      id
    })
    widget.save()

    // handle widget drag
    legend.addEventListener('mousedown', designerWidgetDragMouseDown)

  }

  // widget open buttons
  // e.g. view -> toolbar
  let designerWidgetBtns = document.querySelectorAll('.designer-widget-btn')
  for (var i = 0; i < designerWidgetBtns.length; i++) {
    designerWidgetBtns[i].addEventListener('click', function(e) {

      // find the btn
      let btn = e.target
      while (btn && !btn.classList.contains('designer-widget-btn')) { btn = btn.parentNode }

      let widgetId = btn.getAttribute('data-designer-widget')
      let widget = loadDesignerWidget(widgetId)
      widget.setOp(widget.getDefaultOp())
      widget.show()
      saveDesignerWidgets()

    })
  }

  // widget close buttons
  let designerWidgetCloseBtns = document.querySelectorAll('.designer-widget-close')
  for (var i = 0; i < designerWidgetCloseBtns.length; i++) {
    designerWidgetCloseBtns[i].addEventListener('click', designerWidgetCloseBtnOnclick)
  }

  // DesignerWidgetNav buttons
  let designerWidgetNavs = document.querySelectorAll('.designer-widget-nav a')
  for (var i = 0; i < designerWidgetNavs.length; i++) {

    designerWidgetNavs[i].addEventListener('click', function(e) {

      // find the btn
      let btn = e.target
      while (btn && btn.tagName != 'A') { btn = btn.parentNode }

      // grab the op
      let op = btn.getAttribute('data-op')
//      console.log(op)

      // locate the fieldset...
      let fieldset = null
      let parent = btn.parentNode
      let depth = 0
      let maxDepth = 10
      while (!fieldset) {
        if (parent.classList.contains('designer-widget')) {
          fieldset = parent
          break
        }
        parent = parent.parentNode
        depth++
        if (depth > maxDepth) { break }
      }
      if (fieldset) {

        // load the widget
        let widgetId = fieldset.getAttribute('id')
        let widget = loadDesignerWidget(widgetId)

        // show the selected pane
        widget.showPane(op)

        saveDesignerWidgets()

      }

    })

  }

  loadDesignerWidgets()

}

function designerWidgetCloseBtnOnclick(e) {
  let closeBtn = e.target
  let fieldset = null
  let parent = closeBtn.parentNode
  while (parent) {
    if (parent.classList.contains('designer-widget')) {
      fieldset = parent
      break
    }
    parent = parent.parentNode
  }
  if (fieldset) {
    let widgetId = fieldset.getAttribute('id')
    let widget = loadDesignerWidget(widgetId)
    widget.hide()
    saveDesignerWidgets()
  }
}

function loadDesignerWidgets() {

  let input = dStorage.load('designerWidgets')

  for (let id in input) {

    if (!input.hasOwnProperty(id)) { continue }

    let data = input[id]
    let widget = null

    if (document.getElementById(id)) { // widget exists in DOM already
      widget = new DesignerWidget({
        id
      });
      widget.save()
    }
    else { // widget doesn't exist in DOM...

      // building widgets
      if (id.indexOf('buildingWidget') === 0) {
        let delta = id.replace('buildingWidget', '')
        widget = createBuildingWidget(delta)
      }

      // npc widgets
      else if (id.indexOf('npcWidget') === 0) {
        let delta = id.replace('npcWidget', '')
        widget = createNpcWidget(delta)
      }

    }

    if (data.open) { widget.show() }
    if (data.op) { widget.showPane(data.op) }
    if (data.oX && data.oY) {
      widget.move(data.oX, data.oY)
      widget.setOffsetX(data.oX)
      widget.setOffsetY(data.oY)
    }

  }

}

function saveDesignerWidgets() {
  let output = {}
  for (let id in _designerWidgets) {
    if (!_designerWidgets.hasOwnProperty(id)) { continue }
    let widget = _designerWidgets[id]
    output[id] = {
      open: widget.isOpen(),
      op: widget.getOp(),
      oX: widget.getOffsetX(),
      oY: widget.getOffsetY()
    }
  }
  dStorage.save('designerWidgets', output)
}
