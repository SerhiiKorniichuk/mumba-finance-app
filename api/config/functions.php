<?php
include_once(__DIR__ . "/db_conn.php");

function testConnectionAPI()
{
    $res['status'] = "OK";
    return json_encode($res);
}

function testConnectionAPIDatabase()
{
    $conn = create_conn();
    $qry = "SELECT * FROM transaction_log";
    $res = $conn->query($qry);
    while ($row = $res->fetch_assoc()) {
        foreach ($row as $key => $val) {
            echo $key . " : " . $val . "<br />";
        }
        echo "<br />";
    }
    close_conn($conn);
}

function TEMP()
{
    $conn = create_conn();
    $qry = "INSERT INTO temp (ranndom) VALUES('2');";
    $res = $conn->query($qry);
    close_conn($conn);
}

function fetchExchangeRate()
{
    $coinbaseURL = "https://api.coinbase.com/v2/exchange-rates?currency=USD";
    $handle = curl_init();
    curl_setopt($handle, CURLOPT_URL, $coinbaseURL);
    curl_setopt($handle, CURLOPT_RETURNTRANSFER, true);
    $output = curl_exec($handle);
    curl_close($handle);
    $output = json_decode($output);
    $json_data = array("USD" => "100", "IDR" => $output->data->rates->IDR * 100, "BTC" => substr($output->data->rates->BTC * 100, 0, 5), "ETH" => substr($output->data->rates->ETH * 100, 0, 5));
    return json_encode($json_data);
}

function createCoinBasePayment($currency, $amount, $user)
{
}

// function getExchangeRateJSON()
// {
//     $json_data = array("USD" => "100", "IDR" => fetchExchangeRate('USD', 'IDR') * 100);

//     echo fetchExchangeRate('USD', 'IDR');
//     echo '<br>';
//     echo fetchExchangeRate('USD', 'ETH');
//     echo '<br>';
//     echo fetchExchangeRate('USD', 'BTC');
// }

function tableListTransactions($userId)
{
    $conn = create_conn();
    $qryTransaction = "SELECT * FROM transaction_log WHERE transaction_log.user_id = " . $userId . " ORDER BY initiated_timestamp DESC";
    // echo $qryTransaction;
    $res = $conn->query($qryTransaction);
    $str_res = "";
    while ($row = $res->fetch_assoc()) {
        $qryFromCurrency = "SELECT * FROM currencies_m WHERE currency_id = " . $row['from_currency'];
        $fromCur = $conn->query($qryFromCurrency);
        $fromCur = $fromCur->fetch_assoc();
        $qryToCurrency = "SELECT * FROM currencies_m WHERE currency_id = " . $row['to_currency'];
        $toCur = $conn->query($qryToCurrency);
        $toCur = $toCur->fetch_assoc();
        $str_res .= "<tr>";
        $str_res .= "<td class=\"startCol\">" . $row['transaction_id'] . "<br/><span class=\"txnFont idDate\">" . $row['initiated_timestamp'] . "</span></td>";
        $str_res .= "<td class=\"dateField\">" . $row['initiated_timestamp'] . "</td>";
        $str_res .= "<td>";
        if ($row['transaction_operation'] == "Cr") {
            $str_res .= "-";
        } else {
            $str_res .= "+";
        }
        $str_res .= $row['amount'] . " " . $fromCur['currency_code'] . "<br/><span class=\"txnFont\">";
        if ($row['transaction_operation'] == "Cr") {
            $str_res .= "gave " . $fromCur['currency_name'];
        } else {
            $str_res .= "received Mumba Token";
        }
        $str_res .= "</span></td>";
        $str_res .= "<td>";
        if ($row['transaction_operation'] == "Cr") {
            $str_res .= "+";
        } else {
            $str_res .= "-";
        }
        $str_res .= $row['token_qty'] . " " . $toCur['currency_code'] . "<br/><span class=\"txnFont\">";
        if ($row['transaction_operation'] == "Cr") {
            $str_res .= "gave " . $toCur['currency_name'];
        } else {
            $str_res .= "received Mumba Token";
        }
        $str_res .= "</span></td>";
        switch ($row['transaction_status']) {
            case 0:
                $str_res .= "<td class=\"endCol\">Pending</td>";
                break;
            case 1:
                $str_res .= "<td class=\"endCol\">Success</td>";
                break;
            case 2:
                $str_res .= "<td class=\"endCol\">Cancelled</td>";
                break;
            default:
                break;
        }
        $str_res .= "</tr>";
    }
    return $str_res;
    close_conn($conn);
}

