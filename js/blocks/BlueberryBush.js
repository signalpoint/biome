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

    c.strokeStyle = "rgb(0, 0, 0)"
    c.fillStyle = '#0077b6'
    c.beginPath()
    c.roundRect(x * d.getBlockSize(), y * d.getBlockSize(), d.getBlockSize(), d.getBlockSize(), 20)
    c.stroke()
    c.fill()

  }

}
