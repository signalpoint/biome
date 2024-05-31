import {keys} from './keys.js';

export default class MkKeyboard {

  constructor(mk, options) {

    this.mk = mk

    this._options = options
    this._keyMap = null
    this._codeMap = null

  }

  getOptions() { return this._options }
  getOption(name) { return this.getOptions()[name] }
  get(name) { return this.getOption(name) }

  getKeyMap() { return this._keyMap }
  setKeyMap(keyMap) { this._keyMap = keyMap }
  getKey(name) { return this._keyMap[name] }
  setKey(name, value) { this._keyMap[name] = value }
  hasKey(name) { return !!this._keyMap[name] }

  getCodeMap() { return this._codeMap }
  setCodeMap(codeMap) { this._codeMap = codeMap }
  getCode(name) { return this._codeMap[name] }
  setCode(name, value) { this._codeMap[name] = value }
  hasCode(name) { return !!this._codeMap[name] }

  init() {

    let self = this

    addEventListener('keydown', function(e) {
      self.keydown(e)
    });

    addEventListener('keyup', function(e) {
      self.keyup(e)
    });

    // CONTROLS (+ keyMap and codeMap)
    let controls = this.get('controls')
    let keyMap = {}
    let codeMap = {}
    for (const [key, value] of Object.entries(controls)) {

//      console.log(`${key}: ${value}`);

      if (value instanceof Object) { // an object, with a key and code

        if (value.key) {

          keyMap[value.key] = key

          keys[key] = {
            pressed: false
          }

        }

        if (value.code) {

          codeMap[value.code] = key

          keys[key] = {
            pressed: false
          }

        }

      }
      else { // a string, for a key

        keyMap[value] = key

        keys[key] = {
          pressed: false
        }

      }

    }
    this.setKeyMap(keyMap)
    this.setCodeMap(codeMap)
    console.log('keyboard::keyMap', keyMap)
    console.log('keyboard::codeMap', codeMap)

  }

  // KEY DOWN

  keydown(e) {

    if (!e.repeat) {

      // They just pressed the key down...

      if (this.hasKey(e.key)) {
        let name = this.getKey(e.key)
        keys[name].pressed = true
      }

      this.mk.getKeyboard().getOption('keydown')(e)

    }

    else {

      // They've been holding the key down...

      this.mk.getKeyboard().getOption('keydownHold')(e)

    }

  }

  // KEY UP

  keyup(e) {

    if (this.hasKey(e.key)) {
      let name = this.getKey(e.key)
      keys[name].pressed = false
    }

    this.mk.getKeyboard().getOption('keyup')(e)

  }

}
