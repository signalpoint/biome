class StoneAxe extends Axe {

  constructor({
    id = null
  }) {

    super({
      id,
      type: 'StoneAxe'
    })

    this.handleColor = '#936639'
    this.bladeColor = '#6c757d'

  }

}
