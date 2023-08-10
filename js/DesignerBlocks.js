class DesignerBlocks extends EntityDict {

  constructor() {

    super({

    })

    this._typesDict = {

      // Bedrock
      'Bedrock': {
        blockClass: Bedrock,
        label: 'Bedrock',
        description: '...',
        craftable: 0
      },

      // BlueberryBush
      'BlueberryBush': {
        blockClass: BlueberryBush,
        label: 'Blueberry Bush',
        description: '...',
        craftable: 0
      },

      // Border
      'Border': {
        blockClass: Border,
        label: 'Border',
        description: '...',
        craftable: 0
      },

      // Daisy
      'Daisy': {
        blockClass: Daisy,
        label: 'Daisy',
        description: '...',
        craftable: 0
      },

      // Grass
      'Grass': {
        blockClass: Grass,
        label: 'Grass',
        description: '...',
        craftable: 0
      },

      // OakPlank
      'OakPlank': {
        blockClass: OakPlank,
        label: 'Oak Plank',
        description: 'Made from oak logs, and great for crafting many things.',
        storedAt: [
          'LumberCamp'
        ],
        requires: {
          block: {
            'OakTreeWood': 1
          }
        },
        output: 4
      },

      // OakTreeLeaves
      'OakTreeLeaves': {
        blockClass: OakTreeLeaves,
        label: 'Oak Tree Leaves',
        description: '...',
        craftable: 0
      },

      // OakTreeWood
      'OakTreeWood': {
        blockClass: OakTreeWood,
        label: 'Oak Tree Wood',
        description: '...',
        craftable: 0,
        storedAt: [
          'LumberCamp'
        ],
        unlocks: {
          block: [
            'OakPlank'
          ]
        }
      },

      // Sand
      'Sand': {
        blockClass: Sand,
        label: 'Sand',
        description: '...',
        craftable: 0
      },

      // Stone
      'Stone': {
        blockClass: Stone,
        label: 'Stone',
        description: '...',
        craftable: 0,
        storedAt: [
          'StonecutterCamp'
        ]
      },

      // Water
      'Water': {
        blockClass: Water,
        label: 'Water',
        description: '...',
        craftable: 0
      }

    }
    this._types = []
    for (var type in this._typesDict) {
      if (!this._typesDict.hasOwnProperty(type)) { continue; }
      this._types.push(type)
    }

  }

}
