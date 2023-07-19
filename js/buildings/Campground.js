class Campground extends Building {

  constructor({
    delta,
    x,
    y,
    width = 64,
    height = 64,
    primaryColor = '#bcb8b1',
    secondaryColor = '#774936',
    icon = 'fas fa-campground',
    iconUnicode = '\u{f6bb}'
  }) {

    super({
      delta,
      type: 'Campground',
      x,
      y,
      width,
      height,
      primaryColor,
      secondaryColor,
      icon,
      iconUnicode
    })

  }

  // asbtracts / interfaces

  update() {

  }

  handleVillagerArrival(villager) {

//    console.log(`${villager.name} arrived at the campground`)

  }

}
