const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {

  entry: {

    // CORE
    index: './src/index.js',
//    context: './src/context.js',
    keys: './src/keys.js',
    mouse: './src/mouse.js',
    utils: './src/utils.js',
    mk: './src/Mk.js',
    mkCanvas: './src/MkCanvas.js',
    mkKeyboard: './src/MkKeyboard.js',
    mkMouse: './src/MkMouse.js',
    mkTimer: './src/MkTimer.js',
    mkEntities: './src/MkEntities.js',
    mkEntity: './src/MkEntity.js',
    mkGravity: './src/MkGravity.js',
    mkPlace: './src/MkPlace.js',
    mkPlayer: './src/MkPlayer.js',

    // CUSTOM

    player: './src/Player.js'

  },

  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true
  },

  mode: 'development',

  plugins: [

    new HtmlWebpackPlugin({
      title: 'Output Management',
      template: "./src/index.html"
    })

  ]

};
