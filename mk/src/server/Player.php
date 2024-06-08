<?php

namespace MaltKit;

use MaltKit\MkPlayer;

class Player extends MkPlayer {

  public $foo;

  public function __construct($data = []) {

    parent::__construct(NULL, 'default', $data);

    if (isset($data['foo'])) { $this->foo = $data['foo']; }

  }

}
