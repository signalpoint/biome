let ACTION_STATUS_NEW = 1
let ACTION_STATUS_PENDING = 2
let ACTION_STATUS_READY = 3
let ACTION_STATUS_PROCESSING = 4
let ACTION_STATUS_POSTPONED = 5
let ACTION_STATUS_COMPLETE = 6
let ACTION_STATUS_FAILED = 7

let _actionStatusLabels = {}
_actionStatusLabels[ACTION_STATUS_NEW] = 'new'
_actionStatusLabels[ACTION_STATUS_PENDING] = 'pending'
_actionStatusLabels[ACTION_STATUS_READY] = 'ready'
_actionStatusLabels[ACTION_STATUS_PROCESSING] = 'processing'
_actionStatusLabels[ACTION_STATUS_POSTPONED] = 'postponed'
_actionStatusLabels[ACTION_STATUS_COMPLETE] = 'complete'
_actionStatusLabels[ACTION_STATUS_FAILED] = 'failed'

class Action {

  constructor() {

    this._status = ACTION_STATUS_NEW

    this._timer = new StopWatch()

  }

  getStatus() { return this._status }
  setStatus(status) { this._status = status }

  getStatusLabel() { return _actionStatusLabels[this.getStatus()] }

  getTimer() { return this._timer }

  // abstracts / interfaces

  update() { }

}
