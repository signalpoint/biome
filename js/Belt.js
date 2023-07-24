class Belt extends EntityCollection {

  constructor({
    id,
    size = 10
  }) {

    super({
      id,
      size
    })

    this._element = null
    this._buttons = null
    this._activeItem = 0

  }

  //---------------------------------

  // TODO turn this into Belt.js

//  getBelt() { return this._belt }
//  getBeltIndex() { return this._beltIndex }
//  getBeltSize() { return this._beltSize }

  // TODO
  exportData() { return this._belt }

  // TODO
  importData(data) {
    for (let i = 0; i < data.length; i++) {
      let block = data[i]
      if (!dBlocks.getType(block.type)) {
        console.log(`Player belt import skipping unknown block type: ${block.type}`)
        continue
      }
      let blockClass = d.getBlockClass(block.type)
      this.add('block', new blockClass({
        delta: null,
        type: block.type,
        solid: block.solid
      }))
    }
  }

//  getBeltItem(index) { return this._belt[index] }
//  deleteBeltItem(index) { this._belt.splice(index, 1) }

  add(block) { super.add('block', block) }
  remove(block) { super.remove('block', block) }

  addBlockToBelt(delta) {
    let block = d.blocks[delta]
    let blockClass = d.getBlockClass(block.type)
    this._belt.push(new blockClass({
      delta: null,
      type: block.type,
      solid: block.solid
    }))
  }

  addItemToBelt(item) {
    this.getBelt().push(item)
    this.addItemToBeltIndex(item)
  }
  addItemToBeltIndex(item) {
    if (!this._beltIndex[item.type]) { this._beltIndex[item.type] = [] }
    this._beltIndex[item.type].push(item.id)
  }
  removeItemFromBeltIndex(item) {
    let index = this._beltIndex[item.type].indexOf(item.id)
    this._beltIndex[item.type].splice(index, 1)
  }
  getItemFromBeltIndexByType(type) {
    return this.item.s[this._beltIndex[type][0]]
  }
  beltIndexHasItemType(type) {
    return this._beltIndex[type] && this._beltIndex[type].length
  }

  getElement() {
    if (!this._element) { this._element = document.getElementById(this.getId()) }
    return this._element
  }
  getButtons() {
    if (!this._buttons) { this._buttons = this.getElement().querySelectorAll('button') }
    return this._buttons
  }
  getButton(i) { return this.getButtons()[i] }

  getActiveButton() { return this.getElement().querySelector('button.active') }
  setActiveButton(index) {
    this.getButton(index).classList.add('active')
    this.setActiveItem(index)
  }
  clearActiveButton() { this.getActiveButton().classList.remove('active') }
  changeActiveButton(index) {
    this.clearActiveButton()
    this.setActiveButton(index)
  }

  getActiveButtonIndex() { return this._activeItem }

  setActiveItem(i) { this._activeItem = parseInt(i) }

  getNextButton() { return this.getActiveButton().nextSibling }
  getPreviousButton() { return this.getActiveButton().previousSibling }

  init() {

    for (let i = 0; i < this.getSize(); i++) {

      let active = i == 0

      // add btn to dom

      // create a new button element
      let btn = document.createElement("button");
      let btnClasses = ['btn', 'btn-outline-dark', 'btn-lg', 'text-secondary']
      if (active) { btnClasses.push('active') }
      btn.classList.add(...btnClasses)
      btn.setAttribute('type', 'button')
      btn.setAttribute('data-index', i)
      btn.setAttribute('title', `(${i+1})`)
//      btn.innerHTML = '<span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">!</span>'

      // add a notification badge within the button
//      let span = document.createElement("span");
//      let spanClasses = [
//        'badge',
//        'rounded-pill',
//        'bg-danger',
//        'position-absolute',
//        'top-0',
//        'start-100',
//        'translate-middle'
//      ]
//      span.classList.add(...spanClasses)
//      if (active) { span.innerHTML = '!' }

      // add click listener to btn
      btn.addEventListener('click', function(e) {

        btn = e.target
        while (btn && btn.tagName != 'BUTTON') { btn = btn.parentNode }

        let index = btn.getAttribute('data-index')
        player.belt.clearActiveButton()
        player.belt.setActiveButton(index)

        // Start the game if it's paused.
        if (d.isPaused()) { dPlayback.play() }

      })

      // add the btn to the belt element
      this.getElement().appendChild(btn)
//      btn.appendChild(span)

    }

  }

  refresh() {
    for (let i = 0; i < this.getSize(); i++) {
      let block = this.get(i)
      this.getButton(i).innerHTML = block ?
        block.type : '<i class="fas fa-circle-notch"></i>'
    }
  }

}
