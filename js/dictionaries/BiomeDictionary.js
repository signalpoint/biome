const BiomeDictionary = {

  _types: {

    'Field': {
      block: {
        'Grass': .95,
        'Daisy': .04,
        'OakTreeWood': .01
      }
    },

    'Forest': {
      block: {
        'Grass': .46,
        'OakTreeWood': .48,
        'Daisy': .06
      }
    },

    'Swamp': {
      block: {
        'Grass': .49,
        'Water': .51
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
  getType(type) { return this._types[type] },

  getTypeBlocks(type) { return this._types[type].block },

  getFlubber(type) {

    // @credit thanks Chat GPT

    // Step 1: Create an object with properties and values
    let properties = this.getTypeBlocks(type);

    // Step 2: Calculate cumulative probabilities
    let cumulativeProbability = 0;
    const cumulativeProbabilities = {};
    for (const property in properties) {
      cumulativeProbability += properties[property];
      cumulativeProbabilities[property] = cumulativeProbability;
    }

    // Step 3: Generate a random number between 0 and 1
    const randomValue = Math.random();

    // Step 4: Determine the chosen property based on random number
    let chosenProperty = null;
    for (const property in cumulativeProbabilities) {
      if (randomValue <= cumulativeProbabilities[property]) {
        chosenProperty = property;
        break;
      }
    }

    return chosenProperty

  }

}
