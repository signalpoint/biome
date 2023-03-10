// CANVAS & CONTEXT

let canvas = null
let c = null

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

// designer mode

let designerModeBtnsContainer = document.querySelector('#designerModeBtns')
let designerModeBtns = designerModeBtnsContainer.querySelectorAll('button')

let blockSizeInput = document.querySelector('#blockSize')
let showGridInput = document.querySelector('#showGrid')

let mapWidthInput = document.querySelector('#mapWidth')
let mapHeightInput = document.querySelector('#mapHeight')

let canvasMouseCoordsBadge = document.querySelector('#canvasMouseCoords')

addEventListener('load', function() {

  // CANVAS

  canvas = document.getElementById("biome")
  c = canvas.getContext("2d")

  d = new Designer()

  // set mode
  d.setMode('select')

  // set screen resolution
  let resolution = screenResolutionMap[screenResolutionSelect.value]
  d.setScreenResolution(resolution.w, resolution.h)

  // set block size
  d.setBlockSize(parseInt(blockSizeInput.value))

  // set grid
  d.setGrid(showGridInput.checked)

  // set map dimensions
  d.setMapWidth(parseInt(mapWidthInput.value))
  d.setMapHeight(parseInt(mapWidthInput.value))

  // event listeners...

  // designer mode buttons
  for (var i = 0; i < designerModeBtns.length; i++) {
    designerModeBtns[i].addEventListener('click', function() {

      let mode = this.getAttribute('data-mode')

      // swap active class on buttons
      designerModeBtnsContainer.querySelector('button.active').classList.remove('active')
      this.classList.add('active')

      // swap the panes...

      let activePane = document.querySelector('.designerModePane.active')
      activePane.classList.remove('active')
      activePane.classList.add('d-none')

      let chosenPane = document.querySelector('.designerModePane[data-mode="' + mode + '"]')
      chosenPane.classList.add('active')
      chosenPane.classList.remove('d-none')

      // udpate the mode
      d.setMode(mode)

    })
  }

  // screen resolution
  screenResolutionSelect.addEventListener('change', function() {
    let resolution = screenResolutionMap[this.value]
    d.setScreenResolution(resolution.w, resolution.h)
  })

  // block size
  blockSizeInput.addEventListener('change', function() {
    d.setBlockSize(parseInt(this.value))
    d.draw()
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
    d.draw()
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

  d.init()

  d.draw()

})

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
