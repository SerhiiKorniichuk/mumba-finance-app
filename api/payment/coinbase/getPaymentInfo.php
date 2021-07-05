<?php
$mbmCount = null;
$howToPay = null;
$currencyValue = null;
$eventLabel = null;

if (!empty($_COOKIE['coinbase_currency_value'])) {
    $currencyValue = $_COOKIE['coinbase_currency_value'];
}

if (!empty($_COOKIE['coinbase_mbm_count'])) {
    $mbmCount = $_COOKIE['coinbase_mbm_count'];
}

if (!empty($_COOKIE['coinbase_howtopay'])) {
    $howToPay = $_COOKIE['coinbase_howtopay'];
}
if (!empty($_COOKIE['coinbase_eventLabel'])) {
    $eventLabel = $_COOKIE['coinbase_eventLabel'];
}

header(
    sprintf('Location: https://mumba.finance/dashboard/?event=%s&eventCategory=%s&mbm_count=%s&howtopay=%s&currency_value=%s&eventLabel=%s',
        'gtm_event_buytoken',
        'success_buytoken',
        $mbmCount,
        $howToPay,
        $currencyValue,
        $eventLabel
    )
);
exit;
