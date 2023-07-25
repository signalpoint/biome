class Axe extends Item {

  constructor({
    id = null
  }) {

    super({
      id,
      type: 'Axe',
      width: 6,
      height: 24
    })

    this.handleColor = '#936639'
    this.handleHeight = 36
    this.handleWidth = 6

    this.bladeColor = '#6c757d'
    this.bladeHeight = 14
    this.bladeWidth = 18

  }

  // abstracts / interfaces

  draw(x, y, obj) {

    c.fillStyle = this.handleColor

    if (obj.state.facing.up) {

      // up + left
//      if (obj.state.facing.left) {}

      // up + right
//      else if (obj.state.facing.right) {}

      // up
//      else {
        this.drawHandle(x + obj.width - this.handleWidth * 2, y - this.handleHeight, this.handleWidth, this.handleHeight)
        this.drawBlade(x + obj.width - this.handleWidth * 2 - this.bladeWidth, y - this.handleHeight, this.bladeWidth, this.bladeHeight)
//      }

    }
    else if (obj.state.facing.down) {

      // down + left
//      if (obj.state.facing.left) {}

      // down + left
//      else if (obj.state.facing.right) {}

      // down
//      else {
        this.drawHandle(x + this.handleWidth, y + obj.height, this.handleWidth, this.handleHeight)
        this.drawBlade(x + this.handleWidth * 2, y + obj.height + this.handleHeight - this.bladeHeight, this.bladeWidth, this.bladeHeight)
//      }

    }

    // left
    else if (obj.state.facing.left) {
      this.drawHandle(x - this.handleHeight, y + this.handleWidth, this.handleHeight, this.handleWidth)
      this.drawBlade(x - this.handleHeight - this.bladeHeight, y + this.handleWidth, this.bladeHeight, this.bladeWidth)
    }

    // right
    else if (obj.state.facing.right) {
      this.drawHandle(x + obj.width, y + obj.height - this.handleWidth * 2, this.handleHeight, this.handleWidth)
      this.drawBlade(x + obj.width + this.handleHeight, y + obj.height - this.handleWidth * 4, this.bladeHeight, this.bladeWidth)
    }

  }

  drawHandle(x, y, width, height) {
    c.fillStyle = this.handleColor
    c.fillRect(x, y, width, height)
  }

  drawBlade(x, y, width, height) {
    c.fillStyle = this.bladeColor
    c.fillRect(x, y, width, height)
  }

}
