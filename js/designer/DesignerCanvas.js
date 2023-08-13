class DesignerCanvas {

  constructor() {

  }

  init() {

    canvas = document.getElementById("biome")
    c = canvas.getContext("2d")

    // disable right click on canvas
    canvas.oncontextmenu = function(e) {
      e.preventDefault()
      e.stopPropagation()
    }

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

//  canvas.addEventListener("mouseover", canvasMouseOver)
//  canvas.addEventListener("mouseout", canvasMouseOut)

  }

}
