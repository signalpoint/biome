class Water extends Block {

  constructor({
    id = null,
    delta,
    type = 'Water',
    selected = 0,
    health = 100
  }) {

    super({
      id,
      delta,
      type,
      selected,
      health,
      hardness: 1
    })

  }

  fillStyle() { return '#90e0ef' }

}
