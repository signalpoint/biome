const BiomeDictionary = {

  _types: {

    'Field': {

      block: {

        'Grass': {
          chance: .97
        },

        'Daisy': {
          chance: .03
        }

      }

    },

    'Forest': {

      block: {

        'Grass': {
          chance: .2
        },

        'OakTreeWood': {
          chance: .8
        }

      }

    },

    'Lake': {

      block: {

        'Grass': {
          chance: .02
        },

        'Sand': {
          chance: .08
        },

        'Water': {
          chance: .9
        }

      }

    }

  },

  getTypes() {
    let types = []
    for (let type in this._types) {
      if (!this._types.hasOwnProperty(type)) { continue }
      types.push(type)
    }
    return types
  },

  getType(type) { return this._types[type] }

}
