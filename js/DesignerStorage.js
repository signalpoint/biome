class DesignerStorage {

  constructor() {

  }

  // local storage

  save(name, value) {
    window.localStorage.setItem(name, JSON.stringify(value))
  }
  load(name) {
    return JSON.parse(window.localStorage.getItem(name))
  }
  delete(name) {
    return window.localStorage.removeItem(name);
  }

  // map import / export

  exportMapJson() {

    return {
      name: 'BakedLake',
      blockSize: d.getBlockSize(),
      mapWidth: d.getMapWidth(),
      mapHeight: d.getMapHeight(),
      blocks: this.exportBlocksJson(),
      buildings: this.exportBuildingsJson()
    }

  }

  importMap(mapName) {
    this.importMapJson(d.loadMap(mapName))
  }

  importMapJson(map) {

    console.log('importMapJson', map)

    let id = null
    let type = null
    let solid = null
    let health = null

    d.blocks = []
    d.buildings = []

    for (let delta = 0; delta < map.blocks.length; delta++) {

      let hasBlock = !!map.blocks[delta]
      let hasBuilding = !!map.buildings[delta]

      if (!hasBlock) {
        let block = map.blocks[delta]
        d.blocks.push(block.id)
      }
      else {

        id = map.blocks[delta].i
        type = map.blocks[delta].t
        solid = map.blocks[delta].s
        health = map.blocks[delta].h

        if (!dBlocks.getType(type)) {
          console.log(`unknown block type encountered during map import: ${type}`)
          continue
        }

        let blockClass = d.getBlockClass(type)
        let block = new blockClass({
          id,
          delta,
          type,
          solid,
          health
        })
        d.blocks[delta] = block.id
        d.addBlockToIndex(block)

      }

      if (!hasBuilding) {
        let building = map.buildings[delta]
        d.buildings.push(building.id)
      }
      else {

        type = map.buildings[delta].t

        let pos = d.getBlockPosFromDelta(delta)
        let buildingClass = d.getBuildingClass(type)
        let building = new buildingClass({
          delta,
          type,
          x: pos.x,
          y: pos.y
        })
        d.buildings[delta] = building.id

      }

    }

    refresh()

  }

  // entities

  exportEntitiesJson() {

    let out = {}

    for (let entityType in d._entities) {

      if (!d._entities.hasOwnProperty(entityType)) { continue }

      out[entityType] = {}

      for (let id in d._entities[entityType]) {

        let entity = d._entities[entityType][id]

        if (entityType == 'block') {
          out[entityType][id] = {
            t: entity.type,
            s: entity.solid,
            h: entity.health
          }
        }

        else if (entityType == 'building') {
          out[entityType][id] = {
            t: entity.type
          }
        }

        else if (entityType == 'item') {
          out[entityType][id] = {
            t: entity.type,
            h: entity.health
          }
        }

        else if (entityType == 'npc') {
          out[entityType][id] = {
            n: entity.name
          }
        }

      }
    }

    return out

  }

  // blocks

  exportBlocksJson() {

    let blocks = []
    let blockId = null
    let block = null
    let delta = 0

    for (let y = 0; y < d.getMapHeight(); y += d.getBlockSize()) {

      for (let x = 0; x < d.getMapWidth(); x += d.getBlockSize()) {

        blockId = d.blocks[delta]

        if (blockId) {
          block = d.getBlock(blockId)
          blocks.push({
            i: block.id,
            t: block.type,
            s: block.solid,
            h: block.health
          })
        }
        else { blocks.push(0) }

        delta++

      }

    }

    return blocks

  }

  // buildings

  exportBuildingsJson() {

    let buildings = []
    let building = null
    let delta = 0

    for (let y = 0; y < d.getMapHeight(); y += d.getBlockSize()) {

      for (let x = 0; x < d.getMapWidth(); x += d.getBlockSize()) {

        building = d.buildings[delta]

        buildings.push(building ? {
          t: building.type
        } : 0)

        delta++

      }

    }

    return buildings

  }

}
