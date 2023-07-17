class Campground extends Building {

  constructor({
    delta,
    width = 64,
    height = 64,
    primaryColor = '#bcb8b1',
    secondaryColor = '#463f3a',
    icon = 'fas fa-campground',
    iconUnicode = '\u{f6bb}'
  }) {

    super({
      delta,
      type: 'Campground',
      width,
      height,
      primaryColor,
      secondaryColor,
      icon,
      iconUnicode
    })

  }

  update() {

  }

}
