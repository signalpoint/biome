class DesignerBuildings extends EntityDict {

  constructor() {

    super({

    })

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
          block: {
            'OakPlank': 8
          }
        }
      },

      // LumberCamp
      'LumberCamp': {
        buildingClass: LumberCamp,
        label: 'Lumber Camp',
        description: 'A camp for woodcutters. Produces wood.',
        icon: 'fas fa-tree',
        requires: {
          block: {
            'OakPlank': 12
          },
          building: {
            'BuildersWorkshop': 1
          }
        },
        storage: {
          block: {
            'OakTreeWood': 50
          }
        }
      },

      // StonecutterCamp
      'StonecutterCamp': {
        buildingClass: StonecutterCamp,
        label: 'Stonecutter Camp',
        description: 'A camp for stonecutters. Produces stone.',
        icon: 'fas fa-gem',
        requires: {
          block: {
            'OakPlank': 12
          },
          building: {
            'BuildersWorkshop': 1
          }
        },
        storage: {
          block: {
            'Stone': 50
          }
        }
      }

    }
    this._types = []
    for (var type in this._typesDict) {
      if (!this._typesDict.hasOwnProperty(type)) { continue; }
      this._types.push(type)
    }

  }

  getIcon(type) { return this.getType(type).icon }

}
