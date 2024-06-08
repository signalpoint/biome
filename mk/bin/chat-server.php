<?php

use MaltKit\Mk;
use MaltKit\MkGame;

require dirname(__DIR__) . '/vendor/autoload.php';

// Create the kit.
$mk = new Mk();

// Create the game.
$metalMelvin = new MkGame([
  'id' => 'metalMelvin',
  'name' => 'Metal Melvin'
]);

// Add the game to the kit.
$mk->addGame($metalMelvin);

// Run the server.
$mk->runServer();
