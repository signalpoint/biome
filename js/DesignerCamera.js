class DesignerCamera {

  constructor() {

    this._x = 0
    this._y = 0

  }

  init() {

    // camera: movement
    cameraMoveUpBtn.addEventListener('click', function() { dCamera.move('up') })
    cameraMoveDownBtn.addEventListener('click', function() { dCamera.move('down') })
    cameraMoveLeftBtn.addEventListener('click', function() { dCamera.move('left') })
    cameraMoveRightBtn.addEventListener('click', function() { dCamera.move('right') })

  }

  x() { return this._x }
  y() { return this._y }

  xOffset() { return this.x() * d.getBlockSize() }
  yOffset() { return this.y() * d.getBlockSize() }

  _moveUp() { this._y-- }
  _moveDown() { this._y++ }
  _moveLeft() { this._x-- }
  _moveRight() { this._x++ }

  move(direction) {
    switch (direction) {
      case 'up': if (this.y() > 0) { this._moveUp(); } break;
      case 'down': if (this.y() < d.blocksPerCol() - d.blocksPerScreenCol()) { this._moveDown(); } break;
      case 'left': if (this.x() > 0) { this._moveLeft(); } break;
      case 'right': if (this.x() < d.blocksPerRow() - d.blocksPerScreenRow()) { this._moveRight(); } break;
    }
    this.refreshCoordinatesBadge()
    refresh()
  }

  save() {
    dStorage.save('dCamera', {
      x: this.x(),
      y: this.y()
    })
  }

  load() {
    let cam = dStorage.load('dCamera')
    if (cam) {
      this._x = cam.x
      this._y = cam.y
    }
  }

  refreshCoordinatesBadge() {
    cameraCoordinatesBadge.innerHTML = `${this.x()},${this.y()}`
  }

}
