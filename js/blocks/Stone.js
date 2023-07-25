class Stone extends Block {

  constructor({
    id = null,
    delta,
    type = 'Stone',
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
    c.fillStyle = this.solid ? '#6c757d' : '#adb5bd'
    c.fill()

  }

}
