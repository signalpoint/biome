let ORDER_STATUS_NEW = 1
let ORDER_STATUS_PENDING = 2
let ORDER_STATUS_READY = 3
let ORDER_STATUS_PROCESSING = 4
let ORDER_STATUS_POSTPONED = 5
let ORDER_STATUS_COMPLETE = 6
let ORDER_STATUS_FAILED = 7

let _orderStatusLabels = {}
_orderStatusLabels[ORDER_STATUS_NEW] = 'new'
_orderStatusLabels[ORDER_STATUS_PENDING] = 'pending'
_orderStatusLabels[ORDER_STATUS_READY] = 'ready'
_orderStatusLabels[ORDER_STATUS_PROCESSING] = 'processing'
_orderStatusLabels[ORDER_STATUS_POSTPONED] = 'postponed'
_orderStatusLabels[ORDER_STATUS_COMPLETE] = 'complete'
_orderStatusLabels[ORDER_STATUS_FAILED] = 'failed'

let _orderStatusMap = {}
_orderStatusMap['new'] = ORDER_STATUS_NEW
_orderStatusMap['pending'] = ORDER_STATUS_PENDING
_orderStatusMap['ready'] = ORDER_STATUS_READY
_orderStatusMap['processing'] = ORDER_STATUS_PROCESSING
_orderStatusMap['postponed'] = ORDER_STATUS_POSTPONED
_orderStatusMap['complete'] = ORDER_STATUS_COMPLETE
_orderStatusMap['failed'] = ORDER_STATUS_FAILED

class Order {

  constructor({
    type = null, // building, item, ...
    data = null
  }) {

    this.id = Date.now()

    this._type = type
    this._data = data

    this._status = ORDER_STATUS_NEW
    this._timer = new StopWatch()

  }

  getStatus() { return this._status }
  getStatusLabel() { return _orderStatusLabels[this.getStatus()] }
  setStatus(status) {
    this._status = typeof status === 'string' ? _orderStatusMap[status] : status
    // DEBUG
//    let newStatus = typeof status === 'string' ? _orderStatusMap[status] : status
//    let oldStatus = this.getStatusLabel()
//    console.log(`${this.constructor.name}: ${oldStatus} => ${status}`)
//    this._status = newStatus
  }

  getTimer() { return this._timer }

  getType() { return this._type }
  getData() { return this._data }

  // abstracts / interfaces

  update() { }

}
