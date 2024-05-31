export default class MkGravity {

  constructor({ // Entities should also have gravity settings independent of the world gravity settings here
      vX = 0, // e.g. could be used to simulate horizontal wind
      vY = 0,  // e.g. could be used to simulate vertical wind
      vMaxX = 0,
      vMaxY = 0
    }) {

      this.vX = vX
      this.vY = vY
      this.vMaxX = vMaxX
      this.vMaxY = vMaxY

  }

//  hasGravityX() { return !!this.getGravityX() }
//  hasGravityY() { return !!this.getGravityY() }
//
//  getGravityX() { return this.vX }
//  getGravityY() { return this.vY }

}
