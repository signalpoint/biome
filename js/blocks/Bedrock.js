class Bedrock extends Block {

  constructor({
    id = null,
    delta,
    type = 'Bedrock',
    selected = 0,
    health = 100
  }) {

    super({
      id,
      delta,
      type,
      selected,
      health
    })

  }

  fillStyle() { return '#111' }

}
