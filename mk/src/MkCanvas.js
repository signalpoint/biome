import getCanvasMouseCoords from './utils.js';

export default class MkCanvas {

  /**
   *
   */
  constructor(mk, options) {

    console.log('MkCanvas', options);

    this.mk = mk

    this._screenWidth = null
    this._screenHeight = null

    this._options = options

    let id = options.id

    // Create canvas element and context; set them aside.
    let canvas = document.getElementById(id)
    let c = canvas.getContext("2d")
    this.setCanvas(canvas)
    this.setContext(c)

  }

  getOptions() { return this._options }
  getOption(name) { return this.getOptions()[name] }
  get(name) { return this.getOption(name) }

  getCanvas() { return this._canvas }
  setCanvas(canvas) { this._canvas = canvas }

  getContext() { return this._c }
  setContext(c) { this._c = c }

  // SCREEN

  setScreenWidth(w) { this._screenWidth = w }
  getScreenWidth() { return this._screenWidth }

  setScreenHeight(h) { this._screenHeight = h }
  getScreenHeight() { return this._screenHeight }

  initScreenResolution() {

    let screenWidth = window.innerWidth
      || document.documentElement.clientWidth
      || document.body.clientWidth

    let screenHeight = window.innerHeight
      || document.documentElement.clientHeight
      || document.body.clientHeight

    let headerHeight = document.getElementById('d-menu').clientHeight
    let footerHeight = document.querySelector('footer').clientHeight
    let canvasHeight = screenHeight - (headerHeight + footerHeight)

//    console.log('headerHeight', headerHeight)
//    console.log('footerHeight', footerHeight)
//    console.log('canvasHeight', canvasHeight)
//    console.log('screenWidth', screenWidth)
//    console.log('screenHeight', screenHeight)

    // set screen resolution
    this.setScreenResolution(screenWidth, canvasHeight)

  }

  setScreenResolution(w, h) {
    let canvas = this.getCanvas()
    this._screenWidth = w
    this._screenHeight = h
    canvas.width = w
    canvas.height = h
  }

  // KEYBOARD

  initKeyboard() {

    let mkKeyboard = this.mk.getKeyboard()

  }

  // MOUSE

  initMouse() {

    let canvas = this.getCanvas()
    let mkMouse = this.mk.getMouse()

    // canvas - disable right click
    canvas.oncontextmenu = function(e) {
      e.preventDefault()
      e.stopPropagation()
    }

    // canvas + mousemove
    canvas.addEventListener("mousemove", function(e) {
      mkMouse.mousemove(e)
    })

    // canvas + mousedown
    canvas.addEventListener('mousedown', function(e) {
      mkMouse.mousedown(e)
    })

    // canvas + mouseup
    canvas.addEventListener("mouseup", function(e) {
      mkMouse.mouseup(e)
    })

    // canvas + wheel
    canvas.addEventListener('wheel', function(e) {
      mkMouse.wheel(e)
    }, false)

//  canvas.addEventListener("mouseover", canvasMouseOver)
//  canvas.addEventListener("mouseout", canvasMouseOut)

  }

}
