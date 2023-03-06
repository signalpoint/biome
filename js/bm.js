// The canvas element.
var canvas = null

// The canvas context.
var c = null

let mouseDown = false

var blockWidth = 64
var blockHeight = 64

// TODO what about 720p and friends?

// 1024x768
var colorMap = {
  o: '#22577a', // ocean
  w: '#90e0ef', // water
  g: '#25a244', // grass
  s: '#ffe6a7' // sand
}

let elevation = 1
let maxElevation = 2

var bigIsland = [
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
];

var mediumIsland = [
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
];

var smallIsland = [
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
];

var openWater = [
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
];

var map = [

  // 4 x 4
  bigIsland,
  mediumIsland,
  smallIsland,
  openWater

  // TODO THIS RENDERS INCORRECTLY, MOVE TO THE UNIVERSE MODEL BELOW
  // 16 x 16
//  smallIsland, openWater,    mediumIsland, openWater,
//  openWater,   bigIsland,    bigIsland,    openWater,
//  openWater,   mediumIsland, smallIsland,  openWater,
//  openWater,   smallIsland,  openWater,    openWater

];

var universe = [

  [ smallIsland, openWater,    mediumIsland, openWater ],
  [ openWater,   bigIsland,    bigIsland,    openWater ],
  [ openWater,   mediumIsland, smallIsland,  openWater ],
  [ openWater,   smallIsland,  openWater,    openWater ]

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

  // MOUSE WHEEL
  canvas.addEventListener('wheel', function(e) {

//    console.log(e);

    // ZOOM OUT
    if (e.deltaY > 0) {

      console.log('----- zooming out ----------');

      if (elevation < maxElevation) {
        elevation++
        drawMap();
      }

      console.log('----- zoomed out ----------');

    }

    // ZOOM IN
    else {

      console.log('----- zooming in ----------');

      if (elevation !== 1) {
        elevation--
        drawMap();
      }

      console.log('----- zoomed in ----------');

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

  console.log('ELEVATION', elevation);

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

//    let z = Math.pow(2, elevation)
    let z = 2;
    for (var i = 1; i < elevation; i++) {
      z = z ** 2;
    }
    let sqrt = Math.sqrt(z)

    console.log('z', z);
    console.log('sqrt', sqrt);

    let modX = 0
    let modY = 0
    let row = 0
    let col = 0

    for (var pane = 0; pane < z; pane++) {

      x = modX
      y = modY

//      let mod = pane % elevation
      let mod = pane % sqrt

      if (mod === 0) { // first col

      }
      else {

        modX = canvas.width / sqrt * mod
        x = modX

        if (mod === sqrt - 1) { // last col

        }

      }

//      if (mod) { // odd... (when elevation is 2)
//
//        modX = canvas.width / elevation
//        x = modX
//
//      }
//      else { // even... (when elevation is 2)
//
//        if (pane) {
//
//          modY = canvas.height / elevation
//          y = modY
//
//        }
//
//      }

      console.log('------------------------');
      console.log('pane', pane);
//      console.log('x, y');
      console.log(x, y);
      console.log('mod', mod);
      console.log('modX', modX);
      console.log('modY', modY);

      var chunk = map[pane];
      for (var i = 0; i < chunk.length; i++) {

        var block = chunk[i];

        // Draw the block on the canvas.
        c.fillStyle = colorMap[block];
//        c.fillRect(x, y, blockWidth / elevation, blockHeight / elevation);
        c.fillRect(x, y, blockWidth / sqrt, blockHeight / sqrt);

        // Move over to get ready to draw the next block.
//        x += (blockWidth / elevation)
        x += (blockWidth / sqrt)

        if (mod) { // odd... (when elevation is 2)

          if (x >= canvas.width) {
            x = modX
//            y += (blockHeight / elevation)
            y += (blockHeight / sqrt)
          }

        }
        else { // even... (when elevation is 2)

//          if (x >= (canvas.width / elevation)) {
          if (x >= (canvas.width / sqrt)) {
            x = 0
//            y += (blockHeight / elevation)
            y += (blockHeight / sqrt)
          }

        }

      }

      console.log('finished pane', pane);

      if (mod === 0) { // first col

        modX = canvas.width / sqrt
        x = modX

        col++

      }
      else {

        modX = canvas.width / sqrt * mod
        x = modX

        col++

        if (mod === sqrt - 1) { // last col

          console.log('/////////////////////////////// ROW');

          row++
          col = 0

          modX = 0
          x = modX

          modY = canvas.height / sqrt
          if (row) { modY *= row; }
          y = modY

        }

      }


//      if (mod === 1) {
//
//        console.log('last pane in row');
//
//        modX = 0
//        x = modX
//
//      }

    }

    col++

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
