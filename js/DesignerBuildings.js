class DesignerBuildings {

  constructor() {

    this._typesDict = {

//let buildingTypesDict = {
//  'Campground': Campground,
//  'BuildersWorkshop': BuildersWorkshop,
//  'LumberCamp': LumberCamp,
//  'StonecutterCamp': StonecutterCamp
//}
//let buildingIconsDict = { // @deprecated?
//  'Campground': 'fas fa-campground',
//  'BuildersWorkshop': 'fas fa-toolbox',
//  'LumberCamp': 'fas fa-tree',
//  'StonecutterCamp': 'fas fa-gem'
//}

      // Campground
      'Campground': {
        buildingClass: Campground,
        label: 'Campground',
        description: 'An area for campers.',
        requires: null
      },

      // BuildersWorkshop
      'BuildersWorkshop': {
        buildingClass: BuildersWorkshop,
        label: 'Builders Workshop',
        description: 'A shop for builders. Produces items and buildings.',
        requires: {
          'OakTreeWood': 5
        }
      },

      // LumberCamp
      'LumberCamp': {
        buildingClass: LumberCamp,
        label: 'Lumber Camp',
        description: 'A camp for woodcutters. Produces wood.',
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

  getRequirements(type) { return this.getType(type).requires }

}
