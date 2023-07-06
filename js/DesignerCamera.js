class DesignerCamera {

  constructor() {

    this._x = 0
    this._y = 0

  }

  x() { return this._x }
  y() { return this._y }

  moveUp() { this._y-- }
  moveDown() { this._y++ }
  moveLeft() { this._x-- }
  moveRight() { this._x++ }

  move(direction) {
    switch (direction) {
      case 'up': if (this.y() > 0) { this.moveUp(); } break;
      case 'down': this.moveDown(); break;
      case 'left': if (this.x() > 0) { this.moveLeft(); } break;
      case 'right': this.moveRight(); break;
    }
    refresh()
  }

}
