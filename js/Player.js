let player = null
let players = []

class Player extends Entity {

  constructor({
    id = null,
    type,
    name,
    health = 100,
    x,
    y
  }) {

    super({
      id,
      entityType: 'player'
    })

    this.type = type
    this.name = name
    this.health = health

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

    d.addEntityToIndex('player', this)

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

    // key press velocity changes for player and player movement states

    // UP

    if (this.canMoveUp()) {
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
    }
    else if (keys.up.pressed || this.state.moving.up) {
      this.vY = 0
      this.state.moving.up = false
    }

    // DOWN

    if (this.canMoveDown()) {

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

    }
    else if (keys.down.pressed || this.state.moving.down) {
      this.vY = 0
      this.state.moving.down = false
    }

    // LEFT

    if (this.canMoveLeft()) {
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
    }
    else if (keys.left.pressed || this.state.moving.left) {
      this.vX = 0
      this.state.moving.left = false
    }

    // RIGHT

    if (this.canMoveRight()) {
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
    }
    else if (keys.right.pressed || this.state.moving.right) {
      this.vX = 0
      this.state.moving.right = false
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

  getUpwardDestination() { return this.y - Math.abs(this.vY) - 1 }
  getDownwardDestination() { return this.y + this.height + Math.abs(this.vY) + 1 }
  getLeftDestination() { return this.x - Math.abs(this.vX) - 1 }
  getRightDestination() { return this.x + this.width + Math.abs(this.vX) + 1 }

  getBlockAboveTopLeftDelta() { return d.getBlockDelta(this.x, this.getUpwardDestination()) }
  getBlockAboveTopRightDelta() { return d.getBlockDelta(this.x + this.width, this.getUpwardDestination()) }
  getBlockBelowBottomLeftDelta() { return d.getBlockDelta(this.x, this.getDownwardDestination()) }
  getBlockBelowBottomRightDelta() { return d.getBlockDelta(this.x + this.width, this.getDownwardDestination()) }

  getBlockAboveTopLeft() {
    let delta = this.getBlockAboveTopLeftDelta()
    return d.hasBlock(delta) ? d.block(delta) : null
  }
  getBlockAboveTopRight() {
    let delta = this.getBlockAboveTopRightDelta()
    return d.hasBlock(delta) ? d.block(delta) : null
  }
  getBlockBelowBottomLeft() {
    let delta = this.getBlockBelowBottomLeftDelta()
    return d.hasBlock(delta) ? d.block(delta) : null
  }
  getBlockBelowBottomRight() {
    let delta = this.getBlockBelowBottomRightDelta()
    return d.hasBlock(delta) ? d.block(delta) : null
  }

  getBlockBeforeTopLeftDelta() { return d.getBlockDelta(this.getLeftDestination(), this.y) }
  getBlockAfterTopRightDelta() { return d.getBlockDelta(this.getRightDestination(), this.y) }
  getBlockBeforeBottomLeftDelta() { return d.getBlockDelta(this.getLeftDestination(), this.y + this.height) }
  getBlockAfterBottomRightDelta() { return d.getBlockDelta(this.getRightDestination(), this.y + this.height) }

  getBlockBeforeTopLeft() {
    let delta = this.getBlockBeforeTopLeftDelta()
    return d.hasBlock(delta) ? d.block(delta) : null
  }
  getBlockAfterTopRight() {
    let delta = this.getBlockAfterTopRightDelta()
    return d.hasBlock(delta) ? d.block(delta) : null
  }
  getBlockBeforeBottomLeft() {
    let delta = this.getBlockBeforeBottomLeftDelta()
    return d.hasBlock(delta) ? d.block(delta) : null
  }
  getBlockAfterBottomRight() {
    let delta = this.getBlockAfterBottomRightDelta()
    return d.hasBlock(delta) ? d.block(delta) : null
  }

  canMoveUp() {
    let blockAboveTopLeft = this.getBlockAboveTopLeft()
    let blockAboveTopRight = this.getBlockAboveTopRight()
    return blockAboveTopLeft && !blockAboveTopLeft.solid && blockAboveTopRight && !blockAboveTopRight.solid
  }
  canMoveDown() {
    let blockBelowBottomLeft = this.getBlockBelowBottomLeft()
    let blockBelowBottomRight = this.getBlockBelowBottomRight()
    return blockBelowBottomLeft && !blockBelowBottomLeft.solid && blockBelowBottomRight && !blockBelowBottomRight.solid
  }
  canMoveLeft() {
    let blockBeforeTopLeft = this.getBlockBeforeTopLeft()
    let blockBeforeBottomLeft = this.getBlockBeforeBottomLeft()
    return blockBeforeTopLeft && !blockBeforeTopLeft.solid && blockBeforeBottomLeft && !blockBeforeBottomLeft.solid
  }
  canMoveRight() {
    let blockAfterTopRight = this.getBlockAfterTopRight()
    let blockAfterBottomRight = this.getBlockAfterBottomRight()
    return blockAfterTopRight && !blockAfterTopRight.solid && blockAfterBottomRight && !blockAfterBottomRight.solid
  }

  movementInfo() {

    let upwardDestination = this.getUpwardDestination()
    let downwardDestination = this.getDownwardDestination()
    let leftDestination = this.getLeftDestination()
    let rightDestination = this.getRightDestination()

    let blockAboveTopLeftDelta = this.getBlockAboveTopLeftDelta()
    let blockAboveTopRightDelta = this.getBlockAboveTopRightDelta()
    let blockBelowBottomLeftDelta = this.getBlockBelowBottomLeftDelta()
    let blockBelowBottomRightDelta = this.getBlockBelowBottomRightDelta()

    let blockAboveTopLeft = this.getBlockAboveTopLeft()
    let blockAboveTopRight = this.getBlockAboveTopRight()
    let blockBelowBottomLeft = this.getBlockBelowBottomLeft()
    let blockBelowBottomRight = this.getBlockBelowBottomRight()

    let blockBeforeTopLeftDelta = this.getBlockBeforeTopLeftDelta()
    let blockAfterTopRightDelta = this.getBlockAfterTopRightDelta()
    let blockBeforeBottomLeftDelta = this.getBlockBeforeBottomLeftDelta()
    let blockAfterBottomRightDelta = this.getBlockAfterBottomRightDelta()

    let blockBeforeTopLeft = this.getBlockBeforeTopLeft()
    let blockAfterTopRight = this.getBlockAfterTopRight()
    let blockBeforeBottomLeft = this.getBlockBeforeBottomLeft()
    let blockAfterBottomRight = this.getBlockAfterBottomRight()

    let canMoveUp = this.canMoveUp()
    let canMoveDown = this.canMoveDown()
    let canMoveLeft = this.canMoveLeft()
    let canMoveRight = this.canMoveRight()

    console.log('destinations')
    console.log({
      upwardDestination,
      downwardDestination,
      leftDestination,
      rightDestination
    })

    console.log('block above/below delta')
    console.log({
      blockAboveTopLeftDelta,
      blockAboveTopRightDelta,
      blockBelowBottomLeftDelta,
      blockBelowBottomRightDelta
    })

    console.log('block above/below')
    console.log({
      blockAboveTopLeft,
      blockAboveTopRight,
      blockBelowBottomLeft,
      blockBelowBottomRight
    })

    console.log('block before/after delta')
    console.log({
      blockBeforeTopLeftDelta,
      blockAfterTopRightDelta,
      blockBeforeBottomLeftDelta,
      blockAfterBottomRightDelta
    })

    console.log('block before/after')
    console.log({
      blockBeforeTopLeft,
      blockAfterTopRight,
      blockBeforeBottomLeft,
      blockAfterBottomRight
    })

    console.log('movement')
    console.log({
      canMoveUp,
      canMoveDown,
      canMoveLeft,
      canMoveRight
    })

    console.log('position')
    console.log({
      x: this.x,
      y: this.y
    })

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
