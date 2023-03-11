class Water extends Block {

  constructor({
    delta,
    type
  }) {

    super({
      delta,
      type
    })

  }

  update() {

  }

  draw(x, y) {

    c.beginPath()
    c.rect(x * d.getBlockSize(), y * d.getBlockSize(), d.getBlockSize(), d.getBlockSize())
    c.fillStyle = '#90e0ef'
    c.fill()

  }

}
