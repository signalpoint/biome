export default class MkEntity {

  constructor({
    id = null,
    type,
    bundle = 'default'
  }) {

    let mkEntities = mk.getMkEntities()

    // TODO "Implementations typically use a plain integer for this."
    this.id = !id ? mkEntities.getRandomEntityId(type) : id

    this.type = type
    this.bundle = bundle

    // If there isn't an entity id index for this type, initialize it.
    if (!mkEntities.hasEntityIdIndex(type)) {
      mkEntities.initEntityIdIndex(type)
    }

    // Add the entity id to its index.
    mkEntities.addEntityId(type, this.id)

    // Add the entity to its index.
    mkEntities.addEntityToIndex(type, this)

  }

}
