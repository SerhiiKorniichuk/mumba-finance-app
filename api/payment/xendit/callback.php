<?php

// use Xendit\Xendit;

// require 'vendor/autoload.php';

// Xendit::setApiKey('xnd_development_WLT0bZ0I7uMUvXZmCWam6mcHUx0hCing8mdL6QkTm8zdhUevN0Q0hkdT8DuWC');

// $id = '579c8d61f23fa4ca35e52da4';
// $getInvoice = \Xendit\Invoice::retrieve($id);
// var_dump($getInvoice);

include_once(__DIR__ . "/../../config/functions.php");
$request = file_get_contents('php://input');
$request = json_decode($request, TRUE);
// var_dump($request);
updateTransactionStatus($request['id']);
