<?php
require_once 'autoload.php';

use STO\Utils\Utils;
use STO\Utils\Browser;
$browser = new Browser();
$utils = Utils::getInstance();

$config = $utils->executeGraphql('query {
  getConfig {
    siteName
    timeZone
    metaKeywords
    googleAnalytics
    metaDescription
  }
}')['data']['getConfig'];

$config['graphqlEndpoint'] = $utils->getHost().'/graphql';

list($page) = explode('?', $_SERVER['REQUEST_URI']);
if ($page !== '/' && ( $browser->isRobot() || $browser->isFacebook())) {
    $page = $utils->executeGraphql('query ($page: String!) {
  getStaticPage(page: $page) {
    title
    content
    metaTitle
    metaDescription
    metaKeywords
  }
}', ['page' => $page])['data']['getStaticPage'];
    if ($page) {
        $title = $page['metaTitle']?:$config['siteName'];
        $keywords = $page['metaKeywords']?:$config['metaKeywords'];
        $description = $page['metaDescription']?:$config['metaDescription'];
        $content = $page['metaDescription']?:'';
        echo $utils->getHtmlMock($title, $config['googleAnalytics'], $keywords, $description, $content);
        exit;
    }
}

$content = file_get_contents('client/build/index.html');

$params = [];
foreach ($config as $field => $value) {
    $params['{'.$field.'}'] = $value;
}
$content = str_replace(array_keys($params), array_values($params), $content);

echo $content;