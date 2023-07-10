// CANVAS & CONTEXT

let canvas = null
let c = null

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

// Block Types

let blockTypesDict = {
  'BlueberryBush': BlueberryBush,
  'Grass': Grass,
  'Sand': Sand,
  'Stone': Stone,
  'Water': Water
}
let blockTypes = []
for (var type in blockTypesDict) {
  if (!blockTypesDict.hasOwnProperty(type)) { continue; }
  blockTypes.push(type)
}

// Designer

let d = null
let dMenu = null
let dPlayback = null
let dMode = null
let dPlayer = null
let dCamera = null
let dStorage = null

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

// designer menu

let designerMenuBtns = document.querySelectorAll('#d-menu .d-menu-op')

// designer playback

let playbackBtnsContainer = document.querySelector('#playbackBtns')
let playbackBtns = playbackBtnsContainer.querySelectorAll('button')
let pauseBtn = playbackBtnsContainer.querySelector('button[data-playback="pause"]')
let playBtn = playbackBtnsContainer.querySelector('button[data-playback="play"]')

// designer mode

let designerModeBtnsContainer = document.querySelector('#designerModeBtns')
let designerModeBtns = designerModeBtnsContainer.querySelectorAll('button')

let selectModePane = document.querySelector('#designerModePanes div[data-mode="select"]')
let paintModePane = document.querySelector('#designerModePanes div[data-mode="paint"]')
let cameraModePane = document.querySelector('#designerModePanes div[data-mode="camera"]')
let mapModePane = document.querySelector('#designerModePanes div[data-mode="map"]')
let displayModePane = document.querySelector('#designerModePanes div[data-mode="display"]')

let paintModeBlockTypeSelect = document.querySelector('#paintModeBlockTypeSelect')
let paintModeBlockSolidCheckbox = document.querySelector('#paintModeBlockSolidCheckbox')


let cameraMoveUpBtn = document.querySelector('#cameraMoveUpBtn')
let cameraMoveDownBtn = document.querySelector('#cameraMoveDownBtn')
let cameraMoveLeftBtn = document.querySelector('#cameraMoveLeftBtn')
let cameraMoveRightBtn = document.querySelector('#cameraMoveRightBtn')

let playerMoveUpBtn = document.querySelector('#playerMoveUpBtn')
let playerMoveDownBtn = document.querySelector('#playerMoveDownBtn')
let playerMoveLeftBtn = document.querySelector('#playerMoveLeftBtn')
let playerMoveRightBtn = document.querySelector('#playerMoveRightBtn')

let blockSizeInput = document.querySelector('#blockSize')
let showGridInput = document.querySelector('#showGrid')

let mapWidthInput = document.querySelector('#mapWidth')
let mapHeightInput = document.querySelector('#mapHeight')
let blocksPerRowInput = document.querySelector('#blocksPerRow')
let blocksPerColInput = document.querySelector('#blocksPerCol')

let canvasMouseCoordsBadge = document.querySelector('#canvasMouseCoords')

