// CANVAS & CONTEXT

let canvas = null
let c = null

let BLOCK_DEFAULT_HARDNESS = 100
let BELT_SIZE = 10

// DEFAULT CONFIGURATION

// mouse coordinate offsets
// - adjust the canvas' reported mouse coordinates
//   (e.g. canvas inside a bs5 row+col reports inaccurate mouse x, y)
let canvasMouseOffsetX = 0 // (int) offset the mouse x coordinate on the canvas
let canvasMouseOffsetY = 0 // (int) offset the mouse y coordinate on the canvas

// CUSTOM CONFIGURATION

// mouse coordinate offsets
canvasMouseOffsetX = -2
canvasMouseOffsetY = -2

// END: CONFIGURATION

// Designer

let d = null
let dCanvas = null
let dMouse = null
let dKeyboard = null
let game = null
let dMenu = null
let dPlayback = null
let dMode = null
let dPlayer = null
let dInventory = null
let dCamera = null
let dStorage = null
let dBlocks = null
let dBuildings = null
let dItems = null
let dBuild = null

let playerMode = null

// supported screen resolutions
let screenResolutionSelect = document.querySelector('#screenResolution')
let screenResolutionMap = {
  '720p': {
    w: 1280,
    h: 720
  },
  '1080p': {
    w: 1920,
    h: 1080
  },
  '1024x768': {
    w: 1024,
    h: 768
  }
}

// DOM ELEMENTS

let designerMenuBtns = document.querySelectorAll('#d-menu .d-menu-op')

let playbackBtnsContainer = document.querySelector('#playbackBtns')
let playbackBtns = playbackBtnsContainer.querySelectorAll('button')
let pauseBtn = playbackBtnsContainer.querySelector('button[data-playback="pause"]')
let playBtn = playbackBtnsContainer.querySelector('button[data-playback="play"]')

let paintModeBlockTypeSelect = null

let cameraMoveUpBtn = document.querySelector('#cameraMoveUpBtn')
let cameraMoveDownBtn = document.querySelector('#cameraMoveDownBtn')
let cameraMoveLeftBtn = document.querySelector('#cameraMoveLeftBtn')
let cameraMoveRightBtn = document.querySelector('#cameraMoveRightBtn')

let cameraCoordinatesBadge = document.getElementById('cameraCoordinatesBadge')

let playerMoveUpBtn = document.querySelector('#playerMoveUpBtn')
let playerMoveDownBtn = document.querySelector('#playerMoveDownBtn')
let playerMoveLeftBtn = document.querySelector('#playerMoveLeftBtn')
let playerMoveRightBtn = document.querySelector('#playerMoveRightBtn')

let blockSizeInput = document.querySelector('#blockSize')
let chunkSizeInput = document.querySelector('#chunkSize')

let mapWidthInput = document.querySelector('#mapWidth')
let mapHeightInput = document.querySelector('#mapHeight')
let blocksPerRowInput = document.querySelector('#blocksPerRow')
let blocksPerColInput = document.querySelector('#blocksPerCol')

let canvasMouseCoordsBadge = document.querySelector('#canvasMouseCoords')

addEventListener('load', function() {

  // INIT

  d = new Designer()

  dCanvas = new DesignerCanvas()
  dCanvas.init()

  dMouse = new DesignerMouse()
  dKeyboard = new DesignerKeyboard()

  dStorage = new DesignerStorage()

  game = new Game()

  dMenu = new DesignerMenu()

  dPlayback = new DesignerPlayback()

  dMode = new DesignerMode()

  dPlayer = new DesignerPlayer()

  dInventory = new DesignerInventory()

  dCamera = new DesignerCamera()
  dCamera.load()

  dBlocks = new DesignerBlocks()

  dBuildings = new DesignerBuildings()

  dItems = new DesignerItems()

  dBuild = new DesignerBuild()
  dBuild.setEntityType('block')

  playerMode = new PlayerMode()

  // set playback
  d.setPlayback('pause')

  // set mode
  d.setMode('toolbar:select')

  // set the active pane for the mode
//  dMode.setActivePane(selectModePane)

  d.initScreenResolution()

  // set block size
  d.setBlockSize(parseInt(blockSizeInput.value))

  // set chunk size
  d.setChunkSize(parseInt(chunkSizeInput.value))

  // set grid
  d.setGrid(true)

  // set map dimensions
  d.setMapWidth(parseInt(mapWidthInput.value))
  d.setMapHeight(parseInt(mapWidthInput.value))

  blocksPerRowInput.value = d.blocksPerRow()
  blocksPerColInput.value = d.blocksPerCol()

  // initialize some components...

  dMouse.init()
  dKeyboard.init()
  dMenu.init()
  dPlayback.init()
  dCamera.init()
  dPlayer.init()

  // EVENT LISTENERS

  // block size
  blockSizeInput.addEventListener('change', function() {
    d.setBlockSize(parseInt(this.value))
    console.log('block size changed!')
//    refresh()
  })

  // chunk size
  chunkSizeInput.addEventListener('change', function() {
    d.setChunkSize(parseInt(this.value))
    console.log('chunk size changed!')
//    refresh()
  })

  // map width
  mapWidthInput.addEventListener('change', function() {
    d.setMapWidth(parseInt(this.value))
  })

  // map height number
  mapHeightInput.addEventListener('change', function() {
    d.setMapHeight(parseInt(this.value))
  })

  // KEY DOWN

  addEventListener('keydown', dKeyboard.keydown);

  // KEY UP

  addEventListener('keyup', dKeyboard.keyup);

  d.init()

  draw()

})

