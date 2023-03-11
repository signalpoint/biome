class DesignerMode {

  constructor() {

  }

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

  }

  canvasMouseDownListener(evt) {

    let coords = d.getMouseDownCoords()

    // Get block delta and coordinates
    let delta = d.getBlockDelta(coords.x, coords.y)
    let blockCoords = d.getBlockCoords(coords.x, coords.y);
    console.log(`${blockCoords.x},${blockCoords.y} => ${delta} @ ${coords.x},${coords.y}`)

    let existingBlock = !!d.blocks[delta]
    let block = existingBlock ? d.blocks[delta] : null

    switch (d.getMode()) {

      // SELECT

      case 'select':

        if (existingBlock) {

          console.log(block)

        }
        else {

          console.log('-')

        }

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

    }

  }

}
