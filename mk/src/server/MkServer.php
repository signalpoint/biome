<?php

// NOTE: you must restart the server anytime you make changes here

namespace MaltKit;

use Ratchet\MessageComponentInterface;
use Ratchet\ConnectionInterface;

class MkServer implements MessageComponentInterface {

  protected $mk;
  protected $clients;

  public function __construct() {
    $this->clients = new \SplObjectStorage;
  }

  public function getMk() { return $this->mk; }
  public function setMk($mk) { $this->mk = $mk; }

  public function onOpen(ConnectionInterface $conn) {

    // Store the new connection to send messages to later
    $this->clients->attach($conn);

  }

  public function onMessage(ConnectionInterface $from, $msg) {

//    $clientRecipientCount = count($this->clients) - 1;

//    echo $msg . "\n\n";

    $json = json_decode($msg);

    switch ($json->op) {

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
