<?php

function initateCoinbase($amount, $userId, $username, $currency)
{
    require_once __DIR__ . "/config.php";
    $headers = [];
    $post = [
        "name" => "Mumba Token",
        "description" => "Purchasing Mumba Token - Tokenized Real Estate",
        "local_price" => [
            'amount' => $amount,
            'currency' => $currency
        ],
        "redirect_url" => "https://mumba.finance/api/payment/coinbase/getPaymentInfo.php",
        "cancel_url" => "https://mumba.finance/dashboard",
        "pricing_type" => "fixed_price",
        "metadata" => [
            'customer_id' => $userId,
            'name' => $username
        ]
    ];

    $post = json_encode($post);
    $headers[] = "Content-Type: application/json";
    $headers[] = sprintf("X-CC-Api-Key: %s", $API_KEY);
    $headers[] = "X-CC-Version: 2018-03-22";

    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, "https://api.commerce.coinbase.com/charges/");
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $post);
    curl_setopt($ch, CURLOPT_POST, 1);

    $result = curl_exec($ch);
    curl_close($ch);
    $response = json_decode($result);


    return $response->data->code;
}
