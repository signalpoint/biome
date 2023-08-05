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
      entities: d._entities
    }

  }

  importMap(mapName) {
    this.importMapJson(d.loadMap(mapName))
  }

  importMapJson(map) {

    console.log('importMapJson', map)

    // import entities...
    if (map.entities) {

      // for each entity type...
      for (let entityType in map.entities) {
        if (!map.entities.hasOwnProperty(entityType)) { continue }

        // for each entity...
        for (let id in map.entities[entityType]) {
          if (!map.entities[entityType].hasOwnProperty(id)) { continue }

          let entity = map.entities[entityType][id]
          switch (entityType) {
            case 'block':
              let blockClass = d.getBlockClass(entity.type)
              let block = new blockClass(entity)
              if (block.delta) {
                d.blocks[block.delta] = block.id
              }
              break;
            default:
              console.log(`TODO support ${entityType} in importMapJson()`)
              break;
          }

        }

      }

    }

    refresh()

  }

}
