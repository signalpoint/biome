var gulp = require('gulp'),
    watch = require('gulp-watch'),
    gp_concat = require('gulp-concat'),
    gp_rename = require('gulp-rename');

var src = [

    // CORE

    './js/StopWatch.js',

    './js/Designer.js',
    './js/DesignerWidget.js',

    './js/core/Game.js',
    './js/core/Biome.js',

    './js/DesignerMenu.js',
    './js/DesignerPlayback.js',
    './js/DesignerMode.js',
    './js/DesignerPlayer.js',
    './js/DesignerCamera.js',
    './js/DesignerStorage.js',

    './js/Entity.js',
    './js/EntityCollection.js',

    './js/EntityDict.js',

    './js/DesignerBlocks.js',
    './js/DesignerItems.js',
    './js/DesignerBuildings.js',

    './js/DesignerInventory.js',
    './js/DesignerBuild.js',

    './js/Inventory.js',
    './js/Belt.js',

    './js/Action.js',
    './js/Order.js',

    './js/Block.js',
    './js/Building.js',
    './js/Item.js',
    './js/Npc.js',

    './js/Player.js',

    './js/BuildingWidget.js',
    './js/NpcWidget.js',

    './js/PlayerMode.js',

    // actions
    './js/actions/*.js',

    // blocks

    './js/blocks/Bedrock.js',
    './js/blocks/BlueberryBush.js',
    './js/blocks/Border.js',
    './js/blocks/Daisy.js',
    './js/blocks/Grass.js',
    './js/blocks/OakPlank.js',
    './js/blocks/OakTreeLeaves.js',
    './js/blocks/OakTreeWood.js',
    './js/blocks/Sand.js',
    './js/blocks/Stone.js',
    './js/blocks/Water.js',

    './js/blocks/Plant.js',
    './js/blocks/OakSapling.js',

    // buildings
    './js/buildings/*.js',

    // items
    './js/items/Axe.js',
      './js/items/WoodAxe.js',
      './js/items/StoneAxe.js',
    './js/items/PickAxe.js',
      './js/items/WoodPickAxe.js',
      './js/items/StonePickAxe.js',

    // npcs
    './js/npcs/*.js',

    // players
    './js/players/*.js',

    // dictionaries
    './js/dictionaries/*.js',

    // biomes
    './js/biomes/*.js'

];

// Minify JavaScript
function minifyJs() {
  console.log('compressing canvas-craft.js...');
  var dAppJs = gulp.src(src)
    .pipe(gp_concat('canvas-craft.js'))
    .pipe(gulp.dest('bin'));
  return dAppJs;
}
gulp.task(minifyJs);

gulp.task('default', function(done) {

  gulp.watch(src, gulp.series('minifyJs'));

  done();

});
