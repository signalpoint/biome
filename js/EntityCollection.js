// EntityCollection
//
//   Belt (players and npc) : Blocks & Items
//
//   Inventory (players and npc) : Blocks & Items
//
//   Storage (buildings) : Blocks & Items

class EntityCollection {

  constructor({
    id,
    size,
    entities = [],
    typeIndex = {},
    bundleIndex = {}
  }) {

    this._id = id
    this._size = size

    this._entities = entities
    this._typeIndex = typeIndex
    this._bundleIndex = bundleIndex
//    this._idIndex = {}

  }

  exportData() { return this }
  importData(data) { }

  getId() { return this._id }
  setId(id) { this._id = id }

  getSize() { return this._size }
  setSize(size) { this._size = size }

  getCount() { return this._entities.length }
  isFull() { return this.getCount() >= this.getSize() }
  isEmpty() { return !this.getCount() }

  get(i) { return this._entities[i] }

  add(type, entity) {
    let i = this._entities.length
    console.log(`adding ${entity.type} ${type} ${entity.id} to ${i}...`)
    this._entities.push(entity)
    this._addToTypeIndex(type, entity, i)
    this._addToBundleIndex(type, entity, i)
  }
  remove(type, entity) {
    let i = this._typeIndex[type][entity.id]
    console.log(`removing ${entity.type} ${type} ${entity.id} from ${i}...`)
    this._entities.splice(i, 1)
    this._removeFromTypeIndex(type, entity)
    this._removeFromBundleIndex(type, entity)
  }

  _addToTypeIndex(type, entity, i) {
    if (!this._typeIndex[type]) { this._typeIndex[type] = {} }
    this._typeIndex[type][entity.id] = i
  }
  _removeFromTypeIndex(type, entity) { delete this._typeIndex[type][entity.id] }

  _addToBundleIndex(type, entity) {
    if (!this._bundleIndex[type]) { this._bundleIndex[type] = {} }
    if (!this._bundleIndex[type][entity.type]) { this._bundleIndex[type][entity.type] = [] }
    this._bundleIndex[type][entity.type].push(entity.id)
  }
  _removeFromBundleIndex(type, entity) {
    let i = this._bundleIndex[type][entity.type].indexOf(entity.id)
    this._bundleIndex[type][entity.type].splice(i, 1)
  }

  has(entityType, bundle) {
    return !!(
      this._bundleIndex[entityType] &&
      this._bundleIndex[entityType][bundle] &&
      this._bundleIndex[entityType][bundle].length
    )
  }
  hasBlock(bundle) { return this.has('block', bundle) }
  hasItem(bundle) { return this.has('item', bundle) }

  qty(entityType, bundle) { return this._bundleIndex[entityType][bundle].length }
  blockQty(bundle) { return this.qty('block', bundle) }
  itemQty(bundle) { return this.qty('item', bundle) }

}
