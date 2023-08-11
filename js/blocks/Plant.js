class Plant extends Block {

  constructor({
    id = null,
    delta = null,
    type,
    health = 100,
    hardness = 10,
    timePlanted = null, // the time the plant was planted
    daysToGrow // the number of days to grow to maturity
  }) {

    super({
      id,
      delta,
      type,
      solid: 1,
      health,
      hardness
    })

    this.daysToGrow = daysToGrow
    this.timePlanted = timePlanted

  }

  update() {

//    console.log(this.ageInDays())

    super.update()

    if (this.isDoneGrowing()) {

      let def = d.getEntityDefinition('block', this.type)
      let delta = this.delta

      // destroy the plant block
      d.destroy(this)

      // place the new target block
      let block = d.create('block', def.growsInto)
      d.blocks[delta] = block.id
      block.delta = delta

      block.onplace()

      d.saveCurrentMap()

    }

  }

  fillStyle() {
    return this.lifeCycleColors()[Math.floor((this.ageInDays() / this.daysToGrow) * this.lifeCycleColors().length)]
  }

  onplace() {
    this.timePlanted = game.getGameTime()
  }

  /**
   * Returns the age of the plant (in milliseconds).
   * @returns {Number}
   */
  age() { return game.getGameTime() - this.timePlanted }

  /**
   * Returns the age of the plant in days (game days).
   * @returns {Number}
   */
  ageInDays() { return this.age() / game.getDayLength() }

  /**
   * Returns true if the plant is done growing.
   * @returns {Boolean}
   */
  isDoneGrowing() { return this.ageInDays() >= this.daysToGrow }

}
