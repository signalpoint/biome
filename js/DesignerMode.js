class DesignerMode {

  constructor() {

    this._activePane = null

  }

  setActivePane(el) { this._activePane = el }
  getActivePane() { return this._activePane }

  btnOnclickListener(btn) {

    let mode = btn.getAttribute('data-mode')

    // swap active class on buttons
    designerModeBtnsContainer.querySelector('button.active').classList.remove('active')
    btn.classList.add('active')

    // swap the panes...

    let activePane = document.querySelector('.designerModePane.active')
    activePane.classList.remove('active')
    activePane.classList.add('d-none')

    let chosenPane = document.querySelector('.designerModePane[data-mode="' + mode + '"]')
    chosenPane.classList.add('active')
    chosenPane.classList.remove('d-none')

    // udpate the mode
    d.setMode(mode)

    // set the active pane
    this.setActivePane(chosenPane)

  }

  canvasMouseDownListener(evt) {

    let coords = d.getMouseDownCoords()

    let x = coords.x + dCamera.xOffset()
    let y = coords.y + dCamera.yOffset()

    // Get block delta and coordinates
    let delta = d.getBlockDelta(x, y)
    let blockCoords = d.getBlockCoords(x, y);
    console.log(`${blockCoords.x},${blockCoords.y} => ${delta} @ ${x},${y}`)

    let existingBlock = d.blocks[delta] !== 0
    let block = existingBlock ? d.blocks[delta] : null

    switch (d.getMode()) {

      // SELECT

      case 'select':

        let html = ''

        // On existing blocks...
        if (existingBlock) {

          if (d.getSelectedBlocks().length) {
            d.clearSelectedBlocks();
          }

          d.selectBlock(delta)

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

      case 'paint':

        // If the block already exists...
        if (existingBlock) {

        }
        else {

          // The block does not exist...

          let blockType = d.getPaintModeBlockType()

          // create the new block using the current type
          d.blocks[delta] = new blockTypesDict[blockType]({
            delta,
            type: blockType
          })

        }

        break;

      // EDGES

      case 'edges':

        if (existingBlock) {

          console.log('edges', block)

        }

        break;

      // CAMERA

      case 'camera':

        console.log('camera!')

        break;

    }

  }

}
