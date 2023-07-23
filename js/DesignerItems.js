class DesignerItems {

  constructor() {

    this._typesDict = {

      // AXE
      'Axe': {
        itemClass: Axe,
        label: 'Axe',
        description: 'A wooden axe with a stone blade.',
        requires: {
          'OakTreeWood': 1,
          'Stone': 1
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

  getPickupLocation(type) {
    
  }

}
