class OakFloor extends Block {

  constructor({
    id = null,
    delta = null,
    type = 'OakFloor',
    selected = 0,
    health = 100
  }) {

    super({
      id,
      delta,
      type,
      selected,
      health,
      hardness: 250
    })

  }

  fillStyle() { return '#a68a64' }

}
