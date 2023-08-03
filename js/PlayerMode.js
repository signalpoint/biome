class PlayerMode {

  constructor() {

    this._mode = 'belt'

    this._buildType = null
    this._toolType = null

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

        // start the game if it's paused
        if (d.isPaused()) {
          dPlayback.play()
        }

        // clear old active button and set new
        self.clearActiveButton()
        self.setActiveButton(op)

        // if the button is has a light, turn it off
        if (self.buttonHasLight(op)) {
          self.turnOffButtonLight(op)
        }

        // remove active from old pane and hide it
        let oldPane = self.getActivePane()
        oldPane.classList.remove('active')
        oldPane.classList.add('d-none')

        // add active to new pane and show it
        let newPane = self.getPane(op)
        newPane.classList.add('active')
        newPane.classList.remove('d-none')

        // update the mode
        self.setMode(op)

        // remove old bs5 position class and add new one
        let oldTop = oldPane.getAttribute('data-top')
        let newTop = newPane.getAttribute('data-top')
        let container = self.getPanesContainer()
        container.classList.remove('top-' + oldTop)
        container.classList.add('top-' + newTop)

        if (op == 'belt') {
          // no render needed; html resides in designer.html
        }
        else if (op == 'tools') {
          if (newPane.innerHTML == '') {
            dBuild.render()
            dBuild.init()
          }
        }
        else if (op == 'build') {
          if (newPane.innerHTML == '') {
            self.renderBuildPane()
            self.initBuildPane()
          }
        }
        else if (op == 'paint') {
          self.renderPaintPane()
          self.initPaintPane()
        }

      })

    }

  }

  getPanesContainer() { return document.querySelector('#playerModePanes') }
  getPane(op) { return document.querySelector('#playerModePanes .player-mode-pane[data-op="' + op + '"]') }
  getActivePane() { return document.querySelector('#playerModePanes .player-mode-pane.active') }

  // TOOLS

  // ... moved to DesignerCraft

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

    this.getPane('paint').innerHTML =

      // block type
      `<div class="mb-3">
        <label for="paintModeBlockTypeSelect" class="form-label visually-hidden">Block type</label>
        <select id="paintModeBlockTypeSelect" class="form-select" aria-label="Block type options"></select>
      </div>`

  }
  initPaintPane() {

    paintModeBlockTypeSelect = document.querySelector('#paintModeBlockTypeSelect')

    // paint mode: block type options
    for (var i = 0; i < dBlocks.getTypes().length; i++) {
      var option = document.createElement('option');
      let type = dBlocks.getTypes()[i]
      option.value = type;
      option.innerHTML = type;
      paintModeBlockTypeSelect.appendChild(option);
    }
    d.setPaintModeBlockType(paintModeBlockTypeSelect.options[0].value)

    // paint mode: block type option change listener
    paintModeBlockTypeSelect.addEventListener('change', function() {
      d.setPaintModeBlockType(this.value)
    })

  }

  // CANVAS + MOUSE

  canvasMouseMoveListener(e) {

    let leftClick = mouse.left.pressed
    let rightClick = mouse.right.pressed
    let mode = this.getMode()
    let delta = d.getMouseDownBlockDelta()

    let existingBlock = d.blocks[delta] !== 0
    let existingBuilding = d.buildings[delta] !== 0

    let block = existingBlock ? d.block(delta) : null
    let building = existingBuilding ? d.building(delta) : null

    if (mouse.left.pressed) { // dragging...

      // PAINT

      if (mode == 'paint') {

        let coords = getCanvasMouseCoordsWithCameraOffset(e)
        let delta = d.getBlockDelta(coords.x, coords.y)
        let type = d.getPaintModeBlockType()
        let existingBlock = d.blocks[delta] !== 0
        let block = existingBlock ? d.block(delta) : null

        if (existingBlock) {
          if (type != block.type) {
            dMode.paintNewBlock(delta, type)
          }
        }
        else {
          dMode.paintNewBlock(delta, type)
        }

      }

    }

  }

  canvasMouseDownListener(e) {

    let leftClick = mouse.left.pressed
    let rightClick = mouse.right.pressed
    let mode = this.getMode()
    let delta = d.getMouseDownBlockDelta()

    let existingBlock = d.blocks[delta] !== 0
    let existingBuilding = d.buildings[delta] !== 0

    let block = existingBlock ? d.block(delta) : null
    let building = existingBuilding ? d.building(delta) : null

    // PAINT

    if (mode == 'paint') {

      let blockType = d.getPaintModeBlockType()

      if (leftClick) {

        // If the block already exists...
        if (existingBlock) {

          // changing block type
          if (block.type != blockType) {
//            console.log(`${block.type} => ${blockType}`)
            d.removeEntityFromIndex('block', block)
            dMode.paintNewBlock(delta, blockType)
          }
          else { // clicking on same block type...

            //open block modal
  //            dMode.openBlockModal(delta)

          }

        }
        else {

          // The block does not exist...

          // create the new block using the current type
          dMode.paintNewBlock(delta, blockType)

        }

      }

    }

  }

  canvasMouseDownHoldListener(e) {

    // NOTE, "this" isn't playerMode since this is running in an interval
    // we may be able to specify "this" for the interval to ease development here

    let leftClick = mouse.left.pressed
    let rightClick = mouse.right.pressed
    let mode = playerMode.getMode()
    let delta = d.getMouseDownBlockDelta()

    let existingBlock = d.blocks[delta] !== 0
    let existingBuilding = d.buildings[delta] !== 0

    let block = existingBlock ? d.block(delta) : null
    let building = existingBuilding ? d.building(delta) : null

    if (block) {
      block.canvasMouseDownHoldListener(e)
    }

    if (leftClick) {

//      console.log('left hold', mouse.left.timer.getElapsedTime())

      if (mode == 'belt') {

        if (block.canBeMined()) {

          let axeForce = 12
          block.hit(axeForce)

        }

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
    let npc = d.getNpcAtMouseUp()

//    let timer = mouse.left.timer
//    let elapsedTime = timer.getElapsedTime()
//    if (elapsedTime > 1000) { console.log('long') } // long press...
//    else if (elapsedTime > 500) { console.log('medium') } // medium press...
//    else { console.log('quick') } // quick press...

    // BUILDING ( clicked on a building... )

    if (d.buildings[delta]) {

      d.building(delta).getWidget().show()

    }

    else if (npc) {

      console.log(`clicked on ${npc.name}`)

      npc.getWidget().show()

    }

    // BLOCK ( clicked on a block... )

    else {

      let block = d.block(delta)

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

                // If they have an active belt entity...
                let index = player.belt.getActiveButtonIndex()
                let entity = player.belt.get(index)
                if (entity) {

                  if (entity.isBlock()) {

                    console.log(`placing ${entity.type} block @ ${delta}`)

                    // place the block from their active belt entity
                    dMode.paintBlock(delta, entity)
                    player.belt.remove(entity)
                    player.belt.refresh()

                  }
                  else if (entity.isItem()) {

                    console.log('trying to place an item...')

                  }

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
              d.buildings[delta] = building.id

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
