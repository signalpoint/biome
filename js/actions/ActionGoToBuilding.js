class ActionGoToBuilding extends Action {

  constructor({
    delta // the building delta
  }) {

    super({

    })

    this.delta = delta

  }

  // methods

  getBuilding() { return d.buildings[this.delta] }

  // abstracts / interfaces

  update(npc) {

    let building = this.getBuilding()
    let pos = building.getPosition()

    if (npc.x == pos.x && npc.y == pos.y) {
      building.handleVillagerArrival(npc)
      npc.finishAction()
    }

    if (npc.x < pos.x) { npc.x++ } // move right
    else if (npc.x > pos.x) { npc.x-- } // move left

    if (npc.y > pos.y) { npc.y-- } // move up
    else if (npc.y < pos.y) { npc.y++ } // move down

  }

}
