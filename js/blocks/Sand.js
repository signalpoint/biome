class Sand extends Block {

  constructor({
    id = null,
    delta = null,
    type = 'Sand',
    selected = 0,
    health = 100
  }) {

    super({
      id,
      delta,
      type,
      selected,
      health
    })

  }

  fillStyle() { return '#ffe6a7' }

}
