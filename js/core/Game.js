class Game {

  constructor() {

    this._fps = 0;
    this._startingFps = 60;

    this._startTime = 0;
    this._lastTime = 0;
    this._gameTime = 0;

    this._paused = true;
    this._pauseTime = 0;

    this._globalAlpha = 1.0

    this._dayLength = 60 * 20 * 100 // 20 minutes

  }

  init() {

    // init player belt
    player.belt.init()
    player.belt.refresh()

  }

  /**
   * FRAME RATE
   */

  getFps() { return this._fps }
  setFps(fps) { this._fps = fps }

  getStartingFps() { return this._startingFps }
  setStartingFps(fps) { this._startingFps = fps }

  updateFrameRate(time) {
    this.setFps(
      !this.getLastTime() ?
        1000 / (time - this.getLastTime()) :
        this.getStartingFps()
    )
  }

  /**
   * Updates the frame rate, game time and the last time the app rendered an update.
   */
  tick() {
    var time = this.getTimeNow()
    this.updateFrameRate(time)
    this.setGameTime(time - this.getStartTime())
    this.setLastTime(time)
  }

  /**
   * TIME
   */

  getTimeNow() { return +new Date() }
  getStartTime() { return this._startTime }
  setStartTime(time) { this._startTime = time }
  getLastTime() { return this._lastTime }
  setLastTime(time) { this._lastTime = time }
  getGameTime() { return this._gameTime }
  setGameTime(time) { this._gameTime = time }

  /**
   * PAUSE
   */

  getPauseTime() { return this._pauseTime }
  setPauseTime(time) { this._pauseTime = time }
  isPaused() { return this._paused }
  pause() { this._paused = true }
  unpause() { this._paused = false }
  togglePause() {
    var now = this.getTimeNow()
    this.isPaused() ? this.unpause() : this.pause()
    if (this.isPaused()) { this.setPauseTime(now) }
    else {
      this.setStartTime(this.getStartTime() + now - this.getPauseTime())
      this.setLastTime(now)
    }
  }

  getGlobalAlpha() { return this._globalAlpha }
  setGlobalAlpha(alpha) {
    console.log(alpha)
    this._globalAlpha = alpha
  }

  getDayLength() { return this._dayLength }

  /**
   * CANVAS + MOUSE
   */

  canvasMouseMoveListener(e) { }

  canvasMouseDownListener(e) {

    playerMode.canvasMouseDownListener(e)

  }

  canvasMouseUpListener(e) {

    playerMode.canvasMouseUpListener(e)

  }

  canvasMouseWheelListener(e) {

    // TODO move this to playerMode.canvasMouseWheelListener()

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