function validateRequestToken($token)
{
    $conn = create_conn();
    $qry = "SELECT userId, firstName, lastName, email, phone FROM users WHERE hash = '" . $token . "'";
    // echo $qry;
    $res = $conn->query($qry);
    if ($res->num_rows > 0) {
        $userId = $res->fetch_assoc();
        $data['userId'] = $userId['userId'];
        $data['userName'] = $userId['firstName'] . ' ' . $userId['lastName'];
        $data['firstName'] = $userId['firstName'];
        $data['lastName'] = $userId['lastName'];
        $data['email'] = $userId['email'];
        $data['mobileNumber'] = $userId['phone'];
        $data['status'] = "OK";
    } else {
        $data['status'] = "ERROR";
    }
    close_conn($conn);
    return $data;
}

function fetchUserBalance($userId)
{
    $conn = create_conn();
    $qryBalance = "SELECT * FROM balance_m WHERE user_id = " . $userId;
    if ($resBalance = $conn->query($qryBalance)) {
        if ($resBalance->num_rows > 0) {
            $balanceData = $resBalance->fetch_assoc();
            $res['balance'] = $balanceData['token_balance'];
            $res['status'] = true;
            $res['message'] = "Success";
            return json_encode($res);
        } else {
            $res['balance'] = 0;
            $res['status'] = false;
            $res['message'] = "User not found!";
            return json_encode($res);
        }
    } else {
        $res['balance'] = 0;
        $res['status'] = false;
        $res['message'] = "Server error!";
        return json_encode($res);
    }
}

function startTransaction($paymentCur, $tokenQty, $amount, $userId, $orderId)
{
    $conn = create_conn();
    $qryStartPayment = "INSERT INTO transaction_log (order_id, user_id, amount, transaction_operation, from_currency, to_currency, token_qty, transaction_status) VALUES ('" . $orderId . "', '" . $userId . "', '" . $amount . "', 'Cr', '" . $paymentCur . "', '1', '" . $tokenQty . "', '0')";
    if ($conn->query($qryStartPayment)) {
        session_start();
        $_SESSION['orderID'] = $orderId;
        if ($_SESSION['transactionID'] = $conn->insert_id) {
            $res['status'] = "TRUE";
        } else {
            $res['status'] = "FALSE";
        }
    } else {
        $res['status'] = "FALSE";
    }
    close_conn($conn);
    return $res;
}

function getTransactionData($orderId)
{
    $conn = create_conn();
    $qryTxnData = "SELECT * FROM transaction_log WHERE order_id = '" . $orderId . "'";
    if ($resTxnData = $conn->query($qryTxnbData)) {
        if ($resTxnData->num_rows > 0) {
            $txnData = $resTxnData->fetch_assoc();
            close_conn($conn);
            return $txnData;
        }
    }
    close_conn($conn);
    return false;
}
function getTransactionStatus($txnId)
{
    $conn = create_conn();
    $qryTxnData = "SELECT transaction_status FROM transaction_log WHERE order_id = '" . $txnId . "'";
    if ($resTxnData = $conn->query($qryTxnData)) {
        if ($resTxnData->num_rows > 0) {
            $txnData = $resTxnData->fetch_assoc();
            close_conn($conn);
            switch ($txnData['transaction_status']) {
                case 0:
                    $resTxn['message'] = "Payment Pending";
                    $resTxn['status'] = 0;
                    close_conn($conn);
                    return $resTxn;
                    break;
                case 1:
                    $resTxn['message'] = "Payment Successfull";
                    $resTxn['status'] = 1;
                    close_conn($conn);
                    return $resTxn;
                    break;
                case 2:
                    $resTxn['message'] = "Payment Not Successfull";
                    $resTxn['status'] = 2;
                    close_conn($conn);
                    return $resTxn;
                    break;

                default:
                    close_conn($conn);
                    return FALSE;
                    break;
            }
            // return $txnData;
        }
    }
}

function updateTransactionStatus($txnID)
{
    $conn = create_conn();
    $qryUpdateTransaction = "UPDATE transaction_log SET transaction_status = 1 WHERE order_id = '" . $txnID . "'";
    // echo $qryUpdateTransaction;
    $conn->query($qryUpdateTransaction);
    if ($conn->affected_rows > 0) {
        $qryGetUserId = "SELECT user_id, token_qty FROM transaction_log WHERE order_id = '" . $txnID . "'";
        echo $qryGetUserId;
        $resUserId = $conn->query($qryGetUserId);
        $userId = $resUserId->fetch_assoc();
        $qryUpdateBalance = "UPDATE `balance_m` SET token_balance = token_balance+" . $userId['token_qty'] . " WHERE user_id = " . $userId['user_id'];
        echo $qryUpdateBalance;
        $conn->query($qryUpdateBalance);
        if ($conn->affected_rows > 0) {
            close_conn($conn);
            return true;
        }
    } else {
        return false;
    }
}

