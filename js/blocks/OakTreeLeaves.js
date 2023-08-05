class OakTreeLeaves extends Block {

  constructor({
    id = null,
    delta = null,
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

  fillStyle() { return '#2d6a4f' }

}
