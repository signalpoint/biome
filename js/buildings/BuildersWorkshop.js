class BuildersWorkshop extends Building {

  constructor({
    delta,
    width = 64,
    height = 64,
    primaryColor = '#bcb8b1',
    secondaryColor = '#936639',
    icon = 'fas fa-toolbox',
    iconUnicode = '\u{f552}'
  }) {

    super({
      delta,
      type: 'BuildersWorkshop',
      width,
      height,
      primaryColor,
      secondaryColor,
      icon,
      iconUnicode,
      maxWorkers: 2
    })

  }

  update() {

  }

  getPaneContent(op) {
    return ''
  }

}
