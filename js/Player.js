let player = null
let players = []

class Player {

  constructor({
    name,
    x,
    y
  }) {

    this.name = name

    this.x = x
    this.y = y

    this.width = 24
    this.height = 48

    this.vX = 0
    this.vY = 0

    this.maxVelocityX = 5
    this.maxVelocityY = 5

    this.state = {
      moving: {
        up: false,
        down: false,
        left: false,
        right: false
      }
    }

  }

  getVelocity() {
    return {
      x: this.vX,
      y: this.vY
    }
  }

  update() {

//    console.log('player velocity: ' + this.vX + ', ' + this.vY)

    // key press velocity changes for player and player movement states

    // up
    if (keys.up.pressed && Math.abs(this.vY) < this.maxVelocityY) {
      this.state.moving.up = true
      this.vY -= 1
    }
    else if (this.vY < 0) { // friction
      this.vY += 1
      if (!this.vY) {
        this.state.moving.up = false
      }
    }

    // down
    if (keys.down.pressed && Math.abs(this.vY) < this.maxVelocityY) {
      this.state.moving.down = true
      this.vY += 1
    }
    else if (this.vY > 0) { // friction
      this.vY -= 1
      if (!this.vY) {
        this.state.moving.down = false
      }
    }

    // left
    if (keys.left.pressed && Math.abs(this.vX) < this.maxVelocityX) {
      this.state.moving.left = true
      this.vX -= 1
    }
    else if (this.vX < 0) { // friction
      this.vX += 1
      if (!this.vX) {
        this.state.moving.left = false
      }
    }

    // right
    if (keys.right.pressed && Math.abs(this.vX) < this.maxVelocityX) {
      this.state.moving.right = true
      this.vX += 1
    }
    else if (this.vX > 0) { // friction
      this.vX -= 1
      if (!this.vX) {
        this.state.moving.right = false
      }
    }

    // if player has velocity in either direction, change their position accordingly
    if (this.vX !== 0) { this.x += this.vX }
    if (this.vY !== 0) { this.y += this.vY }

  }

  draw() {
    c.fillStyle = '#000'
    c.fillRect(
      this.x,
      this.y,
      this.width,
      this.height
    )
  }

}
