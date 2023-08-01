class Bedrock extends Block {

  constructor({
    id = null,
    delta,
    type = 'Bedrock',
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
      health
    })

  }

  fillStyle() { return this.solid ? '#111' : '#222' }

}
