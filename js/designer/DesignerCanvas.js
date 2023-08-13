class DesignerCanvas {

  constructor() {

  }

  init() {

    let self = this

    canvas = document.getElementById("biome")
    c = canvas.getContext("2d")

    // disable right click on canvas
    canvas.oncontextmenu = function(e) {
      e.preventDefault()
      e.stopPropagation()
    }

    // canvas mousemove
    canvas.addEventListener("mousemove", function(e) {
      self.mouseMoveListener(e)
    })

    // canvas mousedown
    canvas.addEventListener('mousedown', function(e) {
      self.mouseDownListener(e)
    })

    // canvas mouseup
    canvas.addEventListener("mouseup", function(e) {
      self.mouseUpListener(e)
    })

    // canvas wheel
    canvas.addEventListener('wheel', function(e) {
      self.mouseWheelListener(e)
    }, false)

//  canvas.addEventListener("mouseover", canvasMouseOver)
//  canvas.addEventListener("mouseout", canvasMouseOut)

  }

  // CANVAS MOUSE EVENT LISTENERS

  // move
  mouseMoveListener(e) {

    let coords = getCanvasMouseCoords(e)

    d.setMouseX(coords.x)
    d.setMouseY(coords.y)

    // show mouse x,y coords

    canvasMouseCoordsBadge.innerHTML = coords.x + ',' + coords.y

    let blockDelta = d.getBlockDelta(coords.x, coords.y)

    if (blockDelta != d.getMouseBlockDelta()) {

      d.setMouseBlockDelta(blockDelta)

    }

    d.isPlaying() ? playerMode.canvasMouseMoveListener(e) : dMode.canvasMouseMoveListener(e)

  }

  // mouse down
  mouseDownListener(e) {

    let pos = getCanvasMouseCoords(e)
    let delta = d.getBlockDelta(pos.x + dCamera.xOffset(), pos.y + dCamera.yOffset())

    d.setMouseDownCoords(pos)
    d.setMouseDownBlockDelta(delta)

    let block = d.getMouseDownBlock()

    if (e.which == 1) {
      mouse.left.pressed = 1
      mouse.left.timer.start()
      mouse.left.interval = setInterval(
        d.isPlaying() ? playerMode.canvasMouseDownHoldListener : dMode.canvasMouseDownHoldListener,
        block ? block.hardness : BLOCK_DEFAULT_HARDNESS, // hardness => interval in ms
        e
      )
    }
    if (e.which == 3) {
      mouse.right.pressed = 1
      mouse.right.timer.start()
      mouse.right.interval = setInterval(
        d.isPlaying() ? playerMode.canvasMouseDownHoldListener : dMode.canvasMouseDownHoldListener,
        block ? block.hardness : BLOCK_DEFAULT_HARDNESS, // hardness => interval in ms
        e
      )
    }

    // debug
//    let x = pos.x + dCamera.xOffset()
//    let y = pos.y + dCamera.yOffset()
//    let blockCoords = d.getBlockCoords(x, y);
//    console.log(`${blockCoords.x},${blockCoords.y} => ${delta} @ ${x},${y}`)

    d.isPlaying() ? playerMode.canvasMouseDownListener(e) : dMode.canvasMouseDownListener(e)

  }

  // mouse up
  mouseUpListener(e) {

    if (e.which == 1) {
      mouse.left.timer.stop()
      clearInterval(mouse.left.interval)
    }
    if (e.which == 3) {
      mouse.right.timer.stop()
      clearInterval(mouse.right.interval)
    }

    let pos = getCanvasMouseCoords(e)
    let delta = d.getBlockDelta(pos.x + dCamera.xOffset(), pos.y + dCamera.yOffset())

    d.setMouseUpCoords(pos)
    d.setMouseUpBlockDelta(delta)

    d.isPlaying() ? playerMode.canvasMouseUpListener(e) : dMode.canvasMouseUpListener(e)

    // reset the timer
    if (e.which == 1) {
      mouse.left.pressed = 0
      mouse.left.timer.reset()
    }
    if (e.which == 3) {
      mouse.right.pressed = 0
      mouse.right.timer.reset()
    }

  }

  // mouse wheel
  mouseWheelListener(e) {

//    console.log(e);

    // BACKWARD / ZOOM OUT
    if (e.deltaY > 0) {

    }

    // FORWARD / ZOOM IN
    else {

    }

    d.isPlaying() ? game.canvasMouseWheelListener(e) : dMode.canvasMouseWheelListener(e)

    return false

  }

}