function update() {

  game.tick()

  game.applySunshine()

  // player(s)...
  for (let i = 0; i < players.length; i++) {

    // begin: collision detection...

    // reset player colission states
    players[i].resetCollisionStates()

    // player + block

    let playerBlockDeltas = players[i].getBlockDeltasFromPosition()
    let id = null
    let block = null
    if (playerBlockDeltas.length) {
      for (let j = 0; j < playerBlockDeltas.length; j++) {
        blockId = d.blocks[playerBlockDeltas[j]]
        if (!blockId) { continue }
        block = d.getBlock(blockId)
        block.handleCollisionWithPlayer(players[i])
      }
    }

    // end: collision detection

    players[i].update()

  }

  // npc(s)...
  if (d.hasNpcs()) {
    let npcs = d.getNpcs()
    for (let id in npcs) {
      if (!npcs.hasOwnProperty(id)) { continue }
      npcs[id].update()
    }
  }

  // block(s)...
  for (let i = 0; i < d.blocks.length; i++) {

    if (d.blocks[i]) {
      d.block(i).update()
    }

  }

  // building(s)...
  for (let i = 0; i < d.buildings.length; i++) {

    if (d.buildings[i]) {
      d.building(i).update()
    }

  }

}

function draw() {

  c.clearRect(0, 0, canvas.width, canvas.height)

  c.globalAlpha = game.getGlobalAlpha()

  // blocks

  let startX = dCamera.x()
  let startY = dCamera.y()
  let endX = startX + d.blocksPerScreenRow()
  let endY = startY + d.blocksPerScreenCol()

  let delta = null
  let block = null
  let building = null

  let yCameraDelta = 0
  let xCameraDelta = 0

  for (var y = startY; y < endY; y++) {

    xCameraDelta = 0

    for (var x = startX; x < endX; x++) {

      delta = d.getBlockDeltaFromPos(x, y)

      // debug
//      console.log(`${x},${y} => ` + delta)

      // If the block exists...
      if (d.blocks[delta]) {

        block = d.block(delta)

        block.draw(xCameraDelta, yCameraDelta)

        // selected block highlight effect
        if (block.selected) {
          c.save()
          c.beginPath()
          c.lineWidth = 2;
          c.strokeStyle = 'rgba(0,0,0,1)'
          c.rect(xCameraDelta * d.getBlockSize(), yCameraDelta * d.getBlockSize(), d.getBlockSize(), d.getBlockSize())
          c.stroke()
          c.restore()
        }

      }

      // block mouse hover effect
      if (d.getMouseBlockDelta() == delta) {
        c.beginPath()
        c.strokeStyle = 'rgba(0,0,0,1)';
        c.rect(x * d.getBlockSize(), y * d.getBlockSize(), d.getBlockSize(), d.getBlockSize());
        c.stroke();
      }

      // If the building exists...
      if (d.buildings[delta]) {

        building = d.building(delta)

        building.draw(xCameraDelta, yCameraDelta)

      }

      xCameraDelta++

    }

    yCameraDelta++

//    console.log('-------------------------')

  }

//  console.log(`${startX},${startY} => ${endX},${endY}`)

  // grid
  if (d.showGrid()) {
    c.strokeStyle = 'rgba(0,0,0,0.2)';
    for (var y = 0; y < canvas.height; y+= d.getBlockSize()) {
      for (var x = 0; x < canvas.width; x += d.getBlockSize()) {
        c.beginPath()
        c.rect(x, y, d.getBlockSize(), d.getBlockSize())
        c.stroke()
      }
    }
  }

  // player(s)
  for (let i = 0; i < players.length; i++) {
    players[i].draw()
  }

  // npc(s)
  if (d.hasNpcs()) {
    let npcs = d.getNpcs()
    for (let id in npcs) {
      if (!npcs.hasOwnProperty(id)) { continue }
      npcs[id].draw()
    }
  }

}

function animate() {

  update()

  draw()

  // if playing, animate...
  if (d.isPlaying()) {

    // @see DesignerPlayback
    requestAnimationFrame(animate)

  }

}

function refresh() {
  if (d.isPaused()) {
    draw();
  }
}

// UTILITIES

function getCanvasMouseCoords(evt) {
  const rect = canvas.getBoundingClientRect()
  const x = Math.floor(evt.clientX - rect.left) + canvasMouseOffsetX
  const y = evt.clientY - rect.top + canvasMouseOffsetY
  return {
    x,
    y
  }
}

function getCanvasMouseCoordsWithCameraOffset(evt) {
  let coords = getCanvasMouseCoords(evt)
  return {
    x: coords.x + dCamera.xOffset(),
    y: coords.y + dCamera.yOffset()
  }
}

function getBtnFromEvent(e) {
  let btn = e.target
  while (btn && btn.tagName != 'BUTTON') { btn = btn.parentNode }
  return btn.tagName == 'BUTTON' ? btn : null
}

function getAnchorFromEvent(e) {
  let anchor = e.target
  while (anchor && anchor.tagName != 'A') { anchor = anchor.parentNode }
  return anchor.tagName == 'A' ? anchor : null
}
