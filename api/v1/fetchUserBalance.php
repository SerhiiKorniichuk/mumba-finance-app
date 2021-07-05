<?php
include_once(__DIR__ . "/../config/functions.php");
$header = apache_request_headers();
if (isset($_POST)) {
    $userID = validateRequestToken($header['access-token']);
    if ($userID['status'] == "OK") {
        $res = fetchUserBalance($userID['userId']);
        echo $res;
    }
}
