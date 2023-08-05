class Border extends Block {

  constructor({
    id = null,
    delta = null,
    type = 'Border',
    selected = 0,
    health = 100
  }) {

    super({
      id,
      delta,
      type,
      selected,
      solid: 1,
      health
    })

  }

  fillStyle() { return '#000' }

}
