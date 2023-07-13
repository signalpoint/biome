let blockModal = null
let blockSolidCheckbox = null

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
      else if (mode == 'toolbar:paint') {

        let coords = getCanvasMouseCoordsWithCameraOffset(e)
        let delta = d.getBlockDelta(coords.x, coords.y)
        let type = d.getPaintModeBlockType()
        let existingBlock = d.blocks[delta] !== 0
        let block = existingBlock ? d.blocks[delta] : null

        if (existingBlock) {
          if (type != block.type) {
            this.paintNewBlock(delta, type)
          }
        }
        else {
          this.paintNewBlock(delta, type)
        }

      }

    }

  }

  canvasMouseDownListener(e) {

    let coords = d.getMouseDownCoords()

    let x = coords.x + dCamera.xOffset()
    let y = coords.y + dCamera.yOffset()

    // Get block delta and coordinates
    let delta = d.getBlockDelta(x, y)
    let blockCoords = d.getBlockCoords(x, y);

//    console.log(`${blockCoords.x},${blockCoords.y} => ${delta} @ ${x},${y}`)

    let existingBlock = d.blocks[delta] !== 0
    let block = existingBlock ? d.blocks[delta] : null

    switch (d.getMode()) {

      // SELECT

      case 'toolbar:select':

        let html = ''

        // On existing blocks...
        if (existingBlock) {

          if (d.getSelectedBlocks().length) { // at least one block is selected...

            if (d.blocks[d.getSelectedBlocks()[0]].delta == delta) { // clicked on selected block...

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
            let selectedBlock = d.blocks[selectedBlockDelta]
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
        this.getActivePane().innerHTML =
          `<fieldset class="border border-secondary mb-3 p-3">
            <legend class="fs-5">Select<span class="badge bg-secondary float-end">${selectedBlocks.length}</span></legend>
            ${html}
          </fieldset>`

        break;

      // PAINT

      case 'toolbar:paint':

        let blockType = d.getPaintModeBlockType()

        // If the block already exists...
        if (existingBlock) {

          // changing block type
          if (block.type != blockType) {
//            console.log(`${block.type} => ${blockType}`)
            this.paintNewBlock(delta, blockType)
          }
          else { // clicking on same block type...

            //open block modal
//            dMode.openBlockModal(delta)

            // update solid value
            d.blocks[delta].solid = paintModeBlockSolidCheckbox.checked ? 1 : 0

          }

        }
        else {

          // The block does not exist...

          // create the new block using the current type
          this.paintNewBlock(delta, blockType)

        }

        break;

      // EDGES

      case 'toolbar:edges':

        if (existingBlock) {

          console.log('edges', block)

        }

        break;

      // CAMERA

      case 'toolbar:camera':

        console.log('camera!')

        break;

    }

  }

  canvasMouseUpListener(e) {

  }

  canvasMouseWheelListener(e) {

  }

  paintBlock(delta, block) {
    d.blocks[delta] = block
    refresh()
  }

  paintNewBlock(delta, type) {
    d.blocks[delta] = new blockTypesDict[type]({
      delta,
      type,
      solid: paintModeBlockSolidCheckbox.checked ? 1 : 0
    })
    refresh()
  }

  openBlockModal(delta) {

    let block = d.blocks[delta]
//    console.log(delta, block)

    let body =
      `<h5>${block.type}<span class="badge badge-secondary float-end">${delta}</span></h5>
      <div class="form-check">
        <input class="form-check-input" type="checkbox" ${block.solid ? 'checked' : ''} value="" id="blockSolidCheckbox">
        <label class="form-check-label" for="blockSolidCheckbox">
          Solid
        </label>
      </div>`

    let blockModalEl = document.getElementById('blockModal')
    blockModalEl.querySelector('.modal-body').innerHTML = body
    blockModal = new bootstrap.Modal('#blockModal')

    // after modal opens...
    blockModalEl.addEventListener('show.bs.modal', event => {

      // solid checkbox click listener
      blockSolidCheckbox = document.getElementById('blockSolidCheckbox')
      blockSolidCheckbox.addEventListener('click', function() {
        block.solid = blockSolidCheckbox.checked ? 1: 0
      })

    })

    blockModal.show()

  }

}
