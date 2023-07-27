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

    // if the villager brought back any wood...
    if (!villager.belt.isEmpty()) {

      // place it in the lumber camp inventory
      let wood = villager.belt.get(0)
      this.addInventory(wood)
      villager.belt.remove(wood)
      this.refreshWidget()

      villager.refreshWidget()

      // go to the campground
      let campground = player.getCampground()
      villager.addAction(new ActionGoToBuilding({
        delta: campground.delta
      }))

    }

    // check for wood to cut down
    else if (d.indexHasBlockType('OakTreeWood')) {

      // load the wood block that we're going to cut down
      let block = d.getBlockFromIndexByType('OakTreeWood')

      // have the villager...

      // go to the wood
      villager.addAction(new ActionGoToBlock({
        delta: block.delta
      }))

      // cut down the wood
      villager.addAction(new ActionMineBlock({
        delta: block.delta
      }))

      // bring the wood back here to the lumber camp
      villager.addAction(new ActionGoToBuilding({
        delta: villager.getEmployer().delta
      }))

    }
    else {

      console.log('LumberCamp', 'no wood to cut down')

      // go to the campground
      let campground = player.getCampground()
      villager.addAction(new ActionGoToBuilding({
        delta: campground.delta
      }))

    }

  }

}
