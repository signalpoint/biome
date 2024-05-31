export default class MkTimer {

  constructor() {

    this.startTime = 0
    this.running = false
    this.elapsed = 0

  }

  start() {
    this.setStartTime(+new Date())
    this.running = true
  }

  stop() {
    this.elapsed = (+new Date()) - this.getStartTime()
    this.running = false
  }

  setStartTime(startTime) {
    this.startTime = startTime
  }

  getStartTime() {
    return this.startTime
  }

  isRunning() {
    return this.running
  }

  reset() {
    this.elapsed = 0
  }

  getElapsedTime() {
    return this.isRunning() ? (+new Date()) - this.getStartTime() : this.elapsed
  }

};
