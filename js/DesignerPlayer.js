class DesignerPlayer {

  constructor() {

    this.playerCoordinatesBadge = document.querySelector('#playerCoordinatesBadge')
    this.playerVelocityBadge = document.querySelector('#playerVelocityBadge')
    this.playerBlocksBadge = document.querySelector('#playerBlocksBadge')
    this.playerBlockCoordinatesBadge = document.querySelector('#playerBlockCoordinatesBadge')
    this.playerBlockDeltaFromPositionBadge = document.querySelector('#playerBlockDeltaFromPositionBadge')

  }

  init() {

    // player: movement
    playerMoveUpBtn.addEventListener('mousedown', function() { keys.up.pressed = true })
    playerMoveUpBtn.addEventListener('mouseup', function() { keys.up.pressed = false })
    playerMoveDownBtn.addEventListener('mousedown', function() { keys.down.pressed = true })
    playerMoveDownBtn.addEventListener('mouseup', function() { keys.down.pressed = false })
    playerMoveLeftBtn.addEventListener('mousedown', function() { keys.left.pressed = true })
    playerMoveLeftBtn.addEventListener('mouseup', function() { keys.left.pressed = false })
    playerMoveRightBtn.addEventListener('mousedown', function() { keys.right.pressed = true })
    playerMoveRightBtn.addEventListener('mouseup', function() { keys.right.pressed = false })

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
