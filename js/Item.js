class Item extends Entity {

  constructor({
    id = null,
    type,
    width,
    height,
    health = 100
  }) {

    super({
      id,
      entityType: 'item'
    })

    this.type = type
    this.width = width
    this.height = height
    this.health = health

    d.addEntityToIndex('item', this)

  }

  // abstracts / interfaces

  draw() {}

  // methods

  getRequirements() {

    return dItems.getRequirements(this.constructor.name)

  }

}
