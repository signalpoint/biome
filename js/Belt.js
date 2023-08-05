class Belt {

  constructor({
    id,
    inventory
  }) {

    this.id = id
    this.inventory = inventory

    this._element = null
    this._buttons = null
    this._activeItem = 0

  }

  getElement() {
    if (!this._element) { this._element = document.getElementById(this.id) }
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

    for (let i = 0; i < BELT_SIZE; i++) {

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

    let inventory = this.inventory

    for (let i = 0; i < BELT_SIZE; i++) {

      let html = ''

      let slot = inventory.get(i)
      if (slot) {
        let def = inventory.getDefinition(i)
        html = `${def.label}<span class="badge bg-primary float-end">${slot.length}</span>`
      }
      else { html = '<i class="fas fa-circle-notch"></i>' }

      this.getButton(i).innerHTML = html

    }

  }

}
