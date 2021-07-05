<?php
require_once __DIR__."/config.php";

$chargeCode = "9G3KKL6L";       // Change this

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, "https://api.commerce.coinbase.com/charges/".$chargeCode);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
$headers = array();
$headers[] = "Content-Type: application/json";
$headers[] = "X-Cc-Api-Key: ".$API_KEY;
$headers[] = "X-Cc-Version: 2018-03-22";
curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);

$result = curl_exec($ch);
curl_close ($ch);
$response = json_decode($result);
echo $response->data->timeline[0]->status;