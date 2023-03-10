class Sand extends Block {

  constructor(delta) {

    super(delta)

  }

  update() {

  }

  draw(x, y) {

    c.beginPath()
    c.rect(x * d.getBlockSize(), y * d.getBlockSize(), d.getBlockSize(), d.getBlockSize())
    c.fillStyle = '#ffe6a7'
    c.fill()

  }

}
