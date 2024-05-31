import MkCanvas from './MkCanvas.js';
import MkKeyboard from './MkKeyboard.js';
import MkMouse from './MkMouse.js';
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

    // ENTITY INDEX

    // entity ids...
    // [
    //   'abc123',
    //   'def456',
    //   'xyz789'
    // ]
//    this._entityIds = []
    this._entityIds = {}

    // entities...
    // {
    //   block: {
    //     abc123: { type: 'Grass', ... }
    //   },
    //   item: {
    //     def456: { type: 'WoodAxe', ... }
    //   },
    //   building: {
    //     xyz789: { type: 'LumberCamp', ... }
    //   },
    //   ...
    // }
    this._entities = {}

    // bundles...
    // {
    //   block: {
    //     Grass: [ 'abc123' ]
    //   },
    //   item: {
    //     WoodAxe: [ 'def456' ]
    //   },
    //   building: {
    //     LumberCamp: [ 'xyz789' ]
    //   },
    // }
    this._entityBundles = {}

    // TODO stop sending "self" to MkCanvas, MkKeyboard and MkMouse; mk is now available globally (via window.mk)

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

  // ENTITIES
  // TODO move these to e.g. entity.js and then export/import them for usage here

  // entity ids

  hasEntityIdIndex(type) { return !!this._entityIds[type] }
  initEntityIdIndex(type) { this._entityIds[type] = [] }
  addEntityId(type, id) {
//    if (!this.hasEntityIdIndex(type)) { this.initEntityIdIndex(type) }
    this._entityIds[type].push(id)
  }
  removeEntityId(type, id) {
    let i = this._entityIds[type].indexOf(id)
    this._entityIds[type].splice(i, 1)
  }
  getRandomEntityId(type) {
    let id = null
    while (true) {
      id = (Math.random() + 1).toString(36).substring(7);
      if (id && (!this.hasEntityIdIndex(type) || !this._entityIds[type].includes(id))) { break }
    }
    return id
  }

  // entity index

  hasEntityIndex(type) { return !!this._entities[type] }
  initEntityIndex(type) { this._entities[type] = {} }
  addEntityToIndex(type, entity) {
    if (!this.hasEntityIndex(type)) { this.initEntityIndex(type) }
    this._entities[type][entity.id] = entity
    this._addEntityToBundleIndex(type, entity)
  }
  removeEntityFromIndex(entity) {
    delete this._entities[entity.type][entity.id]
    this._removeEntityFromBundleIndex(entity.type, entity)
  }

  getEntityFromIndex(type, id) { return this._entities[type][id] }

  // entity bundle index

  _addEntityToBundleIndex(type, entity) {
    if (!this._entityBundles[type]) { this._entityBundles[type] = {} }
    if (!this._entityBundles[type][entity.type]) { this._entityBundles[type][entity.type] = [] }
    this._entityBundles[type][entity.type].push(entity.id)
  }
  _removeEntityFromBundleIndex(type, entity) {
    let i = this._entityBundles[type][entity.type].indexOf(entity.id)
    this._entityBundles[type][entity.type].splice(i, 1)
  }

  getEntityBundleIndexFromType(type) { return this._entityBundles[type] }

}
