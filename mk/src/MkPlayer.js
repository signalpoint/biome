import MkEntity from './MkEntity.js';

export default class MkPlayer extends MkEntity {

  constructor({
    id = null,
    name = null,
    x,
    y,
    width,
    height,
    vX = 0,
    vY = 0,
    vMaxX = 5,
    vMaxY = 5,
    gravity = null,
    state = null
  }) {

    super({
      id,
      type: 'player'
    })

    this.name = name
    this.x = x
    this.y = y
    this.width = width
    this.height = height
    this.vX = vX
    this.vY = vY
    this.vMaxX = vMaxX
    this.vMaxY = vMaxY
    this.gravity = gravity
    this.state = state

  }

  update() { }

  draw() { }

}
