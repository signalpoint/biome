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

    this.belt = new Belt({
      id: 'playerBeltElement',
      size: 10
    })

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
      },
      collision: {
        top: false,
        bottom: false,
        left: false,
        right: false
      }
    }

  }

  save() {
    dStorage.save('player', {
      name: this.name,
      x: this.x,
      y: this.y,
      belt: this.belt.exportData()
    })
  }

  load() {
    let data = dStorage.load('player')
    if (data) {
      this.name = data.name
      this.x = data.x
      this.y = data.y
      if (data.belt) {
        this.belt.importData(data.belt)
      }
    }
  }

  update() {

    // has something to do...
    if (this.hasActions()) {

      let action = this.getAction()

      switch (action.getStatusLabel()) {
        case 'new':
          action.setStatus('processing')
          break
        case 'processing':
          action.update(this) // continue doing it...
          break
        case 'complete':
          this.removeAction()
          break
      }

    }

    // has nothing to do...
    else {

      // wait for player input...

    }

//    console.log('player velocity: ' + this.vX + ', ' + this.vY)

    // determine if the player can move up, down, left and/or right...

    let upwardDestination = this.y - Math.abs(this.vY)
    let downwardDestination = this.y + this.height + Math.abs(this.vY)
    let leftDestination = this.x - Math.abs(this.vX)
    let rightDestination = this.x + this.width + Math.abs(this.vX)

    let blockAboveTopLeft = d.block(d.getBlockDelta(this.x, upwardDestination))
    let blockAboveTopRight = d.block(d.getBlockDelta(this.x + this.width, upwardDestination))
    let blockBelowBottomLeft = d.block(d.getBlockDelta(this.x, downwardDestination))
    let blockBelowBottomRight = d.block(d.getBlockDelta(this.x + this.width, downwardDestination))

    let blockBeforeTopLeft = d.block(d.getBlockDelta(leftDestination, this.y))
    let blockAfterTopRight = d.block(d.getBlockDelta(rightDestination, this.y))
    let blockBeforeBottomLeft = d.block(d.getBlockDelta(leftDestination, this.y + this.height))
    let blockAfterBottomRight = d.block(d.getBlockDelta(rightDestination, this.y + this.height))

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

    // if the player is moving in 2 directions simultaniously, cut each velocity in half
    // NOTE this is close, but the originally velocity seems to get lost afterwards
//    if (
//      (this.state.moving.up && (this.state.moving.left || this.state.moving.right)) ||
//      (this.state.moving.down && (this.state.moving.left || this.state.moving.right)) ||
//      (this.state.moving.left && (this.state.moving.up || this.state.moving.down)) ||
//      (this.state.moving.right && (this.state.moving.up || this.state.moving.down))
//    ) {
//      console.log('2 directions at once')
//      this.vX *= .5
//      this.vY *= .5
//    }

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

    this.refreshFacingStates()

    // body
    c.fillStyle = 'green'
    c.fillRect(x, y, this.width, this.height)

    // eyes
    c.fillStyle = '#333'
    if (this.state.facing.up) {
      c.fillRect(x, y, this.width, this.height / 8)
    }
    else if (this.state.facing.down) {
      c.fillRect(x, y + this.height - this.height / 8, this.width, this.height / 8)
    }
    if (this.state.facing.left) {
      c.fillRect(x, y, this.width / 8, this.height)
    }
    else if (this.state.facing.right) {
      c.fillRect(x + this.width - this.width / 8, y, this.width / 8, this.height)
    }

    // item
    let item = this.belt.get(this.belt.getActiveButtonIndex())
    if (item) { item.draw(x, y, this) }

  }

  getPosition() {
    return {
      x: this.x,
      y: this.y
    }
  }
  getCenterPosition() {
    let pos = this.getPosition()
    return {
      x: pos.x + this.width / 2,
      y: pos.y + this.height / 2
    }
  }

  getVelocity() {
    return {
      x: this.vX,
      y: this.vY
    }
  }

  getNearbyBlocks() {

    let center = this.getCenterPosition()
    let size = d.getBlockSize()

    return [

      // top: left, center, right
      d.getBlockDelta(center.x - size, center.y - size),
      d.getBlockDelta(center.x, center.y - size),
      d.getBlockDelta(center.x + size, center.y - size),

      // middle: left, center, right
      d.getBlockDelta(center.x - size, center.y),
      d.getBlockDelta(center.x, center.y),
      d.getBlockDelta(center.x + size, center.y),

      // bottom: left, center, right
      d.getBlockDelta(center.x - size, center.y + size),
      d.getBlockDelta(center.x, center.y + size),
      d.getBlockDelta(center.x + size, center.y + size)

    ]

  }

  mineBlock(delta) {

    // TODO if the player's belt is full, the block is probably lost in the abyss; it needs to float on the map to
    // be picked up

    // "mine the block" by adding it to the belt
    if (!player.belt.isFull()) {
      player.addBlockToBelt(delta)
    }

    // place bedrock down in its place
    dMode.paintNewBlock(delta, 'Bedrock')

    // refresh the belt
    player.belt.refresh()

    // save the map
    d.saveCurrentMap()

    // save the player
    player.save()

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

  // CAMPGROUND

  getCampground() {
    return d.indexHasBuildingType('Campground') ?
      d.getBuildingFromIndexByType('Campground') : null
  }

  // BELT
  // TODO turn this into Belt.js

//  getBelt() { return this._belt }
//  getBeltIndex() { return this._beltIndex }
//  getBeltSize() { return this._beltSize }
//
//  exportBelt() { return this._belt }
//  importBelt(data) {
//    for (let i = 0; i < data.length; i++) {
//      let block = data[i]
//      if (!dBlocks.getType(block.type)) {
//        console.log(`Player belt import skipping unknown block type: ${block.type}`)
//        continue
//      }
//      let blockClass = d.getBlockClass(block.type)
//      this._belt.push(new blockClass({
//        delta: null,
//        type: block.type,
//        solid: block.solid
//      }))
//    }
//  }
//
//  getBeltItem(index) { return this._belt[index] }
//  deleteBeltItem(index) { this._belt.splice(index, 1) }
//
//  beltIsFull() { return this.getBelt().length == this.getBeltSize() }
//  beltIsEmpty() { return !this.getBelt().length }
//

  addBlockToBelt(delta) {
    let block = d.block(delta)
    block.delta = null
    this.belt.add(block)
  }

  addItemToBelt(item) {
    this.belt.add(item)
  }

//  addItemToBeltIndex(item) {
//    if (!this._beltIndex[item.type]) { this._beltIndex[item.type] = [] }
//    this._beltIndex[item.type].push(item.id)
//  }
//  removeItemFromBeltIndex(item) {
//    let index = this._beltIndex[item.type].indexOf(item.id)
//    this._beltIndex[item.type].splice(index, 1)
//  }
//  getItemFromBeltIndexByType(type) {
//    return this.item.s[this._beltIndex[type][0]]
//  }
//  beltIndexHasItemType(type) {
//    return this._beltIndex[type] && this._beltIndex[type].length
//  }
//
//  getBeltElement() {
//    if (!this._beltElement) { this._beltElement = document.getElementById('playerBeltElement') }
//    return this._beltElement
//  }
//  getBeltButtons() {
//    if (!this._beltButtons) { this._beltButtons = this.getBeltElement().querySelectorAll('button') }
//    return this._beltButtons
//  }
//  getBeltButton(index) { return this.getBeltButtons()[index] }
//
//  getActiveBeltButton() { return this.getBeltElement().querySelector('button.active') }
//  setActiveBeltButton(index) {
//    this.getBeltButton(index).classList.add('active')
//    this.setActiveBeltItem(index)
//  }
//  clearActiveBeltButton() { this.getActiveBeltButton().classList.remove('active') }
//  changeActiveBeltButton(index) {
//    this.clearActiveBeltButton()
//    this.setActiveBeltButton(index)
//  }
//
//  getActiveBeltButtonIndex() { return this._beltActiveItem }
//
//  setActiveBeltItem(index) { this._beltActiveItem = parseInt(index) }
//
//  getNextBeltButton() { return this.getActiveBeltButton().nextSibling }
//  getPreviosBeltButton() { return this.getActiveBeltButton().previousSibling }
//
//  initBelt() {
//
//    for (let i = 0; i < this.getBeltSize(); i++) {
//
//      let active = i == 0
//
//      // add btn to dom
//
//      // create a new button element
//      let btn = document.createElement("button");
//      let btnClasses = ['btn', 'btn-outline-dark', 'btn-lg', 'text-secondary']
//      if (active) { btnClasses.push('active') }
//      btn.classList.add(...btnClasses)
//      btn.setAttribute('type', 'button')
//      btn.setAttribute('data-index', i)
//      btn.setAttribute('title', `(${i+1})`)
////      btn.innerHTML = '<span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">!</span>'
//
//      // add a notification badge within the button
////      let span = document.createElement("span");
////      let spanClasses = [
////        'badge',
////        'rounded-pill',
////        'bg-danger',
////        'position-absolute',
////        'top-0',
////        'start-100',
////        'translate-middle'
////      ]
////      span.classList.add(...spanClasses)
////      if (active) { span.innerHTML = '!' }
//
//      // add click listener to btn
//      btn.addEventListener('click', function(e) {
//
//        btn = e.target
//        while (btn && btn.tagName != 'BUTTON') { btn = btn.parentNode }
//
//        let index = btn.getAttribute('data-index')
//        player.clearActiveBeltButton()
//        player.setActiveBeltButton(index)
//
//        // Start the game if it's paused.
//        if (d.isPaused()) { dPlayback.play() }
//
//      })
//
//      // add the btn to the belt element
//      this.getBeltElement().appendChild(btn)
////      btn.appendChild(span)
//
//    }
//
//  }
//
//  refreshBelt() {
//    for (let i = 0; i < this.getBeltSize(); i++) {
//      let block = this.getBelt()[i]
//      this.getBeltButton(i).innerHTML = block ?
//        block.type : '<i class="fas fa-circle-notch"></i>'
//    }
//  }

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
