<?php
require_once __DIR__ . "/vendor/autoload.php";
require_once __DIR__ . "/config.php";
include_once __DIR__ . "/../../config/functions.php";

use CoinbaseCommerce\Webhook;

$secret = $WEBHOOK_SHARED_SECRET;
$headerName = 'X-Cc-Webhook-Signature';
$headers = getallheaders();
$signraturHeader = isset($headers[$headerName]) ? $headers[$headerName] : null;
$payload = trim(file_get_contents('php://input'));

try {
    $event = Webhook::buildEvent($payload, $signraturHeader, $secret);
    http_response_code(200);
    // echo sprintf('Successully verified event with id %s and type %s.', $event->id, $event->type);
    if ($event->type == "charge:created") {
        // echo "Done";
        // Verify Charge    --  BEGINS
        $ch = curl_init();
        // print_r($event->data['code']);
        curl_setopt($ch, CURLOPT_URL, "https://api.commerce.coinbase.com/charges/" . $event->data['code']);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        $headers = array();
        $headers[] = "Content-Type: application/json";
        $headers[] = "X-Cc-Api-Key: " . $API_KEY;
        $headers[] = "X-Cc-Version: 2018-03-22";
        curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
        $result = curl_exec($ch);
        curl_close($ch);
        $response = json_decode($result);
        // var_dump($response);
        if (isset($response->data->created_at)) {
            foreach ($response->data->timeline as $timeline) {
                // echo $timeline->status;
                if ($timeline->status == "CANCELED") {
                    $status = updateTransactionStatusCoinBase($response->data->code, 2);
                    echo $status;
                    break;
                } else if ($timeline->status == "") {
                    $status = updateTransactionStatusCoinBase($response->data->code, 0);
                    echo $status;
                }
            }
            //CONFIRMED
        }
        // Verify Charge    --  ENDS
    }
} catch (\Exception $exception) {
    http_response_code(400);
    echo 'Error occured. ' . $exception->getMessage();
}
