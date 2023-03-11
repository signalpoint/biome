class Block {

  constructor({
    delta,
    type
  }) {

    this.delta = delta
    this.type = type

  }

  // abstracts

  update() {}

  draw(x, y) {}

}
