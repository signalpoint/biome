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

//    this._dayLength = 60 * 20 * 1000 // 20 minutes
    this._dayLength = 60 * 2 * 1000 // 2 minutes
//    this._dayLength = 60 * .2 * 1000 // 20 seconds

  }

  init() {

  // PLAYER

  player = new Player({
    name: 'Tyler',
    x: 576 + 8,
    y: 256 + 4
  })
//  player.belt.add(new Axe({}))
//  player.belt.setActiveItem(0)
  player.load()
  players.push(player)

  // init player belt
  player.belt.init()
  player.belt.refresh()

  // NPCs

  // TODO
  // - can't get rid of static id values here until we're dynamically saving/loading npcs

//  let npcLoan = new Villager({
//    id: 'Loan',
//    name: 'Loan',
//    x: player.x + 72,
//    y: player.y - 28,
//    color: 'yellow'
//  })
//  saveVillager(npcLoan)
//
//  let npcAvalina = new Villager({
//    id: 'Avalina',
//    name: 'Avalina',
//    x: player.x + 16,
//    y: player.y - 121,
//    color: 'pink'
//  })
//  saveVillager(npcAvalina)
//
//  let npcMelvin = new Villager({
//    id: 'Melvin',
//    name: 'Melvin',
//    x: player.x - 92,
//    y: player.y - 92,
//    color: 'red'
//  })
//  saveVillager(npcMelvin)

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
  setGlobalAlpha(alpha) { this._globalAlpha = alpha }

  getDayLength() { return this._dayLength }
  am() { return !this.pm() }
  pm() { return this.getGameTime() % this.getDayLength() < this.getDayLength() / 2 }

  applySunshine() {

//    console.log(this.pm() ? 'pm' : 'am')

//    0.0 midnight
//    0.1
//    0.2
//    0.3
//    0.4
//    0.5 dawn
//    0.6
//    0.7
//    0.8
//    0.9
//    1.0 noon
//    0.9
//    0.8
//    0.7
//    0.6
//    0.5 dusk
//    0.4
//    0.3
//    0.2
//    0.1

//    0 noon => 1.0
//    1
//    2
//    3
//    4
//    5 dusk => 0.5
//    6
//    7
//    8
//    9
//    10 midnight => 0.0
//    11
//    12
//    13
//    14
//    15 dawn => 0.5
//    16
//    17
//    18
//    19

    // day / night...

    let dayLength = game.getDayLength()
    let gameTime = game.getGameTime()
    game.setGlobalAlpha(

      Math.abs(

         1 - (gameTime % dayLength) / (dayLength / 2)

      ).toFixed(2)

    )

  }

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
