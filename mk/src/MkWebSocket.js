export default class MkWebSocket {

  constructor({

    url,
    open,
    close,
    message,
    error

  }) {

    let self = this

    self._socket = null

    self.open = open
    self.close = close
    self.message = message
    self.error = error

    // Create WebSocket connection and set it aside.
    const socket = new WebSocket(url);
    self._socket = socket

    // OPEN
    socket.addEventListener('open', (event) => {
//      console.log('open', event)
      self.open(event)
    });

    // CLOSE
    socket.addEventListener('close', (event) => {
      console.log('close', event)
      self.close(event)
    });

    // MESSAGE
    socket.addEventListener('message', (event) => {
//      console.log('message', event)
      self.message(event)
    });

    // ERROR
    socket.addEventListener('error', (event) => {
      console.log('error', event)
      self.error(event)
    });

//    // Connection opened
//    socket.addEventListener("open", (event) => {
//      console.log('open', event)
//      socket.send("Hello Server!");
//    });
//
//    // Listen for messages
//    socket.addEventListener("message", (event) => {
//      console.log('message', event)
//      console.log("Message from server ", event.data);
//    });

  }

  getSocket() { return this._socket }

  send(msg) { this.getSocket().send(JSON.stringify(msg)) }

//  initEntityData() {
//
//    this.send({
//      op: 'initEntityData',
//      data: mk.getMkEntities().exportData()
//    })
//
//  }

  getGames() {
    this.send({
      op: 'getGames'
    })
  }

  getGame(id) {
    this.send({
      op: 'getGame',
      id
    })
  }

}
