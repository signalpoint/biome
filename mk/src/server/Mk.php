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

  public static function api() {
    $args = self::arg();
    $service = mb_convert_case($args[1], MB_CASE_TITLE, "UTF-8");
    $resource = mb_convert_case($args[2], MB_CASE_TITLE, "UTF-8");
    $apiClassName = "MaltKit\\Api{$service}{$resource}";
    if (!class_exists($apiClassName)) { $apiClassName = "MaltKit\\Api"; }
    return new $apiClassName;
  }

  /**
    * Gets the "q" parameter from the query string.
    * @return type {String}
    */
  public static function q() {
    return filter_input(INPUT_GET, 'q', FILTER_SANITIZE_URL);
  }

  public static function arg($position = NULL) {
    $q = self::q();
    $arg = !!$q ? explode('/', $q) : NULL;
    if ($arg && $position !== NULL) {
      return isset($arg[$position]) ? $arg[$position] : NULL;
    }
    return $arg;
  }

  public static function t($text) { return $text; } // TODO internationalization

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
