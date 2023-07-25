//
// Entity
//
//   Blocks
//     Grass
//     Log
//
//   Items
//     Axe
//     ...
//

class Entity {

  constructor({
    id = null,
    entityType
  }) {

    this.id = !id ? d.getRandomEntityId() : id
    this.entityType = entityType // name prefixed w/ "entity" so e.g. Block.type, Item.type, etc won't collide

    d.addEntityId(this.id)

  }

  isBlock() { return this.entityType == 'block' }
  isItem() { return this.entityType == 'item' }

}
