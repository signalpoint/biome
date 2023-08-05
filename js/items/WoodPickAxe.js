class WoodPickAxe extends PickAxe {

  constructor({
    id = null
  }) {

    super({
      id,
      type: 'WoodPickAxe'
    })

    this.handleColor = '#936639'
    this.bladeColor = '#6c757d'

  }

}
