class PlayerMode {

  constructor() {

    this._mode = 'belt'

    this._buildType = null

    this.initButtons()

  }

  load() {}
  save() {}

  getMode() { return this._mode }
  setMode(mode) { this._mode = mode }

  getElement() { return document.getElementById('playerModeElement') }
  getButtons() { return this.getElement().querySelectorAll('button') }
  getButtonsCount() { return this.getButtons().length }
  getButton(op) { return this.getElement().querySelector('button[data-op="' + op + '"]') }
  getButtonByIndex(index) { return this.getButtons()[index] }

  getActiveButton() { return this.getElement().querySelector('button.active') }
  setActiveButton(op) { this.getButton(op).classList.add('active') }
  clearActiveButton() { this.getActiveButton().classList.remove('active') }
  changeActiveButton(index) {
    this.clearActiveButton()
    this.setActiveButton(index)
  }

  getActiveButtonIndex() { return parseInt(this.getActiveButton().getAttribute('data-index')) }

  getNextButton() { return this.getActiveButton().nextSibling }
  getPreviousButton() { return this.getActiveButton().previousSibling }

  getButtonLight(op) { return this.getButton(op).querySelector('.badge') }
  turnOnButtonLight(op) { this.getButtonLight(op).classList.remove('d-none') }
  turnOffButtonLight(op) { this.getButtonLight(op).classList.add('d-none') }
  buttonHasLight(op) { return !this.getButtonLight(op).classList.contains('d-none') }

  initButtons() {

    let self = this

    for (let i = 0; i < this.getButtonsCount(); i++) {

      let btn = this.getButtonByIndex(i)
      btn.addEventListener('click', function(e) {

        btn = e.target
        while (btn && btn.tagName != 'BUTTON') { btn = btn.parentNode }

        let op = btn.getAttribute('data-op')

        self.clearActiveButton()
        self.setActiveButton(op)

        if (self.buttonHasLight(op)) {
          self.turnOffButtonLight(op)
        }

        let oldPane = self.getActivePane()
        oldPane.classList.remove('active')
        oldPane.classList.add('d-none')

        let newPane = self.getPane(op)
        newPane.classList.add('active')
        newPane.classList.remove('d-none')

        self.setMode(op)

        if (op == 'belt') {
          // no render needed; html resides in designer.html
        }
        else if (op == 'build') {
          if (newPane.innerHTML == '') {
            self.renderBuildPane()
            self.initBuildPane()
          }
        }
        else if (op == 'paint') {
          self.renderPaintPane()
        }

      })

    }

  }

  getPane(op) { return document.querySelector('#playerModePanes .player-mode-pane[data-op="' + op + '"]') }
  getActivePane() { return document.querySelector('#playerModePanes .player-mode-pane.active') }

  // BUILD

  getBuildElement() { return document.getElementById('playerBuildElement') }
  getBuildButtons() { return this.getBuildElement().querySelectorAll('button') }
  getBuildButton(type) { return this.getBuildElement().querySelector('button[data-op="' + type + '"]') }
  getActiveBuildButton() { return this.getBuildElement().querySelector('button.active') }
  setActiveBuildButton(op) { this.getBuildButton(op).classList.add('active') }
  clearActiveBuildButton() { this.getActiveBuildButton().classList.remove('active') }
  changeActiveBuildButton(op) {
    this.clearActiveBuildButton()
    this.setActiveBuildButton(op)
  }

  getBuildType() { return this._buildType }
  setBuildType(type) { this._buildType = type }

  renderBuildPane() {

    let html = ''

    // building types
    html +=
      '<div class="btn-group" role="group" aria-label="Building types">'
    for (let i = 0; i < dBuildings.getTypes().length; i++) {
      let buildingType = dBuildings.getTypes()[i]
      html +=
        `<button type="button" class="btn btn-outline-dark btn-lg text-secondary border-secondary" title="${buildingType}" data-type="${buildingType}">
          <i class="${dBuildings.getIcon(buildingType)}"></i>
        </button>`
    }
    html +=
      '</div>'

    this.getPane('build').innerHTML = html
  }
  initBuildPane() {

    let self = this

    // for each build pane...
    let btns = this.getBuildButtons()
    for (let i = 0; i < btns.length; i++) {

      // click listener
      btns[i].addEventListener('click', function(e) {

        let btn = e.target
        while (btn && btn.tagName != 'BUTTON') { btn = btn.parentNode }

        let type = btn.getAttribute('data-type')

        let activeBtn = self.getActiveBuildButton()
        if (activeBtn) { activeBtn.classList.remove('active') }
        btn.classList.add('active')

        self.setBuildType(type)

      })

      // mouse over listener
      btns[i].addEventListener('mouseover', function(e) {

        let btn = e.target
        while (btn && btn.tagName != 'BUTTON') { btn = btn.parentNode }

        let type = btn.getAttribute('data-type')

      })

    }

  }

