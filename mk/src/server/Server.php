<?php

namespace MaltKit;

use Ratchet\ConnectionInterface;

use MaltKit\MkServer;

class Server extends MkServer {

  public function __construct() {

    parent::__construct();

  }

  public function onOpen(ConnectionInterface $conn) {

    // Have the kit perform its default tasks.
    parent::onOpen($conn);

    echo "NEW CONNECTION: ({$conn->resourceId})\n\n-----\n\n";

  }

  public function onMessage(ConnectionInterface $from, $msg) {

//    $clientRecipientCount = count($this->clients) - 1;

    echo $msg . "\n\n-----------------\n\n";

    $json = json_decode($msg);

    switch ($json->op) {

      case 'getGames':
        $from->send(json_encode([
          'op' => $json->op,
          'games' => $this->getMk()->getGames(),
        ]));
        break;

      case 'getGame':
//        echo count($this->getMkServer()->getGames());
//        echo implode(',', array_keys($this->getMkServer()->getGames()));
//        $game = $this->getMkServer()->getGame($json->id);
//        echo $game->id;
//        echo array_keys($this->getGames());
        $game = $this->getMk()->getGame($json->id);
        if (!$game->isInitialized()) {
          $from->send(json_encode([
            'op' => 'initGame',
            'game' => $game,
          ]));
        }
        else {
          $from->send(json_encode([
            'op' => $json->op,
            'game' => $game,
          ]));
        }
        break;

      case 'initGame':
        $game = $this->getMk()->getGame($json->id);
        $game->data = $json->entities;
        $game->initialized = TRUE;
        $from->send(json_encode([
          'op' => 'initializedGame',
          'game' => $game,
        ]));
        break;

      case 'addPlayer':

        $game = $this->getMk()->getGame($json->id);

//        $player = new MkPlayer();
//        echo "MkPlayer\n\n";
//        echo print_r($player, TRUE) . "\n\n";

        $player = new Player([
          'foo' => 'farts',
          'name' => 'tyler',
          'x' => 420,
          'y' => 420,
          'width' => 32,
          'height' => 64,
          'vMaxX' => 15,
          'vMaxY' => 15,
          'state' => [
            'moving' => [ // category
              'up' => false, // state
              'down' => false, // state
              'left' => false, // state
              'right' => false // state
            ],
            'jumping' => false
            // etc...
          ]
        ]);
        echo "Player\n\n";
        echo print_r($player, TRUE) . "\n\n";

        $game->addPlayer($player);

        $from->send(json_encode([
          'op' => $json->op,
          'player' => $player,
        ]));

        break;

    }

  }

}
