<?php

namespace MaltKit;

use MaltKit\MkWsServer;

// TODO rename to Mk?

class MkServer {

  protected $wsServer;

  protected $games;

  public function __construct() {

    // games
    $this->games = [];

    // wsServer
    $wsServer = new MkWsServer();
    $wsServer->setMkServer($this);
    $this->wsServer = $wsServer;

  }

  public function getWsServer() { return $this->wsServer; }

  // SHMOP

  // ...

  // GAMES

  public function addGame($game) {
    $this->games[$game->id] = $game;
  }

  public function getGames() {
    return $this->games;
  }

  public function getGame($id) {
    return $this->games[$id];
  }

}
