class BlueberryBush extends Block {

  constructor({
    id = null,
    delta = null,
    type = 'BlueberryBush',
    selected = 0,
    health = 100
  }) {

    super({
      id,
      delta,
      type,
      selected,
      solid: 1,
      health,
      hardness: 150
    })

  }

  draw(x, y) {

    c.strokeStyle = "rgb(0, 0, 0)"
    c.fillStyle = '#0077b6'
    c.beginPath()
    c.roundRect(x * d.getBlockSize(), y * d.getBlockSize(), d.getBlockSize(), d.getBlockSize(), 20)
    c.stroke()
    c.fill()

    if (this.health < 100) {
      d.dig(this, x, y)
    }

  }

}
