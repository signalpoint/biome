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

//    console.log('importMapJson', map)

    let type = null
    let solid = null

    d.blocks = []
    d.buildings = []

    for (let delta = 0; delta < map.blocks.length; delta++) {

      let hasBlock = !!map.blocks[delta]
      let hasBuilding = !!map.buildings[delta]

      if (!hasBlock) { d.blocks.push(map.blocks[delta]) }
      else {

        type = map.blocks[delta].t
        solid = map.blocks[delta].s

        d.blocks[delta] = new blockTypesDict[type]({
          delta,
          type,
          solid
        })

      }

      if (!hasBuilding) {
        d.buildings.push(map.buildings[delta])
      }
      else {

        type = map.buildings[delta].t

        let pos = d.getBlockPosFromDelta(delta)
        d.buildings[delta] = new buildingTypesDict[type]({
          delta,
          type,
          x: pos.x,
          y: pos.y
        })

      }

    }

    refresh()

  }

  // blocks

  exportBlocksJson() {

    let blocks = []
    let block = null
    let delta = 0

    for (let y = 0; y < d.getMapHeight(); y += d.getBlockSize()) {

      for (let x = 0; x < d.getMapWidth(); x += d.getBlockSize()) {

        block = d.blocks[delta]

        blocks.push(block ? {
          t: block.type,
          s: block.solid
        } : 0)

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
