// TODO rename to OakLog
class OakTreeWood extends Block {

  constructor({
    id = null,
    delta,
    type = 'OakTreeWood',
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
      hardness: 1000
    })

  }

  fillStyle() { return this.solid ? '#582f0e' : '#7f4f24' }

}
