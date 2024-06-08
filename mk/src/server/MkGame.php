<?php

namespace MaltKit;

use MaltKit\MkEntities;

class MkGame {

  public $id;
  public $name;
  public $initialized;

  public $_mkEntities;

  public function __construct($options) {

    $this->id = $options['id'];
    $this->name = $options['name'];
    $this->initialized = FALSE;

    // ENTITIES
    // - Instantiate the entities.
    // - Set aside entities.
    $mkEntities = new MkEntities();
    $this->setMkEntities($mkEntities);

  }

  public function isInitialized() { return $this->initialized; }

//  public function getPlayers() { return $this->players; }
//  public function addPlayer($player) {
//    $this->players[$player->id] = $player;
//  }

  // ENTITIES

  // MkEntities

  public function getMkEntities() { return $this->_mkEntities; }
  public function setMkEntities($mkEntities) { $this->_mkEntities = $mkEntities; }

  public function addEntity($type, $entity) {
    $this->getMkEntities()->addEntity($type, $entity);
  }

  public function addPlayer($player) {
    $this->addEntity('player', $player);
  }

}