function updateTransactionStatusCoinBase($txnID, $status)
{
    $conn = create_conn();
    $qryUpdateTransaction = "UPDATE transaction_log SET transaction_status = " . $status . " WHERE order_id = '" . $txnID . "'";
    // echo $qryUpdateTransaction;
    $conn->query($qryUpdateTransaction);
    if ($conn->affected_rows > 0) {
        if ($status == 1) {
            $qryGetUserId = "SELECT user_id, token_qty FROM transaction_log WHERE order_id = '" . $txnID . "'";
            echo $qryGetUserId;
            $resUserId = $conn->query($qryGetUserId);
            $userId = $resUserId->fetch_assoc();
            $qryUpdateBalance = "UPDATE `balance_m` SET token_balance = token_balance+" . $userId['token_qty'] . " WHERE user_id = " . $userId['user_id'];
            echo $qryUpdateBalance;
            $conn->query($qryUpdateBalance);
            if ($conn->affected_rows > 0) {
                close_conn($conn);
                return true;
            }
        } else {
            return true;
        }
    } else {
        return false;
    }
}

function fetchDatatablePaymentsAdmin(){
    $conn = create_conn();
    $str_res = "{ \"columns\": [ { \"label\": \"Transaction ID\", \"field\": \"transaction_id\"}, { \"label\": \"Order Id\", \"field\": \"order_id\" }, { \"label\": \"Username\", \"field\": \"username\" }, { \"label\": \"Amount\", \"field\": \"amount\" }, { \"label\": \"Token\", \"field\": \"token_qty\" }, { \"label\": \"Status\", \"field\": \"transaction_status\" }, { \"label\": \"Time\", \"field\": \"initiated_timestamp\" } ], \"rows\": [";
    $qryPaymentsData = "SELECT * FROM transaction_log ORDER BY transaction_id DESC";
    $resPayments = $conn->query($qryPaymentsData);
    while($payment = $resPayments->fetch_assoc()){
        $qryUsername = "SELECT username FROM users WHERE userId = \"".$payment['user_id']."\"";
        $resUsername = $conn->query($qryUsername);
        $username = $resUsername->fetch_assoc();
        $qryCurrency = "SELECT currency_code FROM currencies_m WHERE currency_id = '".$payment['from_currency']."' OR currency_id = '".$payment['to_currency']."'";
        $resCurrency = $conn->query($qryCurrency);
        $currencies = $resCurrency->fetch_all();
        switch ($payment['transaction_status']) {
            case 0:
                $status = "Pending";
                break;
            case 1:
                $status = 'Success';
                break;
            case 2:
                $status = 'Cancelled';
                break;
            default:
                break;
        }
        $str_res .= "{ \"transaction_id\": \"".$payment['transaction_id']."\", \"order_id\": \"".$payment['order_id']."\", \"username\": \"".$username['username']."\", \"amount\": \"".$payment['amount']." ".$currencies[1][0]."\", \"token_qty\": \"".$payment['token_qty']." ".$currencies[0][0]."\", \"transaction_status\": \"".$status."\", \"initiated_timestamp\": \"".$payment['initiated_timestamp']."\" },";
    }
    $str_res = rtrim($str_res, ",");
    $str_res .= "] }";
    return $str_res;
}


/**
 * @param $tokenCount
 * @param $currency
 * @param $exchangeRate
 * @param string $userId
 * @param string $exchangeWay
 */
function setCookiesForGA($tokenCount, $currency, $exchangeRate,  string $userId, string $exchangeWay = 'coinbase')
{

    if($exchangeWay == 'coinbase'){
        $prefix = 'coinbase_';
    }

    if($exchangeWay == 'xendit'){
        $prefix = 'xendit_';
    }

    setcookie($prefix.'currency_value', number_format($exchangeRate, 4, '.', ''), time() + 300);
    setcookie($prefix.'mbm_count', number_format($tokenCount['tokenQty'], 2, '.', ''), time() + 300);
    setcookie($prefix.'howtopay', $currency, time() + 300);
    setcookie($prefix.'eventLabel', $userId, time() + 300);
}
