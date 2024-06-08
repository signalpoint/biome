<?php

namespace MaltKit;

class MkEntities {

  // entity ids...
  // block: [
  //   'abc123'
  // ],
  // item: [
  //   'def456'
  // ],
  // building: [
  //   'xyz789'
  // ]
  public $_entityIds;

  // entities...
  // {
  //   block: {
  //     abc123: { type: 'Grass', ... }
  //   },
  //   item: {
  //     def456: { type: 'WoodAxe', ... }
  //   },
  //   building: {
  //     xyz789: { type: 'LumberCamp', ... }
  //   },
  //   ...
  // }
  public $_entities;

  // bundles...
  // {
  //   block: {
  //     Grass: [ 'abc123' ]
  //   },
  //   item: {
  //     WoodAxe: [ 'def456' ]
  //   },
  //   building: {
  //     LumberCamp: [ 'xyz789' ]
  //   },
  // }
  public $_entityBundles;

  public function __construct() {

    $this->_nextEntityId = [];
    $this->_entityIds = [];
    $this->_entities = [];
    $this->_entityBundles = [];

  }

  public function addEntity($type, $entity) {

//    echo "addEntity({$type})\n\n";
//    echo print_r($entity, TRUE) . "\n\n";

    // If there isn't an entity id step for this type, initialize it.
    if (!$this->hasNextEntityId($type)) {
      $this->initNextEntityId($type);
    }

    // If an entity id wasn't provided, use the next available id and then
    // increment it.
    if (!isset($entity->id)) {
      $entity->id = $this->getNextEntityId($type);
      $this->incrementNextEntityId($type);
    }

    // If there isn't an entity id index for this type, initialize it.
    if (!$this->hasEntityIdIndex($type)) {
      $this->initEntityIdIndex($type);
    }

    // Add the entity id to its index.
    $this->addEntityId($type, $entity->id);

    // If there isn't an entity index for this type, initialize it.
    if (!$this->hasEntityIndex($type)) {
      $this->initEntityIndex($type);
    }

    // Add the entity to its index.
    $this->addEntityToIndex($type, $entity);

  }



  // next entity id

  public function hasNextEntityId($type) { return isset($this->_nextEntityId[$type]); }
  public function initNextEntityId($type) { $this->_nextEntityId[$type] = 1; }
  public function getNextEntityId($type) { return $this->_nextEntityId[$type]; }
  public function incrementNextEntityId($type) { $this->_nextEntityId[$type]++; }

  // entity id index

  public function hasEntityIdIndex($type) { return isset($this->_entityIds[$type]); }
  public function initEntityIdIndex($type) { $this->_entityIds[$type] = []; }
  public function addEntityId($type, $id) {
    $this->_entityIds[$type][] = $id;
  }
  public function removeEntityId($type, $id) {
    if (($key = array_search($id, $this->_entityIds[$type])) !== FALSE) {
      unset($this->_entityIds[$type][$key]);
    }
  }

  // entity index

  public function hasEntityIndex($type) { return isset($this->_entities[$type]); }
  public function initEntityIndex($type) { $this->_entities[$type] = []; }
  public function addEntityToIndex($type, $entity) {
    $this->_entities[$type][$entity->id] = $entity;
    $this->_addEntityToBundleIndex($type, $entity);
  }
  public function removeEntityFromIndex($entity) {
    if (($key = array_search($entity->id, $this->_entities[$entity->type])) !== FALSE) {
      unset($this->_entities[$entity->type][$key]);
    }
    $this->_removeEntityFromBundleIndex($entity->type, $entity);
  }

  // entity bundle index

  public function _addEntityToBundleIndex($type, $entity) {

//    echo "_addEntityToBundleIndex({$type})\n\n";
//    echo print_r($entity, TRUE) . "\n\n";

    if (!isset($this->_entityBundles[$type])) {
      $this->_entityBundles[$type] = [];
    }
    if (!isset($this->_entityBundles[$type][$entity->bundle])) {
      $this->_entityBundles[$type][$entity->bundle] = [];
    }
    $this->_entityBundles[$type][$entity->bundle][] = $entity->id;

  }
  public function _removeEntityFromBundleIndex($type, $entity) {
    if (($key = array_search($entity->id, $this->_entityBundles[$type][$entity->bundle])) !== FALSE) {
      unset($this->_entityBundles[$type][$entity->bundle][$key]);
    }
  }

}
