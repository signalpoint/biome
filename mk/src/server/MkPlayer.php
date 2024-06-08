<?php

namespace MaltKit;

use MaltKit\MkEntity;

class MkPlayer extends MkEntity {

  public $name;
  public $x;
  public $y;
  public $width;
  public $height;
  public $vX;
  public $vY;
  public $vMaxX;
  public $vMaxY;
  public $gravity;
  public $state;

  public function __construct($id = NULL, $bundle = 'default', $data = []) {

    parent::__construct($id, 'player', $bundle);

    if (isset($data['name'])) { $this->name = $data['name']; }
    if (isset($data['x'])) { $this->x = $data['x']; }
    if (isset($data['y'])) { $this->y = $data['y']; }
    if (isset($data['width'])) { $this->width = $data['width']; }
    if (isset($data['height'])) { $this->height = $data['height']; }
    if (isset($data['vX'])) { $this->vX = $data['vX']; }
    if (isset($data['vY'])) { $this->vY = $data['vY']; }
    if (isset($data['vMaxY'])) { $this->vMaxX = $data['vMaxX']; }
    if (isset($data['vMaxY'])) { $this->vMaxY = $data['vMaxY']; }
    if (isset($data['gravity'])) { $this->gravity = $data['gravity']; }
    if (isset($data['state'])) { $this->state = $data['state']; }

  }

}
