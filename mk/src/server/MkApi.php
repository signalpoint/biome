<?php

namespace MaltKit;

use MaltKit\Mk;

class MkApi {

  private $version;
  private $serviceName;
  private $resourceName;

  private $requestMethod;
  private $header;
  private $responseCode;
  private $response;

//  public function __construct($serviceName, $resourceName, $version = '1.0') {
  public function __construct() {

    $args = Mk::arg();

    $this->version = $args[0];
    $this->serviceName = $args[1];
    $this->resourceName = $args[2];

    // Populate the request method.
    $this->requestMethod = filter_input(
      INPUT_SERVER,
      'REQUEST_METHOD',
      FILTER_SANITIZE_ENCODED
    );

    $this->header = [];
    $this->responseCode = 200;
    $this->response = NULL;

  }

  // PROPERTIES (getters and setters)

  public function getVersion() { return $this->version; }
  public function setVersion($version) { $this->version = $version; }

  public function getServiceName() { return $this->serviceName; }
  public function setServiceName($name) { $this->serviceName = $name; }

  public function getResourceName() { return $this->resourceName; }
  public function setResourceName($name) { $this->resourceName = $name; }

  public function getRequestMethod() { return $this->requestMethod; }
  public function setRequestMethod($method) { $this->requestMethod = $method; }

  public function getHeader() { return $this->header; }
  public function setHeader($header) { $this->header = $header; }
  public function addHeader($name, $value) { $this->header[$name] = $value; }

  public function getResponseCode() { return $this->responseCode; }
  public function setResponseCode($responseCode) { $this->responseCode = $responseCode; }

  public function getResponse() { return $this->response; }
  public function setResponse($response) { $this->response = $response; }

  public function responseIsArray() { return is_array($this->response); }
  public function responseIsObject() { return is_object($this->response); }

  // HTTP METHODS

  // [version]/[service]/[resource]

  public function GET() {}
  public function POST() {}
  public function PUT() {}
  public function PATCH() {}
  public function DELETE() {}

//  public function add($api) {}

  // METHODS

  public function access() {

    // Default to access denied.
    // Each resource must implement their own access check.
    return FALSE;

    // Or...

//    return [
//      'error' => [
//        'code' => 403,
//        'msg' => Mk::t('Access denied, chump')
//      ],
//    ];

  }

  public function clientHasPermission() {

    $accessGranted = FALSE;

    $access = $this->access();

    if (is_bool($access)) {
      $accessGranted = $access;
      if (!$access) {
        $this->setResponse([
          'error' => [
            'code' => 403,
            'msg' => Mk::t('Access denied, refried')
          ],
        ]);
        $this->setResponseCode(403);
      }
    }
    else if (is_array($access)) {
      if (isset($access['error'])) {
        $this->setResponse($access);
        $this->setResponseCode($access['error']['code']);
      }
      else { $accessGranted = TRUE; }
    }
    else if (is_object($access)) {
      if (isset($access->error)) {
        $this->setResponse($access);
        $this->setResponseCode($access->error['code']);
      }
      else { $accessGranted = TRUE; }
    }

    return $accessGranted;

  }

  public function execute() {

    // Get the response from the API's implementation of the request method and
    // then set aside the response.
    $requestMethod = $this->getRequestMethod();
    $response = $this->{$requestMethod}();
    $this->setResponse($response);

  }

  public function getHeaderString() {
    $items = [];
    foreach ($this->getHeader() as $key => $value) {
      $items[] = "{$key}: $value";
    }
    return implode('; ', $items);
  }

  public function respond() {

    $responseCode = $this->getResponseCode();
    if ($responseCode != 200) { http_response_code($responseCode); }

    header($this->getHeaderString());

//    echo $this->getResponse();
//
//    return;

    echo $this->getHeader()['Content-Type'] == 'application/json' ?
      json_encode($this->getResponse()) :
      $this->getResponse();

  }

}
