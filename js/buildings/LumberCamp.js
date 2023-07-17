class LumberCamp extends Building {

  constructor({
    delta,
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
