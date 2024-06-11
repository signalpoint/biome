<?php

namespace MaltKit;

use MaltKit\Api;

class ApiHelloWorld extends Api{

  public function __construct() {

    parent::__construct();

  }

  public function access() {

    // Anybody can access.

    return TRUE;

  }

  public function GET() {

    $pieces = [
      $this->getVersion(),
      $this->getServiceName(),
      $this->getResourceName(),
    ];

    // TODO support objects; currently throws a 500
//    $pieces = new stdClass();
//    $pieces->a = $this->getVersion();
//    $pieces->b = $this->getServiceName();
//    $pieces->c = $this->getResourceName();

    return $pieces;

  }

}
