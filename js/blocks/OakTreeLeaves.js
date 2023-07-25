class OakTreeLeaves extends Block {

  constructor({
    id = null,
    delta,
    type = 'OakTreeLeaves',
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
    c.fillStyle = this.solid ? '#1b4332' : '#2d6a4f'
    c.fill()

  }

}
