class Stone extends Block {

  constructor({
    id = null,
    delta,
    type = 'Stone',
    selected = 0,
    solid = 0,
    health = 100
  }) {

    super({
      id,
      delta,
      type,
      selected,
      solid,
      health,
      hardness: 2000
    })

  }

  fillStyle() { return this.solid ? '#6c757d' : '#adb5bd' }

}
