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
    id,
    entityType
  }) {

    this.id = id
    this.entityType = entityType // name prefixed w/ "entity" so e.g. Block.type, Item.type, etc won't collide

  }

}
