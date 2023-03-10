class Grass extends Block {

  constructor(delta) {

    super(delta)

  }

  update() {

  }

  draw(x, y) {

    c.beginPath()
    c.rect(x * d.getBlockSize(), y * d.getBlockSize(), d.getBlockSize(), d.getBlockSize())
    c.fillStyle = '#25a244'
    c.fill()

  }

}
