class Block {

  constructor({
    delta,
    type,
    selected = 0,
    solid = 0
//    edges = null
  }) {

    this.delta = delta
    this.type = type
    this.selected = selected
    this.solid = solid

//    this.edges = edges ? edges : {
//      t: 0, // top
//      b: 0, // bottom
//      s: 0, // start
//      e: 0 // end
//    }

  }

  // abstracts

  update() {}

  draw(x, y) {}

  select() { this.selected = 1 }
  deselect() { this.selected = 0 }

  handleCollisionWithPlayer(player) {

    if (this.solid) {
      if (player.isMovingUp()) { player.state.collision.top = true }
      if (player.isMovingDown()) { player.state.collision.bottom = true }
      if (player.isMovingLeft()) { player.state.collision.left = true }
      if (player.isMovingRight()) { player.state.collision.right = true }
    }

  }

}
