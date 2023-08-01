class Sand extends Block {

  constructor({
    id = null,
    delta,
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

  fillStyle() { return this.solid ? '#cc9f69' : '#ffe6a7' }

}
