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
      },
      collision: {
        top: false,
        bottom: false,
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

  save() {
    dStorage.save('player', {
      name: this.name,
      x: this.x,
      y: this.y
    })
  }

  load() {
    let p = dStorage.load('player')
    if (p) {
      this.name = p.name
      this.x = p.x
      this.y = p.y
    }
  }

  update() {

//    console.log('player velocity: ' + this.vX + ', ' + this.vY)

    // determine if the player can move up, down, left and/or right...

    let upwardDestination = this.y - 1
    let downwardDestination = this.y + this.height  + 1
    let leftDestination = this.x - 1
    let rightDestination = this.x + this.width + 1

    let blockAboveTopLeft = d.blocks[d.getBlockDelta(this.x, upwardDestination)]
    let blockAboveTopRight = d.blocks[d.getBlockDelta(this.x + this.width, upwardDestination)]
    let blockBelowBottomLeft = d.blocks[d.getBlockDelta(this.x, downwardDestination)]
    let blockBelowBottomRight = d.blocks[d.getBlockDelta(this.x + this.width, downwardDestination)]

    let blockBeforeTopLeft = d.blocks[d.getBlockDelta(leftDestination, this.y)]
    let blockAfterTopRight = d.blocks[d.getBlockDelta(rightDestination, this.y)]
    let blockBeforeBottomLeft = d.blocks[d.getBlockDelta(leftDestination, this.y + this.height)]
    let blockAfterBottomRight = d.blocks[d.getBlockDelta(rightDestination, this.y + this.height)]

    let canMoveUp = blockAboveTopLeft && !blockAboveTopLeft.solid && blockAboveTopRight && !blockAboveTopRight.solid
    let canMoveDown = blockBelowBottomLeft && !blockBelowBottomLeft.solid && blockBelowBottomRight && !blockBelowBottomRight.solid
    let canMoveLeft = blockBeforeTopLeft && !blockBeforeTopLeft.solid && blockBeforeBottomLeft && !blockBeforeBottomLeft.solid
    let canMoveRight = blockAfterTopRight && !blockAfterTopRight.solid && blockAfterBottomRight && !blockAfterBottomRight.solid

    // key press velocity changes for player and player movement states

    // up
    if (canMoveUp && keys.up.pressed && Math.abs(this.vY) < this.maxVelocityY) {
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
    if (canMoveDown && keys.down.pressed && Math.abs(this.vY) < this.maxVelocityY) {
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
    if (canMoveLeft && keys.left.pressed && Math.abs(this.vX) < this.maxVelocityX) {
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
    if (canMoveRight && keys.right.pressed && Math.abs(this.vX) < this.maxVelocityX) {
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
//    if (this.vX !== 0 && (canMoveLeft || canMoveRight)) { this.x += this.vX }
//    if (this.vY !== 0 && (canMoveUp || canMoveDown)) { this.y += this.vY }

    dPlayer.refreshCoordinatesBadge()
    dPlayer.refreshVelocityBadge()

  }

  draw() {
    c.fillStyle = '#000'
    c.fillRect(
      this.x - dCamera.xOffset(),
      this.y - dCamera.yOffset(),
      this.width,
      this.height
    )
  }

  isMovingUp() { return this.state.moving.up }
  isMovingDown() { return this.state.moving.down }
  isMovingLeft() { return this.state.moving.left }
  isMovingRight() { return this.state.moving.right }

  hasTopCollision() { return this.state.collision.top }
  hasBottomCollision() { return this.state.collision.bottom }
  hasLeftCollision() { return this.state.collision.left }
  hasRightCollision() { return this.state.collision.right }

  getBlockDeltaFromTopLeftPosition() { return d.getBlockDelta(this.x, this.y) }
  getBlockDeltaFromTopRightPosition() { return d.getBlockDelta(this.x + this.width, this.y) }
  getBlockDeltaFromBottomLeftPosition() { return d.getBlockDelta(this.x, this.y + this.height) }
  getBlockDeltaFromBottomRightPosition() { return d.getBlockDelta(this.x + this.width, this.y + this.height) }

  getBlockDeltasFromPosition() {

    let topLeft = this.getBlockDeltaFromTopLeftPosition()
    let topRight = this.getBlockDeltaFromTopRightPosition()
    let bottomLeft = this.getBlockDeltaFromBottomLeftPosition()
    let bottomRight = this.getBlockDeltaFromBottomRightPosition()

    let deltas = [topLeft]
    if (!deltas.includes(topRight)) { deltas.push(topRight) }
    if (!deltas.includes(bottomLeft)) { deltas.push(bottomLeft) }
    if (!deltas.includes(bottomRight)) { deltas.push(bottomRight) }

    return deltas

  }

  resetCollisionStates() {
    this.state.collision = {
      top: false,
      bottom: false,
      left: false,
      right: false
    }
  }

}
