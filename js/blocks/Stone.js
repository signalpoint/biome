class Stone extends Block {

  constructor({
    id = null,
    delta,
    type = 'Stone',
    selected = 0,
    health = 100
  }) {

    super({
      id,
      delta,
      type,
      selected,
      solid: 1,
      health,
      hardness: 2000
    })

  }

  fillStyle() { return '#6c757d' }

}
