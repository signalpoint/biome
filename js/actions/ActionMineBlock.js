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
    if (block.canBeMined() && !npc.beltIsFull()) {

      // "mine the block" by adding it to the belt
      npc.addBlockToBelt(this.delta)

      // remove the block from the index
      d.removeBlockFromIndex(block)

      // place bedrock down in its place
      dMode.paintNewBlock(this.delta, 'Bedrock')

      // save the map
      d.saveCurrentMap()

      npc.finishAction()

    }
    else {
      console.log('npc failed to mine block')
      npc.failAction()
    }

  }

}
