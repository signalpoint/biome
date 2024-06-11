<?php

use MaltKit\Mk;
use MaltKit\MkGame;

use MaltKit\Server;

//require dirname(__DIR__) . '/vendor/autoload.php'; // careful, this points to vendor in the biome folder
require 'vendor/autoload.php';

// Create the kit.
$mk = new Mk();

// Create the game.
$metalMelvin = new MkGame([
  'id' => 'metalMelvin',
  'name' => 'Metal Melvin'
]);

// Add the game to the kit.
$mk->addGame($metalMelvin);

// Create the server.
$server = new Server();

// Attach the server and kit to eachother.
$mk->setServer($server);
$server->setMk($mk);

// Run the server.
$mk->runServer();
