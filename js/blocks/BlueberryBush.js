class BlueberryBush extends Block {

  constructor({
    delta,
    type,
    selected = 0,
    solid = 0
  }) {

    super({
      delta,
      type,
      selected,
      solid
    })

  }

  update() {

  }

  draw(x, y) {

    c.beginPath()
    c.rect(x * d.getBlockSize(), y * d.getBlockSize(), d.getBlockSize(), d.getBlockSize())
    c.fillStyle = '#0077b6'
    c.fill()

  }

}