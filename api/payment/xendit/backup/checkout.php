<?php
include_once(__DIR__ . "/../../config/functions.php");
$requestedData = json_decode($_POST['requestedData']);
$ccData = json_decode($_POST['ccData']);
var_dump($_POST);

use GuzzleHttp\Psr7\Header;
use Xendit\Xendit;

$amount = $requestedData->amount;
$tokenID = $ccData->id;
$authenticationID = $ccData->authentication_id;
$cardCVN = $requestedData->card_cvn;
$currency = $requestedData->currency;
require 'vendor/autoload.php';

Xendit::setApiKey('xnd_development_erKNnKqSZ0novczZN6DaZJk8xod30TfLeLll4OPNIvkdNf0onJfXGcp3mQ6q');

$params = [
    'token_id' => $tokenID,
    'external_id' => 'card_' . time(),
    'authentication_id' => $authenticationID,
    'amount' => $amount,
    'card_cvn' => $cardCVN,
    'currency' => $currency,
    'capture' => false
];

// var_dump($params);

$captureParams = ['amount' => $amount];

try {
    $createCharge = \Xendit\Cards::create($params);
    $id = $createCharge['id'];
    $getCharge = \Xendit\Cards::retrieve($id);
    $captureCharge = \Xendit\Cards::capture($id, $captureParams);
    $getCharge = \Xendit\Cards::retrieve($id);
    if ($getCharge["status"] == "CAPTURED") {
        echo $getCharge["created"]; //   -- Timestamp
        // Payment Received
        echo "Done";
        if (updateTransactionStatus($_POST['txnData'])) {
            Header("Location: http://" . $_SERVER['HTTP_HOST'] . "/checkTxn/status.php?txnID=" . $_POST['txnData']);
        }
    } else {
        // Credit card token has already been used
        echo "Not Done";
    }
} catch (\Throwable $th) {
    echo $th;
}
