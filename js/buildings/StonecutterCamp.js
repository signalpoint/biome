class StonecutterCamp extends Building {

  constructor({
    delta,
    x,
    y,
    width = 64,
    height = 64,
    primaryColor = '#8d99ae',
    secondaryColor = '#2b2d42',
    icon = 'fas fa-gem',
    iconUnicode = '\u{f3a5}'
  }) {

    super({
      delta,
      type: 'StonecutterCamp',
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

    // if the villager brought back any stone...
    if (!villager.belt.isEmpty()) {

      // place it in the camp inventory
      let stone = villager.belt.get(0)
      this.addInventory(stone)
      villager.belt.remove(stone)
      this.getWidget().refresh()
      this.refreshWidget()

      villager.refreshWidget()

      // go to the campground
      let campground = player.getCampground()
      villager.addAction(new ActionGoToBuilding({
        delta: campground.delta
      }))

    }

    // check for stone to mine
    else if (d.indexHasBlockType('Stone')) {

      // load the stone block that we're going to mine
      let block = d.getBlockFromIndexByType('Stone')

      // have the villager...

      // go to the stone
      villager.addAction(new ActionGoToBlock({
        delta: block.delta
      }))

      // mine the stone
      villager.addAction(new ActionMineBlock({
        delta: block.delta
      }))

      // bring the stone back to camp
      villager.addAction(new ActionGoToBuilding({
        delta: villager.getEmployer().delta
      }))

    }
    else {

      console.log('StonecutterCamp', 'no stone to cut down')

      // go to the campground
      let campground = player.getCampground()
      villager.addAction(new ActionGoToBuilding({
        delta: campground.delta
      }))

    }

  }

}
