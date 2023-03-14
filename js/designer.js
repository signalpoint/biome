// CANVAS & CONTEXT

let canvas = null
let c = null

// KEYS

const keys = {
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

// designer mode

let designerModeBtnsContainer = document.querySelector('#designerModeBtns')
let designerModeBtns = designerModeBtnsContainer.querySelectorAll('button')
let paintModeBlockTypeSelect = document.querySelector('#paintModeBlockTypeSelect')

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
  dMenu = new DesignerMenu()
  dPlayback = new DesignerPlayback()
  dMode = new DesignerMode()
  dPlayer = new DesignerPlayer()
  dStorage = new DesignerStorage()

  // set playback
  d.setPlayback('pause')

  // set mode
  d.setMode('select')

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

    if (d.isPaused()) { return }

    switch (keyCode) {

      // UP
      case 87: // (W)
      case 38: // (up arrow)

        keys.up.pressed = true

        break

      // DOWN
      case 83: // (S)
      case 40: // (down arrow)

        keys.down.pressed = true

        break

      // LEFT
      case 65: // (A)
      case 37: // (left arrow)

        keys.left.pressed = true

        break

      // RIGHT
      case 68: // (D)
      case 39: // (right arrow)

        keys.right.pressed = true

        break

    }

  });

  // KEY UP

  addEventListener('keyup', ({ keyCode }) => {

    if (d.isPaused()) { return }

    switch (keyCode) {

      // UP
      case 87: // (W)
      case 38: // (up arrow)

        keys.up.pressed = false

        break

      // DOWN
      case 83: // (S)
      case 40: // (down arrow)

        keys.down.pressed = false

        break

      // LEFT
      case 65: // (A)
      case 37: // (left arrow)

        keys.left.pressed = false

        break

      // RIGHT
      case 68: // (D)
      case 39: // (right arrow)

        keys.right.pressed = false

        break

    }

  });

  d.init()

  draw()

})

// TODO use these instead of smushing the code in Designer.js
// - keeps the class clean
// - wouldn't need things in the animation loop to declare a function to call a function

function update() {

  // player
  for (let i = 0; i < players.length; i++) {
    players[i].update()
  }

}

function draw() {

  c.clearRect(0, 0, canvas.width, canvas.height);

  // TODO only draw the blocks that are visible on the canvas; instead of all the blocks!

  // blocks
  let startX = 0 // this will change as viewport changes
  let startY = 0 // this will change as viewport changes
  let blockDelta = null
  let block = null

  for (var y = startY; y < d.blocksPerScreenCol(); y++) {

    for (var x = startX; x < d.blocksPerScreenRow(); x++) {

      blockDelta = d.getBlockDeltaFromPos(x, y)
      block = d.blocks[blockDelta]

      // If the block exists...
      if (block) {

        block.draw(x, y)

      }

      // block mouse hover effect
      if (d.getMouseBlockDelta() == blockDelta) {
        c.beginPath()
        c.strokeStyle = 'rgba(0,0,0,1)';
        c.rect(x * d.getBlockSize(), y * d.getBlockSize(), d.getBlockSize(), d.getBlockSize());
        c.stroke();
      }

    }

  }

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
