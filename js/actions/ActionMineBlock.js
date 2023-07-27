class ActionMineBlock extends Action {

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

    let block = this.getBlock()

    // If the block can be mined and the belt isn't full...
    if (block.canBeMined() && !npc.belt.isFull()) {

      // add it to the belt
      npc.belt.add(block)

      // remove the block from the index
      d.removeBlockFromIndex(block)

      // place bedrock down in its place
      dMode.paintNewBlock(this.delta, 'Bedrock')

      // save the map
      d.saveCurrentMap()

      npc.finishAction()

      npc.refreshWidget()

    }
    else {
      console.log('npc failed to mine block')
      npc.failAction()
    }

  }

}
