export default class MkEntity {

  // TODO
  // - look into "get" and "set" capabilities of a "class" in js - @see https://stackoverflow.com/a/54562876/763010

  constructor({
    id = null,
    type,
    bundle = 'default'
  }) {

    this.id = !id ? mk.getRandomEntityId(type) : id
    this.type = type
    this.bundle = bundle

    // If there isn't an entity id index for type, initialize it.
    if (!mk.hasEntityIdIndex(type)) {
      mk.initEntityIdIndex(type)
    }

    // Add the entity id to its index.
    mk.addEntityId(type, this.id)

    // Add the entity to its index.
    mk.addEntityToIndex(type, this)

  }

}
