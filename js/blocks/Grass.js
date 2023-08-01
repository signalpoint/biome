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

  fillStyle() { return this.solid ? '#1a7431' : '#25a244' }

}
