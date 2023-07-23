class Grass extends Block {

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
      solid,
      canvasMouseDownInterval: 210 // essentially the axe attack speed
    })

  }

  draw(x, y) {

    c.beginPath()
    c.rect(x * d.getBlockSize(), y * d.getBlockSize(), d.getBlockSize(), d.getBlockSize())
    c.fillStyle = this.solid ? '#1a7431' : '#25a244'
    c.fill()

    if (this.health < 100) {

      c.globalAlpha = (100 - this.health) * .01
      c.fillStyle = 'black'
      c.fillRect(x * d.getBlockSize(), y * d.getBlockSize(), d.getBlockSize(), d.getBlockSize())
      c.globalAlpha = 1.0;

//      let maxRadius = d.getBlockSize() / 2
//      let radius = maxRadius / this.health
//      c.beginPath()
//      c.arc(
//        x * d.getBlockSize() + d.getBlockSize() / 2,
//        y * d.getBlockSize() + d.getBlockSize() / 2,
//        radius, 0, 2 * Math.PI
//      )
//      c.fill()

    }

  }

}
