import MkCanvas from './MkCanvas.js';
import MkKeyboard from './MkKeyboard.js';
import MkMouse from './MkMouse.js';
import MkEntities from './MkEntities.js';
import MkGravity from './MkGravity.js';

// place
//   place
//     place
//       place
//         ...

export default class Mk {

  // TODO let's not use "options" like this, and instead use the constructor as intended, ya dummy
  constructor(options) {

    let self = this

    self._options = options

    self._mkEntities = null
    self._mkCanvas = null
    self._mkKeyboard = null
    self._mkMouse = null
    self._mkGravity = null

//    self._animate = null
//    self._update = null
//    self._draw = null

    self.animate = options.animate
    self.update = options.update
    self.draw = options.draw
    self._animationFrame = null

    // TODO stop sending "self" to MkCanvas, MkKeyboard and MkMouse; mk is now available globally (via window.mk)

    // ENTITIES
    // - Instantiate the entities.
    // - Set aside entities.
    let mkEntities = new MkEntities()
    self.setMkEntities(mkEntities)

    // CANVAS
    // - Instantiate the canvas.
    // - Set aside canvas.
    // - Initialize the screen resolution.
    let mkCanvas = new MkCanvas(self, options.canvas)
    self.setMkCanvas(mkCanvas)
    mkCanvas.initScreenResolution()

    // KEYBOARD
    // - Instantiate the keyboard.
    // - Set aside keyboard.
    // - Initialize the keyboard.
    let mkKeyboard = new MkKeyboard(self, options.keyboard)
    self.setKeyboard(mkKeyboard)
    mkKeyboard.init()

    // MOUSE
    // - Instantiate the mouse.
    // - Set aside mouse.
    // - Initialize the mouse.
    let mkMouse = new MkMouse(self, options.mouse)
    self.setMouse(mkMouse)
    mkMouse.init()

    // CANVAS + KEYBOARD

    mkCanvas.initKeyboard()

    // CANVAS + MOUSE

    mkCanvas.initMouse()

    window.mk = this
    window.canvas = mkCanvas.getCanvas()
    window.c = mkCanvas.getContext()

    // GRAVITY
    if (options.gravity) {

      // - Instantiate the gravity.
      // - Set aside gravity.
      let mkGravity = new MkGravity(options.gravity)
      self.setGravity(mkGravity)

    }

  }

//  getOptions() { return this._options }
//  getOption(name) { return this.getOptions()[name] }
//  get(name) { return this.getOption(name) }

  // MkEntities

  getMkEntities() { return this._mkEntities }
  setMkEntities(mkEntities) { this._mkEntities = mkEntities }

  // MkCanvas

  getMkCanvas() { return this._mkCanvas }
  setMkCanvas(mkCanvas) { this._mkCanvas = mkCanvas }

  // Canvas + Context

//  getCanvasId() { return this._canvasId }
  getCanvas() { return this.getMkCanvas().getCanvas() }
  getContext() { return this.getMkCanvas().getContext() }

  // Keyboard

  getKeyboard() { return this._mkKeyboard }
  setKeyboard(mkKeyboard) { this._mkKeyboard = mkKeyboard }

  // Mouse

  getMouse() { return this._mkMouse }
  setMouse(mkMouse) { this._mkMouse = mkMouse }

  // Gravity

  getGravity() { return this._mkGravity }
  setGravity(mkGravity) { this._mkGravity = mkGravity }

  hasGravity() { return !!this._mkGravity }
  hasGravityX() { return this.hasGravity() && !!this.getGravityX() }
  hasGravityY() { return this.hasGravity() && !!this.getGravityY() }

  getGravityX() { return this.getGravity().vX }
  getGravityY() { return this.getGravity().vY }

  // Animate

  get animationFrame() { return this._animationFrame }
  set animationFrame(animationFrame) { this._animationFrame = animationFrame }

  play() {

    console.log('playing...')

    this.animationFrame = requestAnimationFrame(this.animate)

    setTimeout(function() {

      console.log('canceling animation...')

      mk.pause()

    }, 5000)

  }

  pause() {

    console.log('pausing...')

    cancelAnimationFrame(mk.animationFrame)
    mk.animationFrame = null

  }

//  d._animationFrame = requestAnimationFrame(animate)

}
