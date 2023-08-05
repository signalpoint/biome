// TODO rename to OakLog
class OakTreeWood extends Block {

  constructor({
    id = null,
    delta = null,
    type = 'OakTreeWood',
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
//      hardness: 1000
      hardness: 100
    })

  }

  fillStyle() { return '#582f0e' }

}
