class Block {

  constructor({
    delta,
    type,
    selected = 0,
    solid = 0
  }) {

    this.delta = delta
    this.type = type
    this.selected = selected
    this.solid = solid

  }

  // abstracts

  update() {}

  draw(x, y) {}

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

}
