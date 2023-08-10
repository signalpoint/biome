class Daisy extends Block {

  constructor({
    id = null,
    delta = null,
    type = 'Daisy',
    selected = 0,
    health = 100
  }) {

    super({
      id,
      delta,
      type,
      selected,
      health,
      hardness: 100
    })

  }

  fillStyle() { return '#ffea00' }

}
