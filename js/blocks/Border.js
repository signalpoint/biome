class Border extends Block {

  constructor({
    id = null,
    delta,
    type = 'Border',
    selected = 0,
    solid = 1,
    health = 100
  }) {

    super({
      id,
      delta,
      type,
      selected,
      solid,
      health
    })

  }

  draw(x, y) {

    c.beginPath()
    c.rect(x * d.getBlockSize(), y * d.getBlockSize(), d.getBlockSize(), d.getBlockSize())
    c.fillStyle = '#000'
    c.fill()

  }

}
