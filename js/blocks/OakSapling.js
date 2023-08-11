class OakSapling extends Plant {

  constructor({
    id = null,
    delta = null,
    health = 100,
    timePlanted = null
  }) {

    super({
      id,
      delta,
      type: 'OakSapling',
      solid: 1,
      health,
      hardness: 15,
      timePlanted,
      daysToGrow: 0.1
    })

  }

//  onPlace() {
//    console.log('oak placed')
//  }

  lifeCycleColors() {
    return [
      '#333d29',
      '#414833',
      '#656d4a',
      '#a4ac86',
      '#c2c5aa',
      '#b6ad90',
      '#a68a64',
      '#936639'
    ]
  }

}
