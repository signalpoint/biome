class DesignerItems extends EntityDict {

  constructor() {

    super({

    })

    this._typesDict = {

      // AXE
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

      // AXE
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
      }

    }
    this._types = []
    for (var type in this._typesDict) {
      if (!this._typesDict.hasOwnProperty(type)) { continue; }
      this._types.push(type)
    }

  }

}
