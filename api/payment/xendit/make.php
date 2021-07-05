<?php 
include_once(__DIR__ . "/../../config/functions.php");
session_start();

use Xendit\Xendit;

require 'vendor/autoload.php';


//if (filter_var($_SESSION['debug'], FILTER_SANITIZE_STRING) == true) {
   $secretKey = 'xnd_development_WLT0bZ0I7uMUvXZmCWam6mcHUx0hCing8mdL6QkTm8zdhUevN0Q0hkdT8DuWC';
//} else {
//   $secretKey = 'xnd_production_v5r2579q8qXYbpYViutln2868GUh2MPY9NILOrCJEPGFlI5NzQi5ryLTWS0P';
//}
//var_dump($secretKey);die;
Xendit::setApiKey($secretKey);

$params = [
    'external_id' => 'xnd_' . time(),
    'payer_email' => $_SESSION['email'],
    'description' => 'Purchasing Mumba Token - Tokenized Real Estate',
    'amount' => $_SESSION['amount'],
    'success_redirect_url' => "https://mumba.finance/api/payment/xendit/getPaymentInfo.php"
];

$createInvoice = \Xendit\Invoice::create($params);
$txnData = startTransaction(
    $_SESSION['paymentCur'],
    $_SESSION['tokenQty'],
    $_SESSION['amount'],
    $_SESSION['userId'],
    $createInvoice['id']

);
header('Location: ' . $createInvoice['invoice_url']);
die;

