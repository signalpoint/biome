class DesignerBuild {

  constructor() {

    this._entityType = null // block, item, building
    this._type = null // e.g. Grass, StoneAxe, LumberCamp, ...

  }

  getToolsElement() { return document.getElementById('playerToolsElement') }

  getEntityType() { return this._entityType }
  setEntityType(entityType) { this._entityType = entityType }

  getType() { return this._type }
  setType(type) { this._type = type }

  getCloseBtn() { return document.getElementById('dBuildCloseBtn') }

  // nav

  getNav() { return document.querySelector('#dBuildNav') }
  getNavBtns() { return this.getNav().querySelectorAll('a.nav-link') }
  getActiveNavBtn() { return this.getNav().querySelector('a.active') }

  // entity list

  getEntityListPane() { return this.getToolsElement().querySelector('.entity-list') }
  getEntityListBtns() { return this.getToolsElement().querySelectorAll('.entity-list button') }
  getEntityListBtn(type) { return this.getEntityListPane().querySelector(`button[data-type="${type}"]`) }
  getActiveEntityListBtn() { return this.getEntityListPane().querySelector('button.active') }

  // entity parts + build btn

  getEntityPartsPane() { return this.getToolsElement().querySelector('.entity-parts') }
  clearEntityPartsPane() { this.getEntityPartsPane().innerHTML = '' }
  getEntityBuildBtn() { return this.getToolsElement().querySelector('.entity-parts button') }
  enableEntityBuildBtn() { this.getEntityBuildBtn().classList.remove('disabled') }
  disableEntityBuildBtn() { this.getEntityBuildBtn().classList.add('disabled') }

  // ...

  render() {

    playerMode.getPane('tools').innerHTML =

`<div class="clearfix mb-1">
  <h3 class="float-start">Crafting</h3>
  <button id="dBuildCloseBtn" class="btn btn-dark text-light float-end"><i class="fas fa-times"></i></button>
</div>

<ul id="dBuildNav" class="nav nav-tabs mb-3">` +

  // blocks
  `<li class="nav-item">
    <a class="nav-link active" title="Blocks" data-entity-type="block">
      <i class="fas fa-dice-d6"></i>
    </a>
  </li>` +

  // items
  `<li class="nav-item">
    <a class="nav-link" title="Items" data-entity-type="item">
      <i class="fas fa-tools"></i>
    </a>
  </li>` +

  // buildings
  `<li class="nav-item">
    <a class="nav-link" title="Buildings" data-entity-type="building">
      <i class="fas fa-warehouse"></i>
    </a>
  </li>` +

`</ul>

<div class="row border-bottom border-secondary pb-3 mb-3">
  <div class="col-6 entity-list overflow-scroll"></div>
  <div class="col-6 entity-parts"></div>
</div>` +

    `<div id="playerInventoryElement"></div>`

  }

  init() {

    let self = this

    let toolsElement = this.getToolsElement()
    toolsElement.style.width = `${d.getScreenWidth() * .66}px`
    toolsElement.style.height = `${d.getScreenHeight() * .85}px`

    let entityListPane = this.getEntityListPane()
    entityListPane.style.height = `${d.getScreenHeight() * .35}px`

    // for each nav button...
    let navBtns = this.getNavBtns()
    for (let j = 0; j < navBtns.length; j++) {

      navBtns[j].addEventListener('click', function(e) {

        let navBtn = getAnchorFromEvent(e)
        let entityType = navBtn.getAttribute('data-entity-type')

        // swap acive class
        self.getActiveNavBtn().classList.remove('active')
        navBtn.classList.add('active')

        // update the op
        self.setEntityType(entityType)

        self.refresh()

      })

    }

    // close btn
    this.getCloseBtn().addEventListener('click', (e) => {
      self.refresh()
      playerMode.switchToPane('belt', true)
    })


    dInventory.init()

    this.refresh()
    dInventory.refresh()

  }

  refresh() {
    this.clearEntityPartsPane()
    this.refreshEntityList()
  }

  // ENTITY LIST

  renderEntityList() {

    let entityType = this.getEntityType()
    let items = []

    let dict = d.getEntityDict(entityType)

    let types = dict.getTypes()

    for (let i = 0; i < types.length; i++) {

      let type = types[i]
      let item = dict.getType(type)

      if (!d.isCraftable(item) || !player.hasUnlocked(entityType, type)) { continue }

      items.push(
`<div class="card bg-dark text-light w-100 mb-1">
  <div class="card-body">
    <div class="clearfix">
      <h4 class="card-title float-start">
        ${item.label}
      </h4>
      <button class="btn btn-lg btn-outline-secondary text-light float-end ms-1" data-type="${type}" title="${item.description}">
        <i class="fas fa-arrow-right"></i>
      </button>
    </div>
  </div>
</div>`
      )
    }

    this.getEntityListPane().innerHTML = items.join('')

  }

  initEntityList() {

    let self = this

    // for each item button...
    let btns = this.getEntityListBtns()
    for (let i = 0; i < btns.length; i++) {

      // click listener
      btns[i].addEventListener('click', function(e) {

        let btn = getBtnFromEvent(e)
        let type = btn.getAttribute('data-type')

        // swap active classes
        let activeBtn = self.getActiveEntityListBtn()
        if (activeBtn) { activeBtn.classList.remove('active') }
        btn.classList.add('active')

        self.setType(type)

        self.renderEntityPane()
        self.initEntityPane()

      })

      // sibling h4 click listener
      btns[i].previousElementSibling.addEventListener('click', function(e) {

        // simulate click on button
        let btn = e.target.nextElementSibling
        btn.click()

      })

    }

  }

  refreshEntityList() {
    this.renderEntityList()
    this.initEntityList()
  }

  // ENTITY PANE (entity parts pane)

  renderEntityPane() {

    let entityType = this.getEntityType()
    let type = this.getType()
    let dict = d.getEntityDict(entityType)
    let definition = dict.getType(type)

//    console.log('________')
//    console.log('entityType', entityType)
//    console.log('type', type)
//    console.log('dict', dict)
//    console.log('definition', definition)
//    console.log('________')

    // entity requirements

    let requirementsMet = true
    let requirements = []

    let requirementEntityTypes = [
      'block',
      'item'
    ]

    let requirementEntityType = null

    for (let i = 0; i < requirementEntityTypes.length; i++) {

      requirementEntityType = requirementEntityTypes[i]
      let requirementDict = d.getEntityDict(requirementEntityType)

//      console.log('requirementEntityType', requirementEntityType)
//      console.log('requirementDict', requirementDict)

      let _requirements = null
      if (requirementEntityType == 'block') { _requirements = dict.getBlockRequirements(type) }
      else if (requirementEntityType == 'item') { _requirements = dict.getItemRequirements(type) }
//      console.log('_requirements', _requirements)
//      console.log('----')

      // entity requiremenents list...

      if (_requirements) {

        for (let requirementType in _requirements) {
          if (!_requirements.hasOwnProperty(requirementType)) { continue }

//          console.log('requirementType', requirementType)

          let requirementDefinition = requirementDict.getType(requirementType)
          let qty = _requirements[requirementType]

//          console.log('requirementDefinition', requirementDefinition)
//          console.log('qty', qty)

          let playerQty = 0
          let color = 'danger'

          if (player.inventory.has(requirementEntityType, requirementType)) { // has some of the entity...

            playerQty = player.inventory.qty(requirementEntityType, requirementType)

            if (playerQty >= qty) { // has enough of the entity...
              color = 'success'
            }
            else { // doesn't have enough of the entity
              requirementsMet = false
              color = 'warning'
            }

          }
          else { // has none of the entity...
            requirementsMet = false
          }

//          console.log('playerQty', playerQty)
//          console.log('.......')

          requirements.push(
            `<li class="list-group-item list-group-item-${color}">
              ${requirementDefinition.label}
              <span class="badge bg-dark float-end">${'' + playerQty} / ${qty}</span>
            </li>`
          )

        }

      }

    }
    let hasRequirements = !!requirements.length

    this.getEntityPartsPane().innerHTML =

      `<div class="mb-1">` +

        `<span class="fs-4">
          ${definition.label}
          ${definition.output && definition.output > 1 ? ` (x${definition.output})` : ''}
        </span>` +

        // build btn
        `<button class="btn btn-${requirementsMet ? 'primary' : 'secondary'} float-end ${requirementsMet ? '' : 'disabled'}" title="Build ${definition.label}">
          Build
          <i class="fas fa-arrow-circle-right ms-2"></i>
        </button>` +

      `</div>
      <p>${definition.description}</p>` +

      (hasRequirements ?
      `<div class="fs-5 mb-1">Requires</div>
      <ul class="list-group mb-3">${requirements.join('')}</ul>` : ''
      )

  }

  initEntityPane() {

    let self = this

    // BUILD / CRAFT

    let buildBtn = this.getEntityBuildBtn()
    buildBtn.addEventListener('click', function() {

      let targetEntityType = self.getEntityType()
      let targetType = self.getType()
      let entity = null

      // disable build btn
      self.disableEntityBuildBtn()

      // remove required entities from inventory...

      let requirements = d.getEntityRequirements(targetEntityType, targetType)

      // entity types...
      for (let entityType in requirements) {
        if (!requirements.hasOwnProperty(entityType)) { continue }

        // bundles...
        for (let type in requirements[entityType]) {
          if (!requirements[entityType].hasOwnProperty(type)) { continue }

          // qty...

          let qty = requirements[entityType][type]
          console.log(`remove ${qty} ${type}`)

          for (let i = 0; i < qty; i++) {

            // find slot in inventory
            let slot = player.inventory.findExistingSlot(entityType, type)

            // remove entity from inventory
            entity = player.inventory.pop(slot)

            // destroy from world
            d.destroy(entity)

          }

        }

      }

      // create the new entity(ies) and add it to the player inventory...
      // hang onto a copy of the new entity so afterwards we can handle the player obtaining it
      let qty = d.outputQty(targetEntityType, targetType)
      for (let i = 0; i < qty; i++) {
        entity = d.create(targetEntityType, targetType)
        player.inventory.add(entity)
      }
      player.handleObtainingEntity(entity)

      dInventory.refresh()

      player.belt.refresh()

      d.save()

    })

  }

  refreshEntityPane() {
    this.renderEntityPane()
    this.initEntityPane()
  }

}
