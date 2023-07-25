// TODO rename to OakLog
class OakTreeWood extends Block {

  constructor({
    id = null,
    delta,
    type = 'OakTreeWood',
    selected = 0,
    solid = 0,
    canvasMouseDownInterval = 100
  }) {

    super({
      id,
      delta,
      type,
      selected,
      solid,
      canvasMouseDownInterval
    })

  }

  draw(x, y) {

    c.beginPath()
    c.rect(x * d.getBlockSize(), y * d.getBlockSize(), d.getBlockSize(), d.getBlockSize())
    c.fillStyle = this.solid ? '#582f0e' : '#7f4f24'
    c.fill()

  }

}
