let blockModal = null

class DesignerMode {

  constructor() {

    this._activePane = null

  }

  canvasMouseMoveListener(e) { }

  canvasMouseDownListener(e) { }

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

  clearWorld() {

    let mapWidth = d.getMapWidth()
    let mapHeight = d.getMapHeight()
    let blockSize = d.getBlockSize()

    d.blocks = []
    d.buildings = []

    for (let y = 0; y < mapHeight; y += blockSize) {

      for (let x = 0; x < mapWidth; x += blockSize) {

        d.blocks.push(0)
        d.buildings.push(0)

      }

    }

  }

  generateWorld() {

    // TODO
    // - if the map is smaller than the device dimensions, things get weird

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

    console.log('map', `${mapWidth}px x ${mapHeight}px (${blocksPerCol} blocks x ${blocksPerRow} blocks)`)
//    console.log('blocksPerRow', blocksPerRow)
//    console.log('blocksPerCol', blocksPerCol)
//    console.log('blockSize', blockSize)
//    console.log('totalBlocks', totalBlocks)
//    console.log('chunkSize', chunkSize)
//    console.log('blocksPerChunk', blocksPerChunk)
//    console.log('chunksPerWidth', chunksPerWidth)
//    console.log('chunksPerHeight', chunksPerHeight)

    // validate map dimensions

    if (
      !Number.isInteger(chunksPerWidth) ||
      !Number.isInteger(chunksPerHeight)
    ) {
      console.log('map-dimensions:chunk-size ratio not an absolute value')
      return;
    }

    // start with an empty map...

    this.clearWorld()

    // now go through and place chunks of blocks on the map...

    let biomeTypes = BiomeDictionary.getTypes()

    let chunkX = null
    let chunkY = 0

    let deltaX = null
    let deltaY = null

    for (let y = 0; y < chunksPerHeight; y++) {

      chunkX = 0

      for (let x = 0; x < chunksPerWidth; x++) {

        let randomBiomeType = biomeTypes[Math.floor(Math.random()*biomeTypes.length)]

//        console.log('-chunk', chunkX, chunkY, randomBlockType)

        deltaY = 0
        deltaX = x

        let deltasForChunk = []

        for (let i = 0; i < blocksPerChunk; i++) {

          if (i && i % chunkSize == 0) { // new row
            deltaY++
            deltaX = x
          }

          let delta = (i % chunkSize) + (deltaY * blocksPerRow) + (y * blocksPerRow * chunkSize) + (x * chunkSize)

          deltasForChunk.push(delta)

          deltaX++

        }

        for (let i = 0; i < deltasForChunk.length; i++) {
          let delta = deltasForChunk[i]
          let randomBlockType = BiomeDictionary.getFlubber(randomBiomeType)
          let block = d.create('block', randomBlockType)
          d.blocks[delta] = block.id
          block.delta = delta
        }

        // TODO track the deltas above, and send them off to the biome "builder"

        chunkX++

      }

      chunkY++

    }

  }

}
