const keys = {

  // player
  up: {
    pressed: false
  },
  down: {
    pressed: false
  },
  left: {
    pressed: false
  },
  right: {
    pressed: false
  },

  // camera
  cameraUp: {
    pressed: false
  },
  cameraDown: {
    pressed: false
  },
  cameraLeft: {
    pressed: false
  },
  cameraRight: {
    pressed: false
  }

}

class DesignerKeyboard {

  constructor() {

  }

  init() {

  }

  // KEY DOWN

  keydown({ keyCode }) {

    console.log('keydown', keyCode)

    switch (keyCode) {

      // CAMERA

      // up (arrow)
      case 38:
        keys.cameraUp.pressed = true
        dCamera.move('up')
        dCamera.save()
        break

      // down (arrow)
      case 40:
        keys.cameraDown.pressed = true
        dCamera.move('down')
        dCamera.save()
        break

      // left (arrow)
      case 37:
        keys.cameraLeft.pressed = true
        dCamera.move('left')
        dCamera.save()
        break

      // right (arrow)
      case 39:
        keys.cameraRight.pressed = true
        dCamera.move('right')
        dCamera.save()
        break

    }

    // PAUSED...

    if (d.isPaused()) {

      // play (SPACE)
      if (keyCode == 32) {
        playBtn.click();
      }

    }
    else {

      // PLAYING...

      switch (keyCode) {

        // pause (SPACE)
        case 32: pauseBtn.click(); break

        // PLAYER

        // up (W)
        case 87: keys.up.pressed = true; break

        // down (A)
        case 83: keys.down.pressed = true; break

        // left (S)
        case 65: keys.left.pressed = true; break

        // right (D)
        case 68: keys.right.pressed = true; break

        // BELT

        // 1, 2, 3, ..., 0
        case 49: player.changeActiveBeltButton(0); break; // 1
        case 50: player.changeActiveBeltButton(1); break; // 2
        case 51: player.changeActiveBeltButton(2); break; // 3
        case 52: player.changeActiveBeltButton(3); break; // 4
        case 53: player.changeActiveBeltButton(4); break; // 5
        case 54: player.changeActiveBeltButton(5); break; // 6
        case 55: player.changeActiveBeltButton(6); break; // 7
        case 56: player.changeActiveBeltButton(7); break; // 8
        case 57: player.changeActiveBeltButton(8); break; // 9
        case 48: player.changeActiveBeltButton(9); break; // 0

      }

    }

  }

  // KEY UP

  keyup({ keyCode }) {

    switch (keyCode) {

      // CAMERA

      // up (arrow)
      case 38: keys.cameraUp.pressed = false; break

      // down (arrow)
      case 40: keys.cameraDown.pressed = false; break

      // left (arrow)
      case 37: keys.cameraLeft.pressed = false; break

      // right (arrow)
      case 39: keys.cameraRight.pressed = false; break

    }

    if (d.isPaused()) {

    }
    else {

      switch (keyCode) {

        // PLAYER

        // up (W)
        case 87: keys.up.pressed = false; break

        // down (S)
        case 83: keys.down.pressed = false; break

        // left (A)
        case 65: keys.left.pressed = false; break

        // right (D)
        case 68: keys.right.pressed = false; break

      }

    }

  }

}
