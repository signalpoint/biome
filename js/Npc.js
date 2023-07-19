let npcs = []

class Npc {

  constructor({
    id,
    name,
    x,
    y,
    color
  }) {

    this.id = id

    this.name = name

    this.x = x
    this.y = y

    this.width = 48
    this.height = 48

    this.color = color

    this.vX = 0
    this.vY = 0

    this.maxVelocityX = 5
    this.maxVelocityY = 5

    this._belt = []
    this._beltSize = 10

    this._actions = []

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
      }
    }

  }

  save() {}

  load() {}

  getVelocity() {
    return {
      x: this.vX,
      y: this.vY
    }
  }

  update() {

//    console.log('npc velocity: ' + this.vX + ', ' + this.vY)

    // determine if the npc can move up, down, left and/or right...

    // @see player collision detection, and then abstract it for re-use

    // velocity changes for npc and npc movement states

    // ...

    // if npc has velocity in either direction, change their position accordingly
    if (this.vX !== 0) { this.x += this.vX }
    if (this.vY !== 0) { this.y += this.vY }

  }

  draw() {

    let x = this.x - dCamera.xOffset()
    let y = this.y - dCamera.yOffset()

    // body
    c.fillStyle = this.color
    c.fillRect(x, y, this.width, this.height)

  }

  isMoving() { return this.isMovingUp() || this.isMovingDown() || this.isMovingLeft() || this.isMovingRight() }
  isMovingUp() { return this.state.moving.up }
  isMovingDown() { return this.state.moving.down }
  isMovingLeft() { return this.state.moving.left }
  isMovingRight() { return this.state.moving.right }

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

//    if (mouseCoords.x < x) {
//      this.state.facing.left = true
//      this.state.facing.right = false
//    }
//    else if (mouseCoords.x < x + this.width) {
//      this.state.facing.left = false
//      this.state.facing.right = false
//    }
//    else {
//      this.state.facing.left = false
//      this.state.facing.right = true
//    }
//
//    if (mouseCoords.y < y) {
//      this.state.facing.up = true
//      this.state.facing.down = false
//    }
//    else if (mouseCoords.y < y + this.height) {
//      this.state.facing.up = false
//      this.state.facing.down = false
//    }
//    else {
//      this.state.facing.up = false
//      this.state.facing.down = true
//    }

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

  // ACTIONS

  getActions() { return this._actions }
  getAction(index = 0) { return this._actions[index] }
  getActionCount() { return this._actions.length }
  addAction(action) { this.getActions().push(action) }
  hasActions() { return !!this._actions.length }
  hasNoActions() { return !this._actions.length }
  removeAction(index = 0) { return this._actions.splice(index, 1) }
  finishAction() {
    this.getAction().setStatus('complete')
    this.removeAction()
  }
  failAction() {
    this.getAction().setStatus('failed')
    this.removeAction()
  }

}
