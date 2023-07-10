class DesignerPlayer {

  constructor() {

    this.playerCoordinatesBadge = document.querySelector('#playerCoordinatesBadge')
    this.playerVelocityBadge = document.querySelector('#playerVelocityBadge')

  }

  refreshCoordinatesBadge() {
    this.playerCoordinatesBadge.innerHTML = player.x + ', ' + player.y
  }

  refreshVelocityBadge() {
    this.playerVelocityBadge.innerHTML = player.vX + ', ' + player.vY
  }

}
