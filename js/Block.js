class Block {

  constructor({
    delta,
    type,
    selected = false
//    edges = null
  }) {

    this.delta = delta
    this.type = type
    this.selected = selected
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

  select() { this.selected = true }
  deselect() { this.selected = false }

}
