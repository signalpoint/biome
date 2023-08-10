let blockModal = null

class DesignerMode {

  constructor() {

    this._activePane = null

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

  generateWorld() {

    let mapWidth = d.getMapWidth()
    let mapHeight = d.getMapHeight()
    let blocksPerRow = d.blocksPerRow()
    let blocksPerCol = d.blocksPerCol()
    let blockSize = d.getBlockSize()
    let totalBlocks = blocksPerRow * blocksPerCol
    let chunkSize = d.getChunkSize()
    let blocksPerChunk = chunkSize * chunkSize
    let chunksPerWidth = blocksPerRow / chunkSize
    let chunksPerHeight = blocksPerCol / chunkSize

    console.log('map', `${mapWidth}x${mapHeight}`)
//    console.log('blocksPerRow', blocksPerRow)
//    console.log('blocksPerCol', blocksPerCol)
//    console.log('blockSize', blockSize)
//    console.log('totalBlocks', totalBlocks)
//    console.log('chunkSize', chunkSize)
//    console.log('blocksPerChunk', blocksPerChunk)
//    console.log('chunksPerWidth', chunksPerWidth)
//    console.log('chunksPerHeight', chunksPerHeight)

    let pool = [
      'Sand',
      'Grass',
      'Water',
      'Bedrock'
    ]
    let biomeTypes = BiomeDictionary.getTypes()

    // validate map dimensions

    if (
      !Number.isInteger(chunksPerWidth) ||
      !Number.isInteger(chunksPerHeight)
    ) {
      console.log('map-dimensions:chunk-size ratio not an absolute value')
      return;
    }

    // start with an empty map...

    for (let y = 0; y < mapHeight; y += blockSize) {

      for (let x = 0; x < mapWidth; x += blockSize) {

        d.blocks.push(0)
        d.buildings.push(0)

      }

    }

    // now go through and place chunks of blocks on the map...

    let chunkX = null
    let chunkY = 0

    let deltaX = null
    let deltaY = null

    for (let y = 0; y < chunksPerHeight; y++) {

      chunkX = 0

      for (let x = 0; x < chunksPerWidth; x++) {

//        let debug = chunkY == 0 && chunkX < 2
        let randomBiomeType = biomeTypes[Math.floor(Math.random()*biomeTypes.length)]
        let randomBlockType = pool[Math.floor(Math.random()*pool.length)]

//        console.log('-chunk', chunkX, chunkY, randomBlockType)

        deltaY = 0
        deltaX = x

        for (let i = 0; i < blocksPerChunk; i++) {

//          let debugRow = !i || i % chunkSize == 0
//          let debugRow = x == 0 && y == 0
//          let debugRow = x == 1 && y == 0
          let debugRow = false

          if (i && i % chunkSize == 0) {
            deltaY++
            deltaX = x
          } // new row

          let delta = (i % chunkSize) + (deltaY * blocksPerRow) + (y * blocksPerRow * chunkSize) + (x * chunkSize)

          // debug
//          if (debugRow) {
//            console.log('--row', `${deltaY} @ ${delta}`)
//          }

          d.blocks[delta] = d.create('block', randomBlockType).id

          deltaX++

        }

        // TODO track the deltas above, and send them off to the biome "builder"

        chunkX++

      }

      chunkY++

    }

  }

}
