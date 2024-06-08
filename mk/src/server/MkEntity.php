<?php

namespace MaltKit;

class MkEntity {

  public $id;
  public $type;
  public $bundle;

  public function __construct($id, $type, $bundle = 'default') {

    $this->id = $id;
    $this->type = $type;
    $this->bundle = $bundle;

  }

}
