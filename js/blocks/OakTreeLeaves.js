class OakTreeLeaves extends Block {

  constructor({
    id = null,
    delta,
    type = 'OakTreeLeaves',
    selected = 0,
    health = 100
  }) {

    super({
      id,
      delta,
      type,
      selected,
      health,
      hardness: 25
    })

  }

  fillStyle() { return this.solid ? '#1b4332' : '#2d6a4f' }

}
