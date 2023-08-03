class DesignerBuild {

  constructor() {

    this._entityType = null // block, item, building
    this._type = null // e.g. Grass, StoneAxe, LumberCamp, ...

  }

  getEntityType() { return this._entityType }
  setEntityType(entityType) { this._entityType = entityType }

  getType() { return this._type }
  setType(type) { this._type = type }

  getNav() { return document.querySelector('#dBuildNav') }
  getNavBtns() { return this.getNav().querySelectorAll('a.nav-link') }
  getActiveNavBtn() { return this.getNav().querySelector('a.active') }

  // TODO these need to be abstracted out to the entity level so we can do blocks, items, buildings, etc...

  getToolsElement() { return document.getElementById('playerToolsElement') }
  getToolButtons() { return this.getToolsElement().querySelectorAll('.tools-list button') }
  getToolBuildButton() { return this.getToolsElement().querySelector('.tool-parts button') }
  enableToolBuildButton() { this.getToolBuildButton().classList.remove('disabled') }
  disableToolBuildButton() { this.getToolBuildButton().classList.add('disabled') }
  getToolType() { return this._toolType }
  setToolType(type) { this._toolType = type }

  getToolsListPane() { return this.getToolsElement().querySelector('.tools-list') }

  getToolPartsPane() { return this.getToolsElement().querySelector('.tool-parts') }
  showToolPartsPane() { this.getToolPartsPane().classList.remove('d-none') }
  hideToolPartsPane() { this.getToolPartsPane().classList.add('d-none') }
  clearToolPartsPane() { this.getToolPartsPane().innerHTML = '' }

  // ...

  render() {

    playerMode.getPane('tools').innerHTML =

`<div class="clearfix mb-1">
  <h3 class="float-start">Crafting</h3>
  <button class="btn btn-dark text-light float-end"><i class="fas fa-times"></i></button>
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

<div class="row">
  <div class="col-6 tools-list overflow-scroll"></div>
  <div class="col-6 tool-parts"></div>
</div>`

  }

  init() {

    let self = this

    let toolsElement = this.getToolsElement()
    toolsElement.style.width = `${d.getScreenWidth() * .66}px`
    toolsElement.style.height = `${d.getScreenHeight() * .66}px`

    let toolsListPane = this.getToolsListPane()
    toolsListPane.style.height = `${d.getScreenHeight() * .5}px`

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

    this.refresh()

  }

  refresh() {
    this.clearToolPartsPane()
    this.renderEntityList()
    this.initEntityList()
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

      if (!d.isCraftable(item)) { continue }

      items.push(
`<div class="card bg-dark text-light w-100 mb-1">
  <div class="card-body">
    <h4 class="card-title">
      ${item.label}
      <button class="btn btn-lg btn-outline-secondary text-light float-end ms-1" data-type="${type}" title="${item.description}">
        <i class="fas fa-arrow-right"></i>
      </button>
    </h5>
  </div>
</div>`
      )
    }

    this.getToolsListPane().innerHTML = items.join('')

  }

  initEntityList() {

    let self = this

    // for each item button...
    let btns = this.getToolButtons()
    for (let i = 0; i < btns.length; i++) {

      // click listener
      btns[i].addEventListener('click', function(e) {

        let btn = getBtnFromEvent(e)
        let type = btn.getAttribute('data-type')

        self.setType(type)

        self.renderEntityPane()
        self.initEntityPane()

      })

    }

  }

  // ENTITY PANE

  renderEntityPane() {

    let entityType = this.getEntityType()
    let type = this.getType()
    let dict = d.getEntityDict(entityType)
    let definition = dict.getType(type)

    console.log('________')
    console.log('entityType', entityType)
    console.log('type', type)
    console.log('dict', dict)
    console.log('definition', definition)
    console.log('________')

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

      console.log('requirementEntityType', requirementEntityType)
      console.log('requirementDict', requirementDict)

      let _requirements = null
      if (requirementEntityType == 'block') { _requirements = dict.getBlockRequirements(type) }
      else if (requirementEntityType == 'item') { _requirements = dict.getItemRequirements(type) }
      console.log('_requirements', _requirements)
      console.log('----')

      // entity requiremenents list...

      if (_requirements) {

        for (let requirementType in _requirements) {
          if (!_requirements.hasOwnProperty(requirementType)) { continue }

          console.log('requirementType', requirementType)

          let requirementDefinition = requirementDict.getType(requirementType)
          let qty = _requirements[requirementType]

          console.log('requirementDefinition', requirementDefinition)
          console.log('qty', qty)

          let playerQty = 0
          let color = 'danger'

          if (player.belt.has(requirementEntityType, requirementType)) { // has some of the entity...

            playerQty = player.belt.qty(requirementEntityType, requirementType)

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

          console.log('playerQty', playerQty)
          console.log('.......')

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

    this.getToolPartsPane().innerHTML =

      `<div class="mb-1">` +

        `<span class="fs-4">${definition.label}</span>` +

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
    let entityType = this.getEntityType()
    let type = this.getType()

    let buildBtn = this.getToolBuildButton()
    buildBtn.addEventListener('click', function() {
      self.disableToolBuildButton()
      console.log(`build a ${type}`)

      player.belt.add(d.create(entityType, type))
      player.belt.refresh()

    })

  }

}
