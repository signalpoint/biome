class Block {

  constructor({
    delta,
    type,
    selected = 0,
    solid = 0,
    health = 100,
    canvasMouseDownInterval = 500
  }) {

    this.delta = delta
    this.type = type
    this.selected = selected
    this.solid = solid
    this.health = health
    this.canvasMouseDownInterval = canvasMouseDownInterval

    //d.addBlockToIndex(this)

  }

  // abstracts

  update() {

    // mine the block (if it ran out of health)
    if (!this.health) {
      player.mineBlock(this.delta)
    }

  }

  draw(x, y) {}

  hit(force) {
//    console.log(`block: ${this.health} - ${force}`)
    this.health -= force
    if (this.health < 0) { this.health = 0 }
  }

  select() { this.selected = 1 }
  deselect() { this.selected = 0 }

  isBedrock() { return this.type == 'Bedrock' }
  isBorder() { return this.type == 'Border' }
  canBeMined() { return !this.isBedrock() && !this.isBorder() }

  handleCollisionWithPlayer(player) {

    if (this.solid) {
      if (player.isMovingUp()) { player.state.collision.top = true }
      if (player.isMovingDown()) { player.state.collision.bottom = true }
      if (player.isMovingLeft()) { player.state.collision.left = true }
      if (player.isMovingRight()) { player.state.collision.right = true }
    }

  }

  canvasMouseDownHoldListener(e) {
//    if (mouse.left.pressed) { console.log('left hold', mouse.left.timer.getElapsedTime()) }
//    if (mouse.right.pressed) { console.log('right hold', mouse.right.timer.getElapsedTime()) }
  }

}
