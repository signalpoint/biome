class ActionGoToBlock extends Action {

  constructor({
    delta // the block delta
  }) {

    super({

    })

    this.delta = delta

  }

  // methods

  getBlock() { return d.blocks[this.delta] }

  // abstracts / interfaces

  update(npc) {

    let pos = d.getBlockPosFromDelta(this.delta)

    if (npc.x == pos.x && npc.y == pos.y) {
      npc.finishAction()
    }

    if (npc.x < pos.x) { npc.x++ } // move right
    else if (npc.x > pos.x) { npc.x-- } // move left

    if (npc.y > pos.y) { npc.y-- } // move up
    else if (npc.y < pos.y) { npc.y++ } // move down

  }

}
