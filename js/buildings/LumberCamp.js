class LumberCamp extends Building {

  constructor({
    delta,
    x,
    y,
    width = 64,
    height = 64,
    primaryColor = '#588157',
    secondaryColor = '#3a5a40',
    icon = 'fas fa-tree',
    iconUnicode = '\u{f1bb}'
  }) {

    super({
      delta,
      type: 'LumberCamp',
      x,
      y,
      width,
      height,
      primaryColor,
      secondaryColor,
      icon,
      iconUnicode,
      maxWorkers: 2
    })

  }

  // asbtracts / interfaces

  update() {

  }

  handleVillagerArrival(villager) {

    // find wood to cut down
    let block = d.getBlockFromIndexByType('OakTreeWood')
    if (block) {

      villager.addAction(new ActionGoToBlock({
        delta: block.delta
      }))

      villager.addAction(new ActionMineBlock({
        delta: block.delta
      }))

    }
    else {

      console.log('LumberCamp', 'no wood to cut down')

      // TODO go home, or back to the campground

    }



  }

}
