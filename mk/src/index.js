import {keys} from './keys.js';
import {mouse} from './mouse.js';

import Mk from './Mk.js';
import Player from './Player.js';
import MkPlace from './MkPlace.js';

// MK

let game = null
let player = null

// CANVAS & CONTEXT

//var canvas = null
//var c = null

// LOAD

addEventListener('load', function() {

  new Mk({

    canvas: {

      id: 'biome',

      mousemove: function(e) {

    // show mouse x,y coords

//    canvasMouseCoordsBadge.innerHTML = coords.x + ',' + coords.y
//
//    let blockDelta = d.getBlockDelta(coords.x, coords.y)
//
//    if (blockDelta != d.getMouseBlockDelta()) {
//
//      d.setMouseBlockDelta(blockDelta)
//
//    }
//
//    d.isPlaying() ? playerMode.canvasMouseMoveListener(e) : dMode.canvasMouseMoveListener(e)

      },

      mousedown: function(e) {

//        console.log('mousedown')

      },

      mousedownHold: function(e) {

        let name = mk.getMouse().getButton(e.button)

      },

      mouseup: function(e) {

//        console.log('mouseup')

      },

      wheel: function(e) {}

    },

    keyboard: {

      controls: {
        up: 'w',
        down: 's',
        left: 'a',
        right: 'd',
        walk: {
          key: 'Shift',
          code: 'ShiftLeft'
        },
        jump: {
          key: ' ',
          code: 'Space'
        }
      },

      keydown: function(e) {
//        console.log('keydown', e.key, e.code)
      },
      // TODO rename to keyhold
      keydownHold: function(e) {
//        console.log('keydownHold', e.key, e.code)
      },
      keyup: function(e) {
//        console.log('keyup', e.key, e.code)
      }

    },

    mouse: {

      controls: {
        punch: 'left',
        kick: 'right',
        shoot: 'middle'
//        fart: 'backward', // TODO backward/forward are complex to get working
//        cough: 'forward'
      }

    },

    animate,
    update,
    draw,

    gravity: {
      vY: 2,
      vMaxY: 5
    }

  })

  console.log('mk', mk)

//  canvas = mk.getCanvas()
//  window.c = mk.getContext()

  player = new Player({
    name: 'tyler',
    x: 420,
    y: 420,
    width: 32,
    height: 64,
    vMaxX: 15,
    vMaxY: 15,
    state: {
      moving: { // category
        up: false, // state
        down: false, // state
        left: false, // state
        right: false // state
      },
      jumping: false
      // etc...
    }
  })
  console.log('player', player)

  let place = new MkPlace({
    bundle: 'house'
  })
  console.log('place', place)

  mk.play()

//  // Create WebSocket connection.
//  const socket = new WebSocket("ws://localhost:8080");
//
//  // Connection opened
//  socket.addEventListener("open", (event) => {
//    socket.send("Hello Server!");
//  });
//
//  // Listen for messages
//  socket.addEventListener("message", (event) => {
//    console.log("Message from server ", event.data);
//  });

});

function animate() {

  mk.update()

  mk.draw()

  requestAnimationFrame(animate)

}

function update() {

  player.update()

}

function draw() {

  c.clearRect(0, 0, canvas.width, canvas.height)

  player.draw()

}
