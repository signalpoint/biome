class DesignerItems extends EntityDict {

  constructor() {

    super({

    })

    this._typesDict = {

      // WOOD AXE
      'WoodAxe': {
        itemClass: WoodAxe,
        label: 'Wood Axe',
        description: 'An axe with a wooden blade.',
        requires: {
          block: {
            'OakPlank': 2
          }
        }
      },

      // STONE AXE
      'StoneAxe': {
        itemClass: StoneAxe,
        label: 'Stone Axe',
        description: 'An axe with a stone blade.',
        requires: {
          block: {
            'OakPlank': 2,
            'Stone': 1
          }
        }
      },

      // WOOD PICK AXE
      'WoodPickAxe': {
        itemClass: WoodPickAxe,
        label: 'Wood PickAxe',
        description: 'A pickaxe with a wooden blade.',
        requires: {
          block: {
            'OakPlank': 2
          }
        }
      },

      // STONE PICK AXE
      'StonePickAxe': {
        itemClass: StonePickAxe,
        label: 'Stone PickAxe',
        description: 'A pickaxe with a stone blade.',
        requires: {
          block: {
            'OakPlank': 2,
            'Stone': 1
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

}