addEventListener('load', function() {

  // CANVAS

  canvas = document.getElementById("biome")
  c = canvas.getContext("2d")

  // DESIGNER

  d = new Designer()

  dStorage = new DesignerStorage()

  dMenu = new DesignerMenu()

  dPlayback = new DesignerPlayback()

  dMode = new DesignerMode()

  dPlayer = new DesignerPlayer()

  dCamera = new DesignerCamera()
  dCamera.load()

  // set playback
  d.setPlayback('pause')

  // set mode
  d.setMode('select')

  // set the active pane for the mode
  dMode.setActivePane(selectModePane)

  // paint mode: block type
  for (var i = 0; i < blockTypes.length; i++) {
    var option = document.createElement('option');
    option.value = blockTypes[i];
    option.innerHTML = blockTypes[i];
    paintModeBlockTypeSelect.appendChild(option);
  }
  d.setPaintModeBlockType(paintModeBlockTypeSelect.options[0].value)

  // set screen resolution
  let resolution = screenResolutionMap[screenResolutionSelect.value]
  d.setScreenResolution(resolution.w, resolution.h)
//  d.setScreenResolution(innerWidth, innerHeight) // full screen

  // set block size
  d.setBlockSize(parseInt(blockSizeInput.value))

  // set grid
  d.setGrid(showGridInput.checked)

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

  player.load()

  players.push(player)

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

  // designer mode buttons
  for (var i = 0; i < designerModeBtns.length; i++) {
    designerModeBtns[i].addEventListener('click', function() {
      dMode.btnOnclickListener(this)
    })
  }

  // paint mode: block type
  paintModeBlockTypeSelect.addEventListener('change', function() {
    d.setPaintModeBlockType(this.value)
  })

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

  // show grid
  showGridInput.addEventListener('change', function() {
    d.setGrid(this.checked)
    refresh()
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

    switch (keyCode) {

      // CAMERA

      // up (W)
      case 87:
        keys.cameraUp.pressed = true
        dCamera.move('up')
        dCamera.save()
        break

      // down (S)
      case 83:
        keys.cameraDown.pressed = true
        dCamera.move('down')
        dCamera.save()
        break

      // left (A)
      case 65:
        keys.cameraLeft.pressed = true
        dCamera.move('left')
        dCamera.save()
        break

      // right (D)
      case 68:
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

        // up (arrow)
        case 38: keys.up.pressed = true; break

        // down (arrow)
        case 40: keys.down.pressed = true; break

        // left (arrow)
        case 37: keys.left.pressed = true; break

        // right (arrow)
        case 39: keys.right.pressed = true; break

      }

    }

  });

  // KEY UP

  addEventListener('keyup', ({ keyCode }) => {

    switch (keyCode) {

      // CAMERA

      // up (W)
      case 87: keys.cameraUp.pressed = false; break

      // down (S)
      case 83: keys.cameraDown.pressed = false; break

      // left (A)
      case 65: keys.cameraLeft.pressed = false; break

      // right (D)
      case 68: keys.cameraRight.pressed = false; break

    }

    if (d.isPaused()) {

    }
    else {

      switch (keyCode) {

        // PLAYER

        // up (arrow)
        case 38: keys.up.pressed = false; break

        // down (arrow)
        case 40: keys.down.pressed = false; break

        // left (arrow)
        case 37: keys.left.pressed = false; break

        // right (arrow)
        case 39: keys.right.pressed = false; break

      }

    }

  });

  d.init()

  draw()

})

// TODO use these instead of smushing the code in Designer.js
// - keeps the class clean
// - wouldn't need things in the animation loop to declare a function to call a function

function update() {

  // player(s)...
  for (let i = 0; i < players.length; i++) {

    // begin: collision detection...

    // reset player colission states
    players[i].resetCollisionStates()

    // player + block

    // TODO the problem seems to be we're detecting the collision after it takes place, instead of just before it!

    let playerBlockDeltas = players[i].getBlockDeltasFromPosition()
    if (playerBlockDeltas.length) {
      for (let j = 0; j < playerBlockDeltas.length; j++) {
        d.blocks[playerBlockDeltas[j]].handleCollisionWithPlayer(players[i])
      }
    }

    // end: collision detection

    players[i].update()

  }

}

function draw() {

  c.clearRect(0, 0, canvas.width, canvas.height);

  // blocks

  let startX = dCamera.x()
  let startY = dCamera.y()
  let endX = startX + d.blocksPerScreenRow()
  let endY = startY + d.blocksPerScreenCol()

  let blockDelta = null
  let block = null

  let yCameraDelta = 0
  let xCameraDelta = 0

  for (var y = startY; y < endY; y++) {

    xCameraDelta = 0

    for (var x = startX; x < endX; x++) {

      blockDelta = d.getBlockDeltaFromPos(x, y)

      block = d.blocks[blockDelta]

      // debug
//      console.log(`${x},${y} => ` + blockDelta)

      // If the block exists...
      if (block) {

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
      if (d.getMouseBlockDelta() == blockDelta) {
        c.beginPath()
        c.strokeStyle = 'rgba(0,0,0,1)';
        c.rect(x * d.getBlockSize(), y * d.getBlockSize(), d.getBlockSize(), d.getBlockSize());
        c.stroke();
      }

      xCameraDelta++

    }

    yCameraDelta++

//    console.log('-------------------------')

  }

//  console.log(`${startX},${startY} => ${endX},${endY}`)

  // player
  for (let i = 0; i < players.length; i++) {
    players[i].draw()
  }

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
