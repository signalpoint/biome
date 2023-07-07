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

}
