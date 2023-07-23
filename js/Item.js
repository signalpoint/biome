class Item {

  constructor({
    id,
    type,
    width,
    height
  }) {

    this.id = id
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
