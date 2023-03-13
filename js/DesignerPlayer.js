class DesignerPlayer {

  constructor() {

    this.playerCoordinatesSpan = document.querySelector('#playerCoordinates')

  }

  refreshCoordinates() {
    this.playerCoordinatesSpan.innerHTML = player.x + ', ' + player.y
  }

}
