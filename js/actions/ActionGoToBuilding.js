class ActionGoToBuilding extends Action {

  constructor({
    delta // the building delta
  }) {

    super({

    })

    this.delta = delta

  }

  // methods

  getBuilding() { return d.building(this.delta) }

  // abstracts / interfaces

  update(npc) {

    let building = this.getBuilding()
    let pos = building.getPosition()

    if (npc.x == pos.x && npc.y == pos.y) {
//      console.log(`${npc.name} arrived at ${building.type}`)
      npc.finishAction()
      building.handleVillagerArrival(npc)
    }

    if (npc.x < pos.x) { npc.x++ } // move right
    else if (npc.x > pos.x) { npc.x-- } // move left

    if (npc.y > pos.y) { npc.y-- } // move up
    else if (npc.y < pos.y) { npc.y++ } // move down

  }

}
