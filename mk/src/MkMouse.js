import getCanvasMouseCoords from './utils.js';
import MkTimer from './MkTimer.js';
import {mouse} from './mouse.js';

export default class MkMouse {

  constructor(mk, options) {

    this.mk = mk

    this._options = options

    this._x = null
    this._y = null

    this._downX = null
    this._downY = null

    this._upX = null
    this._upY = null

  }

  getOptions() { return this._options }
  getOption(name) { return this.getOptions()[name] }
  get(name) { return this.getOption(name) }

  getButtonMap() { return this._buttonMap }
  setButtonMap(buttonMap) { this._buttonMap = buttonMap }
  getButton(name) { return this._buttonMap[name] }
  setButton(name, value) { this._buttonMap[name] = value }
  hasButton(name) { return !!this._buttonMap[name] }

  init() {

    // CONTROLS
    let controls = this.get('controls')
    let buttonMap = {}
    let valueMap = { // @see https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/button
      'left': 0,
      'middle': 1,
      'right': 2,
//      'backward': 3,
//      'forward': 4
    }
    for (const [key, value] of Object.entries(controls)) {

//      console.log(`${key}: ${value}`);

      buttonMap[valueMap[value]] = key

      mouse[key] = {
        pressed: false,
        timer: new MkTimer(),
        interval: null
      }

    }
    this.setButtonMap(buttonMap)
    console.log('mouse::buttonMap', buttonMap)
    console.log('mouse', mouse)

  }

  setX(x) { this._x = x }
  getX() { return this._x }

  setY(y) { this._y = y }
  getY() { return this._y }

  setCoords(coords) {
    this._x = coords.x
    this._y = coords.y
  }
  getCoords() {
    return {
      x: this._x,
      y: this._y
    }
  }

  setDownX(x) { this._downX = x }
  getDownX() { return this._downX }

  setDownY(y) { this._downY = y }
  getDownY() { return this._downY }

  setDownCoords(coords) {
    this._downX = coords.x
    this._downY = coords.y
  }
  getDownCoords() {
    return {
      x: this._downX,
      y: this._downY
    }
  }

  setUpCoords(coords) {
    this._upX = coords.x
    this._upY = coords.y
  }
  getUpCoords() {
    return {
      x: this._upX,
      y: this._upY
    }
  }

  mousemove(e) {

    let coords = getCanvasMouseCoords(e, this.mk.getCanvas())
//    console.log(coords)

    this.setX(coords.x)
    this.setY(coords.y)

  }

  // mouse down
  mousedown(e) {

    let pos = getCanvasMouseCoords(e, this.mk.getCanvas())
//    console.log('mousedown', e.button, pos)

    this.setDownCoords(pos)

    let mkCanvas = this.mk.getMkCanvas();

    let name = this.getButton(e.button)

    console.log(name, mouse[name])

    mouse[name].pressed = 1
    mouse[name].timer.start()
    mouse[name].interval = setInterval(
      mkCanvas.getOption('mousedownHold'),
      100,
      e
    )

  }

  // mouse up
  mouseup(e) {

    let name = this.getButton(e.button)

    mouse[name].timer.stop()
    clearInterval(mouse[name].interval)

    let pos = getCanvasMouseCoords(e, this.mk.getCanvas())
//    console.log('up', e.button, pos)

    this.setUpCoords(pos)

    // reset the timer

    mouse[name].pressed = 0
    mouse[name].timer.reset()

  }

  // mouse wheel
  wheel(e) {

//    console.log(e);

    return false

  }

}
