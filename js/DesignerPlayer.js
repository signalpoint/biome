class DesignerPlayer {

  constructor() {

    this.playerCoordinatesBadge = document.querySelector('#playerCoordinatesBadge')
    this.playerVelocityBadge = document.querySelector('#playerVelocityBadge')
    this.playerBlocksBadge = document.querySelector('#playerBlocksBadge')
    this.playerBlockCoordinatesBadge = document.querySelector('#playerBlockCoordinatesBadge')
    this.playerBlockDeltaFromPositionBadge = document.querySelector('#playerBlockDeltaFromPositionBadge')

  }

  refreshCoordinatesBadge() {
    this.playerCoordinatesBadge.innerHTML = player.x + ', ' + player.y
  }

  refreshVelocityBadge() {
    this.playerVelocityBadge.innerHTML = player.vX + ', ' + player.vY
  }

  refreshBlocksBadge() {
    this.playerBlocksBadge.innerHTML = player.getBlockDeltasFromPosition().join(', ')
  }

  refreshBlockCoordinatesBadge() {
    let pos = d.getBlockCoords(player.x, player.y)
    this.playerBlockCoordinatesBadge.innerHTML = `${pos.x}, ${pos.y}`
  }

  refreshBlockDeltaFromPositionBadge() {
    let pos = d.getBlockCoords(player.x, player.y)
    this.playerBlockDeltaFromPositionBadge.innerHTML = d.getBlockDeltaFromPos(pos.x, pos.y)
  }

}
