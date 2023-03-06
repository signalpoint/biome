// The canvas element.
var canvas = null

// The canvas context.
var c = null

let mouseDown = false

var blockWidth = 64
var blockHeight = 64

// 720p
//var map = [
//  'w','w','w','w','w','w','w','w','w','w','w','w','w','w','w','w','w','w','w','w',
//  'w','l','l','l','l','l','l','l','l','l','l','l','l','l','l','l','l','l','l','w',
//  'w','l','l','l','l','l','l','l','l','l','l','l','l','l','l','l','l','l','l','w',
//  'w','l','l','l','l','l','l','l','l','l','l','l','l','l','l','l','l','l','l','w',
//  'w','l','l','l','l','l','l','l','l','l','l','l','l','l','l','l','l','l','l','w',
//  'w','l','l','l','l','l','l','l','l','l','l','l','l','l','l','l','l','l','l','w',
//  'w','l','l','l','l','l','l','l','l','l','l','l','l','l','l','l','l','l','l','w',
//  'w','l','l','l','l','l','l','l','l','l','l','l','l','l','l','l','l','l','l','w',
//  'w','l','l','l','l','l','l','l','l','l','l','l','l','l','l','l','l','l','l','w',
//  'w','l','l','l','l','l','l','l','l','l','l','l','l','l','l','l','l','l','l','w',
//  'w','l','l','l','l','l','l','l','l','l','l','l','l','l','l','l','l','l','l','w',
//  'w','w','w','w','w','w','w','w','w','w','w','w','w','w','w','w','w','w','w','w'
//];

// Can we make bigger chunks? i.e. zoom out to level 2, see 4 chunks, instead of 1
// 1024x768
var colorMap = {
  o: '#22577a', // ocean
  w: '#90e0ef', // water
  g: '#25a244', // grass
  s: '#ffe6a7' // sand
}

let elevation = 1
let maxElevation = 2

var map = [

  // Big Island
  [
    'w','w','w','w','w','w','w','w','w','w','w','w','w','w','w','w',
    'w','s','s','s','s','s','s','s','s','s','s','s','s','s','s','w',
    'w','s','s','s','s','s','s','s','s','s','s','s','s','s','s','w',
    'w','s','s','s','s','s','s','s','s','s','s','s','s','s','s','w',
    'w','s','s','s','s','s','s','s','s','s','s','s','s','s','s','w',
    'w','s','s','s','s','s','s','s','s','s','s','s','s','s','s','w',
    'w','s','s','s','s','s','s','s','s','s','s','s','s','s','s','w',
    'w','s','s','s','s','s','s','s','s','s','s','s','s','s','s','w',
    'w','s','s','s','s','s','s','s','s','s','s','s','s','s','s','w',
    'w','s','s','s','s','s','s','s','s','s','s','s','s','s','s','w',
    'w','s','s','s','s','s','s','s','s','s','s','s','s','s','s','w',
    'w','w','w','w','w','w','w','w','w','w','w','w','w','w','w','w'
  ],

  // Medium Island
  [
    'w','w','w','w','w','w','w','w','w','w','w','w','w','w','w','w',
    'w','w','w','w','w','w','w','w','w','w','w','w','w','w','w','w',
    'w','w','s','s','s','s','s','s','s','s','s','s','s','s','w','w',
    'w','w','s','s','s','s','s','s','s','s','s','s','s','s','w','w',
    'w','w','s','s','s','s','s','s','s','s','s','s','s','s','w','w',
    'w','w','s','s','s','s','s','s','s','s','s','s','s','s','w','w',
    'w','w','s','s','s','s','s','s','s','s','s','s','s','s','w','w',
    'w','w','s','s','s','s','s','s','s','s','s','s','s','s','w','w',
    'w','w','s','s','s','s','s','s','s','s','s','s','s','s','w','w',
    'w','w','s','s','s','s','s','s','s','s','s','s','s','s','w','w',
    'w','w','w','w','w','w','w','w','w','w','w','w','w','w','w','w',
    'w','w','w','w','w','w','w','w','w','w','w','w','w','w','w','w'
  ],

  // Small Island
  [
    'w','w','w','w','w','w','w','w','w','w','w','w','w','w','w','w',
    'w','w','w','w','w','w','w','w','w','w','w','w','w','w','w','w',
    'w','w','w','w','w','w','w','w','w','w','w','w','w','w','w','w',
    'w','w','w','s','s','s','s','s','s','s','s','s','s','w','w','w',
    'w','w','w','s','g','g','g','g','g','g','g','g','s','w','w','w',
    'w','w','w','s','g','g','g','g','g','g','g','g','s','w','w','w',
    'w','w','w','s','g','g','g','g','g','g','g','g','s','w','w','w',
    'w','w','w','s','g','g','g','g','g','g','g','g','s','w','w','w',
    'w','w','w','s','s','s','s','s','s','s','s','s','s','w','w','w',
    'w','w','w','w','w','w','w','w','w','w','w','w','w','w','w','w',
    'w','w','w','w','w','w','w','w','w','w','w','w','w','w','w','w',
    'w','w','w','w','w','w','w','w','w','w','w','w','w','w','w','w'
  ],

  // Ocean
  [
    'w','w','w','w','w','w','w','w','w','w','w','w','w','w','w','w',
    'w','w','w','w','w','w','w','w','w','w','w','w','w','w','w','w',
    'w','w','w','w','w','w','w','w','w','w','w','w','w','w','w','w',
    'w','w','w','w','w','w','w','w','w','w','w','w','w','w','w','w',
    'w','w','w','w','w','w','w','w','w','w','w','w','w','w','w','w',
    'w','w','w','w','w','w','w','w','w','w','w','w','w','w','w','w',
    'w','w','w','w','w','w','w','w','w','w','w','w','w','w','w','w',
    'w','w','w','w','w','w','w','w','w','w','w','w','w','w','w','w',
    'w','w','w','w','w','w','w','w','w','w','w','w','w','w','w','w',
    'w','w','w','w','w','w','w','w','w','w','w','w','w','w','w','w',
    'w','w','w','w','w','w','w','w','w','w','w','w','w','w','w','w',
    'w','w','w','w','w','w','w','w','w','w','w','w','w','w','w','w'
  ]

];

