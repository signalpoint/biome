class Grass extends Block {

  constructor({
    id = null,
    delta,
    type = 'Grass',
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

  fillStyle() { return '#25a244' }

}
