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
//   Npc
//    Villager
//    Monster
//    ...
//

class Entity {

  constructor({
    id = null,
    entityType // TODO to avoid confusion, consider renaming this since child classes are using the word "type"
  }) {

    this.id = !id ? d.getRandomEntityId() : id
    this.entityType = entityType // name prefixed w/ "entity" so e.g. Block.type, Item.type, etc won't collide

    d.addEntityId(this.id)

  }

  isBlock() { return this.entityType == 'block' }
  isBuilding() { return this.entityType == 'building' }
  isItem() { return this.entityType == 'item' }
  isNpc() { return this.entityType == 'npc' }

}
