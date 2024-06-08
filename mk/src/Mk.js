import MkCanvas from './MkCanvas.js';
import MkKeyboard from './MkKeyboard.js';
import MkMouse from './MkMouse.js';
import MkEntities from './MkEntities.js';
import MkGravity from './MkGravity.js';
import MkWebSocket from './MkWebSocket.js';

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
    self._mkGame = null
    self._mkGravity = null

    self._mkWebSocket = null

//    self._animate = null
//    self._update = null
//    self._draw = null

    self.animate = options.animate
    self.update = options.update
    self.draw = options.draw
    self._animationFrame = null

    // Place "mk" into the global scope.
    window.mk = this

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
    // - Place the canvas and context into the global scope.
    let mkCanvas = new MkCanvas(self, options.canvas)
    self.setMkCanvas(mkCanvas)
    mkCanvas.initScreenResolution()
    window.canvas = mkCanvas.getCanvas()
    window.c = mkCanvas.getContext()

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

//    window.canvas = mkCanvas.getCanvas()
//    window.c = mkCanvas.getContext()

    // GRAVITY (optional)
    // Instantiate and set aside the gravity.
    if (options.gravity) {
      self.setGravity(new MkGravity(options.gravity))
    }

    // WEB SOCKET (optional)
    // - Instantiate and set aside the web socket.
    if (options.webSocket) {
      self.setWebSocket(new MkWebSocket(options.webSocket))
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

  // Game

  getGame() { return this._mkGame }
  setGame(mkGame) { this._mkGame = mkGame }

  // Gravity

  getGravity() { return this._mkGravity }
  setGravity(mkGravity) { this._mkGravity = mkGravity }

  hasGravity() { return !!this._mkGravity }
  hasGravityX() { return this.hasGravity() && !!this.getGravityX() }
  hasGravityY() { return this.hasGravity() && !!this.getGravityY() }

  getGravityX() { return this.getGravity().vX }
  getGravityY() { return this.getGravity().vY }

  // WebSocket

  getWebSocket() { return this._mkWebSocket }
  setWebSocket(mkWebSocket) { this._mkWebSocket = mkWebSocket }

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
