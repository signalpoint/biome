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
      blocks: this.exportBlocksJson()
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

    for (let delta = 0; delta < map.blocks.length; delta++) {

      if (!map.blocks[delta]) { d.blocks.push(map.blocks[delta]) }

      else {

        type = map.blocks[delta].t
        solid = map.blocks[delta].s

        // create the new block using the current type
        d.blocks[delta] = new blockTypesDict[type]({
          delta,
          type,
          solid
        })

      }

    }

    refresh()

  }

  // block import / export

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

}
