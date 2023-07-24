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
    size
  }) {

    this._id = id
    this._size = size

    this._entities = []
    this._typeIndex = {}
//    this._idIndex = {}

  }

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
    this._entities.push(entity)
    this._addToTypeIndex(type, entity, i)
//    this._addToIdIndex(type, entity)
  }
  remove(type, entity) {
    let i = this._typeIndex[type][entity.id]
    this._entities.splice(i, 1)
    this._removeFromTypeIndex(type, entity)
//    this._removeFromIdIndex(type, entity)
  }

  _addToTypeIndex(type, entity, i) {
    if (!this._typeIndex[type]) { this._typeIndex[type] = {} }
    this._typeIndex[type][entity.id] = i
  }
  _removeFromTypeIndex(type, entity) { delete this._typeIndex[type][entity.id] }

//  _addToIdIndex(type, entity) {
//    if (!this._idIndex[type]) { this._idIndex[type] = [] }
//    this._idIndex[type].push(entity.id)
//  }
//  _removeFromIdIndex(type, entity) {
//    let i = this._idIndex[type].indexOf(entity.id)
//    this._idIndex[type].splice(i, 1)
//  }

}
