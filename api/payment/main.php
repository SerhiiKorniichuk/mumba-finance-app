<?php
include_once(__DIR__ . "/../config/functions.php");
include_once(__DIR__ . "/coinbase/checkout.php");
session_start();


if (isset($_POST)) {
    $userID = validateRequestToken($_POST['accessToken']);
    if ($userID['status'] == "OK") {
        if (isset($_POST['paymentCur']) && isset($_POST['tokenQty'])) {
            $exchangeRate = json_decode(fetchExchangeRate());
            switch ($_POST['paymentCur']) {
                case 2:
                    $currency = 'BTC';
                    $amount = 1.06 * $_POST['tokenQty'] * $exchangeRate->$currency;
                    setCookiesForGA($_POST['tokenQty'], $currency, $amount,$userID['userId'], 'coinbase');
                    $PayURL = initateCoinbase($amount, $userID['userId'], $userID['userName'], $currency);
                    if ($PayURL) {
                        $txnData = startTransaction($_POST['paymentCur'], $_POST['tokenQty'], $amount,
                            $userID['userId'], $PayURL);
                        return header('Location: https://commerce.coinbase.com/charges/' . $PayURL);
                    }
                    break;
                case 3:
                    $currency = 'ETH';
                    $amount = 1.06 * $_POST['tokenQty'] * $exchangeRate->$currency;
                    setCookiesForGA($_POST['tokenQty'], $currency, $amount,$userID['userId'], 'coinbase');
                    $PayURL = initateCoinbase($amount, $userID['userId'], $userID['userName'], $currency);
                    if ($PayURL) {
                        $txnData = startTransaction($_POST['paymentCur'], $_POST['tokenQty'], $amount,
                            $userID['userId'], $PayURL);

                        return header('Location: https://commerce.coinbase.com/charges/' . $PayURL);

                    }
                    break;
                case 4: // XENDIT
                    $amount = 1.05 * $_POST['tokenQty'] * $exchangeRate->IDR;
                    $currency = 'IDR';
                    // $txnData = startTransaction($_POST['paymentCur'], $_POST['tokenQty'], $amount, $userID['userId'], "XNTMBMTXN-" . rand(1000000000, 9999999999));

                    $_SESSION['amount'] = $amount;
                    $_SESSION['firstName'] = $userID['firstName'];
                    $_SESSION['lastName'] = $userID['lastName'];
                    $_SESSION['mobileNumber'] = $userID['mobileNumber'];
                    $_SESSION['email'] = $userID['email'];
                    $_SESSION['userId'] = $userID['userId'];
                    $_SESSION['tokenQty'] = $_POST['tokenQty'];
                    $_SESSION['paymentCur'] = 'USD';
                    setCookiesForGA($_POST['tokenQty'], $currency, $amount, $userID['userId'], 'xendit');

                    return header('Location: https://' . $_SERVER['HTTP_HOST'] . '/api/payment/xendit/make.php');
                    break;
                case 5: // XENDIT
                    $amount = 1.05 * $_POST['tokenQty'] * $exchangeRate->IDR;
                    if (empty($amount)) {
                        return;
                    }
                    $currency = 'IDR';
                    // $txnData = startTransaction($_POST['paymentCur'], $_POST['tokenQty'], $amount, $userID['userId'], "XNTMBMTXN-" . rand(1000000000, 9999999999));
                    $_SESSION['amount'] = $amount;
                    $_SESSION['firstName'] = $userID['firstName'];
                    $_SESSION['lastName'] = $userID['lastName'];
                    $_SESSION['mobileNumber'] = $userID['mobileNumber'];
                    $_SESSION['email'] = $userID['email'];
                    $_SESSION['userId'] = $userID['userId'];
                    setCookiesForGA($_POST['tokenQty'], $currency, $amount, $userID['userId'],  'xendit');
                    
                    return header('Location: https://' . $_SERVER['HTTP_HOST'] . '/api/payment/xendit/make.php');

                    break;
            }

            // var_dump($_POST);
            // echo $userID['userId'];
        }
    }
}

return;
