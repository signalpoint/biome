let blockModal = null

class DesignerMode {

  constructor() {

    this._activePane = null

  }

  init() {

    // ...

  }

  canvasMouseMoveListener(e) {

    if (mouse.left.pressed) { // dragging...

      let mode = d.getMode()

      if (mode == 'toolbar:select') {

      }

    }

  }

  canvasMouseDownListener(e) {

    let leftClick = e.which == 1
    let rightClick = e.which == 3
    let mode = d.getMode()
    let widget = loadDesignerWidget('designerModeWidget')

    let delta = d.getMouseDownBlockDelta()

    let existingBlock = d.blocks[delta] !== 0
    let block = existingBlock ? d.block(delta) : null // TODO there is already a helper function that makes this available

    // SELECT
    if (mode == 'toolbar:select') {

      let html = ''

      // On existing blocks...
      if (existingBlock) {

        if (d.getSelectedBlocks().length) { // at least one block is selected...

          let selectedDelta = d.getSelectedBlocks()[0]
          if (d.block(selectedDelta).delta == delta) { // clicked on selected block...

            dMode.openBlockModal(delta)

          }
          else { // clicked on a different block....

            d.clearSelectedBlocks();
            d.selectBlock(delta)

          }

        }
        else { // no blocks are selected...

          d.selectBlock(delta)

        }

        // TODO ctrl+ click implementation
        // Toggle its selected state.
//          d.blockSelected(delta) ? d.deselectBlock(delta) : d.selectBlock(delta);

      }

      // Show any selected blocks...
      let selectedBlocks = d.getSelectedBlocks()
      if (selectedBlocks.length) {
        html += '<ul class="list-group">'
        for (var i = 0; i < selectedBlocks.length; i++) {
          let selectedBlockDelta = selectedBlocks[i]
          let selectedBlock = d.block(selectedBlockDelta)
          html +=
            `<li class="list-group-item d-flex justify-content-between align-items-start">
              <div class="ms-2 me-auto">
                <div class="fw-bold">${selectedBlock.type}</div>
              </div>
              <span class="badge bg-primary rounded-pill">#${selectedBlock.delta}</span>
            </li>`
        }
        html += '</ul>'
      }

      // Update the pane
      widget.setPaneContent(
        mode,
        `<fieldset class="border border-secondary mb-3 p-3">
          <legend class="fs-5">Select<span class="badge bg-secondary float-end">${selectedBlocks.length}</span></legend>
          ${html}
        </fieldset>`
      )


    }

    // CAMERA
    else if (mode == 'toolbar:camera') {

    }

  }

  canvasMouseDownHoldListener(e) { }

  canvasMouseDownHoldListener(e) { }

  canvasMouseUpListener(e) { }

  canvasMouseWheelListener(e) { }

  paintBlock(delta, block) {
//    console.log(`painting ${block.type} block @ ${delta}`, block)
    d.destroy(d.block(delta))
    block.delta = delta
    block.health = 100
    d.blocks[delta] = block.id
    refresh()
  }

  paintNewBlock(delta, type) {
    let blockClass = d.getBlockClass(type)
    let block = new blockClass({
      delta,
      type
    })
    d.blocks[delta] = block.id
    refresh()
  }

  openBlockModal(delta) {

    let block = d.block(delta)
//    console.log(delta, block)

    let body =
      `<h5>${block.type}<span class="badge badge-secondary float-end">${delta}</span></h5>`

    let blockModalEl = document.getElementById('blockModal')
    blockModalEl.querySelector('.modal-body').innerHTML = body
    blockModal = new bootstrap.Modal('#blockModal')

    // after modal opens...
    blockModalEl.addEventListener('show.bs.modal', event => {

    })

    blockModal.show()

  }

}
