<?php

// NOTE: you must restart the server anytime you make changes here

namespace MaltKit;

use Ratchet\MessageComponentInterface;
use Ratchet\ConnectionInterface;

use MaltKit\Player;

class MkWsServer implements MessageComponentInterface {

  protected $mkServer;
  protected $clients;

  public function __construct() {
    $this->clients = new \SplObjectStorage;
  }

  public function getMkServer() { return $this->mkServer; }
  public function setMkServer($mkServer) { $this->mkServer = $mkServer; }

  public function getGames() { return $this->getMkServer()->getGames(); }
  public function getGame($id) { return $this->getGames()[$id]; }

  public function onOpen(ConnectionInterface $conn) {
    // Store the new connection to send messages to later
    $this->clients->attach($conn);

    echo "new connection:: ({$conn->resourceId})\n";
  }

  public function onMessage(ConnectionInterface $from, $msg) {

//    $clientRecipientCount = count($this->clients) - 1;

    echo $msg . "\n\n";
    $json = json_decode($msg);

    switch ($json->op) {

      case 'getGames':
        $from->send(json_encode([
          'op' => $json->op,
          'games' => $this->getMkServer()->getGames(),
        ]));
        break;

      case 'getGame':
        echo "games";
//        echo count($this->getMkServer()->getGames());
//        echo implode(',', array_keys($this->getMkServer()->getGames()));
//        $game = $this->getMkServer()->getGame($json->id);
//        echo $game->id;
//        echo array_keys($this->getGames());
        $game = $this->getGame($json->id);
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
        $game = $this->getGame($json->id);
        $game->data = $json->entities;
        $game->initialized = TRUE;
        $from->send(json_encode([
          'op' => 'initializedGame',
          'game' => $game,
        ]));
        break;

      case 'addPlayer':

        $game = $this->getGame($json->id);

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

      case 'initEntityData':

//        $from->send('OK, I will...');

        foreach ($this->clients as $client) {
          if ($from === $client) { // send to self, skip everybody else...
            $client->send("Ok, I will...");
            break;
          }
        }

        // shmop...

        // Generate a unique key
        // WARNING: must use shmop_delete() to avoid memory leaks!
        $shmopFtokFilename = '/var/www/html/tylerfrankenstein.com/public_html/biome/mk/src/server/MkServer.php';
        $projectIdentifier = 't';
        $key = ftok($shmopFtokFilename, $projectIdentifier);

        echo "<p>key: {$key}</p>";

        // Create shared memory block
        $shm_id = shmop_open($key, "c", 0644, 100);

        if (!$shm_id) {
          die("Couldn't create shared memory segment\n");
        }

//        $data = "Hell.";
//        shmop_write($shm_id, $data, 0); // Write data to shared memory

        shmop_write($shm_id, $json->data, 0); // Write data to shared memory

        echo "Data written to shared memory: $data\n";

        shmop_close($shm_id); // Close shared memory block

        break; // initEntityData

    }

//    $numRecv = count($this->clients) - 1;
//    echo sprintf('Connection %d sending message "%s" to %d other connection%s' . "\n"
//      , $from->resourceId, $msg, $numRecv, $numRecv == 1 ? '' : 's');
//
//    foreach ($this->clients as $client) {
//      if ($from !== $client) { // skip self, send to everybody else...
//        $client->send($msg);
//      }
//    }

  }

  public function onClose(ConnectionInterface $conn) {
    // The connection is closed, remove it, as we can no longer send it messages
    $this->clients->detach($conn);

    echo "Connection {$conn->resourceId} has disconnected\n";

    if (!count($this->clients)) {

      echo "No more clients left\n";

      // TODO
      // - once there are no clients left, then the shared data can be deleted

//      // Generate the same unique key
//      // WARNING: must use shmop_delete() to avoid memory leaks!
//      $shmopFtokFilename = '/var/www/html/tylerfrankenstein.com/public_html/biome/mk/src/server/MkServer.php';
//      $projectIdentifier = 't';
//      $key = ftok($shmopFtokFilename, $projectIdentifier);
//
//      // Delete the shared memory segment once done
//      if (shmop_delete($shm_id)) {
//        echo "<p>Data deleted from shared memory</p>";
//      }
//      else {
//        echo "<p>Data NOT deleted from shared memory</p>";
//      }

    }

  }

  public function onError(ConnectionInterface $conn, \Exception $e) {
    echo "An error has occurred: {$e->getMessage()}\n";

    $conn->close();
  }

}
