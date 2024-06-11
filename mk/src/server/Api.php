<?php

namespace MaltKit;

use MaltKit\MkApi;

class Api extends MkApi{

  public function __construct() {

    parent::__construct();

    // Set JSON as our default header.
    $this->setHeader([
      'Content-Type' => 'application/json',
      'charset' => 'utf-8',
    ]);

  }

}
