class Block extends Entity {

  constructor({
    id = null,
    delta = null,
    type,
    selected = 0,
    solid = 0,
    health = 100,
    hardness = 100
  }) {

    super({
      id,
      entityType: 'block'
    })

    this.delta = delta
    this.type = type
    this.selected = selected
    this.solid = solid
    this.health = health
    this.hardness = hardness

    d.addEntityToIndex('block', this)

  }

  // abstracts

  update() {

    // mine the block (if it ran out of health)
    if (!this.health) {
      player.mineBlock(this.delta)
    }

  }

  // event handler when block is placed
  onplace() { }

  draw(x, y) {

    c.beginPath()
    c.rect(x * d.getBlockSize(), y * d.getBlockSize(), d.getBlockSize(), d.getBlockSize())
    c.fillStyle = this.fillStyle()
    c.fill()

    if (this.health < 100) {
      d.dig(this, x, y)
    }

  }

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
