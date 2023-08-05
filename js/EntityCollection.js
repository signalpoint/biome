// EntityCollection
//
//   Belt (players and npc) : Blocks & Items
//
//   Inventory (players and npc) : Blocks & Items
//
//   Storage (buildings) : Blocks & Items

class EntityCollection {

  constructor({
    id,
    size,
    entities = [],
    typeIndex = {},
    bundleIndex = {}
  }) {

    this._id = id
    this._size = size

    this._slots = []
    this._slotsIndex = []

    // @deprecated?!?!
    this._entities = entities // an array of Entity objects
    this._typeIndex = typeIndex // keyed by entity type, then keyed by entity id, stores the Entity array index value
    this._bundleIndex = bundleIndex // keyed by entity type, then keyed by bundle, stores an array of entity ids

    // dummy data; for visualizing...

    this.__slots = [

      // oak logs...
      [
        'abc123', // OakLog id
        'def456' // OakLog id
      ],

      // oak planks...
      [
        'xyz987', // OakPlank id
        'lmno10' // OakPlank id
      ]

    ]

    this.__slotsIndex = [

      // oak log
      {
        entityType: 'block',
        type: 'OakLog'
      },

      // oak plank
      {
        entityType: 'block',
        type: 'OakPlank'
      }

    ]

    // put a zero in each slot and index
    for (let i = 0; i < this.getSize(); i++) {
      this._slots.push(0)
      this._slotsIndex.push(0)
    }

  }

  exportData() { return this }
  importData(data) {

//    console.log(`importing entity collection (${this.getId()}):`, data)

    let slots = data._slots
    let slotsIndex = data._slotsIndex

    this._slots = slots
    this._slotsIndex = slotsIndex

    // @see importMapJson()

  }

  getId() { return this._id }
  setId(id) { this._id = id }

  getSize() { return this._size }
  setSize(size) { this._size = size }

  // SLOTS

  add(entityType, entity) {

//    console.log(`adding ${entity.type} ${entityType} ${entity.id}...`)

    // If any slot is already holding this kind of entity and it has an opening, add the enity id to it.
    let existingSlotWithOpening = this.findExistingSlotWithOpening(entityType, entity.type)
    if (existingSlotWithOpening !== null) { this.addToExistingSlot(existingSlotWithOpening, entity) }
    else {

      // There weren't any existing slots with openings...

      // If there is an empty slot available, use it.
      let emptySlot = this.findEmptySlot()
      if (emptySlot !== null) { this.addToEmptySlot(emptySlot, entity) }
      else {

        // There weren't any empty slots available...

        console.log('EntityCollection.add() - no empty slots avilable')

      }

    }

  }

  remove(entity) {
    let i = this.findEntity(entity)
    let slot = this.get(slot)
    let j = slot.indexOf(entity.id)
    slot.splice(j, 1)
    if (!slot.length) { this.clearSlot(i) }
  }

  addToEmptySlot(i, entity) {
    console.log(`adding ${entity.type} ${entity.id} to empty slot ${i}...`)
    // create the index for the slot, then add the entity id to the slot.
    this._slotsIndex[i] = {
      entityType: entity.entityType,
      type: entity.type
    }
    this._slots[i] = [
      entity.id
    ]
  }

  addToExistingSlot(i, entity) {
    console.log(`adding ${entity.type} ${entity.id} to existing slot ${i}...`)
    this._slots[i].push(entity.id)
  }

  /**
   * Finds the first empty spot and returns it, or null if there are no empty spots.
   * @returns {number|null}
   */
  findEmptySlot() {
    for (let i = 0; i < this.getSize(); i++) {
      if (this._slots[i] == 0) {
        return i
      }
    }
    return null
  }

  /**
   * Find an array of existing slots where an entity is stored, or null if it isn't stored anywhere.
   * @param {string} entityType
   * @param {string} bundle
   * @returns {Array|null}
   */
  findExistingSlots(entityType, bundle) {
    let existingSlots = []
    for (let i = 0; i < this._slotsIndex.length; i++) {
      let slotIndex = this._slotsIndex[i]
      if (slotIndex.entityType == entityType && slotIndex.type == bundle) {
        existingSlots.push(i)
      }
    }
    return existingSlots.length ? existingSlots : null
  }

  findExistingSlot(entityType, bundle) {
    let existingSlots = this.findExistingSlots(entityType, bundle)
    return existingSlots ? existingSlots[0] : null
  }

  findExistingSlotWithOpening(entityType, bundle) {
    let existingSlots = this.findExistingSlots(entityType, bundle)
    if (existingSlots) {
      let existingSlot = null
      for (let i = 0; i < existingSlots.length; i++) {
        existingSlot = existingSlots[i]
        if (this.getSlotQty(existingSlot) < this.getSlotMaxQty(existingSlot)) {
          return i
        }
      }
    }
    return null
  }

  /**
   * Given an an entity, this will return the slot number where it is located or null if it isn't present.
   * @param {type} entity
   * @returns {unresolved}
   */
  findEntity(entity) {
    let existingSlots = this.findExistingSlots(entity.entityType, entity.type)
    if (existingSlots) {
      let existingSlot = null
      for (let i = 0; i < existingSlots.length; i++) {
        existingSlot = existingSlots[i]
        if (existingSlot.indexOf(entity.id) !== -1) {
          return i
        }
      }
    }
    return null
  }

  getSlotQty(i) { return this._slots[i].length }
  getSlotMaxQty(i) {
    let def = this.getDefinition(i)
    return def.stackSize ? def.stackSize : 64
  }

  get(i) { return this._slots[i] }
  getDefinition(i) {
    let slotsIndex = this._slotsIndex[i]
    let entityType = slotsIndex.entityType
    let bundle = slotsIndex.type
    return d.getEntityDefinition(entityType, bundle)
  }

  getEntityType(i) { return this._slotsIndex[i].entityType }
  getBundle(i) { return this._slotsIndex[i].type }

  see(i) {
    let entityType = this.getEntityType(i)
    let id = this._slots[i][this._slots[i].length - 1]
    return d.getEntity(entityType, id)
  }

  pop(i) {
    let entityType = this.getEntityType(i)
    let id = this._slots[i].pop()
    if (!this._slots[i].length) { this.clearSlot(i) }
    return d.getEntity(entityType, id)
  }

  clearSlot(i) {
    this._slots[i] = 0
    this._slotsIndex[i] = 0
  }

  has(entityType, bundle) {
    return !!this.findExistingSlots(entityType, bundle)
  }

  qty(entityType, bundle) {
    let qty = 0
    let existingSlots = this.findExistingSlots(entityType, bundle)
    if (existingSlots) {
      for (let i = 0; i < existingSlots.length; i++) {
        qty += this.get(existingSlots[i]).length
      }
    }
    return qty
  }

}
