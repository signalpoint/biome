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

let _actionStatusMap = {}
_actionStatusMap['new'] = ACTION_STATUS_NEW
_actionStatusMap['pending'] = ACTION_STATUS_PENDING
_actionStatusMap['ready'] = ACTION_STATUS_READY
_actionStatusMap['processing'] = ACTION_STATUS_PROCESSING
_actionStatusMap['postponed'] = ACTION_STATUS_POSTPONED
_actionStatusMap['complete'] = ACTION_STATUS_COMPLETE
_actionStatusMap['failed'] = ACTION_STATUS_FAILED

class Action {

  constructor() {

    this._status = ACTION_STATUS_NEW

    this._timer = new StopWatch()

  }

  getStatus() { return this._status }
  getStatusLabel() { return _actionStatusLabels[this.getStatus()] }
  setStatus(status) {
    this._status = typeof status === 'string' ? _actionStatusMap[status] : status
    // DEBUG
//    let newStatus = typeof status === 'string' ? _actionStatusMap[status] : status
//    let oldStatus = this.getStatusLabel()
//    console.log(`${this.constructor.name}: ${oldStatus} => ${status}`)
//    this._status = newStatus
  }

  getTimer() { return this._timer }

  // abstracts / interfaces

  update() { }

}
