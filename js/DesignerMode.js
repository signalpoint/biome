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

    let html = null

    switch (d.getMode()) {

      // SELECT

      case 'select':

        if (existingBlock) {

//          console.log(block)

          html = JSON.stringify(block)

        }
        else {

          html = '-'

        }

        this.getActivePane().innerHTML = JSON.stringify(block)

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
