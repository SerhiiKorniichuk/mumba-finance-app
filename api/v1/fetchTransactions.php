<?php
include_once(__DIR__ . "/../config/functions.php");
$header = apache_request_headers();
if (isset($_POST)) {
    $userID = validateRequestToken($header['access-token']);
    if ($userID['status'] == "OK") {
        // if (isset($_POST['fromCur']) && isset($_POST['toCur'])) {
        //     $fromCur = $_POST['fromCur'];
        //     $toCur = $_POST['toCur'];
        // }
        echo tableListTransactions($userID['userId']);
    }
}
