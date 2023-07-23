class OakPlank extends Block {

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

  draw(x, y) {

    c.beginPath()
    c.rect(x * d.getBlockSize(), y * d.getBlockSize(), d.getBlockSize(), d.getBlockSize())
//    c.fillStyle = this.solid ? '#582f0e' : '#7f4f24'
    c.fillStyle = this.solid ? '#000' : '#fff'
    c.fill()

  }

}
