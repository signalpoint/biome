class DesignerGame {

  constructor() {

  }

//  save() {
//    dStorage.save('dGame', {
//    })
//  }
//
//  load() {
//    let g = dStorage.load('dGame')
//    if (g) {
//    }
//  }

  init() {

    // init player belt
    player.initBelt()

  }

  canvasMouseMoveListener(e) {

  }

  canvasMouseDownListener(e) {

    let delta = d.getMouseDownBlockDelta()
    let block = d.blocks[delta]
    let isBedrock = block.type == 'Bedrock'

    if (block) {

      // An existing block...

      // If they clicked a block under the player...
      if (player.getBlockDeltasFromPosition().includes(delta)) {

        // MINING

        if (e.which == 1) { // left click...

          // If not on bedrock and the belt isn't full...
          if (!isBedrock && !player.beltIsFull()) {

            // "mine the "block" by adding it to the belt
            player.addBlockToBelt(delta)

            // place bedrock down in its place
            dMode.paintNewBlock(delta, 'Bedrock')

            // refresh the belt
            player.refreshBelt()

          }

        }

        // PLACING

        else if (e.which == 3) { // right click...

          // If the block was bedrock...
          if (isBedrock) {

            // place the block from their active belt item
            let index = player.getActiveBeltButtonIndex()
            let item = player.getBeltItem(index)
            if (item) {
              dMode.paintBlock(delta, item)
              player.deleteBeltItem(index)
              player.refreshBelt()
            }

          }

        }

      }

    }

  }

  canvasMouseUpListener(e) {

    let timer = mouse.left.timer

    let elapsedTime = timer.getElapsedTime()

    if (elapsedTime > 1000) { // long press...

//      console.log('long')

    }
    else if (elapsedTime > 500) { // medium press...

//      console.log('medium')

    }
    else { // quick press...

//      console.log('quick')

      // move the player...



    }

  }

  canvasMouseWheelListener(e) {

    // BELT

    let index = player.getActiveBeltButtonIndex()

    // trying to move rightbelt...
    if (e.deltaY > 0) {

      if (index == player.getBeltSize() - 1) {

        // all the way right...

      }
      else {

        // move right...
        index++

      }
    }

    // trying to move left...
    else {

      if (index == 0)  {

        // all the way left...

      }
      else {

        // move left...
        index--

      }


    }

    player.changeActiveBeltButton(index)

  }

}
