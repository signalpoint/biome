class ActionTakeEntityFromBuilding extends Action {

  constructor({
    delta, // the building delta
    type // block, item
  }) {

    super({

    })

    this.delta = delta
    this.type = type

  }

  // methods

  getBuilding() { return d.buildings[this.delta] }

  // abstracts / interfaces

  update(npc) {

    let building = this.getBuilding()
    let pos = building.getPosition()

//      npc.finishAction()

  }

}
