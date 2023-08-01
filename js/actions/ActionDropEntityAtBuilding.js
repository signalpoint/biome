class ActionDropEntityAtBuilding extends Action {

  constructor({
    delta, // the building delta
    type, // block, item
    data
  }) {

    super({

    })

    this.delta = delta
    this.type = type
    this.data = data

  }

  // methods

  getBuilding() { return d.building(this.delta) }

  // abstracts / interfaces

  update(npc) {

    let building = this.getBuilding()
    let pos = building.getPosition()

  }

}
