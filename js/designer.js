// CANVAS & CONTEXT

let canvas = null
let c = null

let BLOCK_DEFAULT_HARDNESS = 100

// TODO we should put our globals in the "d" namespace, e.g. d.keys, d.mouse, etc

// KEYS

const keys = {

  // player
  up: {
    pressed: false
  },
  down: {
    pressed: false
  },
  left: {
    pressed: false
  },
  right: {
    pressed: false
  },

  // camera
  cameraUp: {
    pressed: false
  },
  cameraDown: {
    pressed: false
  },
  cameraLeft: {
    pressed: false
  },
  cameraRight: {
    pressed: false
  }

}

// MOUSE

const mouse = {

  left: {
    pressed: false,
    timer: new StopWatch(),
    interval: null
  },

  right: {
    pressed: false,
    timer: new StopWatch(),
    interval: null
  }

}

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
let dGame = null
let dMenu = null
let dPlayback = null
let dMode = null
let dPlayer = null
let dCamera = null
let dStorage = null
let dBlocks = null
let dBuildings = null
let dItems = null

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
let paintModeBlockSolidCheckbox = null

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

let mapWidthInput = document.querySelector('#mapWidth')
let mapHeightInput = document.querySelector('#mapHeight')
let blocksPerRowInput = document.querySelector('#blocksPerRow')
let blocksPerColInput = document.querySelector('#blocksPerCol')

let canvasMouseCoordsBadge = document.querySelector('#canvasMouseCoords')

