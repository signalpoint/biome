class BuildersWorkshop extends Building {

  constructor({
    delta,
    x,
    y,
    width = 64,
    height = 64,
    primaryColor = '#ddca7d',
    secondaryColor = '#b88b4a',
    icon = 'fas fa-toolbox',
    iconUnicode = '\u{f552}'
  }) {

    super({
      delta,
      type: 'BuildersWorkshop',
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

  update() {

  }

  getPaneContent() {
    let html =

      // Pickaxe
      `<div class="card" style="width: 18rem;">
        <div class="card-body">
          <h5 class="card-title">Pickaxe</h5>
          <p class="card-text">...</p>
          <a href="#" class="btn btn-primary" title="Build a Pickaxe">
            Build
            <i class="fas fa-share float-end ms-2"></i>
          </a>
        </div>
      </div>`

    // LumberCamp
//    `<div class="card" style="width: 18rem;">
//        <div class="card-body">
//          <h5 class="card-title">Lumber Camp</h5>
//          <p class="card-text">...</p>
//          <a href="#" class="btn btn-primary" title="Build a Lumber Camp">
//            Build
//            <i class="fas fa-share float-end ms-2"></i>
//          </a>
//        </div>
//      </div>`

    return html
  }

}
