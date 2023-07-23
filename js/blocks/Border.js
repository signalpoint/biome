class Border extends Block {

  constructor({
    delta,
    type,
    selected = 0,
    solid = 1
  }) {

    super({
      delta,
      type,
      selected,
      solid
    })

  }

  draw(x, y) {

    c.beginPath()
    c.rect(x * d.getBlockSize(), y * d.getBlockSize(), d.getBlockSize(), d.getBlockSize())
    c.fillStyle = '#000'
    c.fill()

  }

}