  // PAINT

  renderPaintPane() {
    let html = 'paint!'
    this.getPane('paint').innerHTML = html
  }

  // CANVAS + MOUSE

  canvasMouseMoveListener(e) { }

  canvasMouseDownListener(e) {

//    let leftClick = mouse.left.pressed
//    let rightClick = mouse.right.pressed
//    let mode = this.getMode()
//    let delta = d.getMouseDownBlockDelta()
//    let block = d.blocks[delta]
//    let building = d.buildings[delta]

  }

  canvasMouseDownHoldListener(e) {

    let block = d.getMouseDownBlock()
    block.canvasMouseDownHoldListener(e)

    if (mouse.left.pressed) {
//      console.log('left hold', mouse.left.timer.getElapsedTime())

      if (block.canBeMined()) {

        let axeForce = 12
        block.hit(axeForce)

      }

    }

//    if (mouse.right.pressed) { console.log('right hold', mouse.right.timer.getElapsedTime()) }

  }

  canvasMouseUpListener(e) {

    // TODO handle action cancel/clear
    // e.g. if player has a "MoveToBlock" action running and the user moves with WASD, cancel the action

    let leftClick = mouse.left.pressed
    let rightClick = mouse.right.pressed
    let mode = this.getMode()
    let delta = d.getMouseUpBlockDelta()
    let block = d.blocks[delta]
    let building = d.buildings[delta]

//    let timer = mouse.left.timer
//    let elapsedTime = timer.getElapsedTime()
//    if (elapsedTime > 1000) { console.log('long') } // long press...
//    else if (elapsedTime > 500) { console.log('medium') } // medium press...
//    else { console.log('quick') } // quick press...

    // BUILDING ( clicked on a building... )

    if (building) {

      console.log(building)

      building.getWidget().show()

    }

    // BLOCK ( clicked on a block... )

    else {

      let isBedrock = block && block.isBedrock()

      // BELT
      if (mode == 'belt') {

        if (block) {

          // An existing block...

          // If they clicked a block nearby the player...
          if (player.getNearbyBlocks().includes(delta)) {

//            console.log('clicked nearby block')

            // MINING

            if (leftClick) { // left click...

              // If the block can be mined and the belt isn't full...
              if (block.canBeMined() && !player.belt.isFull()) {

//                player.mineBlock(delta)

              }

            }

            // PLACING

            else if (rightClick) { // right click...

              // If on bedrock...
              if (isBedrock) {

                // If they have an active belt item...
                let index = player.belt.getActiveButtonIndex()
                let item = player.belt.get(index)
                if (item) {

                  // place the block from their active belt item
                  dMode.paintBlock(delta, item)
                  player.belt.remove(block)
                  player.belt.refresh()

                  d.addBlockToIndex(d.blocks[delta])

                  // save the map
                  d.saveCurrentMap()

                  // save the player
                  player.save()

                }

              }

            }

          }

          // If they clicked a block under the player...
//          else if (player.getBlockDeltasFromPosition().includes(delta)) { }

          else {

            // they clicked on a block that wasn't nearby or under the player...

            // move the player...
            player.addAction(new ActionGoToBlock({
              delta: delta
            }))

          }

        }

      }

      // BUILD ( clicked to place a building... )

      else if (mode == 'build') {

        if (leftClick) {

          // PLACING

          if (!block) { console.log('cannot place on empty block') }
          else if (isBedrock) { console.log('cannot place on bedrock') }
          else if (block.solid) { console.log('cannot place on solid') }
          else if (d.buildings[delta]) { console.log('cannot place on existing building') }
          else {

            // OK to place building on block...

            // If they have an active building type...
            let type = this.getBuildType()
            if (type) {

              let pos = d.getBlockPosFromDelta(delta)
              let buildingClass = d.getBuildingClass(type)
              let building = new buildingClass({
                delta,
                type,
                x: pos.x,
                y: pos.y
              })

              // place the building
              d.buildings[delta] = building

              // open the building widget
              building.getWidget().show()

              // save the map
              d.saveCurrentMap()

              // refresh if its paused
              if (d.isPaused()) { refresh() }

            }

          }

        }

      }

      // PAINT
      else if (mode == 'paint') { console.log('PAINT') }

    }

  }

  canvasMouseWheelListener(e) { }

}
