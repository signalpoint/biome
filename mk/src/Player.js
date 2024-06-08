import MkPlayer from './MkPlayer.js';
import MkGravity from './MkGravity.js';
import {keys} from './keys.js';

export default class Player extends MkPlayer {

  constructor({
    id = null,
    name = null,
    x,
    y,
    width,
    height,
    vX = 0,
    vY = 0,
    vMaxX = 5,
    vMaxY = 5,
    gravity = null,
    state = null
  }) {

    super({

      type: 'player',

      id,
      name,
      x,
      y,
      width,
      height,
      vX,
      vY,
      vMaxX,
      vMaxY,
      gravity,
      state

    })

    // GRAVITY
    if (gravity) {
      this.setGravity(new MkGravity(gravity))
    }

  }

  update() {

    // GRAVITY

    this.applyGravity()

    // key press velocity changes for player and player movement state

    // UP

//    if (this.canMoveUp()) {
//      if (keys.up.pressed && Math.abs(this.vY) < this.vMaxY) {
//        this.state.moving.up = true
//        this.vY -= 1
//      }
//      else if (this.vY < 0) { // friction / gravity
//        this.vY += 1
//        if (!this.vY) {
//          this.state.moving.up = false
//        }
//      }
//    }
//    else if (keys.up.pressed || this.state.moving.up) {
//      this.vY = 0
//      this.state.moving.up = false
//    }
//
//    // DOWN
//
//    if (this.canMoveDown()) {
//      if (keys.down.pressed && Math.abs(this.vY) < this.vMaxY) {
//        this.state.moving.down = true
//        this.vY += 1
//      }
//      else if (this.vY > 0) { // friction / gravity
////        console.log('gravity', this.vY)
//        this.vY -= 1
//        if (!this.vY) {
//          this.state.moving.down = false
//        }
//      }
//    }
//    else if (keys.down.pressed || this.state.moving.down) {
//      this.vY = 0
//      this.state.moving.down = false
//    }

    // LEFT

    if (this.canMoveLeft()) {
      if (keys.left.pressed && Math.abs(this.vX) < this.vMaxX) {
        this.state.moving.left = true
        this.vX -= 1
      }
      else if (this.vX < 0) { // friction
        this.vX += 1
        if (!this.vX) {
          this.state.moving.left = false
        }
      }
    }
    else if (keys.left.pressed || this.state.moving.left) {
      this.vX = 0
      this.state.moving.left = false
    }

    // RIGHT

    if (this.canMoveRight()) {
      if (keys.right.pressed && Math.abs(this.vX) < this.vMaxX) {
        this.state.moving.right = true
        this.vX += 1
      }
      else if (this.vX > 0) { // friction
        this.vX -= 1
        if (!this.vX) {
          this.state.moving.right = false
        }
      }
    }
    else if (keys.right.pressed || this.state.moving.right) {
      this.vX = 0
      this.state.moving.right = false
    }

    // JUMP

    if (!this.state.jumping) {
      if (keys.jump.pressed && this.canMoveUp() && Math.abs(this.vY) < this.vMaxY) {
        this.state.jumping = true
        this.vY -= 28
      }
    }
    else if (!this.inTheAir()) {
      this.state.jumping = false
    }

    // Apply velocity...

    // if player has velocity in either direction, change their position accordingly
    if (this.vX !== 0) { this.x += this.vX }
    if (this.vY !== 0) { this.y += this.vY }

  }

  draw() {

    c.fillStyle = 'green'
    c.fillRect(this.x, this.y, this.width, this.height)

  }

  // Allowed Movement

  canMoveUp() { return this.y + this.vY >= 0 }
  canMoveDown() { return this.y + this.vY < canvas.height - this.height }
  canMoveLeft() { return this.x + this.vX >= 0 }
  canMoveRight() { return this.x + this.vX < canvas.width - this.width }

  // Gravity

  getGravity() { return this._mkGravity }
  setGravity(mkGravity) { this._mkGravity = mkGravity }

  hasGravity() { return !!this._mkGravity }

  inTheAir() {
    return this.y + this.height /*+ this.vY*/ <= canvas.height - 1
  }

  applyGravity() { // TODO move this to mk and allow anybody to call it

    let gravity = null
    if (this.hasGravity()) { gravity = this.getGravity() } // my gravity
    else if (mk.hasGravity()) { gravity = mk.getGravity() } // game's gravity

    if (gravity && gravity.vY) {

      if (this.inTheAir()) {

        if (Math.abs(gravity.vY) < gravity.vMaxY) { this.vY += gravity.vY }

      }
      else { // on the ground...

        this.vY = 0

      }

    }

  }

}