window.addEventListener('load', function() {

  // Get canvas element.
  canvas = document.getElementById("biome-bloom")

  // 720p
//  canvas.width = 1280
//  canvas.height = 720

  // 1024*768
  canvas.width = 1024
  canvas.height = 768

  // Get canvas context.
  c = canvas.getContext("2d")

  // Canvas click listener.
  canvas.addEventListener('mousedown', function(e) {
//    console.log('mousedown');
    mouseDown = true;
    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    console.log("x: " + x + " y: " + y)
  })

  canvas.addEventListener('wheel', function(e) {
//    console.log(e);
    if (e.deltaY > 0) {

//      console.log('zoom out');

      if (elevation < maxElevation) {
        elevation++
        drawMap();
      }

    }
    else {

//      console.log('zoom in');

      if (elevation !== 1) {
        elevation--
        drawMap();
      }

    }
    return false;
  }, false);

  canvas.addEventListener("mouseup", function(evt) {
//    console.log('mouseup');
    mouseDown = false;
  });

  canvas.addEventListener("mouseover", function(evt) {
//    console.log('mouseover');
    mouseDown = false;
  });

  canvas.addEventListener("mouseout", function(evt) {
//    console.log('mouseout');
    mouseDown = false;
  });

  canvas.addEventListener("mousemove", function(evt) {
//    console.log('mousemove');
  });

  drawMap()

//  drawGrid()

});

function clearMap() {
  c.clearRect(0, 0, canvas.width, canvas.height);
}

function drawMap() {

  clearMap();

  console.log('elevation', elevation);

  let x = 0
  let y = 0

  if (elevation === 1) {

    var chunk = map[0];
    for (var i = 0; i < chunk.length; i++) {
      var block = chunk[i]
      c.fillStyle = colorMap[block];
      c.fillRect(x, y, blockWidth, blockHeight);
      x += blockWidth
      if (x >= canvas.width) {
        x = 0
        y += blockHeight
      }
    }

  }
  else {

    let z = Math.pow(2, elevation)
    console.log('z', z);

    let modX = 0
    let modY = 0

    for (var pane = 0; pane < z; pane++) {

      x = modX
      y = modY

      let mod = pane % elevation

      if (mod) { // odd... (when elevation is 2)

        modX = canvas.width / elevation
        x = modX

      }
      else { // even... (when elevation is 2)

        if (pane) {

          modY = canvas.height / elevation
          y = modY

        }

      }

      console.log('------------------------');
      console.log('pane', pane);
      console.log('x, y');
      console.log(x, y);
      console.log('mod', mod);
      console.log('modX', modX);
      console.log('modY', modY);

      var chunk = map[pane];

      for (var i = 0; i < chunk.length; i++) {

        var block = chunk[i];

        // Draw the block on the canvas.
        c.fillStyle = colorMap[block];
        c.fillRect(x, y, blockWidth / elevation, blockHeight / elevation);

        // Move over to get ready to draw the next block.
        x += (blockWidth / elevation)

        if (mod) { // odd... (when elevation is 2)

          if (x >= canvas.width) {
            x = modX
            y += (blockHeight / elevation)
          }

        }
        else { // even... (when elevation is 2)

          if (x >= (canvas.width / elevation)) {
            x = 0
            y += (blockHeight / elevation)
          }

        }

      }

      console.log('finished pane', pane);

      if (mod === 1) {

        console.log('last pane in row');

        modX = 0
        x = modX

      }

    }

  }
}

var gridWidth = 64;
var gridHeight = 64;

function drawGrid(){
  var y = 0;
  for (var y = 0; y < canvas.height; y+= gridHeight) {
    for (var x = 0; x <= canvas.width; x += gridWidth) {
      c.beginPath();
      c.rect(x, y, gridWidth, gridHeight);
      c.stroke();
    }
  }
}
