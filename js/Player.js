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

    this.inventory = new Inventory({
      id: 'playerInventory',
      size: 40 // 10 quick access, 30 storage - @see DesignerInventory
    })

    this.belt = new Belt({
      id: 'playerBeltElement',
      inventory: this.inventory
    })

    this._obtained = {
      block: [],
      item: [],
      building: []
    }

    this._unlocked = {
      block: [],
      item: [],
      building: []
    }

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
      inventory: this.inventory.exportData()
    })
  }

  load() {
    let data = dStorage.load('player')
    if (data) {
      this.name = data.name
      this.x = data.x
      this.y = data.y
      if (data.inventory) { this.inventory.importData(data.inventory) }
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

    let blockAboveTopLeftDelta = d.getBlockDelta(this.x, upwardDestination)
    let blockAboveTopRightDelta = d.getBlockDelta(this.x + this.width, upwardDestination)
    let blockBelowBottomLeftDelta = d.getBlockDelta(this.x, downwardDestination)
    let blockBelowBottomRightDelta = d.getBlockDelta(this.x + this.width, downwardDestination)

    let blockAboveTopLeft = d.hasBlock(blockAboveTopLeftDelta) ? d.block(blockAboveTopLeftDelta) : null
    let blockAboveTopRight = d.hasBlock(blockAboveTopRightDelta) ? d.block(blockAboveTopRightDelta) : null
    let blockBelowBottomLeft = d.hasBlock(blockBelowBottomLeftDelta) ? d.block(blockBelowBottomLeftDelta) : null
    let blockBelowBottomRight = d.hasBlock(blockBelowBottomRightDelta) ? d.block(blockBelowBottomRightDelta) : null

    let blockBeforeTopLeftDelta = d.getBlockDelta(leftDestination, this.y)
    let blockAfterTopRightDelta = d.getBlockDelta(rightDestination, this.y)
    let blockBeforeBottomLeftDelta = d.getBlockDelta(leftDestination, this.y + this.height)
    let blockAfterBottomRightDelta = d.getBlockDelta(rightDestination, this.y + this.height)

    let blockBeforeTopLeft = d.hasBlock(blockBeforeTopLeftDelta) ? d.block(blockBeforeTopLeftDelta) : null
    let blockAfterTopRight = d.hasBlock(blockAfterTopRightDelta) ? d.block(blockAfterTopRightDelta) : null
    let blockBeforeBottomLeft = d.hasBlock(blockBeforeBottomLeftDelta) ? d.block(blockBeforeBottomLeftDelta) : null
    let blockAfterBottomRight = d.hasBlock(blockAfterBottomRightDelta) ? d.block(blockAfterBottomRightDelta) : null

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
    let i = this.belt.getActiveButtonIndex()
    let slot = this.inventory.get(i)
    if (slot) {// && slot.length
      let entity = this.inventory.getEntityType(i) == 'block' ?
        d.getBlock(slot[0]) :
        d.getItem(slot[0])
      entity.draw(x, y, this)
    }

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

    // "mine the block" by adding it to the inventory...

    let inventory = player.inventory
    let block = d.block(delta)

    // If any slot is already holding this kind of entity and it has an opening, add the enity id it.
    let existingSlotWithOpening = inventory.findExistingSlotWithOpening('block', block.type)
    if (existingSlotWithOpening !== null) { inventory.addToExistingSlot(existingSlotWithOpening, block) }
    else {

      // There weren't any existing slots with openings...

      // If there is an empty slot available...
      let emptySlot = inventory.findEmptySlot()
      if (emptySlot !== null) {

        // Add block to empty slot...
        inventory.addToEmptySlot(emptySlot, block)

        this.handleObtainingEntity(block)

      }
      else {

        // There weren't any empty slots available...

        // TODO The block is probably lost in the abyss; it needs to float on the map to be picked up

        console.log('mineBlock() - no empty slots avilable')

      }

    }

    // place bedrock down in its place
    dMode.paintNewBlock(delta, 'Bedrock')

    // refresh the belt and inventory
    player.belt.refresh()
    dInventory.refresh()

    d.save()

  }

  // OBTAINED (entities)

  handleObtainingEntity(entity) {

    let entityType = entity.entityType
    let bundle = entity.type

    // If the player has never obtained this type of block before...
    if (!player.hasObtained(entityType, bundle)) {

      player.obtain(entityType, bundle)

    }

  }

  hasObtained(entityType, bundle) { return this._obtained[entityType].indexOf(bundle) !== -1 }
  addToObtained(entityType, bundle) { this._obtained[entityType].push(bundle) }

  obtain(entityType, bundle) {

    console.log(`obtaining ${entityType} ${bundle}`)
    this.addToObtained(entityType, bundle)

    // Iterate over entities that the player hasn't yet unlocked...
    let entityTypes = [
      'block',
      'item',
      'building'
    ]
    for (let i = 0; i < entityTypes.length; i++) {

      let entityType = entityTypes[i]
      let dict = d.getEntityDict(entityType)
      let types = dict.getTypes()

      for (let j = 0; j < types.length; j++) {

        let bundle = types[j]

        if (!this.hasUnlocked(entityType, bundle)) {

          // The player hasn't unlocked this entity type and bundle before...

//          console.log(`has not unlocked ${entityType} ${bundle}`)

          let def = d.getEntityDefinition(entityType, bundle)

          // Skip the uncraftables.
          if (!d.isCraftable(def)) { continue }

          // If the requirements for this have been obtained (at one point) by the player, unlock it...
          let requirements = d.getEntityRequirements(entityType, bundle)
          if (requirements) {

            let hasMetRequirements = true

            for (let requiredEntityType in requirements) {
              if (!requirements.hasOwnProperty(requiredEntityType)) { continue }

              for (let requiredBundle in requirements[requiredEntityType]) {
                if (!requirements[requiredEntityType].hasOwnProperty(requiredBundle)) { continue }

                if (!this.hasObtained(requiredEntityType, requiredBundle)) {
                  hasMetRequirements = false
                  break
                }

              } // requiredBundle

              if (!hasMetRequirements) { break }

            } // requiredEntityType

            if (hasMetRequirements) { this.unlock(entityType, bundle) }

          }

        }

      } // bundle

    } // entityTypes

  }

  // UNLOCKED (entities)

  hasUnlocked(entityType, bundle) { return this._unlocked[entityType].indexOf(bundle) !== -1 }
  addToUnlocked(entityType, bundle) { this._unlocked[entityType].push(bundle) }

  unlock(entityType, bundle) {

//    console.log(`unlocking ${entityType} ${bundle}`)

    this.addToUnlocked(entityType, bundle)

    let def = d.getEntityDefinition(entityType, bundle)

    // light up the tools button, if they're not already on it
    if (playerMode.getMode() != 'tools') {
      playerMode.turnOnButtonLight('tools')
    }

    // toast the user
    d.toast({
      id: `${entityType}${bundle}`,
      title: `New Item Unlocked`,
      body:
        `<button type="button" class="btn btn-link btn-lg">${def.label}</button>`,
      position: [
        'top-0',
        'end-0'
      ],
      shown: (el, toast) => {

        // btn click listener
        let btn = el.querySelector('.btn-link')
        btn.addEventListener('click', (e) => {

          // switch to the Tools pane if it isn't already open
          if (playerMode.getMode() != 'tools') {
            playerMode.switchToPane('tools', true)
          }

        })

      }
    })

  }

  // MOVEMENT

  isMoving() { return this.isMovingUp() || this.isMovingDown() || this.isMovingLeft() || this.isMovingRight() }
  isMovingUp() { return this.state.moving.up }
  isMovingDown() { return this.state.moving.down }
  isMovingLeft() { return this.state.moving.left }
  isMovingRight() { return this.state.moving.right }

  // COLLISION

  hasTopCollision() { return this.state.collision.top }
  hasBottomCollision() { return this.state.collision.bottom }
  hasLeftCollision() { return this.state.collision.left }
  hasRightCollision() { return this.state.collision.right }

  // BLOCK HELPERS

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

  addBlockToBelt(delta) {
    let block = d.block(delta)
    block.delta = null
    this.inventory.add(block)
  }

  addItemToBelt(item) {
    this.inventory.add(item)
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
