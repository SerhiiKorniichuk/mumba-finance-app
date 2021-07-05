<?php
$eventLabel = $currencyValue = $howToPay = $mbmCount = null;

if (!empty($_COOKIE['xendit_currency_value'])) {
    $currencyValue = $_COOKIE['xendit_currency_value'];
}

if (!empty($_COOKIE['xendit_mbm_count'])) {
    $mbmCount = $_COOKIE['xendit_mbm_count'];
}

if (!empty($_COOKIE['xendit_howtopay'])) {
    $howToPay = $_COOKIE['xendit_howtopay'];
}

if (!empty($_COOKIE['xendit_eventLabel'])) {
    $eventLabel = $_COOKIE['xendit_eventLabel'];
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
