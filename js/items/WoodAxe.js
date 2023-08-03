class WoodAxe extends Axe {

  constructor({
    id = null
  }) {

    super({
      id,
      type: 'WoodAxe'
    })

    this.handleColor = '#936639'
    this.bladeColor = '#582f0e'

  }

}
