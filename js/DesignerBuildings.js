class DesignerBuildings {

  constructor() {

    this._typesDict = {

      // Campground
      'Campground': {
        buildingClass: Campground,
        label: 'Campground',
        description: 'An area for campers.',
        icon: 'fas fa-campground',
        requires: null
      },

      // BuildersWorkshop
      'BuildersWorkshop': {
        buildingClass: BuildersWorkshop,
        label: 'Builders Workshop',
        description: 'A shop for builders. Produces items and buildings.',
        icon: 'fas fa-toolbox',
        requires: {
          'OakTreeWood': 5
        }
      },

      // LumberCamp
      'LumberCamp': {
        buildingClass: LumberCamp,
        label: 'Lumber Camp',
        description: 'A camp for woodcutters. Produces wood.',
        icon: 'fas fa-tree',
        requires: {
          'OakTreeWood': 5
        },
        storage: {
          'OakTreeWood': 50
        }
      },

      // StonecutterCamp
      'StonecutterCamp': {
        buildingClass: StonecutterCamp,
        label: 'Stone',
        description: 'A camp for stonecutters. Produces stone.',
        icon: 'fas fa-gem',
        requires: {
          'OakTreeWood': 5
        },
        storage: {
          'Stone': 50
        }
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

  getIcon(type) { return this.getType(type).icon }

  getRequirements(type) { return this.getType(type).requires }

}
