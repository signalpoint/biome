class Item extends Entity {

  constructor({
    id,
    type,
    width,
    height
  }) {

    super({
      id,
      entityType: 'item'
    })

    this.type = type
    this.width = width
    this.height = height

  }

  // abstracts / interfaces

  draw() {}

  // methods



  getRequirements() {

    return dItems.getRequirements(this.constructor.name)

  }

}
