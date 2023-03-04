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
var map = [
  'w','w','w','w','w','w','w','w','w','w','w','w','w','w','w','w',
  'w','l','l','l','l','l','l','l','l','l','l','l','l','l','l','w',
  'w','l','l','l','l','l','l','l','l','l','l','l','l','l','l','w',
  'w','l','l','l','l','l','l','l','l','l','l','l','l','l','l','w',
  'w','l','l','l','l','l','l','l','l','l','l','l','l','l','l','w',
  'w','l','l','l','l','l','l','l','l','l','l','l','l','l','l','w',
  'w','l','l','l','l','l','l','l','l','l','l','l','l','l','l','w',
  'w','l','l','l','l','l','l','l','l','l','l','l','l','l','l','w',
  'w','l','l','l','l','l','l','l','l','l','l','l','l','l','l','w',
  'w','l','l','l','l','l','l','l','l','l','l','l','l','l','l','w',
  'w','l','l','l','l','l','l','l','l','l','l','l','l','l','l','w',
  'w','w','w','w','w','w','w','w','w','w','w','w','w','w','w','w'
]
var colorMap = {
  w: '#90e0ef',
  l: '#ffe6a7'
}

window.addEventListener('load', function() {

  // Get canvas element.
  canvas = document.getElementById("biome-bloom")

  // 720p
  canvas.width = 1280
  canvas.height = 720

  // 1024*768
  canvas.width = 1024
  canvas.height = 768

  // Get canvas context.
  c = canvas.getContext("2d")

  // Canvas click listener.
  canvas.addEventListener('mousedown', function(e) {
    console.log('mousedown');
    mouseDown = true;
    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    console.log("x: " + x + " y: " + y)
  })

  canvas.addEventListener('wheel', function(e) {
//    console.log(e);
    if (e.deltaY > 0) {
      console.log('zoom out');
    }
    else {
      console.log('zoom in');
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

function drawMap() {
  let x = 0
  let y = 0
  for (var i = 0; i < map.length; i++) {
    var block = map[i]
    c.fillStyle = colorMap[block];
    c.fillRect(x, y, blockWidth, blockHeight);
    x += blockWidth
    if (x >= canvas.width) {
      x = 0
      y += blockHeight
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
