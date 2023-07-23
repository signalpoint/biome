class DesignerBlocks {

  constructor() {

    this._typesDict = {

      // Bedrock
      'Bedrock': {
        blockClass: Bedrock,
        label: 'Bedrock',
        description: '...'
      },

      // BlueberryBush
      'BlueberryBush': {
        blockClass: BlueberryBush,
        label: 'Blueberry Bush',
        description: '...'
      },

      // Border
      'Border': {
        blockClass: Border,
        label: 'Border',
        description: '...'
      },

      // Grass
      'Grass': {
        blockClass: Grass,
        label: 'Grass',
        description: '...'
      },

      // OakTreeLeaves
      'OakTreeLeaves': {
        blockClass: OakTreeLeaves,
        label: 'Oak Tree Leaves',
        description: '...'
      },

      // OakTreeWood
      'OakTreeWood': {
        blockClass: OakTreeWood,
        label: 'Oak Tree Wood',
        description: '...',
        storedAt: [
          'LumberCamp'
        ]
      },

      // Sand
      'Sand': {
        blockClass: Sand,
        label: 'Sand',
        description: '...'
      },

      // Stone
      'Stone': {
        blockClass: Stone,
        label: 'Stone',
        description: '...',
        storedAt: [
          'StonecutterCamp'
        ]
      },

      // Water
      'Water': {
        blockClass: Water,
        label: 'Water',
        description: '...'
      }

    }
    this._types = []
    for (var type in this._typesDict) {
      if (!this._typesDict.hasOwnProperty(type)) { continue; }
      this._types.push(type)
    }

  }

  getTypes() { return this._types }
  getType(type) { return this._typesDict[type] }

  getStorageLocations(type) { return this.getType(type).storedAt }
  getStorageBuildingType(type) { return this.getStorageLocations(type)[0] }
  getStorageBuilding(type) {
    let buildingType = this.getStorageBuildingType(type)
    return d.getBuildingFromIndexByType(buildingType)
  }
  storageBuildingExists(type) { return d.indexHasBuildingType(type) }

}
