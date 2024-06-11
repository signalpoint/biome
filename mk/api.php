<?php

use MaltKit\Mk;

//require dirname(__DIR__) . '/vendor/autoload.php';
require 'vendor/autoload.php';

$api = Mk::api();

if ($api->clientHasPermission()) { // 200 OK...

  $api->execute();

}
else { // Not OK...

  // The API service+resource denied access to the client and the response has
  // been set to the error.
  // @see $api->getResponse() for details.

}

$api->respond();
