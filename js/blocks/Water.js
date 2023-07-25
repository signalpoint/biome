class Water extends Block {

  constructor({
    id = null,
    delta,
    type = 'Water',
    selected = 0,
    solid = 0
  }) {

    super({
      id,
      delta,
      type,
      selected,
      solid
    })

  }

  draw(x, y) {

    c.beginPath()
    c.rect(x * d.getBlockSize(), y * d.getBlockSize(), d.getBlockSize(), d.getBlockSize())
    c.fillStyle = '#90e0ef'
    c.fill()

  }

}
