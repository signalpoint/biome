<?php

namespace MaltKit;

use Ratchet\Server\IoServer;
use Ratchet\Http\HttpServer;
use Ratchet\WebSocket\WsServer;

class Mk {

  protected $server;

  protected $games;

  public function __construct() {

    // games
    $this->games = [];

  }

  public function getServer() { return $this->server; }
  public function setServer($server) { $this->server = $server; }

  public function runServer() {

    // Run the server with Ratchet.
    $server = IoServer::factory(
      new HttpServer(
        new WsServer($this->getServer())
      ),
      8080
    );
    $server->run();

  }

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
