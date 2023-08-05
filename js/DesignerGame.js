class DesignerGame {

  constructor() {

  }

  init() {

    // init player belt
    player.belt.init()
    player.belt.refresh()

  }

  canvasMouseMoveListener(e) { }

  canvasMouseDownListener(e) {

    playerMode.canvasMouseDownListener(e)

  }

  canvasMouseUpListener(e) {

    playerMode.canvasMouseUpListener(e)

  }

  canvasMouseWheelListener(e) {

    // BELT

    let index = player.belt.getActiveButtonIndex()

    // trying to move rightbelt...
    if (e.deltaY > 0) {

      if (index == BELT_SIZE - 1) {

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

    player.belt.changeActiveButton(index)

    playerMode.canvasMouseWheelListener(e)

  }

}
