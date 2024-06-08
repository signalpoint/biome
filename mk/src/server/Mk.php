<?php

namespace MaltKit;

use Ratchet\Server\IoServer;
use Ratchet\Http\HttpServer;
use Ratchet\WebSocket\WsServer;

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
