class OakPlank extends Block {

  constructor({
    id = null,
    delta = null,
    type = 'OakPlank',
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
      hardness: 500
    })

  }

  fillStyle() { return '#7f4f24' }

}
