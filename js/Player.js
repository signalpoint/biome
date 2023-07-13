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

    this.width = 48
    this.height = 48

    this.vX = 0
    this.vY = 0

    this.maxVelocityX = 5
    this.maxVelocityY = 5

    this._belt = []
    this._beltSize = 10
    this._beltElement = null
    this._beltButtons = null

    this.state = {
      moving: {
        up: false,
        down: false,
        left: false,
        right: false
      },
      facing: {
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
      y: this.y,
      belt: this.exportBelt()
    })
  }

  load() {
    let data = dStorage.load('player')
    if (data) {
      this.name = data.name
      this.x = data.x
      this.y = data.y
      if (data.belt) {
        this.importBelt(data.belt)
      }
    }
  }

  update() {

//    console.log('player velocity: ' + this.vX + ', ' + this.vY)

    // determine if the player can move up, down, left and/or right...

    let upwardDestination = this.y - Math.abs(this.vY)
    let downwardDestination = this.y + this.height + Math.abs(this.vY)
    let leftDestination = this.x - Math.abs(this.vX)
    let rightDestination = this.x + this.width + Math.abs(this.vX)

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
    dPlayer.refreshBlocksBadge()
    dPlayer.refreshBlockCoordinatesBadge()
    dPlayer.refreshBlockDeltaFromPositionBadge()

    if (this.isMoving()) {
      this.panCamera()
    }

  }

  draw() {

    let x = this.x - dCamera.xOffset()
    let y = this.y - dCamera.yOffset()

    // body
    c.fillStyle = '#000'
    c.fillRect(x, y, this.width, this.height)

    // eyes
    c.fillStyle = '#333'
    this.refreshFacingStates()
    if (this.state.facing.up) {
      c.fillRect(x, y, this.width, this.height / 8)
    }
    if (this.state.facing.down) {
      c.fillRect(x, y + this.height - this.height / 8, this.width, this.height / 8)
    }
    if (this.state.facing.left) {
      c.fillRect(x, y, this.width / 8, this.height)
    }
    if (this.state.facing.right) {
      c.fillRect(x + this.width - this.width / 8, y, this.width / 8, this.height)
    }

  }

  isMoving() { return this.isMovingUp() || this.isMovingDown() || this.isMovingLeft() || this.isMovingRight() }
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

  resetFacingStates() {
    this.state.facing = {
      up: false,
      down: false,
      left: false,
      right: false
    }
  }
  refreshFacingStates() {

    let x = this.x - dCamera.xOffset()
    let y = this.y - dCamera.yOffset()
    let mouseCoords = d.getMouseCoords()

    if (mouseCoords.x < x) {
      this.state.facing.left = true
      this.state.facing.right = false
    }
    else if (mouseCoords.x < x + this.width) {
      this.state.facing.left = false
      this.state.facing.right = false
    }
    else {
      this.state.facing.left = false
      this.state.facing.right = true
    }

    if (mouseCoords.y < y) {
      this.state.facing.up = true
      this.state.facing.down = false
    }
    else if (mouseCoords.y < y + this.height) {
      this.state.facing.up = false
      this.state.facing.down = false
    }
    else {
      this.state.facing.up = false
      this.state.facing.down = true
    }

  }

  resetCollisionStates() {
    this.state.collision = {
      top: false,
      bottom: false,
      left: false,
      right: false
    }
  }

  panCamera() {

    let startX = dCamera.x()
    let startY = dCamera.y()
    let endX = startX + d.blocksPerScreenRow()
    let endY = startY + d.blocksPerScreenCol()
    let thresholdX = 7
    let thresholdY = 5
    let pos = d.getBlockCoords(this.x, this.y)

//    console.log(`${startX},${startY} => ${endX},${endY}`)

    if (this.state.moving.up && pos.y - startY < thresholdY) { dCamera.move('up') }
    else if (this.state.moving.down && endY - pos.y < thresholdY) { dCamera.move('down') }

    if (this.state.moving.left && pos.x - startX < thresholdX) { dCamera.move('left') }
    else if (this.state.moving.right && endX - pos.x < thresholdX) { dCamera.move('right') }

  }

  // BELT

  getBelt() { return this._belt }
  getBeltSize() { return this._beltSize }

  exportBelt() { return this._belt }
  importBelt(data) {
    for (let i = 0; i < data.length; i++) {
      let block = data[i]
      this._belt.push(new blockTypesDict[block.type]({
        delta: null,
        type: block.type,
        solid: block.solid
      }))
    }
  }

  getBeltItem(index) { return this._belt[index] }
  deleteBeltItem(index) { this._belt.splice(index, 1) }

  beltIsFull() { return this.getBelt().length == this.getBeltSize() }
  beltIsEmpty() { return !this.getBelt().length }

  addBlockToBelt(delta) {
    let block = d.blocks[delta]
    this._belt.push(new blockTypesDict[block.type]({
      delta: null,
      type: block.type,
      solid: block.solid
    }))
  }

  getBeltElement() {
    if (!this._beltElement) { this._beltElement = document.getElementById('playerBeltElement') }
    return this._beltElement
  }
  getBeltButtons() {
    if (!this._beltButtons) { this._beltButtons = this.getBeltElement().querySelectorAll('button') }
    return this._beltButtons
  }
  getBeltButton(index) { return this.getBeltButtons()[index] }

  getActiveBeltButton() { return this.getBeltElement().querySelector('button.active') }
  setActiveBeltButton(index) { this.getBeltButton(index).classList.add('active') }
  clearActiveBeltButton() { this.getActiveBeltButton().classList.remove('active') }
  changeActiveBeltButton(index) {
    this.clearActiveBeltButton()
    this.setActiveBeltButton(index)
  }

  getActiveBeltButtonIndex() { return parseInt(this.getActiveBeltButton().getAttribute('data-index')) }

  getNextBeltButton() { return this.getActiveBeltButton().nextSibling }
  getPreviosBeltButton() { return this.getActiveBeltButton().previousSibling }

  initBelt() {

    for (let i = 0; i < this.getBeltSize(); i++) {

      let btn = this.getBeltButton(i)
      btn.addEventListener('click', function(e) {

        btn = e.target
        while (btn && btn.tagName != 'BUTTON') { btn = btn.parentNode }

        let index = btn.getAttribute('data-index')
        player.clearActiveBeltButton()
        player.setActiveBeltButton(index)

        // Start the game if it's paused.
        if (d.isPaused()) { dPlayback.play() }

      })

    }

  }

  refreshBelt() {
    for (let i = 0; i < this.getBeltSize(); i++) {
      let block = this.getBelt()[i]
      this.getBeltButton(i).innerHTML = block ?
        block.type : '<i class="fas fa-circle-notch"></i>'
    }
  }

}
