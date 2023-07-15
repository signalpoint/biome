class Campground extends Building {

  constructor({
    delta,
    type,
    width = 64,
    height = 64
  }) {

    super({
      delta,
      type,
      width,
      height
    })

  }

  update() {

  }

  draw(x, y) {

    c.beginPath()

    c.fillStyle = '#bcb8b1'
    c.fillRect(x * d.getBlockSize(), y * d.getBlockSize(), this.width, this.height)

    c.fillStyle = '#463f3a'
    c.fillRect(x * d.getBlockSize() + this.width / 4, y * d.getBlockSize() + this.height / 4, this.width / 2, this.height / 2)

    c.strokeStyle = 'black'
    c.lineWidth = 2
    c.strokeRect(x * d.getBlockSize(), y * d.getBlockSize(), this.width, this.height)
    c.strokeRect(x * d.getBlockSize() + this.width / 4, y * d.getBlockSize() + this.height / 4, this.width / 2, this.height / 2)

  }

}
