class EntityDict {

  constructor({
    types = null,
    typesDict = null
  }) {

    this._types = types
    this._typesDict = typesDict

  }

  getTypes() { return this._types }
  getType(type) { return this._typesDict[type] }

  getRequirements(type) {
    let requirements = this.getType(type).requires
    return requirements ? requirements : null
  }
  getBlockRequirements(type) {
    let requirements = this.getRequirements(type)
    return requirements && requirements.blocks ? requirements.blocks : null
  }
  getItemRequirements(type) {
    let requirements = this.getRequirements(type)
    return requirements && requirements.items ? requirements.items : null
  }

  getStorageLocations(type) { return this.getType(type).storedAt }
  getStorageBuildingType(type) { return this.getStorageLocations(type)[0] }
  getStorageBuilding(type) {
    let buildingType = this.getStorageBuildingType(type)
    return d.getBuildingFromIndexByType(buildingType)
  }
  storageBuildingExists(type) { return d.indexHasBuildingType(type) }

  getPickupLocation(type) {

  }

}
