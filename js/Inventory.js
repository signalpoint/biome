class Inventory extends EntityCollection {

  constructor({
    id,
    size = 50
  }) {

    super({
      id,
      size
    })

  }

  add(entity) {
    if (entity.isBlock()) { super.add('block', entity) }
    else if (entity.isItem()) { super.add('item', entity) }
  }
  remove(entity) {
    if (entity.isBlock()) { super.remove('block', entity) }
    else if (entity.isItem()) { super.remove('item', entity) }
  }

//  importData(data) {
//
//    console.log('loading player inventory', data)
//
//    for (let i = 0; i < data._entities.length; i++) {
//
//      let entity = data._entities[i]
//
//      if (entity.entityType == 'block') {
//
//        if (!dBlocks.getType(entity.type)) {
//          console.log(`Player inventory import skipping unknown block type: ${entity.type}`)
//          continue
//        }
//
//        let blockClass = d.getBlockClass(entity.type)
//        this.add(new blockClass({
//          id: entity.id,
//          delta: entity.delta,
//          health: entity.health
//        }))
//
//      }
//
//      else if (entity.entityType == 'item') {
//        console.log('TODO Inventory.importData() - handle items')
//      }
//
//    }
//
//  }

}
