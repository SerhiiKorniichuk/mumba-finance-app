<?php
use Youshido\GraphQL\Execution\Processor;
use STO\Users\UsersStorage;
use STO\Graphql\Schema;
use STO\Utils\Utils;
use STO\Config;

require_once 'autoload.php';

header("Access-Control-Allow-Origin: *");
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Credential: true');
header('Access-Control-Allow-Headers: X-Requested-With, content-type, access-control-allow-origin, access-control-allow-methods, access-control-allow-headers, Authorization, ACCESS_TOKEN');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    die;
}

date_default_timezone_set(Config::getMainConfig('timeZone'));

$schema = new Schema();
$processor = new Processor($schema);
$container = $processor->getExecutionContext()->getContainer();
$container->set('userId', 0);
$container->set('userType', UsersStorage::TYPE_USER);

$authorization = false;
if (array_key_exists('Authorization', $_SERVER)) {
    $authorization = trim($_SERVER['Authorization']);
}
if (!$authorization) {
    if (array_key_exists('HTTP_AUTHORIZATION', $_SERVER)) {
        $authorization = trim($_SERVER['HTTP_AUTHORIZATION']);
    }
}
if (!$authorization) {
    if (array_key_exists('HTTP_ACCESS_TOKEN', $_SERVER)) {
        $authorization = trim($_SERVER['HTTP_ACCESS_TOKEN']);
    }
}
$access_token = '';
if ($authorization) {
    if (preg_match('/Bearer\s(\S+)/', $authorization, $matches)) {
        $access_token = trim($matches[1]);
    } else {
        $access_token = trim($authorization);
    }
}

$content_type = $_SERVER['CONTENT_TYPE'];

if ($content_type === 'application/json') {
    $raw = file_get_contents('php://input');
    $request = json_decode($raw ?: '[]', true);
    if (array_key_exists('access_token', $request)) {
        $access_token = $request['access_token'];
    }
} elseif (substr($content_type, 0, 19) === 'multipart/form-data') {
    $request = json_decode($_POST['operations'], true);
    $map = json_decode($_POST['map'], true);
    foreach ($map as $index => $loc_row) {
        $file = $_FILES[$index];
        foreach ($loc_row as $loc) {
            $loc = explode('.', $loc);
            Utils::getInstance()->nestedArray($loc, $file, $request);
        }
    }
} else {
    $request = $_GET;
}

if ($access_token) {
    $users = new UsersStorage();
    $user_id = $users->getUserIdByHash($access_token);
    if ($user_id) {
        $user_info = $users->getUser($user_id);
        if ($user_info && !$user_info['deactivated']) {
            $container->set('userId', $user_id);
            $container->set('userType', (int)$user_info['type']);
            $users->updateLastVisit($user_id, time());
        }
    }
}

$processor->processPayload($request['query'], $request['variables'], $request['reducers']);
$response = $processor->getResponseData();

if (defined('GRAPHQL_AS_RESULT')) {
    return $response;
} else {
    header('Content-Type: application/json; charset=UTF-8');
    die(json_encode($response));
}
