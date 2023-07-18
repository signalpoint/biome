let _villagers = {}

class Villager extends Npc {

  constructor({
    id,
    name,
    x,
    y,
    color
  }) {

    super({
      id,
      name,
      x,
      y,
      color
    })

    this._employer = null // building delta

  }

  // methods

  isEmployed() { return !!this.getEmployer() }
  isUnemployed() { return !this.isEmployed() }

  getEmployer() { return this._employer ? d.buildings[this._employer] : null }
  setEmployer(delta) { this._employer = delta }

  // abstracts / interfaces

  update() {

    // has something to do...
    if (this.hasActions()) {

      let action = this.getAction()

      switch (action.getStatusLabel()) {
        case 'new':
          action.setStatus('processing')
          break
        case 'processing':
          action.update(this) // continue doing it...
          break
        case 'complete':
          this.removeAction()
          break
      }

    }

    // has nothing to do...
    else {

      // employed...
      if (this.isEmployed()) {

        // TODO if they are already at work, react accordingly, otherwise it loops indefinitely here

        // go to work...
        this.addAction(new ActionGoToBuilding({
          delta: this.getEmployer().delta
        }))

      }

      // unemployed...
      else {

      }

    }

  }

//  draw(x, y) { }

}

function loadVillager(id) { return _villagers[id] }
function saveVillager(villager) { _villagers[villager.id] = villager }

function getUnemployedVillager() {
  for (let id in _villagers) {
    if (!_villagers.hasOwnProperty(id)) { continue }
    let villager = _villagers[id]
    if (villager.isUnemployed()) {
      return villager
    }
  }
  return null
}
