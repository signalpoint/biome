export default class MkEntities {

  constructor() {

    // ENTITY INDEX

    // entity ids...
    // block: [
    //   'abc123'
    // ],
    // item: [
    //   'def456'
    // ],
    // building: [
    //   'xyz789'
    // ]
    this._entityIds = {}

    // entities...
    // {
    //   block: {
    //     abc123: { type: 'Grass', ... }
    //   },
    //   item: {
    //     def456: { type: 'WoodAxe', ... }
    //   },
    //   building: {
    //     xyz789: { type: 'LumberCamp', ... }
    //   },
    //   ...
    // }
    this._entities = {}

    // bundles...
    // {
    //   block: {
    //     Grass: [ 'abc123' ]
    //   },
    //   item: {
    //     WoodAxe: [ 'def456' ]
    //   },
    //   building: {
    //     LumberCamp: [ 'xyz789' ]
    //   },
    // }
    this._entityBundles = {}

  }

  // entity id index

  hasEntityIdIndex(type) { return !!this._entityIds[type] }
  initEntityIdIndex(type) { this._entityIds[type] = [] }
  addEntityId(type, id) {
    this._entityIds[type].push(id)
  }
  removeEntityId(type, id) {
    let i = this._entityIds[type].indexOf(id)
    this._entityIds[type].splice(i, 1)
  }
  getRandomEntityId(type) {
    let id = null
    while (true) {
      id = (Math.random() + 1).toString(36).substring(7);
      if (id && (!this.hasEntityIdIndex(type) || !this._entityIds[type].includes(id))) { break }
    }
    return id
  }

  // entity index

  hasEntityIndex(type) { return !!this._entities[type] }
  initEntityIndex(type) { this._entities[type] = {} }
  addEntityToIndex(type, entity) {
    if (!this.hasEntityIndex(type)) { this.initEntityIndex(type) } // TODO why are we babysitting here? move to MkEntity()
    this._entities[type][entity.id] = entity
    this._addEntityToBundleIndex(type, entity)
  }
  removeEntityFromIndex(entity) {
    delete this._entities[entity.type][entity.id]
    this._removeEntityFromBundleIndex(entity.type, entity)
  }

  getEntityFromIndex(type, id) { return this._entities[type][id] }

  // entity bundle index

  _addEntityToBundleIndex(type, entity) {
    if (!this._entityBundles[type]) { this._entityBundles[type] = {} }
    if (!this._entityBundles[type][entity.bundle]) { this._entityBundles[type][entity.bundle] = [] }
    this._entityBundles[type][entity.bundle].push(entity.id)
  }
  _removeEntityFromBundleIndex(type, entity) {
    let i = this._entityBundles[type][entity.bundle].indexOf(entity.id)
    this._entityBundles[type][entity.bundle].splice(i, 1)
  }

  getEntityBundleIndexFromType(type) { return this._entityBundles[type] }

  // import / export

  importData(data) {
    this._entityIds = data.ids
    this._entities = data.entities
    this._entityBundles = data.bundles
  }

  exportData() {
    return {
      ids: this._entityIds,
      entities: this._entities,
      bundles: this._entityBundles,
    }
  }

}
