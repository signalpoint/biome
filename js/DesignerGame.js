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
    player.refreshBelt()

  }

  canvasMouseMoveListener(e) {

  }

  canvasMouseDownListener(e) {

    let leftClick = e.which == 1
    let rightClick = e.which == 3
    let currentPlayerMode = playerMode.getMode()

    // BELT
    if (currentPlayerMode == 'belt') {
      console.log('belt it')
    }

    // BUILD
    else if (currentPlayerMode == 'build') {
      console.log('build it')
    }

    // PAINT
    else if (currentPlayerMode == 'paint') {
      console.log('paint it')
    }

    playerMode.canvasMouseDownListener(e)

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
