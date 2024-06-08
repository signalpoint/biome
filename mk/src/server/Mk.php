<?php

namespace MaltKit;

use MaltKit\MkServer;

class Mk {

  protected $server;

  protected $games;

  public function __construct() {

    // games
    $this->games = [];

    // server
    $server = new MkServer();
    $this->server = $server;

    // server + mk
    $server->setMk($this);

  }

  public function getServer() { return $this->server; }

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