addEventListener('load', function() {

  // CANVAS

  canvas = document.getElementById("biome")
  c = canvas.getContext("2d")

  // disable right click on canvas
  canvas.oncontextmenu = function(e) {
    e.preventDefault()
    e.stopPropagation()
  }

  // DESIGNER

  d = new Designer()

  dStorage = new DesignerStorage()

  dGame = new DesignerGame()

  dMenu = new DesignerMenu()

  dPlayback = new DesignerPlayback()

  dMode = new DesignerMode()

  dPlayer = new DesignerPlayer()

  dCamera = new DesignerCamera()
  dCamera.load()

  dBlocks = new DesignerBlocks()

  dBuildings = new DesignerBuildings()

  dItems = new DesignerItems()

  playerMode = new PlayerMode()

  // set playback
  d.setPlayback('pause')

  // set mode
  d.setMode('toolbar:select')

  // set the active pane for the mode
//  dMode.setActivePane(selectModePane)

  // set screen resolution

  let screenWidth = window.innerWidth
    || document.documentElement.clientWidth
    || document.body.clientWidth

  let screenHeight = window.innerHeight
    || document.documentElement.clientHeight
    || document.body.clientHeight

  let headerHeight = document.getElementById('d-menu').clientHeight
  let footerHeight = document.querySelector('footer').clientHeight
  let canvasHeight = screenHeight - (headerHeight + footerHeight)

//  console.log('screenWidth', screenWidth)
//  console.log('screenHeight', screenHeight)
//  console.log('headerHeight', headerHeight)
//  console.log('footerHeight', footerHeight)
//  console.log('canvasHeight', canvasHeight)

  d.setScreenResolution(screenWidth, canvasHeight)

//  let resolution = screenResolutionMap[screenResolutionSelect.value]
//  d.setScreenResolution(resolution.w, resolution.h)
//  d.setScreenResolution(innerWidth, innerHeight) // full screen

  // set block size
  d.setBlockSize(parseInt(blockSizeInput.value))

  // set grid
  d.setGrid(true)

  // set map dimensions
  d.setMapWidth(parseInt(mapWidthInput.value))
  d.setMapHeight(parseInt(mapWidthInput.value))

  blocksPerRowInput.value = d.blocksPerRow()
  blocksPerColInput.value = d.blocksPerCol()

  // PLAYER

  player = new Player({
    name: 'Tyler',
    x: 576 + 8,
    y: 256 + 4
  })
//  player.belt.add(new Axe({}))
//  player.belt.setActiveItem(0)
  player.load()
  players.push(player)

  // NPCs

  // TODO
  // - can't get rid of static id values here until we're dynamically saving/loading npcs

//  let npcLoan = new Villager({
//    id: 'Loan',
//    name: 'Loan',
//    x: player.x + 72,
//    y: player.y - 28,
//    color: 'yellow'
//  })
//  saveVillager(npcLoan)
//
//  let npcAvalina = new Villager({
//    id: 'Avalina',
//    name: 'Avalina',
//    x: player.x + 16,
//    y: player.y - 121,
//    color: 'pink'
//  })
//  saveVillager(npcAvalina)
//
//  let npcMelvin = new Villager({
//    id: 'Melvin',
//    name: 'Melvin',
//    x: player.x - 92,
//    y: player.y - 92,
//    color: 'red'
//  })
//  saveVillager(npcMelvin)

  // EVENT LISTENERS

  // designer menu buttons
  for (var i = 0; i < designerMenuBtns.length; i++) {
    designerMenuBtns[i].addEventListener('click', function(e) {
      let op = this.getAttribute('data-op')
      dMenu.onclick(e, op)
      return false
    })
  }

  // designer playback buttons
  for (var i = 0; i < playbackBtns.length; i++) {
    playbackBtns[i].addEventListener('click', function() {
      dPlayback.btnOnclickListener(this)
    })
  }

  // camera: movement
  cameraMoveUpBtn.addEventListener('click', function() { dCamera.move('up') })
  cameraMoveDownBtn.addEventListener('click', function() { dCamera.move('down') })
  cameraMoveLeftBtn.addEventListener('click', function() { dCamera.move('left') })
  cameraMoveRightBtn.addEventListener('click', function() { dCamera.move('right') })

  // player: movement
  playerMoveUpBtn.addEventListener('mousedown', function() { keys.up.pressed = true })
  playerMoveUpBtn.addEventListener('mouseup', function() { keys.up.pressed = false })
  playerMoveDownBtn.addEventListener('mousedown', function() { keys.down.pressed = true })
  playerMoveDownBtn.addEventListener('mouseup', function() { keys.down.pressed = false })
  playerMoveLeftBtn.addEventListener('mousedown', function() { keys.left.pressed = true })
  playerMoveLeftBtn.addEventListener('mouseup', function() { keys.left.pressed = false })
  playerMoveRightBtn.addEventListener('mousedown', function() { keys.right.pressed = true })
  playerMoveRightBtn.addEventListener('mouseup', function() { keys.right.pressed = false })

  // screen resolution
  screenResolutionSelect.addEventListener('change', function() {
    let resolution = screenResolutionMap[this.value]
    d.setScreenResolution(resolution.w, resolution.h)
  })

  // block size
  blockSizeInput.addEventListener('change', function() {
    d.setBlockSize(parseInt(this.value))
    refresh()
  })

  // map width
  mapWidthInput.addEventListener('change', function() {
    d.setMapWidth(parseInt(this.value))
  })

  // map height number
  mapHeightInput.addEventListener('change', function() {
    d.setMapHeight(parseInt(this.value))
  })

  // canvas mousemove
  canvas.addEventListener("mousemove", function(e) {
    d.canvasMouseMoveListener(e)
  })

  // canvas mousedown
  canvas.addEventListener('mousedown', function(e) {
    d.canvasMouseDownListener(e)
  })

  // canvas mouseup
  canvas.addEventListener("mouseup", function(e) {
    d.canvasMouseUpListener(e)
  })

  // canvas wheel
  canvas.addEventListener('wheel', function(e) {
    d.canvasMouseWheelListener(e)
  }, false)

//  canvas.addEventListener("mouseover", canvasMouseOver);
//
//  canvas.addEventListener("mouseout", canvasMouseOut);

  // KEY DOWN

  addEventListener('keydown', ({ keyCode } ) => {

//    console.log('keydown', keyCode)

    switch (keyCode) {

      // CAMERA

      // up (arrow)
      case 38:
        keys.cameraUp.pressed = true
        dCamera.move('up')
        dCamera.save()
        break

      // down (arrow)
      case 40:
        keys.cameraDown.pressed = true
        dCamera.move('down')
        dCamera.save()
        break

      // left (arrow)
      case 37:
        keys.cameraLeft.pressed = true
        dCamera.move('left')
        dCamera.save()
        break

      // right (arrow)
      case 39:
        keys.cameraRight.pressed = true
        dCamera.move('right')
        dCamera.save()
        break

    }

    // PAUSED...

    if (d.isPaused()) {

      // play (SPACE)
      if (keyCode == 32) {
        playBtn.click();
      }

    }
    else {

      // PLAYING...

      switch (keyCode) {

        // pause (SPACE)
        case 32: pauseBtn.click(); break

        // PLAYER

        // up (W)
        case 87: keys.up.pressed = true; break

        // down (A)
        case 83: keys.down.pressed = true; break

        // left (S)
        case 65: keys.left.pressed = true; break

        // right (D)
        case 68: keys.right.pressed = true; break

        // BELT

        // 1, 2, 3, ..., 0
        case 49: player.changeActiveBeltButton(0); break; // 1
        case 50: player.changeActiveBeltButton(1); break; // 2
        case 51: player.changeActiveBeltButton(2); break; // 3
        case 52: player.changeActiveBeltButton(3); break; // 4
        case 53: player.changeActiveBeltButton(4); break; // 5
        case 54: player.changeActiveBeltButton(5); break; // 6
        case 55: player.changeActiveBeltButton(6); break; // 7
        case 56: player.changeActiveBeltButton(7); break; // 8
        case 57: player.changeActiveBeltButton(8); break; // 9
        case 48: player.changeActiveBeltButton(9); break; // 0

      }

    }

  });

  // KEY UP

  addEventListener('keyup', ({ keyCode }) => {

    switch (keyCode) {

      // CAMERA

      // up (arrow)
      case 38: keys.cameraUp.pressed = false; break

      // down (arrow)
      case 40: keys.cameraDown.pressed = false; break

      // left (arrow)
      case 37: keys.cameraLeft.pressed = false; break

      // right (arrow)
      case 39: keys.cameraRight.pressed = false; break

    }

    if (d.isPaused()) {

    }
    else {

      switch (keyCode) {

        // PLAYER

        // up (W)
        case 87: keys.up.pressed = false; break

        // down (S)
        case 83: keys.down.pressed = false; break

        // left (A)
        case 65: keys.left.pressed = false; break

        // right (D)
        case 68: keys.right.pressed = false; break

      }

    }

  });

  d.init()

  draw()

})

function update() {

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

  c.clearRect(0, 0, canvas.width, canvas.height);

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

  // update, draw, animate (if playing)
  update()
  draw()
  if (d.isPlaying()) {
    requestAnimationFrame(animate);
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
